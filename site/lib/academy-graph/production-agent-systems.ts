/**
 * The flagship path: production agent systems.
 *
 * One project, nine stages, each ending in an artifact that a stranger can open
 * and an eval that can be re-run. The stages are the decisions that actually
 * separate a demo agent from one you can put in front of a customer, in the order
 * you are forced to make them.
 *
 * Every node here is authored content owned by Frank Riemer. Nothing in this file
 * asserts that any learner has completed anything.
 */

import {
  ACADEMY_GRAPH_VERSION,
  type AcademyGraph,
  type AcademyEdge,
  type Artifact,
  type Competency,
  type Eval,
  type EvidenceRule,
  type FailureMode,
  type Lab,
  type Pattern,
  type Prerequisite,
  type Project,
  type ProjectStage,
  type Provenance,
  type Review,
  type Role,
  type SemVer,
} from './types.ts'

const OWNER = 'frank@frankx.ai'
const V: SemVer = '1.0.0'
const MEASURED_AT = '2026-09-02'

const authored = (source: string): Provenance => ({
  source,
  method: 'authored',
  measuredAt: MEASURED_AT,
})

/** Default evidence bar for the flagship: one third-party-openable locator, fresh. */
const STANDARD_EVIDENCE: EvidenceRule = {
  accepts: ['repo-url', 'eval-run'],
  minimumCount: 1,
  maxAgeDays: 365,
}

/** The deployment stage demands something actually running, and recently. */
const RUNNING_EVIDENCE: EvidenceRule = {
  accepts: ['deploy-url'],
  minimumCount: 1,
  maxAgeDays: 90,
}

/**
 * The incident simulation needs the running system *and* a named witness. A
 * report of an incident nobody else saw is a story, so an attestation from a
 * reviewer is required alongside the deployment — and it may never be the
 * learner's own (enforced in `advance.ts`).
 */
const WITNESSED_EVIDENCE: EvidenceRule = {
  accepts: ['deploy-url', 'reviewer-attestation'],
  minimumCount: 2,
  maxAgeDays: 90,
}

// --- Roles -------------------------------------------------------------------

export const roleProductionArchitect: Role = {
  id: 'role:production-agent-architect',
  kind: 'Role',
  title: 'Production agent systems architect',
  owner: OWNER,
  version: V,
  visibility: 'public',
  provenance: authored('site/lib/academy-graph/production-agent-systems.ts'),
  evaluationRule: {
    kind: 'reference-only',
    rationale: 'A role is an aim, not a claim. Only its competencies are evaluated.',
  },
  competencies: ['competency:ship-a-production-agent-system'],
  notAClaimOf:
    'This is not a certification, an accreditation, or a statement about employability. It records that specific artifacts passed specific evals.',
}

export const roleIndependentReviewer: Role = {
  id: 'role:independent-reviewer',
  kind: 'Role',
  title: 'Independent reviewer',
  owner: OWNER,
  version: V,
  visibility: 'cohort',
  provenance: authored('site/lib/academy-graph/production-agent-systems.ts'),
  evaluationRule: {
    kind: 'reference-only',
    rationale: 'Reviewer eligibility is a membership question, not an evaluated capability.',
  },
  competencies: ['competency:ship-a-production-agent-system'],
  notAClaimOf: 'Reviewers are peers who already hold the competency. They are not staff.',
}

// --- Patterns and their failure modes ----------------------------------------

export const patternToolAuthority: Pattern = {
  id: 'pattern:bounded-tool-authority',
  kind: 'Pattern',
  title: 'Bounded tool authority',
  owner: OWNER,
  version: V,
  visibility: 'public',
  provenance: authored('01-design-patterns/multi-agent-orchestration-pattern.md'),
  evaluationRule: {
    kind: 'reference-only',
    rationale: 'Patterns teach. Competency is granted against artifacts, not reading.',
  },
  problem:
    'An agent given a tool is given the authority behind that tool. Most incidents are authority incidents, not model incidents.',
  appliesWhen: [
    'The agent can write, send, spend, or delete',
    'Tool results re-enter the context window as text',
    'More than one caller shares one credential',
  ],
  repoPath: '01-design-patterns/multi-agent-orchestration-pattern.md',
  knownFailureModes: ['failure:tool-result-injection', 'failure:ambient-authority'],
}

