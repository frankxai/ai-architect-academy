'use client'

import { useState } from 'react'
import Link from 'next/link'

export interface PipelineRunOverlay {
  readonly id: string
  readonly name: string
  readonly decisions: readonly {
    readonly id: string
    readonly verdict: string
    readonly evidence: string
  }[]
  readonly gates: readonly {
    readonly id: string
    readonly status: string
    readonly note: string
  }[]
}

interface ProductionDecisionSpec {
  readonly id: string
  readonly ordinal: string
  readonly title: string
  readonly workedRunDecisionId: 'model' | 'loop' | 'trust' | 'run' | null
  readonly summary: string
  readonly reversalCost: string
  readonly artifactFile: string
  readonly stageIds: readonly string[]
}

interface ArchitectStageSpec {
  readonly id: string
  readonly ordinal: string
  readonly label: string
  readonly pathSlug: string
  readonly artifactFile: string
  readonly gateQuestion: string
}

const PRODUCTION_DECISIONS: readonly ProductionDecisionSpec[] = [
  {
    id: 'scope-kill',
    ordinal: 'D1',
    title: 'Scope & kill criterion',
    workedRunDecisionId: null,
    summary: 'Name the single user job, explicit non-goals, and the dated observation that turns the system off.',
    reversalCost: 'Building for an unmeasured outcome compounds across every downstream prompt, tool, and eval.',
    artifactFile: '00-frame.md · 01-discovery.md',
    stageIds: ['frame', 'discovery'],
  },
  {
    id: 'model-seam',
    ordinal: 'D2',
    title: 'Model call seam',
    workedRunDecisionId: 'model',
    summary: 'Route every model SDK call through one owned module with explicit tier, timeout, and fallback rules.',
    reversalCost: 'Scattered SDK imports across routes and workers prevent uniform cost caps, tracing, and failover.',
    artifactFile: 'SYSTEM.md (planes.model)',
    stageIds: ['decisions', 'economics'],
  },
  {
    id: 'loop-shape',
    ordinal: 'D3',
    title: 'Orchestration loop',
    workedRunDecisionId: 'loop',
    summary: 'Enforce step limits, retry bounds, and exit conditions in deterministic code rather than prompt prose.',
    reversalCost: 'Open-ended agent loops amplify latency, token burn, and cascading tool side-effects.',
    artifactFile: '02-user-flows.md · SYSTEM.md (planes.loop)',
    stageIds: ['flow', 'decisions'],
  },
  {
    id: 'trust-authority',
    ordinal: 'D4',
    title: 'Trust & tool authority',
    workedRunDecisionId: 'trust',
    summary: 'Quarantine T3 data outside system instructions and isolate one revocable principal per write tool.',
    reversalCost: 'Retrofitting least privilege after T3 text reaches system prompts or shared credentials requires re-architecting every tool.',
    artifactFile: '05-trust-boundary.md · authority-matrix.json',
    stageIds: ['flow', 'trust', 'evals'],
  },
  {
    id: 'eval-economics',
    ordinal: 'D5',
    title: 'Eval gate & unit ceiling',
    workedRunDecisionId: null,
    summary: 'Lock golden, refusal, and injection suites with non-compensable admission gates and hard spend ceilings.',
    reversalCost: 'Compensable averages and monthly-only cost alerts mask regressions and runaway spend until customer impact.',
    artifactFile: '04-roi.md · 06-evals/cases.jsonl',
    stageIds: ['economics', 'evals', 'verify'],
  },
  {
    id: 'runtime-restore',
    ordinal: 'D6',
    title: 'Long-run & restore home',
    workedRunDecisionId: 'run',
    summary: 'Match job duration to request vs durable worker homes and dry-run every rollback and backup restore step.',
    reversalCost: 'Request timeouts truncate multi-minute jobs; untested restore commands fail during live incidents.',
    artifactFile: '07-runbook.md · receipts/*-verify.md',
    stageIds: ['decisions', 'operate', 'verify'],
  },
] as const

