// Guards data/worked-run.json against a sync that silently parsed less than the plugin wrote.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const data = JSON.parse(readFileSync(new URL('../data/worked-run.json', import.meta.url), 'utf8'))
const LIFECYCLE = ['frame', 'discovery', 'flow', 'decisions', 'economics', 'trust', 'evals', 'operate', 'verify']
const VERDICTS = new Set(['MADE', 'OPEN'])
const STATUSES = new Set(['PASS', 'FAIL'])

test('every run carries the nine gates in lifecycle order', () => {
  for (const run of data.runs) assert.deepEqual(run.gates.map((g) => g.id), LIFECYCLE, run.id)
})

test('every gate and decision has a known status and a non-empty note', () => {
  for (const run of data.runs) {
    for (const g of run.gates) {
      assert.ok(STATUSES.has(g.status), `${run.id}/${g.id}: ${g.status}`)
      assert.ok(g.note.length > 10, `${run.id}/${g.id}: empty note`)
    }
    assert.deepEqual(run.decisions.map((d) => d.id), ['model', 'loop', 'trust', 'run'], run.id)
    for (const d of run.decisions) assert.ok(VERDICTS.has(d.verdict), `${run.id}/${d.id}: ${d.verdict}`)
  }
})

test('the receipt tally and the contract check are internally consistent', () => {
  for (const run of data.runs) {
    const { pointers, confirmed, failed } = run.receipt
    assert.equal(confirmed + failed, pointers, run.id)
    assert.equal(run.contract.pass + run.contract.fail, run.contract.checks, run.id)
  }
})

test('the featured run has a finding with a fix, and says it is a fixture', () => {
  const [featured] = data.runs
  assert.match(featured.finding.title, /^F1 — /)
  assert.ok(featured.finding.fix.length >= 1)
  assert.match(featured.fixtureNote, /fixture|worked example/i)
  assert.ok(featured.outcome && featured.killCriterion)
})
