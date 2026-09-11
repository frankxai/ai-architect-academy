import type { Metadata } from 'next'
import curriculum from '@/data/curriculum.json'

export const metadata: Metadata = {
  title: 'What exists today',
  description: 'Every public item the course is built from, counted from the repository, each linked to its source.',
}

export default function CurriculumPage() {
  return (
    <article className="pb-20 pt-20">
      <p className="eyebrow">What exists today</p>
      <h1 className="mt-4 max-w-3xl text-[clamp(2rem,5vw,3.5rem)] leading-[1.05]">
        Every item, with a link to the file it lives in.
      </h1>
      <p className="measure mt-6" style={{ color: 'var(--ink-2)' }}>
        Read from{' '}
        <a className="link" href={curriculum.repo}>
          the repository
        </a>{' '}
        on {curriculum.measuredAt}. The counts are of the items listed here. If a link is dead, the repository has
        moved on and this page is stale.
      </p>

      <div className="mt-14 space-y-14">
        {curriculum.sections.map((s) => (
          <section key={s.id} aria-labelledby={`sec-${s.id}`} className="rule pt-8">
            <div className="flex items-baseline justify-between gap-6">
              <h2 id={`sec-${s.id}`} className="text-2xl">
                {s.label}
              </h2>
              <span className="display text-2xl" style={{ color: 'var(--ink-3)' }}>
                {s.count}
              </span>
            </div>
            <ul className="mt-5 grid gap-x-8 gap-y-2 sm:grid-cols-2">
              {s.items.map((item) => (
                <li key={item.href}>
                  <a className="link" href={item.href}>
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </article>
  )
}
