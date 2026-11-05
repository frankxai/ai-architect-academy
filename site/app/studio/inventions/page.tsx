import type { Metadata } from 'next'
import Link from 'next/link'
import raw from '@/data/studio-catalog.json'
import { Glyph } from '@/components/studio/Glyph'
import { engineHref, formatDate, type ContributionStatus, type StudioCatalog } from '@/lib/studio/catalog'

const catalog = raw as unknown as StudioCatalog

const STATUS_CLASS: Record<ContributionStatus, string> = { implemented: 'v-pass', partial: 'v-open', proposed: 'studio-status' }

export const metadata: Metadata = {
  title: 'Inventions: Studio',
  description: 'The published inventions the AI Architect patterns stand on, each tied to its primary record and the roles it shaped, and the contributions this catalog proposes with the experiment that could prove each one wrong.',
  alternates: { canonical: '/studio/inventions' },
}

export default function InventionsPage() {
  const { inventions: register, roles, layers, patterns, projection } = catalog
  const role = new Map(roles.map(r => [r.id, r]))
  const layerColor = Object.fromEntries(layers.map(l => [l.id, l.color]))
  const colorOf = (roleId: string) => layerColor[role.get(roleId)?.layer ?? ''] ?? 'var(--stage-ink-3)'
  const layerTitle = Object.fromEntries(layers.map(l => [l.id, l.title]))
  const layerOf = (roleId: string) => layerTitle[role.get(roleId)?.layer ?? ''] ?? ''
  const kind = Object.fromEntries(register.kinds.map(k => [k.id, k.title]))
  const patternTitle = Object.fromEntries(patterns.map(p => [p.id, p.title]))
  const years = [...new Set(register.field.map(f => f.date.slice(0, 4)))]
  const usedLayers = layers.filter(l => register.field.some(f => role.get(f.roles[0])?.layer === l.id))
  const statusCount = (s: ContributionStatus) => register.ours.filter(c => c.status === s).length
  const statusTitle = Object.fromEntries(register.statuses.map(s => [s.id, s.title]))
  const file = (p: string) => engineHref(projection.source_repository, projection.source_revision, p)

  return (
    <article className="studio-page pb-20 pt-12 sm:pt-16">
      <nav aria-label="Breadcrumb" className="text-sm" style={{ color: 'var(--ink-3)' }}>
        <Link className="link" href="/studio">Studio</Link> <span aria-hidden="true">/</span> Inventions
      </nav>
      <p className="eyebrow mt-8">Invention register</p>
      <h1 className="mt-4 max-w-4xl text-[clamp(2.3rem,5.6vw,4rem)] leading-[1.05]">
        The work the patterns stand on, <em>and what this catalog adds.</em>
      </h1>
      <p className="measure mt-6 text-xl" style={{ color: 'var(--ink-2)' }}>
        Published inventions that changed how AI systems are built, each tied to its primary record and to the roles it shaped in the catalog. Then the contributions this catalog proposes, each with the files that implement it and an experiment that could prove it wrong.
      </p>

      <section className="studio-bleed studio-stage mt-14" aria-labelledby="timeline-heading">
        <div className="studio-stage-inner is-column">
          <div className="studio-toolbar">
            <div>
              <p className="eyebrow" style={{ color: 'var(--stage-ink-3)' }}>Timeline / date of the primary record</p>
              <h2 id="timeline-heading" className="mt-1 text-2xl">Timeline{years.length ? `, ${years[0]} to ${years[years.length - 1]}` : ''}</h2>
            </div>
            <ul className="studio-legend" aria-hidden="true">
              {usedLayers.map(l => <li key={l.id}><span className="studio-swatch" style={{ background: l.color }} aria-hidden="true" />{l.title}</li>)}
            </ul>
          </div>
          <ol className="studio-years">
            {years.map(y => (
              <li key={y}>
                <span className="studio-year">{y}</span>
                <ul>
                  {register.field.filter(f => f.date.startsWith(y)).map(f => (
                    <li key={f.id}>
                      <a className="studio-tick" href={`#${f.id}`} style={{ '--node-color': colorOf(f.roles[0]) } as React.CSSProperties}>
                        <span className="studio-tick-dot" aria-hidden="true" />{f.name}<span className="sr-only">, {layerOf(f.roles[0])}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-sm text-pretty" style={{ color: 'var(--stage-ink-3)' }}>The date is that of the record cited, an arXiv first version or a dated announcement. It is not a claim about who was first.</p>
        </div>
      </section>

      <section className="mt-16" aria-labelledby="field-heading">
        <p className="eyebrow">Field inventions</p>
        <h2 id="field-heading" className="mt-3 text-3xl">What each one changed for an architect</h2>
        <p className="measure mt-4 text-sm" style={{ color: 'var(--ink-3)' }}>Records checked {formatDate(register.checked_on)}. Patterns are listed where one of their components plays a role the invention shaped.</p>
        <ol className="mt-8">
          {register.field.map(f => (
            <li key={f.id} id={f.id} className="studio-invention">
              <div className="studio-invention-date">
                <time dateTime={f.date}>{formatDate(f.date)}</time>
                <span>{kind[f.kind]}</span>
                <span className="studio-invention-layer"><span className="studio-swatch" style={{ background: colorOf(f.roles[0]) }} aria-hidden="true" />{layerOf(f.roles[0])}</span>
              </div>
              <div className="min-w-0">
                <h3 className="display text-2xl">{f.name}</h3>
                <p className="mt-1 text-sm" style={{ color: 'var(--ink-3)' }}>
                  {f.origin} <span aria-hidden="true">·</span> <a className="link" href={f.record.url} target="_blank" rel="noreferrer" title={f.record.title}><span translate="no">{f.record.label}</span></a>
                </p>
                <p className="mt-3 max-w-3xl" style={{ color: 'var(--ink-2)' }}>{f.consequence}</p>
                <ul className="mt-4 flex flex-wrap items-center gap-2" aria-label="Roles it shaped">
                  {f.roles.map(r => (
                    <li key={r} className="studio-mini"><Glyph d={role.get(r)?.glyph ?? ''} color="var(--ink-2)" size={14} />{role.get(r)?.title ?? r}</li>
                  ))}
                </ul>
                <p className="mt-3 text-sm" style={{ color: 'var(--ink-3)' }}>
                  {f.patterns.length === patterns.length ? 'Every pattern' : f.patterns.length ? (
                    <>In {f.patterns.map((id, i) => <span key={id}>{i ? ', ' : ''}<Link className="link whitespace-nowrap" href={`/studio/${id}`}>{patternTitle[id]}</Link></span>)}</>
                  ) : 'No pattern uses these roles yet'}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="contributions" className="rule mt-16 scroll-mt-8 pt-8" aria-labelledby="ours-heading">
        <p className="eyebrow">Proposed contributions</p>
        <h2 id="ours-heading" className="mt-3 text-3xl">What this catalog adds, stated as hypotheses</h2>
        <p className="measure mt-4" style={{ color: 'var(--ink-2)' }}>
          {statusCount('implemented')} implemented, {statusCount('partial')} partial, {statusCount('proposed')} proposed. Novelty is unassessed for every one of them: none is a patent, first-of-its-kind or proven-return claim, and each names the prior work to check first.
        </p>
        <ul className="mt-8 grid gap-5 lg:grid-cols-2">
          {register.ours.map(c => (
            <li key={c.id} id={c.id} className="studio-partner">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="studio-code" translate="no">{c.id.toUpperCase()}</span>
                <span className={`verdict ${STATUS_CLASS[c.status]}`}>{statusTitle[c.status]}</span>
              </div>
              <h3 className="display mt-3 text-2xl">{c.name}</h3>
              <p className="mt-3" style={{ color: 'var(--ink-2)' }}>{c.mechanism}</p>
              <dl className="studio-facts mt-5">
                <div>
                  <dt>Implemented in</dt>
                  <dd>
                    {c.implemented_in.length ? (
                      <span className="studio-paths">
                        {c.implemented_in.map(p => <a key={p} className="link" href={file(p)} target="_blank" rel="noreferrer"><code translate="no">{p}</code></a>)}
                      </span>
                    ) : 'Nothing runs yet.'}
                  </dd>
                </div>
                <div><dt>Evidence</dt><dd>{c.evidence}</dd></div>
                <div><dt>Experiment that could falsify it</dt><dd>{c.experiment}</dd></div>
                <div><dt>Prior work to check</dt><dd>{c.prior_work}</dd></div>
              </dl>
            </li>
          ))}
        </ul>
      </section>

      <section className="rule mt-16 pt-8 text-sm" style={{ color: 'var(--ink-3)' }} aria-label="Provenance">
        <p>
          Generated from <a className="link" href={file('catalog/inventions.json')}>catalog/inventions.json</a> at engine revision {projection.source_revision.slice(0, 12)}. The engine checks that every arXiv identifier matches the month it is dated, that every role exists in the catalog and that every file named above exists.
        </p>
        <p className="mt-3"><Link className="link" href="/studio/partners">Partners and programs</Link> <span aria-hidden="true">·</span> <Link className="link" href="/studio">Back to the Studio</Link></p>
      </section>
    </article>
  )
}
