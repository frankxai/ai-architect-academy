import type { Metadata } from 'next'
import Link from 'next/link'
import data from '@/data/worked-run.json'

type Run = (typeof data.runs)[number]

const DECISIONS: Record<string, string> = {
  model: 'Model call seam',
  loop: 'Orchestration shape',
  trust: 'Trust boundary',
  run: 'Long-run home',
}

function featuredRun(): Run {
  const run = data.runs.find((r) => r.id === data.featured)
  if (!run) throw new Error(`worked-run.json has no featured run ${data.featured}`)
  return run
}

const featured = featuredRun()
const others = data.runs.filter((r) => r.id !== data.featured)
const failed = (r: Run) => r.gates.filter((g) => g.status === 'FAIL')
const passed = (r: Run) => r.gates.filter((g) => g.status === 'PASS')
const open = featured.decisions.filter((d) => d.verdict === 'OPEN')

export const metadata: Metadata = {
  title: 'A worked example, red gates included',
  description: `A fixture shipped with the AI Architect plugin, taken through every stage: a ${featured.name} system, its decisions, all ${featured.gates.length} gates including the ${failed(featured).length} that failed, the finding, and the example's verification receipt.`,
}

function Verdict({ value }: { value: string }) {
  const tone = value === 'PASS' || value === 'MADE' ? 'v-pass' : value === 'FAIL' ? 'v-fail' : 'v-open'
  return <span className={`verdict ${tone}`}>{value}</span>
}