export const patternEvalHarness: Pattern = {
  id: 'pattern:eval-before-deploy',
  kind: 'Pattern',
  title: 'Eval harness before deploy',
  owner: OWNER,
  version: V,
  visibility: 'public',
  provenance: authored('07-evaluation/eval-harness.md'),
  evaluationRule: {
    kind: 'reference-only',
    rationale: 'Patterns teach. Competency is granted against artifacts, not reading.',
  },
  problem:
    'Without a harness, every prompt change is an unmeasured production change and every regression is discovered by a customer.',
  appliesWhen: [
    'Prompts or models will change after launch',
    'A wrong answer costs more than a slow answer',
    'More than one person can edit the system prompt',
  ],
  repoPath: '07-evaluation/eval-harness.md',
  knownFailureModes: ['failure:eval-rewritten-with-the-code'],
}

export const failureToolResultInjection: FailureMode = {
  id: 'failure:tool-result-injection',
  kind: 'FailureMode',
  title: 'Tool results treated as instructions',
  owner: OWNER,
  version: V,
  visibility: 'public',
  provenance: authored('08-governance/incident-response-checklist.md'),
  evaluationRule: {
    kind: 'reference-only',
    rationale: 'Failure modes are injected by the incident simulation, not evaluated directly.',
  },
  pattern: 'pattern:bounded-tool-authority',
  symptom:
    'Text fetched by a tool contains directives; the agent follows them and takes an action the user never asked for.',
  detection:
    'Assert in the eval harness that a fixture containing an embedded instruction produces no tool call outside the declared authority set.',
  mitigation:
    'Treat every tool result as untrusted data. Gate side-effecting tools behind an explicit authority check that the model cannot author.',
  injectable: true,
}

export const failureAmbientAuthority: FailureMode = {
  id: 'failure:ambient-authority',
  kind: 'FailureMode',
  title: 'One credential behind every tool',
  owner: OWNER,
  version: V,
  visibility: 'public',
  provenance: authored('08-governance/model-risk.md'),
  evaluationRule: {
    kind: 'reference-only',
    rationale: 'Failure modes are injected by the incident simulation, not evaluated directly.',
  },
  pattern: 'pattern:bounded-tool-authority',
  symptom:
    'Blast radius equals the credential, not the task. A prompt-level mistake becomes an account-level incident.',
  detection:
    'The tool authority matrix has more tools than distinct principals. Count them; the mismatch is the finding.',
  mitigation:
    'One principal per authority class, least privilege per tool, and a documented revocation path per principal.',
  injectable: true,
}

export const failureEvalRewritten: FailureMode = {
  id: 'failure:eval-rewritten-with-the-code',
  kind: 'FailureMode',
  title: 'The eval is edited in the commit it should have blocked',
  owner: OWNER,
  version: V,
  visibility: 'public',
  provenance: authored('07-evaluation/metrics.md'),
  evaluationRule: {
    kind: 'reference-only',
    rationale: 'Failure modes are injected by the incident simulation, not evaluated directly.',
  },
  pattern: 'pattern:eval-before-deploy',
  symptom:
    'A suite reports green forever because the assertions changed alongside the behaviour they guarded.',
  detection:
    'Diff the eval fixtures against the parent commit whenever an eval and its target change together.',
  mitigation:
    'Fixtures are versioned separately from the system under test, and a fixture change requires an independent reviewer.',
  injectable: true,
}

// --- Labs (existing repo content, wired in rather than re-invented) -----------

