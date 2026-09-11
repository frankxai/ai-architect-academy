import type { Metadata } from 'next'
import Link from 'next/link'
import data from '@/data/worked-run.json'

export const metadata: Metadata = {
  title: 'A worked run, red gates included',
  description:
    'One complete run of the AI Architect agent team on a contract question-answering system: the frame, the four decisions, nine gates with the two that failed, the finding, and the verifier’s receipt.',
}

const DECISIONS: Record<string, string> = {
  model: 'Model call seam',
  loop: 'Orchestration shape',
  trust: 'Trust boundary',
  run: 'Long-run home',
}

const [featured, ...others] = data.runs
const red = featured.gates.filter((g) => g.status !== 'PASS')
const green = featured.gates.length - red.length

function Verdict({ value }: { value: string }) {
  const tone = value === 'PASS' || value === 'MADE' ? 'v-pass' : value === 'FAIL' ? 'v-fail' : 'v-open'
  return <span className={`verdict ${tone}`}>{value}</span>
}

export default function WorkedRun() {
  return (
    <>
      <section className="pb-14 pt-16 sm:pt-24" aria-labelledby="hero">
        <p className="eyebrow">The second free gift</p>
        <h1 id="hero" className="mt-5 max-w-4xl text-[clamp(2.1rem,5.5vw,3.8rem)] leading-[1.04]">
          What the team leaves in a repository, <em>red gates included.</em>
        </h1>
        <p className="measure mt-7 text-xl leading-relaxed" style={{ color: 'var(--ink-2)' }}>
          One complete run of the AI Architect team on a {featured.name} system. {green} of {featured.gates.length}{' '}
          gates passed. {red.length} failed, for one reason, and the run says so in its own files.
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
          The decisions that are expensive to undo. One is still open, and it is the costly one.
        </h2>
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
            <li key={g.id} className={g.status === 'PASS' ? '' : 'gate-red'}>
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
              The finding, with a named fix.
            </h2>
          </div>
          <div className="measure space-y-4" style={{ color: 'var(--ink-2)' }}>
            <p className="text-lg" style={{ color: 'var(--ink)', fontWeight: 600 }}>
              {featured.finding.title}
            </p>
            <ol className="fix">
              {featured.finding.fix.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p>
              This is what the cohort trains: reading a record like this and knowing, before anyone ships, which
              line you would regret.
            </p>
          </div>
        </div>
      </section>

      <section className="rule py-14" aria-labelledby="receipt">
        <div className="grid gap-10 md:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="eyebrow">receipts/{featured.receipt.file}</p>
            <h2 id="receipt" className="mt-3 text-3xl leading-tight">
              Checked by an agent that never saw the others’ work.
            </h2>
          </div>
          <div className="measure space-y-4" style={{ color: 'var(--ink-2)' }}>
            <p>
              The verifier re-derived {featured.receipt.pointers} evidence pointers in a fresh context:{' '}
              {featured.receipt.confirmed} confirmed, {featured.receipt.failed} failed. Every pointer can be true while
              a gate is red; pointers prove a finding, a gate judges it.
            </p>
            <p>
              Separately, the plugin’s own contract check on this artifact set: {featured.contract.pass} of{' '}
              {featured.contract.checks} checks pass. It checks shape, not judgement. Measured {data.measuredAt} against
              plugin v{data.pluginVersion}.
            </p>
            <p>
              <a className="link" href={featured.source}>
                Read every file in this run
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="rule py-14" aria-labelledby="more">
        <p className="eyebrow">Two more runs</p>
        <h2 id="more" className="mt-3 max-w-3xl text-3xl leading-tight">
          Different systems, different gates go red.
        </h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {others.map((r) => {
            const failed = r.gates.filter((g) => g.status !== 'PASS')
            return (
              <article key={r.id} className="run">
                <p className="eyebrow">{r.name}</p>
                <p className="mt-2" style={{ color: 'var(--ink-2)' }}>
                  {r.goal}
                </p>
                <p className="mt-4 text-sm">
                  Red: {failed.map((g) => g.id).join(', ') || 'none'} · pointers {r.receipt.confirmed}/{r.receipt.pointers}{' '}
                  confirmed
                </p>
                <p className="mt-3">
                  <a className="link" href={r.source}>
                    Read the run
                  </a>
                </p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="rule py-14" aria-labelledby="next">
        <h2 id="next" className="max-w-3xl text-3xl leading-tight">
          Run it on your own system, then learn to read what it hands back.
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
          Excerpts from{' '}
          <a className="link" href="https://github.com/frankxai/ai-architect">
            frankxai/ai-architect
          </a>{' '}
          examples, {data.licence}.
        </p>
      </section>
    </>
  )
}