const ARCHITECT_STAGES: readonly ArchitectStageSpec[] = [
  {
    id: 'frame',
    ordinal: '01',
    label: 'frame',
    pathSlug: 'system-brief',
    artifactFile: '00-frame.md',
    gateQuestion: 'One-sentence outcome, explicit out-of-scope list, and measurable kill criterion.',
  },
  {
    id: 'discovery',
    ordinal: '02',
    label: 'discovery',
    pathSlug: 'incident-simulation',
    artifactFile: '01-discovery.md',
    gateQuestion: 'Zero unresolved [assumed] markers and explicit telemetry signals before build.',
  },
  {
    id: 'flow',
    ordinal: '03',
    label: 'flow',
    pathSlug: 'tool-authority-model',
    artifactFile: '02-user-flows.md',
    gateQuestion: 'Explicit failure branches, refusal paths, and bounded tool-authority handoffs.',
  },
  {
    id: 'decisions',
    ordinal: '04',
    label: 'decisions',
    pathSlug: 'architecture-decision',
    artifactFile: 'SYSTEM.md · ADR-*',
    gateQuestion: 'Named owner per plane, rejected credible option, and dated cost of any OPEN decision.',
  },
  {
    id: 'economics',
    ordinal: '05',
    label: 'economics',
    pathSlug: 'cost-model',
    artifactFile: '04-roi.md · prices.json',
    gateQuestion: 'Dated price sources, cost per unit of work, and an enforcing runaway-spend stop.',
  },
  {
    id: 'trust',
    ordinal: '06',
    label: 'trust',
    pathSlug: 'threat-model',
    artifactFile: '05-trust-boundary.md',
    gateQuestion: 'Every T3 source enters data position with escaped wrappers, never system instructions.',
  },
  {
    id: 'evals',
    ordinal: '07',
    label: 'evals',
    pathSlug: 'eval-harness',
    artifactFile: '06-evals/cases.jsonl',
    gateQuestion: 'Golden, refusal, and injection cases locked apart from prompts; red gates fail closed.',
  },
  {
    id: 'operate',
    ordinal: '08',
    label: 'operate',
    pathSlug: 'deployment',
    artifactFile: '07-runbook.md',
    gateQuestion: 'Resolved binaries, dry-run exit codes recorded, live reachability, and tested rollback.',
  },
  {
    id: 'verify',
    ordinal: '09',
    label: 'verify',
    pathSlug: 'portfolio-proof',
    artifactFile: 'receipts/*-verify.md',
    gateQuestion: 'Fresh-context verifier re-derives every file:line pointer; public proof leaks zero redactions.',
  },
] as const

function Badge({ value }: { value: string }) {
  const tone =
    value === 'PASS' || value === 'MADE'
      ? 'v-pass'
      : value === 'FAIL'
        ? 'v-fail'
        : 'v-open'
  return <span className={`verdict ${tone}`}>{value}</span>
}

export interface DecisionPipelineDiagramProps {
  readonly activeRun?: PipelineRunOverlay
  readonly onSelectStageGate?: (gateId: string) => void
}