export const labRagPipeline: Lab = {
  id: 'lab:01-rag-pipeline',
  kind: 'Lab',
  title: 'RAG pipeline',
  owner: OWNER,
  version: V,
  visibility: 'public',
  provenance: { source: 'labs/01-rag-pipeline', method: 'repo-scan', measuredAt: MEASURED_AT },
  evaluationRule: {
    kind: 'reference-only',
    rationale: 'Labs build fluency. Only the flagship project grants competency.',
  },
  repoPath: 'labs/01-rag-pipeline',
  estimatedHours: 4,
  produces: [],
  teaches: ['pattern:eval-before-deploy'],
}

export const labMultiAgent: Lab = {
  id: 'lab:02-multi-agent-system',
  kind: 'Lab',
  title: 'Multi-agent system',
  owner: OWNER,
  version: V,
  visibility: 'public',
  provenance: {
    source: 'labs/02-multi-agent-system',
    method: 'repo-scan',
    measuredAt: MEASURED_AT,
  },
  evaluationRule: {
    kind: 'reference-only',
    rationale: 'Labs build fluency. Only the flagship project grants competency.',
  },
  repoPath: 'labs/02-multi-agent-system',
  estimatedHours: 6,
  produces: [],
  teaches: ['pattern:bounded-tool-authority'],
}

export const labMcpServer: Lab = {
  id: 'lab:03-mcp-server',
  kind: 'Lab',
  title: 'MCP server',
  owner: OWNER,
  version: V,
  visibility: 'public',
  provenance: { source: 'labs/03-mcp-server', method: 'repo-scan', measuredAt: MEASURED_AT },
  evaluationRule: {
    kind: 'reference-only',
    rationale: 'Labs build fluency. Only the flagship project grants competency.',
  },
  repoPath: 'labs/03-mcp-server',
  estimatedHours: 5,
  produces: [],
  teaches: ['pattern:bounded-tool-authority'],
}

// --- Artifacts ---------------------------------------------------------------

type ArtifactSeed = Pick<
  Artifact,
  'id' | 'title' | 'artifactKind' | 'format' | 'requiredSections' | 'publicSafe' | 'redactionRule'
> & { evalId: `eval:${string}` }

