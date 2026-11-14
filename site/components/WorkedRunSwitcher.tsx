'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { DecisionPipelineDiagram } from '@/components/DecisionPipelineDiagram'
import {
  bridgeWorkedRunToLearner,
  type WorkedRunInput,
} from '@/lib/academy-graph/evidence-bridge'

export interface WorkedRunRecord extends WorkedRunInput {
  readonly goal: string
  readonly fixtureNote: string
  readonly outcome: string
  readonly killCriterion: string
  readonly finding: {
    readonly title: string
    readonly fix: readonly string[]
  }
  readonly contract: {
    readonly checks: number
    readonly pass: number
    readonly fail: number
  }
}

export interface WorkedRunSwitcherProps {
  readonly runs: readonly WorkedRunRecord[]
  readonly featuredId: string
  readonly measuredAt: string
  readonly pluginVersion: string
}

type StatusFilter = 'all' | 'red' | 'pass'
type PlaneLens = 'all' | 'trust' | 'ownership' | 'operations'

const DECISIONS: Record<string, string> = {
  model: 'Model call seam',
  loop: 'Orchestration shape',
  trust: 'Trust boundary',
  run: 'Long-run home',
}

const SOCRATIC_PROMPTS: Record<string, string> = {
  'contract-rag':
    'The trust gate failed. Using only the decisions above, which file and which line let text a counterparty wrote reach the model as an instruction?',
  'support-triage':
    'Every safety and eval gate passed, yet gate.decisions is red. Looking at the four decisions above, which plane has no accountable owner and which files import model SDKs directly?',
  'personal-ai-coe':
    'All four architecture decisions are MADE, yet gate.operate is red. Inspect the lifecycle gates above: which operational procedure was written down without ever recording a dry-run exit status?',
}

const LENS_DECISIONS: Record<PlaneLens, readonly string[]> = {
  all: ['model', 'loop', 'trust', 'run'],
  trust: ['trust', 'loop'],
  ownership: ['model', 'loop'],
  operations: ['run'],
}

const LENS_GATES: Record<PlaneLens, readonly string[]> = {
  all: ['frame', 'discovery', 'flow', 'decisions', 'economics', 'trust', 'evals', 'operate', 'verify'],
  trust: ['flow', 'trust', 'evals', 'verify'],
  ownership: ['frame', 'discovery', 'decisions', 'economics'],
  operations: ['operate', 'verify', 'economics'],
}

function Verdict({ value }: { value: string }) {
  const tone =
    value === 'PASS' || value === 'MADE'
      ? 'v-pass'
      : value === 'FAIL'
        ? 'v-fail'
        : 'v-open'
  return <span className={`verdict ${tone}`}>{value}</span>
}

