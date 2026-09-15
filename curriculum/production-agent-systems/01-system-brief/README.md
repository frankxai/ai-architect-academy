# 01 · System brief

Stage `stage:system-brief` · artifact `artifact:system-brief` · eval `eval:system-brief-complete` · [rubric](rubric.md)

The decision this stage forces: **whose job is this, and what would make you stop building it?**

## The decision

Every stage in this path is a decision you cannot hand to the model. This one comes first because every later stage inherits it. Stage 2 picks a shape for what job? Stage 3 bounds the agent relative to which task? Stage 4 detects a regression from what? Without a named user and job, none of those has an answer, and the later artifacts get written against whatever the builder had in mind that afternoon.

The brief is one markdown file with five headings: user and job, in scope, explicitly out of scope, success measure, kill criterion. Those are the `requiredSections` on `artifact:system-brief`. The eval's two checks are scoped to two of those headings, out of scope and kill criterion, and read only what sits under them. The other three exist so those two mean something.

It cannot be deferred because the alternative is worse than an empty page. Build the demo first and the brief gets written to match; a brief written after the architecture is chosen is a justification, not a decision. One test tells them apart: a real brief refuses something the builder wanted to build.

The decision has two halves. "Whose job is this" means a person and a task with a completion state, not a feature and an audience. "What would make you stop" means a number or a date that ends the project without a meeting, and a named role or scheduled job that reads the number on a schedule and keeps reading it. If you cannot write the second half before any code exists, you will not write it later; by then you will have opinions about the system, and opinions do not stop projects.

## What goes wrong

### Scope by omission

The out-of-scope section is empty or generic. The authority matrix at stage 3 then has nothing to bound against, and the first refusal the system needs to make was never written down.

How you would detect it: read only the out-of-scope section. It fails if it is empty, says "everything else", or names categories ("edge cases", "complex requests") rather than requests a real person could send. Second test: turn each bullet into a stage 4 fixture. "Refund requests" converts: send one, assert no refund action. "Anything complicated" does not convert; it is not a bullet, it is a shrug.

### Kill criterion that cannot fire

"If users do not like it" is not a criterion. Without a threshold or a date, the project cannot be stopped by evidence, only by exhaustion.

How you would detect it: read the kill criterion alone. On what day, reading what number, could someone who has never met the author say "this should have stopped"? If the answer requires asking the author, it cannot fire. A second form: a criterion that depends on a measurement the system does not produce, such as a survey, a stakeholder's mood, or a quarterly review. A third form: a minimum sample that may never arrive. "After 200 tickets" with no calendar backstop is a criterion that waits politely for the evidence to show up, and if the traffic is thin it has no end date at all. A fourth: a query that runs once. A system that passes on day 30 and degrades on day 90 is stopped by nothing if nobody is scheduled to look again.

### The brief as a pitch

The success measure is adoption or enthusiasm rather than job completion. The system cannot be wrong, so nothing downstream can be tested.

How you would detect it: could the system score perfectly on the stated measure while doing the job wrong? A support assistant with high adoption and wrong answers scores well on adoption. If yes, the stage 4 harness has no target, and the brief is selling the system rather than defining it.

## Concepts

### The brief precedes the model choice

A system with no named user and job has no way to be wrong. That sounds like safety; it is the opposite. Every later stage needs a way to be wrong: stage 2 needs a rejected option, stage 4 a regression, stage 8 a detection. All of those are "wrong relative to the job". No job, no wrong, no evals.

The trade-off is real: writing the brief first costs a session in which you build nothing, and the shape you would have picked by instinct may be right anyway. Pay it. Only the deliberate brief has an out-of-scope list that refuses anything.

### Name the job, not the feature

"Answer support tickets" is a feature: an activity with no completion state. "Close tier-1 shipping tickets without a human" is a job: a unit (a ticket), a class (tier-1 shipping), a completion state (closed, no human touch). Only the second can be counted, and only what can be counted can be evaluated.

The second phrasing is less impressive in a demo, and someone will ask why it cannot also handle returns. The answer is the out-of-scope list, where narrowness becomes a decision. A narrow job that closes is worth more than a wide job that helps.

