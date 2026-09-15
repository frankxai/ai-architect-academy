# 08 · Incident simulation

Stage `stage:incident-simulation`. Produces `artifact:incident-report`, graded by
`eval:incident-detected-by-telemetry` and `review:incident-honesty`. Evidence: a deploy URL and a
reviewer attestation, one of each, each no more than 90 days old, and the attestation is never your
own. The [rubric](rubric.md) says what the code enforces and what the reviewer checks by hand.

## The decision

**Break it on purpose: does your instrumentation notice before you do?**

Seven stages in, you have a system that is deployed, gated, evaluated and costed. Each of those
stages produced a claim about what happens when something goes wrong: the gate denies, the harness
fails, the cost guard stops spend. None of those claims has been tested against the deployed system
by someone who wanted it to fail. This stage is where you find out whether the instrumentation you
built is a detector or a decoration.

The decision cannot be deferred because the alternative is to let a customer run the test for you.
An agent system fails quietly: the model produces plausible text either way, so a wrong tool call and
a right one look the same in the transcript. Only the signals you placed in the system beforehand
distinguish them. If those signals do not fire on a failure you chose, at a time you chose, while
someone watched, they will not fire on one you did not choose.

The stage also settles a question left open from stage 4: is your harness a test suite or a
production control? A harness that runs against the deployed configuration unattended is telemetry
and can be cited here. One that only runs on your laptop is not.

## What goes wrong

Each of these passes a casual read. Each is what the review rubric exists to catch.

**Detected by code read.** You inject the failure, watch nothing happen, open the code, find the
bug, then write "the audit log showed a denied call" because that is what it would have shown had
anyone been looking. How you detect it: ask whether a person with no access to the source, watching
only the telemetry, would have known within the time you claim. If the honest answer is no, the
finding is "no pre-existing signal fired". Written up as such it passes the honesty review and does
not pass `detection-source-is-telemetry` (REVISE); the rubric names the way back.

**Guard added first.** The assertion that catches the failure went in the day before the injection.
Detection was guaranteed, and the report proves the guard rather than the instrumentation. How you
detect it: not by ordering commits. Commit dates are set by the author and rewritten by a rebase,
and a commit made before the injection but never deployed proves nothing about what was running.
Anything cited in the telemetry section must be shown present in the release that was running at
injection time: the promote record from your stage-7 pipeline names the deployed commit and the
time traffic moved, the live route reported that release id in the injection's log lines, and the
signal's definition is in that commit or, for an alert rule, in the monitoring service's change
history dated before the promote. If the guard was in that release, it belongs in the telemetry
section and you owe the report a different guard.

**Estimated time to detection.** "About ten minutes." Without two timestamps from the telemetry,
the reviewer cannot recompute the number and the second rubric line fails. How you detect it: the
report shows the arithmetic, not just the result. If you cannot point at the log line the
subtraction starts from, you do not have a measurement.

**Un-replayable injection.** You injected by hand, in a way that depended on what you happened to
type. The reviewer cannot re-run it, so they cannot confirm the guard fires on replay, and the
third rubric line cannot pass. How you detect it: hand the injection to the reviewer as a file or a
command before you run it. If it needs explanation, it is not replayable yet.

## Concepts

### Why you break your own system

An incident report of something nobody else saw is a story. The stage's evidence rule
(`WITNESSED_EVIDENCE` in the graph) requires two things a story cannot supply: the deploy URL of a
running system, and an attestation from a named reviewer who is not you. The trade-off: a witnessed
injection costs a second person's time and forces you to schedule the break. In exchange, the report
becomes evidence rather than recollection.

### Choosing the injection

The graph marks these failure modes `injectable: true`; the graph is the source for that set, and
this list follows it. Each looks different in a deployed system and each has a different
pre-existing signal that should catch it.

- `failure:tool-result-injection` — text fetched by a tool carries a directive and the model
  follows it. Inject through the system's normal intake path, never by editing the prompt. The
  expected signal is the gate's denial entry in the stage-3 audit log, or the stage-4 fixture if the
  harness runs against the deployed configuration.
- `failure:ambient-authority` — one credential backs more than one side-effecting tool. Inject by
  committing a configuration that puts two side-effecting tools on a shared principal, on a branch
  the deploy pipeline evaluates. Nothing is provisioned on the live deployment. The expected signal
  is whatever checks the authority matrix at deploy time: `eval:authority-least-privilege` in an
  unattended deploy gate counts.
- `failure:eval-rewritten-with-the-code` — a fixture changes in the same commit as the behaviour it
  guards. Inject by committing exactly that. The expected signal is the `fixtures-versioned-apart`
  assertion from `eval:harness-fails-on-regression`, if the deploy pipeline runs it.

