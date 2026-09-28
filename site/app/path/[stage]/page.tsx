import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { artifacts, evals, projectProductionAgentSystems as project, reviews } from '@/lib/academy-graph'
import modules from '@/data/modules.json'

export const dynamicParams = false

const stageSlug = (id: string) => id.replace(/^stage:/, '')
const stageBySlug = (slug: string) => project.stages.find((s) => stageSlug(s.id) === slug)

const EVIDENCE: Record<string, string> = {
  'repo-url': 'a commit or file a third party can open',
  'deploy-url': 'a running deployment a third party can reach',
  'eval-run': 'a recorded, reproducible eval run',
  'reviewer-attestation': 'a sign-off from a named reviewer who is not you',
}

export function generateStaticParams() {
  return project.stages.map((s) => ({ stage: stageSlug(s.id) }))
}

export async function generateMetadata({ params }: { params: Promise<{ stage: string }> }): Promise<Metadata> {
  const stage = stageBySlug((await params).stage)
  if (!stage) return {}
  return { title: `Stage ${String(stage.ordinal).padStart(2, '0')}: ${stage.title}`, description: stage.decision }
}

export default async function StagePage({ params }: { params: Promise<{ stage: string }> }) {
  const stage = stageBySlug((await params).stage)
  if (!stage) notFound()

  const artifact = artifacts.find((a) => a.id === stage.artifact)
  const stageEvals = evals.filter((e) => stage.evals.includes(e.id))
  const stageReviews = reviews.filter((r) => stage.reviews.includes(r.id))
  const module = modules.modules.find((m) => m.order === stage.ordinal)
  const index = project.stages.indexOf(stage)
  const prev = project.stages[index - 1]
  const next = project.stages[index + 1]
  const rule = stage.evidenceRule

  return (
    <article className="pb-20 pt-16 sm:pt-24">
      <p className="eyebrow">
        <Link href="/path" className="hover:text-cobalt">
          {project.title}
        </Link>{' '}
        · stage {String(stage.ordinal).padStart(2, '0')} of {String(project.stages.length).padStart(2, '0')}
      </p>
      <h1 className="mt-5 max-w-4xl text-[clamp(2.1rem,5.5vw,3.8rem)] leading-[1.04]">{stage.title}</h1>
      <p className="measure mt-7 text-xl leading-relaxed" style={{ color: 'var(--ink-2)' }}>
        {stage.decision}
      </p>

      {module && (
        <section className="rule mt-12 pt-8" aria-labelledby="module">
          <p className="eyebrow">The module</p>
          <h2 id="module" className="mt-3 text-3xl leading-tight">
            Lesson, exercise and rubric
          </h2>
          <ul className="module-links mt-6">
            {module.files.README && (
              <li>
                <a className="link" href={module.files.README}>
                  Read the lesson
                </a>
              </li>
            )}
            {module.files.exercise && (
              <li>
                <a className="link" href={module.files.exercise}>
                  Do the exercise
                </a>
              </li>
            )}
            {module.files.rubric && (
              <li>
                <a className="link" href={module.files.rubric}>
                  Check it against the rubric
                </a>
              </li>
            )}
            {module.labs.map((lab) => (
              <li key={lab.slug}>
                <a className="link" href={lab.href}>
                  Lab {lab.slug}
                </a>
              </li>
            ))}
          </ul>
          <p className="measure mt-5 text-sm" style={{ color: 'var(--ink-3)' }}>
            Open the repository in a coding agent and run <code className="mono">/module {String(stage.ordinal).padStart(2, '0')}</code>{' '}
            for a Socratic session over this stage.
          </p>
        </section>
      )}

      {artifact && (
        <section className="rule mt-12 pt-8" aria-labelledby="artifact">
          <p className="eyebrow">What you leave behind · {artifact.format}</p>
          <h2 id="artifact" className="mt-3 text-3xl leading-tight">
            {artifact.title}
          </h2>
          <p className="mt-4" style={{ color: 'var(--ink-2)' }}>
            Required sections:
          </p>
          <ul className="sections mt-3">
            {artifact.requiredSections.map((s) => (
              <li key={s} className="mono">
                {s}
              </li>
            ))}
          </ul>
          <p className="measure mt-5 text-sm" style={{ color: 'var(--ink-3)' }}>
            {artifact.publicSafe
              ? `May appear on a public portfolio once redacted${artifact.redactionRule.length ? `: remove ${artifact.redactionRule.join(', ')}` : ''}.`
              : 'Cohort-visible only; never published.'}
          </p>
        </section>
      )}

      {stageEvals.map((ev) => (
        <section key={ev.id} className="rule mt-12 pt-8" aria-labelledby={`eval-${ev.id}`}>
          <p className="eyebrow">The eval · {ev.id}</p>
          <h2 id={`eval-${ev.id}`} className="mt-3 text-3xl leading-tight">
            {ev.title}
          </h2>
          <ol className="checks mt-6">
            {ev.assertions.map((a) => (
              <li key={a.id}>
                <span className="mono check-id">{a.id}</span>
                <span>
                  {a.description} <span style={{ color: 'var(--ink-3)' }}>Checked by: {a.check}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm" style={{ color: 'var(--ink-3)' }}>
            Every check must pass. There is no partial credit and no override.
          </p>
        </section>
      ))}

      {stageReviews.map((r) => (
        <section key={r.id} className="rule mt-12 pt-8" aria-labelledby={`review-${r.id}`}>
          <p className="eyebrow">Independent review · the author may never review their own work</p>
          <h2 id={`review-${r.id}`} className="mt-3 text-3xl leading-tight">
            {r.title}
          </h2>
          <ul className="fix mt-5">
            {r.rubric.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>
      ))}

      <section className="rule mt-12 pt-8" aria-labelledby="evidence">
        <p className="eyebrow">Evidence that counts</p>
        <h2 id="evidence" className="mt-3 text-3xl leading-tight">
          Proof has to exist outside your own claim.
        </h2>
        <p className="measure mt-4" style={{ color: 'var(--ink-2)' }}>
          At least {rule.minimumCount} of: {rule.accepts.map((k) => EVIDENCE[k] ?? k).join('; ')}. Evidence older than{' '}
          {rule.maxAgeDays} days is stale and does not count.
        </p>
      </section>

      <nav className="rule mt-16 flex flex-wrap justify-between gap-4 pt-8" aria-label="Stages">
        {prev ? (
          <Link href={`/path/${stageSlug(prev.id)}`} className="btn btn-quiet">
            ← {String(prev.ordinal).padStart(2, '0')} {prev.title}
          </Link>
        ) : (
          <Link href="/path" className="btn btn-quiet">
            ← The path
          </Link>
        )}
        {next ? (
          <Link href={`/path/${stageSlug(next.id)}`} className="btn btn-primary">
            {String(next.ordinal).padStart(2, '0')} {next.title} →
          </Link>
        ) : (
          <Link href="/#waitlist" className="btn btn-primary">
            Join the cohort waitlist
          </Link>
        )}
      </nav>
    </article>
  )
}
