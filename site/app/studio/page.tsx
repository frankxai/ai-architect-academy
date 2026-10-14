import type { Metadata } from 'next'
import Link from 'next/link'
import raw from '@/data/studio-catalog.json'
import { Glyph } from '@/components/studio/Glyph'
import { SOPHISTICATION, type StudioCatalog } from '@/lib/studio/catalog'

const catalog = raw as unknown as StudioCatalog

const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']
const spell = (n: number) => words[n] ?? String(n)
const capital = (s: string) => s[0].toUpperCase() + s.slice(1)
const providerList = new Intl.ListFormat('en', { type: 'conjunction' }).format(catalog.providers.map(p => p.name))

export const metadata: Metadata = {
  title: 'Studio: one workload, many clouds',
  description: `Workload patterns realized on ${providerList}, with interactive diagrams, customer and provider ledgers, exact exports and one-click templates.`,
  alternates: { canonical: '/studio' },
}

export default function StudioIndex() {
  const { patterns, providers, templates, counts, layers } = catalog
  const layerColor = Object.fromEntries(layers.map(l => [l.id, l.color]))
  const glyph = Object.fromEntries(catalog.roles.map(r => [r.id, r.glyph]))
  const templateFor = new Set(templates.map(t => t.provider))

  return (
    <article className="studio-page pb-20 pt-16 sm:pt-24">
      <p className="eyebrow">Studio / multi-cloud architecture catalog</p>
      <h1 className="mt-5 max-w-4xl text-[clamp(2.4rem,6vw,4.4rem)] leading-[1.04]">
        One workload. <em>{capital(spell(counts.providers))} clouds.</em> Every view from one source.
      </h1>
      <p className="measure mt-7 text-xl" style={{ color: 'var(--ink-2)' }}>
        Start from the customer’s job, not the vendor. Watch a request move through the design, compare providers on what this customer values, and take the exact diagrams or a running start into their account.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link className="btn btn-primary" href={`/studio/${patterns[0].id}`}>Open the first workbench</Link>
        <a className="btn btn-quiet" href="#templates">One-click templates</a>
      </div>

      <section className="studio-bleed studio-stage mt-16" aria-labelledby="matrix-heading">
        <div className="studio-stage-inner is-column">
          <div className="studio-toolbar">
            <div>
              <p className="eyebrow" style={{ color: '#8b90a0' }}>Coverage / judgement, not benchmark</p>
              <h2 id="matrix-heading" className="mt-1 text-2xl text-[#f2f1ec]">
                {capital(spell(counts.patterns))} patterns on {spell(counts.providers)} providers
              </h2>
            </div>
            <p className="max-w-md text-sm text-[#b9bccb]">Each cell is the plain mean of {spell(catalog.criteria.length)} recorded scores for that realization. Hard constraints come first; open a cell to weigh the criteria for a real customer.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="studio-matrix">
              <caption className="sr-only">Mean judgement score for each pattern on each provider, out of 5</caption>
              <thead>
                <tr>
                  <th scope="col">Pattern</th>
                  {providers.map(p => (
                    <th key={p.id} scope="col"><span className="studio-dot" style={{ '--accent': p.accent } as React.CSSProperties} aria-hidden="true" />{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {patterns.map(pat => (
                  <tr key={pat.id}>
                    <th scope="row">
                      <Link href={`/studio/${pat.id}`}>{pat.title}</Link>
                      <span>{pat.sophistication} · {SOPHISTICATION[pat.sophistication]}</span>
                    </th>
                    {providers.map(p => {
                      const r = pat.realizations[p.id]
                      return (
                        <td key={p.id}>
                          <Link
                            href={`/studio/${pat.id}?provider=${p.id}`}
                            className="studio-cell"
                            style={{ '--level': (r.mean_score - 1) / 4 } as React.CSSProperties}
                            aria-label={`${pat.title} on ${p.name}: ${r.mean_score.toFixed(1)} of 5${r.template ? ', one-click template' : ''}`}
                          >
                            <b>{r.mean_score.toFixed(1)}</b>
                            {r.template ? <i>template</i> : null}
                          </Link>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="rule mt-16 pt-8" aria-labelledby="patterns-heading">
        <p className="eyebrow">Workload patterns</p>
        <h2 id="patterns-heading" className="mt-3 text-3xl">Pick by the customer’s job.</h2>
        <ul className="mt-8 grid gap-5 md:grid-cols-2">
          {patterns.map(pat => (
            <li key={pat.id}>
              <Link href={`/studio/${pat.id}`} className="studio-card">
                <span className="flex items-center justify-between gap-3">
                  <span className="verdict v-open">{pat.sophistication} · {SOPHISTICATION[pat.sophistication]}</span>
                  <span className="flex gap-1.5" aria-hidden="true">
                    {pat.layers_used.map(l => (<span key={l} className="studio-swatch" style={{ background: layerColor[l] }} />))}
                  </span>
                </span>
                <span className="display mt-4 block text-2xl">{pat.title}</span>
                <span className="mt-2 block" style={{ color: 'var(--ink-2)' }}>{pat.tagline}</span>
                <span className="mt-4 block text-sm" style={{ color: 'var(--ink-3)' }}>Customer job: {pat.customer_job}</span>
                <span className="mt-5 flex flex-wrap gap-2" aria-hidden="true">
                  {pat.components.slice(0, 7).map(c => (
                    <span key={c.id} className="studio-mini"><Glyph d={glyph[c.role]} color="#3a3c46" size={14} />{c.label}</span>
                  ))}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="templates" className="rule mt-16 scroll-mt-8 pt-8" aria-labelledby="templates-heading">
        <p className="eyebrow">One contract, {spell(templates.length)} runtimes</p>
        <h2 id="templates-heading" className="mt-3 text-3xl">Deploy a running slice into your own account.</h2>
        <p className="measure mt-4" style={{ color: 'var(--ink-2)' }}>Each template answers only from retrieved passages, cites every sentence, and refuses when it cannot ground an answer. One conformance suite runs the same requests against all of them.</p>
        <ul className="mt-8 grid gap-5 md:grid-cols-3">
          {templates.map(t => {
            const p = providers.find(x => x.id === t.provider)!
            return (
              <li key={t.id} className="studio-template">
                <p className="eyebrow">{p.name}</p>
                <p className="mt-3 font-medium">{t.title}</p>
                <p className="mt-3 text-sm" style={{ color: 'var(--ink-3)' }}>{t.model}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <a className="btn btn-primary" href={t.deploy_url} target="_blank" rel="noreferrer">Deploy<span className="sr-only"> to {p.name}</span></a>
                  <a className="btn btn-quiet" href={t.source_url} target="_blank" rel="noreferrer">Source<span className="sr-only"> of the {p.name} template</span></a>
                </div>
                <p className="mt-4 text-xs" style={{ color: 'var(--ink-3)' }}>{t.evidence}. Not yet verified: {t.not_verified}.</p>
              </li>
            )
          })}
        </ul>
        <p className="mt-4 text-sm" style={{ color: 'var(--ink-3)' }}>{templateFor.size} of {counts.providers} providers have a template today. Buttons build from the engine’s main branch.</p>
      </section>

      <section className="rule mt-16 pt-8" aria-labelledby="rules-heading">
        <p className="eyebrow">How the Studio keeps itself honest</p>
        <h2 id="rules-heading" className="mt-3 text-3xl">Designs, not deployments.</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3 text-sm" style={{ color: 'var(--ink-2)' }}>
          <p><strong style={{ color: 'var(--ink)' }}>Two ledgers.</strong> The customer ledger counts accepted results and charges every attempt. The provider ledger shows which meters grow. The second never moves the first.</p>
          <p><strong style={{ color: 'var(--ink)' }}>Names with dates.</strong> {counts.services} services, each recording how its name was verified. {counts.sources} dated sources; the compiler stops when one passes its review date.</p>
          <p><strong style={{ color: 'var(--ink)' }}>Exact or conceptual.</strong> Diagrams are compiled from the specification. Generated images are offered only as concept art, with recipes that forbid labels and logos.</p>
        </div>
        <p className="mt-8 text-sm" style={{ color: 'var(--ink-3)' }}>
          Generated from <a className="link" href={`${catalog.projection.source_repository}/tree/${catalog.projection.source_revision}/catalog`}>AI Architect catalog revision {catalog.projection.source_revision.slice(0, 12)}</a>. {catalog.projection.license}. State: {catalog.state}.
        </p>
      </section>
    </article>
  )
}
