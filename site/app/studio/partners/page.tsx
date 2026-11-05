import type { Metadata } from 'next'
import Link from 'next/link'
import raw from '@/data/studio-catalog.json'
import { engineHref, formatDate, type Partner, type StudioCatalog } from '@/lib/studio/catalog'

const catalog = raw as unknown as StudioCatalog

const STATUS: Record<Partner['relationship']['status'], string> = { none: 'None', applied: 'Applied', member: 'Member', partner: 'Partner' }
const FORMAT: Record<string, string> = { reactflow: 'React Flow', mermaid: 'Mermaid', drawio: 'diagrams.net', structurizr: 'Structurizr DSL', svg: 'SVG' }
const score = new Intl.NumberFormat('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const VERIFICATION: Record<string, string> = { 'primary-doc': 'read at the source', 'search-index': 'checked in a search index', secondary: 'secondary coverage only', prior: 'not re-read this edition' }

export const metadata: Metadata = {
  title: 'Partners and programs: Studio',
  description: 'The cloud providers, model labs, standards and open-source tools the AI Architect catalog builds on: their programs, what each does in the catalog, and the evidence a partnership would need.',
  alternates: { canonical: '/studio/partners' },
}

export default function PartnersPage() {
  const { partners: register, providers, projection } = catalog
  const sourceById = new Map(catalog.sources.map(s => [s.id, s]))
  const accent = Object.fromEntries(providers.map(p => [p.id, p.accent]))
  const clouds = register.partners.filter(e => e.footprint)
  const maxServices = Math.max(1, ...clouds.map(e => e.footprint!.services))
  const withTemplate = clouds.filter(e => e.footprint!.templates.length).length
  const file = (p: string) => engineHref(projection.source_repository, projection.source_revision, p)

  return (
    <article className="studio-page pb-20 pt-12 sm:pt-16">
      <nav aria-label="Breadcrumb" className="text-sm" style={{ color: 'var(--ink-3)' }}>
        <Link className="link" href="/studio">Studio</Link> <span aria-hidden="true">/</span> Partners and programs
      </nav>
      <p className="eyebrow mt-8">Partner register</p>
      <h1 className="mt-4 max-w-4xl text-[clamp(2.3rem,5.6vw,4rem)] leading-[1.05]">
        The platforms behind the catalog, <em>and what a partnership would have to show.</em>
      </h1>
      <p className="measure mt-6 text-xl" style={{ color: 'var(--ink-2)' }}>
        Each organization the designs build on, the program it runs, what its technology does in these patterns and the next step. Use in the catalog is computed from the catalog itself.
      </p>
      <p className="studio-rule-note mt-8">{register.policy}</p>

      {clouds.length ? <section className="studio-bleed studio-stage mt-14" aria-labelledby="footprint-heading">
        <div className="studio-stage-inner is-column">
          <div className="studio-toolbar">
            <div>
              <p className="eyebrow" style={{ color: 'var(--stage-ink-3)' }}>Footprint / derived from the catalog</p>
              <h2 id="footprint-heading" className="mt-1 text-2xl">What each cloud carries in the designs</h2>
            </div>
            <p className="max-w-md text-sm" style={{ color: 'var(--stage-ink-2)' }}>Services bound across every pattern, the plain mean of the recorded judgement scores, and the names still to confirm. Judgement, not benchmark.</p>
          </div>
          <div className="overflow-x-auto studio-footprint-scroll">
            <table className="studio-footprint">
              <caption className="sr-only">Catalog footprint of each cloud provider</caption>
              <thead>
                <tr>
                  <th scope="col">Provider</th>
                  <th scope="col">Services bound</th>
                  <th scope="col">Mean judgement</th>
                  <th scope="col">Template</th>
                  <th scope="col">To confirm</th>
                </tr>
              </thead>
              <tbody>
                {clouds.map(e => {
                  const f = e.footprint!
                  return (
                    <tr key={e.id}>
                      <th scope="row">
                        <a href={`#${e.id}`} translate="no"><span className="studio-dot" style={{ '--accent': accent[e.provider!] } as React.CSSProperties} aria-hidden="true" />{e.name}</a>
                        <span>{f.realizations} realizations</span>
                      </th>
                      <td>
                        <span className="studio-meter"><span style={{ width: `${(f.services / maxServices) * 100}%`, background: accent[e.provider!] }} /></span>
                        <b>{f.services}</b>
                      </td>
                      <td>
                        <span className="studio-meter"><span style={{ width: `${(f.mean_score / 5) * 100}%` }} /></span>
                        <b>{score.format(f.mean_score)}</b><span className="sr-only"> of 5</span>
                      </td>
                      <td>{f.templates.length ? <Link className="studio-inline" href="/studio#templates">{f.templates.join(', ')}</Link> : <span style={{ color: 'var(--stage-ink-3)' }}>None yet</span>}</td>
                      <td><b>{f.to_confirm}</b></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-pretty" style={{ color: 'var(--stage-ink-3)' }}>{withTemplate} of {clouds.length} providers ship a one-click template. A name to confirm is a service whose name was inferred from a rename or whose launch stage is not GA.</p>
        </div>
      </section> : null}

      {register.kinds.map(kind => {
        const rows = register.partners.filter(e => e.kind === kind.id)
        if (!rows.length) return null
        return (
          <section key={kind.id} className="rule mt-16 pt-8" aria-labelledby={`kind-${kind.id}`}>
            <h2 id={`kind-${kind.id}`} className="text-3xl">{kind.title}</h2>
            <ul className="mt-8 grid gap-5 lg:grid-cols-2">
              {rows.map(e => {
                const program = e.program
                const programSource = program ? sourceById.get(program.source) : undefined
                const exports = Object.entries(e.exports)
                return (
                  <li key={e.id} id={e.id} className="studio-partner">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h3 className="display text-2xl" translate="no">{e.name}</h3>
                      <span className="verdict studio-status">{e.relationship.status === 'none' ? 'No relationship' : `${STATUS[e.relationship.status]}: ${e.relationship.reference}`}</span>
                    </div>
                    <p className="mt-3" style={{ color: 'var(--ink-2)' }}>{e.contributes}</p>
                    <dl className="studio-facts mt-5">
                      <div>
                        <dt>Program</dt>
                        <dd>
                          {program && programSource ? (
                            <>
                              <a className="link" href={programSource.url} target="_blank" rel="noreferrer" translate="no">{program.name}</a>. {program.track}.
                              {program.verified ? null : <span className="studio-flag">Official page not found; unverified</span>}
                            </>
                          ) : 'No partner program'}
                        </dd>
                      </div>
                      <div>
                        <dt>In this catalog</dt>
                        <dd>
                          {e.footprint ? <>{e.footprint.realizations} realizations binding {e.footprint.services} services, mean judgement {score.format(e.footprint.mean_score)}{'\u00a0'}of{'\u00a0'}5.{' '}</> : null}
                          {exports.length ? <>{exports.map(([fmt, n], i) => <span key={fmt}>{i ? '; ' : ''}{n} <span translate="no">{FORMAT[fmt] ?? fmt}</span> exports</span>)}.</> : null}
                          {e.used_in.length ? (
                            <span className="studio-paths">
                              {e.used_in.map(p => <a key={p} className="link" href={file(p)} target="_blank" rel="noreferrer"><code translate="no">{p}</code></a>)}
                            </span>
                          ) : null}
                          {!e.footprint && !exports.length && !e.used_in.length ? 'Not used by any pattern yet.' : null}
                        </dd>
                      </div>
                      <div><dt>Fit</dt><dd>{e.fit}</dd></div>
                      <div><dt>Next step</dt><dd>{e.next_step}</dd></div>
                    </dl>
                    <details className="studio-sources mt-5">
                      <summary>Sources and review dates</summary>
                      <ul>
                        {e.sources.map(id => {
                          const s = sourceById.get(id)
                          if (!s) return null
                          return (
                            <li key={id}>
                              <a className="link" href={s.url} target="_blank" rel="noreferrer">{s.title}</a>
                              <span>{s.publisher}, {VERIFICATION[s.verification] ?? s.verification}. Checked {formatDate(s.checked_on)}; review by {formatDate(s.review_by)}.</span>
                            </li>
                          )
                        })}
                      </ul>
                    </details>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}

      <section className="rule mt-16 pt-8 text-sm" style={{ color: 'var(--ink-3)' }} aria-label="Provenance">
        <p>
          Generated from <a className="link" href={file('catalog/partners.json')}>catalog/partners.json</a> at engine revision {projection.source_revision.slice(0, 12)}. Program pages change often: every source carries a review date, and the engine refuses to compile once one passes. Provider names are trademarks of their owners.
        </p>
        <p className="mt-3"><Link className="link" href="/studio/inventions">The inventions the patterns stand on</Link> <span aria-hidden="true">·</span> <Link className="link" href="/studio">Back to the Studio</Link></p>
      </section>
    </article>
  )
}
