'use client'

import { useState, type CSSProperties } from 'react'
import rawRegistry from '@/data/diagrams-registry.json'

type RoadmapDiagram = {
  id: string
  label: string
  dir: string
  itemCount: number
  src: string
  file: string
  width: number
  height: number
  bytes: number
  sha256: string
  repoHref: string
}

type PatternDiagram = {
  id: string
  title: string
  summary: string
  sourceDoc: string
  d2Source?: string
  src: string
  file: string
  width: number
  height: number
  bytes: number
  sha256: string
  repoHref: string
}

type DiagramsRegistry = {
  schema: string
  measuredAt: string
  compiler: string
  wcagAaMinContrast: number
  livingWorld: {
    id: string
    src: string
    file: string
    provenance: string
    width: number
    height: number
    bytes: number
    sha256: string
    alt: string
    source: string
    edition: string
  }
  curriculumRoadmaps: RoadmapDiagram[]
  patterns: PatternDiagram[]
}

const registry = rawRegistry as DiagramsRegistry

const ZOOM_STEPS = [
  { id: 'fit', label: 'Fit stage', cssWidth: '100%', minWidth: '44rem' },
  { id: 'detail', label: 'Detail zoom', cssWidth: '140%', minWidth: '61.6rem' },
  { id: 'closeup', label: 'Close-up zoom', cssWidth: '180%', minWidth: '79.2rem' },
] as const

type ZoomId = (typeof ZOOM_STEPS)[number]['id']
type ExplorerMode = 'roadmaps' | 'patterns'

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']
const spell = (n: number) => WORDS[n] ?? String(n)

