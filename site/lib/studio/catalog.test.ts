import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { componentsForStep, engineHref, exportHref, formatDate, ledger, weightedScore, type StudioCatalog } from './catalog.ts'

const catalog = JSON.parse(fs.readFileSync(new URL('../../data/studio-catalog.json', import.meta.url), 'utf8')) as StudioCatalog

test('the interactive ledger reproduces the engine arithmetic for every pattern', () => {
  for (const p of catalog.patterns) {
    const { computed, currency, basis, ...inputs } = p.economics
    assert.equal(currency, 'EUR')
    assert.ok(basis.length > 0)
    assert.deepEqual(ledger(inputs), computed, p.id)
  }
})

test('a failed attempt is still charged: cost per accepted result rises as acceptance falls', () => {
  const base = { tasks: 1000, adoption: 1, acceptance: 0.8, minutes_saved: 10, hourly_value: 60, run_cost_per_task: 1, fixed_monthly: 0 }
  const high = ledger(base)
  const low = ledger({ ...base, acceptance: 0.4 })
  assert.equal(high.run_cost, low.run_cost)
  assert.ok(low.cost_per_accepted! > high.cost_per_accepted!)
  assert.equal(ledger({ ...base, acceptance: 0 }).cost_per_accepted, null)
})

test('equal weights reproduce the recorded mean; zero weights fall back to it', () => {
  for (const p of catalog.patterns) for (const r of Object.values(p.realizations)) {
    const ones = Object.fromEntries(Object.keys(r.scores).map(k => [k, 1]))
    const zeros = Object.fromEntries(Object.keys(r.scores).map(k => [k, 0]))
    assert.ok(Math.abs(weightedScore(r.scores, ones) - r.mean_score) < 0.051, `${p.id}/${r.provider}`)
    assert.equal(weightedScore(r.scores, zeros), weightedScore(r.scores, ones))
  }
  assert.equal(weightedScore({ a: 5, b: 1 }, { a: 1, b: 0 }), 5)
})

test('the journey player lights every flow and component at least once', () => {
  for (const p of catalog.patterns) {
    const lit = new Set<string>()
    p.journey.forEach((_, i) => componentsForStep(p, i).forEach(c => lit.add(c)))
    const connected = new Set(p.flows.flatMap(f => [f.from, f.to]))
    for (const c of connected) assert.ok(lit.has(c), `${p.id}: ${c} never lit`)
    const played = new Set(p.journey.flatMap(s => s.flows))
    for (const f of p.flows) assert.ok(played.has(f.id), `${p.id}: ${f.id} never played`)
  }
})

test('export links resolve to projected files', () => {
  const files = new Set(catalog.projection.files.map(f => `/studio/${f.path}`))
  for (const p of catalog.patterns) {
    assert.ok(files.has(exportHref(p.id, 'workspace.dsl')))
    for (const pr of catalog.providers) assert.ok(files.has(exportHref(p.id, `${pr.id}.mmd`)))
  }
})

test('engine links open files as blobs and directories as trees at the pinned revision', () => {
  const repo = 'https://github.com/frankxai/ai-architect'
  assert.equal(engineHref(repo, 'abc', 'catalog/compile.mjs'), `${repo}/blob/abc/catalog/compile.mjs`)
  assert.equal(engineHref(repo, 'abc', '.claude-plugin/plugin.json'), `${repo}/blob/abc/.claude-plugin/plugin.json`)
  assert.equal(engineHref(repo, 'abc', 'catalog/patterns'), `${repo}/tree/abc/catalog/patterns`)
  assert.equal(engineHref(repo, 'abc', 'skills'), `${repo}/tree/abc/skills`)
})

test('register dates print the calendar day in every time zone', () => {
  assert.equal(formatDate('2017-06-12'), '12 Jun 2017')
  assert.equal(formatDate('2026-01-01'), '1 Jan 2026')
})
