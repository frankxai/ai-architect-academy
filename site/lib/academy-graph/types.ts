/**
 * AcademyGraph.v1 — the typed substrate under aiarchitectacademy.com.
 *
 * The repository already measures itself into `site/data/curriculum.json`: a link
 * catalog. A catalog cannot answer "can this person do the job", so it cannot be
 * sold. This graph can: every claimed capability resolves to artifacts a learner
 * produced, evidence that those artifacts exist outside their own claim, and an
 * evaluation that ran against them.
 *
 * Contract rules, enforced by the types and by `advance.ts`:
 *  - Every node and edge carries owner, provenance, version, visibility, and an
 *    evaluation rule. `reference-only` is a legal evaluation rule; absence is not.
 *  - No competency is granted without artifact evidence. There is no manual
 *    override in this module.
 *  - A Review never counts when the reviewer is the author.
 *  - Nothing reaches a public Portfolio unless the artifact is marked public-safe
 *    AND its evidence is public.
 */

export const ACADEMY_GRAPH_VERSION = 'AcademyGraph.v1'

export type SemVer = `${number}.${number}.${number}`

/** cohort = paying members and reviewers. private = learner + their reviewers only. */
export type Visibility = 'public' | 'cohort' | 'private'

export type ProvenanceMethod =
  | 'authored' // written by a named human for this repo
  | 'repo-scan' // derived from files by a script, re-derivable
  | 'learner-submitted' // supplied by the learner, untrusted until evidenced
  | 'reviewer-attested' // asserted by a named reviewer who is not the learner

export interface Provenance {
  /** Where this came from: repo path, URL, or reviewer handle. */
  readonly source: string
  readonly method: ProvenanceMethod
  /** ISO date. When the source was last read, not when the file was written. */
  readonly measuredAt: string
}

/**
 * How a node is judged. Every node has one. `reference-only` is for nodes that
 * teach but do not certify — it must carry a rationale so nobody quietly
 * downgrades a gate into a link.
 */
export type EvaluationRule =
  | { readonly kind: 'eval'; readonly evalId: EvalId }
  | { readonly kind: 'review'; readonly reviewId: ReviewId }
  | { readonly kind: 'reference-only'; readonly rationale: string }

export type NodeKind =
  | 'Competency'
  | 'Pattern'
  | 'FailureMode'
  | 'Lab'
  | 'Project'
  | 'Artifact'
  | 'Evidence'
  | 'Eval'
  | 'Review'
  | 'Prerequisite'
  | 'Role'
  | 'Portfolio'

export interface NodeBase<K extends NodeKind> {
  readonly id: string
  readonly kind: K
  readonly title: string
  /** Accountable party. A node with no owner is a node nobody maintains. */
  readonly owner: string
  readonly version: SemVer
  readonly visibility: Visibility
  readonly provenance: Provenance
  readonly evaluationRule: EvaluationRule
}

// --- Identifier brands -------------------------------------------------------
// Nominal-ish ids so a PatternId cannot silently stand in for a CompetencyId.

export type CompetencyId = `competency:${string}`
export type PatternId = `pattern:${string}`
export type FailureModeId = `failure:${string}`
export type LabId = `lab:${string}`
export type ProjectId = `project:${string}`
export type ArtifactId = `artifact:${string}`
export type EvidenceId = `evidence:${string}`
export type EvalId = `eval:${string}`
export type ReviewId = `review:${string}`
export type PrerequisiteId = `prereq:${string}`
export type RoleId = `role:${string}`
export type PortfolioId = `portfolio:${string}`

export type AcademyNodeId =
  | CompetencyId
  | PatternId
  | FailureModeId
  | LabId
  | ProjectId
  | ArtifactId
  | EvidenceId
  | EvalId
  | ReviewId
  | PrerequisiteId
  | RoleId
  | PortfolioId

// --- The twelve node types ---------------------------------------------------

export type CompetencyLevel = 'foundation' | 'practitioner' | 'architect'

