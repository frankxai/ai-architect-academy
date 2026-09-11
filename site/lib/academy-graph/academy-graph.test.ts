/**
 * Run with: node --test site/lib/academy-graph/
 * Node 22.18+/24 strips the types natively; no build step, no test runner dep.
 */

import test from 'node:test'
import assert from 'node:assert/strict'

import { advanceCapability, projectPortfolio, type Refusal } from './advance.ts'
import {
  competencyShipProduction,
  productionAgentSystemsGraph as graph,
  projectProductionAgentSystems,
} from './production-agent-systems.ts'
import {
  completeLearner,
  emptyLearner,
  FIXTURE_AS_OF,
  FIXTURE_LEARNER_ID,
  grantedLearner,
} from './fixtures.ts'
import { ACADEMY_GRAPH_VERSION } from './types.ts'

const COMPETENCY = competencyShipProduction.id
const codes = (r: readonly Refusal[]) => new Set(r.map((x) => x.code))

const refuse = (learner = completeLearner(), asOf = FIXTURE_AS_OF) => {
  const result = advanceCapability(graph, learner, COMPETENCY, asOf)
  assert.equal(result.granted, false, 'expected a refusal')
  assert.ok(!result.granted)
  return result.refusals
}

// --- Graph integrity ---------------------------------------------------------

test('every node carries owner, version, visibility, provenance and an evaluation rule', () => {
  for (const node of graph.nodes) {
    assert.ok(node.owner, `${node.id} has no owner`)
    assert.match(node.version, /^\d+\.\d+\.\d+$/, `${node.id} has no semver`)
    assert.ok(['public', 'cohort', 'private'].includes(node.visibility), `${node.id} visibility`)
    assert.ok(node.provenance?.source && node.provenance.measuredAt, `${node.id} provenance`)
    assert.ok(node.evaluationRule?.kind, `${node.id} evaluation rule`)
  }
})

test('every edge endpoint resolves to a node in the same graph', () => {
  const ids = new Set(graph.nodes.map((n) => n.id))
  for (const edge of graph.edges) {
    assert.ok(ids.has(edge.from), `${edge.id} dangling from ${edge.from}`)
    assert.ok(ids.has(edge.to), `${edge.id} dangling to ${edge.to}`)
    assert.ok(edge.owner && edge.provenance && edge.evaluationRule, `${edge.id} missing metadata`)
  }
})

test('all twelve node kinds are present', () => {
  const kinds = new Set(graph.nodes.map((n) => n.kind))
  for (const k of [
    'Competency',
    'Pattern',
    'FailureMode',
    'Lab',
    'Project',
    'Artifact',
    'Eval',
    'Review',
    'Prerequisite',
    'Role',
  ]) {
    assert.ok(kinds.has(k as never), `missing node kind ${k}`)
  }
  // Evidence and Portfolio are learner-scoped and produced at runtime, not
  // published in the authored graph; the fixture and projection cover them.
  assert.equal(graph.schema, ACADEMY_GRAPH_VERSION)
})

test('the flagship path has nine ordered stages, each with an artifact and an eval', () => {
  const stages = projectProductionAgentSystems.stages
  assert.equal(stages.length, 9)
  assert.deepEqual(
    stages.map((s) => s.ordinal),
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
  )
  for (const s of stages) {
    assert.ok(s.artifact, `${s.id} has no artifact`)
    assert.ok(s.evals.length > 0, `${s.id} has no eval`)
    assert.ok(s.evidenceRule.minimumCount >= 1, `${s.id} accepts zero evidence`)
    assert.ok(s.evidenceRule.accepts.length > 0, `${s.id} accepts no evidence kind`)
  }
})

// --- Refusal is the default --------------------------------------------------

test('a learner on day one is refused, with one refusal per unproduced artifact', () => {
  const refusals = refuse(emptyLearner())
  const missing = refusals.filter((r) => r.code === 'artifact-not-submitted')
  assert.equal(missing.length, competencyShipProduction.requiredArtifacts.length)
  assert.ok(codes(refusals).has('eval-never-run'))
  assert.ok(codes(refusals).has('review-missing'))
})

test('submitting artifacts without evidence never grants the competency', () => {
  const learner = { ...completeLearner(), evidence: [] }
  const refusals = refuse(learner)
  assert.ok(codes(refusals).has('no-evidence'))
  assert.equal(
    refusals.filter((r) => r.code === 'no-evidence').length,
    competencyShipProduction.requiredArtifacts.length,
  )
})

test('an unknown competency is refused rather than silently granted', () => {
  const result = advanceCapability(graph, completeLearner(), 'competency:does-not-exist', FIXTURE_AS_OF)
  assert.equal(result.granted, false)
  assert.ok(!result.granted && result.refusals[0].code === 'unknown-competency')
})

// --- Each guard, isolated ----------------------------------------------------

test('a complete learner is granted', () => {
  const result = advanceCapability(graph, completeLearner(), COMPETENCY, FIXTURE_AS_OF)
  assert.equal(result.granted, true, JSON.stringify(!result.granted && result.refusals, null, 2))
  assert.ok(result.granted && result.grantedAt === FIXTURE_AS_OF)
})

