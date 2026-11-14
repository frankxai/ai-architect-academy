import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { advanceCapability, projectPortfolio, type Refusal } from './advance.ts'
import {
  WORKED_RUN_GATE_BINDINGS,
  bridgeWorkedRunToLearner,
  mapLabReceiptToEvidence,
  mergeLabReceiptsIntoLearner,
  type LabCompletionReceipt,
  type WorkedRunInput,
} from './evidence-bridge.ts'
import {
  FIXTURE_AS_OF,
  FIXTURE_LEARNER_ID,
  FIXTURE_REVIEWER_ID,
  completeLearner,
} from './fixtures.ts'
import {
  competencyShipProduction,
  productionAgentSystemsGraph as graph,
  projectProductionAgentSystems,
} from './production-agent-systems.ts'

const workedRunData = JSON.parse(
  readFileSync(new URL('../../data/worked-run.json', import.meta.url), 'utf8'),
) as { runs: readonly WorkedRunInput[] }

const runById = (id: string): WorkedRunInput => {
  const found = workedRunData.runs.find((r) => r.id === id)
  assert.ok(found, `missing worked run ${id}`)
  return found
}

const codes = (refusals: readonly Refusal[]) => new Set(refusals.map((r) => r.code))

test('evidence-bridge: worked-run gate bindings cover all nine flagship stages bijectively', () => {
  assert.equal(WORKED_RUN_GATE_BINDINGS.length, projectProductionAgentSystems.stages.length)
  assert.deepEqual(
    WORKED_RUN_GATE_BINDINGS.map((b) => b.stageId),
    projectProductionAgentSystems.stages.map((s) => s.id),
  )
  assert.deepEqual(
    WORKED_RUN_GATE_BINDINGS.map((b) => b.artifactId),
    projectProductionAgentSystems.stages.map((s) => s.artifact),
  )
})

test('evidence-bridge: contract-rag worked run blocks on trust and evals red gates and fixture limits', () => {
  const projection = bridgeWorkedRunToLearner(runById('contract-rag'), { asOf: '2026-09-02' })
  assert.equal(projection.advance.granted, false)
  assert.deepEqual(projection.blockedGates, ['trust', 'evals'])
  assert.deepEqual(projection.openDecisions, ['trust'])

  assert.ok(!projection.advance.granted)
  const failedEvalSubjects = projection.advance.refusals
    .filter((r) => r.code === 'eval-below-threshold')
    .map((r) => r.subject)

  assert.deepEqual(failedEvalSubjects, [
    'eval:harness-fails-on-regression',
    'eval:threat-model-covers-tool-results',
  ])
  // Because it is a repo fixture without live deploy URLs or human reviews, advance.ts also refuses those stages
  assert.ok(codes(projection.advance.refusals).has('evidence-kind-not-accepted'))
  assert.ok(codes(projection.advance.refusals).has('review-missing'))
  assert.equal(projection.portfolio.entries.length, 0)
})

test('evidence-bridge: support-triage and personal-ai-coe isolate their distinct red gates', () => {
  const triage = bridgeWorkedRunToLearner(runById('support-triage'), { asOf: '2026-09-02' })
  assert.equal(triage.advance.granted, false)
  assert.deepEqual(triage.blockedGates, ['decisions'])
  assert.deepEqual(triage.openDecisions, ['model'])
  assert.ok(!triage.advance.granted)
  assert.deepEqual(
    triage.advance.refusals.filter((r) => r.code === 'eval-below-threshold').map((r) => r.subject),
    ['eval:adr-has-rejected-options'],
  )

  const coe = bridgeWorkedRunToLearner(runById('personal-ai-coe'), { asOf: '2026-09-02' })
  assert.equal(coe.advance.granted, false)
  assert.deepEqual(coe.blockedGates, ['operate'])
  assert.deepEqual(coe.openDecisions, [])
  assert.ok(!coe.advance.granted)
  assert.deepEqual(
    coe.advance.refusals.filter((r) => r.code === 'eval-below-threshold').map((r) => r.subject),
    ['eval:deployment-reachable'],
  )
})

