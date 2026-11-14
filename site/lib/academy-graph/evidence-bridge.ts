/**
 * Evidence Bridge — maps worked-run gate traces and offline lab completion
 * receipts (`TrustFirewallReceipt.v1`, `EvalAdmissionReceipt.v1`, and peer lab
 * runs) into `AcademyGraph.v1` `LearnerState` records so `advanceCapability()`
 * and `projectPortfolio()` remain the single non-bypassable source of truth.
 *
 * Honesty invariants preserved here:
 *  1. A worked-run plugin fixture (`fixture: true`) carries repository file
 *     excerpts, never a live customer deployment (`deploy-url`) or an
 *     independent human review. Bridging a fixture without real deployment and
 *     independent review records therefore deterministically refuses the grant.
 *  2. Any `FAIL` gate in a worked run or `admitted: false` in a lab receipt
 *     records failing assertions on the corresponding `EvalRun`, causing
 *     `advanceCapability()` to block with `eval-below-threshold`.
 *  3. Cohort-restricted artifacts (`artifact:threat-model`,
 *     `artifact:incident-report`) receive `cohort` visibility on bridged
 *     evidence so `projectPortfolio()` never leaks them publicly.
 */

import {
  advanceCapability,
  projectPortfolio,
  type AdvanceResult,
} from './advance.ts'
import {
  competencyShipProduction,
  productionAgentSystemsGraph,
  projectProductionAgentSystems,
} from './production-agent-systems.ts'
import type {
  AcademyGraph,
  Artifact,
  ArtifactId,
  CompetencyId,
  Eval,
  EvalId,
  EvalRun,
  Evidence,
  EvidenceKind,
  LabId,
  LearnerState,
  Portfolio,
  ReviewVerdict,
} from './types.ts'

export type WorkedRunGateId =
  | 'frame'
  | 'discovery'
  | 'flow'
  | 'decisions'
  | 'economics'
  | 'trust'
  | 'evals'
  | 'operate'
  | 'verify'

export type WorkedRunDecisionId = 'model' | 'loop' | 'trust' | 'run'

export interface WorkedRunDecisionInput {
  readonly id: string
  readonly verdict: string // 'MADE' | 'OPEN'
  readonly evidence: string
}

export interface WorkedRunGateInput {
  readonly id: string
  readonly status: string // 'PASS' | 'FAIL'
  readonly note: string
}

export interface WorkedRunInput {
  readonly id: string
  readonly name: string
  readonly generatedAt: string
  readonly fixture: boolean
  readonly source: string
  readonly decisions: readonly WorkedRunDecisionInput[]
  readonly gates: readonly WorkedRunGateInput[]
  readonly receipt: {
    readonly file: string
    readonly pointers: number
    readonly confirmed: number
    readonly failed: number
  }
}

export interface GateStageBinding {
  readonly gateId: WorkedRunGateId
  readonly stageId: string
  readonly stageOrdinal: number
  readonly artifactId: ArtifactId
  readonly evalId: EvalId
  readonly relatedDecisions: readonly WorkedRunDecisionId[]
}

/**
 * Deterministic 1-to-1 correspondence between the nine `/architect` worked-run
 * lifecycle gates and the nine `AcademyGraph.v1` flagship stages.
 */