test('a self-reviewed artifact does not count', () => {
  const base = completeLearner()
  const learner = {
    ...base,
    reviews: base.reviews.map((v) =>
      v.reviewId === 'review:architecture-defence' ? { ...v, reviewer: FIXTURE_LEARNER_ID } : v,
    ),
  }
  const refusals = refuse(learner)
  assert.deepEqual(codes(refusals), new Set(['review-not-independent']))
})

test('a revise verdict is not a pass', () => {
  const base = completeLearner()
  const learner = {
    ...base,
    reviews: base.reviews.map((v) =>
      v.reviewId === 'review:incident-honesty' ? { ...v, verdict: 'revise' as const } : v,
    ),
  }
  assert.deepEqual(codes(refuse(learner)), new Set(['review-not-passed']))
})

test('deploy evidence goes stale on the deployment stage but repo evidence does not', () => {
  // 2027-03-01 is 193 days after the fixture verification date: past the
  // 90-day running-system rule, inside the 365-day written-artifact rule.
  const refusals = refuse(completeLearner(), '2027-03-01')
  assert.deepEqual(codes(refusals), new Set(['evidence-stale', 'insufficient-evidence']))
  const stale = refusals.filter((r) => r.code === 'evidence-stale')
  // The deployment record's one locator, plus the incident report's deploy URL
  // and its witness attestation. Nothing written expires inside a year.
  assert.equal(stale.length, 3, 'only running-system evidence should expire')
})

test('a repository link cannot stand in for a running deployment', () => {
  const base = completeLearner()
  const learner = {
    ...base,
    evidence: base.evidence.map((e) =>
      e.artifact === 'artifact:deployment-record' ? { ...e, evidenceKind: 'repo-url' as const } : e,
    ),
  }
  const refusals = refuse(learner)
  assert.ok(codes(refusals).has('evidence-kind-not-accepted'))
  assert.ok(codes(refusals).has('insufficient-evidence'))
})

test('the eval harness stage needs two evidence records, not one', () => {
  const base = completeLearner()
  const learner = {
    ...base,
    evidence: base.evidence.filter((e) => e.id !== 'evidence:eval-harness-run'),
  }
  const refusals = refuse(learner)
  assert.deepEqual(codes(refusals), new Set(['insufficient-evidence']))
  assert.equal(refusals[0].subject, 'artifact:eval-harness')
})

test('a learner cannot witness their own incident simulation', () => {
  const base = completeLearner()
  const learner = {
    ...base,
    evidence: base.evidence.map((e) =>
      e.id === 'evidence:incident-witness' ? { ...e, verifiedBy: FIXTURE_LEARNER_ID } : e,
    ),
  }
  const refusals = refuse(learner)
  assert.deepEqual(codes(refusals), new Set(['evidence-self-attested', 'insufficient-evidence']))
})

test('a failing assertion blocks the grant and names what failed', () => {
  const base = completeLearner()
  const learner = {
    ...base,
    evalRuns: base.evalRuns.map((r) =>
      r.evalId === 'eval:authority-least-privilege'
        ? { ...r, passedAssertions: ['side-effecting-flagged'], failedAssertions: ['no-shared-principal-for-writes', 'revocation-documented'] }
        : r,
    ),
  }
  const refusals = refuse(learner)
  assert.deepEqual(codes(refusals), new Set(['eval-below-threshold']))
  assert.match(refusals[0].detail, /no-shared-principal-for-writes/)
})

test('the most recent eval run decides, not the best one', () => {
  const base = completeLearner()
  const failing = {
    evalId: 'eval:cost-model-has-ceiling' as const,
    artifact: 'artifact:cost-model' as const,
    ranAt: '2026-08-30',
    passedAssertions: [],
    failedAssertions: ['runaway-guard'],
  }
  const learner = { ...base, evalRuns: [...base.evalRuns, failing] }
  assert.deepEqual(codes(refuse(learner)), new Set(['eval-below-threshold']))
})

// --- Portfolio projection ----------------------------------------------------

test('the portfolio publishes only public-safe artifacts and public evidence', () => {
  const portfolio = projectPortfolio(graph, grantedLearner(), FIXTURE_AS_OF)
  assert.equal(portfolio.entries.length, 1)
  const entry = portfolio.entries[0]

  assert.ok(!entry.artifacts.includes('artifact:threat-model'), 'threat model must stay cohort-only')
  assert.ok(!entry.artifacts.includes('artifact:incident-report'), 'incident report must stay cohort-only')
  assert.ok(entry.artifacts.includes('artifact:architecture-decision'))
  assert.equal(entry.artifacts.length, 7)

  for (const locator of entry.publicEvidence) {
    assert.ok(!locator.includes('threat-model'))
    assert.ok(!locator.includes('incident-report'))
  }
})

test('an ungranted learner projects an empty portfolio rather than a hopeful one', () => {
  const portfolio = projectPortfolio(graph, completeLearner(), FIXTURE_AS_OF)
  assert.equal(portfolio.entries.length, 0)
  assert.equal(portfolio.visibility, 'public')
})