/** A claim of the form "can do X in production". Only granted against evidence. */
export interface Competency extends NodeBase<'Competency'> {
  readonly id: CompetencyId
  readonly level: CompetencyLevel
  /** Plain-language statement of the capability, written as an observable act. */
  readonly claim: string
  readonly prerequisites: readonly PrerequisiteId[]
  /** Artifacts that must exist, evidenced, before this competency is granted. */
  readonly requiredArtifacts: readonly ArtifactId[]
  /** Evals that must have a passing run over those artifacts. */
  readonly requiredEvals: readonly EvalId[]
  /** Reviews that must have a passing, independent verdict. */
  readonly requiredReviews: readonly ReviewId[]
}

/** A reusable architecture shape. Teaches; never certifies on its own. */
export interface Pattern extends NodeBase<'Pattern'> {
  readonly id: PatternId
  readonly problem: string
  readonly appliesWhen: readonly string[]
  readonly repoPath: string
  readonly knownFailureModes: readonly FailureModeId[]
}

/** The way a pattern breaks in production. The half a link catalog omits. */
export interface FailureMode extends NodeBase<'FailureMode'> {
  readonly id: FailureModeId
  readonly pattern: PatternId
  readonly symptom: string
  /** How you would notice, in telemetry or evals, not in retrospect. */
  readonly detection: string
  readonly mitigation: string
  /** Whether the flagship incident simulation is allowed to inject this. */
  readonly injectable: boolean
}

/** A bounded exercise living in the repo. Produces artifacts. */
export interface Lab extends NodeBase<'Lab'> {
  readonly id: LabId
  readonly repoPath: string
  readonly estimatedHours: number
  readonly produces: readonly ArtifactId[]
  readonly teaches: readonly PatternId[]
}

/** A multi-stage build. The flagship path is one Project. */
export interface Project extends NodeBase<'Project'> {
  readonly id: ProjectId
  readonly brief: string
  readonly stages: readonly ProjectStage[]
  readonly grants: readonly CompetencyId[]
}

/** One ordered stage of a Project: artifact + eval + evidence rule. */
export interface ProjectStage {
  readonly id: string
  readonly ordinal: number
  readonly title: string
  /** What the learner must have decided by the end of this stage. */
  readonly decision: string
  readonly artifact: ArtifactId
  readonly evals: readonly EvalId[]
  readonly reviews: readonly ReviewId[]
  /** Evidence kinds accepted for this stage. Narrower than the artifact default. */
  readonly evidenceRule: EvidenceRule
}

export type ArtifactKind =
  | 'system-brief'
  | 'architecture-decision-record'
  | 'tool-authority-matrix'
  | 'eval-harness'
  | 'threat-model'
  | 'cost-model'
  | 'deployment-record'
  | 'incident-report'
  | 'portfolio-page'

/** A thing the learner produced. The unit of proof. */
export interface Artifact extends NodeBase<'Artifact'> {
  readonly id: ArtifactId
  readonly artifactKind: ArtifactKind
  readonly format: 'markdown' | 'json' | 'code' | 'url'
  /** Required sections/keys. An eval asserts against these, not against vibes. */
  readonly requiredSections: readonly string[]
  /** May this ever appear on a public portfolio, once redacted? */
  readonly publicSafe: boolean
  /** What must be removed before the public projection. Empty = nothing. */
  readonly redactionRule: readonly string[]
}

export type EvidenceKind =
  | 'repo-url' // a commit or file a third party can open
  | 'deploy-url' // a running deployment a third party can hit
  | 'eval-run' // a recorded, reproducible eval execution
  | 'reviewer-attestation' // a named reviewer signed off

/** Which evidence kinds satisfy a requirement, and how many. */
export interface EvidenceRule {
  readonly accepts: readonly EvidenceKind[]
  readonly minimumCount: number
  /** Evidence older than this is stale and does not count. */
  readonly maxAgeDays: number
}

/** A verifiable pointer that an artifact exists outside the learner's claim. */
export interface Evidence extends NodeBase<'Evidence'> {
  readonly id: EvidenceId
  readonly evidenceKind: EvidenceKind
  readonly artifact: ArtifactId
  /** URL or path a third party can open without asking the learner. */
  readonly locator: string
  /** ISO date the locator was last confirmed reachable. */
  readonly verifiedAt: string
  /** Who confirmed it. Never the learner for `reviewer-attestation`. */
  readonly verifiedBy: string
}

