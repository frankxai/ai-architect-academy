# Rubric: `eval:system-brief-complete`

Title in the graph: "The brief names a job and a way to be wrong." Target: `artifact:system-brief`. Pass threshold: 1, which in this graph means every assertion must pass; there is no partial credit.

This rubric restates the eval so a reviewer can apply it by hand without the author present. Nothing in the repository runs these checks. The graph file `site/lib/academy-graph/production-agent-systems.ts` declares the two assertions as text; `advance.ts` reads only a recorded run, which is a list of which assertion ids passed and which failed, and when. A reviewer produces that record by reading the brief against the check text below. The eval is the authority; where this rubric and the graph differ, the graph wins.

The rubric has two layers with separate outcomes:

1. **Recorded result.** The graph's check text, read literally. This is the only thing that goes into the run record, and two reviewers reading the same file must record the same result without asking the author anything.
2. **Reviewer notes.** Everything a good reviewer would say beyond the literal check. Notes do not change the recorded result. Where a note ought to gate, the fix is to tighten the check text in the graph, which the integrator owns; this rubric proposes those tightenings at the end rather than enforcing them in prose.

## REVISE: the one rule for every rubric on this path

The graph records two things per assertion, pass or fail, and `advance.ts` reads nothing else. Every rubric on this path records the same way, and the other eight link here instead of restating it.

- The **recorded result** of an assertion is its check text read literally: PASS or FAIL. Two reviewers reading the same file record the same result without asking the author anything.
- **REVISE** is a reviewer's note. It is never a third recorded result and never changes the recorded one. It names the one concrete edit that would change what the reviewer found. Written against a failed assertion, it accompanies a FAIL, and the recorded result stays FAIL until the file is resubmitted and re-read. Written on a reviewer layer (notes, hardening, module bar, stage bar) against a passing assertion, it accompanies a PASS, and the recorded result stays PASS.
- A reviewer-layer finding gates nothing on its own. Where the stage has a Review node, the reviewer withholds the review verdict until the note is cleared. Where it has none, the note goes to the author and, if it ought to gate, to the integrator as a proposed tightening of the graph's check text. No rubric withholds, delays or fails a run record on a finding the check text does not state.

## Required sections: the one rule for every rubric on this path

`requiredSections` on the artifact node names the sections; the eval's assertions read inside them. The other eight rubrics link here instead of restating it.

- **Matching.** For a markdown artifact, a heading matches an entry when its text, lowercased, with markdown emphasis characters removed, surrounding whitespace and trailing punctuation stripped and runs of whitespace collapsed, equals the entry. Any heading level. Extra headings are allowed before, between and inside the required ones; a sub-heading inside a required section belongs to that section. A bold label at the start of a paragraph is not a heading. For a JSON artifact, an entry is a top-level key matched exactly, holding the JSON type the module names. This is the normalisation `check-adr.mjs` and `check-threat-model.mjs` apply.
- **Order.** The sections appear in the graph's order. A required section present but out of order is treated as missing.
- **Missing.** A missing required section records every assertion of the eval as FAIL, with the section named in the failure detail. That is the whole consequence: no run is withheld and nothing is "returned" instead of recorded, because a FAIL is the only thing the graph can record and the only thing `advance.ts` reads. Where a checker refuses to score (exit 2) on a missing heading, the reviewer writes the record by hand in the same shape with every assertion failed.
- A section's content is read only under its heading. Text under any other heading does not count for an assertion scoped to that section.

## Preconditions the artifact must meet before the assertions are read

These come from `artifact:system-brief`, not from the eval.

**Required sections.** The artifact declares `requiredSections: ['user and job', 'in scope', 'explicitly out of scope', 'success measure', 'kill criterion']`, matched and ordered under the rule above. Both check texts are scoped to a section, so the reviewer finds sections by heading. A brief that uses different words for a heading ("Non-goals", "Boundaries", "Stop condition") may be right in spirit, but read literally there is no out-of-scope section or no kill-criterion section; both assertions are recorded as fail with a one-line REVISE note naming the heading. "Out of scope" without "explicitly" does not match; "### Explicitly out of scope" does. A list item is a top-level line under that heading, before the next heading of the same or higher level, starting with `-`, `*` or a number followed by a period. Nested items belong to their parent and are not counted; a paragraph is not a list item.