export const WORKED_RUN_GATE_BINDINGS: readonly GateStageBinding[] = [
  {
    gateId: 'frame',
    stageId: 'stage:system-brief',
    stageOrdinal: 1,
    artifactId: 'artifact:system-brief',
    evalId: 'eval:system-brief-complete',
    relatedDecisions: [],
  },
  {
    gateId: 'decisions',
    stageId: 'stage:architecture-decision',
    stageOrdinal: 2,
    artifactId: 'artifact:architecture-decision',
    evalId: 'eval:adr-has-rejected-options',
    relatedDecisions: ['model', 'loop', 'run'],
  },
  {
    gateId: 'flow',
    stageId: 'stage:tool-authority-model',
    stageOrdinal: 3,
    artifactId: 'artifact:tool-authority-matrix',
    evalId: 'eval:authority-least-privilege',
    relatedDecisions: ['loop', 'trust'],
  },
  {
    gateId: 'evals',
    stageId: 'stage:eval-harness',
    stageOrdinal: 4,
    artifactId: 'artifact:eval-harness',
    evalId: 'eval:harness-fails-on-regression',
    relatedDecisions: ['trust'],
  },
  {
    gateId: 'trust',
    stageId: 'stage:threat-model',
    stageOrdinal: 5,
    artifactId: 'artifact:threat-model',
    evalId: 'eval:threat-model-covers-tool-results',
    relatedDecisions: ['trust'],
  },
  {
    gateId: 'economics',
    stageId: 'stage:cost-model',
    stageOrdinal: 6,
    artifactId: 'artifact:cost-model',
    evalId: 'eval:cost-model-has-ceiling',
    relatedDecisions: ['model', 'run'],
  },
  {
    gateId: 'operate',
    stageId: 'stage:deployment',
    stageOrdinal: 7,
    artifactId: 'artifact:deployment-record',
    evalId: 'eval:deployment-reachable',
    relatedDecisions: ['run'],
  },
  {
    gateId: 'discovery',
    stageId: 'stage:incident-simulation',
    stageOrdinal: 8,
    artifactId: 'artifact:incident-report',
    evalId: 'eval:incident-detected-by-telemetry',
    relatedDecisions: ['loop', 'trust'],
  },
  {
    gateId: 'verify',
    stageId: 'stage:portfolio-proof',
    stageOrdinal: 9,
    artifactId: 'artifact:portfolio-proof',
    evalId: 'eval:portfolio-links-resolve',
    relatedDecisions: [],
  },
] as const

export interface LabStageBinding {
  readonly labId: LabId
  readonly receiptSchema: string
  readonly artifactId: ArtifactId
  readonly evalId: EvalId
  readonly defaultEvidenceKind: EvidenceKind
}

export const LAB_STAGE_BINDINGS: Readonly<Record<string, LabStageBinding>> = {
  'lab:01-rag-pipeline': {
    labId: 'lab:01-rag-pipeline',
    receiptSchema: 'LabTestReceipt.v1',
    artifactId: 'artifact:eval-harness',
    evalId: 'eval:harness-fails-on-regression',
    defaultEvidenceKind: 'eval-run',
  },
  'lab:02-multi-agent-system': {
    labId: 'lab:02-multi-agent-system',
    receiptSchema: 'LabTestReceipt.v1',
    artifactId: 'artifact:architecture-decision',
    evalId: 'eval:adr-has-rejected-options',
    defaultEvidenceKind: 'eval-run',
  },
  'lab:03-mcp-server': {
    labId: 'lab:03-mcp-server',
    receiptSchema: 'LabTestReceipt.v1',
    artifactId: 'artifact:tool-authority-matrix',
    evalId: 'eval:authority-least-privilege',
    defaultEvidenceKind: 'eval-run',
  },
  'lab:04-eval-harness': {
    labId: 'lab:04-eval-harness',
    receiptSchema: 'LabTestReceipt.v1',
    artifactId: 'artifact:eval-harness',
    evalId: 'eval:harness-fails-on-regression',
    defaultEvidenceKind: 'repo-url',
  },
  'lab:04-trust-boundary-firewall': {
    labId: 'lab:04-trust-boundary-firewall',
    receiptSchema: 'TrustFirewallReceipt.v1',
    artifactId: 'artifact:threat-model',
    evalId: 'eval:threat-model-covers-tool-results',
    defaultEvidenceKind: 'eval-run',
  },
  'lab:05-tool-authority-gate': {
    labId: 'lab:05-tool-authority-gate',
    receiptSchema: 'LabTestReceipt.v1',
    artifactId: 'artifact:tool-authority-matrix',
    evalId: 'eval:authority-least-privilege',
    defaultEvidenceKind: 'eval-run',
  },
  'lab:05-eval-admission-gate': {
    labId: 'lab:05-eval-admission-gate',
    receiptSchema: 'EvalAdmissionReceipt.v1',
    artifactId: 'artifact:eval-harness',
    evalId: 'eval:harness-fails-on-regression',
    defaultEvidenceKind: 'eval-run',
  },
}

