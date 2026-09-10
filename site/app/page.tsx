import Link from 'next/link'
import curriculum from '@/data/curriculum.json'
import { Waitlist } from '@/components/Waitlist'

const decisions = [
  ['Scope the first system to one job', 'With a failure you can measure before you build. Most AI projects die of ambition, not of models.'],
  ['Choose retrieval, fine-tuning, or neither, with a test', 'Run it before anyone has an opinion. Then write the record that says why.'],
  ['Draw the agent boundary before production draws it for you', 'What the model decides, what code decides, what a person decides.'],
  ['Write the eval before the feature', 'The one you write first, the one you write when something breaks, and the one that stops a release.'],
  ['Budget the failure modes', 'Latency, tokens, wrong answers, and who pays for each. Budgets, not hopes.'],
  ['Run governance that survives a real organisation', 'A decision record, a review, a kill criterion. Three documents, kept.'],
]

const founding = [
  'The launch price, whatever it is set at, held for you for as long as the course runs.',
  'Named in the course materials.',
  'A say in the order the six decisions are taught.',
  'Every later revision of the material, without paying again.',
]

const faq = [
  [
    'Is there a price?',
    'Not yet. The price band you answer on the waitlist is the evidence that sets it. Nothing here is discounted, because there is no price to discount from. The founding fifty keep whatever it becomes.',
  ],
  [
    'When does Cohort 1 start?',
    'No date. It is scheduled when there are enough people to run it well, and you get one email when that happens. There is no countdown and there will not be one.',
  ],
  [
    'What would it actually be?',
    'The working intention: live sessions on the six decisions, applied to a system you bring, with your decision records read and reviewed between sessions, in a group small enough that every record gets read. Length, hours and size are not fixed. The waitlist answers set them.',
  ],
  [
    'What do I get today?',
    'The ADR template and a worked decision record, free, on this site. And the open repository, which is the material the cohort is built from.',
  ],
  [
    'Who is this not for?',
    'People who want a model tutorial. The docs already do that well. This is for the person who has to decide, and be accountable for the decision, before they feel ready.',
  ],
]

const patterns = curriculum.sections.find((s) => s.id === 'patterns')
const labs = curriculum.sections.find((s) => s.id === 'labs')
const total = curriculum.sections.reduce((n, s) => n + s.count, 0)