**Redaction.** The artifact declares `redactionRule: ['employer name', 'customer name']`. Those are category labels. The eval at this stage does not scan for names. At stage 9, `eval:portfolio-links-resolve`'s literal check scans the rendered portfolio for those category labels; the stage 9 rubric has a reviewer expand them into the concrete names and scan for those, so do not rely on either and redact now. If you see a real employer, customer or colleague name, say so, and ask the author whether they searched the file against a private deny-list before committing.

## Assertion `has-out-of-scope`

Description, quoted from the graph: "An explicit out-of-scope section exists and is not empty."

Check, quoted from the graph: "Parse headings; the out-of-scope section has at least two bullets."

### Recorded result

| Result | What the reviewer sees |
|---|---|
| **PASS** | A heading matching "explicitly out of scope". Under it, two or more list items. |
| **FAIL** | No such heading, or the required sections are missing or out of order under the rule above; or fewer than two list items under it. A paragraph with no list items is zero bullets however many refusals it contains. One bullet is one. |

Read literally, `- edge cases` followed by `- complex requests` passes. So does `- refunds` with no action, and so does `- anything not listed above` as the second item. Record pass and write the note.

### Reviewer notes

- Each bullet names a request a user could actually make, not a category. "Refund requests" is a request; "edge cases" is not.
- Each bullet says what the system does: refuses, or hands off, and to whom. A bullet with no action ("refunds") leaves stage 3 unable to say whether the tool is absent or present and gated.
- A reviewer could turn any bullet into a stage 4 fixture without asking the author what it means.
- "Anything not listed above" and "everything else" are not bullets in any useful sense; say so, and say what stage 3 does with them (nothing).
- Bullets that restate the in-scope list as negations ("does not do things outside its scope") name no request.

## Assertion `has-kill-criterion`

Description, quoted from the graph: "A condition is stated under which the project would be stopped."

Check, quoted from the graph: "The kill-criterion section contains a measurable threshold or date."

### Recorded result

| Result | What the reviewer sees |
|---|---|
| **PASS** | A heading matching "kill criterion". Under it, a number, or a date. A date is a calendar date, or a day count from a named, dated event: "day 60 after launch", "every Monday from day 30 of live traffic" and the lesson's worked brief ("from day 60, the thresholds apply to whatever the window holds") all count. |
| **FAIL** | No such heading, or the required sections are missing or out of order under the rule above; or a section with no number and no date. "If users do not like it", "if it is not working", "if the team decides to stop", "reviewed quarterly", "at the next review", and "see above" all fail: none contains a threshold or a date under this heading. "Quarterly" is a cadence with no start, not a date. |

Read literally, a number with a window but no minimum sample passes. A threshold equal to the success target passes. A date with no stated consequence passes. A number the system cannot produce about itself ("if the survey score drops below 3") passes, because it is a measurable threshold, just not one the telemetry measures. "Under 40%" with no measure named passes: it is a number under the heading. Record pass and write the note.

### Reviewer notes