export interface LabCompletionReceipt {
  readonly labId: LabId
  readonly schema: string
  readonly runId: string
  readonly ranAt: string
  readonly admitted: boolean
  readonly locator: string
  readonly verifiedBy: string
  readonly receiptSha256: string
  readonly evidenceKind?: EvidenceKind
  readonly redGateFailures?: readonly string[]
}

export interface MappedLabEvidence {
  readonly labId: LabId
  readonly artifact: ArtifactId
  readonly evidence: Evidence
  readonly evalRun: EvalRun
}

export interface StageBridgeSummary {
  readonly gateId: WorkedRunGateId
  readonly stageId: string
  readonly stageOrdinal: number
  readonly artifactId: ArtifactId
  readonly evalId: EvalId
  readonly gateStatus: 'PASS' | 'FAIL'
  readonly note: string
}

export interface WorkedRunBridgeOptions {
  readonly learnerId?: string
  readonly verifierId?: string
  readonly asOf?: string
  readonly competencyId?: CompetencyId
  readonly additionalEvidence?: readonly Evidence[]
  readonly reviews?: readonly ReviewVerdict[]
  readonly labReceipts?: readonly LabCompletionReceipt[]
}

export interface WorkedRunBridgeProjection {
  readonly runId: string
  readonly fixture: boolean
  readonly asOf: string
  readonly learner: LearnerState
  readonly advance: AdvanceResult
  readonly portfolio: Portfolio
  readonly blockedGates: readonly WorkedRunGateId[]
  readonly openDecisions: readonly string[]
  readonly stageSummaries: readonly StageBridgeSummary[]
}

const SHA256_HEX_RE = /^[a-f0-9]{64}$/i

function findArtifact(graph: AcademyGraph, id: ArtifactId): Artifact | undefined {
  return graph.nodes.find((n): n is Artifact => n.kind === 'Artifact' && n.id === id)
}

function findEval(graph: AcademyGraph, id: EvalId): Eval | undefined {
  return graph.nodes.find((n): n is Eval => n.kind === 'Eval' && n.id === id)
}

/**
 * Validates and converts one deterministic lab completion receipt into an
 * `AcademyGraph.v1` `Evidence` record + `EvalRun` record.
 */
export function mapLabReceiptToEvidence(
  graph: AcademyGraph,
  learnerId: string,
  receipt: LabCompletionReceipt,
): MappedLabEvidence {
  const binding = LAB_STAGE_BINDINGS[receipt.labId]
  if (!binding) {
    throw new Error(`Unsupported labId in evidence bridge: ${receipt.labId}`)
  }
  if (!receipt.runId?.trim()) {
    throw new Error(`Lab receipt for ${receipt.labId} requires a non-empty runId.`)
  }
  if (!SHA256_HEX_RE.test(receipt.receiptSha256 ?? '')) {
    throw new Error(`Lab receipt for ${receipt.labId} carries an invalid SHA-256 digest.`)
  }
  if (!receipt.locator?.trim() || !receipt.verifiedBy?.trim()) {
    throw new Error(`Lab receipt for ${receipt.labId} requires non-empty locator and verifiedBy.`)
  }
  if (receipt.schema !== binding.receiptSchema && receipt.schema !== 'LabTestReceipt.v1') {
    throw new Error(
      `Schema mismatch for ${receipt.labId}: expected ${binding.receiptSchema}, got ${receipt.schema}.`,
    )
  }

  const artifactNode = findArtifact(graph, binding.artifactId)
  const evalNode = findEval(graph, binding.evalId)
  if (!artifactNode || !evalNode) {
    throw new Error(`Graph is missing target nodes (${binding.artifactId}, ${binding.evalId}).`)
  }

  const allAssertionIds = evalNode.assertions.map((a) => a.id)
  const cleanPass =
    receipt.admitted === true && (receipt.redGateFailures?.length ?? 0) === 0

  const evalRun: EvalRun = {
    evalId: evalNode.id,
    artifact: artifactNode.id,
    ranAt: receipt.ranAt,
    passedAssertions: cleanPass ? allAssertionIds : [],
    failedAssertions: cleanPass ? [] : allAssertionIds,
  }

  const evidenceKind = receipt.evidenceKind ?? binding.defaultEvidenceKind
  const slug = `${receipt.labId.replace(/^lab:/, '')}-${receipt.runId.replace(/[^a-zA-Z0-9_-]/g, '-')}`

  const evidence: Evidence = {
    id: `evidence:lab-${slug}`,
    kind: 'Evidence',
    title: `Lab receipt ${receipt.labId} (${receipt.schema})`,
    owner: learnerId,
    version: '1.0.0',
    visibility: artifactNode.publicSafe ? 'public' : 'cohort',
    provenance: {
      source: `${receipt.locator}#sha256=${receipt.receiptSha256.toLowerCase()}`,
      method: 'repo-scan',
      measuredAt: receipt.ranAt,
    },
    evaluationRule: {
      kind: 'reference-only',
      rationale: 'Evidence is verified by locator reachability and receipt SHA-256 parity.',
    },
    evidenceKind,
    artifact: artifactNode.id,
    locator: receipt.locator.trim(),
    verifiedAt: receipt.ranAt,
    verifiedBy: receipt.verifiedBy.trim(),
  }

  return {
    labId: receipt.labId,
    artifact: artifactNode.id,
    evidence,
    evalRun,
  }
}

