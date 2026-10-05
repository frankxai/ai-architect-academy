import { test } from 'node:test'
import assert from 'node:assert/strict'
import { licensedResourceResponse, type ResourceAccessConfig } from './handler.ts'

const now = Date.parse('2026-10-05T16:00:00Z')
const config: ResourceAccessConfig = { entitlementUrl: 'https://license.example/check', entitlementServiceToken: 'issuer-service-secret', contentOrigin: 'https://private.example', contentServiceToken: 'content-service-secret' }
const request = () => new Request('https://aiarchitectacademy.com/api/licensed-resources/architecture-playbooks', { headers: { Authorization: 'Bearer member-token-123456789', 'X-Academy-Tenant': 'tenant-a' } })
const grant = { active: true, productId: 'ai-architect-academy', principalId: 'member-a', principalKind: 'human', tenantId: 'tenant-a', expiresAt: '2026-10-06T16:00:00Z', resourceIds: ['architecture-playbooks'] }

function upstream(value: unknown = grant, content = '# Licensed note') {
  const calls: { url: string; options?: RequestInit }[] = []
  const fetcher = (async (url: string | URL | Request, options?: RequestInit) => {
    calls.push({ url: String(url), options })
    return calls.length === 1 ? Response.json(value) : new Response(content)
  }) as typeof fetch
  return { calls, fetcher }
}

test('disabled service fails closed and never contacts an upstream', async () => {
  const { fetcher, calls } = upstream()
  const res = await licensedResourceResponse(request(), 'architecture-playbooks', {}, fetcher, () => now)
  assert.equal(res.status, 503); assert.equal(calls.length, 0)
})
test('unknown and traversal identifiers never reach an upstream', async () => {
  for (const id of ['../secret', 'architecture-playbooks?url=https://evil.example', 'unknown']) {
    const { fetcher, calls } = upstream()
    assert.equal((await licensedResourceResponse(request(), id, config, fetcher, () => now)).status, 404)
    assert.equal(calls.length, 0)
  }
})
test('rejects missing credentials and invalid tenant', async () => {
  const req = request(); req.headers.delete('authorization')
  assert.equal((await licensedResourceResponse(req, 'architecture-playbooks', config, undefined, () => now)).status, 401)
  const req2 = request(); req2.headers.set('x-academy-tenant', '../tenant-b')
  assert.equal((await licensedResourceResponse(req2, 'architecture-playbooks', config, undefined, () => now)).status, 400)
})
test('trusted endpoint configuration requires HTTPS, no userinfo, query, fragment or content path', async () => {
  for (const invalid of ['http://example.test', 'https://user:secret@example.test', 'https://example.test?token=x', 'https://example.test#x']) {
    const { fetcher, calls } = upstream()
    assert.equal((await licensedResourceResponse(request(), 'architecture-playbooks', { ...config, entitlementUrl: invalid }, fetcher, () => now)).status, 503)
    assert.equal(calls.length, 0)
  }
  assert.equal((await licensedResourceResponse(request(), 'architecture-playbooks', { ...config, contentOrigin: 'https://private.example/path' }, undefined, () => now)).status, 503)
})
test('denies revoked, expired, malformed, wrong tenant/product/scope and unsponsored agent grants', async () => {
  const invalid = [null, [], { ...grant, active: false }, { ...grant, expiresAt: 'garbage' }, { ...grant, expiresAt: '2026-10-04T00:00:00Z' }, { ...grant, tenantId: 'tenant-b' }, { ...grant, productId: 'another-product' }, { ...grant, resourceIds: [] }, { ...grant, principalId: '' }, { ...grant, principalKind: 'model' }, { ...grant, principalKind: ['agent'] }, { ...grant, principalKind: 1 }, { ...grant, principalKind: {} }, { ...grant, principalKind: 'agent' }, { ...grant, principalKind: 'agent', humanSponsorId: 'member-a', humanSponsorActive: false }]
  for (const value of invalid) {
    const { fetcher, calls } = upstream(value)
    assert.equal((await licensedResourceResponse(request(), 'architecture-playbooks', config, fetcher, () => now)).status, 403)
    assert.equal(calls.length, 1)
  }
})
test('active humans and sponsored agents receive private uncached downloads with credentials separated', async () => {
  for (const value of [grant, { ...grant, principalKind: 'agent', humanSponsorId: 'member-a', humanSponsorActive: true }]) {
    const { fetcher, calls } = upstream(value)
    const res = await licensedResourceResponse(request(), 'architecture-playbooks', config, fetcher, () => now)
    assert.equal(res.status, 200); assert.equal(await res.text(), '# Licensed note')
    assert.equal(res.headers.get('cache-control'), 'private, no-store')
    assert.equal(res.headers.get('content-type'), 'text/markdown; charset=utf-8')
    assert.equal(calls[1].url, 'https://private.example/resources/architecture-playbooks.md')
    assert.equal(calls[0].options?.redirect, 'error'); assert.equal(calls[1].options?.redirect, 'error')
    assert.equal(new Headers(calls[0].options?.headers).get('authorization'), 'Bearer issuer-service-secret')
    assert.equal(new Headers(calls[1].options?.headers).get('authorization'), 'Bearer content-service-secret')
    assert.equal(JSON.parse(String(calls[0].options?.body)).accessToken, 'member-token-123456789')
    assert.ok(!JSON.stringify(calls[1]).includes('member-token'))
  }
})
test('revocation is checked on every request without caching a previous grant', async () => {
  let authorized = true
  const fetcher = (async (url: string | URL | Request) => String(url).includes('license.example') ? Response.json({ ...grant, active: authorized }) : new Response('private')) as typeof fetch
  assert.equal((await licensedResourceResponse(request(), 'architecture-playbooks', config, fetcher, () => now)).status, 200)
  authorized = false
  assert.equal((await licensedResourceResponse(request(), 'architecture-playbooks', config, fetcher, () => now)).status, 403)
})
test('upstream failures, oversized bodies and malformed grants reveal no data or credentials', async () => {
  for (const response of [new Response('secret', { status: 500 }), new Response('secret', { status: 403 }), new Response('{broken'), new Response('x'.repeat(16 * 1024 + 1))]) {
    const fetcher = (async () => response) as typeof fetch
    const res = await licensedResourceResponse(request(), 'architecture-playbooks', config, fetcher, () => now)
    assert.ok([403, 503].includes(res.status)); const body = await res.text()
    assert.ok(!body.includes('secret')); assert.ok(!body.includes('member-token'))
  }
  const { fetcher } = upstream(grant, 'x'.repeat(1024 * 1024 + 1))
  assert.equal((await licensedResourceResponse(request(), 'architecture-playbooks', config, fetcher, () => now)).status, 503)
})

test('grant must remain valid after entitlement processing and content retrieval', async () => {
  let time = now
  const nearExpiry = { ...grant, expiresAt: new Date(now + 1000).toISOString() }
  for (const latePhase of ['entitlement', 'content']) {
    time = now
    let calls = 0
    const fetcher = (async () => {
      calls++
      if (calls === 1) {
        if (latePhase === 'entitlement') time += 2000
        return Response.json(nearExpiry)
      }
      time += 2000
      return new Response('licensed text')
    }) as typeof fetch
    const res = await licensedResourceResponse(request(), 'architecture-playbooks', config, fetcher, () => time)
    assert.equal(res.status, 403)
    assert.ok(!(await res.text()).includes('licensed text'))
    assert.equal(calls, latePhase === 'entitlement' ? 1 : 2)
  }
})