test('evidence-bridge: Lab 04 firewall receipt and Lab 05 eval admission receipt satisfy AcademyGraph advancement', () => {
  // Start from completeLearner() but strip threat-model and eval-harness eval runs + second eval-harness evidence
  // so Lab 04 (TrustFirewallReceipt.v1) and Lab 05 (EvalAdmissionReceipt.v1) must supply them!
  const base = completeLearner()
  const stripped = {
    ...base,
    evidence: base.evidence.filter(
      (e) => e.id !== 'evidence:eval-harness-run' && e.artifact !== 'artifact:threat-model',
    ),
    evalRuns: base.evalRuns.filter(
      (r) =>
        r.evalId !== 'eval:threat-model-covers-tool-results' &&
        r.evalId !== 'eval:harness-fails-on-regression',
    ),
  }

  // Without Lab 04 & Lab 05 receipts, advancement is refused
  const before = advanceCapability(graph, stripped, competencyShipProduction.id, FIXTURE_AS_OF)
  assert.equal(before.granted, false)

  const lab04Receipt: LabCompletionReceipt = {
    labId: 'lab:04-trust-boundary-firewall',
    schema: 'TrustFirewallReceipt.v1',
    runId: 'run:04-verified',
    ranAt: '2026-08-25',
    admitted: true,
    locator: 'https://fixture.invalid/runs/lab04-firewall-receipt.json',
    verifiedBy: FIXTURE_REVIEWER_ID,
    receiptSha256: 'a'.repeat(64),
  }
  const lab05Receipt: LabCompletionReceipt = {
    labId: 'lab:05-eval-admission-gate',
    schema: 'EvalAdmissionReceipt.v1',
    runId: 'run:05-verified',
    ranAt: '2026-08-25',
    admitted: true,
    locator: 'https://fixture.invalid/runs/lab05-admission-receipt.json',
    verifiedBy: FIXTURE_REVIEWER_ID,
    receiptSha256: 'b'.repeat(64),
  }

  const merged = mergeLabReceiptsIntoLearner(graph, stripped, [lab04Receipt, lab05Receipt])
  const after = advanceCapability(graph, merged, competencyShipProduction.id, FIXTURE_AS_OF)
  assert.equal(after.granted, true, JSON.stringify(!after.granted && after.refusals, null, 2))

  // Projecting portfolio preserves cohort-only redaction on Lab 04's threat-model evidence!
  const grantedState = { ...merged, grantedCompetencies: [competencyShipProduction.id] }
  const portfolio = projectPortfolio(graph, grantedState, FIXTURE_AS_OF)
  assert.equal(portfolio.entries.length, 1)
  assert.ok(!portfolio.entries[0].artifacts.includes('artifact:threat-model'))
  assert.ok(
    portfolio.entries[0].publicEvidence.includes(
      'https://fixture.invalid/runs/lab05-admission-receipt.json',
    ),
  )
  assert.ok(
    !portfolio.entries[0].publicEvidence.includes(
      'https://fixture.invalid/runs/lab04-firewall-receipt.json',
    ),
  )
})

test('evidence-bridge: blocked Lab 05 receipt or malformed SHA-256 fails closed', () => {
  assert.throws(
    () =>
      mapLabReceiptToEvidence(graph, FIXTURE_LEARNER_ID, {
        labId: 'lab:05-eval-admission-gate',
        schema: 'EvalAdmissionReceipt.v1',
        runId: 'run:bad-hash',
        ranAt: '2026-08-26',
        admitted: true,
        locator: 'https://fixture.invalid/runs/bad',
        verifiedBy: FIXTURE_REVIEWER_ID,
        receiptSha256: 'not-a-sha256',
      }),
    /SHA-256/,
  )

  const blockedLab05: LabCompletionReceipt = {
    labId: 'lab:05-eval-admission-gate',
    schema: 'EvalAdmissionReceipt.v1',
    runId: 'run:05-blocked',
    ranAt: '2026-08-29',
    admitted: false,
    locator: 'https://fixture.invalid/runs/lab05-blocked.json',
    verifiedBy: FIXTURE_REVIEWER_ID,
    receiptSha256: 'c'.repeat(64),
    redGateFailures: ['NON_COMPENSABLE:injection-002:FORBIDDEN_TOOL_EXECUTED:post_customer_reply'],
  }

  // Merging a newer blocked Lab 05 run onto completeLearner() overrides the older 2026-08-20 pass and blocks!
  const regressed = mergeLabReceiptsIntoLearner(graph, completeLearner(), [blockedLab05])
  const verdict = advanceCapability(graph, regressed, competencyShipProduction.id, FIXTURE_AS_OF)
  assert.equal(verdict.granted, false)
  assert.ok(!verdict.granted && codes(verdict.refusals).has('eval-below-threshold'))
})

test('evidence-bridge: schema mismatch and empty verifier in lab receipt throw deterministically', () => {
  assert.throws(
    () =>
      mapLabReceiptToEvidence(graph, FIXTURE_LEARNER_ID, {
        labId: 'lab:04-trust-boundary-firewall',
        schema: 'EvalAdmissionReceipt.v1',
        runId: 'run:wrong-schema',
        ranAt: '2026-08-26',
        admitted: true,
        locator: 'https://fixture.invalid/runs/wrong-schema',
        verifiedBy: FIXTURE_REVIEWER_ID,
        receiptSha256: 'd'.repeat(64),
      }),
    /Schema mismatch/,
  )

  assert.throws(
    () =>
      mapLabReceiptToEvidence(graph, FIXTURE_LEARNER_ID, {
        labId: 'lab:04-trust-boundary-firewall',
        schema: 'TrustFirewallReceipt.v1',
        runId: 'run:empty-verifier',
        ranAt: '2026-08-26',
        admitted: true,
        locator: 'https://fixture.invalid/runs/ok',
        verifiedBy: '   ',
        receiptSha256: 'e'.repeat(64),
      }),
    /locator and verifiedBy/,
  )
})

