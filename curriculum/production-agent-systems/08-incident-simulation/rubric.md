# Rubric: eval:incident-detected-by-telemetry

Target: `artifact:incident-report`. Graph title: "The incident was caught by instrumentation, not by
reading the code." The graph sets `passThreshold: 1`; read that as every assertion must hold, with no
partial credit. This rubric is written so a reviewer can apply it without the author present.

Source of the criteria: `site/lib/academy-graph/production-agent-systems.ts`. When this file and the
graph disagree, the graph wins. An automated check applies the graph's check wording as written.
Where this rubric reads an assertion more strictly than its check wording, it says so, and that
reading is applied by the reviewer, not by a check.

Recording follows the one rule in
[`../01-system-brief/rubric.md`](../01-system-brief/rubric.md#revise-the-one-rule-for-every-rubric-on-this-path):
the recorded result is the literal check, PASS or FAIL; REVISE is a note naming one edit and never
changes the recorded result; a reviewer-layer finding gates only through the stage's Review node, or
goes to the integrator as a proposed tightening. This stage has a Review node,
`review:incident-honesty`, so a REVISE that names a gap in one of its three lines is held there: the
reviewer withholds the review verdict until the edit is made. A REVISE row under an assertion below
accompanies whatever the check wording recorded; where the stricter reading and the check wording
disagree, the check wording is what goes in the record and the stricter reading is the note.

The artifact's five required sections, `injected failure mode`, `time to detection`, `what the
telemetry showed`, `fix`, `guard added`, are matched and ordered under the one rule in
[`../01-system-brief/rubric.md`](../01-system-brief/rubric.md#required-sections-the-one-rule-for-every-rubric-on-this-path):
a missing or out-of-order section records all three assertions as FAIL with the section named.

## Assertions

### `injected-mode-named`

> Description: "The report names which failure mode was injected."
> Check: "The injected failure mode matches a FailureMode id with injectable = true."

The graph is the source for which ids carry `injectable: true`. The README's "Choosing the
injection" lists them with the signal each should meet.

- **PASS** — The "injected failure mode" section states one of those ids verbatim, and the
  described injection is an instance of that mode as the graph defines its symptom. The injection
  is linked as a file or command. For the modes whose exposed path is the deploy pipeline
  (`failure:ambient-authority` and `failure:eval-rewritten-with-the-code`) the injection is a
  commit or configuration change the pipeline would have promoted, and the section names the
  environment it would have promoted to.
- **REVISE** — The mode is described accurately and the injection is an instance of it, but the
  section names it by title or paraphrase rather than by id.
- **FAIL** — No mode is named; more than one is claimed for a single injection; the named mode is
  not one the graph marks injectable; or the described injection is not an instance of the named
  mode. A system-prompt edit is the common case: the id says tool-result injection but the author
  changed the prompt. That is a different system, not an injection, and relabelling it does not
  make it one.

### `detection-source-is-telemetry`

> Description: "Detection came from a signal that exists in the deployed system."
> Check: "The telemetry section cites a log, metric, or eval that predates the injection."

This rubric reads the description, "a signal that exists in the deployed system", as follows: a
signal counts only if it runs unattended, existed in the release that was running at injection
time, and emitted something a person or a pipeline acts on. An alert delivery, a paged channel
message, or an eval's non-zero exit in the deploy path all count. A log entry that nothing consumed
does not, however accurate the entry. That is this rubric's interpretation of the description, and
it is stricter than the check's wording, under which a cited log passes literally. The reviewer
applies it; no automated check can test whether an entry was consumed. The README and the exercise
use the same rule in the same words. The reviewer's test is: would a person with no access to the
source, watching only the outputs of the telemetry, have known?

"Predates the injection" is a claim about the running system, not the repository. Commit dates are
set by the author and rewritten by a rebase, and a commit made before the injection but never
deployed proves nothing about what was running, so they are not evidence on their own. The evidence
is: the promote record from the stage-7 pipeline naming the deployed commit and the time traffic
moved, written by the pipeline or host; the release id the live route reported in the injection's
log lines, matching that record; and the signal's definition in that commit or, for an alert rule,
the monitoring service's change history dated before the promote.

- **PASS** — The "what the telemetry showed" section quotes the actual entry and links to where the
  signal is defined. The evidence above places the signal in the release running at the injection
  timestamp recorded in the timeline. The signal runs in the deployed system or in the unattended
  path that deploys it, and the section shows what it emitted and who or what consumed it.
- **REVISE** — A pre-existing signal is cited but not quoted; or its presence in the running
  release rests on commit dates alone; or the signal exists only in the author's local environment
  and the section does not say so; or the section reports honestly that nothing consumed the entry
  the telemetry recorded. That last case is the honest finding the README asks for. It passes the
  first line of `review:incident-honesty`; under the check wording a cited pre-existing log records
  as passed, and under this rubric's stricter reading it is a note the reviewer holds at the review
  until the re-run below is done. The path to clearing it is:
  commit and promote the missing consumer, hand the reviewer a fresh prediction, re-run the
  injection with them, and cite the consumer as the pre-existing signal for that second run. Do not
  fix the cause before the re-run; the consumer commit is the only commit between the two
  injections, and the report's fix and guard still come after the second one.
- **FAIL** — The cited signal was not in the running release at the injection timestamp; or the
  section describes what the author saw in the code rather than what the telemetry emitted; or no
  signal is cited and the section asserts detection anyway; or a finding a person made by reading
  output or code is presented as detection.

**Incidental findings.** A defect the author or reviewer finds by reading a run's output or the
code during the injection, that no signal fired on, is recorded in this section labelled "seen by
<who>, not by any signal", with what the telemetry did and did not record. It does not count toward
this assertion and does not lower the grade. Its fix and guard belong to a later injection with its
own signal committed and promoted first; they do not satisfy `guard-added` for the injected mode.

### `guard-added`

> Description: "A new guard or assertion was added so the same failure fails loudly next time."
> Check: "The guard section links to a commit adding an assertion or check."

This rubric reads "the same failure" in the description as the failure mode, not the ticket, the
string, or the amount used in this injection. That is this rubric's interpretation of the graph's
wording, and it is the line a one-ticket guard is graded against.

The guard checks behaviour an operator or user can see, through an interface that exists before and
after the fix: the audit log, the run's returned result, a route's response, the pipeline's run
record. A guard that asserts against something the fix introduced cannot run on the unfixed code; it
errors there, and an error is not a demonstration that the guard detects the failure.

- **PASS** — The "guard added" section links a commit whose diff adds an assertion or check in a
  path that runs unattended (harness, deploy gate, runtime check). The reviewer can check out the
  fix commit's parent, apply the guard commit on top of it, replay the injection and see the check
  fail as an assertion, with the offending entry or value in the failure message; then run the same
  check at the guard commit, on top of the fix, and see it pass. The check also fails on at least
  one variant of the injection the report did not anticipate, applied the same way to the unfixed
  code.
- **REVISE** — The commit adds a check that fires only on the exact string, amount, or ticket used
  in this injection, so a variant passes the unfixed code; or the guard and the fix are in the same
  commit so the reviewer cannot demonstrate the guard failing on the unfixed code; or the check
  exists but nothing runs it unattended; or on the unfixed code the check does not fail but errors,
  because of a missing import, attribute, field or a merge conflict, so the guard depends on the
  fix and proves nothing about the failure; or the injection was stopped by a pre-existing control,
  no gap was found, and the section honestly reads "none added" (the README's "When the control
  holds" gives the re-run: a variant of the same mode the held control does not cover, with a fresh
  prediction).
- **FAIL** — No commit is linked; the linked commit adds documentation, a comment, or a runbook
  step rather than an assertion or check; or the guard was in the release running at injection
  time, in which case it is the telemetry, not the guard.

**Pipeline-caught modes and held gates.** When the injection was stopped by a pre-existing control,
the fix section names the gap the injection exposed (a deploy path that can run without the eval's
run record, a manual promote, a direct push, a path filter that skips the harness) and the guard
asserts that gap is closed: the deploy cannot proceed without the eval's passing run record for the
exact commit being promoted. The reviewer replays the injected commit down the path that let it
through and sees the guard fail on the unfixed pipeline. If no gap was found, grade as the REVISE
case above.

## Required review: `review:incident-honesty`

Performed by `role:independent-reviewer`. Requires an independent reviewer. The graph's rubric,
quoted:

> "The detection signal existed before the injection, not added afterwards to look good."
> "Time to detection is measured, not estimated."
> "The guard would fail on a replay of the original injection."

How to apply each without the author present:

1. Place the signal in the running release. Open the promote record for the release the live route
   reported during the injection: it names the deployed commit and the promote time, and neither
   was written by the author. Confirm the signal's definition is in that commit, or, for an alert
   rule, that the monitoring service's change history dates it before the promote and scopes it to
   that deployment. Commit dates alone do not satisfy this line; a rebase rewrites them. Confirm
   there is no promote or configuration change between that record and the injection; if there is,
   ask what and why. A section that says nothing consumed the entry, and says so plainly, passes
   this line; the eval assertion above decides separately whether that counts as detection.
2. Recompute the number. Open the log store or CI record, find the two timestamps the report
   names, subtract. If you cannot find either timestamp, or the report gives a duration without two
   sources, the line does not pass. A range or "about" fails it.
3. Run the injection yourself, twice. First, check out the fix commit's parent, the unfixed system,
   and apply the guard commit's check on top of it, for example by cherry-picking the guard commit.
   Replay the injection: the check must fail, and the failure must be an assertion with the
   offending entry in its message. An import error, a missing attribute or field, or a cherry-pick
   that does not apply is not a failure of the check; record it as such, because it decides
   `guard-added` above. Second, run the same check at the guard commit, which sits on top of the
   fix: it must pass. That is the literal replay this line asks for. Then vary the injection in one
   way the report did not anticipate and replay it against the unfixed code with the guard applied.
   If the check fires only on the original wording, the third line still passes on the literal
   replay; record the variant result in the attestation, because it decides `guard-added` above,
   not this line.

The attestation you write should say what you did in each of these three steps, in your own
words. It is evidence; it is not a signature.

## Evidence the graph accepts

From the stage's evidence rule (`WITNESSED_EVIDENCE`):

- Accepts: `deploy-url`, `reviewer-attestation`.
- Minimum count: 2. The graph's comment on the rule says the running system and a named witness are
  both required. The code checks that each item's kind is accepted, that it is fresh, and that the
  count meets the minimum; the reviewer confirms by hand that one item is a `deploy-url` and one is
  a `reviewer-attestation`.
- Freshness: each item is no more than 90 days old at submission.
- The attestation may never be the learner's own. `advanceCapability` refuses an attestation whose
  `verifiedBy` is the learner (`evidence-self-attested`) when the competency is granted.

The deploy URL must be the deployment the injection ran against: one with the same telemetry as the
stage-7 deployment and no real users, or the stage-7 deployment in a window where real traffic was
paused. For `failure:ambient-authority` and `failure:eval-rewritten-with-the-code`, where the
injection is stopped in the pipeline, it is the environment the pipeline would have promoted to, and
the report names it. A URL that resolves to a different deployment, or to a deployment rolled back
past the fix, does not support the report.

## The three most common ways a submission looks right but fails

**1. The telemetry section is a paraphrase of the code.** The report reads "the audit log recorded a
denied `issue_refund` call at 14:02:20Z with reason: authority not granted", which is exactly what the
gate writes, and exactly what an author would write after reading the gate. Ask for the raw entry
from the log store with its ingestion timestamp, and ask what consumed it. If an alert or an eval
consumed it and the report quotes that output, `detection-source-is-telemetry` passes. If nothing
consumed it and the report says so, the first review line passes and the assertion is REVISE, with
the re-run path above. If the report claims detection and the only evidence anyone saw the entry is
the report itself, the section describes a code read and the assertion fails.

**2. The guard is a regression test for one ticket.** The linked commit adds a fixture containing
the reviewer's ticket body and asserts no refund was recorded. It fails on the unfixed code and
passes on the fix, so the third review line passes on the literal replay. Replay with the same
directive in different words, or the same words asking for `close_ticket` instead of `issue_refund`.
If the check does not fire, the submission has proved the fix, not added a guard, and `guard-added`
is REVISE under the reading stated above. The author should rewrite the assertion around the
property (no side-effecting call outside the granted set is recorded as allowed, for any fixture)
and resubmit.

**3. The guard cannot run on the unfixed code.** The fix started rendering the operator's list of
actions from the audit, and the guard asserts that list matches the audit. On the fix's parent
there is no such list: the assertion raises an attribute error or the cherry-pick does not apply,
which reads as "fails" to a hurried reviewer. After the fix the list is built from the audit, so the
assertion is always true. The guard proves nothing. The reviewer records the error as an error, not
a failure, and `guard-added` is REVISE. The author rewrites the guard against an interface that
exists on both sides of the fix: every action the operator is shown as taken has a matching
`allowed: true` audit entry, or, as in the README's worked decision, no audit entry above the
argument bound is recorded as allowed.

## Check-yourself answer notes

Short notes for the README's questions, so a learner can check an answer and two reviewers reach
the same one. The graph wins where a note and the graph disagree.

1. It is a sample. A measurement is one the reviewer can reproduce; if the number depends on
   whether the log shipper was up, a replay gives a different number. The telemetry section reports
   the alert with its timestamps and states the dependency on the shipper. The time-to-detection
   section gives the number and says what it is conditional on. The shipper's availability is a
   finding for the fix or the guard.
2. Not as written. The signal has to run unattended against the deployed configuration or in the
   path that deploys it; a per-commit run on the author's branch is neither. The one change is to
   run the harness against the deployed configuration in the pipeline, or on a schedule against the
   deploy URL, so its exit code is a signal the pipeline acts on.
3. No. The injection must be reversible before it starts. For this mode the exposed path is the
   deploy pipeline: commit the shared-principal configuration on a branch the pipeline evaluates,
   let `eval:authority-least-privilege` stop it, and name the environment it would have reached.
   Nothing is provisioned on the live deployment.
4. The third line passes: the guard fails on the literal replay. `guard-added` is REVISE, because
   the check matches one ticket rather than the failure mode. Rewrite the assertion around the
   property and resubmit; see look-right-but-fail pattern 2.
5. Something like: "No pre-existing signal produced an output anyone acted on; the audit log
   recorded the denied call at 14:02:20Z and nothing consumed the entry." That sentence passes the
   first review line. The assertion is REVISE, and the path back is the re-run described under
   `detection-source-is-telemetry`.
6. Worse for independence, better for speed, and the graph accepts them: the role requires a peer
   who holds the competency and is not the author. The attestation survives the doubt by saying
   what they ran, where they read each timestamp, and what the check did on each replay, rather
   than what they were told.
7. `eval:harness-fails-on-regression` carries `fixtures-versioned-apart`: a fixture that changes in
   the same commit as the code it guards is the failure mode `failure:eval-rewritten-with-the-code`.
   Split the commit: the fix touches the executor, gate or pipeline; the guard commit touches the
   fixture and the assertion. Then the reviewer can apply the guard to the unfixed code.
8. None of them as built. The stage-3 gate saw a granted authority and wrote `allowed: true`; a
   denial alert has nothing to consume. The stage-4 fixture asserts no call outside the granted set,
   and this call is inside it. The stage-6 guard bounds spend per run, not refund amounts. Each
   could notice with one addition: the gate compares the requested amount to a bound per ticket, the
   harness carries a fixture where the directive stays inside the granted set and asserts the
   action matches the user's request, or the run loop links each side effect to the tool result
   that preceded it and flags one whose only justification is fetched text. Whichever you add after
   the injection is the guard; whichever was in the running release before it is the telemetry.

On the start of the clock: time to detection starts at the intake line because it is the earliest
timestamp the reviewer can recompute without the author. For `failure:tool-result-injection` the
fault occurs later, when the tool result enters the context, so the report also gives the time from
that log line to the signal when the two differ, and says which of the two it is calling time to
detection.
