'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArchitectureCanvas, DATA_CLASS_COLORS, type Lens } from './ArchitectureCanvas'
import { CopyButton } from './CopyButton'
import { Glyph } from './Glyph'
import {
  ACTOR_LABEL,
  componentsForStep,
  exportHref,
  flowsForStep,
  weightedScore,
  type Criterion,
  type Layer,
  type Pattern,
  type Provider,
  type Role,
  type Template,
} from '@/lib/studio/catalog'

type Props = {
  pattern: Pattern
  providers: Provider[]
  criteria: Criterion[]
  layers: Layer[]
  roles: Role[]
  templates: Template[]
  icons: Record<string, { href: string }>
  scoringNote: string
}

const STEP_MS = 3600

export function Workbench({ pattern, providers, criteria, layers, roles, templates, icons, scoringNote }: Props) {
  const [providerId, setProviderId] = useState(providers[0].id)
  const [lens, setLens] = useState<Lens>('layers')
  const [step, setStep] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [weights, setWeights] = useState<Record<string, number>>(() => Object.fromEntries(criteria.map(c => [c.id, 1])))
  const announcer = useRef<HTMLParagraphElement>(null)
  const stepList = useRef<HTMLOListElement>(null)
  const playButton = useRef<HTMLButtonElement>(null)
  const inspectorHeading = useRef<HTMLHeadingElement>(null)
  const focusInspector = useRef(false)

  // Deep link: ?provider=<id> selects a realization; the page itself stays static.
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get('provider')
    if (wanted && providers.some(p => p.id === wanted)) setProviderId(wanted)
  }, [providers])

  const chooseProvider = useCallback((id: string) => {
    setProviderId(id)
    const url = new URL(window.location.href)
    url.searchParams.set('provider', id)
    window.history.replaceState(null, '', url)
  }, [])

  useEffect(() => {
    if (!playing || step === null) return
    if (step >= pattern.journey.length - 1) {
      setPlaying(false)
      if (announcer.current) announcer.current.textContent = `Journey complete: ${pattern.journey.length} steps.`
      return
    }
    const t = window.setTimeout(() => setStep(s => (s === null ? 0 : s + 1)), STEP_MS)
    return () => window.clearTimeout(t)
  }, [playing, step, pattern.journey.length])

  // Choosing a component from the table moves focus to the inspector, which may sit below the canvas.
  useEffect(() => {
    if (!focusInspector.current || !selected) return
    focusInspector.current = false
    inspectorHeading.current?.focus()
  }, [selected])

  // Keep the active step visible inside its own scroller without moving the page.
  useEffect(() => {
    const list = stepList.current
    const current = list?.querySelector<HTMLElement>('[aria-current="step"]')
    if (!list || !current) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    list.scrollTo({ left: current.parentElement!.offsetLeft - 8, behavior: reduce ? 'auto' : 'smooth' })
  }, [step])

  const provider = providers.find(p => p.id === providerId)!
  const realization = pattern.realizations[providerId]
  const template = realization.template ? templates.find(t => t.id === realization.template) ?? null : null
  const activeFlows = useMemo(() => (step === null ? null : flowsForStep(pattern, step)), [pattern, step])
  const activeNodes = useMemo(() => (step === null ? null : componentsForStep(pattern, step)), [pattern, step])
  const layerColor = Object.fromEntries(layers.map(l => [l.id, l.color]))
  const glyphs = Object.fromEntries(roles.map(r => [r.id, r.glyph]))
  const component = selected ? pattern.components.find(c => c.id === selected) ?? null : null
  const ranked = useMemo(
    () => providers.map(p => ({ p, score: weightedScore(pattern.realizations[p.id].scores, weights) })).sort((a, b) => b.score - a.score),
    [providers, pattern, weights],
  )
  const dataClasses = [...new Set(pattern.components.map(c => c.data_class))]

  const go = (next: number | null) => {
    setStep(next)
    if (next !== null && announcer.current) announcer.current.textContent = `Step ${next + 1} of ${pattern.journey.length}: ${pattern.journey[next].title}`
  }

  return (
    <div className="pb-4">
      <section className="studio-bleed studio-stage" aria-labelledby="stage-heading">
        <div className="studio-stage-inner">
          <div className="studio-toolbar">
            <div>
              <p className="eyebrow" style={{ color: '#8b90a0' }}>Realization</p>
              <h2 id="stage-heading" className="mt-1 text-2xl text-[#f2f1ec]">
                {realization.headline}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="studio-segment" role="group" aria-label="Diagram lens">
                {(['layers', 'data'] as const).map(l => (
                  <button key={l} type="button" aria-pressed={lens === l} onClick={() => setLens(l)}>
                    {l === 'layers' ? 'Layers' : 'Data classes'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="studio-providers" role="group" aria-label="Provider">
            {providers.map(p => (
              <button
                key={p.id}
                type="button"
                aria-pressed={p.id === providerId}
                onClick={() => chooseProvider(p.id)}
                style={{ '--accent': p.accent } as React.CSSProperties}
              >
                <span className="studio-dot" aria-hidden="true" />
                <span translate="no">{p.name}</span>
                <span className="studio-score">
                  {pattern.realizations[p.id].mean_score.toFixed(1)}
                  <span className="sr-only"> of 5</span>
                </span>
              </button>
            ))}
          </div>

          <div className="studio-grid">
            <div className="studio-canvas" role="region" aria-label={`${pattern.title} on ${provider.name}: interactive architecture diagram. The component table below lists the same information.`}>
              <ArchitectureCanvas
                pattern={pattern}
                realization={realization}
                layers={layers}
                roles={roles}
                icons={icons}
                lens={lens}
                activeFlows={activeFlows}
                activeNodes={activeNodes}
                selected={selected}
                onSelect={setSelected}
              />
            </div>

            <aside className="studio-inspector" aria-label="Inspector">
              {component ? (
                <div>
                  <div className="flex items-start gap-3">
                    <span className="studio-inspector-icon" style={{ borderColor: layerColor[component.layer] }}>
                      <Glyph d={glyphs[component.role]} color={layerColor[component.layer]} />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-[#8b90a0]">{roles.find(r => r.id === component.role)?.title}</p>
                      <h3 ref={inspectorHeading} tabIndex={-1} className="mt-1 text-xl text-[#f2f1ec]">{component.label}</h3>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[#b9bccb]">{component.detail}</p>
                  <dl className="studio-dl mt-4">
                    <dt>Service on {provider.name}</dt>
                    <dd>
                      {realization.bindings[component.id] ? (
                        <a className="studio-link" href={realization.bindings[component.id]!.docs} target="_blank" rel="noreferrer" translate="no">
                          {realization.bindings[component.id]!.name}
                        </a>
                      ) : (
                        'Outside the system'
                      )}
                    </dd>
                    {realization.bindings[component.id]?.note ? (<><dt>Note</dt><dd>{realization.bindings[component.id]!.note}</dd></>) : null}
                    <dt>Data class</dt>
                    <dd>{component.data_class}</dd>
                    {component.failure_mode ? (<><dt>Failure to design for</dt><dd>{component.failure_mode}</dd></>) : null}
                    {realization.bindings[component.id] ? (
                      <><dt>Name evidence</dt><dd>{realization.bindings[component.id]!.verification} · {realization.bindings[component.id]!.status}</dd></>
                    ) : null}
                  </dl>
                  <h4 className="mt-5 text-xs uppercase tracking-[0.14em] text-[#8b90a0]">Flows</h4>
                  <ul className="mt-2 space-y-1.5 text-sm text-[#b9bccb]">
                    {pattern.flows.filter(f => f.from === component.id || f.to === component.id).map(f => (
                      <li key={f.id}>
                        {f.from === component.id ? 'to' : 'from'}{' '}
                        <button type="button" className="studio-inline" onClick={() => setSelected(f.from === component.id ? f.to : f.from)}>
                          {pattern.components.find(c => c.id === (f.from === component.id ? f.to : f.from))?.label}
                        </button>
                        : {f.label} <span className="text-[#8b90a0]">({f.kind})</span>
                      </li>
                    ))}
                  </ul>
                  <button type="button" className="studio-quiet mt-5" onClick={() => { const id = selected; setSelected(null); requestAnimationFrame(() => document.querySelector<HTMLElement>(`.react-flow__node[data-id="${id}"]`)?.focus()) }}>Close inspector</button>
                </div>
              ) : (
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-[#8b90a0]">Legend</p>
                  <p className="mt-2 text-sm text-[#b9bccb]">Select a component to inspect its service, data class and failure mode. Play the journey to watch one request move.</p>
                  <ul className="mt-4 space-y-2 text-sm">
                    {lens === 'layers'
                      ? layers.filter(l => pattern.layers_used.includes(l.id)).map(l => (
                          <li key={l.id} className="flex items-center gap-2 text-[#d9dae2]"><span className="studio-swatch" style={{ background: l.color }} />{l.title}</li>
                        ))
                      : dataClasses.map(d => (
                          <li key={d} className="flex items-center gap-2 text-[#d9dae2]"><span className="studio-swatch" style={{ background: DATA_CLASS_COLORS[d] ?? '#9aa3b5' }} />{d}</li>
                        ))}
                  </ul>
                  <ul className="mt-5 space-y-2 text-sm text-[#b9bccb]">
                    <li className="flex items-center gap-2"><svg width="30" height="6" aria-hidden="true"><line x1="0" y1="3" x2="30" y2="3" stroke="#9aa3b5" strokeWidth="1.5" /></svg>Data</li>
                    <li className="flex items-center gap-2"><svg width="30" height="6" aria-hidden="true"><line x1="0" y1="3" x2="30" y2="3" stroke="#9aa3b5" strokeWidth="1.5" strokeDasharray="6 5" /></svg>Control</li>
                    <li className="flex items-center gap-2"><svg width="30" height="6" aria-hidden="true"><line x1="0" y1="3" x2="30" y2="3" stroke="#9aa3b5" strokeWidth="1.5" strokeDasharray="1 5" strokeLinecap="round" /></svg>Telemetry</li>
                  </ul>
                  {realization.caution.length ? (
                    <p className="mt-5 text-xs leading-relaxed text-[#ffc07a]">Confirm before customer use: {realization.caution.join(', ')} (beta or name inferred from a rename).</p>
                  ) : null}
                </div>
              )}
            </aside>
          </div>

          <div className="studio-journey" role="group" aria-label="Request journey">
            <div className="flex flex-wrap items-center gap-2">
              <button ref={playButton} type="button" className="studio-btn" onClick={() => { if (step === null) go(0); setPlaying(p => !p) }}>
                {playing ? 'Pause' : step === null ? 'Play the journey' : 'Resume'}
              </button>
              <button type="button" className="studio-btn-ghost" disabled={step === null || step === 0} onClick={() => { setPlaying(false); go(Math.max(0, (step ?? 0) - 1)) }}>Back</button>
              <button type="button" className="studio-btn-ghost" disabled={step !== null && step >= pattern.journey.length - 1} onClick={() => { setPlaying(false); go(step === null ? 0 : step + 1) }}>Next</button>
              {step !== null ? (
                <button type="button" className="studio-btn-ghost" onClick={() => { setPlaying(false); go(null); playButton.current?.focus() }}>Show everything</button>
              ) : null}
            </div>
            <ol ref={stepList} className="studio-steps">
              {pattern.journey.map((j, i) => (
                <li key={j.id}>
                  <button type="button" aria-current={step === i ? 'step' : undefined} onClick={() => { setPlaying(false); go(i) }}>
                    <span className="studio-step-n">{String(i + 1).padStart(2, '0')}</span>
                    <span>{j.title}</span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="studio-narration" aria-live="off">
              {step === null ? (
                <p>{pattern.summary}</p>
              ) : (
                <p>
                  <span className="studio-actor">{ACTOR_LABEL[pattern.journey[step].actor]}</span>
                  {pattern.journey[step].narration}
                </p>
              )}
            </div>
            <p ref={announcer} className="sr-only" aria-live="polite" />
          </div>
        </div>
      </section>

      <section className="rule mt-14 pt-8" aria-labelledby="services-heading">
        <div className="grid gap-8 md:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="eyebrow">{provider.name} / {provider.tier} provider</p>
            <h2 id="services-heading" className="mt-3 text-3xl">What carries each step.</h2>
            <p className="mt-4 text-sm" style={{ color: 'var(--ink-2)' }}>{realization.notes}</p>
            <p className="mt-4 text-sm" style={{ color: 'var(--ink-3)' }}>{provider.stance}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="studio-table">
              <thead><tr><th scope="col">Component</th><th scope="col">Service</th><th scope="col">Evidence</th></tr></thead>
              <tbody>
                {pattern.components.map(c => {
                  const b = realization.bindings[c.id]
                  return (
                    <tr key={c.id}>
                      <th scope="row"><button type="button" className="studio-row-btn" onClick={() => { focusInspector.current = true; setSelected(c.id) }}>{c.label}</button></th>
                      <td>{b ? <a className="link" href={b.docs} target="_blank" rel="noreferrer" translate="no">{b.name}</a> : <span style={{ color: 'var(--ink-3)' }}>{c.role === 'user' ? 'Person' : 'External system'}</span>}</td>
                      <td>{b ? <span className={realization.caution.includes(b.id) ? 'verdict v-open' : 'mono'} style={realization.caution.includes(b.id) ? undefined : { color: 'var(--ink-3)' }}>{realization.caution.includes(b.id) ? 'confirm' : `${b.verification}, ${b.status}`}</span> : null}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="rule mt-14 pt-8" aria-labelledby="compare-heading">
        <div className="grid gap-8 md:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="eyebrow">Customer view / judgement, not benchmark</p>
            <h2 id="compare-heading" className="mt-3 text-3xl">Weigh what this customer values.</h2>
            <p className="mt-4 text-sm" style={{ color: 'var(--ink-2)' }}>Remove providers that fail a hard constraint first: residency, data rights, identity estate, latency, operating owner, budget. Then weigh the rest. {scoringNote}</p>
            <div className="mt-6 space-y-4">
              {criteria.map(c => (
                <label key={c.id} className="block text-sm">
                  <span className="flex justify-between"><span>{c.title}</span><span className="mono" style={{ color: 'var(--ink-3)' }}>×{weights[c.id]}</span></span>
                  <input
                    type="range"
                    min={0}
                    max={3}
                    step={1}
                    value={weights[c.id]}
                    onChange={e => setWeights(w => ({ ...w, [c.id]: Number(e.target.value) }))}
                    className="studio-range mt-1 w-full"
                    aria-describedby={`q-${c.id}`}
                    aria-valuetext={weights[c.id] === 0 ? 'ignored' : `weight ${weights[c.id]}`}
                  />
                  <span id={`q-${c.id}`} className="block text-xs" style={{ color: 'var(--ink-3)' }}>{c.question}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="sr-only" aria-live="polite">Highest weighted: {ranked[0].p.name}, {ranked[0].score.toFixed(2)} of 5.</p>
            <ol className="space-y-3">
              {ranked.map(({ p, score }, i) => {
                const r = pattern.realizations[p.id]
                return (
                  <li key={p.id} className={`studio-rank ${p.id === providerId ? 'is-current' : ''}`}>
                    <button type="button" className="studio-rank-head" onClick={() => chooseProvider(p.id)} aria-label={`Show ${p.name} realization, weighted score ${score.toFixed(2)} of 5`}>
                      <span className="mono" style={{ color: 'var(--ink-3)' }}>{i + 1}</span>
                      <span className="studio-rank-name"><span className="studio-dot" style={{ background: p.accent === '#EDEDED' ? '#16171d' : p.accent }} aria-hidden="true" />{p.name}</span>
                      <span className="studio-bar" aria-hidden="true"><span style={{ width: `${(score / 5) * 100}%` }} /></span>
                      <span className="mono">{score.toFixed(2)}</span>
                    </button>
                    <p className="studio-rank-scores">
                      {criteria.map(c => (<span key={c.id}><span aria-hidden="true">{c.title.split(' ')[0]}</span><span className="sr-only">{c.title}</span> <b>{r.scores[c.id]}</b></span>))}
                    </p>
                    <p className="mt-2 text-sm" style={{ color: 'var(--ink-2)' }}>{r.rationale}</p>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </section>

      <section className="rule mt-14 pt-8" aria-labelledby="provider-ledger-heading">
        <div className="grid gap-8 md:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="eyebrow">Provider ledger / shown after the choice</p>
            <h2 id="provider-ledger-heading" className="mt-3 text-3xl">What grows on {provider.name}.</h2>
            <p className="mt-4 text-sm" style={{ color: 'var(--ink-2)' }}>These meters are the provider team’s consumption view. They explain the cloud workload; they never raise a customer score.</p>
          </div>
          <ul className="studio-meters">
            {realization.consumption_drivers.map(d => (<li key={d}>{d}</li>))}
          </ul>
        </div>
      </section>

      <section className="rule mt-14 pt-8" aria-labelledby="take-heading">
        <p className="eyebrow">Take it with you / generated from one specification</p>
        <h2 id="take-heading" className="mt-3 text-3xl">Exact views, and a running start.</h2>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-xl">{provider.name} views</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a className="link" href={exportHref(pattern.id, `${provider.id}.svg`)} download={`${pattern.id}-${provider.id}.svg`}>SVG diagram</a> <span style={{ color: 'var(--ink-3)' }}>for decks and documents</span></li>
              <li><a className="link" href={exportHref(pattern.id, `${provider.id}.drawio`)} download={`${pattern.id}-${provider.id}.drawio`}>diagrams.net file</a> <span style={{ color: 'var(--ink-3)' }}>editable, shared IDs</span></li>
              <li><a className="link" href={exportHref(pattern.id, `${provider.id}.reactflow.json`)} download={`${pattern.id}-${provider.id}.reactflow.json`}>React Flow JSON</a> <span style={{ color: 'var(--ink-3)' }}>for your own canvas</span></li>
              <li><a className="link" href={exportHref(pattern.id, `${provider.id}.mmd`)} download={`${pattern.id}-${provider.id}.mmd`}>Mermaid flowchart</a> <CopyButton href={exportHref(pattern.id, `${provider.id}.mmd`)} label="Copy Mermaid" /></li>
            </ul>
            <h3 className="mt-6 text-xl">Every provider</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a className="link" href={exportHref(pattern.id, 'workspace.dsl')} download={`${pattern.id}.dsl`}>Structurizr workspace</a> <span style={{ color: 'var(--ink-3)' }}>C4 containers, one deployment view per provider</span></li>
              <li><a className="link" href={exportHref(pattern.id, 'journey.sequence.mmd')} download={`${pattern.id}-journey.mmd`}>Journey sequence (Mermaid)</a> <CopyButton href={exportHref(pattern.id, 'journey.sequence.mmd')} label="Copy journey sequence" /></li>
            </ul>
          </div>
          <div className="studio-deploy">
            {template ? (
              <>
                <p className="eyebrow">One-click template / {template.contract}</p>
                <h3 className="mt-2 text-xl">{template.title}</h3>
                <p className="mt-3 text-sm" style={{ color: 'var(--ink-2)' }}>Model: {template.model}. Auth: {template.auth}.</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a className="btn btn-primary" href={template.deploy_url} target="_blank" rel="noreferrer">Deploy to {provider.name}</a>
                  <a className="btn btn-quiet" href={template.source_url} target="_blank" rel="noreferrer">Read the source</a>
                </div>
                <p className="mt-4 text-xs" style={{ color: 'var(--ink-3)' }}>Evidence: {template.evidence}. Not yet verified: {template.not_verified}. The button builds from the engine’s main branch.</p>
              </>
            ) : (
              <>
                <p className="eyebrow">One-click template</p>
                <h3 className="mt-2 text-xl">No {provider.name} template yet.</h3>
                <p className="mt-3 text-sm" style={{ color: 'var(--ink-2)' }}>The same answer contract runs on these runtimes today; its conformance suite is the porting checklist.</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {templates.map(t => (<li key={t.id}><a className="link" href={t.deploy_url} target="_blank" rel="noreferrer">{providers.find(p => p.id === t.provider)?.name}</a>: {t.model}</li>))}
                </ul>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
