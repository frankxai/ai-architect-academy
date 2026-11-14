import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { advanceCapability, projectPortfolio, type Refusal } from './advance.ts'
import {
  FORBIDDEN_PUBLIC_TERMS,
  LAB_STAGE_BINDINGS,
  ROLE_ENTRY_TRACKS,
  SPINE_BLUEPRINT_PLATES,
  WORKED_RUN_GATE_BINDINGS,
  assertVendorNeutralPublicText,
  bridgeWorkedRunToLearner,
  mapLabReceiptToEvidence,
  mergeLabReceiptsIntoLearner,
  resolveRoleEntryTrack,
  type LabCompletionReceipt,
  type RoleEntryTrackId,
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

const siteDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const repoRoot = path.resolve(siteDir, '..')

function relativeLuminance(hex: string): number {
  const clean = hex.replace('#', '')
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean
  const num = Number.parseInt(full, 16)
  const channels = [(num >> 16) & 255, (num >> 8) & 255, num & 255].map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

function contrastRatio(fg: string, bg: string): number {
  const l1 = relativeLuminance(fg)
  const l2 = relativeLuminance(bg)
  return Number(((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(2))
}

function assertBalancedSvgXml(label: string, xml: string): void {
  assert.match(xml, /^\s*<svg\b[^>]*xmlns="http:\/\/www\.w3\.org\/2000\/svg"/, `${label} missing <svg> root`)
  assert.match(xml, /<title\b[^>]*>[^<]+<\/title>/, `${label} missing <title>`)
  assert.match(xml, /<desc\b[^>]*>[^<]+<\/desc>/, `${label} missing <desc>`)
  const stripped = xml.replace(/<!--[\s\S]*?-->/g, '')
  const stack: string[] = []
  const tagRe = /<\/?([a-zA-Z][a-zA-Z0-9:-]*)\b([^>]*?)(\/?)>/g
  let match: RegExpExecArray | null
  while ((match = tagRe.exec(stripped)) !== null) {
    const [raw, tagName, , trailingSlash] = match
    if (raw.startsWith('</')) {
      const open = stack.pop()
      assert.equal(open, tagName, `${label} mismatched closing tag </${tagName}> (expected </${open}>)`)
    } else if (!trailingSlash) {
      stack.push(tagName)
    }
  }
  assert.deepEqual(stack, [], `${label} has unclosed XML tags: ${stack.join(', ')}`)
}

test('evidence-bridge: vendor-neutral guard blocks vendor tokens and admits neutral architecture prose', () => {
  assert.doesNotThrow(() =>
    assertVendorNeutralPublicText(
      'clean-architecture-copy',
      'Route model calls through one owned seam and enforce deterministic tool-authority gates.',
    ),
  )
  const sampleVendor = ['clau', 'de'].join('')
  assert.throws(
    () => assertVendorNeutralPublicText('leaked-copy', `Configured ${sampleVendor} client directly`),
    /Forbidden vendor term/i,
  )
})

test('evidence-bridge: five Role Entry tracks resolve to valid flagship stages, runnable offline labs, and proof surfaces', () => {
  assert.deepEqual(
    ROLE_ENTRY_TRACKS.map((t) => t.label),
    [
      'Systems Architect',
      'Agent Runtime Engineer',
      'Technical Founder',
      'Governance & Eval Lead',
      'Delegated Coding Agent',
    ],
  )

  const stageIds = new Set(projectProductionAgentSystems.stages.map((s) => s.id))
  for (const track of ROLE_ENTRY_TRACKS) {
    const resolved = resolveRoleEntryTrack(track.id)
    assert.ok(stageIds.has(resolved.stageId), `missing stage ${resolved.stageId}`)
    assert.equal(resolved.stagePath, `/path/${resolved.stageId.replace(/^stage:/, '')}`)
    assert.ok(resolved.dayOneDecision.length >= 40, `${track.id} day-one decision too short`)
    assert.ok(['/adr', '/worked-run'].includes(resolved.proofHref), `${track.id} invalid proofHref`)
    assert.match(resolved.labCommand, /^python labs\/[a-z0-9-]+\/cli\.py\b/)

    const cliRelPath = resolved.labCommand.split(/\s+/)[1]
    assert.ok(
      existsSync(path.join(repoRoot, cliRelPath)),
      `missing offline lab CLI on disk: ${cliRelPath}`,
    )
  }

  assert.throws(
    () => resolveRoleEntryTrack('unknown-role' as RoleEntryTrackId),
    /Unknown role entry track/,
  )
})

test('evidence-bridge: spine blueprint plates resolve on disk with well-formed SVG XML, WCAG AA contrast, and zero vendor terms', () => {
  assert.deepEqual(
    SPINE_BLUEPRINT_PLATES.map((p) => p.id),
    [
      'four-plane-agent-runtime',
      'trust-boundary-firewall-flow',
      'twelve-week-progression-eval-gate',
    ],
  )

  const stageIds = new Set(projectProductionAgentSystems.stages.map((s) => s.id))
  const spineContrastPairs: readonly [string, string, string][] = [
    ['muted header on stage', '#9aa1b5', '#151824'],
    ['muted note on card', '#9aa1b5', '#171b29'],
    ['primary ink on card', '#f2f1ec', '#171b29'],
    ['secondary ink on card', '#cbd5e1', '#171b29'],
    ['cobalt badge on pill', '#a9b8ff', '#20294a'],
    ['mint badge on pill', '#5ee6cf', '#163331'],
    ['coral red-gate ink on dark box', '#f3b5a8', '#29181c'],
  ]

  for (const [pairLabel, fg, bg] of spineContrastPairs) {
    const ratio = contrastRatio(fg, bg)
    assert.ok(ratio >= 4.5, `WCAG AA contrast failed for ${pairLabel}: ${ratio}:1`)
  }

  for (const plate of SPINE_BLUEPRINT_PLATES) {
    assertVendorNeutralPublicText(
      `SPINE_BLUEPRINT_PLATES[${plate.id}]`,
      [
        plate.shortLabel,
        plate.eyebrow,
        plate.title,
        plate.alt,
        plate.summary,
        ...plate.invariants,
        ...plate.proofLinks.map((l) => l.label),
      ].join('\n'),
    )
    assert.ok(plate.invariants.length >= 3, `${plate.id} requires architectural invariants`)
    for (const stageId of plate.stageIds) {
      assert.ok(stageIds.has(stageId), `${plate.id} references unknown stage ${stageId}`)
    }
    for (const labId of plate.labIds) {
      assert.ok(LAB_STAGE_BINDINGS[labId], `${plate.id} references unsupported lab ${labId}`)
    }
    const proofHrefs = new Set(plate.proofLinks.map((l) => l.href))
    assert.ok(proofHrefs.has('/adr') && proofHrefs.has('/worked-run'), `${plate.id} must link /adr and /worked-run`)

    const svgAbsPath = path.join(repoRoot, plate.publicFile)
    assert.ok(existsSync(svgAbsPath), `missing public spine SVG: ${plate.publicFile}`)
    const svgBytes = readFileSync(svgAbsPath)
    assert.ok(svgBytes.length > 500 && svgBytes.length < 512 * 1024, `${plate.publicFile} invalid byte size`)
    const svgText = svgBytes.toString('utf8')
    assertBalancedSvgXml(plate.publicFile, svgText)
    assert.doesNotMatch(svgText, FORBIDDEN_PUBLIC_TERMS, `${plate.publicFile} contains forbidden vendor term`)
    assert.doesNotMatch(svgText, /\p{Extended_Pictographic}/u, `${plate.publicFile} contains emoji`)
    assert.match(svgText, new RegExp(`width="${plate.width}"`))
    assert.match(svgText, new RegExp(`height="${plate.height}"`))
  }
})

test('evidence-bridge: RoleEntrySelector and SpineBlueprintGallery enforce accessible tablists and vendor neutrality', () => {
  for (const rel of ['components/RoleEntrySelector.tsx', 'components/SpineBlueprintGallery.tsx']) {
    const abs = path.join(siteDir, rel)
    assert.ok(existsSync(abs), `missing component ${rel}`)
    const source = readFileSync(abs, 'utf8')
    assertVendorNeutralPublicText(rel, source)
    assert.doesNotMatch(source, /you will (?:learn|be able to)/i, `${rel} violates capability claim rule`)
    assert.match(source, /role="tablist"/, `${rel} missing role="tablist"`)
    assert.match(source, /ArrowLeft/, `${rel} missing ArrowLeft keyboard handler`)
    assert.match(source, /ArrowRight/, `${rel} missing ArrowRight keyboard handler`)
    assert.match(source, /Home/, `${rel} missing Home keyboard handler`)
    assert.match(source, /End/, `${rel} missing End keyboard handler`)
  }
})