const artifactSeeds: readonly ArtifactSeed[] = [
  {
    id: 'artifact:system-brief',
    title: 'System brief',
    artifactKind: 'system-brief',
    format: 'markdown',
    requiredSections: [
      'user and job',
      'in scope',
      'explicitly out of scope',
      'success measure',
      'kill criterion',
    ],
    publicSafe: true,
    redactionRule: ['employer name', 'customer name'],
    evalId: 'eval:system-brief-complete',
  },
  {
    id: 'artifact:architecture-decision',
    title: 'Architecture decision record',
    artifactKind: 'architecture-decision-record',
    format: 'markdown',
    requiredSections: [
      'context',
      'options considered',
      'decision',
      'consequences',
      'what would reverse this',
    ],
    publicSafe: true,
    redactionRule: ['internal system names'],
    evalId: 'eval:adr-has-rejected-options',
  },
  {
    id: 'artifact:tool-authority-matrix',
    title: 'Tool and authority model',
    artifactKind: 'tool-authority-matrix',
    format: 'json',
    requiredSections: ['tools', 'principals', 'sideEffecting', 'revocationPath'],
    publicSafe: true,
    redactionRule: ['credential names', 'endpoint hostnames'],
    evalId: 'eval:authority-least-privilege',
  },
  {
    id: 'artifact:eval-harness',
    title: 'Eval harness',
    artifactKind: 'eval-harness',
    format: 'code',
    requiredSections: ['fixtures', 'assertions', 'baseline run', 'failure exit code'],
    publicSafe: true,
    redactionRule: ['production fixture data'],
    evalId: 'eval:harness-fails-on-regression',
  },
  {
    id: 'artifact:threat-model',
    title: 'Threat model',
    artifactKind: 'threat-model',
    format: 'markdown',
    requiredSections: [
      'trust boundaries',
      'untrusted inputs',
      'abuse cases',
      'mitigations',
      'accepted risks',
    ],
    publicSafe: false,
    redactionRule: ['everything: threat models are cohort-visible only'],
    evalId: 'eval:threat-model-covers-tool-results',
  },
  {
    id: 'artifact:cost-model',
    title: 'Cost model',
    artifactKind: 'cost-model',
    format: 'json',
    requiredSections: ['unitOfWork', 'tokensPerUnit', 'costPerUnit', 'ceiling', 'runawayGuard'],
    publicSafe: true,
    redactionRule: ['negotiated vendor rates'],
    evalId: 'eval:cost-model-has-ceiling',
  },
  {
    id: 'artifact:deployment-record',
    title: 'Deployment record',
    artifactKind: 'deployment-record',
    format: 'url',
    requiredSections: ['live URL', 'rollback command', 'observability locator'],
    publicSafe: true,
    redactionRule: ['internal URLs'],
    evalId: 'eval:deployment-reachable',
  },
  {
    id: 'artifact:incident-report',
    title: 'Incident simulation report',
    artifactKind: 'incident-report',
    format: 'markdown',
    requiredSections: [
      'injected failure mode',
      'time to detection',
      'what the telemetry showed',
      'fix',
      'guard added',
    ],
    publicSafe: false,
    redactionRule: ['everything: incident reports are cohort-visible only'],
    evalId: 'eval:incident-detected-by-telemetry',
  },
  {
    id: 'artifact:portfolio-proof',
    title: 'Public-safe portfolio proof',
    artifactKind: 'portfolio-page',
    format: 'markdown',
    requiredSections: ['what it does', 'the decision you defend', 'evidence links'],
    publicSafe: true,
    redactionRule: [],
    evalId: 'eval:portfolio-links-resolve',
  },
] as const

export const artifacts: readonly Artifact[] = artifactSeeds.map((seed) => ({
  id: seed.id,
  kind: 'Artifact' as const,
  title: seed.title,
  owner: OWNER,
  version: V,
  visibility: seed.publicSafe ? ('public' as const) : ('cohort' as const),
  provenance: authored('site/lib/academy-graph/production-agent-systems.ts'),
  evaluationRule: { kind: 'eval' as const, evalId: seed.evalId },
  artifactKind: seed.artifactKind,
  format: seed.format,
  requiredSections: seed.requiredSections,
  publicSafe: seed.publicSafe,
  redactionRule: seed.redactionRule,
}))

// --- Evals -------------------------------------------------------------------

type EvalSeed = {
  id: `eval:${string}`
  title: string
  target: Artifact['id']
  assertions: readonly { id: string; description: string; check: string }[]
}

