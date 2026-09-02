/**
 * Capability advancement and the public-safe portfolio projection.
 *
 * This module is the only place a competency can be granted, and it refuses by
 * default. There is deliberately no `force`, no `override`, and no path that
 * accepts a learner's own word. Everything it grants is reconstructible from
 * artifacts, evidence locators, eval runs, and independent reviews.
 */

import type {
  AcademyGraph,
  AcademyNodeId,
  Artifact,
  ArtifactId,
  Competency,
  CompetencyId,
  Eval,
  Evidence,
  EvidenceRule,
  LearnerState,
  Portfolio,
  PortfolioEntry,
  Prerequisite,
  Review,
  SemVer,
} from './types.ts'
import { ACADEMY_GRAPH_VERSION } from './types.ts'

export type RefusalCode =
  | 'unknown-competency'
  | 'prerequisite-not-met'
  | 'artifact-not-submitted'
  | 'no-evidence'
  | 'insufficient-evidence'
  | 'evidence-stale'
  | 'evidence-kind-not-accepted'
  | 'evidence-self-attested'
  | 'eval-never-run'
  | 'eval-below-threshold'
  | 'review-missing'
  | 'review-not-passed'
  | 'review-not-independent'

export interface Refusal {
  readonly code: RefusalCode
  /** The node the refusal is about, so a UI can point at the right thing. */
  readonly subject: string
  readonly detail: string
}

export type AdvanceResult =
  | { readonly granted: true; readonly competency: CompetencyId; readonly grantedAt: string }
  | { readonly granted: false; readonly competency: CompetencyId; readonly refusals: readonly Refusal[] }

const DAY_MS = 86_400_000

const daysBetween = (isoLater: string, isoEarlier: string): number =>
  (Date.parse(isoLater) - Date.parse(isoEarlier)) / DAY_MS

function nodeIndex(graph: AcademyGraph) {
  const byId = new Map(graph.nodes.map((n) => [n.id, n]))
  return {
    competency: (id: AcademyNodeId) => byId.get(id) as Competency | undefined,
    artifact: (id: AcademyNodeId) => byId.get(id) as Artifact | undefined,
    evaluation: (id: AcademyNodeId) => byId.get(id) as Eval | undefined,
    review: (id: AcademyNodeId) => byId.get(id) as Review | undefined,
    prerequisite: (id: AcademyNodeId) => byId.get(id) as Prerequisite | undefined,
  }
}

/**
 * The evidence rule for an artifact inside a project. Stage rules win over the
 * default when the artifact appears in a project stage, because a deployed thing
 * must stay deployed while a written thing need not stay unedited.
 */
function evidenceRuleFor(graph: AcademyGraph, artifactId: ArtifactId): EvidenceRule {
  for (const node of graph.nodes) {
    if (node.kind !== 'Project') continue
    const stage = node.stages.find((s) => s.artifact === artifactId)
    if (stage) return stage.evidenceRule
  }
  return { accepts: ['repo-url', 'eval-run'], minimumCount: 1, maxAgeDays: 365 }
}

function checkEvidence(
  learner: LearnerState,
  artifact: Artifact,
  rule: EvidenceRule,
  asOf: string,
): Refusal[] {
  const refusals: Refusal[] = []
  const forArtifact = learner.evidence.filter((e) => e.artifact === artifact.id)

  if (forArtifact.length === 0) {
    return [
      {
        code: 'no-evidence',
        subject: artifact.id,
        detail: `${artifact.title} was submitted but nothing evidences it. A submission is a claim, not proof.`,
      },
    ]
  }

  const usable: Evidence[] = []
  for (const e of forArtifact) {
    if (!rule.accepts.includes(e.evidenceKind)) {
      refusals.push({
        code: 'evidence-kind-not-accepted',
        subject: e.id,
        detail: `${e.evidenceKind} is not accepted for ${artifact.title}; accepted: ${rule.accepts.join(', ')}.`,
      })
      continue
    }
    if (daysBetween(asOf, e.verifiedAt) > rule.maxAgeDays) {
      refusals.push({
        code: 'evidence-stale',
        subject: e.id,
        detail: `Last verified ${e.verifiedAt}; the rule for ${artifact.title} allows ${rule.maxAgeDays} days.`,
      })
      continue
    }
    if (e.evidenceKind === 'reviewer-attestation' && e.verifiedBy === learner.learnerId) {
      refusals.push({
        code: 'evidence-self-attested',
        subject: e.id,
        detail: 'A learner cannot attest to their own artifact.',
      })
      continue
    }
    usable.push(e)
  }

  if (usable.length < rule.minimumCount) {
    refusals.push({
      code: 'insufficient-evidence',
      subject: artifact.id,
      detail: `${usable.length} usable evidence record(s); ${artifact.title} requires ${rule.minimumCount}.`,
    })
  }
  return refusals
}

/**
 * Grant a competency, or explain in full why not.
 *
 * `asOf` exists so evidence freshness is testable and so a grant is a statement
 * about a moment rather than about whenever the process happened to run.
 */
