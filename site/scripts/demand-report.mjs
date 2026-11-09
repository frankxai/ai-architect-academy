// Weekly demand report: what the waitlist actually said.
//
// Reads every stored DemandSignal from the project KV (Upstash REST protocol,
// same as lib/demand-capture/store.ts) and prints the aggregates that decide
// curriculum order and pricing: roles, price bands, urgency, sources, pain
// buckets.
//
// Usage:  KV_REST_API_URL=... KV_REST_API_TOKEN=... node scripts/demand-report.mjs
//         [--json | --csv]
//
// Privacy design (CAIO review 2026-11-09): allow-list, never redact.
//   - Free-text pains are NEVER emitted. They are mapped to a closed bucket
//     enum by keyword and printed as counts only.
//   - role / priceBand / urgency / source are tallied against closed enums
//     (the same vocabulary the form itself offers). Anything outside an enum
//     lands in a fixed 'other' bucket — raw values are never printed, so a
//     crafted API POST cannot smuggle contact details into a terminal or CI
//     log through any output mode.
//   - Errors are constant messages: no HTTP status, response body, or stored
//     value ever reaches the output.

// Closed enums — source of truth is lib/demand-capture/questions.ts for this
// product's vocabulary. Keep in sync when the form changes.
const productId = 'ai-architect-academy'
const ROLES = ['Engineer', 'Architect / staff+', 'Eng manager', 'Consultant', 'Founder', 'Career switcher']
const PRICE_BANDS = ['free-only', 'under-25', '25-99', '100-299', '300-999', 'over-1000', 'company-pays']
const URGENCY = ['now', 'this-quarter', 'exploring']
const SOURCES = ['/', '/start#human', '/start#agent']

// Pain buckets: keyword match on the volunteer's own words, counts only.
// Keywords are ours, never theirs — no pain text is emitted in any mode.
const PAIN_BUCKETS = [
  { bucket: 'learning', keywords: ['learn', 'course', 'training', 'study', 'skill', 'upskill'] },
  { bucket: 'career', keywords: ['job', 'career', 'hire', 'interview', 'switch', 'promot'] },
  { bucket: 'team', keywords: ['team', 'company', 'colleag', 'staff', 'organi'] },
  { bucket: 'build', keywords: ['build', 'create', 'make', 'ship', 'prototype', 'mvp'] },
  { bucket: 'ai', keywords: [' ai', 'agent', 'llm', 'model', 'prompt', 'automation'] },
  { bucket: 'cost', keywords: ['cost', 'price', 'pay', 'budget', 'afford'] },
]
const bucketForPain = (text) => {
  const t = String(text ?? '').toLowerCase()
  for (const { bucket, keywords } of PAIN_BUCKETS) {
    if (keywords.some((k) => t.includes(k))) return bucket
  }
  return 'other'
}

const NOT_ANSWERED = 'not-answered'
const OTHER = 'other'

// Tally against a closed enum: only enum members (or the fixed fallback
// buckets) can ever become output keys.
const tally = (rows, key, allowed) => {
  const counts = {}
  for (const row of rows) {
    const raw = row[key]
    const value = allowed.includes(raw) ? raw : raw == null || raw === '' ? NOT_ANSWERED : OTHER
    counts[value] = (counts[value] ?? 0) + 1
  }
  return Object.fromEntries(Object.entries(counts).sort((a, b) => b[1] - a[1]))
}

// Pains: bucket, count — the text itself never leaves this process.
const painBuckets = (rows) => {
  const counts = {}
  for (const row of rows) {
    if (row.pain == null || row.pain === '') continue
    const bucket = bucketForPain(row.pain)
    counts[bucket] = (counts[bucket] ?? 0) + 1
  }
  return Object.fromEntries(Object.entries(counts).sort((a, b) => b[1] - a[1]))
}

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
  let response
  try {
    response = await fetch(KV_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(command),
    })
  } catch {
    throw new Error('KV request failed')
  }
  if (!response.ok) throw new Error('KV request failed')
  const body = await response.json().catch(() => null)
  if (body == null) throw new Error('KV request failed')
  return body.result
}

// Flags: exactly one output mode, unknown flags rejected.
const USAGE = 'Usage: node scripts/demand-report.mjs [--json | --csv]'
const args = process.argv.slice(2)
const mode = args.includes('--json') ? 'json' : args.includes('--csv') ? 'csv' : 'text'
const known = new Set(['--json', '--csv'])
if (args.some((a) => !known.has(a))) {
  console.error(`Unknown flag. ${USAGE}`)
  process.exit(2)
}

try {
  const raw = await kv(['hgetall', `waitlist:${productId}:signals`])
  const values = Array.isArray(raw) ? raw.filter((_, i) => i % 2 === 1) : Object.values(raw ?? {})

  // Stored values are parsed defensively: a malformed entry is counted as
  // invalid, never echoed. No stored text reaches an error message.
  let invalid = 0
  const signals = []
  for (const value of values) {
    try {
      const parsed = JSON.parse(String(value))
      if (parsed && typeof parsed === 'object') signals.push(parsed)
      else invalid++
    } catch {
      invalid++
    }
  }

  const count = await kv(['get', `waitlist:${productId}:count`])

  const report = {
    measuredAt: new Date().toISOString(),
    productId,
    total: Number(count ?? signals.length),
    answeredRefine: signals.filter((s) => s.role || s.priceBand || s.urgency || s.pain).length,
    invalidEntries: invalid,
    roles: tally(signals, 'role', ROLES),
    priceBands: tally(signals, 'priceBand', PRICE_BANDS),
    urgency: tally(signals, 'urgency', URGENCY),
    sources: tally(signals, 'source', SOURCES),
    pains: painBuckets(signals),
  }

  if (mode === 'json') {
    console.log(JSON.stringify(report, null, 2))
  } else if (mode === 'csv') {
    console.log('section,key,count')
    for (const [section, key] of [['role', 'roles'], ['priceBand', 'priceBands'], ['urgency', 'urgency'], ['source', 'sources'], ['pain', 'pains']]) {
      for (const [name, n] of Object.entries(report[key])) console.log(`${section},${JSON.stringify(name)},${n}`)
    }
  } else {
    console.log(`Demand report — ${report.productId} (${report.measuredAt})`)
    console.log(`  total signups: ${report.total} (${report.answeredRefine} answered the refine step${report.invalidEntries ? `, ${report.invalidEntries} unreadable entries skipped` : ''})`)
    for (const [label, key] of [['roles', 'roles'], ['price bands', 'priceBands'], ['urgency', 'urgency'], ['sources', 'sources'], ['pain buckets', 'pains']]) {
      const entries = Object.entries(report[key])
      console.log(`  ${label}: ${entries.length ? entries.map(([k, v]) => `${k} ×${v}`).join(', ') : 'no answers yet'}`)
    }
  }
} catch {
  // Constant message: no error detail, response body or stored value.
  console.error('Demand report failed: could not read the waitlist store.')
  process.exit(1)
}