const evalSeeds: readonly EvalSeed[] = [
  {
    id: 'eval:system-brief-complete',
    title: 'The brief names a job and a way to be wrong',
    target: 'artifact:system-brief',
    assertions: [
      {
        id: 'has-out-of-scope',
        description: 'An explicit out-of-scope section exists and is not empty.',
        check: 'Parse headings; the out-of-scope section has at least two bullets.',
      },
      {
        id: 'has-kill-criterion',
        description: 'A condition is stated under which the project would be stopped.',
        check: 'The kill-criterion section contains a measurable threshold or date.',
      },
    ],
  },
  {
    id: 'eval:adr-has-rejected-options',
    title: 'The ADR rejects something specific',
    target: 'artifact:architecture-decision',
    assertions: [
      {
        id: 'two-options-minimum',
        description: 'At least two options were considered and one was rejected with a reason.',
        check: 'Count entries under options considered; require >= 2 and a stated rejection reason.',
      },
      {
        id: 'reversal-condition',
        description: 'The record states what evidence would reverse the decision.',
        check: 'A non-empty "what would reverse this" section exists.',
      },
    ],
  },
  {
    id: 'eval:authority-least-privilege',
    title: 'Authority is bounded per tool',
    target: 'artifact:tool-authority-matrix',
    assertions: [
      {
        id: 'side-effecting-flagged',
        description: 'Every tool declares whether it is side-effecting.',
        check: 'Each entry in tools[] has a boolean sideEffecting.',
      },
      {
        id: 'no-shared-principal-for-writes',
        description: 'No single principal backs more than one side-effecting tool.',
        check: 'Group side-effecting tools by principal; assert every group size is 1.',
      },
      {
        id: 'revocation-documented',
        description: 'Each principal has a revocation path.',
        check: 'Each principal has a non-empty revocationPath string.',
      },
    ],
  },
  {
    id: 'eval:harness-fails-on-regression',
    title: 'The harness can actually fail',
    target: 'artifact:eval-harness',
    assertions: [
      {
        id: 'nonzero-exit',
        description: 'A deliberately broken fixture makes the harness exit non-zero.',
        check: 'Run the harness against the seeded regression fixture; require exit code != 0.',
      },
      {
        id: 'fixtures-versioned-apart',
        description: 'Fixtures are not edited in the same commit as the system under test.',
        check: 'Diff the submitted commit; fixtures and prompts must not both change.',
      },
    ],
  },
  {
    id: 'eval:threat-model-covers-tool-results',
    title: 'Tool output is treated as untrusted',
    target: 'artifact:threat-model',
    assertions: [
      {
        id: 'tool-results-untrusted',
        description: 'Tool and retrieval output appears in the untrusted-inputs list.',
        check: 'The untrusted-inputs section names tool results or retrieved documents.',
      },
      {
        id: 'accepted-risks-named',
        description: 'At least one risk is explicitly accepted rather than silently ignored.',
        check: 'The accepted-risks section is non-empty.',
      },
    ],
  },
  {
    id: 'eval:cost-model-has-ceiling',
    title: 'Cost has a ceiling and a guard',
    target: 'artifact:cost-model',
    assertions: [
      {
        id: 'unit-economics',
        description: 'Cost is expressed per unit of work, not per month in aggregate.',
        check: 'unitOfWork and costPerUnit are both present and numeric where applicable.',
      },
      {
        id: 'runaway-guard',
        description: 'A mechanism stops spend when the ceiling is hit.',
        check: 'runawayGuard names an enforcing mechanism, not an alert alone.',
      },
    ],
  },
  {
    id: 'eval:deployment-reachable',
    title: 'It is actually deployed',
    target: 'artifact:deployment-record',
    assertions: [
      {
        id: 'responds-200',
        description: 'The live URL responds successfully to an unauthenticated third party.',
        check: 'HTTP GET the deploy URL; require a 2xx and a non-empty body.',
      },
      {
        id: 'rollback-exists',
        description: 'A rollback path is written down before it is needed.',
        check: 'The rollback command section is non-empty.',
      },
    ],
  },
  {
    id: 'eval:incident-detected-by-telemetry',
    title: 'The incident was caught by instrumentation, not by reading the code',
    target: 'artifact:incident-report',
    assertions: [
      {
        id: 'injected-mode-named',
        description: 'The report names which failure mode was injected.',
        check: 'The injected failure mode matches a FailureMode id with injectable = true.',
      },
      {
        id: 'detection-source-is-telemetry',
        description: 'Detection came from a signal that exists in the deployed system.',
        check: 'The telemetry section cites a log, metric, or eval that predates the injection.',
      },
      {
        id: 'guard-added',
        description: 'A new guard or assertion was added so the same failure fails loudly next time.',
        check: 'The guard section links to a commit adding an assertion or check.',
      },
    ],
  },
  {
    id: 'eval:portfolio-links-resolve',
    title: 'The portfolio proves rather than asserts',
    target: 'artifact:portfolio-proof',
    assertions: [
      {
        id: 'links-resolve',
        description: 'Every evidence link resolves for a logged-out visitor.',
        check: 'HTTP GET each link without credentials; require 2xx.',
      },
      {
        id: 'no-redacted-leakage',
        description: 'Nothing on the redaction list of any source artifact appears.',
        check: 'Scan the rendered text against the union of redactionRule entries.',
      },
    ],
  },
] as const