/**
 * Immutably merges one or more deterministic lab completion receipts into an
 * existing `LearnerState`.
 */
export function mergeLabReceiptsIntoLearner(
  graph: AcademyGraph,
  baseLearner: LearnerState,
  receipts: readonly LabCompletionReceipt[],
): LearnerState {
  if (receipts.length === 0) return baseLearner

  const submitted = new Set<ArtifactId>(baseLearner.submittedArtifacts)
  const nextEvidence = [...baseLearner.evidence]
  const nextEvalRuns = [...baseLearner.evalRuns]

  for (const receipt of receipts) {
    const mapped = mapLabReceiptToEvidence(graph, baseLearner.learnerId, receipt)
    submitted.add(mapped.artifact)
    nextEvidence.push(mapped.evidence)
    nextEvalRuns.push(mapped.evalRun)
  }

  return {
    ...baseLearner,
    submittedArtifacts: [...submitted],
    evidence: nextEvidence,
    evalRuns: nextEvalRuns,
  }
}

/**
 * Bridges a worked-run trace (plus optional lab receipts, live deployment
 * locators, and independent review verdicts) into `AcademyGraph.v1` and
 * evaluates `advanceCapability()` + `projectPortfolio()`.
 */
export function bridgeWorkedRunToLearner(
  run: WorkedRunInput,
  options: WorkedRunBridgeOptions = {},
  graph: AcademyGraph = productionAgentSystemsGraph,
): WorkedRunBridgeProjection {
  const learnerId = options.learnerId ?? `learner:worked-run-${run.id}`
  const verifierId = options.verifierId ?? 'verifier:fresh-context-agent'
  const asOf = options.asOf ?? run.generatedAt
  const competencyId = options.competencyId ?? competencyShipProduction.id

  const gatesById = new Map(run.gates.map((g) => [g.id, g]))
  const openDecisions = run.decisions
    .filter((d) => d.verdict !== 'MADE')
    .map((d) => d.id)

  const submittedArtifacts: ArtifactId[] = []
  const evidence: Evidence[] = []
  const evalRuns: EvalRun[] = []
  const blockedGates: WorkedRunGateId[] = run.gates
    .filter((g) => g.status !== 'PASS')
    .map((g) => g.id as WorkedRunGateId)
  const stageSummaries: StageBridgeSummary[] = []

  for (const binding of WORKED_RUN_GATE_BINDINGS) {
    const gate = gatesById.get(binding.gateId)
    const gateStatus: 'PASS' | 'FAIL' = gate?.status === 'PASS' ? 'PASS' : 'FAIL'

    stageSummaries.push({
      gateId: binding.gateId,
      stageId: binding.stageId,
      stageOrdinal: binding.stageOrdinal,
      artifactId: binding.artifactId,
      evalId: binding.evalId,
      gateStatus,
      note: gate?.note ?? 'Gate missing from worked-run trace.',
    })

    const artifactNode = findArtifact(graph, binding.artifactId)
    const evalNode = findEval(graph, binding.evalId)
    if (!artifactNode || !evalNode) continue

    submittedArtifacts.push(artifactNode.id)

    // Worked-run fixtures live in a repository (`repo-url`), never a live customer
    // deployment (`deploy-url`). Passing `repo-url` here lets `advance.ts` honestly
    // refuse `stage:deployment` and `stage:incident-simulation` with
    // `evidence-kind-not-accepted` unless real `deploy-url` + witness records are added.
    evidence.push({
      id: `evidence:${run.id}-${binding.gateId}`,
      kind: 'Evidence',
      title: `Worked-run ${run.id} (${binding.gateId})`,
      owner: learnerId,
      version: '1.0.0',
      visibility: artifactNode.publicSafe ? 'public' : 'cohort',
      provenance: {
        source: `${run.source}#${binding.gateId}`,
        method: 'repo-scan',
        measuredAt: run.generatedAt,
      },
      evaluationRule: {
        kind: 'reference-only',
        rationale: 'Evidence is verified by reachability and receipt pointers.',
      },
      evidenceKind: 'repo-url',
      artifact: artifactNode.id,
      locator: `${run.source}/${binding.gateId}`,
      verifiedAt: run.generatedAt,
      verifiedBy: verifierId,
    })

    const assertions = evalNode.assertions.map((a) => a.id)
    const pointerHealthy = run.receipt.failed === 0 && run.receipt.confirmed > 0
    const evalPassed = gateStatus === 'PASS' && pointerHealthy

    evalRuns.push({
      evalId: evalNode.id,
      artifact: artifactNode.id,
      ranAt: run.generatedAt,
      passedAssertions: evalPassed ? assertions : [],
      failedAssertions: evalPassed ? [] : assertions,
    })
  }

  let learner: LearnerState = {
    learnerId,
    submittedArtifacts,
    evidence: [...evidence, ...(options.additionalEvidence ?? [])],
    evalRuns,
    reviews: [...(options.reviews ?? [])],
    grantedCompetencies: [],
  }

  if (options.labReceipts && options.labReceipts.length > 0) {
    learner = mergeLabReceiptsIntoLearner(graph, learner, options.labReceipts)
  }

  const advance = advanceCapability(graph, learner, competencyId, asOf)
  if (advance.granted) {
    learner = {
      ...learner,
      grantedCompetencies: [competencyId],
    }
  }

  const portfolio = projectPortfolio(graph, learner, asOf)

  return {
    runId: run.id,
    fixture: run.fixture,
    asOf,
    learner,
    advance,
    portfolio,
    blockedGates,
    openDecisions,
    stageSummaries,
  }
}

