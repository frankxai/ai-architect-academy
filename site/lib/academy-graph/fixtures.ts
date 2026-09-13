/**
 * A fixture learner for the flagship path. Fictional; asserts nothing about any
 * real person and contains no real URLs that could be mistaken for a live
 * portfolio. `completeLearner()` returns a fresh object each call so a test can
 * mutate one field to prove a single refusal.
 */

import {
  artifacts,
  competencyShipProduction,
  evals,
  reviews,
} from './production-agent-systems.ts'
import type { Evidence, EvalRun, LearnerState, ReviewVerdict } from './types.ts'

export const FIXTURE_LEARNER_ID = 'learner:fixture-avery'
export const FIXTURE_REVIEWER_ID = 'learner:fixture-nadia'
export const FIXTURE_AS_OF = '2026-09-02'

const evidenceFor = (): Evidence[] =>
  artifacts.map((a) => {
    // The deployment and incident stages demand a running system, so their
    // evidence is a deploy URL; everything else is a repository locator.
    const isRunning =
      a.id === 'artifact:deployment-record' || a.id === 'artifact:incident-report'
    return {
      id: `evidence:${a.id.replace('artifact:', '')}`,
      kind: 'Evidence' as const,
      title: `Evidence for ${a.title}`,
      owner: FIXTURE_LEARNER_ID,
      version: '1.0.0' as const,
      visibility: a.publicSafe ? ('public' as const) : ('cohort' as const),
      provenance: {
        source: 'fixture',
        method: 'learner-submitted' as const,
        measuredAt: FIXTURE_AS_OF,
      },
      evaluationRule: {
        kind: 'reference-only' as const,
        rationale: 'Evidence is verified by reachability, not scored.',
      },
      evidenceKind: isRunning ? ('deploy-url' as const) : ('repo-url' as const),
      artifact: a.id,
      locator: isRunning
        ? `https://fixture.invalid/${a.id.replace('artifact:', '')}`
        : `https://fixture.invalid/repo/${a.id.replace('artifact:', '')}.md`,
      verifiedAt: '2026-08-20',
      verifiedBy: FIXTURE_REVIEWER_ID,
    }
  })

/** Two stages need a second evidence record beyond the default one. */
const secondEvidence = (): Evidence[] => [
  {
    // The eval harness stage requires two usable records, not one.
    id: 'evidence:eval-harness-run',
    kind: 'Evidence',
    title: 'Recorded harness run',
    owner: FIXTURE_LEARNER_ID,
    version: '1.0.0',
    visibility: 'public',
    provenance: { source: 'fixture', method: 'learner-submitted', measuredAt: FIXTURE_AS_OF },
    evaluationRule: {
      kind: 'reference-only',
      rationale: 'Evidence is verified by reachability, not scored.',
    },
    evidenceKind: 'eval-run',
    artifact: 'artifact:eval-harness',
    locator: 'https://fixture.invalid/runs/harness-2026-08-20',
    verifiedAt: '2026-08-20',
    verifiedBy: FIXTURE_REVIEWER_ID,
  },
  {
    // The incident simulation needs a witness alongside the running system.
    id: 'evidence:incident-witness',
    kind: 'Evidence',
    title: 'Reviewer attestation for the incident simulation',
    owner: FIXTURE_REVIEWER_ID,
    version: '1.0.0',
    visibility: 'cohort',
    provenance: { source: 'fixture', method: 'reviewer-attested', measuredAt: FIXTURE_AS_OF },
    evaluationRule: {
      kind: 'reference-only',
      rationale: 'Evidence is verified by reachability, not scored.',
    },
    evidenceKind: 'reviewer-attestation',
    artifact: 'artifact:incident-report',
    locator: 'https://fixture.invalid/attestations/incident-2026-08-20',
    verifiedAt: '2026-08-20',
    verifiedBy: FIXTURE_REVIEWER_ID,
  },
]

const passingRuns = (): EvalRun[] =>
  evals.map((e) => ({
    evalId: e.id,
    artifact: e.target,
    ranAt: '2026-08-20',
    passedAssertions: e.assertions.map((a) => a.id),
    failedAssertions: [],
  }))

const passingReviews = (): ReviewVerdict[] =>
  reviews.map((r) => ({
    reviewId: r.id,
    artifact: r.target,
    reviewer: FIXTURE_REVIEWER_ID,
    verdict: 'pass' as const,
    reviewedAt: '2026-08-21',
  }))

/** A learner who has genuinely finished the flagship path. */
export function completeLearner(): LearnerState {
  return {
    learnerId: FIXTURE_LEARNER_ID,
    submittedArtifacts: artifacts.map((a) => a.id),
    evidence: [...evidenceFor(), ...secondEvidence()],
    evalRuns: passingRuns(),
    reviews: passingReviews(),
    grantedCompetencies: [],
  }
}

/** A learner on day one: nothing produced, nothing proven. */
export function emptyLearner(): LearnerState {
  return {
    learnerId: FIXTURE_LEARNER_ID,
    submittedArtifacts: [],
    evidence: [],
    evalRuns: [],
    reviews: [],
    grantedCompetencies: [],
  }
}

/** A learner who has finished and been granted the competency. */
export function grantedLearner(): LearnerState {
  return { ...completeLearner(), grantedCompetencies: [competencyShipProduction.id] }
}
