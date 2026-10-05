import type { Metadata } from 'next'
import Link from 'next/link'
import {
  artifacts,
  competencyShipProduction as competency,
  evals,
  projectProductionAgentSystems as project,
  roleProductionArchitect as role,
} from '@/lib/academy-graph'
import modules from '@/data/modules.json'

export const metadata: Metadata = {
  title: 'The path: production agent systems',
  description: project.brief,
}

const artifactOf = (id: string) => artifacts.find((a) => a.id === id)
const evalOf = (id: string) => evals.find((e) => e.id === id)
const moduleOf = (ordinal: number) => modules.modules.find((m) => m.order === ordinal)
const stageSlug = (id: string) => id.replace(/^stage:/, '')

export default function PathPage() {
  return (
    <article className="pb-20 pt-16 sm:pt-24">
      <p className="eyebrow">The flagship path</p>
      <h1 className="mt-5 max-w-4xl text-[clamp(2.1rem,5.5vw,3.8rem)] leading-[1.04]">{project.title}.</h1>
      <p className="measure mt-7 text-xl leading-relaxed" style={{ color: 'var(--ink-2)' }}>
        {project.brief}
      </p>
      <p className="measure mt-4" style={{ color: 'var(--ink-2)' }}>
        {project.stages.length} stages. Each ends in an artifact a stranger can open and an eval that can be re-run.
        The order is the order production forces the decisions on you.
      </p>

      <ol className="path mt-14" aria-label="Stages in order">
        {project.stages.map((stage) => {
          const artifact = artifactOf(stage.artifact)
          const module = moduleOf(stage.ordinal)
          const checks = stage.evals.flatMap((id) => evalOf(id)?.assertions ?? [])
          return (
            <li key={stage.id} className="path-stage">
              <span className="path-ordinal display">{String(stage.ordinal).padStart(2, '0')}</span>
              <div className="path-body">
                <h2 className="text-2xl leading-tight">
                  <Link href={`/path/${stageSlug(stage.id)}`} className="hover:text-cobalt">
                    {stage.title}
                  </Link>
                </h2>
                <p className="mt-2" style={{ color: 'var(--ink-2)' }}>
                  {stage.decision}
                </p>
                <p className="path-meta mt-3 text-sm">
                  <span>Leaves: {artifact?.title}</span>
                  <span>
                    {checks.length} eval {checks.length === 1 ? 'check' : 'checks'}
                  </span>
                  {stage.reviews.length > 0 && <span>independent review</span>}
                  {module && module.labs.length > 0 && <span>lab</span>}
                </p>
              </div>
            </li>
          )
        })}
      </ol>

      <section className="rule mt-16 pt-10" aria-labelledby="grant">
        <p className="eyebrow">What the path grants, and what it does not</p>
        <h2 id="grant" className="mt-3 max-w-3xl text-3xl leading-tight">
          {competency.title}
        </h2>
        <p className="measure mt-4" style={{ color: 'var(--ink-2)' }}>
          {competency.claim}
        </p>
        <p className="measure mt-4 text-sm" style={{ color: 'var(--ink-3)' }}>
          {role.notAClaimOf}
        </p>
        <p className="mt-8 flex flex-wrap gap-3">
          <Link href={`/path/${stageSlug(project.stages[0].id)}`} className="btn btn-primary">
            Start with stage 01
          </Link>
          <Link href="/#waitlist" className="btn btn-quiet">
            Join the cohort waitlist
          </Link>
        </p>
      </section>
    </article>
  )
}
