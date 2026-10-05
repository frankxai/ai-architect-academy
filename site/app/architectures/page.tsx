import type { Metadata } from 'next'
import Link from 'next/link'
import { architectureProfiles } from '@/lib/academy-graph/experience'

export const metadata: Metadata = { title: 'Deployment architectures', description: 'Choose a deployment boundary for an AI system: a Vercel request, a Railway worker, a Cloudflare entity or a Google Cloud job.' }

export default function ArchitecturesPage() {
  return <article className="pb-20 pt-16 sm:pt-24">
    <p className="eyebrow">Architecture practice / deployment boundaries</p>
    <h1 className="mt-5 max-w-3xl text-[clamp(2.4rem,6vw,4.2rem)] leading-[1.04]">Choose the lifetime.<br /><em>Then choose the cloud.</em></h1>
    <p className="measure mt-7 text-xl" style={{ color: 'var(--ink-2)' }}>A request, a job, an entity and a batch run have different failure modes. Make that decision before combining frameworks or opening a production tenant.</p>
    <div className="mt-14 space-y-12">{architectureProfiles.map(p => <section key={p.id} className="rule pt-8" aria-labelledby={`architecture-${p.id}`}>
      <div className="grid gap-6 md:grid-cols-[1fr_1.5fr]"><div><p className="eyebrow">{p.cloud}</p><h2 id={`architecture-${p.id}`} className="mt-3 text-3xl">{p.title}</h2><p className="mt-4 text-sm" style={{ color: 'var(--ink-3)' }}>{p.state}</p></div><div><p style={{ color: 'var(--ink-2)' }}>{p.decision}</p><p className="cmd mt-5">{p.shape}</p><p className="mt-5" style={{ color: 'var(--ink-2)' }}>{p.boundary}</p><h3 className="mt-6 text-xl">Evidence before production</h3><p className="mt-2" style={{ color: 'var(--ink-2)' }}>{p.proof}</p><p className="mt-6 flex flex-wrap gap-5"><a className="link" href={p.source}>Open the source</a><a className="link" href={p.docs}>Read current platform docs</a></p></div></div>
    </section>)}</div>
    <section className="rule mt-14 pt-9" aria-labelledby="composition"><p className="eyebrow">Compose after proving the boundary</p><h2 id="composition" className="mt-3 text-3xl">A runtime is one part of the system.</h2><p className="measure mt-5" style={{ color: 'var(--ink-2)' }}>Hermes or OpenClaw can be the agent runtime. n8n can orchestrate admitted workflows. Langfuse can record model traces and evaluation results. Keep credentials, job state, customer data and release authority explicit; adding a tool does not make the starter durable or multi-tenant.</p><p className="measure mt-4" style={{ color: 'var(--ink-2)' }}>A customer-owned deployment needs a version pin, an operating owner, a tested recovery path and a support boundary. These are source templates and reference designs, with no claim of a verified customer deployment.</p><div className="mt-8 flex flex-wrap gap-3"><Link className="btn btn-primary" href="/path/deployment">Work the deployment stage</Link><Link className="btn btn-quiet" href="/start">Choose your entry</Link></div></section>
  </article>
}
