import { test } from 'node:test'
import assert from 'node:assert/strict'
import type { DemandSignal } from './types'

const baseSignal = (over: Partial<DemandSignal> = {}): DemandSignal => ({
  productId: 'ai-architect-academy',
  email: 'new@example.com',
  name: 'Jane Doe',
  source: '/start#human',
  position: 1,
  createdAt: '2026-11-09T00:00:00.000Z',
  consent: true,
  ...over,
})

// Welcome copy must obey the same doctrine as the site (AGENTS.md): no price,
// date, seat count or countdown while UNGATED. "Cohort 1" is a name, not a count.
const FORBIDDEN = [
  /[€$]/,
  /\b(seats?|spots?|spots? left|price|pricing|discount|deal|offer|deadline|countdown|limited|only \d+)\b/i,
  /\b\d{1,3}\s*(people|members|others|signups|joined)\b/i,
  /\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/i,
  /\b20\d{2}\b/,
]

test('welcome copy is honest: no price, date, seat count or countdown', async () => {
  const { buildWelcomeEmail } = await import('./welcome-email.ts')
  const payload = buildWelcomeEmail(baseSignal())
  const everything = `${payload.subject}\n${payload.text}\n${payload.html}`
  for (const re of FORBIDDEN) assert.ok(!re.test(everything), `welcome email violates doctrine: ${re}`)
})

test('welcome copy links the public syllabus and asks for a reply', async () => {
  const { buildWelcomeEmail } = await import('./welcome-email.ts')
  const payload = buildWelcomeEmail(baseSignal())
  assert.ok(payload.text.includes('https://aiarchitectacademy.com'))
  assert.ok(payload.html.includes('href="https://aiarchitectacademy.com"'))
  assert.ok(/reply to this email/i.test(payload.text))
  assert.ok(payload.subject.includes('AI Architect Academy'))
})

test('greeting uses a safe first name or falls back to hello', async () => {
  const { buildWelcomeEmail } = await import('./welcome-email.ts')
  assert.match(buildWelcomeEmail(baseSignal()).text, /^Hi Jane,/)
  assert.match(buildWelcomeEmail(baseSignal({ name: undefined })).text, /^Hello,/)
  assert.match(buildWelcomeEmail(baseSignal({ name: '<img src=x onerror=alert(1)>' })).text, /^Hello,/)
})

test('sendWelcomeEmail skips silently without RESEND_FROM, without touching the network', async () => {
  const calls: unknown[] = []
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async (...args: unknown[]) => {
    calls.push(args)
    throw new Error('network must not be touched')
  }) as typeof fetch
  const saved = { ...process.env }
  delete process.env.RESEND_FROM
  delete process.env.RESEND_API_KEY
  try {
    const { sendWelcomeEmail } = await import('./welcome-email.ts')
    assert.equal(await sendWelcomeEmail(baseSignal()), false)
    assert.equal(calls.length, 0)
  } finally {
    globalThis.fetch = originalFetch
    Object.assign(process.env, saved)
  }
})

test('sendWelcomeEmail posts one email to Resend and survives a Resend failure', async () => {
  const saved = { ...process.env }
  process.env.RESEND_FROM = 'AI Architect Academy <crew@aiarchitectacademy.com>'
  process.env.RESEND_API_KEY = 'test-key'
  const originalFetch = globalThis.fetch
  const bodies: { url: string; body: Record<string, unknown> }[] = []
  globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
    bodies.push({ url: String(url), body: init?.body ? (JSON.parse(String(init.body)) as Record<string, unknown>) : {} })
    return new Response('{"error":"simulated"}', { status: 500 })
  }) as typeof fetch
  try {
    const { sendWelcomeEmail } = await import('./welcome-email.ts')
    // A failing Resend must resolve false, never throw — the signal is already stored.
    assert.equal(await sendWelcomeEmail(baseSignal()), false)
    assert.equal(bodies.length, 1)
    assert.equal(bodies[0].url, 'https://api.resend.com/emails')
    assert.equal(bodies[0].body?.from, 'AI Architect Academy <crew@aiarchitectacademy.com>')
    assert.equal(bodies[0].body?.to, 'new@example.com')
    assert.equal(bodies[0].body?.reply_to, 'AI Architect Academy <crew@aiarchitectacademy.com>')
    assert.ok(typeof bodies[0].body?.html === 'string' && bodies[0].body?.html.length > 200)
  } finally {
    globalThis.fetch = originalFetch
    Object.assign(process.env, saved)
  }
})

test('handleJoin sends exactly one welcome email per email address', async () => {
  const saved = { ...process.env }
  process.env.KV_REST_API_URL = 'http://kv.test'
  process.env.KV_REST_API_TOKEN = 'test'
  process.env.RESEND_FROM = 'AI Architect Academy <crew@aiarchitectacademy.com>'
  process.env.RESEND_API_KEY = 'test-key'
  delete process.env.RESEND_AUDIENCE_ID

  // Minimal KV over fetch: enough for hget/hset/incr/get.
  const positions = new Map<string, string>()
  let count = 0
  let countKey = ''
  const originalFetch = globalThis.fetch
  const emails: unknown[] = []
  globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
    const target = String(url)
    if (target === 'https://api.resend.com/emails') {
      emails.push(JSON.parse(String(init?.body)))
      return new Response('{"id":"ok"}', { status: 200 })
    }
    const command = JSON.parse(String(init?.body))
    const [op, k, ...rest] = command
    if (op === 'hget') return Response.json({ result: positions.get(`${k}:${rest[0]}`) ?? null })
    if (op === 'hset') return Response.json({ result: 'OK' })
    if (op === 'incr') {
      countKey = k
      count += 1
      return Response.json({ result: count })
    }
    if (op === 'get') return Response.json({ result: k === countKey ? String(count) : null })
    return Response.json({ result: null })
  }) as typeof fetch
  // position persistence for hget needs the hset value; track it:
  const realFetch = globalThis.fetch
  globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
    const target = String(url)
    if (target === 'https://api.resend.com/emails') return realFetch(url, init)
    const command = JSON.parse(String(init?.body))
    if (command[0] === 'hset') positions.set(`${command[1]}:${command[2]}`, String(command[3]))
    return realFetch(url, init)
  }) as typeof fetch

  try {
    const { handleJoin } = await import('./handler.ts')
    const product = {
      id: 'ai-architect-academy',
      stage: 'concept' as const,
      waitlist: { enabled: true, publicCountThreshold: 100, foundingCohort: 50 },
    }
    const body = { email: 'once@example.com', consent: true, source: '/start#human' }
    const req = () => new Request('https://aiarchitectacademy.com/api/waitlist', { method: 'POST', body: JSON.stringify(body) })

    const first = await handleJoin(product, body, req())
    assert.equal(first.status, 200)
    assert.equal(first.body.position, 1)
    const second = await handleJoin(product, body, req())
    assert.equal(second.status, 200)
    assert.equal(second.body.position, 1) // same position, no double count
    assert.equal(emails.length, 1) // exactly one welcome email
    const sent = emails[0] as { to: string }
    assert.equal(sent.to, 'once@example.com')
  } finally {
    globalThis.fetch = originalFetch
    Object.assign(process.env, saved)
  }
})