// --- Public Entry Tracks, Spine Blueprints & Vendor-Neutral Guard ------------

export const FORBIDDEN_PUBLIC_TERMS =
  /\b(?:adk|amazon|anthropic|aws|azure|bedrock|claude|cloudflare|gemini|github|google|gpt(?:-?4o)?|langfuse|langgraph|linear|llama|openai|opencode|oracle|oci|pinecone|slack|vercel|vertex(?: ai)?|workers ai)\b/i

/**
 * Enforces vendor neutrality on public curriculum surfaces, diagrams, and role
 * entry metadata. Throws deterministically if any vendor/platform name appears.
 */
export function assertVendorNeutralPublicText(label: string, text: string): void {
  const match = String(text ?? '').match(FORBIDDEN_PUBLIC_TERMS)
  if (match) {
    throw new Error(`Forbidden vendor term "${match[0]}" found in ${label}`)
  }
}

export type RoleEntryTrackId =
  | 'systems-architect'
  | 'agent-runtime-engineer'
  | 'technical-founder'
  | 'governance-eval-lead'
  | 'delegated-coding-agent'

export type ProofSurfaceHref = '/adr' | '/worked-run'

export interface RoleEntryTrackSpec {
  readonly id: RoleEntryTrackId
  readonly label: string
  readonly entryMode: 'human' | 'agent'
  readonly anchorHref: '#human' | '#agent'
  readonly stageId: string
  readonly stagePath: `/path/${string}`
  readonly dayOneDecision: string
  readonly labId: LabId
  readonly labCommand: `python labs/${string}/cli.py${string}`
  readonly labNote: string
  readonly proofHref: ProofSurfaceHref
  readonly proofLabel: string
  readonly proofSummary: string
}