export function WorkedRunSwitcher({
  runs,
  featuredId,
  measuredAt,
  pluginVersion,
}: WorkedRunSwitcherProps) {
  const initialRun = runs.find((r) => r.id === featuredId) ?? runs[0]
  const [selectedRunId, setSelectedRunId] = useState<string>(initialRun.id)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [planeLens, setPlaneLens] = useState<PlaneLens>('all')
  const [focusedGateId, setFocusedGateId] = useState<string | null>(null)

  const activeRun = useMemo(
    () => runs.find((r) => r.id === selectedRunId) ?? initialRun,
    [runs, selectedRunId, initialRun],
  )
  const otherRuns = useMemo(
    () => runs.filter((r) => r.id !== activeRun.id),
    [runs, activeRun.id],
  )

  const failedGates = useMemo(
    () => activeRun.gates.filter((g) => g.status === 'FAIL'),
    [activeRun],
  )
  const passedGates = useMemo(
    () => activeRun.gates.filter((g) => g.status === 'PASS'),
    [activeRun],
  )
  const openDecisions = useMemo(
    () => activeRun.decisions.filter((d) => d.verdict === 'OPEN'),
    [activeRun],
  )

  const filteredDecisions = useMemo(() => {
    return activeRun.decisions.filter((d) => {
      if (!LENS_DECISIONS[planeLens].includes(d.id)) return false
      if (statusFilter === 'red') return d.verdict === 'OPEN'
      if (statusFilter === 'pass') return d.verdict === 'MADE'
      return true
    })
  }, [activeRun, planeLens, statusFilter])

  const filteredGates = useMemo(() => {
    return activeRun.gates.filter((g) => {
      if (!LENS_GATES[planeLens].includes(g.id)) return false
      if (statusFilter === 'red') return g.status === 'FAIL'
      if (statusFilter === 'pass') return g.status === 'PASS'
      return true
    })
  }, [activeRun, planeLens, statusFilter])

  const bridgeProjection = useMemo(
    () => bridgeWorkedRunToLearner(activeRun, { asOf: measuredAt }),
    [activeRun, measuredAt],
  )

  const evalRefusals = useMemo(
    () =>
      !bridgeProjection.advance.granted
        ? bridgeProjection.advance.refusals.filter((r) => r.code === 'eval-below-threshold')
        : [],
    [bridgeProjection],
  )

  const socraticQuestion =
    SOCRATIC_PROMPTS[activeRun.id] ??
    'Using only the decisions and gate notes above, identify the root cause before opening the review finding.'

  return (
    <>
      <section className="pb-14 pt-16 sm:pt-24" aria-labelledby="hero">
        <p className="eyebrow">The second free gift · a plugin fixture</p>
        <h1 id="hero" className="mt-5 max-w-4xl text-[clamp(2.1rem,5.5vw,3.8rem)] leading-[1.04]">
          What the team leaves in a repository, <em>red gates included.</em>
        </h1>
        <p className="measure mt-7 text-xl leading-relaxed" style={{ color: 'var(--ink-2)' }}>
          A complete worked example shipped with the AI Architect plugin: a {activeRun.name} system, taken through
          every stage. {passedGates.length} of {activeRun.gates.length} gates pass. {failedGates.length}{' '}
          {failedGates.length === 1 ? 'fails' : 'fail'}, for one reason, and the example says so in its own files.
        </p>
        <p className="measure fixture mt-8 text-sm">
          <strong>Fixture.</strong> {activeRun.fixtureNote}
        </p>

        {/* Interactive Worked-Run Switcher */}
        <div className="mt-10">
          <p className="eyebrow">Switch worked-run fixture ({runs.length} plugin examples)</p>
          <div className="wr-switcher-grid mt-3" role="group" aria-label="Select worked-run fixture">
            {runs.map((r) => {
              const rFailed = r.gates.filter((g) => g.status === 'FAIL')
              const rOpen = r.decisions.filter((d) => d.verdict === 'OPEN')
              const isCurrent = r.id === activeRun.id
              return (
                <button
                  key={r.id}
                  type="button"
                  aria-pressed={isCurrent}
                  onClick={() => {
                    setSelectedRunId(r.id)
                    setFocusedGateId(null)
                  }}
                  className="wr-run-tab"
                >
                  <span className="flex w-full items-center justify-between gap-2">
                    <span className="mono text-xs" style={{ color: 'var(--ink-3)' }}>
                      {r.id}
                    </span>
                    <Verdict value={rFailed.length > 0 ? 'FAIL' : 'PASS'} />
                  </span>
                  <span className="display text-xl leading-snug" style={{ color: 'var(--ink)' }}>
                    {r.name}
                  </span>
                  <span className="mono text-xs" style={{ color: 'var(--ink-2)' }}>
                    Red: {rFailed.map((g) => g.id).join(', ') || 'none'} · Open:{' '}
                    {rOpen.map((d) => d.id).join(', ') || 'none'}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Interactive 6-Decision + 9-Stage Pipeline Diagram */}
      <section className="rule py-12" aria-labelledby="pipeline">
        <p className="eyebrow">pipeline · decisions to gates</p>
        <h2 id="pipeline" className="mt-3 max-w-3xl text-3xl leading-tight">
          How six expensive decisions govern nine lifecycle gates.
        </h2>
        <p className="measure mt-3 text-base" style={{ color: 'var(--ink-2)' }}>
          Select any decision or stage to inspect its reversal cost, file seam, and live status in{' '}
          <span className="mono">{activeRun.id}</span>.
        </p>
        <div className="mt-6">
          <DecisionPipelineDiagram
            activeRun={activeRun}
            onSelectStageGate={(gid) => setFocusedGateId(gid)}
          />
        </div>
      </section>

      <section className="rule py-14" aria-labelledby="frame">
        <div className="grid gap-10 md:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="eyebrow">frame · 00-frame.md</p>
            <h2 id="frame" className="mt-3 text-3xl leading-tight">
              The outcome, and the observation that turns it off.
            </h2>
          </div>
          <div className="measure space-y-5" style={{ color: 'var(--ink-2)' }}>
            <p className="text-lg" style={{ color: 'var(--ink)' }}>
              {activeRun.outcome}
            </p>
            <blockquote className="kill">
              <p className="eyebrow">Kill criterion</p>
              <p className="mt-2">{activeRun.killCriterion}</p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Trace Filter Controls */}
      <section className="rule py-10" aria-labelledby="trace-filters">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <p className="eyebrow" id="trace-filters">
              trace filter · inspect failure modes
            </p>
            <p className="mt-1 text-sm" style={{ color: 'var(--ink-2)' }} aria-live="polite">
              Showing {filteredDecisions.length} of {activeRun.decisions.length} decisions and{' '}
              {filteredGates.length} of {activeRun.gates.length} gates for{' '}
              <span className="mono">{activeRun.id}</span>.
            </p>
          </div>
          {(statusFilter !== 'all' || planeLens !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setStatusFilter('all')
                setPlaneLens('all')
              }}
              className="link text-sm"
            >
              Reset trace filters
            </button>
          )}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <p className="mono text-xs" style={{ color: 'var(--ink-3)' }}>
              Verdict status
            </p>
            <div className="wr-filter-bar mt-2" role="group" aria-label="Filter by gate or decision verdict">
              {(
                [
                  ['all', 'All verdicts'],
                  ['red', 'Red gates & OPEN'],
                  ['pass', 'Passing & MADE'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={statusFilter === id}
                  onClick={() => setStatusFilter(id)}
                  className="wr-chip"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mono text-xs" style={{ color: 'var(--ink-3)' }}>
              Failure-mode lens
            </p>
            <div className="wr-filter-bar mt-2" role="group" aria-label="Filter by architectural plane lens">
              {(
                [
                  ['all', 'All planes'],
                  ['trust', 'Trust & injection'],
                  ['ownership', 'Plane ownership'],
                  ['operations', 'Operate & restore'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={planeLens === id}
                  onClick={() => setPlaneLens(id)}
                  className="wr-chip"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rule py-14" aria-labelledby="decisions">
        <p className="eyebrow">decide · SYSTEM.md</p>
        <h2 id="decisions" className="mt-3 max-w-3xl text-3xl leading-tight">
          The decisions that are expensive to undo.
        </h2>
        {openDecisions.length > 0 ? (
          <p className="measure mt-4" style={{ color: 'var(--ink-2)' }}>
            Still open: {openDecisions.map((d) => DECISIONS[d.id] ?? d.id).join(', ')}. An open decision is allowed, as
            long as it carries a dated cost of waiting.
          </p>
        ) : (
          <p className="measure mt-4" style={{ color: 'var(--ink-2)' }}>
            All decisions in <span className="mono">{activeRun.id}</span> carry MADE verdicts with file-and-line
            pointers; inspect the lifecycle gates below for operational failures.
          </p>
        )}
        {filteredDecisions.length === 0 ? (
          <p className="mt-6 text-sm" style={{ color: 'var(--ink-3)' }}>
            No decisions match the active filter combination.
          </p>
        ) : (
          <div className="decisions mt-8">
            {filteredDecisions.map((d) => (
              <div key={d.id} className="decision">
                <p className="decision-name">{DECISIONS[d.id] ?? d.id}</p>
                <Verdict value={d.verdict} />
                <p className="mono decision-evidence">{d.evidence}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rule py-14" aria-labelledby="gates">
        <p className="eyebrow">verify · architecture.json</p>
        <h2 id="gates" className="mt-3 max-w-3xl text-3xl leading-tight">
          Every stage has a gate. The failures are written down, not smoothed over.
        </h2>
        {filteredGates.length === 0 ? (
          <p className="mt-6 text-sm" style={{ color: 'var(--ink-3)' }}>
            No gates match the active filter combination.
          </p>
        ) : (
          <ol className="gates mt-8" aria-label="Gate statuses in lifecycle order">
            {filteredGates.map((g) => (
              <li
                key={g.id}
                className={g.status === 'FAIL' ? 'gate-red' : ''}
                style={
                  focusedGateId === g.id
                    ? { background: '#edf0fb', paddingInline: '0.5rem', borderRadius: '0.35rem' }
                    : undefined
                }
              >
                <span className="gate-name">{g.id}</span>
                <Verdict value={g.status} />
                <span className="gate-note">{g.note}</span>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="rule py-14" aria-labelledby="finding">
        <div className="grid gap-10 md:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="eyebrow">review.md</p>
            <h2 id="finding" className="mt-3 text-3xl leading-tight">
              Find it before you read it.
            </h2>
          </div>
          <div className="measure space-y-4" style={{ color: 'var(--ink-2)' }}>
            <p className="text-lg" style={{ color: 'var(--ink)' }}>
              {socraticQuestion}
            </p>
            <details key={activeRun.id} className="reveal">
              <summary>Show the finding and its fix</summary>
              <p className="mt-4" style={{ color: 'var(--ink)', fontWeight: 600 }}>
                {activeRun.finding.title}
              </p>
              <ol className="fix mt-3">
                {activeRun.finding.fix.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </details>
          </div>
        </div>
      </section>

      <section className="rule py-14" aria-labelledby="receipt">
        <div className="grid gap-10 md:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="eyebrow">receipts/{activeRun.receipt.file}</p>
            <h2 id="receipt" className="mt-3 text-3xl leading-tight">
              The verifier re-derives; it does not repair.
            </h2>
          </div>
          <div className="measure space-y-5" style={{ color: 'var(--ink-2)' }}>
            <p>
              The example’s receipt records {activeRun.receipt.pointers} evidence pointers re-derived by the verifier
              role: {activeRun.receipt.confirmed} confirmed, {activeRun.receipt.failed} failed. In a real run that role
              works in a fresh context and never sees the other agents’ reasoning; here the receipt is part of the
              fixture, like everything else on this page. Every pointer can hold while a gate is red: pointers prove a
              finding, a gate judges it.
            </p>
            <p>
              What was measured here: the plugin’s own contract check on this artifact set, {activeRun.contract.pass} of{' '}
              {activeRun.contract.checks} checks pass, run {measuredAt} against plugin v{pluginVersion}. It checks
              shape, not judgement.
            </p>

            {/* AcademyGraph.v1 Evidence Bridge Readout */}
            <div className="wr-bridge-box">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="eyebrow">AcademyGraph.v1 · evidence bridge verdict</p>
                <Verdict value={bridgeProjection.advance.granted ? 'PASS' : 'FAIL'} />
              </div>
              <p className="mt-2 text-sm" style={{ color: 'var(--ink)' }}>
                Bridging <span className="mono">{activeRun.id}</span> into{' '}
                <span className="mono">advanceCapability()</span> returns{' '}
                <strong>{bridgeProjection.advance.granted ? 'GRANTED' : 'REFUSED'}</strong>
                {!bridgeProjection.advance.granted && (
                  <> ({bridgeProjection.advance.refusals.length} non-compensable refusal checks active)</>
                )}
                .
              </p>
              {evalRefusals.length > 0 && (
                <ul className="mt-3 space-y-1 text-xs mono" style={{ color: 'var(--ink-2)' }}>
                  {evalRefusals.map((refusal) => (
                    <li key={`${refusal.code}-${refusal.subject}`}>
                      • [{refusal.code}] {refusal.subject}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-3 text-xs" style={{ color: 'var(--ink-3)' }}>
                Plugin fixtures also withhold live <span className="mono">deploy-url</span> locators and independent
                human reviews; inspect the{' '}
                <Link className="link" href="/path">
                  flagship path
                </Link>{' '}
                and{' '}
                <Link className="link" href="/curriculum">
                  offline labs
                </Link>{' '}
                for full advancement criteria.
              </p>
            </div>

            <p>
              <a className="link" href={activeRun.source}>
                Read every file in this example
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="rule py-14" aria-labelledby="more">
        <p className="eyebrow">More fixtures from the plugin</p>
        <h2 id="more" className="mt-3 max-w-3xl text-3xl leading-tight">
          Different systems, different gates go red.
        </h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {otherRuns.map((r) => {
            const rFailed = r.gates.filter((g) => g.status === 'FAIL')
            return (
              <article key={r.id} className="run">
                <p className="eyebrow">{r.name} · fixture</p>
                <p className="mt-2" style={{ color: 'var(--ink-2)' }}>
                  {r.goal}
                </p>
                <p className="mt-4 text-sm">
                  Failed: {rFailed.map((g) => g.id).join(', ') || 'none'} · receipt pointers {r.receipt.confirmed}/
                  {r.receipt.pointers} confirmed
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRunId(r.id)
                      setFocusedGateId(null)
                      if (typeof window !== 'undefined') {
                        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
                        window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
                      }
                    }}
                    className="link text-sm"
                  >
                    Inspect {r.id} on this page
                  </button>
                  <a className="link text-sm" href={r.source}>
                    Read the example
                  </a>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </>
  )
}
