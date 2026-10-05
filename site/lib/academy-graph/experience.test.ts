import { test } from 'node:test'
import assert from 'node:assert/strict'
import { publicAcademyManifest } from './experience.ts'
import { artifacts, evals, projectProductionAgentSystems as project } from './production-agent-systems.ts'

test('human and machine entries resolve to the same artifact and evaluation path', () => {
  const manifest = publicAcademyManifest({ stage: 'concept', gate: 'UNGATED' })
  assert.equal(manifest.stages.length, project.stages.length)
  for (const stage of project.stages) {
    const view = manifest.stages.find(s => s.id === stage.id)!
    const artifact = artifacts.find(a => a.id === stage.artifact)!
    assert.equal(view.artifactId, artifact.id)
    assert.equal(view.artifactAccess, artifact.visibility)
    assert.deepEqual(view.artifact?.requiredSections, artifact.visibility === 'public' ? artifact.requiredSections : undefined)
    assert.deepEqual(view.evaluations.flatMap(e => e.assertions), stage.evals.flatMap(id => evals.find(e => e.id === id)?.assertions ?? []))
  }
  assert.equal(manifest.qualification.paymentGrantsCapability, false)
  assert.equal(manifest.commercial.checkout, 'unavailable')
  assert.ok(!JSON.stringify(manifest).includes('priceHypothesis'))
})
test('manifest does not expose non-public graph nodes or learner evidence', () => {
  const manifest = publicAcademyManifest({ stage: 'concept', gate: 'UNGATED' })
  for (const stage of manifest.stages) {
    if (stage.artifact) assert.equal(artifacts.find(a => a.id === stage.artifact?.id)?.visibility, 'public')
    for (const e of stage.evaluations) assert.equal(evals.find(node => node.id === e.id)?.visibility, 'public')
  }
  assert.ok(!JSON.stringify(manifest).includes('learner-submitted'))
  assert.equal(manifest.agent.mcp.transport, 'stdio')
})
