import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'
import { projectProductionAgentSystems } from '../lib/academy-graph/production-agent-systems.ts'

const register = JSON.parse(readFileSync(new URL('../data/knowledge-sources.json', import.meta.url), 'utf8'))
test('source register remains metadata-only and resolves decisions into the existing graph', () => {
  assert.equal(register.fullTextIngested, false)
  assert.equal(new Set(register.sources.map(s => s.id)).size, register.sources.length)
  const stages = new Set(projectProductionAgentSystems.stages.map(s => s.id.replace(/^stage:/, '')))
  for (const source of register.sources) {
    assert.equal(new URL(source.url).protocol, 'https:')
    assert.equal(source.contentState, 'metadata-only')
    assert.match(source.retrievalPolicy, /check rights/)
    assert.ok(Number.isFinite(Date.parse(source.metadataReviewedAt)))
    assert.ok(Number.isInteger(source.reviewAfterDays) && source.reviewAfterDays > 0)
    assert.ok(source.decisionStages.length > 0)
    for (const stage of source.decisionStages) assert.ok(stages.has(stage), `unknown source decision ${stage}`)
  }
})

test('due check uses UTC calendar dates and rejects invalid source ids or dates', () => {
  const script = fileURLToPath(new URL('./check-source-review.mjs', import.meta.url))
  const run = (...args) => spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' })
  const source = register.sources.find(s => s.id === 'azure-foundry-model-router')
  const shifted = days => new Date(Date.parse(source.metadataReviewedAt + 'T00:00:00Z') + days * 86_400_000).toISOString().slice(0, 10)
  assert.equal(run('--as-of', shifted(source.reviewAfterDays - 1), source.id).status, 0)
  const due = run('--as-of', shifted(source.reviewAfterDays), source.id)
  assert.equal(due.status, 1)
  assert.ok(due.stdout.includes(source.url) && due.stdout.includes(source.practicePath))
  assert.equal(run('--as-of', '2026-02-30', source.id).status, 2)
  assert.equal(run('unknown-source-id').status, 2)
})
