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
  | 'graph-invalid'
  | 'invalid-as-of'
  | 'prerequisite-not-met'
  | 'artifact-not-submitted'
  | 'no-evidence'
  | 'insufficient-evidence'
  | 'evidence-stale'
  | 'evidence-kind-not-accepted'
  | 'evidence-self-attested'
  | 'evidence-invalid'
  | 'evidence-date-invalid'
  | 'evidence-future'
  | 'evidence-duplicate'
  | 'eval-never-run'
  | 'eval-run-invalid'
  | 'eval-below-threshold'
  | 'review-missing'
  | 'review-not-passed'
  | 'review-not-independent'
  | 'review-invalid'

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

/** Date.parse normalises impossible dates such as February 30; never accept that as evidence. */
function instant(value: string): number {
  if (!/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2}))?$/.test(value)) return NaN
  const day = value.slice(0, 10)
  const dayMs = Date.parse(day)
  if (!Number.isFinite(dayMs) || new Date(dayMs).toISOString().slice(0, 10) !== day) return NaN
  return Date.parse(value)
}

/** A date-only assessment covers that UTC calendar day; a timestamp is an exact cutoff. */
const assessmentInstant = (asOf: string): number =>
  instant(asOf) + (asOf.length === 10 ? DAY_MS - 1 : 0)