export function DecisionPipelineDiagram({
  activeRun,
  onSelectStageGate,
}: DecisionPipelineDiagramProps) {
  const [selectedKind, setSelectedKind] = useState<'decision' | 'stage'>('decision')
  const [selectedId, setSelectedId] = useState<string>(PRODUCTION_DECISIONS[3].id)

  const gateStatusMap = new Map(
    (activeRun?.gates ?? []).map((g) => [g.id, g]),
  )
  const decisionVerdictMap = new Map(
    (activeRun?.decisions ?? []).map((d) => [d.id, d]),
  )

  const activeDecision =
    selectedKind === 'decision'
      ? PRODUCTION_DECISIONS.find((d) => d.id === selectedId) ?? PRODUCTION_DECISIONS[0]
      : null

  const activeStage =
    selectedKind === 'stage'
      ? ARCHITECT_STAGES.find((s) => s.id === selectedId) ?? ARCHITECT_STAGES[0]
      : null

  const relatedStageIds = new Set<string>(
    activeDecision ? activeDecision.stageIds : activeStage ? [activeStage.id] : [],
  )

  const relatedDecisionIds = new Set<string>(
    activeStage
      ? PRODUCTION_DECISIONS.filter((d) => d.stageIds.includes(activeStage.id)).map((d) => d.id)
      : activeDecision
        ? [activeDecision.id]
        : [],
  )

  function decisionBadgeFor(spec: ProductionDecisionSpec): string | null {
    if (!activeRun) return null
    if (spec.workedRunDecisionId) {
      const d = decisionVerdictMap.get(spec.workedRunDecisionId)
      if (d?.verdict === 'OPEN') return 'OPEN'
    }
    const anyStageFailed = spec.stageIds.some((sid) => gateStatusMap.get(sid)?.status === 'FAIL')
    if (anyStageFailed) return 'FAIL'
    if (spec.workedRunDecisionId) {
      return decisionVerdictMap.get(spec.workedRunDecisionId)?.verdict ?? 'MADE'
    }
    return 'PASS'
  }

  return (
    <div className="dp-shell" role="region" aria-label="Production decisions and architect stage pipeline">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="eyebrow">
          {PRODUCTION_DECISIONS.length} production decisions → {ARCHITECT_STAGES.length}{' '}
          <span className="mono">/architect</span> lifecycle gates
        </p>
        {activeRun && (
          <p className="mono text-xs" style={{ color: 'var(--ink-3)' }}>
            Overlay: {activeRun.name}
          </p>
        )}
      </div>

      {/* Layer 1: 6 Production Decisions */}
      <div className="dp-grid-decisions mt-4" role="group" aria-label="Six expensive-to-undo production decisions">
        {PRODUCTION_DECISIONS.map((dec) => {
          const isSelected = selectedKind === 'decision' && selectedId === dec.id
          const isRelated = relatedDecisionIds.has(dec.id)
          const badge = decisionBadgeFor(dec)
          const isRed = badge === 'FAIL' || badge === 'OPEN'
          return (
            <button
              key={dec.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => {
                setSelectedKind('decision')
                setSelectedId(dec.id)
              }}
              className={`dp-card ${isRelated ? 'is-related' : ''} ${isRed ? 'is-red' : ''}`}
            >
              <div className="flex w-full items-center justify-between gap-2">
                <span className="mono text-xs font-semibold" style={{ color: 'var(--cobalt-ink)' }}>
                  {dec.ordinal}
                </span>
                {badge && <Badge value={badge} />}
              </div>
              <span className="display text-lg leading-snug" style={{ color: 'var(--ink)' }}>
                {dec.title}
              </span>
              <span className="mono text-xs" style={{ color: 'var(--ink-3)' }}>
                Gates: {dec.stageIds.join(' · ')}
              </span>
            </button>
          )
        })}
      </div>

      {/* Layer 2: 9 /architect Lifecycle Stages */}
      <p className="eyebrow mt-6">Lifecycle execution &amp; verification order</p>
      <div className="dp-stages-rail mt-3" role="group" aria-label="Nine architect lifecycle stages">
        {ARCHITECT_STAGES.map((stage) => {
          const isSelected = selectedKind === 'stage' && selectedId === stage.id
          const isRelated = relatedStageIds.has(stage.id)
          const gateOverlay = gateStatusMap.get(stage.id)
          const status = gateOverlay?.status ?? null
          return (
            <button
              key={stage.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => {
                setSelectedKind('stage')
                setSelectedId(stage.id)
                onSelectStageGate?.(stage.id)
              }}
              className={`dp-stage-pill ${isRelated ? 'is-related' : ''} ${status === 'FAIL' ? 'is-fail' : ''}`}
            >
              <span className="flex w-full items-center justify-between gap-1">
                <span className="mono text-xs" style={{ color: 'var(--ink-3)' }}>
                  {stage.ordinal}
                </span>
                {status && <Badge value={status} />}
              </span>
              <span className="display italic text-base leading-tight" style={{ color: 'var(--ink)' }}>
                {stage.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Inspector Readout */}
      <div className="dp-inspector" aria-live="polite">
        {activeDecision && (
          <div className="grid gap-3 md:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="eyebrow">
                {activeDecision.ordinal} · {activeDecision.artifactFile}
              </p>
              <h3 className="mt-1 text-xl leading-snug">{activeDecision.title}</h3>
              <p className="mt-2 text-sm" style={{ color: 'var(--ink-2)' }}>
                {activeDecision.summary}
              </p>
            </div>
            <div className="space-y-2 text-sm" style={{ color: 'var(--ink-2)' }}>
              <p>
                <strong style={{ color: 'var(--ink)' }}>Why expensive to undo:</strong>{' '}
                {activeDecision.reversalCost}
              </p>
              {activeRun && activeDecision.workedRunDecisionId && (
                <p className="mono text-xs" style={{ color: 'var(--ink)' }}>
                  {activeRun.id} evidence:{' '}
                  {decisionVerdictMap.get(activeDecision.workedRunDecisionId)?.evidence}
                </p>
              )}
            </div>
          </div>
        )}

        {activeStage && (
          <div className="grid gap-3 md:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="eyebrow">
                Stage {activeStage.ordinal} · {activeStage.artifactFile}
              </p>
              <h3 className="mt-1 text-xl leading-snug">
                gate.{activeStage.label}
              </h3>
              <p className="mt-2 text-sm" style={{ color: 'var(--ink-2)' }}>
                {activeStage.gateQuestion}
              </p>
            </div>
            <div className="space-y-2 text-sm" style={{ color: 'var(--ink-2)' }}>
              {activeRun && gateStatusMap.get(activeStage.id) && (
                <p className="mono text-xs" style={{ color: 'var(--ink)' }}>
                  [{gateStatusMap.get(activeStage.id)?.status}] {gateStatusMap.get(activeStage.id)?.note}
                </p>
              )}
              <p>
                <Link className="link text-sm" href={`/path/${activeStage.pathSlug}`}>
                  Inspect flagship stage specification (/path/{activeStage.pathSlug})
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