export default function WorkedRun() {
  return (
    <>
      <section className="pb-14 pt-16 sm:pt-24" aria-labelledby="hero">
        <p className="eyebrow">The second free gift · a plugin fixture</p>
        <h1 id="hero" className="mt-5 max-w-4xl text-[clamp(2.1rem,5.5vw,3.8rem)] leading-[1.04]">
          What the team leaves in a repository, <em>red gates included.</em>
        </h1>
        <p className="measure mt-7 text-xl leading-relaxed" style={{ color: 'var(--ink-2)' }}>
          A complete worked example shipped with the AI Architect plugin: a {featured.name} system, taken through
          every stage. {passed(featured).length} of {featured.gates.length} gates pass. {failed(featured).length} fail,
          for one reason, and the example says so in its own files.
        </p>
        <p className="measure fixture mt-8 text-sm">
          <strong>Fixture.</strong> {featured.fixtureNote}
        </p>
      </section>

      <section className="rule py-14" aria-labelledby="frame">
        <div className="grid gap-10 md:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="eyebrow">frame · 00-frame.md</p>
            <h2 id="frame" className="mt-3 text-3xl leading-tight">
              The outcome, and the observation that turns it off.
            </h2>
          </div>
          <div className="measure space-y-5" style={{ color: 'var(--ink-2)' }}>
            <p className="text-lg" style={{ color: 'var(--ink)' }}>
              {featured.outcome}
            </p>
            <blockquote className="kill">
              <p className="eyebrow">Kill criterion</p>
              <p className="mt-2">{featured.killCriterion}</p>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="rule py-14" aria-labelledby="decisions">
        <p className="eyebrow">decide · SYSTEM.md</p>
        <h2 id="decisions" className="mt-3 max-w-3xl text-3xl leading-tight">
          The decisions that are expensive to undo.
        </h2>
        {open.length > 0 && (
          <p className="measure mt-4" style={{ color: 'var(--ink-2)' }}>
            Still open: {open.map((d) => DECISIONS[d.id] ?? d.id).join(', ')}. An open decision is allowed, as long as it
            carries a dated cost of waiting.
          </p>
        )}
        <div className="decisions mt-8">
          {featured.decisions.map((d) => (
            <div key={d.id} className="decision">
              <p className="decision-name">{DECISIONS[d.id] ?? d.id}</p>
              <Verdict value={d.verdict} />
              <p className="mono decision-evidence">{d.evidence}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rule py-14" aria-labelledby="gates">
        <p className="eyebrow">verify · architecture.json</p>
        <h2 id="gates" className="mt-3 max-w-3xl text-3xl leading-tight">
          Every stage has a gate. The failures are written down, not smoothed over.
        </h2>
        <ol className="gates mt-8" aria-label="Gate statuses in lifecycle order">
          {featured.gates.map((g) => (
            <li key={g.id} className={g.status === 'FAIL' ? 'gate-red' : ''}>
              <span className="gate-name">{g.id}</span>
              <Verdict value={g.status} />
              <span className="gate-note">{g.note}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="rule py-14" aria-labelledby="finding">
        <div className="grid gap-10 md:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="eyebrow">review.md</p>
            <h2 id="finding" className="mt-3 text-3xl leading-tight">
              Find it before you read it.
            </h2>
          </div>
          <div className="measure space-y-4" style={{ color: 'var(--ink-2)' }}>
            <p className="text-lg" style={{ color: 'var(--ink)' }}>
              The trust gate failed. Using only the decisions above, which file and which line let text a counterparty
              wrote reach the model as an instruction?
            </p>
            <details className="reveal">
              <summary>Show the finding and its fix</summary>
              <p className="mt-4" style={{ color: 'var(--ink)', fontWeight: 600 }}>
                {featured.finding.title}
              </p>
              <ol className="fix mt-3">
                {featured.finding.fix.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </details>
          </div>
        </div>
      </section>

      <section className="rule py-14" aria-labelledby="receipt">
        <div className="grid gap-10 md:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="eyebrow">receipts/{featured.receipt.file}</p>
            <h2 id="receipt" className="mt-3 text-3xl leading-tight">
              The verifier re-derives; it does not repair.
            </h2>
          </div>
          <div className="measure space-y-4" style={{ color: 'var(--ink-2)' }}>
            <p>
              The example’s receipt records {featured.receipt.pointers} evidence pointers re-derived by the verifier
              role: {featured.receipt.confirmed} confirmed, {featured.receipt.failed} failed. In a real run that role
              works in a fresh context and never sees the other agents’ reasoning; here the receipt is part of the
              fixture, like everything else on this page. Every pointer can hold while a gate is red: pointers prove a
              finding, a gate judges it.
            </p>
            <p>
              What was measured here: the plugin’s own contract check on this artifact set, {featured.contract.pass} of{' '}
              {featured.contract.checks} checks pass, run {data.measuredAt} against plugin v{data.pluginVersion}. It
              checks shape, not judgement.
            </p>
            <p>
              <a className="link" href={featured.source}>
                Read every file in this example
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="rule py-14" aria-labelledby="more">
        <p className="eyebrow">More fixtures from the plugin</p>
        <h2 id="more" className="mt-3 max-w-3xl text-3xl leading-tight">
          Different systems, different gates go red.
        </h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {others.map((r) => (
            <article key={r.id} className="run">
              <p className="eyebrow">{r.name} · fixture</p>
              <p className="mt-2" style={{ color: 'var(--ink-2)' }}>
                {r.goal}
              </p>
              <p className="mt-4 text-sm">
                Failed: {failed(r).map((g) => g.id).join(', ') || 'none'} · receipt pointers {r.receipt.confirmed}/
                {r.receipt.pointers} confirmed
              </p>
              <p className="mt-3">
                <a className="link" href={r.source}>
                  Read the example
                </a>
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rule py-14" aria-labelledby="next">
        <h2 id="next" className="max-w-3xl text-3xl leading-tight">
          Run the team on your own system, then learn to read what it hands back.
        </h2>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/#waitlist" className="btn btn-primary">
            Join the cohort waitlist
          </Link>
          <Link href="/#team" className="btn btn-quiet">
            Install the team
          </Link>
        </div>
        <p className="mt-8 text-sm" style={{ color: 'var(--ink-3)' }}>
          Excerpts generated from{' '}
          <a className="link" href="https://github.com/frankxai/ai-architect">
            frankxai/ai-architect
          </a>{' '}
          v{data.pluginVersion} examples by <code className="mono">scripts/sync-worked-run.mjs</code> on{' '}
          {data.measuredAt}, {data.licence}.
        </p>
      </section>
    </>
  )
}