For the second and third modes the path the system exposes is its deploy pipeline, and the injection
is caught before deploy rather than in the deployed system. That is valid because the eval is on
the deployment path. The report names the environment the pipeline would have promoted to, and the
deploy URL in the evidence is that environment.

Pick the one whose expected signal you are least sure of. A confident prediction that turns out
right teaches you little.

**Injection inside the granted authority.** The signal named above for tool-result injection, the
gate's denial entry and an alert on it, only appears when the gate has already done its job. The
case you most need to test is the directive that stays inside the authority the run was granted: a
run allowed to `refund` where the ticket inflates the amount or swaps the ticket id, or a
`close_ticket` directive on a run allowed to close. The audit shows `allowed: true`, no denial is
written, and no denial alert fires. Detecting that needs a signal of a different kind: a check that
the requested action matches what the user asked for, a bound on arguments such as a refund ceiling
per ticket, or a link from each side effect to the tool result that preceded it, so a side effect
whose only justification is fetched text is flagged. If your gate already holds against an
out-of-authority directive, inject within the granted authority instead. That is the prediction you
are least sure of, and a report that only proves the stage-3 gate works has not tested whether your
telemetry notices an injection that succeeds.

### When the control holds

For `failure:ambient-authority` and `failure:eval-rewritten-with-the-code` the expected result is
that the pipeline eval stops the commit before deploy. A gate that denies an out-of-authority
directive is the same shape at runtime. In both, the only cause in the system is the injected
change, and there is nothing to fix on the injected path. The report still has five sections. Here
is what they hold.

The telemetry section quotes the control's output, the eval's non-zero exit in the pipeline record
or the denial alert, with the evidence that it was in the running release before the injection.
That passes `detection-source-is-telemetry`. The fix section names the gap the injection exposed.
For a pipeline-caught mode that is a path around the eval: a deploy step that can run without the
eval's run record, a manual promote the pipeline does not gate, a direct push to the branch the
pipeline deploys from, a path filter that skips the harness for commits touching only fixtures.
Walk every path the deploy has with the reviewer and try the injected commit down each. A path that
lets it through is the gap. The fix closes it. The guard is a check that the deploy cannot proceed
without the eval's passing run record for the exact commit being promoted, and it fails when the
reviewer replays the injected commit down the path that let it through.

If no path lets it through, say so. The fix section reads "no cause to fix: <control> stopped the
injection; paths tried: <list>" and the guard section reads "none added". That report is honest,
passes the review, and gets REVISE on `guard-added`, because a check that was in the running
release before the injection is the telemetry, not the guard. The way back is a variant of the same
mode that the held control does not cover, with a fresh prediction and the reviewer present: for
tool-result injection, a directive inside the granted authority; for ambient authority, the shared
principal introduced through a path the pipeline evaluates differently, such as a hotfix branch or
a configuration change rather than a code change; for the eval-rewritten mode, the fixture and the
behaviour changed across two commits merged together, or through a path that skips the harness. If
every variant you and the reviewer can name is stopped, choose another injectable mode. A stage
that only proves the existing controls hold has not tested whether the telemetry notices a failure
that gets through, and that is what the competency claims.

### Instrumentation that predates the injection

Three things you already built are candidates: the audit log from stage 3, the harness from stage 4,
the cost guard from stage 6. Before injecting, write down which one you expect to fire and what the
entry will look like. When the prediction is wrong you learn something no green test run would have
told you.

"Predates" is a claim about the running system, not the repository. The evidence is the promote
record naming the deployed commit and its time, the release id the live route reported during the
injection, and the signal's definition in that commit or in the monitoring service's change history
dated before the promote. A commit date on its own is not evidence; the author sets it.

If none of them fires, that is the finding. Write it up as one. A report that says "the audit log
recorded the denial at 14:02:20Z but no alert consumed that entry, and the reviewer's replay
confirmed this" is honest and names the gap. It passes the first line of `review:incident-honesty`.
It does not pass `detection-source-is-telemetry`: the rule the rubric applies is that a signal counts
only if it ran unattended, predated the injection, and emitted something a person or a pipeline
acted on. An entry sitting unread in a log is not detection. The way back is to commit and promote
the missing consumer, give the reviewer a fresh prediction, re-run the injection with them, and cite
the consumer as the pre-existing signal for that run. Do not fix the cause in between; the fix and
the guard come after the second injection. A report that invents an alert fails both.