export interface ResolvedRoleEntryTrack extends RoleEntryTrackSpec {
  readonly stageOrdinal: number
  readonly stageTitle: string
  readonly stageDecision: string
  readonly artifactId: ArtifactId
  readonly evalIds: readonly EvalId[]
  readonly receiptSchema: string
}

export const ROLE_ENTRY_TRACKS: readonly RoleEntryTrackSpec[] = [
  {
    id: 'systems-architect',
    label: 'Systems Architect',
    entryMode: 'human',
    anchorHref: '#human',
    stageId: 'stage:architecture-decision',
    stagePath: '/path/architecture-decision',
    dayOneDecision:
      'Assign one accountable owner per runtime plane, record at least one credible rejected option, and set an observable reversal trigger before writing loop code.',
    labId: 'lab:04-trust-boundary-firewall',
    labCommand: 'python labs/04-trust-boundary-firewall/cli.py --run-suite',
    labNote: 'Runs all adversarial quarantine, capability, spend, path, and SSRF scenarios offline using the Python standard library.',
    proofHref: '/adr',
    proofLabel: 'Inspect worked ADR-0001',
    proofSummary: 'Review the complete architecture decision template, rejected options, cost of being wrong, and revisit trigger.',
  },
  {
    id: 'agent-runtime-engineer',
    label: 'Agent Runtime Engineer',
    entryMode: 'human',
    anchorHref: '#human',
    stageId: 'stage:tool-authority-model',
    stagePath: '/path/tool-authority-model',
    dayOneDecision:
      'Isolate one revocable principal per side-effecting tool and quarantine untrusted counterparty payloads inside a data-only envelope.',
    labId: 'lab:04-trust-boundary-firewall',
    labCommand:
      'python labs/04-trust-boundary-firewall/cli.py --verify-candidate labs/04-trust-boundary-firewall/.lab/solution/firewall_solution.py',
    labNote: 'Verifies a candidate firewall implementation against deterministic prompt-breakout, path-traversal, and SSRF red gates.',
    proofHref: '/worked-run',
    proofLabel: 'Inspect forensic worked runs',
    proofSummary: 'Examine how unquarantined counterparty text and unowned client imports trigger explicit gate failures.',
  },
  {
    id: 'technical-founder',
    label: 'Technical Founder',
    entryMode: 'human',
    anchorHref: '#human',
    stageId: 'stage:system-brief',
    stagePath: '/path/system-brief',
    dayOneDecision:
      'Define one user job, explicit out-of-scope boundaries, per-unit cost ceiling, and the dated observation that stops the project before launch.',
    labId: 'lab:05-eval-admission-gate',
    labCommand: 'python labs/05-eval-admission-gate/cli.py --run-gate',
    labNote: 'Executes the offline meta-audit verifying baseline admission alongside non-compensable safety and drift blocks.',
    proofHref: '/adr',
    proofLabel: 'Read the free decision record',
    proofSummary: 'See how retrieval versus fine-tuning is decided under real team, data-handling, and budget constraints.',
  },
  {
    id: 'governance-eval-lead',
    label: 'Governance & Eval Lead',
    entryMode: 'human',
    anchorHref: '#human',
    stageId: 'stage:eval-harness',
    stagePath: '/path/eval-harness',
    dayOneDecision:
      'Lock golden, refusal, and injection suites apart from prompts under SHA-256 parity so one safety breach blocks release regardless of average score.',
    labId: 'lab:05-eval-admission-gate',
    labCommand:
      'python labs/05-eval-admission-gate/cli.py --verify-candidate labs/05-eval-admission-gate/.lab/solution/admission_gate_solution.py',
    labNote: 'Audits suite lock integrity, transcript-illusion detection, and monotonic grader calibration anchors offline.',
    proofHref: '/worked-run',
    proofLabel: 'Trace red-gate refusals',
    proofSummary: 'Verify how failing lifecycle gates map directly into non-bypassable AcademyGraph capability refusals.',
  },
  {
    id: 'delegated-coding-agent',
    label: 'Delegated Coding Agent',
    entryMode: 'agent',
    anchorHref: '#agent',
    stageId: 'stage:threat-model',
    stagePath: '/path/threat-model',
    dayOneDecision:
      'Operate strictly under an active human sponsor, treat retrieved repository and tool output as untrusted data, and halt on any red gate.',
    labId: 'lab:04-trust-boundary-firewall',
    labCommand: 'python labs/04-trust-boundary-firewall/cli.py --inject-fault F2_AMBIENT_AUTHORITY',
    labNote: 'Replays the ambient-authority fault check proving undeclared tool calls and secret-bearing arguments fail closed.',
    proofHref: '/worked-run',
    proofLabel: 'Verify fresh-context receipts',
    proofSummary: 'Inspect file-and-line receipt pointers that an independent verifier re-derives outside the authoring session.',
  },
] as const

