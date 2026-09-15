# Rubric: `eval:harness-fails-on-regression`

Graph title: **The harness can actually fail.** Target: `artifact:eval-harness`. Pass threshold: `1`, which the graph defines as the fraction of assertions that must pass, so both assertions must hold. There is no partial credit: this stage has no `Review` node, and the graph records only pass or fail. Apply this rubric without the author present. If a check needs the author to explain something, the check has failed.

## Two layers, one recorded result

Each assertion section below has two parts.

**Graph check.** The check exactly as the graph words it. This part alone decides the recorded result. A submission that passes both graph checks is recorded as pass, whatever the second part finds.

**Reviewer hardening.** Further checks this rubric adds, because the graph's two checks can be met by a harness that is still dishonest. A hardening finding is a note to the author, written into the review, not a recorded fail. If you find a hardening check that should decide the result, raise it with the integrator as a change to the graph's assertions; do not apply it as if it were one.

Recording follows the one rule in [`../01-system-brief/rubric.md`](../01-system-brief/rubric.md#revise-the-one-rule-for-every-rubric-on-this-path): the recorded result is the literal check, PASS or FAIL; REVISE is a note naming one edit and never changes the recorded result; a reviewer-layer finding gates only through the stage's Review node, or goes to the integrator as a proposed tightening. This stage has no Review node, so every REVISE and Finding in the hardening tables below is a note that travels with whatever the graph check recorded.

The artifact node sets four required sections, `fixtures`, `assertions`, `baseline run`, `failure exit code`, and a redaction rule, `production fixture data`. The sections are the four headings of the artifact's README, each pointing at a file or command, matched and ordered under the one rule in [`../01-system-brief/rubric.md`](../01-system-brief/rubric.md#required-sections-the-one-rule-for-every-rubric-on-this-path); a missing or out-of-order section records both assertions as FAIL with the section named. Check those before either assertion; they come from the graph's artifact node, so an artifact missing a section is not the artifact, whatever the harness does.

## Before you start

Clone the repository at the submitted commit. Do not use a build the author hands you.

Identify the harness entrypoint that CI's gate step invokes, and run that entrypoint yourself, pointed at the seed. Do not run the wrapper step that asserts the seed's exit code: that step is supposed to exit 0 when the harness exits 1, so its exit status tells you nothing about the harness. If CI has both a gate step and a seed-assert step, the command you want is the one inside the gate step.

If the harness calls a live model, run the gate in replay mode against the recordings the author committed for the regressed prompt and the shipped prompt. A submission whose red run needs the author's credentials cannot be reproduced by you, and that is a finding under the evidence rule below, not something to work around.

Every probe below that edits the fixture set changes the digest the lock guards. The order is: edit the fixtures, then relock in your scratch clone, in the lab convention `python harness.py --relock --reviewer probe`, then run. If you relock before the edit the digest is stale and the run exits with the lock code before the scorer sees your case. An exit 2 in a probe means the relock happened before the edit, or not at all; it is not the verdict you are checking.

## Assertion `nonzero-exit`

Graph wording: "A deliberately broken fixture makes the harness exit non-zero."

Graph check: "Run the harness against the seeded regression fixture; require exit code != 0."

### Graph check

Find the seeded regression the author committed. The graph calls it a "seeded regression fixture"; in practice it is a regressed prompt run against the locked fixtures, or a separate fixture set outside the gate with its own lock. Run the gate entrypoint against it from a shell and print the exit status. Non-zero is the graph's pass condition.

| Verdict | What you observed |
|---|---|
| **PASS** | A seeded regression is committed, and the gate entrypoint exits non-zero against it. |
| **FAIL** | No seeded regression is committed. Or the gate entrypoint exits zero against it, including when a test or a separate script exits non-zero but the gate step wraps the harness in a soft-fail (`continue-on-error`, `\|\| true`, a warn flag) or only uploads a report. |

### Reviewer hardening

The graph accepts any non-zero code. The lab convention uses 1 for a regression and 2 for a lock mismatch, and an exit 2 against the seed says nothing about whether the scorer can fail. Check the following and write what you find as notes.

1. **The right code.** Require the regression code, not the lock code. Open the report the run wrote and confirm at least one case is recorded as failed with a reason. Then run the same entrypoint against the baseline prompt and require 0.
2. **The seed is under test.** A CI step or test asserts the seed's regression exit, so the harness's ability to fail cannot be "fixed" in a tidy-up without anyone noticing.
3. **Malformed case.** In your scratch clone, add one case whose expectation is of the wrong type (`expected_contains: null` in the lab convention), relock with `--reviewer probe`, then run the baseline prompt. Two outcomes pass: exit 1 with that case in the report marked failed and carrying a reason, or a non-zero exit from a harness that validates the fixture schema at load and refuses to run, with an error naming the malformed case. Only exit 0, or the case recorded as passed or skipped, is a finding.
4. **Goldens do not follow output.** Digest the fixtures file, run the baseline prompt, digest again. A changed digest means the harness rewrote its own expectations.
5. **Replay integrity.** If the harness replays recorded responses, change the recorded model identifier in your scratch clone and run the gate; require the lock code. Do the same for the tool-schema digest if the agent has tools. A replay that keys only on the prompt will replay old outputs against a new model or schema and pass, which is the incident this module is built around with the change moved out of the prompt.

| Note | What you observed |
|---|---|
| **Clean** | Regression code against the seed, 0 against the baseline, the seed's exit under test, the malformed case red, the fixture digest unchanged after a run, replay refuses on a model or schema change. |
| **REVISE** | The seed goes red but nothing asserts that it fails. Or the baseline also exits non-zero, so the harness cannot distinguish the two states. Or the seed is a broken case inside the locked gate set, so the baseline goes red with it and the seed has to move outside the gate. |
| **Finding** | The only non-zero exit you can produce is the lock code. Or the malformed-case probe exits 0, or records the case as passed or skipped. Or the fixture digest changes after a run. Or replay passes with a changed model identifier or tool-schema digest. Each of these is a harness the graph's check cannot see through; record it, and raise the pattern with the integrator if you see it more than once. |

## Assertion `fixtures-versioned-apart`

Graph wording: "Fixtures are not edited in the same commit as the system under test."

Graph check: "Diff the submitted commit; fixtures and prompts must not both change."

### Graph check

List the files changed between the submitted commit and its parent. Classify each:

- **Fixture**: anything under the locked fixture directory, and the lock file.
- **System under test**: prompts, agent code, model configuration, tool schemas.
- **System-under-test output**: recorded responses and the baseline report. These are produced by running the system under test, so they change whenever it does, and they must live outside the locked fixture set. If they sit inside it, the lock digest covers them, every re-record forces a relock, and a prompt-change commit necessarily touches the lock.
- **Other**: CI files, README, tests.

The check fails when a fixture and a system-under-test file both change in the commit. Recordings or a baseline report inside the locked fixture directory count as fixture files for this purpose, because the lock says they are.

| Verdict | What you observed |
|---|---|
| **PASS** | The submitted commit changes prompts, code or their outputs, and nothing in the locked fixture set. |
| **FAIL** | The submitted commit changes both the locked fixture set and the system under test. This includes a squash merge that combined a clean pair of commits into one, and a commit whose recordings live under `fixtures/` so that re-recording after a prompt change forced a relock. Diff the fixtures against the parent and read what the expectations became; if they were rewritten to match the new output, this is `failure:eval-rewritten-with-the-code` in the exact form the graph describes. |

### Reviewer hardening

The author chose which commit to submit, so one commit is not enough to see the failure mode. Walk the history back from the submitted commit to the previous commit that changed the system under test, and list every commit in that span that touched the locked fixture set. For each one, apply a diff rule you can run without judgment:

- List removed cases.
- List `expected_contains` entries that were removed or shortened.
- List `expected_not_contains` entries that were removed.
- List thresholds, sample counts or pass ratios that moved in the permissive direction.

Any item on those lists is a loosening. It is a finding unless the review that approved the fixture commit explains that exact change. Added cases need no further check; a fixture that guards behaviour the prompt already has, such as every refusal case from the brief's out-of-scope list, is legitimately green against the parent prompt and must not be marked down for it. Running a fixture commit against its parent's prompt, red for a new expectation, is useful guidance for a fixture that pairs with a behaviour change; it is not a pass condition, because a commit can loosen two expectations and add one red case, and because replay recordings keyed on the new prompt cannot run against the old one offline.

Then look at the lock: who signed the current fixtures, and what review backs the signature. The lab's `--reviewer` flag is free text. A handle in a lock file is a pointer, not evidence; the evidence is a pull request approved by an account other than the author's, or a code-owners rule plus branch protection on the fixture directory that requires such an approval, and the submission links one of them.

This independence rule comes from the failure mode's mitigation text, "a fixture change requires an independent reviewer", not from either graph assertion, and the stage sets `reviews: []`. So a solo learner with no second account passes the recorded result with a lock signed by any handle, and the missing approval is a note. If the integrator wants independence to decide the result, it needs a `reviews` entry or a third assertion on the graph; write that as a gap in your review rather than enforcing it here.

| Note | What you observed |
|---|---|
| **Clean** | Every fixture commit in the span comes before the change it pairs with, its diff has no loosening the approving review does not explain, the lock names a reviewer other than the author with a linked approval, and the harness refuses to run when the fixtures no longer match the lock. |
| **REVISE** | The submitted commit is clean, but there is no mechanism: no lock, no digest, no reviewer field, so the rule holds only until the next edit. Or the lock exists but the reviewer handle is the author's own, or names someone with no linked review behind it. Or the two-commit order is reversed, prompt first then fixtures, and the fixture commit only adds. |
| **Finding** | A fixture commit in the span loosens or deletes an expectation and the approving review does not name that change. That is `failure:eval-rewritten-with-the-code` split across two commits, whichever commit the author chose to submit. Record it as a finding, and raise it with the integrator: the graph's single-commit diff cannot see it. |

## Evidence the stage accepts

The stage's rule: `accepts: ['repo-url', 'eval-run']`, `minimumCount: 2`, `maxAgeDays: 365`.

- `repo-url`: "a commit or file a third party can open". For this stage, the repository at the submitted commit. A reviewer needs it to run the seeded regression and to diff the commit; without it neither assertion can be checked.
- `eval-run`: "a recorded, reproducible eval execution". A CI run link at the submitted commit showing the seeded regression exiting with the regression code and the baseline exiting zero, and the committed baseline report written by the harness (prompt digest, fixture digest, model identifier, per-case verdicts, exit code, date) at a path ordinary runs do not overwrite. The report's prompt digest must match the prompt in the tree at that commit. A screenshot is not a recorded run. A run the reviewer cannot reproduce from the repository, using the committed recordings, is not reproducible.

Two locators are required. The rule counts locators of either kind, so two repository links or two run links satisfy the graph. Ask for one of each anyway: two eval-run links and no repository give you nothing to run, and two repository links and no run give no evidence the harness ran anywhere but the author's machine. Both must open for someone with no account on the author's systems. The 365-day limit is measured from the evidence record's `verifiedAt`, the date a reviewer last verified the locator, not from a date inside the report. The date in the baseline report is a requirement of this rubric's hardening layer, so a reviewer can tell which run the report describes; it is not what makes the graph's age rule work.

## Three ways a submission looks right but fails

**1. The failure lives in the tests, not in the gate.** The author's test suite proves the harness exits 1 against the regressed prompt, and it does. But the entrypoint CI's gate step runs is a different one, or the same one wrapped in a soft-fail so the pipeline stays green while the report uploads. Every artifact section is present, the seeded regression is committed, the local tests pass. Run the gate entrypoint yourself and print its exit status; if it is zero against the seeded regression, `nonzero-exit` fails on the graph check. The tests were testing a harness nobody ships.

**2. The commits were clean and the merge was not.** The author followed the two-commit order on their branch: fixture first, red; prompt second, green. Then the change was squash-merged, and the submitted commit is the squash. Diffed against its parent it changes both `fixtures/` and `prompts/`, and the reviewer cannot tell from that commit whether behaviour improved or the definition moved. `fixtures-versioned-apart` fails on the graph check regardless of what the branch history looked like. The lock's reviewer field carrying the author's own handle, or a colleague's handle with no approval behind it, is the same shape one layer down: the mechanism exists and the independence it was for does not. That one is a hardening note.

**3. The loosening is one commit back.** The submitted commit changes only `prompts/` and diffs clean against its parent, so it passes the graph check. Its parent, submitted by nobody, shortened two `expected_contains` lists in `fixtures/` to match what the new prompt was about to produce, and the lock was re-signed with a colleague's handle typed at the command line. The diff rule finds it in one pass: two shortened entries, no review naming them. That is `failure:eval-rewritten-with-the-code` with a commit boundary through the middle of it. Record it as a finding, tell the author which two entries, and tell the integrator the graph's one-commit diff let it through.