- A rate threshold needs a window, a minimum sample, and a backstop date on which the query runs on whatever sample exists. A window without a minimum sample can fire on the first bad afternoon; a minimum sample without a backstop can wait forever. This note applies to rate thresholds only.
- A tripwire, one occurrence of a named event, needs neither window nor sample; the first occurrence is the incident. Where the brief has an in-scope action that cannot be undone, ask why there is no tripwire.
- The threshold sits on the failing side of the success target, with a gap. Equal is a design fault: there is no zone in which the system is short of target and worth fixing. For a lower-is-better measure the kill threshold is above the target.
- The measure is one the system's own telemetry produces. A survey, a stakeholder's mood, or a quarterly review cannot be read by the stage 4 harness or the stage 8 incident report.
- The consequence is named: what "stops" does to the system and to the queue.
- The owner or trigger is named: the role that runs the query and on what cadence, or the scheduled job that runs it and where the result goes. The check keeps running after its first evaluation; a query scheduled once is a gate, not a criterion.
- Who can restart a stopped project is named, and it is not the role that wanted the feature acting alone.
- A number without a measure ("under 40%" of what) records pass; note the missing measure. A measure without a number ("if the reopen rate is too high") records fail, and the REVISE note names the missing number.

## Evidence the graph accepts

The stage's evidence rule is `STANDARD_EVIDENCE`:

- `accepts: ['repo-url', 'eval-run']`
- `minimumCount: 1`
- `maxAgeDays: 365`

The evidence rule is one of two requirements `advance.ts` applies to this stage before `competency:ship-a-production-agent-system` can be granted. They are checked separately and both must hold.

**(a) Evidence.** At least one usable evidence record for `artifact:system-brief`, of kind `repo-url` or `eval-run`, whose `verifiedAt` is within 365 days of the check date. A `repo-url` is a link to the committed brief that a third party can open without credentials; it is the evidence a learner can produce alone. An `eval-run` as an evidence kind is a locator for a run record, held to the same freshness rule. Freshness is measured from `verifiedAt`, not from the commit: a brief that sat for a year needs its URL re-verified, and a fresh commit on its own does not reset the clock.

**(b) A recorded run.** `learner.evalRuns` must hold a run of `eval:system-brief-complete` whose latest entry lists both assertion ids, `has-out-of-scope` and `has-kill-criterion`, as passed; the pass threshold is 1, so one failed assertion refuses with `eval-below-threshold`, and no run at all refuses with `eval-never-run`. This run record is separate from the evidence record in (a): a learner who commits the brief and submits only the URL has satisfied (a) and cannot complete the stage. The repository has no automated runner, so the record is a reviewer's hand-applied result, produced by reading the brief against this rubric; the reviewer keeps the brief's commit hash next to it so the record can be checked. `advance.ts` does not age-check runs; it reads the latest one.

A screenshot of the brief is not evidence. A brief pasted into a form is not evidence. A private repository is not evidence unless the reviewer can open it. A learner's own statement that the checks pass is not a run record.

## The two most common ways a submission looks right and records fail

**1. The out-of-scope list is real, and read literally it has no bullets.** The author knows exactly what the system refuses and wrote it as a paragraph: "The assistant never touches payments, and product questions are sent to the support person." Two refusals, clearly stated, zero list items. Or the same content sits under a heading called "Boundaries". The reviewer reads a good brief; the check text reads "at least two bullets" under "the out-of-scope section"; `has-out-of-scope` records fail. The fix is mechanical and takes a minute, which is why it is the most common REVISE at this stage.

**2. The number is in the brief, and it is under the wrong heading.** The success-measure section states the target, the window and the sample, and then the kill-criterion section says "if the success measure is not met, the project stops" or "see above". The author has done the thinking. The kill-criterion section, read alone, contains no threshold and no date, and the check text is scoped to that section. `has-kill-criterion` records fail. The fix is to repeat the number under the kill-criterion heading, and while doing so the author usually notices that the kill threshold and the success target should not be the same number, which is the fault the eval was designed to surface.

## Proposed tightenings, for the integrator

The gap between the recorded result and the reviewer notes is the gap between the graph's check text and what a senior reviewer would gate on. If any of these should gate, the change belongs in the graph's `check` string, not here:

- `has-out-of-scope`: "at least two bullets, each naming a request and an action (refuses, or hands off to a named role)".
- `has-kill-criterion`: "a rate threshold with window, minimum sample and backstop date, or a tripwire, or a date; a named consequence; a named owner or trigger".

Until the graph changes, record the literal result and write the notes.