export function resolveRoleEntryTrack(
  trackId: RoleEntryTrackId,
  project = projectProductionAgentSystems,
): ResolvedRoleEntryTrack {
  const track = ROLE_ENTRY_TRACKS.find((entry) => entry.id === trackId)
  if (!track) {
    throw new Error(`Unknown role entry track: ${trackId}`)
  }

  const stage = project.stages.find((candidate) => candidate.id === track.stageId)
  if (!stage) {
    throw new Error(`Role track ${track.id} references missing graph stage ${track.stageId}`)
  }

  const expectedPath = `/path/${stage.id.replace(/^stage:/, '')}`
  if (track.stagePath !== expectedPath) {
    throw new Error(
      `Role track ${track.id} stagePath mismatch: expected ${expectedPath}, got ${track.stagePath}`,
    )
  }

  const labBinding = LAB_STAGE_BINDINGS[track.labId]
  if (!labBinding) {
    throw new Error(`Role track ${track.id} references unsupported lab ${track.labId}`)
  }

  assertVendorNeutralPublicText(
    `ROLE_ENTRY_TRACKS[${track.id}]`,
    [
      track.label,
      track.dayOneDecision,
      track.labCommand,
      track.labNote,
      track.proofLabel,
      track.proofSummary,
    ].join('\n'),
  )

  return {
    ...track,
    stageOrdinal: stage.ordinal,
    stageTitle: stage.title,
    stageDecision: stage.decision,
    artifactId: stage.artifact,
    evalIds: stage.evals,
    receiptSchema: labBinding.receiptSchema,
  }
}

export type SpineBlueprintId =
  | 'four-plane-agent-runtime'
  | 'trust-boundary-firewall-flow'
  | 'twelve-week-progression-eval-gate'

export interface SpineBlueprintProofLink {
  readonly href: ProofSurfaceHref
  readonly label: string
}

export interface SpineBlueprintPlate {
  readonly id: SpineBlueprintId
  readonly shortLabel: string
  readonly eyebrow: string
  readonly title: string
  readonly src: `/images/diagrams/spine/${SpineBlueprintId}.svg`
  readonly publicFile: `site/public/images/diagrams/spine/${SpineBlueprintId}.svg`
  readonly width: number
  readonly height: number
  readonly alt: string
  readonly summary: string
  readonly invariants: readonly string[]
  readonly stageIds: readonly string[]
  readonly labIds: readonly LabId[]
  readonly proofLinks: readonly SpineBlueprintProofLink[]
}

