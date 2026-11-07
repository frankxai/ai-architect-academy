// Weekly demand report: what the waitlist actually said.
//
// Reads every stored DemandSignal from the project KV (Upstash REST protocol,
// same as lib/demand-capture/store.ts) and prints the aggregates that decide
// curriculum order and pricing: roles, price bands, urgency, sources, pains.
//
// Usage:  KV_REST_API_URL=... KV_REST_API_TOKEN=... node scripts/demand-report.mjs
// Add --json for machine output (CI, dashboards).
//
// No secrets are printed: emails are counted, never listed. Free-text pains
// are redacted before printing (privacy hold 2026-11-07): emails, URLs, phone
// numbers and long digit runs are stripped, and the remainder is truncated —
// volunteered PII must not reach a terminal or a CI log.

const REDACTIONS = [
  { re: /[^\s<>()[\]{}",;]+@[^\s<>()[\]{}",;]+/g, with: '[email]' },
  { re: /https?:\/\/\S+/g, with: '[url]' },
  { re: /\+?\d[\d\s()./-]{6,}\d/g, with: '[number]' },
]

const redact = (text) => {
  let out = String(text ?? '')
  for (const { re, with: replacement } of REDACTIONS) out = out.replace(re, replacement)
  return out.length > 100 ? out.slice(0, 100).replace(/\s+\S*$/, '') + '…' : out
}

const productId = 'ai-architect-academy'
// Same resolution order as lib/demand-capture/store.ts: the Vercel KV
// marketplace product injects KV_REST_API_*; the legacy Upstash integration
// injects UPSTASH_REDIS_REST_*. Same REST protocol either way.
const env = (...names) => {
  for (const name of names) {
    const value = process.env[name]
    if (value) return value
  }
  console.error(`Missing ${names.join(' or ')}. Set the Upstash REST env vars and retry.`)
  process.exit(1)
}
const KV_URL = env('KV_REST_API_URL', 'UPSTASH_REDIS_REST_URL')
const KV_TOKEN = env('KV_REST_API_TOKEN', 'UPSTASH_REDIS_REST_TOKEN')

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
  // Pains are the only free-text field; redacted in every output mode.
  pains: signals.filter((s) => s.pain).map((s) => redact(s.pain)),
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
  console.log(`  pains (${report.pains.length}, redacted):`)
  for (const pain of report.pains) console.log(`    - ${pain}`)
}
