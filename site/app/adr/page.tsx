import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'The ADR template, and one worked decision',
  description:
    'The architecture decision record the course is built around: the template, and one complete worked example with the rejected options and what getting it wrong costs.',
}

const Field = ({ k, children }: { k: string; children: React.ReactNode }) => (
  <div className="field">
    <span>{k}</span>
    <span>{children}</span>
  </div>
)

export default function AdrPage() {
  return (
    <article className="adr pb-20 pt-20">
      <p className="eyebrow">Free. No form in front of it.</p>
      <h1 className="mt-4 max-w-3xl text-[clamp(2rem,5vw,3.5rem)] leading-[1.05]">
        The decision record, and one decision worked all the way through.
      </h1>
      <p className="measure mt-6 text-lg">
        An architecture decision record is the smallest document that makes a decision reviewable a year later by
        someone who was not in the room. The course is built out of them. Here is the template we use, then one
        record filled in for a system that many teams are being asked to build right now.
      </p>
      <p className="measure mt-3 text-sm" style={{ color: 'var(--ink-3)' }}>
        The worked example is a composite written for teaching. It is not a client, an employer, or any real
        organisation, and its numbers are illustrative budgets, not measurements.
      </p>

      <section aria-labelledby="template" className="rule mt-14 pt-8">
        <h2 id="template">The template</h2>
        <p>Seven fields. If a field is hard to fill, that is the finding.</p>
        <div className="mt-6">
          <Field k="Title">One sentence, in the form of the decision, not the topic. &ldquo;Retrieval before fine-tuning&rdquo;, not &ldquo;Model strategy&rdquo;.</Field>
          <Field k="Status">Proposed, accepted, superseded by ADR-n, or reversed on date. Never &ldquo;in progress&rdquo;.</Field>
          <Field k="Context">What is true that forces a decision now. Constraints you did not choose. The measurable failure the system exists to prevent.</Field>
          <Field k="Decision">What you will do, stated so plainly that a reviewer could check whether you did it.</Field>
          <Field k="Options rejected">Each serious alternative, why it lost, and under what change it would win. This field is where the judgement lives.</Field>
          <Field k="Cost of being wrong">What it costs, in time, money and trust, if this decision turns out wrong, and how soon you would know.</Field>
          <Field k="Revisit when">The observable trigger that reopens the decision. A date is acceptable. &ldquo;When we have time&rdquo; is not.</Field>
        </div>
      </section>

      <section aria-labelledby="worked" className="rule mt-16 pt-8">
        <p className="eyebrow">Worked example</p>
        <h2 id="worked" className="!mt-2">
          ADR-0001: Retrieval before fine-tuning for a support-answer assistant
        </h2>

        <div className="mt-6">
          <Field k="Status">Accepted. Revisit trigger set (below).</Field>
          <Field k="Decision owner">The engineer accountable for the first release. Not a committee.</Field>
        </div>

        <h3>Context</h3>
        <p>
          A product team at a mid-size software company is asked to ship an assistant that answers customer support
          questions from the company&rsquo;s own documentation. Leadership has already said the word
          &ldquo;fine-tune&rdquo; in two meetings. The documentation is about over a thousand pages, changes weekly, and is the
          only thing the assistant may cite. The measurable failure the system exists to prevent is a confident wrong
          answer that a customer acts on. A slow answer or an honest &ldquo;I don&rsquo;t know&rdquo; is acceptable for
          the first release. A wrong one is not.
        </p>
        <p>
          Constraints not chosen by the team: an eight-week window to a first internal release, no labelled dataset of
          question-and-answer pairs, one engineer full-time and one part-time, and a data-handling rule that customer
          conversations may not leave the company&rsquo;s own environment for training.
        </p>

        <h3>Decision</h3>
        <p>
          The first release retrieves passages from the current documentation at question time and asks a general
          model to answer only from those passages, citing them. No model is fine-tuned in the first release. A
          question with no passage above the retrieval threshold gets a fixed &ldquo;I can&rsquo;t find that in the
          documentation&rdquo; response and a link to a person.
        </p>

        <h3>Options rejected</h3>
        <ol>
          <li>
            <strong>Fine-tune a model on the documentation.</strong> Rejected because there is no question-and-answer
            dataset, the documentation changes weekly so the model would be stale within days of every training run,
            and a fine-tuned model cannot cite the passage it drew from, which removes the one mechanism that lets a
            support agent verify an answer. It would win if the documentation were stable for months and the goal
            were tone or format rather than facts.
          </li>
          <li>
            <strong>Fine-tune and retrieve.</strong> Rejected for the first release because it doubles the surface to
            evaluate before the team has an evaluation at all. It becomes worth testing once retrieval alone has a
            measured wrong-answer rate to beat.
          </li>
          <li>
            <strong>Put the whole documentation in the prompt.</strong> Rejected because over a thousand pages exceeds any
            sensible per-question cost budget and, more importantly, long-context answers cannot be checked: the
            reviewer cannot tell which page produced the answer. It would win for a documentation set under a few
            dozen pages.
          </li>
          <li>
            <strong>Buy a hosted support-bot product.</strong> Not rejected on merit; rejected because the team could
            not get a written answer on where customer conversations would be stored, and the data-handling rule is
            not negotiable. Reopen if a vendor answers that question in writing.
          </li>
        </ol>

        <h3>Cost of being wrong</h3>
        <p>
          If retrieval alone cannot reach an acceptable wrong-answer rate, the team has spent roughly five of eight
          weeks and owns a working evaluation set of real questions, which is the input the fine-tuning option needed
          and did not have. The reversal cost is therefore low and the work is not wasted. The expensive failure is
          the one this decision was chosen to avoid: shipping without a way to check answers, and finding out from a
          customer.
        </p>
        <p>
          Budgets set at decision time, to be measured against, not assumed: answer latency under eight seconds at the
          95th percentile; retrieval cost per question small enough that a full day of expected traffic costs less than
          one hour of a support agent; and a wrong-answer rate on the evaluation set below the rate of the current
          human-written macro replies, which the team measures in week one before writing any assistant code.
        </p>

        <h3>Revisit when</h3>
        <ul>
          <li>The evaluation set reaches 300 real questions with reviewed answers, whatever the wrong-answer rate.</li>
          <li>The wrong-answer rate on that set stays above the human-macro rate for two consecutive weeks.</li>
          <li>The documentation change cadence drops to monthly or slower for a quarter.</li>
          <li>A vendor answers the data-handling question in writing.</li>
        </ul>

        <h3>What this record teaches</h3>
        <p>
          The decision itself is unremarkable. The value is in the rejected options and the revisit triggers: they
          turn a preference into a position that can be checked and, if necessary, reversed cheaply. The cohort works
          through the sequence of these records for a system end to end, in the order you actually have to make them.
        </p>
      </section>

      <section className="rule mt-16 pt-8">
        <p className="measure text-lg">
          If this is obviously worth more to you than the docs, the waitlist is the place to say what you would pay
          for the rest of the sequence.
        </p>
        <p className="mt-6">
          <Link href="/#waitlist" className="btn btn-primary">
            Join the waitlist
          </Link>
        </p>
      </section>
    </article>
  )
}