/** A deterministic check over an artifact. Machine-runnable, re-runnable. */
export interface Eval extends NodeBase<'Eval'> {
  readonly id: EvalId
  readonly target: ArtifactId
  readonly assertions: readonly EvalAssertion[]
  /** Fraction of assertions that must pass, 0..1. */
  readonly passThreshold: number
}

export interface EvalAssertion {
  readonly id: string
  readonly description: string
  /** How it is checked, so a reader can reproduce it rather than trust a score. */
  readonly check: string
}

/** Human or agent judgement under a rubric. Independence is structural. */
export interface Review extends NodeBase<'Review'> {
  readonly id: ReviewId
  readonly target: ArtifactId
  readonly rubric: readonly string[]
  readonly reviewerRole: RoleId
  /** Always true in v1: the author may never review their own artifact. */
  readonly requiresIndependentReviewer: true
}

/** A gate node. Named and owned, so gates can be argued about explicitly. */
export interface Prerequisite extends NodeBase<'Prerequisite'> {
  readonly id: PrerequisiteId
  readonly of: CompetencyId
  readonly requires: readonly CompetencyId[]
  readonly rule: 'all' | 'any'
}

/** A job the graph is aiming a learner at. */
export interface Role extends NodeBase<'Role'> {
  readonly id: RoleId
  readonly competencies: readonly CompetencyId[]
  readonly notAClaimOf: string
}

/** The public-safe projection of one learner's evidenced work. */
export interface Portfolio extends NodeBase<'Portfolio'> {
  readonly id: PortfolioId
  readonly learnerId: string
  readonly entries: readonly PortfolioEntry[]
}

export interface PortfolioEntry {
  readonly competency: CompetencyId
  readonly grantedAt: string
  readonly artifacts: readonly ArtifactId[]
  /** Only locators whose evidence node is public. */
  readonly publicEvidence: readonly string[]
}

export type AcademyNode =
  | Competency
  | Pattern
  | FailureMode
  | Lab
  | Project
  | Artifact
  | Evidence
  | Eval
  | Review
  | Prerequisite
  | Role
  | Portfolio

// --- Edges -------------------------------------------------------------------

export type EdgeKind =
  | 'requires' // Competency -> Prerequisite
  | 'produces' // Lab|Project -> Artifact
  | 'evidences' // Evidence -> Artifact
  | 'evaluates' // Eval|Review -> Artifact
  | 'grants' // Project -> Competency
  | 'teaches' // Lab -> Pattern
  | 'breaks-as' // Pattern -> FailureMode
  | 'targets' // Role -> Competency
  | 'projects' // Portfolio -> Competency

export interface AcademyEdge {
  readonly id: string
  readonly kind: EdgeKind
  readonly from: AcademyNodeId
  readonly to: AcademyNodeId
  readonly owner: string
  readonly version: SemVer
  readonly visibility: Visibility
  readonly provenance: Provenance
  readonly evaluationRule: EvaluationRule
}

export interface AcademyGraph {
  readonly schema: typeof ACADEMY_GRAPH_VERSION
  readonly version: SemVer
  readonly owner: string
  readonly measuredAt: string
  readonly nodes: readonly AcademyNode[]
  readonly edges: readonly AcademyEdge[]
}

// --- Learner state (not part of the published graph) --------------------------

export interface EvalRun {
  readonly evalId: EvalId
  readonly artifact: ArtifactId
  readonly ranAt: string
  readonly passedAssertions: readonly string[]
  readonly failedAssertions: readonly string[]
}

export interface ReviewVerdict {
  readonly reviewId: ReviewId
  readonly artifact: ArtifactId
  readonly reviewer: string
  readonly verdict: 'pass' | 'revise' | 'fail'
  readonly reviewedAt: string
}

export interface LearnerState {
  readonly learnerId: string
  /** Artifacts the learner claims to have produced. Claims, not proof. */
  readonly submittedArtifacts: readonly ArtifactId[]
  readonly evidence: readonly Evidence[]
  readonly evalRuns: readonly EvalRun[]
  readonly reviews: readonly ReviewVerdict[]
  readonly grantedCompetencies: readonly CompetencyId[]
}
