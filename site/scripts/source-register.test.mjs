import { test } from 'node:test'
import assert from 'node:assert/strict'
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
