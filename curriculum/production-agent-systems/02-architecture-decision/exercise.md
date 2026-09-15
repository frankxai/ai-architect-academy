# Exercise: write the architecture decision record

Deliverable: `artifact:architecture-decision`, one markdown file. Graded by `eval:adr-has-rejected-options` and `review:architecture-defence`. The stage is complete only when both pass.

## Scenario

This scenario is a composite. No real product, team or company is described. If you have your own stage 1 brief, use it instead; the deliverable and the checks are the same. This composite does not continue the stage 1 exercise's access-request assistant; if you are using composites rather than your own system, carry your stage 1 brief forward and use this one only for shape.

You are the architect for an internal assistant that helps a field-operations team file equipment inspection reports. The stage 1 brief says:

- User and job: a technician on site, on a phone, dictating what they found and getting back a structured report that matches the inspection template for that equipment class.
- In scope: mapping dictated observations to template fields, asking one clarifying question when a required field is missing, looking up the equipment's last three reports to flag a repeat finding.
- Explicitly out of scope: submitting the report, changing equipment records, anything that writes to the system of record.
- Success measure: share of reports accepted by the reviewer without edits.
- Kill criterion: a ceiling on the share of reports the reviewer sends back for a missing required field.

Two engineers on the team have already proposed shapes. One wants an orchestrator: a transcription-cleanup worker, a template-mapping worker, a history worker that fetches prior reports, and a composer. The other wants a single model with two tools: one that returns the template for an equipment class and one that returns prior reports. Nobody has proposed retrieval-first, router plus specialists or a fixed pipeline yet; consider whether any of them fits before you rule them out. Read the first proposal against the module's shapes before you accept its name: four steps in a fixed order with no planning may be a pipeline that was called an orchestrator.

Both existing proposals are credible. Your record has to reject at least one of them with a reason a reasonable engineer would accept.

## Deliverable

One markdown file with these five headings, in this order:

1. Context
2. Options considered
3. Decision
4. Consequences
5. What would reverse this

Headings are matched by the rule in `rubric.md`, "Required sections": case-insensitive, in this order, extra headings allowed. Real headings, not bold labels. Each option under Options considered is a top-level entry (a sub-heading, a numbered item, a bullet or a bold-labelled paragraph at the shallowest depth); sub-bullets under one option belong to that option and do not count as options. The worked decision in `README.md` is the format to copy.

## Constraints

- Options considered lists at least two of the shapes taught in the module as full options, naming the dominant shape where one composes two, and every rejected option carries a stated reason that references something in the brief.
- If any option is an orchestrator with workers or a fixed pipeline, its entry answers the module's five questions, starting with the number of handoffs that transfer state the receiving worker could not have retrieved or computed itself. A zero there does not reject the shape on its own; the other four have to be ruled out too. Where the answer to privilege separation is yes, name the schema the handoff payload is checked against; a free-text handoff does not separate anything.
- Consequences names at least one cost you are accepting. Cover all four currencies from the module: latency, token spend, operational surface, and who can now change behaviour by editing a prompt or a corpus. Name the untrusted inputs those choices create, and what you are building now to keep a later switch cheap.
- What would reverse this names a metric, cost line or incident class, where it is read from, the condition, and the shape you would move to. A reviewer with telemetry access must be able to check it without asking you. It is not the kill criterion; it fires before the kill criterion does, or on a different signal.
- The context section describes the problem, not a system. No shape name appears in it.
- Redact internal system names. The artifact is public-safe; its redaction rule is `internal system names`. No employer, customer or vendor name anywhere in the record.
- Do not write the record after building. If you have already built, say so in the context section and expect the reviewer to test the options section harder.

## Time box

Two working sessions of about ninety minutes each.

- Session one: context, options considered with reasons, decision. Stop when a colleague reading only the options section cannot tell which one you chose.
- Session two: consequences, what would reverse this, the checker run, and the review request. The review itself follows the twenty-minute loop in `15-workflows/peer-review.md`.

If the options section takes longer than the first session, you are probably arguing with yourself about a shape you have already chosen. Write the decision, then go back and make the rejected option honest.

## Submission checklist

- [ ] The five headings are present and in order under the rule in `rubric.md`.
- [ ] Options considered has at least two top-level entries, each a distinct shape, and at least one is rejected with a reason. Sub-bullets of one option are not options.
- [ ] Each rejected option is one a reasonable engineer would have chosen; a colleague could argue for it.
- [ ] Any orchestrator or pipeline option answers the five questions, state-carrying handoff count first.
- [ ] Consequences names at least one cost, the role that can now change behaviour without code review, the untrusted inputs created, and what keeps a switch cheap.
- [ ] What would reverse this names a signal, its source, a condition a stranger could evaluate, and the next shape; and it is not the kill criterion.
- [ ] No shape name appears in the context section.
- [ ] No employer, customer, vendor or internal system name appears anywhere.
- [ ] `node check-adr.mjs <file>` has been run against the committed file and reports both assertions passed, or the two assertions have been applied by hand from `rubric.md` and the result written down in the same shape.
- [ ] `review:architecture-defence` has been requested from someone other than you, using the peer-review ritual.
- [ ] Evidence submitted: a `repo-url` a third party can open without asking you, or an `eval-run` (the checker's output, with the commit it ran against).