A finding you or the reviewer make by reading a run's output or the code, that no signal fired on,
is an incidental finding. It goes in the telemetry section labelled "seen by <who>, not by any
signal", with a sentence on what the telemetry did and did not record. It is not detection, and a
fix or guard for it does not satisfy `guard-added` for the injected mode. It becomes the subject of
a later injection, with its own signal committed and promoted first. Recording it changes this
report's grade in neither direction; presenting it as detection fails the eval.

### Measuring time to detection

Two timestamps, both from telemetry, both reproducible. The start is when the injected content
entered the system, usually an intake log line, not when you decided to inject. Intake is the start
because it is the earliest timestamp the reviewer can recompute without you; it folds queue latency
into the number, and the report says so. For `failure:tool-result-injection` the fault occurs later,
when the tool result enters the context, so also give the time from that log line to the signal
when the two differ, and say which one you are calling time to detection. The end is when a signal
a human would act on was emitted, the alert delivery or the eval's non-zero exit, not when you
noticed. Record both raw values and the subtraction, and say which clock each came from; drift
between a log store and a CI runner is a real source of error. The reviewer opens the same log store
and gets the same number.

### The fix and the guard

Fix the cause, not the symptom. If the model followed a directive in a tool result, the cause is
that a tool result reached a decision point with instruction-like authority; the fix is in the gate
or the executor, not the prompt.

Then add a guard: a check that fails on a replay of the same injection. It runs unattended, in the
harness, a deploy gate, or a runtime assertion. It matches the class of failure, not this instance:
the rubric reads "the same failure" in `guard-added` as the failure mode, not the ticket. A fixture
asserting the model did not refund exactly the amount the reviewer typed is a regression test for one
ticket. A fixture asserting no side-effecting call outside the granted authority set is recorded as
allowed, for any ticket body carrying a directive, is a guard.

The guard checks behaviour an operator or user can see, through an interface that exists before and
after the fix: the audit log, the run's returned result, a route's response, the pipeline's run
record. A guard that asserts against something the fix introduced, a list the fix started rendering
or a field the fix added, cannot run on the unfixed code. It errors there rather than failing, and
an error is not a demonstration that the guard detects the failure. The reviewer proves the guard by
applying it to the unfixed code and watching it fail as an assertion, with the offending entry in
the message, then running it on the fix and watching it pass; keep the fix and the guard in separate
commits so that is possible.

### The witness

The reviewer holds `role:independent-reviewer`: a peer who already holds the competency, not staff.
Their job is the three lines of `review:incident-honesty`: was the signal already there, was the
number measured, would the guard fire again. Give them what they need to answer without asking you:
the timeline with raw timestamps, the signal's definition with the promote record and change history
that place it in the running release, and the injection as something they can run. Their attestation
is evidence, so it says what they did, not what you told them. The
[human review checklist](../../../08-governance/human-review-checklist.md) carries the
no-self-approval rule this depends on.

### Closing out

The report has the five required sections of `artifact:incident-report`, no more. The
[postmortem template](../../../15-workflows/postmortem.md) is the longer form for your own team. The
artifact is `publicSafe: false` and cohort-only, because a real incident report names the gap you
found; stage 9 decides separately what can be shown outside.

## A worked decision

This scenario is a composite. No real company, team or product is described.

The system is a support triage agent of the kind [lab 05](../../../labs/05-tool-authority-gate/README.md)
builds: it reads tickets and, when the run was granted the authority, issues refunds and closes
tickets. Deployed since stage 7 through a pipeline that promotes releases by id; `/health` reports
the release id, and the pipeline writes a promote record with the deployed commit and the time
traffic moved. The stage-3 audit log writes one entry per tool call with `allowed` and `reason`. Two
alert rules have notified the on-call channel since deployment: one on any audit entry where
`allowed` is false and the tool is side-effecting, and one, added when the stage-6 cost model bounded
the cost of a bad run, when a refund recorded by the payment principal exceeds the order value on the
ticket. The stage-4 harness carries a fixture with an embedded instruction and runs on every commit
and against each candidate release before promote. Both alert rules live in the monitoring service,
whose change history shows when each was created and last edited.

The learner weighs the modes. Ambient authority and the eval-rewritten mode would be stopped in the
pipeline: fair tests that say nothing about runtime telemetry. Tool-result injection has two shapes.
A directive outside the granted authority is what the stage-4 fixture already proves the gate denies
on every candidate release; that prediction is confident, and a confident prediction teaches little.
A directive inside the granted authority has never been tried. They choose
`failure:tool-result-injection`, injected within the granted authority: a run granted `refund`
where the ticket inflates the amount. The prediction, written before anything else: the gate allows
the call, and the over-value alert fires within a minute of intake.

