# Rubric · eval:cost-model-has-ceiling

Target: `artifact:cost-model`. Eval title: "Cost has a ceiling and a guard". Pass threshold: `1`, so every assertion must pass. No independent reviewer is required at this stage (`stage:cost-model` lists `reviews: []`); the eval is the gate, and this rubric is the procedure for applying it, by reading, without the author present. `check-cost-model.mjs` in this directory is a keyword screen over the file's shape and the guard's wording, not a verdict on either assertion; everything below is read.

Recording follows the one rule in [`../01-system-brief/rubric.md`](../01-system-brief/rubric.md#revise-the-one-rule-for-every-rubric-on-this-path): the recorded result is the literal check, PASS or FAIL; REVISE is a note naming one edit and never changes the recorded result; a reviewer-layer finding gates only through the stage's Review node, or goes to the integrator as a proposed tightening. This stage has no Review node, so every reviewer note below travels with the recorded result and changes nothing in it. The graph records only pass or fail per assertion: `site/lib/academy-graph/advance.ts` counts `passedAssertions` against the total and refuses the stage below the threshold. The notes that ought to gate are listed under "Proposed tightenings, for the integrator" at the end.

Each assertion below has two layers, kept apart:

1. **Recorded result.** The graph's check text, read literally. This is the only thing that goes into the run record, and two reviewers reading the same file must record the same result without asking the author anything.
2. **Reviewer notes.** Everything a good reviewer would say beyond the literal check. A note names the one edit that would clear it. Notes do not change the recorded result.

`ceiling` is read under `runaway-guard`'s notes, because the guard enforces a ceiling and nothing else reads it: `ceiling` is a required section of `artifact:cost-model`, but `site/lib/academy-graph/advance.ts` does not check required sections and the eval's two assertions do not name it. The five required keys, `unitOfWork`, `tokensPerUnit`, `costPerUnit`, `ceiling`, `runawayGuard`, are matched under the one rule in [`../01-system-brief/rubric.md`](../01-system-brief/rubric.md#required-sections-the-one-rule-for-every-rubric-on-this-path): top-level JSON keys, matched exactly, and a missing key records both assertions as FAIL with the key named.

The `description` and `check` lines below are quoted from `site/lib/academy-graph/production-agent-systems.ts`.

## Assertion `unit-economics`

> **description:** Cost is expressed per unit of work, not per month in aggregate.
> **check:** unitOfWork and costPerUnit are both present and numeric where applicable.

### Recorded result

| Result | What the reviewer sees |
|---|---|
| **PASS** | `unitOfWork` is present and is a non-empty string. `costPerUnit` is present and is a JSON number: not a string containing a number, not a range, not an object, not a sentence. |
| **FAIL** | Either key is missing; or `costPerUnit` is anything other than a JSON number. Any required key missing records this assertion and `runaway-guard` as FAIL. |

Read literally, `"unitOfWork": "one month of usage"` with a numeric `costPerUnit` passes: the check does not say what a unit is. So does a `costPerUnit` that no field in the file recomputes, and one priced at a contracted rate. Record pass and write the notes.

### Reviewer notes

- `unitOfWork` names a finished thing (a resolved ticket, a filed record, a generated report), not a model call, a turn, a request or a period of time. "One month of usage" is the aggregate-only failure in a bare number; say so.
- `tokensPerUnit` names the run it was measured from, the statistic, the percentile method for any percentile, and the number of units behind it. The reviewer opens the run, recomputes that statistic from it, and gets the artifact's figure within rounding. A figure with no run, or one the run does not reproduce, came from somewhere else, most often one clean call.
- The reviewer recomputes `costPerUnit` from `tokensPerUnit`, the metered calls per unit and the rates stated in the file, and gets the same number within rounding. Rates absent, or input and output not separated, make that impossible; name which.
- The linked baseline run contains at least one retry and one multi-round-trip unit; a set with neither is not a baseline.
- Every tool the scenario meters (OCR, a paid API) is in the arithmetic, or priced at zero with a stated reason.
- Every rate is a list rate with a URL and retrieval date, or a labelled placeholder. A negotiated rate anywhere in the file is the redaction finding below.

## Assertion `runaway-guard`

> **description:** A mechanism stops spend when the ceiling is hit.
> **check:** runawayGuard names an enforcing mechanism, not an alert alone.

### Recorded result

| Result | What the reviewer sees |
|---|---|
| **PASS** | `runawayGuard` is present and names at least one mechanism that refuses to make the next call: a turn budget or token budget in the executor loop, a budget assertion before side-effecting calls, a call budget before metered tool calls, a kill switch the loop reads, a shared counter consulted before a run starts, or an equivalent. An alert may be named beside it. |
| **FAIL** | `runawayGuard` is missing; or it names only a notification, dashboard threshold, budget report, scheduled job that emails, or page. Any mechanism whose verb is notify, alert, warn, flag, report or page, standing alone, fails this assertion. |

Read literally, a sentence that names a token budget in the future tense ("will add a budget check") passes, and so does one with no commit behind it. The check reads the wording, not the code. Record pass and write the notes.

### Reviewer notes

- The guard says where the check runs and links a commit that adds it. The reviewer opens the commit and confirms the budget check sits on the call path, before the model call, before every side-effecting call and before every metered tool call, in the code that makes those calls rather than beside it.
- The linked commit bounds the last call: a maximum-output cap tied to the remaining budget, a refusal when the estimated input alone exceeds it, and no retry of a response that stopped at the cap.
- A forced-loop log exists and shows a run halting at the ceiling with alerts muted, not an alert firing.
- With an orchestrator shape, every specialist debits the run's one budget.
- `ceiling` is present, with per-run, per-day and per-user (or per-tenant) each marked enforced or report-only, at least one enforced, and every enforced ceiling stated in a unit the executor measures at runtime (tokens, turns, metered calls), not only in currency.
- The per-user entry states who can start a run and derives its enforced-or-not decision from that. An untrusted caller (a customer, a tenant, a public form, anyone the threat model does not list as authenticated staff) with a report-only per-user ceiling is the note for the exercise scenario, where customers upload the documents.
- The per-day margin accounts for runs already in flight.
- If an alert is also named, it is labelled as reporting.
- A mechanism described in the future tense is a note: the assertion passes on the wording, and the commit is what the reviewer asks for.

## Evidence the stage accepts

The stage's evidence rule is `STANDARD_EVIDENCE`: `accepts: ['repo-url', 'eval-run']`, `minimumCount: 1`, `maxAgeDays: 365`.

The stage minimum is one item of either kind. The `runaway-guard` notes ask for the forced-loop log, so a `repo-url` with no log reachable from it clears the recorded result and not the notes; the log is attached as an `eval-run` or reachable from the repository the `repo-url` points at.

- A `repo-url` a third party can open without credentials, pointing at `cost-model.json`, at the commit that adds the guard, and at the forced-loop log.
- An `eval-run`: the log of the forced-loop test showing the run halting at the ceiling with alerts muted, reproducible from the repository. The recorded output of `check-cost-model.mjs` against the submitted file also counts as an eval-run of the keyword screen, but on its own it evidences nothing about the guard; the forced-loop log is the primary evidence for this stage.

Evidence older than the stage's limit does not count. A private repository link, a screenshot, or a description of a run that cannot be re-executed is not evidence under this rule.

## Rates: read here, because the stage-nine scan does not read values

`artifact:cost-model` is `publicSafe: true` with `redactionRule: ['negotiated vendor rates']`. Neither assertion's text mentions rates. At stage 9, `no-redacted-leakage`'s literal check scans the rendered portfolio for the redaction rules' category labels, and this artifact's label is `negotiated vendor rates`, not a value; the stage 9 rubric has a reviewer expand the labels into concrete strings and check for rates recoverable by arithmetic. Do not rely on either. A reviewer who finds a rate that is neither a list rate with a URL nor a labelled placeholder writes it as a note with the rate's location named, before the file is committed publicly; the assertion text does not require it, and the recorded result does not change. The tightening that would make it fail is proposed below.

## Two ways a submission looks right but records pass

**1. The number is real, the source is not.** `unitOfWork` is well chosen, `costPerUnit` is numeric and neatly recomputable, and `tokensPerUnit` is a single clean figure with no distribution and no link to a run. The test is provenance, not the size of the figure: `tokensPerUnit.measuredFrom` must resolve to a run, and the named statistic recomputed from that run must match within rounding. A figure with no run, or one the run does not reproduce, came from somewhere else, most often one clean call. The literal `unit-economics` check passes and is recorded as passed; the stage's purpose does not, because the ceiling was sized against a number production will exceed on its first hard unit. Write the note and ask for the run link and the statistic.

**2. The guard is a well-described alert.** `runawayGuard` is a paragraph: budget thresholds at 50, 80 and 100 percent, a daily report, an on-call page at 100, a dashboard tile. Every element is real and all of it is reporting. Read for the verb that stops the next call. If there is none, the assertion fails regardless of how much monitoring surrounds it. The tell is that no commit is linked to an executor change; guards live in the loop, alerts live beside it.

## Proposed tightenings, for the integrator

The gap between the recorded result and the reviewer notes is the gap between the graph's check text and what a senior reviewer would gate on. If any of these should gate, the change belongs in the graph's `check` string, not here:

- `unit-economics`: "unitOfWork names a finished unit of work; costPerUnit is a JSON number that recomputes within rounding from tokensPerUnit, the metered calls per unit and rates stated in the file; tokensPerUnit links a run that reproduces its named statistic; every rate is a public list rate with a URL or a labelled placeholder".
- `runaway-guard`: "runawayGuard names an enforcing mechanism and links a commit that places the check before every model call, metered tool call and side-effecting call on the call path, and links a forced-loop log showing the run halting at the ceiling with alerts muted".

Until the graph changes, record the literal result and write the notes.
