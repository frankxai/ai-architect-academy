# Exercise: break it while someone watches

Stage `stage:incident-simulation`. Deliverable: `artifact:incident-report`. Graded by
`eval:incident-detected-by-telemetry` and `review:incident-honesty`.

## Scenario

This scenario is a composite. No real company, team or product is described.

Your agent system has been deployed since stage 7 at a URL a stranger can reach. It has the audit
log you built in stage 3, the harness from stage 4, the threat model from stage 5 naming tool results
as untrusted, the cost ceiling from stage 6, and a rollback you have run at least once. You have
never seen any of those fire against the deployed system on a failure you did not expect.

A peer in your cohort has agreed to be your independent reviewer. They hold the competency, they
have no commits in your repository, and they have read access to your telemetry. They have one
afternoon and no patience for a report they cannot check.

You are going to inject one failure mode the graph marks injectable, in front of them, and find out
which of your signals notices.

## Deliverable

Exactly one artifact: `artifact:incident-report`, in markdown, with exactly these five sections in
this order, headed with these words:

1. **Injected failure mode** — the graph id of a failure mode the graph marks `injectable: true`.
   The graph is the source for that set; the [README](README.md) lists them under "Choosing the
   injection". One sentence on how it was injected and a link to the injection as a file or command.
   For the modes whose exposed path is the deploy pipeline, the environment the pipeline would have
   promoted the injection to.
2. **Time to detection** — two raw timestamps from telemetry with their sources, the subtraction,
   and the clock each came from.
3. **What the telemetry showed** — the log, metric or eval that detected it, quoted, with a link to
   where that signal is defined, the evidence it was in the release running at injection time (the
   promote record's release id, deployed commit and promote time; for an alert rule, the monitoring
   change history), and what consumed its output. If no pre-existing signal produced an output
   anyone acted on, this section says so and names what the telemetry did record; the rubric says
   what that does to the grade and how to re-run. A defect anyone found by reading output or code
   goes here labelled "seen by <who>, not by any signal"; it is not detection.
4. **Fix** — the cause and the commit that addresses it. If a pre-existing control stopped the
   injection, the gap the injection exposed and the commit that closes it, or "no cause to fix"
   with the paths tried.
5. **Guard added** — a link to the commit adding an assertion or check that fails on replay of the
   injection, and one sentence on why it catches the class rather than the instance.

Plus two evidence items, one of each kind: the deploy URL of the deployment the injection ran
against, and the reviewer's attestation. The attestation is written by the reviewer, covers the
three lines of `review:incident-honesty`, and is never your own. The reviewer confirms both kinds
are present; the code checks the count, the freshness, and that the attestation is not yours.

## Constraints

- The failure mode is one the graph marks injectable, named by id. Anything else fails
  `injected-mode-named`.
- The injection enters through a path the system already exposes. Editing the system prompt to
  make it misbehave is not an injection; it is a different system, and it fails
  `injected-mode-named`.
- For `failure:ambient-authority` and `failure:eval-rewritten-with-the-code` the exposed path is
  the deploy pipeline: the injection is a commit or configuration change on a branch the pipeline
  evaluates, nothing is provisioned on the live deployment, and the deploy URL in the evidence is
  the environment the pipeline would have promoted to. The report names that environment.
- Containment comes before the prediction is handed over. The injection runs on a deployment with
  the same telemetry as your stage-7 deployment and no real users, or on the stage-7 deployment in a
  window where real traffic is paused. Side-effecting tools on that deployment point at a test or
  sandbox principal, or are capped, and that configuration is promoted through the pipeline with
  its promote record kept. The stage-7 rollback command is confirmed against that release and an
  abort condition is agreed with the reviewer. The deploy URL in the evidence is that deployment.
- No commits, promotes or configuration changes between handing the reviewer the prediction and
  running the injection. The promote record and the monitoring change history are how the reviewer
  checks the first rubric line; commit dates are author-controlled and are not evidence on their
  own.
- Every timestamp in the report is copied from a log, metric or CI record the reviewer can open.
  Nothing is from memory or a chat message.
- The fix and the guard are separate commits. The guard commit does not edit the system under test;
  the fix commit does not edit fixtures.
- The guard is an assertion or check, not a comment, a note, or a runbook entry. It checks through
  an interface that exists before and after the fix, so on the unfixed code it fails as an
  assertion rather than erroring.
- The report is cohort-only. It names the gap you found. Do not sanitise it for a public audience;
  stage 9 decides what can be shown.
- If your instrumentation did not fire, report that. The honest report passes the review and gets
  REVISE on the eval, with a re-run path in the rubric. A report that invents a signal, or presents
  something a person noticed as something the telemetry caught, fails both and the author's word is
  worth less for the rest of the path.

## Time box

One working session for the injection, the fix and the report, with the reviewer present for the
injection and available afterwards for the replay. If the injection takes more than an hour to set
up, it is not replayable enough yet; stop and simplify it before involving the reviewer.

## Submission checklist

- [ ] The injected failure mode is named by graph id and the graph marks it `injectable`.
- [ ] The injection exists as a file or command in the repository, and the reviewer ran it or
      watched it run.
- [ ] Containment was in place before the prediction was handed over: side-effecting tools on a
      sandbox principal or capped, the configuration promoted with its record kept, the injection
      deployment carrying no real traffic, the rollback command confirmed, and the abort condition
      written in the report.
- [ ] The telemetry section quotes the actual entry, links the signal's definition, places it in
      the release running at injection time with the promote record and, for an alert rule, the
      monitoring change history, and says what consumed the signal's output.
- [ ] Anything found by reading output or code is labelled as such in the telemetry section and is
      not presented as detection.
- [ ] Time to detection shows two raw timestamps, their sources, and the arithmetic.
- [ ] The fix is a linked commit touching the cause, not the fixture; or, where a control held, it
      names the gap and the paths tried.
- [ ] The guard is a linked commit adding an assertion or check, in a path that runs unattended,
      through an interface that exists before and after the fix, that fails on replay and on at
      least one variant of the injection.
- [ ] The reviewer applied the guard commit to the fix commit's parent and saw the check fail on
      replay as an assertion, not an error, then ran it at the guard commit on top of the fix and
      saw it pass.
- [ ] The deploy URL responds and is the deployment the injection ran against, or, for the two
      pipeline-caught modes, the environment the pipeline would have promoted to.
- [ ] The attestation is written by the reviewer, in their words, and addresses all three rubric
      lines of `review:incident-honesty`.
- [ ] Both evidence items are no more than 90 days old at submission.
- [ ] `review:incident-honesty` has been requested from a reviewer who is not you.