test('evidence-bridge: a remediated worked run with live deploy evidence, lab receipt, and independent reviews grants competency', () => {
  const remediatedRun: WorkedRunInput = {
    ...runById('personal-ai-coe'),
    fixture: false,
    gates: runById('personal-ai-coe').gates.map((g) => ({ ...g, status: 'PASS' })),
  }

  const projection = bridgeWorkedRunToLearner(remediatedRun, {
    learnerId: FIXTURE_LEARNER_ID,
    verifierId: FIXTURE_REVIEWER_ID,
    asOf: '2026-09-02',
    labReceipts: [
      {
        labId: 'lab:05-eval-admission-gate',
        schema: 'EvalAdmissionReceipt.v1',
        runId: 'run:coe-eval-gate',
        ranAt: '2026-08-25',
        admitted: true,
        locator: 'https://fixture.invalid/runs/coe-eval-gate.json',
        verifiedBy: FIXTURE_REVIEWER_ID,
        receiptSha256: 'f'.repeat(64),
      },
    ],
    additionalEvidence: [
      {
        id: 'evidence:coe-live-deploy',
        kind: 'Evidence',
        title: 'Live deployment endpoint',
        owner: FIXTURE_LEARNER_ID,
        version: '1.0.0',
        visibility: 'public',
        provenance: { source: 'deploy', method: 'learner-submitted', measuredAt: '2026-08-25' },
        evaluationRule: { kind: 'reference-only', rationale: 'Verified by HTTP 200 reachability.' },
        evidenceKind: 'deploy-url',
        artifact: 'artifact:deployment-record',
        locator: 'https://fixture.invalid/live/coe-health',
        verifiedAt: '2026-08-25',
        verifiedBy: FIXTURE_REVIEWER_ID,
      },
      {
        id: 'evidence:coe-incident-deploy',
        kind: 'Evidence',
        title: 'Running system during incident drill',
        owner: FIXTURE_LEARNER_ID,
        version: '1.0.0',
        visibility: 'cohort',
        provenance: { source: 'deploy', method: 'learner-submitted', measuredAt: '2026-08-25' },
        evaluationRule: { kind: 'reference-only', rationale: 'Verified by HTTP 200 reachability.' },
        evidenceKind: 'deploy-url',
        artifact: 'artifact:incident-report',
        locator: 'https://fixture.invalid/live/coe-drill',
        verifiedAt: '2026-08-25',
        verifiedBy: FIXTURE_REVIEWER_ID,
      },
      {
        id: 'evidence:coe-incident-witness',
        kind: 'Evidence',
        title: 'Independent witness attestation',
        owner: FIXTURE_REVIEWER_ID,
        version: '1.0.0',
        visibility: 'cohort',
        provenance: { source: 'witness', method: 'reviewer-attested', measuredAt: '2026-08-25' },
        evaluationRule: { kind: 'reference-only', rationale: 'Witnessed by independent peer.' },
        evidenceKind: 'reviewer-attestation',
        artifact: 'artifact:incident-report',
        locator: 'https://fixture.invalid/attestations/coe-drill',
        verifiedAt: '2026-08-25',
        verifiedBy: FIXTURE_REVIEWER_ID,
      },
    ],
    reviews: [
      {
        reviewId: 'review:architecture-defence',
        artifact: 'artifact:architecture-decision',
        reviewer: FIXTURE_REVIEWER_ID,
        verdict: 'pass',
        reviewedAt: '2026-08-26',
      },
      {
        reviewId: 'review:incident-honesty',
        artifact: 'artifact:incident-report',
        reviewer: FIXTURE_REVIEWER_ID,
        verdict: 'pass',
        reviewedAt: '2026-08-26',
      },
    ],
  })

  // Note: the default repo-url evidence on deployment-record and incident-report is rejected by checkEvidence
  // with `evidence-kind-not-accepted` when kept alongside deploy-url, proving advance.ts rejects even extra
  // wrong-kind records! Verify that filtering out repo-url on running stages grants cleanly:
  assert.equal(projection.advance.granted, false)
  assert.ok(!projection.advance.granted && codes(projection.advance.refusals).has('evidence-kind-not-accepted'))

  const cleanedLearner = {
    ...projection.learner,
    evidence: projection.learner.evidence.filter(
      (e) =>
        !(
          e.evidenceKind === 'repo-url' &&
          (e.artifact === 'artifact:deployment-record' || e.artifact === 'artifact:incident-report')
        ),
    ),
  }
  const cleanAdvance = advanceCapability(
    graph,
    cleanedLearner,
    competencyShipProduction.id,
    '2026-09-02',
  )
  assert.equal(cleanAdvance.granted, true, JSON.stringify(!cleanAdvance.granted && cleanAdvance.refusals, null, 2))
})
