'use client'

import { useMemo, useRef, useState, type KeyboardEvent } from 'react'
import Link from 'next/link'
import {
  ROLE_ENTRY_TRACKS,
  resolveRoleEntryTrack,
  type RoleEntryTrackId,
} from '@/lib/academy-graph/evidence-bridge'

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']
const spell = (n: number) => WORDS[n] ?? String(n)

export function RoleEntrySelector() {
  const resolvedTracks = useMemo(
    () => ROLE_ENTRY_TRACKS.map((track) => resolveRoleEntryTrack(track.id)),
    [],
  )

  const [selectedId, setSelectedId] = useState<RoleEntryTrackId>(
    resolvedTracks[0]?.id ?? 'systems-architect',
  )
  const [copiedId, setCopiedId] = useState<RoleEntryTrackId | null>(null)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  const activeIndex = Math.max(
    0,
    resolvedTracks.findIndex((track) => track.id === selectedId),
  )
  const activeTrack = resolvedTracks[activeIndex] ?? resolvedTracks[0]

  function focusAndSelect(index: number) {
    const normalized = (index + resolvedTracks.length) % resolvedTracks.length
    const target = resolvedTracks[normalized]
    if (!target) return
    setSelectedId(target.id)
    setCopiedId(null)
    tabRefs.current[normalized]?.focus()
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      focusAndSelect(index + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      focusAndSelect(index - 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      focusAndSelect(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      focusAndSelect(resolvedTracks.length - 1)
    }
  }

  async function handleCopyCommand() {
    try {
      await navigator.clipboard.writeText(activeTrack.labCommand)
      setCopiedId(activeTrack.id)
    } catch {
      setCopiedId(null)
    }
  }

  const stageCode = String(activeTrack.stageOrdinal).padStart(2, '0')
  const tabId = `role-entry-tab-${activeTrack.id}`
  const panelId = `role-entry-panel-${activeTrack.id}`

  return (
    <section
      className="dp-shell mt-12"
      aria-labelledby="role-entry-heading"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <p className="eyebrow">Role-mapped starting route</p>
          <h2 id="role-entry-heading" className="mt-2 text-2xl sm:text-3xl">
            Pick your seat across {spell(resolvedTracks.length)} accountable tracks.
          </h2>
        </div>
        <p className="text-sm" style={{ color: 'var(--ink-3)' }}>
          Same graph contract · tailored first stage, offline lab, and proof surface
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Role entry tracks"
        className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-5"
      >
        {resolvedTracks.map((track, idx) => {
          const isSelected = track.id === activeTrack.id
          return (
            <button
              key={track.id}
              ref={(el) => {
                tabRefs.current[idx] = el
              }}
              id={`role-entry-tab-${track.id}`}
              role="tab"
              type="button"
              aria-selected={isSelected}
              aria-controls={`role-entry-panel-${track.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => {
                setSelectedId(track.id)
                setCopiedId(null)
              }}
              onKeyDown={(event) => handleTabKeyDown(event, idx)}
              className="flex min-h-[48px] flex-col justify-between rounded-lg border px-3.5 py-2.5 text-left transition-colors"
              style={{
                borderColor: isSelected ? 'var(--cobalt)' : 'var(--rule)',
                background: isSelected ? '#edf0fb' : 'var(--paper)',
                boxShadow: isSelected ? 'inset 0 0 0 1px var(--cobalt)' : 'none',
              }}
            >
              <span className="mono text-xs" style={{ color: 'var(--ink-3)' }}>
                {track.entryMode === 'agent' ? 'Sponsored agent' : 'Human operator'}
              </span>
              <span className="mt-1 block text-sm font-semibold leading-snug" style={{ color: 'var(--ink)' }}>
                {track.label}
              </span>
            </button>
          )
        })}
      </div>

      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={tabId}
        tabIndex={0}
        className="mt-6 rounded-xl border p-5 sm:p-6"
        style={{ borderColor: 'var(--rule)', background: 'var(--paper)' }}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b pb-4" style={{ borderColor: 'var(--rule)' }}>
          <div>
            <p className="eyebrow">
              {activeTrack.label} · Stage {stageCode} ({activeTrack.stageTitle})
            </p>
            <h3 className="mt-1.5 text-xl sm:text-2xl">Day-one decision</h3>
          </div>
          <span className="mono text-xs" style={{ color: 'var(--cobalt-ink)' }}>
            {activeTrack.artifactId} · {activeTrack.receiptSchema}
          </span>
        </div>

        <p className="mt-4 text-base leading-relaxed" style={{ color: 'var(--ink)' }}>
          {activeTrack.dayOneDecision}
        </p>
        <p className="mt-2 text-sm" style={{ color: 'var(--ink-2)' }}>
          <strong className="font-semibold" style={{ color: 'var(--ink)' }}>
            Graph stage question:
          </strong>{' '}
          {activeTrack.stageDecision}
        </p>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div
            className="rounded-lg border p-4"
            style={{ borderColor: 'var(--rule)', background: '#fcfaf5' }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="eyebrow">Offline Python stdlib lab check</p>
              <button
                type="button"
                onClick={handleCopyCommand}
                className="studio-copy"
                aria-label={`Copy lab command for ${activeTrack.label}`}
              >
                {copiedId === activeTrack.id ? 'Copied' : 'Copy command'}
              </button>
            </div>
            <pre className="cmd mt-3">
              <code>{activeTrack.labCommand}</code>
            </pre>
            <p className="mt-2.5 text-xs leading-relaxed" style={{ color: 'var(--ink-3)' }}>
              {activeTrack.labNote}
            </p>
            <span className="sr-only" aria-live="polite">
              {copiedId === activeTrack.id ? 'Lab command copied to clipboard.' : ''}
            </span>
          </div>

          <div
            className="flex flex-col justify-between rounded-lg border p-4"
            style={{ borderColor: 'var(--rule)', background: '#fcfaf5' }}
          >
            <div>
              <p className="eyebrow">Proof surface · {activeTrack.proofHref}</p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--ink-2)' }}>
                {activeTrack.proofSummary}
              </p>
              <p className="mono mt-2.5 text-xs" style={{ color: 'var(--ink-3)' }}>
                Verified by: {activeTrack.evalIds.join(', ')}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2.5">
              <Link href={activeTrack.stagePath} className="btn btn-primary text-sm">
                Start stage {stageCode}: {activeTrack.stageTitle}
              </Link>
              <Link href={activeTrack.proofHref} className="btn btn-quiet text-sm">
                {activeTrack.proofLabel}
              </Link>
              <a href={activeTrack.anchorHref} className="btn btn-quiet text-sm">
                {activeTrack.entryMode === 'agent' ? 'Agent contract ↓' : 'Cohort route ↓'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
