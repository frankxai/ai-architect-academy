# Rubric: eval:adr-has-rejected-options

Target: `artifact:architecture-decision`. Source of truth: `site/lib/academy-graph/production-agent-systems.ts`. The eval's title in the graph is "The ADR rejects something specific". Pass threshold is 1: every assertion must pass.

Apply this rubric with the author absent. If a verdict depends on asking the author what they meant, the verdict is REVISE at best.

## How the eval is run

`check-adr.mjs` in this directory applies both assertions as the graph states them and prints the result in the shape `site/lib/academy-graph/advance.ts` records: `passedAssertions` and `failedAssertions` under the eval id. Run it against the committed file:

```
node check-adr.mjs path/to/adr.md
```

`node --test check-adr.test.mjs` runs the checker against the records in `fixtures/` and against the worked decision in `README.md`, so you can see what it passes and what it fails before you trust it on yours.

The script checks shape. It cannot see whether an option is a straw man or a condition is observable, so the REVISE verdicts below are applied by a person. Where no script run is available, apply the two assertions by hand using the PASS and FAIL lines below, and write down the same record: eval id, artifact id, when, which assertion ids passed, which failed.

**The person's reading wins.** The graph's check is "count entries under options considered; require >= 2 and a stated rejection reason". The script is a finite approximation of that: it knows four entry markers and a short list of rejection verbs. If the script reports fewer than two entries or no rejection, and you, reading the section, find two distinct options and one rejected with a reason, record PASS by hand and tell the author which formatting the script did not recognise. If the script reports PASS and you find one option or no reason, your reading wins the other way too.

## Recording the result