export const evals: readonly Eval[] = evalSeeds.map((seed) => ({
  id: seed.id,
  kind: 'Eval' as const,
  title: seed.title,
  owner: OWNER,
  version: V,
  visibility: 'public' as const,
  provenance: authored('site/lib/academy-graph/production-agent-systems.ts'),
  evaluationRule: { kind: 'eval' as const, evalId: seed.id },
  target: seed.target,
  assertions: seed.assertions,
  passThreshold: 1,
}))

// --- Reviews -----------------------------------------------------------------

export const reviewArchitecture: Review = {
  id: 'review:architecture-defence',
  kind: 'Review',
  title: 'Architecture decision defence',
  owner: OWNER,
  version: V,
  visibility: 'cohort',
  provenance: authored('site/lib/academy-graph/production-agent-systems.ts'),
  evaluationRule: { kind: 'review', reviewId: 'review:architecture-defence' },
  target: 'artifact:architecture-decision',
  rubric: [
    'The rejected option is one a reasonable engineer would have chosen.',
    'The consequences section names a cost the author is accepting, not only benefits.',
    'The reversal condition is observable without asking the author.',
  ],
  reviewerRole: 'role:independent-reviewer',
  requiresIndependentReviewer: true,
}

export const reviewIncident: Review = {
  id: 'review:incident-honesty',
  kind: 'Review',
  title: 'Incident report honesty check',
  owner: OWNER,
  version: V,
  visibility: 'cohort',
  provenance: authored('site/lib/academy-graph/production-agent-systems.ts'),
  evaluationRule: { kind: 'review', reviewId: 'review:incident-honesty' },
  target: 'artifact:incident-report',
  rubric: [
    'The detection signal existed before the injection, not added afterwards to look good.',
    'Time to detection is measured, not estimated.',
    'The guard would fail on a replay of the original injection.',
  ],
  reviewerRole: 'role:independent-reviewer',
  requiresIndependentReviewer: true,
}

export const reviews: readonly Review[] = [reviewArchitecture, reviewIncident]

// --- The project -------------------------------------------------------------

