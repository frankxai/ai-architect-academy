import type { Metadata } from 'next'
import Link from 'next/link'
import library from '@/data/solution-library.json'

export const metadata: Metadata = {
  title: 'The architecture library',
  description: 'A source-linked working book, architecture encyclopedia, and portable customer solution demonstration with explicit evidence states.',
  alternates: { canonical: '/library' },
}

export default function LibraryPage() {
  return <article className="pb-20 pt-16 sm:pt-24">
    <p className="eyebrow">Working reference / customer solution practice</p>
    <h1 className="mt-5 max-w-3xl text-[clamp(2.4rem,6vw,4.2rem)] leading-[1.04]">A design you can inspect.<br /><em>A result you can defend.</em></h1>
    <p className="measure mt-7 text-xl" style={{ color: 'var(--ink-2)' }}>Connect customer screens, system boundaries, provider alternatives and operating evidence through one versioned specification.</p>
    <section className="rule mt-12 grid gap-7 pt-8 md:grid-cols-[1fr_1.5fr]" aria-labelledby="portal-heading">
      <div><p className="eyebrow">Portable example</p><h2 id="portal-heading" className="mt-3 text-3xl">The customer solution desk.</h2><p className="mt-4 text-sm" style={{ color: 'var(--ink-3)' }}>{library.runtimeState}</p></div>
      <div><p style={{ color: 'var(--ink-2)' }}>Inspect the synthetic R&D portal, compare provider views, simulate review, and export SVG, Mermaid, diagrams.net or React Flow JSON. The example uses official Google legacy icons. It runs locally; the depicted AI workloads have no deployment or live-model evidence.</p>
        <div className="mt-6 flex flex-wrap gap-3"><a className="btn btn-primary" href="/solution-kit/index.html">Open the solution desk</a><a className="btn btn-quiet" href="/solution-kit/index.html" download="AI-Architect-Solution-Desk.html">Download offline HTML</a></div>
        <p className="mt-4 text-sm" style={{ color: 'var(--ink-3)' }}>Synthetic data only. No account or model key required. Review actions are local simulations.</p>
        <ul className="mt-7 space-y-2 text-sm">{library.profiles.map(p=><li key={p.id}><strong>{p.provider}</strong> / {p.title} <span style={{ color: 'var(--ink-3)' }}> / {p.maturity}</span></li>)}</ul>
      </div>
    </section>
    <section className="rule mt-12 grid gap-7 pt-8 md:grid-cols-[1fr_1.5fr]" aria-labelledby="practice-heading">
      <div><p className="eyebrow">Living product / bounded fixture</p><h2 id="practice-heading" className="mt-3 text-3xl">Inspect, correct, export, restore.</h2></div>
      <div><p style={{ color: 'var(--ink-2)' }}>Start with a synthetic research brief. Catch an expired reference, apply the correction, and restore an exact-source capsule. Explore {library.qualityGateCount} proposed quality gates and {library.metricCount} metric definitions, with actual observations explicitly unmeasured.</p><div className="mt-6 flex flex-wrap gap-3"><a className="btn btn-primary" href="/solution-kit/practice.html">Open the practice studio</a><a className="btn btn-quiet" href="/solution-kit/practice.html" download="AI-Architect-Living-Practice.html">Download practice HTML</a></div><p className="mt-4 text-sm" style={{ color: 'var(--ink-3)' }}>No customer project persistence, model execution, independent acceptance or learner grant is implied. Book and architecture companion links require the hosted surface or complete portable package.</p></div>
    </section>
    <section className="rule mt-12 pt-8" aria-labelledby="reference-heading"><p className="eyebrow">Method and reference</p><h2 id="reference-heading" className="mt-3 text-3xl">One source for each claim.</h2><p className="measure mt-4" style={{ color: 'var(--ink-2)' }}>The encyclopedia names decisions and proof obligations. The ecosystem register distinguishes public upstream sources, partnership candidates and invention hypotheses. Relationships and novelty remain unverified until supported.</p><div className="mt-6 flex flex-wrap gap-x-7 gap-y-3">{library.references.map(r=><a className="link" href={r.href} key={r.title}>{r.title}</a>)}</div></section>
    <section className="rule mt-12 pt-8" aria-labelledby="book-heading"><p className="eyebrow">AI Architect Guide / source-linked manuscript</p><h2 id="book-heading" className="mt-3 text-3xl">The book, still open to correction.</h2><p className="mt-4" style={{ color: 'var(--ink-2)' }}>{library.bookState}. Chapter lengths are derived from the source; every link resolves to the same immutable revision.</p><div className="mt-6 flex flex-wrap gap-3"><a className="btn btn-primary" href="/solution-kit/guide.html">Read the complete working book</a><a className="btn btn-quiet" href="/solution-kit/guide.html" download="AI-Architect-Guide-2026.0.6.html">Download book HTML</a><a className="link self-center" href="/solution-kit/guide.md" download>Download Markdown</a></div><ol className="mt-7 divide-y" style={{ borderColor: 'var(--rule)' }}>{library.book.map(c=><li className="flex flex-wrap items-baseline justify-between gap-3 py-3" key={c.href}><a className="link" href={c.href}>{c.title}</a><span className="mono text-sm" style={{ color: 'var(--ink-3)' }}>{c.words.toLocaleString('en-US')} words</span></li>)}</ol></section>
    <section className="rule mt-12 pt-8"><p className="measure text-sm" style={{ color: 'var(--ink-3)' }}>Generated from <a className="link" href={`${library.sourceRepository}/tree/${library.sourceRevision}`}>AI Architect source revision {library.sourceRevision.slice(0, 12)}</a>. {library.license}. This library is a reference surface. Competence is assessed through the existing artifact, evaluation and review path.</p><Link className="btn btn-quiet mt-6" href="/path">Work through the assessed path</Link></section>
  </article>
}