const daysBetween = (isoLater: string, isoEarlier: string): number =>
  (instant(isoLater) - instant(isoEarlier)) / DAY_MS

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
  const ids = new Set<string>()
  const locators = new Set<string>()
  for (const e of forArtifact) {
    if (!e.locator?.trim() || !e.verifiedBy?.trim()) {
      refusals.push({ code: 'evidence-invalid', subject: e.id, detail: 'Evidence needs a non-empty locator and a named verifier.' })
      continue
    }
    if (ids.has(e.id) || locators.has(e.locator.trim())) {
      refusals.push({ code: 'evidence-duplicate', subject: e.id, detail: 'An evidence id or locator may count only once per artifact.' })
      continue
    }
    ids.add(e.id)
    locators.add(e.locator.trim())
    if (!rule.accepts.includes(e.evidenceKind)) {
      refusals.push({
        code: 'evidence-kind-not-accepted',
        subject: e.id,
        detail: `${e.evidenceKind} is not accepted for ${artifact.title}; accepted: ${rule.accepts.join(', ')}.`,
      })
      continue
    }
    if (!Number.isFinite(instant(e.verifiedAt))) {
      refusals.push({ code: 'evidence-date-invalid', subject: e.id, detail: `Invalid ISO verification date: ${e.verifiedAt}.` })
      continue
    }
    if (instant(e.verifiedAt) > assessmentInstant(asOf)) {
      refusals.push({ code: 'evidence-future', subject: e.id, detail: `Evidence verified after the assessment date ${asOf} cannot count.` })
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

  if (!Number.isFinite(instant(asOf))) {
    return { granted: false, competency: competencyId, refusals: [{ code: 'invalid-as-of', subject: competencyId, detail: `Invalid ISO assessment date: ${asOf}.` }] }
  }
  if (new Set(graph.nodes.map((n) => n.id)).size !== graph.nodes.length) {
    return { granted: false, competency: competencyId, refusals: [{ code: 'graph-invalid', subject: competencyId, detail: 'Graph node ids must be unique.' }] }
  }
  for (const [name, ids] of [
    ['requiredArtifacts', competency.requiredArtifacts],
    ['requiredEvals', competency.requiredEvals],
    ['requiredReviews', competency.requiredReviews],
  ] as const) {
    if (ids.length === 0 || new Set(ids).size !== ids.length) {
      refusals.push({ code: 'graph-invalid', subject: competencyId, detail: `${name} must contain distinct requirements and cannot be empty.` })
    }
  }

  for (const prereqId of competency.prerequisites) {
    const prereq = idx.prerequisite(prereqId)
    if (!prereq || prereq.kind !== 'Prerequisite' || prereq.of !== competencyId) {
      refusals.push({ code: 'graph-invalid', subject: prereqId, detail: 'Required prerequisite is missing or belongs to another competency.' })
      continue
    }
    if (prereq.requires.some((id) => idx.competency(id)?.kind !== 'Competency')) {
      refusals.push({ code: 'graph-invalid', subject: prereqId, detail: 'Prerequisite references an unresolved competency.' })
      continue
    }
    if (prereq.requires.length === 0) continue
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
    if (!artifact || artifact.kind !== 'Artifact') {
      refusals.push({ code: 'graph-invalid', subject: artifactId, detail: 'Required artifact is missing or is not an Artifact node.' })
      continue
    }
    const rule = evidenceRuleFor(graph, artifactId)
    if (!Number.isInteger(rule.minimumCount) || rule.minimumCount < 1 || !Number.isFinite(rule.maxAgeDays) || rule.maxAgeDays < 0 || rule.accepts.length === 0) {
      refusals.push({ code: 'graph-invalid', subject: artifactId, detail: 'Artifact evidence rule has no usable minimum, accepted kind or freshness window.' })
      continue
    }
    if (!learner.submittedArtifacts.includes(artifactId)) {
      refusals.push({
        code: 'artifact-not-submitted',
        subject: artifactId,
        detail: `${artifact.title} has not been produced.`,
      })
      continue
    }
    refusals.push(...checkEvidence(learner, artifact, rule, asOf))
  }

  for (const evalId of competency.requiredEvals) {
    const evaluation = idx.evaluation(evalId)
    if (!evaluation || evaluation.kind !== 'Eval' || idx.artifact(evaluation.target)?.kind !== 'Artifact' || !competency.requiredArtifacts.includes(evaluation.target)) {
      refusals.push({ code: 'graph-invalid', subject: evalId, detail: 'Required eval is missing or does not target a required artifact.' })
      continue
    }
    const expected = evaluation.assertions.map((a) => a.id)
    if (expected.length === 0 || new Set(expected).size !== expected.length || !Number.isFinite(evaluation.passThreshold) || evaluation.passThreshold < 0 || evaluation.passThreshold > 1) {
      refusals.push({ code: 'graph-invalid', subject: evalId, detail: 'Eval must declare distinct assertions and a threshold between zero and one.' })
      continue
    }
    const runs = learner.evalRuns.filter((r) => r.evalId === evalId)
    if (runs.length === 0) {
      refusals.push({
        code: 'eval-never-run',
        subject: evalId,
        detail: `${evaluation.title} has no recorded run.`,
      })
      continue
    }
    if (runs.some((r) => !Number.isFinite(instant(r.ranAt)) || instant(r.ranAt) > assessmentInstant(asOf))) {
      refusals.push({ code: 'eval-run-invalid', subject: evalId, detail: 'Eval run dates must be valid ISO dates at or before the assessment date.' })
      continue
    }
    const latestAt = Math.max(...runs.map((r) => instant(r.ranAt)))
    // Tied timestamps provide no ordering; any failure at the latest time blocks the grant.
    for (const latest of runs.filter((r) => instant(r.ranAt) === latestAt)) {
      const recorded = [...latest.passedAssertions, ...latest.failedAssertions]
      if (latest.artifact !== evaluation.target || recorded.length !== expected.length || new Set(recorded).size !== recorded.length || recorded.some((id) => !expected.includes(id))) {
        refusals.push({ code: 'eval-run-invalid', subject: evalId, detail: `Run must target ${evaluation.target} and record each declared assertion exactly once: ${expected.join(', ')}.` })
        continue
      }
      const ratio = latest.passedAssertions.length / expected.length
      if (ratio < evaluation.passThreshold) {
        refusals.push({
          code: 'eval-below-threshold',
          subject: evalId,
          detail: `Latest run ${latest.ranAt} passed ${latest.passedAssertions.length}/${expected.length}; threshold ${evaluation.passThreshold}. Failed: ${latest.failedAssertions.join(', ') || 'none recorded'}.`,
        })
      }
    }
  }

  for (const reviewId of competency.requiredReviews) {
    const review = idx.review(reviewId)
    if (!review || review.kind !== 'Review' || idx.artifact(review.target)?.kind !== 'Artifact' || !competency.requiredArtifacts.includes(review.target)) {
      refusals.push({ code: 'graph-invalid', subject: reviewId, detail: 'Required review is missing or does not target a required artifact.' })
      continue
    }
    const verdicts = learner.reviews.filter((v) => v.reviewId === reviewId)
    if (verdicts.length === 0) {
      refusals.push({
        code: 'review-missing',
        subject: reviewId,
        detail: `${review.title} has not been reviewed.`,
      })
      continue
    }
    if (verdicts.some((v) => !Number.isFinite(instant(v.reviewedAt)) || instant(v.reviewedAt) > assessmentInstant(asOf))) {
      refusals.push({ code: 'review-invalid', subject: reviewId, detail: 'Review dates must be valid ISO dates at or before the assessment date.' })
      continue
    }
    const latestAt = Math.max(...verdicts.map((v) => instant(v.reviewedAt)))
    for (const latest of verdicts.filter((v) => instant(v.reviewedAt) === latestAt)) {
      if (latest.artifact !== review.target || !latest.reviewer?.trim()) {
        refusals.push({ code: 'review-invalid', subject: reviewId, detail: `Review must name a reviewer and target ${review.target}.` })
        continue
      }
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
    // LearnerState may come from an import. A supplied grant cannot bypass the same
    // gate used to earn it, and stale evidence no longer supports a current claim.
    if (!advanceCapability(graph, learner, competencyId, asOf).granted) continue

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