const stages: readonly ProjectStage[] = [
  {
    id: 'stage:system-brief',
    ordinal: 1,
    title: 'System brief',
    decision: 'Whose job is this and what would make you stop building it.',
    artifact: 'artifact:system-brief',
    evals: ['eval:system-brief-complete'],
    reviews: [],
    evidenceRule: STANDARD_EVIDENCE,
  },
  {
    id: 'stage:architecture-decision',
    ordinal: 2,
    title: 'Architecture decision',
    decision: 'Which shape, and which credible alternative you are rejecting and why.',
    artifact: 'artifact:architecture-decision',
    evals: ['eval:adr-has-rejected-options'],
    reviews: ['review:architecture-defence'],
    evidenceRule: STANDARD_EVIDENCE,
  },
  {
    id: 'stage:tool-authority-model',
    ordinal: 3,
    title: 'Tool and authority model',
    decision: 'What the agent may do, as what principal, and how you take it back.',
    artifact: 'artifact:tool-authority-matrix',
    evals: ['eval:authority-least-privilege'],
    reviews: [],
    evidenceRule: STANDARD_EVIDENCE,
  },
  {
    id: 'stage:eval-harness',
    ordinal: 4,
    title: 'Eval harness',
    decision: 'What a regression looks like, before you are allowed to ship a change.',
    artifact: 'artifact:eval-harness',
    evals: ['eval:harness-fails-on-regression'],
    reviews: [],
    evidenceRule: { accepts: ['repo-url', 'eval-run'], minimumCount: 2, maxAgeDays: 365 },
  },
  {
    id: 'stage:threat-model',
    ordinal: 5,
    title: 'Threat model',
    decision: 'Which inputs you do not trust, and which risks you are consciously accepting.',
    artifact: 'artifact:threat-model',
    evals: ['eval:threat-model-covers-tool-results'],
    reviews: [],
    evidenceRule: STANDARD_EVIDENCE,
  },
  {
    id: 'stage:cost-model',
    ordinal: 6,
    title: 'Cost model',
    decision: 'What one unit of work costs and what stops the bill when it runs away.',
    artifact: 'artifact:cost-model',
    evals: ['eval:cost-model-has-ceiling'],
    reviews: [],
    evidenceRule: STANDARD_EVIDENCE,
  },
  {
    id: 'stage:deployment',
    ordinal: 7,
    title: 'Deployment',
    decision: 'Put it somewhere a stranger can reach, with a rollback you have tested.',
    artifact: 'artifact:deployment-record',
    evals: ['eval:deployment-reachable'],
    reviews: [],
    evidenceRule: RUNNING_EVIDENCE,
  },
  {
    id: 'stage:incident-simulation',
    ordinal: 8,
    title: 'Incident simulation',
    decision: 'Break it on purpose and find out whether your instrumentation notices.',
    artifact: 'artifact:incident-report',
    evals: ['eval:incident-detected-by-telemetry'],
    reviews: ['review:incident-honesty'],
    evidenceRule: WITNESSED_EVIDENCE,
  },
  {
    id: 'stage:portfolio-proof',
    ordinal: 9,
    title: 'Public-safe portfolio proof',
    decision: 'What you can show publicly without leaking an employer or a customer.',
    artifact: 'artifact:portfolio-proof',
    evals: ['eval:portfolio-links-resolve'],
    reviews: [],
    evidenceRule: STANDARD_EVIDENCE,
  },
] as const

export const projectProductionAgentSystems: Project = {
  id: 'project:production-agent-systems',
  kind: 'Project',
  title: 'Production agent systems',
  owner: OWNER,
  version: V,
  visibility: 'public',
  provenance: authored('site/lib/academy-graph/production-agent-systems.ts'),
  evaluationRule: {
    kind: 'reference-only',
    rationale: 'The project is a container. Each stage carries its own eval and review.',
  },
  brief:
    'Take one agent system from a written brief to a deployed system you have broken on purpose, and leave behind evidence a stranger can check.',
  stages,
  grants: ['competency:ship-a-production-agent-system'],
}

// --- Competency and its gate -------------------------------------------------

export const prereqShipProduction: Prerequisite = {
  id: 'prereq:ship-a-production-agent-system',
  kind: 'Prerequisite',
  title: 'Prerequisites for shipping a production agent system',
  owner: OWNER,
  version: V,
  visibility: 'public',
  provenance: authored('site/lib/academy-graph/production-agent-systems.ts'),
  evaluationRule: {
    kind: 'reference-only',
    rationale: 'A gate is checked by advanceCapability, not scored on its own.',
  },
  of: 'competency:ship-a-production-agent-system',
  requires: [],
  rule: 'all',
}

export const competencyShipProduction: Competency = {
  id: 'competency:ship-a-production-agent-system',
  kind: 'Competency',
  title: 'Ship a production agent system',
  owner: OWNER,
  version: V,
  visibility: 'public',
  provenance: authored('site/lib/academy-graph/production-agent-systems.ts'),
  evaluationRule: {
    kind: 'reference-only',
    rationale:
      'The competency is the conjunction of its required evals and reviews; it has no separate score.',
  },
  level: 'architect',
  claim:
    'Can take an agent system from brief to deployment with a bounded authority model, a harness that fails on regression, a stated cost ceiling, and an incident their own telemetry detected.',
  prerequisites: ['prereq:ship-a-production-agent-system'],
  requiredArtifacts: artifacts.map((a) => a.id),
  requiredEvals: evals.map((e) => e.id),
  requiredReviews: reviews.map((r) => r.id),
}

