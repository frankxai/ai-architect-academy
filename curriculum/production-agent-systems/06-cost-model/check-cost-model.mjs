#!/usr/bin/env node
// Keyword screen for eval:cost-model-has-ceiling against a cost-model.json.
//
//   node check-cost-model.mjs path/to/cost-model.json
//
// Prints one line per assertion using the ids from
// site/lib/academy-graph/production-agent-systems.ts, then a JSON summary in the
// shape advance.ts records (passedAssertions / failedAssertions). Exits 0 only when
// both pass. Node 18 or later, no dependencies. Copy it into your own repository so
// the run is reproducible from there.
//
// This is a screen, not a verdict. It reads the shape of the file and the wording of
// runawayGuard, not your executor. A sentence can satisfy it and still describe an
// alert; whether the named check sits on the call path is decided by opening the
// linked commit, with rubric.md as the procedure.

import { readFileSync } from 'node:fs'

const REQUIRED_KEYS = ['unitOfWork', 'tokensPerUnit', 'costPerUnit', 'ceiling', 'runawayGuard']

// Exact word forms, so "stopwatch" and "blocker" do not count.
const HALTING = new Set([
  'halt', 'halts', 'halted', 'halting',
  'stop', 'stops', 'stopped', 'stopping',
  'refuse', 'refuses', 'refused', 'refusing',
  'reject', 'rejects', 'rejected', 'rejecting',
  'abort', 'aborts', 'aborted', 'aborting',
  'throw', 'throws', 'threw', 'throwing',
  'exit', 'exits', 'exited', 'exiting',
  'terminate', 'terminates', 'terminated', 'terminating',
  'kill', 'kills', 'killed',
  'block', 'blocks', 'blocked', 'blocking',
  'deny', 'denies', 'denied', 'denying',
])
// A halting verb only counts when the same clause places it on the call path.
const CALL_PATH = ['before', 'budget', 'executor', 'loop', 'assert', 'throw', 'exception', 'ceiling', 'cap', 'counter', 'remaining', 'debit', 'switch', 'turn']
// A halting verb right after one of these describes a possibility, not a mechanism
// ("who can stop the run", "will stop").
const MODAL = new Set(['can', 'could', 'may', 'might', 'should', 'will', 'would', 'shall'])
const ALERT_ONLY = ['notif', 'alert', 'warn', 'flag', 'report', 'page', 'email', 'dashboard']

const words = (text) => text.toLowerCase().match(/[a-z]+/g) ?? []
const prefixed = (list, w) => list.find((p) => w.startsWith(p))
const clauses = (text) => text.split(/[;.](?=\s|$)/).map((c) => c.trim()).filter(Boolean)

function enforcingClauses(text) {
  return clauses(text).filter((clause) => {
    const ws = words(clause)
    const onPath = ws.some((w) => prefixed(CALL_PATH, w))
    const halts = ws.some((w, i) => HALTING.has(w) && !ws.slice(Math.max(0, i - 3), i).some((m) => MODAL.has(m)))
    return onPath && halts
  })
}

function unitEconomics(doc) {
  const problems = []
  if (typeof doc.unitOfWork !== 'string' || doc.unitOfWork.trim() === '') {
    problems.push('unitOfWork is missing or not a non-empty string')
  }
  if (!('tokensPerUnit' in doc)) {
    problems.push('tokensPerUnit is missing')
  }
  if (typeof doc.costPerUnit !== 'number' || !Number.isFinite(doc.costPerUnit)) {
    problems.push(`costPerUnit is ${JSON.stringify(doc.costPerUnit)}; it must be a JSON number`)
  }
  return problems
}

function ceilingProblems(ceiling) {
  if (!ceiling || typeof ceiling !== 'object' || Array.isArray(ceiling)) {
    return ['ceiling is missing or not an object']
  }
  const problems = []
  const entries = Object.entries(ceiling)
  for (const [scope, pattern] of [['per-run', /run/i], ['per-day', /day/i], ['per-user or per-tenant', /user|tenant/i]]) {
    if (!entries.some(([key]) => pattern.test(key))) problems.push(`ceiling has no ${scope} entry`)
  }
  for (const [key, value] of entries) {
    if (!value || typeof value !== 'object' || typeof value.enforced !== 'boolean') {
      problems.push(`ceiling.${key} does not mark enforced true or false`)
    }
  }
  if (!entries.some(([, value]) => value && value.enforced === true)) {
    problems.push('no ceiling entry is enforced')
  }
  return problems
}

function runawayGuard(doc) {
  const problems = ceilingProblems(doc.ceiling)
  const guard = doc.runawayGuard
  const text =
    typeof guard === 'string' ? guard : guard && typeof guard.mechanism === 'string' ? guard.mechanism : ''
  if (text.trim() === '') {
    return [...problems, 'runawayGuard is missing, or has no mechanism string']
  }
  const alerting = [...new Set(words(text).map((w) => prefixed(ALERT_ONLY, w)).filter(Boolean))]
  if (enforcingClauses(text).length === 0) {
    const seen = alerting.length ? ` Alert verbs found: ${alerting.join(', ')}.` : ''
    problems.push(
      `runawayGuard has no clause where a halting verb (halt, stop, refuse, reject, abort, throw, exit, terminate, kill, block, deny) sits with a call-path term (${CALL_PATH.join(', ')}), outside a modal such as "can" or "will".${seen}`,
    )
  } else if (alerting.length) {
    console.log(
      `WARN runaway-guard: alert verbs present (${alerting.join(', ')}). The screen found a halting clause too; confirm by reading the linked commit that the halting clause is the mechanism and the alert is labelled reporting.`,
    )
  }
  return problems
}

const path = process.argv[2]
if (!path) {
  console.error('usage: node check-cost-model.mjs path/to/cost-model.json')
  process.exit(2)
}

let doc
try {
  doc = JSON.parse(readFileSync(path, 'utf8'))
} catch (err) {
  console.error(`cannot parse ${path} as JSON: ${err.message}`)
  process.exit(2)
}
if (!doc || typeof doc !== 'object' || Array.isArray(doc)) {
  console.error(`${path} must contain a JSON object`)
  process.exit(2)
}

const missing = REQUIRED_KEYS.filter((k) => !(k in doc))
if (missing.length) console.log(`MISSING required keys: ${missing.join(', ')}`)

const assertions = [
  ['unit-economics', unitEconomics],
  ['runaway-guard', runawayGuard],
]
const passedAssertions = []
const failedAssertions = []

for (const [id, run] of assertions) {
  const problems = run(doc)
  if (problems.length === 0) {
    passedAssertions.push(id)
    console.log(`PASS ${id}`)
  } else {
    failedAssertions.push(id)
    console.log(`FAIL ${id}`)
    for (const p of problems) console.log(`     ${p}`)
  }
}

console.log(
  JSON.stringify(
    {
      evalId: 'eval:cost-model-has-ceiling',
      artifact: 'artifact:cost-model',
      ranAt: new Date().toISOString().slice(0, 10),
      passedAssertions,
      failedAssertions,
    },
    null,
    2,
  ),
)
console.log(
  'Not checked here: the recomputation of costPerUnit, whether the run behind tokensPerUnit exists, whether the guard is on the call path, and whether a report-only per-user ceiling is defensible for who can start a run. Apply rubric.md for those.',
)

process.exit(failedAssertions.length === 0 ? 0 : 1)