The test: rewrite the job as "for [user], [verb] [unit] until [state]". If any slot is empty, you have a feature.

### Out of scope is the load-bearing section

Bullets come in two kinds. A refusal: the system says no and stops. A hand-off: the system routes to a person with enough context to continue. Both name a request; neither names a category.

Each kind has a cost, and writing the bullet makes it visible. A hand-off is a human process you are now promising exists; if nobody is on the other end, it is a refusal in a hand-off's clothes. A refusal is a customer you disappoint on purpose. Not writing the bullet moves the cost to the incident.

The section also has to say what a wrong in-scope action costs, because that cost decides the shape of the kill criterion below. A wrong tracking reply costs one reopened ticket. A parcel redirected to the wrong address, or an access grant to the wrong person, is not reversed by the next reply. If the brief does not name which of its actions are the second kind, nobody downstream will.

This section feeds stage 3 directly. `artifact:tool-authority-matrix` needs every tool flagged `sideEffecting` and every side-effecting tool backed by its own principal with a revocation path. The out-of-scope list is where you learn which tools the agent must not have at all: "never changes a payment" at stage 1 becomes "no principal with write access to the payment processor" at stage 3. An empty list gives stage 3 nothing to exclude, which is how one broad credential ends up behind every tool (`failure:ambient-authority`).

### Success measures from the system's own telemetry

The measure must be something the system can produce about itself: an event it logs, a state it sets, a field it writes. Not a survey run later, not an impression collected in a meeting.

The reason is downstream. The stage 4 harness (`artifact:eval-harness`) asserts against the same measure in fixtures, and the stage 8 incident report has a required section, "what the telemetry showed". A measure outside the system gives the harness nothing to compare and the incident no signal.

Keep the denominator out of the system's hands. A share is a numerator over a denominator, and if the system being measured decides what counts in the denominator, it can score well by declining. An assistant that labels every hard ticket "not tier-1" closes near 100% of what remains. Fix the denominator with a rule applied before the system sees the item: a category the customer set on an intake form, a field the order system wrote at the time of the request, or a sample a person labelled by hand. The system's own classification can be a numerator condition, never a denominator condition. Use the same pre-set fields to take out of the denominator what the out-of-scope rules already send to a person; a denominator that keeps them makes the target reward closing what the brief said to hand off.

The trade-off: telemetry measures are proxies. "Closed with no reopen within seven days" stands in for "the customer got what they needed", and a customer who gives up silently counts as a success. Accept the proxy, label it as one, close the gaps the log can close (a new ticket from the same sender about the same order is a reopen, whatever it is called), and carry what remains to the stage 5 threat model as an accepted risk.

### Kill criteria, chosen before attachment

A kill criterion is a threshold or a date, and it comes in two kinds, chosen by what a wrong action costs.

A rate threshold is a number the telemetry produces, over a stated window, with a minimum sample so it cannot fire on noise in the first hour. Use it for errors that are cheap and reversible: a wrong reply, a reopened ticket. A rate threshold with a minimum sample also needs a calendar backstop, the day on which it evaluates whatever sample exists, or it is the third form of a criterion that cannot fire.

A tripwire is a single occurrence. Use it for actions that are irreversible or whose harm is lopsided: one grant of admin rights to the wrong person, one parcel redirected, one payment changed. A tripwire has no window and no minimum sample, because the first occurrence is the incident. "Any grant outside the approved request types" is a tripwire; "wrongful-grant rate above 2% over 200 requests" is a rate threshold that has agreed in advance to tolerate four wrongful grants.

A date is a calendar day on which, if the success measure is not at target, the project stops.

Choose it now because attachment grows with every hour you build; the criterion you would set after a month of work is looser than today's, and today's is the honest one. Set the kill threshold on the failing side of the success target, with a gap; the gap is where you keep going and fix things. For a higher-is-better measure the kill threshold sits below the target; for a lower-is-better measure, such as a reopen rate, it sits above. Name the consequence: "stops" means something specific, such as the assistant is disabled and the queue returns to a person. Name the owner or the trigger: the role that runs the query and on what cadence, or the scheduled job that runs it and where it posts the result. A criterion nobody is assigned to read depends on someone remembering. A kill criterion is a standing check, not a one-time gate: the query keeps running after the first evaluation, on a trailing window, until the project ends.