// --- Edges -------------------------------------------------------------------

const edgeBase = {
  owner: OWNER,
  version: V,
  visibility: 'public' as const,
  provenance: authored('site/lib/academy-graph/production-agent-systems.ts'),
  evaluationRule: {
    kind: 'reference-only' as const,
    rationale: 'Edges describe structure; the nodes they join carry the evaluation.',
  },
}

export const edges: readonly AcademyEdge[] = [
  {
    id: 'edge:project-grants-competency',
    kind: 'grants',
    from: projectProductionAgentSystems.id,
    to: competencyShipProduction.id,
    ...edgeBase,
  },
  {
    id: 'edge:competency-requires-prereq',
    kind: 'requires',
    from: competencyShipProduction.id,
    to: prereqShipProduction.id,
    ...edgeBase,
  },
  {
    id: 'edge:role-targets-competency',
    kind: 'targets',
    from: roleProductionArchitect.id,
    to: competencyShipProduction.id,
    ...edgeBase,
  },
  {
    id: 'edge:authority-breaks-as-injection',
    kind: 'breaks-as',
    from: patternToolAuthority.id,
    to: failureToolResultInjection.id,
    ...edgeBase,
  },
  {
    id: 'edge:authority-breaks-as-ambient',
    kind: 'breaks-as',
    from: patternToolAuthority.id,
    to: failureAmbientAuthority.id,
    ...edgeBase,
  },
  {
    id: 'edge:harness-breaks-as-rewritten',
    kind: 'breaks-as',
    from: patternEvalHarness.id,
    to: failureEvalRewritten.id,
    ...edgeBase,
  },
  {
    id: 'edge:lab-multi-agent-teaches-authority',
    kind: 'teaches',
    from: labMultiAgent.id,
    to: patternToolAuthority.id,
    ...edgeBase,
  },
  {
    id: 'edge:lab-mcp-teaches-authority',
    kind: 'teaches',
    from: labMcpServer.id,
    to: patternToolAuthority.id,
    ...edgeBase,
  },
  {
    id: 'edge:lab-rag-teaches-eval',
    kind: 'teaches',
    from: labRagPipeline.id,
    to: patternEvalHarness.id,
    ...edgeBase,
  },
  ...stages.map(
    (s): AcademyEdge => ({
      id: `edge:${s.id}-produces-${s.artifact}`,
      kind: 'produces',
      from: projectProductionAgentSystems.id,
      to: s.artifact,
      ...edgeBase,
    }),
  ),
  ...evals.map(
    (e): AcademyEdge => ({
      id: `edge:${e.id}-evaluates-${e.target}`,
      kind: 'evaluates',
      from: e.id,
      to: e.target,
      ...edgeBase,
    }),
  ),
  ...reviews.map(
    (r): AcademyEdge => ({
      id: `edge:${r.id}-evaluates-${r.target}`,
      kind: 'evaluates',
      from: r.id,
      to: r.target,
      ...edgeBase,
    }),
  ),
]

export const productionAgentSystemsGraph: AcademyGraph = {
  schema: ACADEMY_GRAPH_VERSION,
  version: V,
  owner: OWNER,
  measuredAt: MEASURED_AT,
  nodes: [
    roleProductionArchitect,
    roleIndependentReviewer,
    patternToolAuthority,
    patternEvalHarness,
    failureToolResultInjection,
    failureAmbientAuthority,
    failureEvalRewritten,
    labRagPipeline,
    labMultiAgent,
    labMcpServer,
    ...artifacts,
    ...evals,
    ...reviews,
    prereqShipProduction,
    competencyShipProduction,
    projectProductionAgentSystems,
  ],
  edges,
}