Recording follows the one rule in [`../01-system-brief/rubric.md`](../01-system-brief/rubric.md#revise-the-one-rule-for-every-rubric-on-this-path): the recorded result is the literal check, PASS or FAIL; REVISE is a note naming one edit and never changes the recorded result; a reviewer-layer finding gates only through the stage's Review node, or goes to the integrator as a proposed tightening. Applied here:

- **PASS** on an assertion: the assertion id goes in `passedAssertions`.
- **REVISE** on an assertion: the mechanical check passed, so the assertion id goes in `passedAssertions` and the note goes to the author and to `review:architecture-defence`, naming the rubric line it points at.
- **FAIL** on an assertion: the assertion id goes in `failedAssertions`, and the eval does not pass.

The consequence, stated plainly: a record with a straw-man option or a vague reversal condition passes this eval. It is caught by the review, which reads for exactly those two things. The REVISE lines exist so the author fixes them before a reviewer's time is spent, not because the eval catches them.

REVISE lines come in two kinds, and the note to the author says which. **Fails review line N** means the record will fail `review:architecture-defence` on that line as written; the graph backs it. **Module requirement, advisory** means `exercise.md` asks for it and the reviewer will probably ask about it, but no graph rule blocks the record without it.

## Required sections

The artifact declares five `requiredSections`: `context`, `options considered`, `decision`, `consequences`, `what would reverse this`. Matching, order and the consequence of a missing section follow the one rule in [`../01-system-brief/rubric.md`](../01-system-brief/rubric.md#required-sections-the-one-rule-for-every-rubric-on-this-path): normalised equality, any heading level, the graph's order, and a missing or out-of-order section records both assertions as FAIL. `check-adr.mjs` applies exactly that rule and records the FAIL itself. A bold label at the start of a paragraph (`**Context.**`) is not a heading.

## What counts as an entry

An entry under options considered is a **top-level item**: the shallowest list or heading level inside the section. Concretely:

- If the section has sub-headings, each sub-heading at the shallowest level is an entry.
- Otherwise, each numbered item, bullet or bold-labelled paragraph (`**Orchestrator with workers.** ...`) at the shallowest indentation is an entry, and the kind that appears first sets the list.
- Anything indented deeper belongs to the entry above it. Sub-bullets of one option are that option's pros, cons and reasons, not further options. One numbered option with three sub-bullets is one entry.

Two entries have to be two distinct options. Two layouts of one shape ("orchestrator with three workers" and "orchestrator with four") are one option written twice; see REVISE below.

## Assertion `two-options-minimum`

Description, quoted from the graph: "At least two options were considered and one was rejected with a reason."

Check, quoted from the graph: "Count entries under options considered; require >= 2 and a stated rejection reason."

**PASS.** The options considered section has two or more top-level entries under the rule above. At least one entry is explicitly rejected and a reason follows the rejection in the same entry. The checker recognises these forms: rejected, rejecting, not chosen, not selected, ruled out, discarded, declined, set aside, dropped, and "chose X over Y". It ignores a verb preceded by "not" or "never" ("was not rejected" is not a rejection). It requires at least 8 words after the verb; a person requires that the words say why, with reference to the context section.

**REVISE, fails review line 1** (recorded as passed). Two or more entries exist and one is rejected with a reason, but: the reason is generic ("more complex", "overkill", "not needed") and references nothing in the context section; or the entries are variants of one shape rather than different shapes; or the rejected entry is one no reasonable engineer would have proposed. Send it back before the review is requested.

**REVISE, module requirement, advisory.** The options are written in a form the checker does not recognise (a table, prose paragraphs without a bold label, a verb outside its list) but a person finds two distinct options and a stated reason. Record PASS by hand and note the formatting. Or an orchestrator or pipeline option omits its answers to the five questions, or the state-carrying handoff count. Or an option composes two shapes and does not name the dominant one.

**FAIL.** Fewer than two distinct options; sub-bullets of one option are not options. Or no entry is rejected. Or an entry is rejected with nothing after the verb, or with a placeholder. Or the options section is empty and the decision section lists alternatives inline instead.

## Assertion `reversal-condition`

Description, quoted from the graph: "The record states what evidence would reverse the decision."

Check, quoted from the graph: "A non-empty \"what would reverse this\" section exists."

**PASS.** The section exists under that heading and contains text that is not a placeholder (TODO, TBD, an ellipsis, a lone dash).

**REVISE, fails review line 3** (recorded as passed). The section is non-empty but the condition needs the author to interpret it: "if quality drops", "if users are unhappy", "if it becomes too expensive" with no line or ceiling named. Or the signal is named but its source is not, so nobody knows where to look. Send it back first.

**REVISE, module requirement, advisory.** The condition is observable but names no shape to move to, or names the most elaborate shape when a nearer notch would answer the signal. Or the condition is the brief's kill criterion word for word, so it fires only when the project is already stopped. A reviewer can still evaluate these conditions without the author, so review line 3 does not fail on them; the module asks for them because a condition with no destination is a complaint, not a decision.

**FAIL.** The heading is missing or out of order, or the section is empty, or it contains only a placeholder.

## Where each exercise constraint is checked

`exercise.md` asks for more than the graph enforces. This table says where each constraint is caught, so a reviewer knows what blocks the record and what does not.

| Constraint from `exercise.md` | Checked by | Blocks the record? |
|---|---|---|
| Five headings, in order | `check-adr.mjs`; the one rule linked under "Required sections" | Yes: FAIL on both assertions |
| At least two options, one rejected with a reason | `check-adr.mjs`; assertion `two-options-minimum` | Yes: FAIL |
| Rejected option is one a reasonable engineer would pick | review line 1 | Yes, at the review |
| Rejection reason references the brief | review line 1 | Yes, at the review |
| Orchestrator or pipeline option answers the five questions, handoff count first | nobody mechanical; advisory REVISE | No |
| Dominant shape named where two compose | nobody mechanical; advisory REVISE | No |
| Consequences names a cost, not only benefits | review line 2 | Yes, at the review |
| All four currencies covered | nobody mechanical; module requirement | No |
| Untrusted inputs named in consequences | stage 5, `eval:threat-model-covers-tool-results`, when the list is carried forward | Not at this stage |
| What keeps a switch cheap | nobody mechanical; module requirement | No |
| Reversal section non-empty | `check-adr.mjs`; assertion `reversal-condition` | Yes: FAIL |
| Reversal condition observable without the author | review line 3 | Yes, at the review |
| Reversal names the next shape; is not the kill criterion | nobody mechanical; advisory REVISE | No |
| No shape name in the context section | nobody mechanical; module requirement | No |
| No employer, customer, vendor or internal system name | the artifact's `redactionRule` (`internal system names`) at publication; a person before that | Yes, at publication |

"No" in the last column means a reviewer should raise it and may refuse to sign until it is fixed, but no graph rule records a failure for it.

## Evidence the stage accepts

The stage's evidence rule in the graph is the flagship default: `accepts: ['repo-url', 'eval-run']`, `minimumCount: 1`, `maxAgeDays: 365`.

- `repo-url`: a commit or file a third party can open without asking the learner. A link to a private repository the reviewer cannot open does not count.
- `eval-run`: a recorded, reproducible execution of `eval:adr-has-rejected-options` against the committed file. The checker's JSON output, committed next to the record or pasted into the review request with the commit it ran against, is that record. A hand application written in the same shape counts when it names the commit.
- One locator is enough. Evidence older than 365 days is stale and does not count.
- `reviewer-attestation` is not on this stage's accepted list, so a reviewer's sign-off is recorded through the review, not as evidence. The grant path in `site/lib/academy-graph/advance.ts` refuses self-attested evidence and refuses a review where the reviewer is the author (`review-not-independent`).

## The companion review

The stage also requires `review:architecture-defence` by `role:independent-reviewer`. Its rubric, quoted from the graph:

1. "The rejected option is one a reasonable engineer would have chosen."
2. "The consequences section names a cost the author is accepting, not only benefits."
3. "The reversal condition is observable without asking the author."

This file grades the eval. The review is a separate verdict by a separate person, and the stage completes only when both pass. Every graph-backed REVISE above names the review line it prepares for; fix it before requesting the review.

## Two ways a submission looks right but fails

**The count is right and the alternative is fake.** Five headings, two options, one rejected, a reason attached. The eval passes and is recorded as passed. But the rejected option is one nobody on the team would have proposed, so the rejection reason is easy and teaches nothing. The reviewer applies the first rubric line and fails it. The check to run before submitting: cover the decision section and hand the options to a colleague. If they cannot make a case for the rejected option in two sentences, replace it with the shape one notch simpler or one notch more elaborate than the choice and reject that one honestly.

**The reversal section is non-empty and unobservable.** "What would reverse this" contains a paragraph, so the mechanical check passes. But it says the decision would be revisited if the system "stops meeting expectations" or "proves too costly", with no metric, no source and no threshold. Only the author can say whether it has fired. The reviewer applies the third rubric line and fails it. The check to run before submitting: name the dashboard, log or cost report a stranger would open, the number or event they would look for, and the shape you would move to. If you cannot name the source, the signal does not exist yet, and the record should say which stage will create it.