Say who can restart a stopped project. The person who wanted the feature is the person most attached to it, so a fired criterion is not rewritten by that role alone: the new, dated criterion needs a second role's agreement, and the fired one stays in the file above it. The trade-off is a slower restart when the numbers justify one; the alternative is a criterion its author can loosen the afternoon it fires.

Teams that skip this do not avoid the criterion. They meet it during the incident, when the number that should have stopped the project is read out by someone else.

### Redaction from the first line

Employer and customer names never enter the brief. `artifact:system-brief` carries `redactionRule: ['employer name', 'customer name']`. Those entries are category labels, not strings to search for; the graph names the categories, and turning them into the actual names is your job. Stage 9's `eval:portfolio-links-resolve` scans the rendered portfolio against the union of every artifact's redaction list, which means it can only catch what has been turned into a searchable term. Do not count on a later stage to find a name that entered at this one.

Keep a private deny-list, outside the repository: the actual employer, customer and colleague names your system touches. Search the brief against it before the first commit, and again before every commit that follows. A name that enters the history has to be found and stripped in every copy, including commit history. A name that never enters has nothing to strip.

Write "the shop", "the owner", "the carrier". If the job cannot be described without the employer's name, it is described in terms of an org chart rather than a user. Compensate for the lost concreteness with concrete requests, not concrete names.

## A worked decision

This scenario is a composite. It is not a real shop, client, or employer. It is assembled to exercise every section of the brief.

A small online shop sells physical goods and ships them through one carrier. One owner, one part-time support person. Tickets arrive through an intake form on which the customer picks a category; the order record and the carrier tracking feed are both readable. The inbox is dominated by shipping questions: where is my order, can I change the address, tracking says delivered but nothing arrived. The owner's request is "an AI that handles support".

First draft of the user and job: "help customers with support". Rejected; no unit, no completion state. Second draft, in the for/verb/unit/until form: for the part-time support person, close tier-1 shipping tickets until no human touch is needed, where tier-1 means answerable from the order record and the carrier feed alone. That is a job.

First draft of the in-scope list put address changes in, "before the label is printed, verify no label, then update the order". Rejected. Redirecting goods is a money decision, which the tier-1 definition already excludes; the only identity check available is that the sender's email matches one order, which a compromised or spoofed mailbox also satisfies; and the label can be printed between the check and the write. That line moved to out of scope as a hand-off, and it is the line that makes this a brief rather than a pitch: the owner wanted it.

The tracking-link reply nearly went the same way. The carrier's page shows where the parcel is going, the same email match is the only check, and a link sent to the wrong person cannot be taken back. It stayed in scope on one condition: the reply goes to the email address on the order record, never to the sender address on the ticket, so a spoofed header gets nothing. A compromised mailbox still gets it, and the brief writes that down as the disclosure it is and puts a tripwire on it. The brief that came out:

```markdown
# System brief: shipping-ticket assistant (composite)

## User and job
User: the shop's part-time support person, who works the queue in two
sessions a day. Job: close tier-1 shipping tickets without a human touch.
Tier-1 shipping: a ticket the customer filed under category "shipping"
and sub-category "where is my order" or "send me my tracking link",
whose sender matches exactly one order, whose order has at least one
carrier tracking event and no delivered event when the ticket arrives,
and whose text carries no chargeback, legal or threat keyword. The
intake form and the order system write every one of those fields at
submission, before the assistant reads the ticket. Answerable from the
order record plus the carrier feed, read only; no judgement call about
money, product, or where goods go.

## In scope
- "Where is my order": reply with the latest tracking event and the
  carrier's estimate; close.
- "Send me my tracking link": reply with the carrier's tracking link for
  that order; close.

Both replies disclose where a parcel is going, and a disclosure cannot
be undone by the next reply. Every reply goes to the email address on
the order record, never to the sender address on the ticket.

## Explicitly out of scope
- Address change, before or after the label is printed: hands off to the
  support person with the order id and the requested address. Redirecting
  goods is a money decision, and the only identity check is an email
  match. The assistant never writes to the order.
- Refund, cancellation, or any payment change: hands off to the owner
  with the order id and the customer's message. The assistant has no
  access to the payment processor.
- Product questions (fit, material, care): refuses, links the product
  page, offers hand-off to the support person.
- Any ticket whose order shows a delivered event when the ticket arrives,
  "delivered but nothing arrived" included: hands off to the support
  person with the carrier's delivery record. A lost-parcel claim is a
  money decision.
- Any ticket whose sender does not match exactly one order: hands off
  unanswered.
- Any ticket mentioning a chargeback, a legal claim, or a threat: hands
  off unanswered and flagged.

## Success measure
Share of tier-1 shipping tickets closed by the assistant with no human
touch and no reopen within seven days. Denominator: tickets whose intake
fields meet the tier-1 definition above: `intake_category = shipping`,
`intake_subcategory` in (where-is-my-order, tracking-link),
`sender_order_matches = 1`, `tracking_status_at_received` not delivered,
`flag_keywords` empty. All five are written before the assistant reads
the ticket, and the tickets the rules send to a person never enter the
denominator, so handing off does not shrink it and closing a hand-off
does not raise it. Numerator: `closed_by = assistant`, `reopened_at`
null at day seven, and no new ticket from the same sender about the same
order within seven days. Some denominator tickets still need a hand-off,
because customers pick the wrong sub-category; the target allows for
them. This is a proxy for "the customer got what they needed"; a
customer who gives up silently counts as a success, and that gap is
carried to stage 5. Target: 60% of tier-1 shipping tickets, with a
seven-day reopen rate under 10%.

## Kill criterion
Rate thresholds, from the same query as the success measure, over the
trailing 30 days of live traffic: if the window holds at least 200
tier-1 shipping tickets and fewer than 40% closed with no human touch,
or the seven-day reopen rate exceeds 20%, the project stops. Backstop:
from day 60, the thresholds apply to whatever the window holds.
Tripwires, each stopping the project the day it is found: one ticket
with `closed_by = assistant` whose intake fields fail any rule in the
tier-1 definition (wrong category or sub-category, sender matching zero
or several orders, delivered status, flagged keyword), which is the
assistant closing something it was told to hand off; one reply sent to
an address other than the order record's email, which is a disclosure
the next reply cannot take back. A hand-off the intake fields cannot
express, such as an address change typed under "where is my order", is
caught only by the reopen rate and the support person's spot-check;
that gap goes to stage 5.
Stops means: the assistant is disabled and the queue returns to the
support person. Continuing past a fired criterion requires a new, dated
criterion written into this file, with the fired one kept above it,
by the owner and agreed by the support person, who did not ask for the
assistant.
Owner and trigger: one scheduled job runs each morning. It runs both
tripwire queries every day, and the rate query every Monday from day 30
and on day 60. It posts each result to the owner and the support person
and keeps running after the first evaluation; a criterion is a standing
check, not a one-time gate.
```

Checked against the eval's two assertions, reading the check text literally. `has-out-of-scope`: a section under the out-of-scope heading with at least two bullets. Six bullets, each naming a request a customer could send and what happens, refuses or hands off, and to whom. Passes. `has-kill-criterion`: the kill-criterion section contains a measurable threshold or date. Two rate thresholds (40% and 20%) with a trailing window, a minimum sample and a day-60 backstop, two tripwires, a consequence, a scheduled trigger. Passes.

Why 40 rather than 50, why 200 rather than 100, why day 60: the shop's choices. What is not optional is that the ticket log produces the numbers without anyone being asked, and that a named person or job reads them on a schedule and keeps reading. Notice what the brief has already decided downstream. Stage 3: no principal touches the payment processor, no principal has write access to the order record, and the reply tool sends only to the order's email address; the assistant reads and replies. Stage 4: four fixtures fall out of the brief, a refund request that must produce no payment action, an address change that must produce a hand-off and no order write, a product question that must produce a refusal, and a ticket whose sender address differs from the order's that must produce no reply to the sender. Stage 5: the chargeback-and-threat hand-off and the address-change hand-off are trust boundaries; the silent give-up and the mis-picked sub-category are accepted risks. Stage 6: the unit of work is one ticket.