export const SPINE_BLUEPRINT_PLATES: readonly SpineBlueprintPlate[] = [
  {
    id: 'four-plane-agent-runtime',
    shortLabel: 'Four-plane runtime',
    eyebrow: 'Production substrate · Explicit plane ownership',
    title: 'Four-plane agent runtime & verification bar',
    src: '/images/diagrams/spine/four-plane-agent-runtime.svg',
    publicFile: 'site/public/images/diagrams/spine/four-plane-agent-runtime.svg',
    width: 1200,
    height: 540,
    alt: 'Four-plane production agent runtime architecture showing the model call seam, orchestration loop, trust and authority firewall, and long-run verification receipts.',
    summary:
      'Separates the client call seam, code-owned orchestration loop, trust-and-authority firewall, and durable verification receipts so every failure mode maps to one accountable plane owner.',
    invariants: [
      'One client call seam enforces model routing, request timeouts, and per-unit spend caps; unowned client imports fail review.',
      'Orchestration exit rules, retry budgets, and escalation branches execute in deterministic code rather than prompt instructions.',
      'Advancement requires public-safe or cohort-redacted artifacts, reachable locators, deterministic eval runs, and independent human review.',
    ],
    stageIds: [
      'stage:architecture-decision',
      'stage:tool-authority-model',
      'stage:cost-model',
      'stage:deployment',
    ],
    labIds: ['lab:04-trust-boundary-firewall', 'lab:05-eval-admission-gate'],
    proofLinks: [
      { href: '/adr', label: 'Inspect worked ADR' },
      { href: '/worked-run', label: 'Inspect worked-run gates' },
    ],
  },
  {
    id: 'trust-boundary-firewall-flow',
    shortLabel: 'Trust-boundary firewall',
    eyebrow: 'Lab 04 · Non-compensable security boundary',
    title: 'Trust-boundary firewall: quarantine & fail-closed gates',
    src: '/images/diagrams/spine/trust-boundary-firewall-flow.svg',
    publicFile: 'site/public/images/diagrams/spine/trust-boundary-firewall-flow.svg',
    width: 1200,
    height: 520,
    alt: 'Trust-boundary firewall flow isolating operator instructions from untrusted counterparty payloads across capability allowlist, approval token, sandbox path, and offline SSRF gates.',
    summary:
      'Quarantines untrusted counterparty payloads away from system instructions and gates every tool call through capability allowlists, single-use human approval tokens, path containment, and offline SSRF checks.',
    invariants: [
      'Retrieved documents, tickets, and webhooks stay inside an XML-escaped user data block and never enter the system instruction channel.',
      'Side-effecting writes require one dedicated revocable principal plus a digest-bound single-use human approval token within spend limits.',
      'Sandbox path escapes and loopback, private-network, or metadata egress targets fail closed before I/O and log to TrustFirewallReceipt.v1.',
    ],
    stageIds: ['stage:tool-authority-model', 'stage:threat-model'],
    labIds: ['lab:04-trust-boundary-firewall'],
    proofLinks: [
      { href: '/worked-run', label: 'Trace T3 injection finding' },
      { href: '/adr', label: 'Read decision template' },
    ],
  },
  {
    id: 'twelve-week-progression-eval-gate',
    shortLabel: 'Progression & eval gate',
    eyebrow: 'Three-act path · Non-compensable admission',
    title: 'Twelve-week progression & eval admission gate',
    src: '/images/diagrams/spine/twelve-week-progression-eval-gate.svg',
    publicFile: 'site/public/images/diagrams/spine/twelve-week-progression-eval-gate.svg',
    width: 1200,
    height: 540,
    alt: 'Three-act twelve-week progression mapping framing, protocol seams, trust harnesses, and live operational drills into the non-compensable evaluation admission gate.',
    summary:
      'Connects system framing and protocol seams, trust and regression harnesses, and witnessed operational drills into the SHA-256 locked EvalAdmissionReceipt.v1 gate feeding advanceCapability().',
    invariants: [
      'Golden, refusal, and injection suites carry a SHA-256 lock file; silent threshold or fixture edits by the candidate author block admission.',
      'Calibration anchors verify monotonic grader ordering across weak, borderline, and strong samples within a strict drift tolerance.',
      'Safety red gates remain non-compensable: high aggregate pass percentages never mask a single forbidden side-effect or fabricated citation.',
    ],
    stageIds: [
      'stage:system-brief',
      'stage:eval-harness',
      'stage:incident-simulation',
      'stage:portfolio-proof',
    ],
    labIds: ['lab:05-eval-admission-gate'],
    proofLinks: [
      { href: '/worked-run', label: 'Verify bridged refusals' },
      { href: '/adr', label: 'Open worked decision' },
    ],
  },
] as const
