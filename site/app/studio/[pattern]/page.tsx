import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import raw from '@/data/studio-catalog.json'
import { Workbench } from '@/components/studio/Workbench'
import { CustomerLedger } from '@/components/studio/CustomerLedger'
import { ScreenMockup } from '@/components/studio/ScreenMockup'
import { CopyButton } from '@/components/studio/CopyButton'
import { LANE_LABEL, SOPHISTICATION, type StudioCatalog } from '@/lib/studio/catalog'

const catalog = raw as unknown as StudioCatalog

export const dynamicParams = false

export function generateStaticParams() {
  return catalog.patterns.map(p => ({ pattern: p.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ pattern: string }> }): Promise<Metadata> {
  const { pattern } = await params
  const p = catalog.patterns.find(x => x.id === pattern)
  if (!p) return {}
  return {
    title: `${p.title}: Studio`,
    description: `${p.tagline} ${p.summary}`.slice(0, 300),
    alternates: { canonical: `/studio/${p.id}` },
  }
}

export default async function PatternPage({ params }: { params: Promise<{ pattern: string }> }) {
  const { pattern: id } = await params
  const pattern = catalog.patterns.find(p => p.id === id)
  if (!pattern) notFound()
  const index = catalog.patterns.indexOf(pattern)
  const next = catalog.patterns[(index + 1) % catalog.patterns.length]
  const icons = Object.fromEntries(Object.entries(catalog.projection.icons).map(([k, v]) => [k, { href: v.href }]))

  return (
    <article className="studio-page pb-20 pt-12 sm:pt-16">
      <nav aria-label="Breadcrumb" className="text-sm" style={{ color: 'var(--ink-3)' }}>
        <Link className="link" href="/studio">Studio</Link> <span aria-hidden="true">/</span> {pattern.title}
      </nav>
      <p className="eyebrow mt-8">{pattern.sophistication} · {SOPHISTICATION[pattern.sophistication]} · {pattern.industries.join(', ').replaceAll('-', ' ')}</p>
      <h1 className="mt-4 max-w-4xl text-[clamp(2.3rem,5.6vw,4rem)] leading-[1.05]">{pattern.title}</h1>
      <p className="measure mt-5 text-xl" style={{ color: 'var(--ink-2)' }}><em className="display">{pattern.tagline}</em></p>

      <dl className="studio-brief mt-10">
        <div><dt>Customer job</dt><dd>{pattern.customer_job}</dd></div>
        <div><dt>Today</dt><dd>{pattern.baseline}</dd></div>
        <div><dt>Accepted result</dt><dd>{pattern.accepted_result}</dd></div>
      </dl>

      <div className="mt-12">
        <Workbench
          pattern={pattern}
          providers={catalog.providers}
          criteria={catalog.criteria}
          layers={catalog.layers}
          roles={catalog.roles}
          templates={catalog.templates}
          icons={icons}
          scoringNote={catalog.scoring_note}
        />
      </div>

      <section className="rule mt-14 pt-8" aria-labelledby="ledger-heading">
        <CustomerLedger economics={pattern.economics} metric={pattern.primary_metric} />
      </section>

      <section className="rule mt-14 pt-8" aria-labelledby="screens-heading">
        <p className="eyebrow">Experience / drawn from the specification</p>
        <h2 id="screens-heading" className="mt-3 text-3xl">What the person sees, including no.</h2>
        <p className="measure mt-4 text-sm" style={{ color: 'var(--ink-2)' }}>Screens are rendered from structured blocks in the catalog, so a refusal or an exception is designed before it happens. Values marked fixture are illustrations, not measurements.</p>
        <div className="studio-screens mt-8">
          {pattern.screens.map(s => <ScreenMockup key={s.id} screen={s} />)}
        </div>
      </section>

      <section className="rule mt-14 pt-8" aria-labelledby="team-heading">
        <p className="eyebrow">Team workflow / who carries what</p>
        <h2 id="team-heading" className="mt-3 text-3xl">Every lane leaves evidence.</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="studio-table">
            <thead><tr><th scope="col">Lane</th><th scope="col">Responsibility</th><th scope="col">Evidence it leaves</th></tr></thead>
            <tbody>
              {pattern.team.map(t => (
                <tr key={t.lane}><th scope="row">{LANE_LABEL[t.lane] ?? t.lane}</th><td>{t.step}</td><td style={{ color: 'var(--ink-3)' }}>{t.evidence}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rule mt-14 pt-8" aria-labelledby="evals-heading">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="eyebrow">Release evaluations</p>
            <h2 id="evals-heading" className="mt-3 text-3xl">What must pass before anyone ships.</h2>
            <ul className="mt-6 divide-y" style={{ borderColor: 'var(--rule)' }}>
              {pattern.evals.map(e => (
                <li key={e.id} className="py-4">
                  <p className="font-medium">{e.name}</p>
                  <p className="mt-1 text-sm">{e.threshold}</p>
                  <p className="mt-1 text-sm" style={{ color: 'var(--ink-3)' }}>{e.method}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">Risks and controls</p>
            <h2 className="mt-3 text-3xl">What would go wrong first.</h2>
            <ul className="mt-6 divide-y" style={{ borderColor: 'var(--rule)' }}>
              {pattern.risks.map(r => (
                <li key={r.id} className="py-4">
                  <p className="font-medium">{r.risk}</p>
                  <p className="mt-1 text-sm" style={{ color: 'var(--ink-2)' }}>{r.control}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="rule mt-14 pt-8" aria-labelledby="images-heading">
        <p className="eyebrow">Image recipes / concept art only</p>
        <h2 id="images-heading" className="mt-3 text-3xl">When to generate, and when never to.</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {pattern.image_recipes.map(r => (
            <div key={r.id} className={`studio-recipe ${r.kind === 'compiled' ? 'is-compiled' : ''}`}>
              <p className="eyebrow">{r.kind === 'compiled' ? 'Do not generate' : `${r.aspect} · ${r.model_hint}`}</p>
              <p className="mt-2 font-medium">{r.purpose}</p>
              <p className="mt-3 text-sm" style={{ color: 'var(--ink-2)' }}>{r.prompt}</p>
              {r.kind === 'generated' ? <div className="mt-4"><CopyButton text={r.prompt} label="Copy prompt" context={r.purpose} /></div> : null}
            </div>
          ))}
        </div>
      </section>

      <section className="rule mt-14 pt-8">
        <p className="measure text-sm" style={{ color: 'var(--ink-3)' }}>
          A design, not a deployment: no realization on this page carries a provider receipt. Generated from <a className="link" href={`${catalog.projection.source_repository}/blob/${catalog.projection.source_revision}/catalog/patterns/${pattern.id}.json`}>the pattern source at revision {catalog.projection.source_revision.slice(0, 12)}</a>. {catalog.projection.license}.
        </p>
        <Link className="btn btn-quiet mt-6" href={`/studio/${next.id}`}>Next pattern: {next.title}</Link>
      </section>
    </article>
  )
}
