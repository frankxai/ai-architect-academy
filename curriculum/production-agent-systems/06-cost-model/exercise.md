# Exercise · Cost model

Produces `artifact:cost-model`. Graded by `eval:cost-model-has-ceiling`. Stage `stage:cost-model`.

## Scenario

*Composite. The organisation, numbers and code are illustrative and belong to no real company.*

You are carrying your own agent system through this stage, the one you briefed in stage one and have been building since. If you need a stand-in to reason against, use this one. It does not continue the earlier stages' composites; if you are using composites rather than your own system, carry your stage 1 brief forward and use this one only for shape.

A document-intake agent for a mid-sized professional-services firm receives scanned contracts, extracts the parties, dates and obligations, checks them against a policy file, and either files the structured record or routes the document to a reviewer with a note. The ADR chose an orchestrator with two specialists (extract, check) over a single agent, because the check step needs a different context than the extract step. Tools: OCR the document (a vendor service billed per page, read-only in the authority matrix), read the policy file, write the record, route to reviewer. The last two are side-effecting. The first is metered. Documents arrive from customers through an upload form, so the caller is not staff.

The team has been quoting a per-document cost from one clean run of a short, well-scanned contract, and the figure counts tokens only. Finance has a monthly number. Nobody has a per-document number from the harness, and the only thing that stops a bad scan from being re-OCR'd forever is the OCR vendor's own rate limit. A token budget would not stop it either: OCR spends pages, not tokens.

## Deliverable

Exactly one file: `cost-model.json`, with the five keys the graph requires:

- `unitOfWork` — the thing the agent finishes for someone, in one sentence.
- `tokensPerUnit` — measured from the recorded baseline run of your harness, input and output separated, with the statistic named, the percentile method named for any percentile, the number of units behind it stated, and the run linked.
- `costPerUnit` — a number, recomputable from `tokensPerUnit`, the metered tool calls per unit and the rates you state.
- `ceiling` — per run, per user, per day; each marked enforced or report-only, with the per-user choice reasoned from who can start a run.
- `runawayGuard` — the mechanism in your code that halts spend at the ceiling, with a link to the commit that adds it and to the forced-loop log.

Nothing else is graded. A cost dashboard, a routing proposal or a caching plan are fine to build; they are not the deliverable.

## Constraints

- `tokensPerUnit` comes from the baseline run of `artifact:eval-harness`, not from a single call. If the run does not record usage, fixing the harness is part of this exercise.
- Include retries, tool-call round trips and retrieval or document context in the count. If your harness's fixtures have no failing tool calls, add one; a set with no retries is not a baseline. The new fixture goes in its own commit that touches no prompt or system code, because `eval:harness-fails-on-regression` asserts `fixtures-versioned-apart`, and a fixture change needs an independent reviewer under the harness pattern (`failure:eval-rewritten-with-the-code`). Re-run the stage-4 eval afterwards. `../04-eval-harness/README.md` has the rules.
- Count every metered tool call per unit from the same run (OCR pages here), and price them in `costPerUnit` beside the tokens. A cost line that prices tokens only is incomplete for this scenario.
- `runawayGuard` must name something that refuses to make the next call. A notification, a dashboard threshold, a scheduled report or a page is not a guard, though you may keep one and label it as reporting.
- The guard must check before every metered tool call and before every side-effecting call, as well as before model calls. Use the `sideEffecting` flags from your `artifact:tool-authority-matrix` for the second set. The matrix does not record metering (the graph requires only `tools`, `principals`, `sideEffecting` and `revocationPath`), so for the first set either add a `metered` and `billedPer` field to your own matrix entries (extra fields are allowed) or list the metered tools in `cost-model.json` under `toolCallsPerUnit`, the list the call budget keys on.
- Each model request caps its maximum output tokens at the remaining budget, with a floor: refuse the call when the remainder is below a minimum useful output plus the estimated input, and never retry a response that stopped at the cap. `README.md` under "Where budgets leak" has the reasoning; the rubric grades it under `runaway-guard`.
- With an orchestrator, one budget serves the run. Every specialist debits the same `Budget` object or a reserved slice of it; a specialist that creates its own is a second ceiling.
- The enforced ceiling is expressed in something your executor can measure at runtime (tokens, turns, metered calls), not only in currency.
- Rates: a public list rate with its URL, or a placeholder labelled as one. No negotiated rate anywhere in the file. `artifact:cost-model` is `publicSafe: true`; its `redactionRule` is `negotiated vendor rates`.
- No employer, customer or vendor-contract detail in the artifact. It will be linked from your portfolio.
- Prove the guard in a non-production environment with alerts muted before you write it into the artifact. Keep the log.

## Time box

Four hours of focused work, in this order: one hour to extract and summarise usage from the baseline run, one hour to set the ceilings and write the arithmetic, one and a half hours to implement and prove the guard, half an hour to write and self-check the JSON.

If the first hour runs long because the harness does not record usage, stop and fix the harness. That is stage four debt, and it blocks this stage regardless of how well you write the rest.

## Submission checklist

- [ ] `cost-model.json` parses as JSON and contains `unitOfWork`, `tokensPerUnit`, `costPerUnit`, `ceiling`, `runawayGuard`.
- [ ] `unitOfWork` names a finished thing, not a call, turn or month.
- [ ] `costPerUnit` is a number. A reader can recompute it from `tokensPerUnit`, the metered calls per unit and the stated rates, and the arithmetic is in the file or the linked commit.
- [ ] `tokensPerUnit` links the recorded baseline run, states which statistic it is (mean, median, percentile) and how many units it was computed over. Input and output are separate.
- [ ] Every metered tool is counted per unit from the same run and has a rate in the file.
- [ ] The run that produced `tokensPerUnit` included at least one retry and at least one multi-round-trip unit. If you added the failing fixture to get there, it is in its own commit and the stage-4 eval was re-run.
- [ ] Every rate in the file is labelled list (with URL) or placeholder. `grep` the file for currency symbols and vendor names before you commit.
- [ ] `ceiling` marks each of per run, per user, per day as enforced or report-only, at least one is enforced, and the per-user choice states who can start a run.
- [ ] `runawayGuard` names a check that halts the run, states where it runs (before model calls, before metered tool calls, before side-effecting calls), and links the commit that adds it.
- [ ] Each model request caps its maximum output tokens at the remaining budget, refuses the call below a minimum useful output plus the estimated input, does not retry a response that stopped at the cap, and every specialist debits the run's one budget.
- [ ] You forced a loop with alerts muted and the run halted at the ceiling. The log is kept as `eval-run` evidence or referenced from the commit.
- [ ] You ran `check-cost-model.mjs` (from `curriculum/production-agent-systems/06-cost-model/`, copied into your repository) against the file, the screen prints PASS for both assertions with no warning you cannot explain, and you applied `rubric.md` for everything the screen says it does not check.
- [ ] Evidence attached: at least one `repo-url` or `eval-run` a stranger can open, no older than the stage's limit.
