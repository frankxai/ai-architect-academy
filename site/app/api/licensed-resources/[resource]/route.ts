import { licensedResourceResponse } from '@/lib/resource-access/handler'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request, context: { params: Promise<{ resource: string }> }) {
  const { resource } = await context.params
  return licensedResourceResponse(request, resource, {
    entitlementUrl: process.env.ACADEMY_ENTITLEMENT_URL,
    entitlementServiceToken: process.env.ACADEMY_ENTITLEMENT_SERVICE_TOKEN,
    contentOrigin: process.env.ACADEMY_CONTENT_ORIGIN,
    contentServiceToken: process.env.ACADEMY_CONTENT_SERVICE_TOKEN,
  })
}
