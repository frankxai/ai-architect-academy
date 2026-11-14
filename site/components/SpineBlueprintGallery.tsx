'use client'

import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import Link from 'next/link'
import {
  SPINE_BLUEPRINT_PLATES,
  type SpineBlueprintId,
} from '@/lib/academy-graph/evidence-bridge'
import { projectProductionAgentSystems } from '@/lib/academy-graph/production-agent-systems'

const ZOOM_PRESETS = [
  { id: 'fit', label: 'Fit', cssWidth: '100%', minWidth: '44rem' },
  { id: 'zoom-140', label: '140%', cssWidth: '140%', minWidth: '61.6rem' },
] as const

type ZoomPresetId = (typeof ZOOM_PRESETS)[number]['id']

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']
const spell = (n: number) => WORDS[n] ?? String(n)

export function SpineBlueprintGallery() {
  const [selectedId, setSelectedId] = useState<SpineBlueprintId>(
    SPINE_BLUEPRINT_PLATES[0]?.id ?? 'four-plane-agent-runtime',
  )
  const [zoom, setZoom] = useState<ZoomPresetId>('fit')
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  const activeIndex = Math.max(
    0,
    SPINE_BLUEPRINT_PLATES.findIndex((plate) => plate.id === selectedId),
  )
  const activePlate = SPINE_BLUEPRINT_PLATES[activeIndex] ?? SPINE_BLUEPRINT_PLATES[0]
  const activeZoom = ZOOM_PRESETS.find((preset) => preset.id === zoom) ?? ZOOM_PRESETS[0]

  const relatedStages = projectProductionAgentSystems.stages.filter((stage) =>
    activePlate.stageIds.includes(stage.id),
  )

  function focusAndSelect(index: number) {
    const normalized =
      (index + SPINE_BLUEPRINT_PLATES.length) % SPINE_BLUEPRINT_PLATES.length
    const nextPlate = SPINE_BLUEPRINT_PLATES[normalized]
    if (!nextPlate) return
    setSelectedId(nextPlate.id)
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
      focusAndSelect(SPINE_BLUEPRINT_PLATES.length - 1)
    }
  }

  const tabId = `spine-plate-tab-${activePlate.id}`
  const panelId = `spine-plate-panel-${activePlate.id}`

  return (
    <section
      className="studio-bleed studio-stage mt-8"
      aria-labelledby="spine-gallery-heading"
    >
      <div className="studio-stage-inner">
        <div className="studio-toolbar">
          <div>
            <p className="eyebrow" style={{ color: '#9aa1b5' }}>
              Production spine plates &amp; non-compensable invariants
            </p>
            <h2 id="spine-gallery-heading" className="mt-1 text-2xl text-[#f2f1ec]">
              Inspect {spell(SPINE_BLUEPRINT_PLATES.length)} core runtime, firewall, and admission blueprints
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="studio-segment" role="group" aria-label="Spine plate zoom">
              {ZOOM_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  aria-pressed={zoom === preset.id}
                  onClick={() => setZoom(preset.id)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className="studio-providers"
          role="tablist"
          aria-label="Production spine blueprints"
        >
          {SPINE_BLUEPRINT_PLATES.map((plate, idx) => {
            const isSelected = plate.id === activePlate.id
            return (
              <button
                key={plate.id}
                ref={(el) => {
                  tabRefs.current[idx] = el
                }}
                id={`spine-plate-tab-${plate.id}`}
                role="tab"
                type="button"
                aria-selected={isSelected}
                aria-controls={`spine-plate-panel-${plate.id}`}
                tabIndex={isSelected ? 0 : -1}
                style={
                  {
                    '--accent': '#5ee6cf',
                    color: isSelected ? '#f2f1ec' : undefined,
                    borderColor: isSelected ? '#5ee6cf' : undefined,
                    background: isSelected ? 'rgba(94, 230, 207, 0.12)' : undefined,
                  } as CSSProperties
                }
                onClick={() => setSelectedId(plate.id)}
                onKeyDown={(event) => handleTabKeyDown(event, idx)}
              >
                <span className="studio-dot" aria-hidden="true" />
                <span>{plate.shortLabel}</span>
              </button>
            )
          })}
        </div>

        <div
          id={panelId}
          role="tabpanel"
          aria-labelledby={tabId}
          tabIndex={0}
          className="studio-grid"
        >
          <div
            className="overflow-auto rounded-2xl border border-[#262a3a] bg-[#0a0b10]/70 p-3 sm:p-5"
            style={{ maxHeight: '44rem' }}
          >
            <div style={{ width: activeZoom.cssWidth, minWidth: activeZoom.minWidth }}>
              <img
                key={activePlate.src}
                src={activePlate.src}
                alt={activePlate.alt}
                width={activePlate.width}
                height={activePlate.height}
                decoding="async"
                className="block h-auto w-full rounded-xl"
              />
            </div>
          </div>

          <aside
            className="studio-inspector"
            aria-label="Selected spine blueprint invariants and proof links"
          >
            <p className="eyebrow" style={{ color: '#9aa1b5' }}>
              {activePlate.eyebrow}
            </p>
            <h3 className="mt-1 text-xl text-[#f2f1ec]">{activePlate.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#cbd5e1]">
              {activePlate.summary}
            </p>

            <div className="mt-4 border-t border-[#262a3a] pt-3">
              <p className="eyebrow" style={{ color: '#5ee6cf' }}>
                Architectural invariants
              </p>
              <ul className="mt-2.5 space-y-2 text-xs leading-relaxed text-[#ece9e1]">
                {activePlate.invariants.map((note) => (
                  <li key={note} className="flex gap-2">
                    <span className="text-[#5ee6cf]" aria-hidden="true">
                      ·
                    </span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            {relatedStages.length > 0 ? (
              <div className="mt-4 border-t border-[#262a3a] pt-3">
                <p className="eyebrow" style={{ color: '#9aa1b5' }}>
                  Linked flagship stages
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {relatedStages.map((stage) => {
                    const slug = stage.id.replace(/^stage:/, '')
                    return (
                      <Link
                        key={stage.id}
                        href={`/path/${slug}`}
                        className="mono rounded border border-[#262a3a] bg-[#0f1017] px-2 py-1 text-xs text-[#a9b8ff] hover:border-[#a9b8ff]"
                      >
                        {String(stage.ordinal).padStart(2, '0')} · {stage.title}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap gap-2">
              {activePlate.proofLinks.map((proof) => (
                <Link
                  key={`${activePlate.id}-${proof.href}`}
                  href={proof.href}
                  className="studio-quiet inline-flex items-center"
                >
                  {proof.label}
                </Link>
              ))}
              <a
                className="studio-quiet inline-flex items-center"
                href={activePlate.src}
                target="_blank"
                rel="noreferrer"
              >
                Open raw SVG
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
