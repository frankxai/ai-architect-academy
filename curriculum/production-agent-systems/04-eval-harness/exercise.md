# Exercise: a harness that can fail

Stage 4 of Production agent systems. Deliverable: `artifact:eval-harness`. Checked by `eval:harness-fails-on-regression`. Finish [Lab 04](../../../labs/04-eval-harness/README.md) first; this exercise is the same work against your own system instead of the lab's fake model.

## Scenario

This scenario is a composite. No real company, team or product is described. If you carried your own system through stages 1 to 3, use that and read the composite only for the shape of the cases. This composite does not continue the earlier exercises' systems; if you are using composites rather than your own system, carry your stage 1 brief forward and use this one only for shape.

A subscription box service runs a returns assistant. Its brief put three things explicitly out of scope: refunds above a fixed limit, which go to a person; anything about another subscriber's account; and advice about allergens in box contents. Its authority matrix gives the agent one side-effecting tool, `create_return_authorization`, under its own principal.

Last month a prompt was trimmed to save tokens. The trim removed the line about other subscribers. The existing suite ran and passed. A subscriber asked about a neighbour's box and got the neighbour's tracking number. The suite passed because its expected strings had been refreshed from output on every run since it was written.

You are building the harness that would have gone red.

## Deliverable

Exactly one artifact: `artifact:eval-harness`, format `code`, with the four required sections the graph names:

| Section | What it is in your repository |
|---|---|
| `fixtures` | A directory of cases, each with an id, an input, an expected behaviour that can come back false, and one line naming the regression it catches |
| `assertions` | The scoring code: substring, negative substring and structural checks in a deterministic tier, plus trajectory checks against a stub tool's call log for every side-effecting tool (call count, argument equality, no call after a handoff); scorer errors are failures |
| `baseline run` | A report file the harness wrote, only when asked, against the prompt you intend to ship, at a path ordinary runs do not overwrite: prompt digest, fixture digest, model identifier, per-case verdicts, exit code, date. Committed with the prompt it measures |
| `failure exit code` | The entrypoint CI calls returns non-zero on any failure, and a distinct code when fixtures changed without a signed relock |

Plus the seeded regression: a committed regressed prompt the current fixtures fail, and a check that the harness exits with the regression code against it, not the lock code. A seed that is a fixture set lives outside the locked gate set with its own lock; a broken case inside the gate set turns the baseline red too.

The artifact is `publicSafe`. Its redaction rule is `production fixture data`: nothing from a real queue, log or customer appears in a fixture.

## Constraints

- Cases come from your stage 1 brief's out-of-scope list first, then from every side-effecting tool in your stage 3 matrix, then from the happy path. Include at least one refusal, one negative test, and one embedded-instruction case asserting no tool call outside the allowed set.
- Assertions in the gate are deterministic. A judged tier is allowed only outside the gate, as a trend.
- A scorer exception marks the case failed, with the exception as the reason. No skip state.
- The exit code comes from the same command CI runs. No `continue-on-error`, no `|| true`, no warn mode.
- The harness never writes to `fixtures/` during a run.
- Fixtures and the system under test never change in the same commit. A change that needs both is two commits, fixture first. A fixture change carries the handle of a reviewer who is not you, and reaches the default branch through a review that person approved; the handle alone is not the review.
- The submitted commit changes prompts or code, not fixtures.
- The seeded regression is reproducible without your credentials: recorded responses for the regressed prompt and the shipped prompt are committed, so a reviewer can produce the red run offline. The replay key carries the prompt digest, the model identifier, a digest of the tool schemas and, per model turn, a digest of the full message history including tool results; a mismatch on any of them exits with the lock code. Recordings gate changes to code and assertions only; a prompt, model or schema change runs live, re-records and re-baselines. The baseline record carries the model identifier the response reported, and a run whose identifier differs exits with the lock code. Recordings and the baseline report live outside the locked fixture directory.
- If the model is not deterministic, the sampling rule is written into the harness: temperature, samples per case, and how many must pass. A flaky case is recorded as flaky and kept out of the pass total, never retried silently.
- Any language. No vendor is required; if you adopt the CI template under `05-projects/eval-automation/`, read its run step against the fourth failure mode first.

## Time box

One focused working session of about four hours after the lab, not counting the lab's own hour. If you run over, cut cases, not checks. A harness with a dozen honest cases and a seeded regression that goes red clears this stage. A harness with a hundred cases and one `except` that returns a pass does not.

## Submission checklist

- [ ] Lab 04 tests pass locally.
- [ ] `fixtures/` exists; every case has an id, an expected behaviour that can be false, and a one-line reason.
- [ ] At least one refusal case from the brief's out-of-scope list, one negative test, one embedded-instruction case.
- [ ] No production data in any fixture.
- [ ] Deterministic assertions in the gate; scorer exceptions recorded as failures.
- [ ] Running the harness from a shell against the seeded regression prints the regression exit code, not the lock code, and the report names at least one failed case with a reason.
- [ ] The CI step that runs the seeded regression requires that exit code and has no soft-fail flag.
- [ ] Recorded responses for the shipped prompt and the regressed prompt are committed, outside the locked fixture directory, so the red run replays without your credentials.
- [ ] The replay key includes prompt digest, model identifier, tool-schema digest and per-turn message-history digest; changing the recorded model identifier in a scratch clone makes the gate exit with the lock code.
- [ ] A run against the baseline prompt leaves `fixtures/` unchanged (digest before equals digest after).
- [ ] Fixture lock present with a digest and a reviewer handle that is not yours; harness refuses to run on mismatch; the fixture commit links an approval by that reviewer or a review rule enforced on `fixtures/`.
- [ ] Baseline report committed with the prompt it measures, at a path ordinary runs do not overwrite, with prompt digest, fixture digest, model identifier, verdicts, exit code and date.
- [ ] Submitted commit touches prompts or code and nothing under `fixtures/`.
- [ ] Artifact README has the four sections, each pointing at a file or command.
- [ ] Two locators submitted: the repository URL at the submitted commit, and the recorded eval run. Both open for a third party without asking you.