export function CurriculumVisualExplorer() {
  const { curriculumRoadmaps, patterns, livingWorld, measuredAt } = registry
  const [mode, setMode] = useState<ExplorerMode>('roadmaps')
  const [roadmapId, setRoadmapId] = useState<string>(curriculumRoadmaps[0]?.id ?? 'patterns')
  const [patternId, setPatternId] = useState<string>(patterns[0]?.id ?? 'opencode-cloudflare-stack')
  const [zoom, setZoom] = useState<ZoomId>('fit')

  const activeRoadmap = curriculumRoadmaps.find((entry) => entry.id === roadmapId) ?? curriculumRoadmaps[0]
  const activePattern = patterns.find((entry) => entry.id === patternId) ?? patterns[0]
  const activeZoom = ZOOM_STEPS.find((step) => step.id === zoom) ?? ZOOM_STEPS[0]

  const diagramSrc = mode === 'roadmaps' ? activeRoadmap.src : activePattern.src
  const diagramWidth = mode === 'roadmaps' ? activeRoadmap.width : activePattern.width
  const diagramHeight = mode === 'roadmaps' ? activeRoadmap.height : activePattern.height
  const diagramAlt =
    mode === 'roadmaps'
      ? `${activeRoadmap.label} curriculum section inventory generated from ${activeRoadmap.dir}`
      : `${activePattern.title} reference architecture diagram: ${activePattern.summary}`

  return (
    <section className="studio-bleed studio-stage mt-14" aria-labelledby="visual-explorer-heading">
      <div className="studio-stage-inner">
        <div className="studio-toolbar">
          <div>
            <p className="eyebrow" style={{ color: '#8b90a0' }}>
              Visual architecture &amp; curriculum inventory explorer
            </p>
            <h2 id="visual-explorer-heading" className="mt-1 text-2xl text-[#f2f1ec]">
              Switch between {spell(curriculumRoadmaps.length)} section inventories and {spell(patterns.length)} reference blueprints
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="studio-segment" role="group" aria-label="Diagram category">
              <button
                type="button"
                aria-pressed={mode === 'roadmaps'}
                onClick={() => setMode('roadmaps')}
              >
                Section inventories ({curriculumRoadmaps.length})
              </button>
              <button
                type="button"
                aria-pressed={mode === 'patterns'}
                onClick={() => setMode('patterns')}
              >
                Architecture blueprints ({patterns.length})
              </button>
            </div>

            <div className="studio-segment" role="group" aria-label="Diagram zoom">
              {ZOOM_STEPS.map((step) => (
                <button
                  key={step.id}
                  type="button"
                  aria-pressed={zoom === step.id}
                  onClick={() => setZoom(step.id)}
                >
                  {step.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {mode === 'roadmaps' ? (
          <div className="studio-providers" role="group" aria-label="Curriculum section inventories">
            {curriculumRoadmaps.map((roadmap) => (
              <button
                key={roadmap.id}
                type="button"
                aria-pressed={activeRoadmap.id === roadmap.id}
                style={{ '--accent': '#7c93ff' } as CSSProperties}
                onClick={() => setRoadmapId(roadmap.id)}
              >
                <span className="studio-dot" aria-hidden="true" />
                <span>{roadmap.label}</span>
                <span className="studio-score">{roadmap.itemCount}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="studio-providers" role="group" aria-label="Core architecture blueprints">
            {patterns.map((pattern) => (
              <button
                key={pattern.id}
                type="button"
                aria-pressed={activePattern.id === pattern.id}
                style={{ '--accent': '#5ee6cf' } as CSSProperties}
                onClick={() => setPatternId(pattern.id)}
              >
                <span className="studio-dot" aria-hidden="true" />
                <span>{pattern.title}</span>
              </button>
            ))}
          </div>
        )}

        <div className="studio-grid">
          <div
            className="overflow-auto rounded-2xl border border-[#262a3a] bg-[#0a0b10]/70 p-3 sm:p-5"
            style={{ maxHeight: '46rem' }}
          >
            <div style={{ width: activeZoom.cssWidth, minWidth: activeZoom.minWidth }}>
              <img
                key={diagramSrc}
                src={diagramSrc}
                alt={diagramAlt}
                width={diagramWidth}
                height={diagramHeight}
                decoding="async"
                className="block h-auto w-full rounded-xl"
              />
            </div>
          </div>

          <aside className="studio-inspector" aria-label="Selected diagram provenance and companion plate">
            <p className="eyebrow" style={{ color: '#8b90a0' }}>
              {mode === 'roadmaps' ? 'Curriculum section inventory' : 'Reference blueprint'}
            </p>
            <h3 className="mt-1 text-xl text-[#f2f1ec]">
              {mode === 'roadmaps' ? activeRoadmap.label : activePattern.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#b9bccb]">
              {mode === 'roadmaps'
                ? `Compiled directly from ${activeRoadmap.dir} as measured on ${measuredAt}. Every card maps to a public item listed in the directory below.`
                : activePattern.summary}
            </p>

            <dl className="studio-dl mt-3">
              <dt>Repository path</dt>
              <dd className="mono text-xs text-[#ece9e1]">
                {mode === 'roadmaps' ? activeRoadmap.dir : activePattern.sourceDoc}
              </dd>
              {mode === 'patterns' && activePattern.d2Source ? (
                <>
                  <dt>Topology spec</dt>
                  <dd className="mono text-xs text-[#ece9e1]">{activePattern.d2Source}</dd>
                </>
              ) : null}
              {mode === 'roadmaps' ? (
                <>
                  <dt>Measured public items</dt>
                  <dd className="mono text-xs text-[#ece9e1]">{activeRoadmap.itemCount}</dd>
                </>
              ) : null}
              <dt>Vector checksum</dt>
              <dd className="mono text-xs text-[#8b90a0]">sha256:{(mode === 'roadmaps' ? activeRoadmap.sha256 : activePattern.sha256).slice(0, 12)}</dd>
            </dl>

            <div className="mt-4 flex flex-wrap gap-2">
              <a className="studio-quiet inline-flex items-center" href={diagramSrc} target="_blank" rel="noreferrer">
                Open raw SVG
              </a>
              <a
                className="studio-quiet inline-flex items-center"
                href={mode === 'roadmaps' ? activeRoadmap.repoHref : activePattern.repoHref}
                target="_blank"
                rel="noreferrer"
              >
                Inspect source
              </a>
              {mode === 'roadmaps' ? (
                <a className="studio-quiet inline-flex items-center" href={`#sec-${activeRoadmap.id}`}>
                  Jump to list
                </a>
              ) : null}
            </div>

            <figure className="mt-5 overflow-hidden rounded-xl border border-[#262a3a] bg-[#0f1017]">
              <img
                src={livingWorld.src}
                alt={livingWorld.alt}
                width={livingWorld.width}
                height={livingWorld.height}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full object-cover"
              />
              <figcaption className="border-t border-[#262a3a] px-3 py-2.5 text-xs leading-relaxed text-[#8b90a0]">
                <span className="block font-medium text-[#ece9e1]">Observatory study frame</span>
                <span>Concept artwork · {livingWorld.edition} plate</span>
              </figcaption>
            </figure>
          </aside>
        </div>
      </div>
    </section>
  )
}