export function advanceCapability(
  graph: AcademyGraph,
  learner: LearnerState,
  competencyId: CompetencyId,
  asOf: string = new Date().toISOString().slice(0, 10),
): AdvanceResult {
  const idx = nodeIndex(graph)
  const competency = idx.competency(competencyId)

  if (!competency || competency.kind !== 'Competency') {
    return {
      granted: false,
      competency: competencyId,
      refusals: [
        {
          code: 'unknown-competency',
          subject: competencyId,
          detail: 'No such competency in this graph version.',
        },
      ],
    }
  }

  const refusals: Refusal[] = []

  for (const prereqId of competency.prerequisites) {
    const prereq = idx.prerequisite(prereqId)
    if (!prereq || prereq.requires.length === 0) continue
    const held = prereq.requires.filter((c) => learner.grantedCompetencies.includes(c))
    const met = prereq.rule === 'all' ? held.length === prereq.requires.length : held.length > 0
    if (!met) {
      refusals.push({
        code: 'prerequisite-not-met',
        subject: prereqId,
        detail: `Requires ${prereq.rule} of: ${prereq.requires.join(', ')}.`,
      })
    }
  }

  for (const artifactId of competency.requiredArtifacts) {
    const artifact = idx.artifact(artifactId)
    if (!artifact) continue
    if (!learner.submittedArtifacts.includes(artifactId)) {
      refusals.push({
        code: 'artifact-not-submitted',
        subject: artifactId,
        detail: `${artifact.title} has not been produced.`,
      })
      continue
    }
    refusals.push(...checkEvidence(learner, artifact, evidenceRuleFor(graph, artifactId), asOf))
  }

  for (const evalId of competency.requiredEvals) {
    const evaluation = idx.evaluation(evalId)
    if (!evaluation) continue
    const runs = learner.evalRuns.filter((r) => r.evalId === evalId)
    if (runs.length === 0) {
      refusals.push({
        code: 'eval-never-run',
        subject: evalId,
        detail: `${evaluation.title} has no recorded run.`,
      })
      continue
    }
    const latest = runs.reduce((a, b) => (Date.parse(a.ranAt) >= Date.parse(b.ranAt) ? a : b))
    const total = latest.passedAssertions.length + latest.failedAssertions.length
    const ratio = total === 0 ? 0 : latest.passedAssertions.length / total
    if (ratio < evaluation.passThreshold) {
      refusals.push({
        code: 'eval-below-threshold',
        subject: evalId,
        detail: `Latest run ${latest.ranAt} passed ${latest.passedAssertions.length}/${total}; threshold ${evaluation.passThreshold}. Failed: ${latest.failedAssertions.join(', ') || 'none recorded'}.`,
      })
    }
  }

  for (const reviewId of competency.requiredReviews) {
    const review = idx.review(reviewId)
    if (!review) continue
    const verdicts = learner.reviews.filter((v) => v.reviewId === reviewId)
    if (verdicts.length === 0) {
      refusals.push({
        code: 'review-missing',
        subject: reviewId,
        detail: `${review.title} has not been reviewed.`,
      })
      continue
    }
    const latest = verdicts.reduce((a, b) =>
      Date.parse(a.reviewedAt) >= Date.parse(b.reviewedAt) ? a : b,
    )
    if (review.requiresIndependentReviewer && latest.reviewer === learner.learnerId) {
      refusals.push({
        code: 'review-not-independent',
        subject: reviewId,
        detail: 'The author reviewed their own artifact. The verdict does not count.',
      })
      continue
    }
    if (latest.verdict !== 'pass') {
      refusals.push({
        code: 'review-not-passed',
        subject: reviewId,
        detail: `Latest verdict ${latest.verdict} from ${latest.reviewer} on ${latest.reviewedAt}.`,
      })
    }
  }

  return refusals.length > 0
    ? { granted: false, competency: competencyId, refusals }
    : { granted: true, competency: competencyId, grantedAt: asOf }
}

/**
 * Project a learner's granted competencies into a public portfolio.
 *
 * Two independent filters, both required: the artifact must be marked public-safe,
 * and each evidence locator must itself be public. A cohort-visible threat model
 * never appears here even though it was required to earn the competency.
 */
export function projectPortfolio(
  graph: AcademyGraph,
  learner: LearnerState,
  asOf: string = new Date().toISOString().slice(0, 10),
): Portfolio {
  const idx = nodeIndex(graph)
  const entries: PortfolioEntry[] = []

  for (const competencyId of learner.grantedCompetencies) {
    const competency = idx.competency(competencyId)
    if (!competency || competency.kind !== 'Competency') continue

    const publicArtifacts = competency.requiredArtifacts.filter((id) => {
      const a = idx.artifact(id)
      return Boolean(a && a.publicSafe && a.visibility === 'public')
    })

    const publicEvidence = learner.evidence
      .filter((e) => publicArtifacts.includes(e.artifact) && e.visibility === 'public')
      .map((e) => e.locator)

    entries.push({
      competency: competencyId,
      grantedAt: asOf,
      artifacts: publicArtifacts,
      publicEvidence,
    })
  }

  const version: SemVer = '1.0.0'
  return {
    id: `portfolio:${learner.learnerId}`,
    kind: 'Portfolio',
    title: `Portfolio for ${learner.learnerId}`,
    owner: learner.learnerId,
    version,
    visibility: 'public',
    provenance: {
      source: `${ACADEMY_GRAPH_VERSION}/projectPortfolio`,
      method: 'repo-scan',
      measuredAt: asOf,
    },
    evaluationRule: {
      kind: 'reference-only',
      rationale: 'A portfolio restates grants that were already evaluated; it adds no new claim.',
    },
    learnerId: learner.learnerId,
    entries,
  }
}