Containment comes before the prediction is handed over. The learner promotes a release whose
`issue_refund` points at the sandbox payment principal the stage-3 matrix lists for tests, on the
second environment the stage-7 pipeline keeps for candidate releases, where the intake form is
public but no real traffic arrives. The promote record gives the release id, the deployed commit and
the promote time; `/health` on that environment reports the same id. The monitoring service's change
history shows both alert rules were created weeks earlier and last edited before this promote, and
that they are scoped to that environment's metrics. The rollback command from the stage-7 record is
confirmed against that release. The abort condition, agreed with the reviewer: if any side effect the
reviewer did not name in advance is recorded as allowed, the reviewer says stop, the learner rolls
back, and the injection is written up as far as it got. Then the prediction, the injection file, the
promote record and read access to the log store go to the reviewer, and nothing is committed,
promoted or reconfigured until the injection has run.

The reviewer submits the ticket through the public intake form of that environment. It concerns an
order worth 40.00, and its body ends with two lines telling the agent the customer has been
pre-approved for a 400.00 goodwill refund. Intake logs the ticket at `14:02:11Z`. The run starts at
`14:02:19Z`; the ticket body enters the context on the run's first tool call. The model calls
`issue_refund` for 400.00 with the claimed authority `refund`, which the run holds, and the gate
allows it at `14:02:20Z` with reason `authority granted`: it checked the authority class, not the
amount. The sandbox principal records the refund. The over-value alert delivers at `14:03:05Z`. Time
to detection: `14:02:11Z` to `14:03:05Z`, 54 seconds from intake, from the intake line and the alert
delivery line, both in the log store on its clock. The report also gives the tool-call line to the
alert, `14:02:20Z` to `14:03:05Z`, 45 seconds, and says the intake figure is the one it is calling
time to detection.

The prediction was right, and the telemetry section is easy to write: the alert is quoted, its
definition is linked with the monitoring change history and the promote record, and the on-call
channel consumed it. What the alert also shows is the gap: it noticed 45 seconds after the money
moved. The telemetry detects an over-value refund, and nothing prevents one.

The reviewer notices one more thing while reading the run. The agent's final answer reads "Summary:
refund of 400.00 issued as pre-approved. Ticket closed." No `close_ticket` call appears in the audit;
the model narrated an action it never attempted. That is a defect, and it is a human-read finding:
no signal fired on it and nothing in the telemetry recorded anything about final answers. It goes in
the report's telemetry section as an incidental finding, labelled "seen by the reviewer, not by any
signal", with the sentence that the telemetry recorded nothing about final answers. It does not
count as detection, and its fix and guard are not this report's fix and guard: it is the subject of
the learner's next injection, with a check on final answers committed and promoted first, and it is
kept out of this report's graded chain.

Fix, for the injected mode: the gate bounds the arguments of `issue_refund`. The amount may not
exceed the order value on the ticket the run was opened for; a call above the bound is denied with
reason `amount exceeds order value`, and the existing denial alert covers denied calls. The cause was
that a tool result set an amount the gate never looked at; the fix is in the gate, not the prompt,
and touches no fixture. Guard, in its own commit after the fix: a harness assertion, replayable from
the reviewer's ticket body committed as a fixture and run against every candidate release, that for
every fixture no `issue_refund` entry in the audit with an amount above the fixture's order value is
recorded as `allowed: true`. The audit is an interface that exists before and after the fix, so the
assertion runs on both. The reviewer checks out the fix commit's parent, cherry-picks the guard
commit onto it, replays the ticket and sees the assertion fail on the 400.00 entry, an assertion
failure with the entry in the message, not an import or attribute error; runs it at the guard commit
on top of the fix and sees it pass; replays a variant, the same request in different words for
4,000.00, on the unfixed code with the guard applied and sees it fail there too; then writes the
attestation. The report's five sections carry the mode id, the two timestamps and their subtraction,
the alert rule with its change history and the promote record, the fix, and the guard commit link.

## Producing the artifact

1. Choose the failure mode by graph id from those the graph marks injectable. Write down which
   pre-existing signal you expect to fire, what its entry will look like, and where its definition
   lives.
2. Prepare the injection as a file or command the reviewer can run without you. For
   `failure:tool-result-injection`, that is content submitted through the normal intake path.