export default function Home() {
  return (
    <>
      <section className="pb-20 pt-20 sm:pt-28" aria-labelledby="hero">
        <p className="eyebrow">A cohort course, built in the open</p>
        <h1 id="hero" className="mt-5 max-w-4xl text-[clamp(2.4rem,6.5vw,4.6rem)] leading-[1.02]">
          For the engineer who was just handed the <em>AI work.</em>
        </h1>
        <p className="measure mt-8 text-xl leading-relaxed" style={{ color: 'var(--ink-2)' }}>
          The docs teach the APIs. Nobody teaches which decision comes first, which one you cannot undo, and
          what getting it wrong costs. That is the course.
        </p>
        <p className="measure mt-4 text-lg" style={{ color: 'var(--ink-2)' }}>
          You finish able to write the six decision records for a system you own, defend them in a review you did not
          call, and reverse any of them without losing the work.
        </p>
        <p className="measure mt-4 text-lg" style={{ color: 'var(--ink-2)' }}>
          It is not scheduled and it has no price. The people on the waitlist decide both.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="#waitlist" className="btn btn-primary">
            Join the waitlist
          </Link>
          <Link href="/adr" className="btn btn-quiet">
            Read the free ADR first
          </Link>
        </div>
      </section>

      <section className="rule py-16" aria-labelledby="today">
        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="eyebrow">What exists today</p>
            <h2 id="today" className="mt-3 text-3xl leading-tight">
              The material is public. The cohort is what is not.
            </h2>
          </div>
          <div>
            <p className="measure" style={{ color: 'var(--ink-2)' }}>
              Everything the course is built from is in an open repository you can read now: {patterns?.count}{' '}
              design patterns, {labs?.count} hands-on labs, and {total - (patterns?.count ?? 0) - (labs?.count ?? 0)}{' '}
              further modules, paths and governance documents. The counts are of the items listed on this site, read
              from the repository on {curriculum.measuredAt}, not typed in.
            </p>
            <p className="measure mt-4" style={{ color: 'var(--ink-2)' }}>
              The repository is the reference. The cohort is the part a document cannot do: your system, your
              constraints, and your decision records read by someone who will tell you which one you will regret
              before you ship it.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
              {curriculum.sections.slice(0, 4).map((s) => (
                <div key={s.id}>
                  <dt className="eyebrow">{s.label}</dt>
                  <dd className="display mt-1 text-3xl">{s.count}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8">
              <Link href="/curriculum" className="link">
                See every item, with a link to the source
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="rule py-16" aria-labelledby="shape">
        <p className="eyebrow">The shape of the cohort</p>
        <h2 id="shape" className="mt-3 max-w-3xl text-3xl leading-tight">
          Six decisions, in the order you have to make them.
        </h2>
        <p className="measure mt-5" style={{ color: 'var(--ink-2)' }}>
          A working outline, not a syllabus. It changes with what the waitlist tells us. Nothing below is a promise of
          a module.
        </p>
        <ol className="mt-10 grid gap-px overflow-hidden rounded-lg border" style={{ borderColor: 'var(--rule)', background: 'var(--rule)' }}>
          {decisions.map(([title, body], i) => (
            <li key={title} className="grid gap-3 bg-paper p-6 sm:grid-cols-[3.5rem_14rem_1fr] sm:gap-6">
              <span className="display text-2xl" style={{ color: 'var(--ink-3)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-lg" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                {title}
              </h3>
              <p style={{ color: 'var(--ink-2)' }}>{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="rule py-16" aria-labelledby="gift">
        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="eyebrow">Before you give an address</p>
            <h2 id="gift" className="mt-3 text-3xl leading-tight">
              One decision, worked all the way through.
            </h2>
          </div>
          <div>
            <p className="measure" style={{ color: 'var(--ink-2)' }}>
              The unit of the course is the architecture decision record: the context, the choice, the options you
              rejected and why, and what it costs when it turns out to be wrong. The template and one complete worked
              record are on this site, free, with no form in front of them. If they are not obviously worth more than
              the docs, do not join the list.
            </p>
            <p className="mt-6">
              <Link href="/adr" className="btn btn-quiet">
                Read the worked ADR
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="rule py-16" aria-labelledby="who">
        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="eyebrow">Who is teaching</p>
            <h2 id="who" className="mt-3 text-3xl leading-tight">
              Frank Riemer
            </h2>
          </div>
          <div className="measure space-y-4" style={{ color: 'var(--ink-2)' }}>
            <p>
              I am an AI architect. I have designed AI systems for large organisations and I teach the way I was taught
              best: by pairing, inside the codebase, with a question before an answer. The open repository already
              works this way if you open it in a coding agent.
            </p>
            <p>
              This academy is independent work. It is not affiliated with, endorsed by, or sponsored by any employer,
              vendor, or client, and nothing here describes any organisation I have worked for. Every example is a
              composite written for teaching.
            </p>
          </div>
        </div>
      </section>

      <section id="waitlist" className="night -mx-6 rounded-none px-6 py-16 sm:-mx-8 sm:rounded-2xl sm:px-12" aria-labelledby="waitlist-title">
        <div className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="eyebrow" style={{ color: 'rgba(236,233,225,0.5)' }}>
              Waitlist, not checkout
            </p>
            <h2 id="waitlist-title" className="mt-3 text-3xl leading-tight">
              Decide what this becomes.
            </h2>
            <p className="mt-5" style={{ color: 'rgba(236,233,225,0.7)' }}>
              One email to join. Three optional questions after, and they set the price and the order of the course.
              One email when Cohort 1 is scheduled. Two emails from this list, and nothing from any other list unless
              you join it.
            </p>
            <p className="eyebrow mt-8" style={{ color: 'rgba(236,233,225,0.5)' }}>
              The founding fifty get
            </p>
            <ul className="mt-3 space-y-1.5" style={{ color: 'rgba(236,233,225,0.85)' }}>
              {founding.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
          <div className="self-center">
            <Waitlist />
          </div>
        </div>
      </section>

      <section className="py-16" aria-labelledby="faq">
        <h2 id="faq" className="text-3xl leading-tight">
          Straight answers
        </h2>
        <dl className="mt-8 grid gap-8 md:grid-cols-2">
          {faq.map(([q, a]) => (
            <div key={q}>
              <dt className="text-lg" style={{ fontWeight: 600 }}>
                {q}
              </dt>
              <dd className="mt-2" style={{ color: 'var(--ink-2)' }}>
                {a}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  )
}
