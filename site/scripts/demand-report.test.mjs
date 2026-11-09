// Leak test for the demand report (CAIO review 2026-11-09).
//
// The report must never emit volunteered PII in ANY output mode, including
// error paths. This test seeds the KV store with every PII shape the review
// listed — email, phone number, name, street address, uppercase HTTPS URL —
// through every field an attacker or a careless signup can reach (pain,
// role, source, priceBand, urgency), runs the real CLI in every mode, and
// asserts none of it appears in stdout or stderr.
import test from 'node:test'
import assert from 'node:assert/strict'
import http from 'node:http'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const SCRIPT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'demand-report.mjs')

const PII = [
  'jane.doe@example.com',
  '+31 20 555 0100',
  'Jane Doe',
  'Prinsengracht 123, Amsterdam',
  'HTTPS://EXAMPLE.COM/LEAK',
  '0612345678',
]

// A signal that carries PII in every free-ish field, plus a valid baseline.
const leakySignal = JSON.stringify({
  email: 'jane.doe@example.com',
  role: 'Jane Doe',
  source: 'HTTPS://EXAMPLE.COM/LEAK',
  priceBand: 'Prinsengracht 123, Amsterdam',
  urgency: '+31 20 555 0100',
  pain: 'Reach me at jane.doe@example.com or HTTPS://EXAMPLE.COM/LEAK, Jane Doe, Prinsengracht 123, Amsterdam, 0612345678',
})
const validSignal = JSON.stringify({ role: 'Engineer', source: '/start#human', priceBand: '25-99', urgency: 'now', pain: 'I want to learn agent systems and build a prototype' })
const malformed = '{"email":"jane.doe@example.com","role":"Jane' // truncated JSON

const run = (mode, env) =>
  new Promise((resolve) => {
    const child = spawn(process.execPath, [SCRIPT, ...mode], { env: { ...process.env, ...env } })
    let out = ''
    let err = ''
    child.stdout.on('data', (d) => (out += d))
    child.stderr.on('data', (d) => (err += d))
    child.on('close', (code) => resolve({ code, out, err, all: out + err }))
  })

const withServer = async (handler, fn) => {
  const server = http.createServer(handler)
  await new Promise((r) => server.listen(0, '127.0.0.1', r))
  const { port } = server.address()
  try {
    return await fn({ KV_REST_API_URL: `http://127.0.0.1:${port}`, KV_REST_API_TOKEN: 'test' })
  } finally {
    await new Promise((r) => server.close(r))
  }
}

const kvHandler = (behavior) => (req, res) => {
  let body = ''
  req.on('data', (c) => (body += c))
  req.on('end', () => {
    const command = JSON.parse(body)
    if (behavior === 'fail') {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'leaked jane.doe@example.com HTTPS://EXAMPLE.COM/LEAK' }))
      return
    }
    res.writeHead(200, { 'Content-Type': 'application/json' })
    if (command[0] === 'hgetall') {
      res.end(JSON.stringify({ result: ['a', leakySignal, 'b', validSignal, 'c', malformed] }))
    } else {
      res.end(JSON.stringify({ result: '2' }))
    }
  })
}

test('no PII in text, --json or --csv mode, and the report still aggregates', async () => {
  await withServer(kvHandler(), async (env) => {
    for (const mode of [[], ['--json'], ['--csv']]) {
      const { code, all } = await run(mode, env)
      assert.equal(code, 0, `mode ${mode.join(' ')} should succeed`)
      for (const pii of PII) assert.ok(!all.includes(pii), `mode ${mode.join(' ')} leaked: ${pii}`)
      assert.ok(!all.includes('example.com'), `mode ${mode.join(' ')} leaked email domain`)
    }
    const { out } = await run(['--json'], env)
    const report = JSON.parse(out)
    assert.equal(report.total, 2)
    assert.equal(report.invalidEntries, 1) // malformed entry counted, not echoed
    assert.deepEqual(report.roles, { Engineer: 1, other: 1 }) // 'Jane Doe' → other, not printed
    assert.deepEqual(report.sources, { '/start#human': 1, other: 1 })
    assert.deepEqual(report.urgency, { now: 1, other: 1 })
    assert.deepEqual(report.priceBands, { '25-99': 1, other: 1 })
    assert.deepEqual(report.pains, { learning: 1, other: 1 }) // counts only, never text
  })
})

test('a failing KV response produces a constant error with no PII', async () => {
  await withServer(kvHandler('fail'), async (env) => {
    const { code, all, err } = await run([], env)
    assert.equal(code, 1)
    assert.match(err, /Demand report failed: could not read the waitlist store\./)
    for (const pii of PII) assert.ok(!all.includes(pii), `error path leaked: ${pii}`)
    assert.ok(!all.includes('500'), 'HTTP status must not appear')
  })
})

test('unknown flags are rejected', async () => {
  await withServer(kvHandler(), async (env) => {
    const { code, err } = await run(['--debug'], env)
    assert.equal(code, 2)
    assert.match(err, /Unknown flag/)
  })
})
