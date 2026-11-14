import type { Metadata } from 'next'
import Link from 'next/link'
import { WorkedRunSwitcher } from '@/components/WorkedRunSwitcher'
import data from '@/data/worked-run.json'

type Run = (typeof data.runs)[number]

function featuredRun(): Run {
  const run = data.runs.find((r) => r.id === data.featured)
  if (!run) throw new Error(`worked-run.json has no featured run ${data.featured}`)
  return run
}

const featured = featuredRun()
const failed = (r: Run) => r.gates.filter((g) => g.status === 'FAIL')

export const metadata: Metadata = {
  title: 'A worked example, red gates included',
  description: `A fixture shipped with the AI Architect plugin, taken through every stage: a ${featured.name} system, its decisions, all ${featured.gates.length} gates including the ${failed(featured).length} that failed, the finding, and the example's verification receipt.`,
}

export default function WorkedRun() {
  return (
    <>
      <WorkedRunSwitcher
        runs={data.runs}
        featuredId={data.featured}
        measuredAt={data.measuredAt}
        pluginVersion={data.pluginVersion}
      />

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
