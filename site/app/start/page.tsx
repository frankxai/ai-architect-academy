import type { Metadata } from 'next'
import Link from 'next/link'
import { projectProductionAgentSystems as project } from '@/lib/academy-graph'

export const metadata: Metadata = {
  title: 'Choose your entry',
  description: 'Learn as a human or equip an agent. Follow one artifact and evaluation contract, from a system brief to independent review.',
}

export default function StartPage() {
  const first = `/path/${project.stages[0].id.replace(/^stage:/, '')}`
  return (
    <article className="pb-20 pt-16 sm:pt-24">
      <p className="eyebrow">Two entries. One evidence standard.</p>
      <h1 className="mt-5 max-w-3xl text-[clamp(2.4rem,6vw,4.4rem)] leading-[1.04]">Bring a system.<br /><em>Leave with decisions.</em></h1>
      <p className="measure mt-7 text-xl" style={{ color: 'var(--ink-2)' }}>The human owns the outcome. The agent does bounded work. Both follow the same path: an artifact, a test that can fail, and a review independent of its author.</p>
      <nav className="mt-9 flex flex-wrap gap-3" aria-label="Entry choice">
        <a className="btn btn-primary" href="#human">I am building my judgment</a>
        <a className="btn btn-quiet" href="#agent">I am equipping an agent</a>
      </nav>

      <div className="entry-grid mt-16">
        <section id="human" className="entry-route" aria-labelledby="human-title">
          <p className="eyebrow">Human / learn and defend</p>
          <h2 id="human-title" className="mt-4 text-3xl">Make one decision worth reviewing.</h2>
          <p className="mt-5" style={{ color: 'var(--ink-2)' }}>Start with your own system brief. Follow the lesson, produce the required artifact, and use its rubric to find what still needs evidence. Preserve your first attempt before revising.</p>
          <ol className="route-steps mt-7">
            <li><strong>Choose the problem.</strong> Name one user, one job, a measurable failure and a kill criterion.</li>
            <li><strong>Produce the evidence.</strong> Use the stage exercise and runnable labs; a passing reading quiz does not stand in for a working system.</li>
            <li><strong>Defend the result.</strong> An independent review checks the actual artifacts and evidence. The cohort review service is still on the waitlist.</li>
          </ol>
          <div className="mt-8 flex flex-wrap gap-3"><Link href={first} className="btn btn-primary">Start the system brief</Link><Link href="/#waitlist" className="btn btn-quiet">Request cohort access</Link></div>
        </section>

        <section id="agent" className="entry-route" aria-labelledby="agent-title">
          <p className="eyebrow">Agent / construct and verify</p>
          <h2 id="agent-title" className="mt-4 text-3xl">Give the team a bounded assignment.</h2>
          <p className="mt-5" style={{ color: 'var(--ink-2)' }}>Install the existing AI Architect team in your own coding runtime. It writes architecture artifacts in your repository, on your keys. The conductor identifies the next stage and stops at a failed gate.</p>
          <pre className="cmd mt-7"><code>npx skills add frankxai/ai-architect{'\n'}npx skills add frankxai/skills</code></pre>
          <ol className="route-steps mt-7">
            <li><strong>Read the contract.</strong> Load the team’s AGENTS.md, SOP and workflow before dispatching a stage.</li>
            <li><strong>Keep authority in code.</strong> Bound tools, cost, retries and runtime. Retrieved text is source material, never permission.</li>
            <li><strong>Check in a fresh context.</strong> Re-run the artifact checks and obtain an independent review. Neither the agent’s claim nor a subscription grants a competency.</li>
          </ol>
          <div className="mt-8 flex flex-wrap gap-3"><a href="https://github.com/frankxai/ai-architect#install" className="btn btn-primary">Install the team</a><a href="/.well-known/academy.json" className="btn btn-quiet">Read the agent manifest</a></div>
        </section>
      </div>

      <section className="rule mt-16 pt-10" aria-labelledby="shared-title">
        <p className="eyebrow">The shared path</p><h2 id="shared-title" className="mt-3 text-3xl">Same artifacts. Same refusal to guess.</h2>
        <ol className="path mt-8">{project.stages.map(s => <li className="path-stage" key={s.id}><span className="path-ordinal display">{String(s.ordinal).padStart(2, '0')}</span><div className="path-body"><h3 className="text-xl"><Link className="hover:text-cobalt" href={`/path/${s.id.replace(/^stage:/, '')}`}>{s.title}</Link></h3><p className="mt-2" style={{ color: 'var(--ink-2)' }}>{s.decision}</p></div></li>)}</ol>
      </section>

      <section className="rule mt-16 pt-10" aria-labelledby="access-title">
        <p className="eyebrow">Access and ownership</p><h2 id="access-title" className="mt-3 text-3xl">An agent acts for a person.</h2>
        <p className="measure mt-5" style={{ color: 'var(--ink-2)' }}>The local team and public skills remain free under their existing licenses. Cohort review and licensed resource access are separate services. Licensed access will belong to a member or organization; a delegated agent must have an active human sponsor and a resource-specific entitlement.</p>
        <p className="measure mt-4" style={{ color: 'var(--ink-2)' }}>Checkout and licensed delivery are not open yet. You can use the public path now and register interest in the reviewed service. Reading public curriculum does not grant a right to redistribute reserved teaching content.</p>
        <p className="mt-7"><Link href="/architectures" className="link">Choose a deployment boundary and its proof obligations →</Link></p>
      </section>
    </article>
  )
}