## Producing the artifact

1. Pick the one agent system you will carry through every stage of this path. Prefer one you can put on a public URL at stage 7 and break on purpose at stage 8; a system you cannot deploy cannot finish this path.
2. Write the user and job as "for [user], [verb] [unit] until [state]", every slot filled. If stuck, use the workflow, pain-point and user questions in the discovery template below.
3. List what is in scope as request types with a completion action, not as features. Mark any in-scope action that cannot be undone by the next reply; a disclosure counts.
4. Write the out-of-scope section: at least two bullets, each naming a request plus what happens (refuses, or hands off to whom). Discovery question 30, "what absolutely should not be automated", is the seed.
5. Write the success measure as a query in words: log, field, condition. Fix the denominator by a rule the system does not control, and take out of it what the out-of-scope rules send to a person, using fields set before the system reads the item. Label the measure a proxy if it is one.
6. Write the kill criterion: a rate threshold with a trailing window, minimum sample and backstop date, a tripwire, or a date; the consequence; who can restart and who must agree; the role or scheduled job that reads it, on what cadence, and where the result goes. Threshold on the failing side of the success target, with a gap. If any in-scope action is irreversible, at least one criterion is a tripwire.
7. Run the eval's two checks yourself, reading the check text literally: count the list items under the out-of-scope heading; find the number or date under the kill-criterion heading and nowhere else.
8. Redact. Search the file against your private deny-list of employer, customer and colleague names before the first commit, not the last.
9. Commit the file to a repository a stranger can open. That URL is the evidence you control, and the file is `artifact:system-brief`. The stage also needs a reviewer's recorded run of `eval:system-brief-complete` with both assertions passed; the [rubric](rubric.md) says what that record holds and who produces it.

## Check yourself

1. One of your out-of-scope bullets is "anything not listed above". Read literally, the check counts it as a bullet. Would a reviewer? What does stage 3 do with it?
2. The owner wants the success measure to be "customers are happier". Write the telemetry proxy. What does it miss, and at which stage is that gap written down?
3. Your kill criterion is a date. What else must be true on that date for the project to continue? If the brief says nothing else, is the date alone a criterion?
4. Every hand-off promises a person on the other end. Which of yours has nobody there, and is it then a hand-off or a refusal?
5. You built a demo last week. Which sections of the brief did the demo already decide? Rewrite one as if it had not.
6. Which of your out-of-scope bullets would become a stage 4 fixture without rewording? What is wrong with the ones that would not?
7. Which of your in-scope actions could the system get wrong once and not undo? If the answer is "none", check the writes. If there is one, which kill criterion fires on its first occurrence?

## Go deeper

- [Discovery questions](../../../04-templates/discovery/discovery-questions.md): sections 2 and 4 feed user and job; question 30 seeds the out-of-scope list; questions 106 to 108 are the success measure and kill criterion before they have numbers.
- [Use case template](../../../04-templates/product/use-case-template.md): actors, preconditions, alternative flows. It tells you to avoid numbers; this brief needs them. Take the who and the flow, not the success measure.
- [AI strategy brief](../../../04-templates/strategy/ai-strategy-brief.md): the "Risk Flags (Stop if...)" block is a kill criterion at portfolio level. Yours has to be a number the system itself produces.
- [AI Architect: start here](../../../00-getting-started/AI-ARCHITECT-START-HERE.md): orientation to the rest of the repository.
- [Executive narrative builder](../../../02-learning-paths/micro-modules/storytelling-exec-brief.md): the narrative for leadership. The brief is what it reports on, not the narrative; keep them in separate files.
- [The graph](../../../site/lib/academy-graph/production-agent-systems.ts): source of truth for this stage's artifact, eval, evidence rule and redaction rule. Where this lesson and the graph disagree, the graph wins.
