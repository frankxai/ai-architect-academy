// Weekly demand report: what the waitlist actually said.
//
// Reads every stored DemandSignal from the project KV (Upstash REST protocol,
// same as lib/demand-capture/store.ts) and prints the aggregates that decide
// curriculum order and pricing: roles, price bands, urgency, sources, pains.
//
// Usage:  KV_REST_API_URL=... KV_REST_API_TOKEN=... node scripts/demand-report.mjs
// Add --json for machine output (CI, dashboards).
//
// No secrets are printed: emails are counted, never listed.

const productId = 'ai-architect-academy'
const env = (name) => {
  const value = process.env[name]
  if (!value) {
    console.error(`Missing ${name}. Set the Upstash REST env vars and retry.`)
    process.exit(1)
  }
  return value
}
const KV_URL = env('KV_REST_API_URL')
const KV_TOKEN = env('KV_REST_API_TOKEN')

async function kv(command) {
  const response = await fetch(KV_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  })
  if (!response.ok) throw new Error(`KV ${response.status}: ${await response.text()}`)
  return (await response.json()).result
}

const tally = (rows, key) => {
  const counts = {}
  for (const row of rows) {
    const value = row[key] || '(not answered)'
    counts[value] = (counts[value] ?? 0) + 1
  }
  return Object.fromEntries(Object.entries(counts).sort((a, b) => b[1] - a[1]))
}

const asJson = process.argv.includes('--json')

const raw = await kv(['hgetall', `waitlist:${productId}:signals`])
const values = Array.isArray(raw) ? raw.filter((_, i) => i % 2 === 1) : Object.values(raw ?? {})
const signals = values.map((v) => JSON.parse(String(v)))
const count = await kv(['get', `waitlist:${productId}:count`])

const report = {
  measuredAt: new Date().toISOString(),
  productId,
  total: Number(count ?? signals.length),
  answeredRefine: signals.filter((s) => s.role || s.priceBand || s.urgency || s.pain).length,
  roles: tally(signals, 'role'),
  priceBands: tally(signals, 'priceBand'),
  urgency: tally(signals, 'urgency'),
  sources: tally(signals, 'source'),
  pains: signals.filter((s) => s.pain).map((s) => s.pain),
}

if (asJson) {
  console.log(JSON.stringify(report, null, 2))
} else {
  console.log(`Demand report — ${report.productId} (${report.measuredAt})`)
  console.log(`  total signups: ${report.total} (${report.answeredRefine} answered the refine step)`)
  for (const [label, key] of [['roles', 'roles'], ['price bands', 'priceBands'], ['urgency', 'urgency'], ['sources', 'sources']]) {
    const entries = Object.entries(report[key])
    console.log(`  ${label}: ${entries.length ? entries.map(([k, v]) => `${k} ×${v}`).join(', ') : 'no answers yet'}`)
  }
  console.log(`  pains (${report.pains.length}):`)
  for (const pain of report.pains) console.log(`    - ${pain}`)
}
