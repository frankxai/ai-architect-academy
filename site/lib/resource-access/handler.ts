/** Licensed data crosses this boundary only after a fresh server-side entitlement check.
 * The authorizer owns authentication, payment state and revocation. No model decides access.
 */
import { licensedResourceIds } from '../academy-graph/experience.ts'

export interface ResourceAccessConfig {
  entitlementUrl?: string
  entitlementServiceToken?: string
  contentOrigin?: string
  contentServiceToken?: string
}

const headers = { 'Cache-Control': 'private, no-store', 'Vary': 'Authorization, X-Academy-Tenant', 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY' }
const failure = (status: number, code: string) => Response.json({ error: code }, { status, headers })

function safeEndpoint(value: string | undefined): URL | null {
  try {
    const url = new URL(value ?? '')
    if (url.protocol !== 'https:' || url.username || url.password || url.hash || url.search) return null
    return url
  } catch { return null }
}

async function boundedText(response: Response, maxBytes: number): Promise<string> {
  const length = response.headers.get('content-length')
  if (length && (!/^\d+$/.test(length) || Number(length) > maxBytes)) throw new Error('body limit')
  const reader = response.body?.getReader()
  if (!reader) throw new Error('missing body')
  const chunks: Uint8Array[] = []
  let count = 0
  try {
    while (true) {
      const result = await reader.read()
      if (result.done) break
      count += result.value.byteLength
      if (count > maxBytes) throw new Error('body limit')
      chunks.push(result.value)
    }
  } finally { await reader.cancel().catch(() => {}) }
  const joined = new Uint8Array(count)
  let offset = 0
  for (const chunk of chunks) { joined.set(chunk, offset); offset += chunk.byteLength }
  return new TextDecoder('utf-8', { fatal: true }).decode(joined)
}

export async function licensedResourceResponse(
  request: Request, resource: string, config: ResourceAccessConfig,
  fetcher: typeof fetch = fetch, clock: () => number = Date.now,
): Promise<Response> {
  if (!(licensedResourceIds as readonly string[]).includes(resource)) return failure(404, 'resource_not_found')
  const authorizer = safeEndpoint(config.entitlementUrl)
  const origin = safeEndpoint(config.contentOrigin)
  if (!authorizer || !origin || origin.pathname !== '/' || !config.entitlementServiceToken || !config.contentServiceToken) {
    return failure(503, 'licensed_access_not_available')
  }
  const auth = request.headers.get('authorization')
  const tenant = request.headers.get('x-academy-tenant')
  if (!auth || !/^Bearer [A-Za-z0-9._~-]{16,4096}$/.test(auth)) return failure(401, 'authentication_required')
  if (!tenant || !/^[A-Za-z0-9_-]{1,128}$/.test(tenant)) return failure(400, 'tenant_required')
  try {
    const result = await fetcher(authorizer, {
      method: 'POST', redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(5000),
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.entitlementServiceToken}` },
      body: JSON.stringify({ productId: 'ai-architect-academy', resourceId: resource, action: 'read', tenantId: tenant, accessToken: auth.slice(7) }),
    })
    if (result.status === 401 || result.status === 403) return failure(403, 'access_denied')
    if (!result.ok) return failure(503, 'entitlement_service_unavailable')
    const grant: unknown = JSON.parse(await boundedText(result, 16 * 1024))
    if (!grant || typeof grant !== 'object' || Array.isArray(grant)) return failure(403, 'access_denied')
    const g = grant as Record<string, unknown>
    const expiry = typeof g.expiresAt === 'string' ? Date.parse(g.expiresAt) : NaN
    if (g.active !== true || g.productId !== 'ai-architect-academy' || g.tenantId !== tenant ||
        typeof g.principalId !== 'string' || !g.principalId.trim() ||
        (g.principalKind !== 'human' && g.principalKind !== 'agent') ||
        (g.principalKind === 'agent' && (g.humanSponsorActive !== true || typeof g.humanSponsorId !== 'string' || !g.humanSponsorId.trim())) ||
        !Number.isFinite(expiry) || expiry <= clock() ||
        !Array.isArray(g.resourceIds) || !g.resourceIds.includes(resource)) return failure(403, 'access_denied')
    // The caller controls neither the upstream host nor a path. Redirects never forward service credentials.
    const document = await fetcher(new URL(`/resources/${resource}.md`, origin), {
      redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(5000),
      headers: { Authorization: `Bearer ${config.contentServiceToken}`, 'X-Academy-Tenant': tenant },
    })
    if (!document.ok) return failure(503, 'resource_service_unavailable')
    const text = await boundedText(document, 1024 * 1024)
    if (expiry <= clock()) return failure(403, 'access_denied')
    return new Response(text, { headers: { ...headers, 'Content-Type': 'text/markdown; charset=utf-8', 'Content-Disposition': `attachment; filename="${resource}.md"` } })
  } catch { return failure(503, 'resource_service_unavailable') }
}