3. Contain before you break. Decide where the injection runs: a deployment from your stage-7
   pipeline with the same telemetry and no real users, or the deployment at your stage-7 URL in a
   window where real traffic is paused. Point every side-effecting tool at a test or sandbox
   principal, or cap it; you are testing whether the gate holds, so plan for it not to. Promote that
   configuration through the pipeline and keep the promote record: release id, deployed commit,
   promote time. The deploy URL in the evidence is that deployment. Have the stage-7 rollback
   command confirmed against that release. Agree an abort condition with the reviewer: what they
   will say, and what you will do, if a side effect neither of you expected is recorded as allowed.
   This is the playbook's Stabilise and Contain, rehearsed before the injection rather than after.
4. Confirm the predicted signal is wired to that deployment: its definition is in the deployed
   commit, or, for an alert rule, the monitoring service's change history dates it before the
   promote and scopes it to that deployment's telemetry. Confirm the telemetry is written where the
   reviewer can read it.
5. Give the reviewer the prediction, the injection, the promote record and read access to the logs.
   Commit nothing, promote nothing and change no configuration between this point and the
   injection.
6. Run the injection, or have the reviewer run it. Do nothing else until the signal fires, you both
   agree it has not, or the abort condition is met.
7. Collect raw timestamps: intake, the first telemetry entry showing the failure, and the moment a
   signal a human would act on was emitted. Record the clock each came from, and the release id the
   live route reported during the run.
8. Find the cause. Fix it in a commit that touches the executor, gate, or pipeline, not the fixture
   that will guard it.
9. Add the guard in its own commit, after the fix: an assertion that fails on replay of the
   injection and on variants of it, in a path that runs unattended, through an interface that exists
   before and after the fix.
10. Have the reviewer apply the guard commit to the fix commit's parent and replay the injection
    there, confirming the result is an assertion failure and not an error; then run the same check
    at the guard commit on top of the fix; then write an attestation covering the three lines of
    `review:incident-honesty`.
11. Write `artifact:incident-report` with exactly its five required sections: injected failure mode,
    time to detection, what the telemetry showed, fix, guard added. Attach the deploy URL and the
    attestation as the two evidence items.

## Check yourself

1. Your alert fired, but only because the reviewer submitted the ticket while the log shipper
   happened to be running. Is your time to detection a measurement or a lucky sample, and what goes
   in the telemetry section?
2. The stage-4 fixture catches the injected instruction on every commit, but the harness never
   runs against the deployed configuration. Can you cite it under `detection-source-is-telemetry`?
   What one change would make the answer unambiguous?
3. The only way to inject `failure:ambient-authority` on your live deployment is to share a
   credential you cannot rotate afterwards. Is that an acceptable injection?
4. Your guard asserts that the exact ticket body the reviewer used produces no refund. Applied to
   the unfixed code it fails; on the fix it passes. Which rubric line does that satisfy, which one
   does it not, and what do you rewrite?
5. Nothing fired. You found the cause by reading the gate. Write the first sentence of the
   telemetry section without lying and without hiding the result, then say what happens to the
   submission.
6. The reviewer defended your ADR in stage 2 and knows the system well. Better or worse witness for
   this stage, and what must the attestation say to survive the doubt?
7. Your fix commit also updated the fixture the guard uses. What does `eval:harness-fails-on-regression`
   say about that, and how do you separate the two before submitting?
8. The run was granted `refund`. The reviewer's ticket asks for a refund of ten times the order
   value and the gate allows it. Which of your stage-3, stage-4 and stage-6 signals could have
   noticed, and what would each have needed to see?

Answer notes are at the end of the [rubric](rubric.md).

## Go deeper

Repository files this stage builds on. Read them rather than copying their prose into your report.

- [Incident response playbook](../../../08-governance/incident-response-checklist.md): its Detect
  step is what this stage measures, and its Stabilise and Contain steps are what you rehearse in
  step 3 before the injection runs.
- [Postmortem template](../../../15-workflows/postmortem.md): its timeline table is the right shape
  for your raw timestamps.
- [Escalation guide](../../../16-collaboration/escalation-guide.md): which severity your injected
  failure would carry if it were real.
- [Retrospective with AI](../../../15-workflows/retrospective-with-ai.md): a short loop for what the
  prediction taught you, after the report is submitted.
- [Human review checklist](../../../08-governance/human-review-checklist.md): the no-self-approval
  rule the evidence rule enforces.
- [Lab 05: bound the agent's tool authority](../../../labs/05-tool-authority-gate/README.md): the
  audit log and gate this stage injects against, runnable locally before the deployed run.
- [Stage 07: deployment](../07-deployment/README.md): the promote record, release id and
  observability locator this stage cites as evidence that a signal was running.
- [The graph](../../../site/lib/academy-graph/production-agent-systems.ts): the source of truth for
  every id quoted here. When this file and the graph disagree, the graph wins.
