# 06 · Cost model

Stage `stage:cost-model` · produces `artifact:cost-model` · graded by `eval:cost-model-has-ceiling`

Source of truth for ids, required keys and assertions: `site/lib/academy-graph/production-agent-systems.ts`. This page is the teaching around that node, not a second copy of it.

## The decision

> What one unit of work costs and what stops the bill when it runs away.

Two halves, one artifact. The first is a measurement. The second is a mechanism. Most cost work answers the first loosely and the second not at all.

You cannot defer this stage because the next one is deployment. An agent that has never been deployed cannot run away; one that has been deployed with no ceiling will, and the first time it happens the invoice is the only monitor that fires. The earlier stages also produced the inputs: the shape from `stage:architecture-decision` fixed how many model calls a unit takes, the tool list from `stage:tool-authority-model` marked which calls have side effects and therefore need a budget check in front of them (it did not mark which calls a vendor meters; you add that here), and the baseline run from `stage:eval-harness` is the only honest source for tokens and tool calls per unit.

The decision is not what the bill will be. It is what you will let it be, and what enforces that.

## What goes wrong

**Aggregate cost only.** The model states a monthly figure with no unit of work. Ask it one question: did last week's prompt change make each unit cheaper or dearer? If the answer needs a new spreadsheet, the model is aggregate. In the artifact, the tell is a missing `unitOfWork` or a `costPerUnit` that is a sentence rather than a number.

**Alert as guard.** `runawayGuard` names a notification. Read the verb: notifies, pages, emails, flags. Each happens after the spend. Detect it with a test, not a reading: in a non-production environment, mute every alert channel, inject a loop, and watch the spend counter. If it keeps climbing, you have an alert and no guard.

**Happy-path token count.** `tokensPerUnit` came from one clean call, so retries, tool round trips and long retrieval contexts are missing. Detect it by provenance, not by the size of the number: the artifact names a run and a statistic, and recomputing that statistic from the run gives the artifact's figure within rounding. A figure with no run behind it, or one the run does not reproduce, was not measured from the run, however plausible it looks.

**Only model tokens counted.** The cost line prices input and output tokens and nothing else, while the unit also spends OCR pages, search queries or paid API calls. Those are metered by a vendor per call, and in a document-heavy or search-heavy agent they can be the larger part of the unit. The tell is a `costPerUnit` whose arithmetic uses only two rates for an agent whose tool list has a per-call price on it. The runaway version is worse: a loop that re-calls a metered tool spends money without touching the token budget, so a token-only guard never fires.

**Rates in the artifact.** A negotiated vendor rate appears in a public-safe file. `artifact:cost-model` carries `publicSafe: true` and a `redactionRule` of `negotiated vendor rates` for this reason. At stage 9, `no-redacted-leakage`'s literal check scans the rendered portfolio for the redaction rules' category labels; the stage 9 rubric has a reviewer expand them into concrete strings and check for rates recoverable by arithmetic. Do not rely on either; redact now: every rate in the file is either a list rate with a URL or a labelled placeholder.

## Concepts

### The unit, not the month

A monthly figure describes a bill. A unit of work describes the system. The unit is the thing the agent finishes for someone: a resolved ticket, a filed record, a generated report. Pick it at the level a stakeholder would recognise as done, not at the level of a model call. Once cost is per unit, a prompt change, a model swap and a shape change become comparable on one axis, and throughput separates cleanly from efficiency.

The trade-off: a coarse unit hides variance. A two-turn ticket and a fourteen-turn ticket are the same unit. Keep the unit coarse for the decision and the distribution beside it for the ceiling.

### Tokens per unit from the baseline run

`artifact:eval-harness` requires a recorded baseline run. That run is where `tokensPerUnit` comes from, because it is the only place where retries, tool round trips and retrieval context are counted across the fixture set. A single happy-path call undercounts on all three: no retry, no round trip, short context. Production has all three, and the tail is where the ceiling matters.

Record three statistics, not one: the mean, because the bill is the mean times the volume; the median, because that is a typical unit; a high percentile, because that is what the per-run ceiling must clear. Record the number of units behind each statistic as well, because a fixture set is small and curated, not a sample of production traffic. Name the percentile method as well, because with a small set the method moves the figure: over sixty fixtures, p95 sits at about the fourth-largest value (nearest rank: the 57th of 60; linear interpolation: between the fourth- and third-largest), so it rests on a handful of tickets and is not an estimate of the production tail. Size the per-run margin knowing that, and plan to re-derive the ceiling from production usage telemetry once `stage:deployment` has produced some. Split input and output, because they are priced differently and because they grow differently in a loop. Input is re-sent on every turn: the system prompt, the tool schemas, every earlier tool result. If the context grows by roughly a fixed amount per turn, the input tokens a run has spent by turn N grow with N squared, while output grows with N. That is where the money goes in a runaway, and it is why the turn cap and a total-token cap (input plus output) matter more than an output cap. The worked numbers below show the same shape at rest: input near 16,000 against output near 1,800.

If the harness assumes prompt caching, measure the hit fraction from the run. A cache you have not measured is a discount you have not earned. Until you have the number, assume no hits, and if your vendor prices cache writes separately from base input, include the write cost at its own rate; a cache that is written and never read is a surcharge, not a discount.

### Metered tool calls

Tokens are not the only meter. Any tool the agent calls that a vendor bills per call (OCR per page, a hosted search per query, a paid enrichment or geocoding API, per-second compute) is a cost line with its own rate and its own runaway shape. Read your `artifact:tool-authority-matrix` a second time with one question: which of these tools sends an invoice? The matrix does not answer it. The graph requires only `tools`, `principals`, `sideEffecting` and `revocationPath` from that artifact, so metering is something you add: either a `metered` and `billedPer` field on each matrix entry (the graph lists required keys, not a closed set, so extra fields are allowed) or a `toolCallsPerUnit` map in `cost-model.json`, which is the list the call budget keys on. Do both if the matrix is the file your executor reads.

Count them the same way as tokens: per unit, from the baseline run, mean and high percentile, with the fixtures that produced the tail named. Price them in `costPerUnit` beside the token arithmetic, from a list rate with a URL or a labelled placeholder. Then put a per-run call budget in front of every metered tool, checked before the call, whether or not the tool is side-effecting. A metered read is still spend. The exercise scenario has one: an OCR call that a bad scan can trigger over and over, which a token budget never sees and the authority matrix marks read-only.

### Cost per unit as a function of the ADR

Your architecture decision committed you to a shape, and the shape sets the floor. A single agent with a tool loop pays one system prompt and tool schema per turn; an orchestrator with specialists pays a planning call before any work starts and a handoff context on every transition ([section 4 of the orchestration pattern](../../../01-design-patterns/multi-agent-orchestration-pattern.md#4-agent-handoff-protocol) shows what a handoff carries; skip that file's deployment and infrastructure sections, which are tied to one vendor). With placeholder sizes, the floor for the exercise's orchestrator with two specialists is: one planning call of about 3,000 input tokens, then two handoffs each carrying about 2,500 tokens of task context plus the specialist's own system prompt and tool schema of about 2,000, and one return of about 1,500. Roughly 13,500 input tokens (3,000 + 2 x 4,500 + 1,500) before either specialist has read a page of the document. Put that floor in the cost line as a consequence of a decision you already defended, and compare it with what a single agent would have paid for the same unit.

Routing to a cheaper model is the usual lever and the usual trap. Where a step is classification or extraction with a checkable output, routing is close to free and the harness proves it. Where a step is the judgement the unit exists for, routing changes behaviour, and only the harness will tell you. The rule: a routing change is a prompt change. It goes through the harness before it goes into the cost model. The gateway pattern's [model router](../../../01-design-patterns/ai-gateway-pattern.md#2-model-router) and [cost tracker](../../../01-design-patterns/ai-gateway-pattern.md#4-cost-tracker) sit in one request path; the point here is that the router is a behaviour change the cost tracker cannot see. Read those two sections only; the file's deployment and monitoring sections are vendor-specific.

`costPerUnit` is a function of the rates as much as of the shape. Record the URL and the retrieval date beside every list rate, and re-derive the number when a list rate moves or when the model version behind `tokensPerUnit` changes, because a new version of the same model can change the token count of the same run. A `costPerUnit` held fixed under a moved rate is the aggregate-only failure in a new form: a number nobody can recompute.

### Cost per unit by outcome

The unit is "resolved or escalated", and those two outcomes do not cost the same. An agent that escalates on the second turn looks cheapest per unit while it pushes the work onto the humans who receive the escalation. From the same baseline run, split `costPerUnit` by outcome (resolved, escalated, routed to review, whichever your unit has) and record the share of each. Treat the escalation rate as part of the unit economics, not as a quality metric that lives somewhere else. A routing change or a prompt change that lowers the blended `costPerUnit` while moving units from the resolved column to the escalated column is not a saving until the harness shows the outcome shares held. The optional `byOutcome` field in the worked JSON is where that split goes, so the next person to touch the number can see whether it moved because the agent got cheaper or because it gave up sooner.

### Which ceiling the guard enforces

Three ceilings are useful: per run, per user, per day. Enforcing all three is not the goal. Deciding which the guard enforces and which only report is.

Per run is the one to enforce first. The runaway this stage is about is one unit that will not finish, and a per-run budget stops it inside the loop before it consumes anyone else's share. Per day is the backstop when many runs go wrong together.

Per user, or per tenant, depends on who can start a run. Go back to the untrusted inputs in your `artifact:threat-model` (`../05-threat-model/README.md`). If every caller is internal and authenticated and volume per caller is low, a per-user line can stay report-only: enforcing it would stop a legitimate heavy user before it told you anything. If a stranger, a customer or a tenant can trigger the agent, per-user or per-tenant must be enforced, because with only per-run and per-day caps one caller can start runs until the shared daily budget is gone, and the daily cap then denies service to everyone else. That is the reasoning behind the per-tenant `allowed = false` path in the gateway pattern's [rate limiter](../../../01-design-patterns/ai-gateway-pattern.md#3-rate-limiter). Decide which case you are in and write it in the artifact.

Enforce in the unit you can measure at runtime. Token counts come back on every response; currency needs a rate table that drifts and is often the thing you have to redact. Set the enforced ceiling in tokens and turns; let currency be the reported view.

### Guards that enforce

An enforcing guard halts spend by construction, not by attention:

- A turn budget in the executor loop that refuses the next model call past N turns and exits with a typed failure.
- A token budget in the same loop, debited from the usage field on every response, checked before the next call.
- A per-run call budget before every metered tool call, debited per call (or per page, per query, whatever the vendor bills), whether the tool is read-only or not.
- A budget check before every side-effecting call, keyed on the `sideEffecting` flag from your authority matrix. A loop that has exhausted its budget must not get one last write.
- A kill switch the executor reads at the top of every turn, so an operator can stop a unit without redeploying.
- A daily counter in a shared store, incremented atomically, consulted before a new run starts.

Keep the alert; it tells a human the guard fired. It is not the guard.

### Where budgets leak

A guard that checks before the call and debits after the response is the right shape, and it still leaks in five places. Size the ceiling knowing them.

**The last call overshoots.** The check passes with 500 tokens left; the call then sends the whole context and may generate up to its maximum output. One call can overshoot by context plus max output. Close the output half: set the request's maximum output tokens to the remaining budget. That cap needs a floor. Near the end of a budget it hands the model a few dozen tokens, the response stops mid tool call or mid JSON, and the retry path re-sends the whole context, so the cap has bought a truncation-and-retry loop, which is the thing the ceiling exists to stop. So: refuse the call when the remaining budget is below a minimum useful output plus the estimated input, rather than sending a starved request, and never retry a call that stopped at the output cap. The input estimate has to exist before the call, and token counts only come back on the response. Estimate it from the previous turn's reported input plus the tokens appended since, or from a token-counting call if your provider exposes one, and treat it as approximate; that is what the margin on the total-token ceiling is for.

**Retries sit below the check.** A retry wrapper around one tool that lives under the executor can call a deterministically failing tool five times per turn, and the platform's own retry limit is not your ceiling. If the tool is metered, every retry is billed while the token budget never moves. The budget check belongs inside the wrapper, before each attempt, not above it.

**Sub-agents get their own budget, or none.** With an orchestrator and specialists, the budget created for the run has to be the budget every specialist debits. Pass one `Budget` object down, or hand each specialist a reserved slice of it and return the unused part, and have the orchestrator's own check see the sum. A specialist with a fresh budget of its own turns one per-run ceiling into N plus one.

**Parallel calls race the check.** Two tool calls issued in the same turn both read "enough left" and both run. Reserve before the call, atomically, and release or debit after; a plain read-then-call is not a guard when the executor fans out.

**The daily cap only sees runs that have started.** The counter is consulted when a run begins, so every run already in flight can spend up to its per-run ceiling after the daily total is reached. Worst case: runs in flight times the per-run cap. Write that product down and size the daily margin to cover it, or check the shared counter inside the loop as well as at the start.

### How you would know

The proof of the guard is the forced-loop test in step 9 below, and it happens at this stage. The next stage does not grade it. At `stage:incident-simulation` you inject one of the three failure modes the graph marks `injectable`, and none of them is about spend; `eval:incident-detected-by-telemetry` grades whether a pre-existing signal caught the injected mode. The stage-8 lesson does list the stage-6 cost guard as one of the signals you may predict will fire, so if you inject `failure:tool-result-injection` you can shape the payload to cause a fetch loop and watch the cost line as well. Treat that as an extra observation, and do not write the artifact expecting the incident report to judge the guard.

### Writing the JSON

The artifact is JSON with five required keys: `unitOfWork`, `tokensPerUnit`, `costPerUnit`, `ceiling`, `runawayGuard`. The eval has two assertions: `unit-economics` looks for `unitOfWork` and `costPerUnit`, numeric where applicable; `runaway-guard` reads `runawayGuard` and rejects an alert alone. Pass threshold is 1, so both must pass.

There is no runner for these two assertions in the graph; they are applied by reading, with `rubric.md` as the procedure. `check-cost-model.mjs` in this directory is a keyword screen, not a verdict. It checks that the file parses, that all five keys are present, that `unitOfWork` is a non-empty string, that `costPerUnit` is a JSON number, that `ceiling` has per-run, per-day and per-user entries each marked `enforced` with at least one `true`, and that `runawayGuard` has a clause where a halting verb appears next to a call-path term (before, budget, executor, loop, assert, throw). It prints a warning when alert verbs are present. A sentence can satisfy the screen and still describe an alert; only reading the linked commit decides that. Copy it into your repository and run it there; its output is a recorded run of the screen, and the forced-loop log is the evidence for the part it cannot see.

## A worked decision

*Composite scenario. The organisation, numbers and code are illustrative and belong to no real company.*

A support-triage agent for a mid-sized software vendor. The ADR chose a single agent with a tool loop over an orchestrator because the specialists would have shared one context anyway. Tools: search the knowledge base, look up the account, draft the reply, escalate to a human. The last two are side-effecting in the authority matrix. The knowledge-base search is a hosted search service billed per query; the account lookup is an internal service with no meter. Only authenticated support staff can start a run.

**Unit of work:** one ticket resolved or escalated by the agent. A ticket that needed four tool round trips and one retry is one unit.

**Tokens per unit.** The happy-path fixture the team had been quoting used about 3,000 tokens. The baseline run, sixty fixture tickets, said otherwise: median around 14,000 total, mean around 17,800 (input roughly 16,000, output roughly 1,800), p95 near 31,000, driven by tickets where the first search returned nothing useful and the agent searched again with a longer context. The team computed p95 by nearest rank, the 57th of the 60 sorted totals, which is the fourth-largest; interpolating instead would put it between the fourth- and third-largest. Either way it rests on a handful of tickets, not a production tail, which is why the ceiling below sits at twice it rather than a tight multiple, and why the file says the ceiling is re-derived from production usage once stage 7 has telemetry. No caching was in place, so no hit fraction was assumed.

**Metered calls per unit.** From the same run: search queries mean 2.3 per unit, p95 of 5, the same hard tickets that drove the token tail. Account lookups: one per unit, unmetered.

**Cost per unit.** Rates here are placeholders chosen for the arithmetic, not any vendor's price: 1.00 per million input tokens, 5.00 per million output, 0.002 per search query. Model, on the mean: (16,000 / 1,000,000 x 1.00) + (1,800 / 1,000,000 x 5.00) = 0.016 + 0.009 = 0.025. Search: 2.3 x 0.002 = 0.0046. Total 0.0296. The file carries the placeholder rates and their label so anyone can recompute it, and so the number can be re-derived the day a real list rate is substituted.

**By outcome.** The same run split by what the agent finished with: 72 percent of tickets resolved, at a mean of about 19,500 tokens and 2.6 searches, so about 0.0327 each; 28 percent escalated, at about 13,400 tokens and 1.5 searches, so about 0.0216 each. The weighted total comes back to 0.0296. Escalated tickets are cheaper because the agent stops sooner. The team recorded both columns so that a later change that lowers the blended number by moving tickets into the second column shows as what it is.

**Ceiling.** Per run, enforced: 8 model turns, 60,000 total tokens, or 6 search queries, whichever first. Sixty thousand is roughly twice the run's p95: room for a hard ticket, none for a loop. Six queries is the p95 plus one. Per day, enforced: a token budget from expected daily volume times the mean, with a margin the team wrote down as the number of runs that can be in flight at once times the per-run cap, because that is what the daily counter cannot stop. Per user, report only, with the reason recorded: every caller is an authenticated employee, so the threat model's untrusted inputs are the ticket text and tool results, not the caller.

**Runaway guard.** A `Budget` object created per run and passed into the executor loop. Before every model call, every search call and every side-effecting tool call the loop calls `budget.assertRemaining()`; on exhaustion it throws a typed `BudgetExceeded`, the ticket is marked for a human, and no further call is made. Each model request sets its maximum output tokens to what the budget has left, with a floor: when fewer than 400 output tokens remain, or the estimated input (last turn's reported input plus what was appended since) exceeds the remainder on its own, the loop refuses the call instead of sending a starved one, and a response that stopped at the output cap is never retried. After each response the loop debits the usage field, after each search it debits one query, and it increments a per-day counter in a shared store atomically; the same assertion consults that counter before a new run starts. A kill switch is read at the top of every turn. Single agent, so there is no sub-agent to hand a slice to. The commit adding `Budget` and the three checks is linked. The dashboard alert at 80% of the daily budget stayed, labelled reporting.

```json
{
  "unitOfWork": "one support ticket resolved or escalated by the agent",
  "tokensPerUnit": {
    "statistic": "mean over the harness baseline run",
    "n": 60,
    "input": 16000,
    "output": 1800,
    "median_total": 14000,
    "p95_total": 31000,
    "p95Method": "nearest rank: the 57th of 60 sorted totals, the fourth-largest",
    "p95Note": "rests on a handful of fixtures; not a production tail; re-derive from usage telemetry after deployment",
    "includes": ["system prompt", "tool schemas", "retrieval context", "tool round trips", "retries"],
    "cacheHitFraction": 0,
    "measuredFrom": "<repo-url to the recorded baseline run>"
  },
  "toolCallsPerUnit": {
    "search_kb": { "mean": 2.3, "p95": 5, "metered": true, "billedPer": "query" },
    "get_account": { "mean": 1, "metered": false }
  },
  "costPerUnit": 0.0296,
  "rates": {
    "inputPerMillion": 1.0,
    "outputPerMillion": 5.0,
    "searchPerQuery": 0.002,
    "label": "placeholders for arithmetic; not vendor rates; replace each with a list rate, its URL and the date it was read",
    "modelVersion": "<the model version the baseline run used; re-derive when it changes>"
  },
  "arithmetic": "0.016 input + 0.009 output + 0.0046 search (2.3 x 0.002) = 0.0296",
  "byOutcome": {
    "resolved": { "share": 0.72, "meanTotalTokens": 19500, "meanSearches": 2.6, "costPerUnit": 0.0327 },
    "escalated": { "share": 0.28, "meanTotalTokens": 13400, "meanSearches": 1.5, "costPerUnit": 0.0216 }
  },
  "ceiling": {
    "perRun": { "turns": 8, "totalTokens": 60000, "searchQueries": 6, "enforced": true },
    "perDay": {
      "totalTokens": "<expected units x mean x margin>",
      "margin": "<max runs in flight x per-run cap>",
      "enforced": true
    },
    "perUser": {
      "unitsPerDay": "<reporting threshold>",
      "enforced": false,
      "whoCanStartARun": "authenticated support staff only",
      "reason": "callers are authenticated employees; see threat model untrusted inputs"
    }
  },
  "runawayGuard": {
    "mechanism": "Budget.assertRemaining() before every model call, every metered search call and every side-effecting tool call in the executor loop; throws BudgetExceeded and halts the run; max output tokens per request set to remaining budget, and the call is refused when fewer than 400 output tokens remain or the estimated input exceeds the remainder; a response stopped at the output cap is not retried; per-day counter checked before each new run; kill switch read at the top of every turn",
    "commit": "<repo-url to the commit that adds it>",
    "forcedLoopLog": "<repo-url to the log of the run halting at the ceiling with alerts muted>",
    "alertsAreReportingOnly": true
  }
}
```

Both assertions pass, and a reviewer can recompute 0.0296 from the tokens, the query count and the labelled rates without asking anyone.

## Producing the artifact

1. Name the unit in one sentence a stakeholder would accept as "done". If you cannot, it is in your system brief; go back and read it.
2. Open the recorded baseline run from `artifact:eval-harness` and extract per-unit usage, input and output separately, and the count of calls to every metered tool. If the run does not record usage, fix the harness first; this stage cannot be done from a single call.
3. Compute mean, median and a high percentile for tokens and for each metered tool, and record the number of units behind them. Note which fixtures produced the tail and why, and how many of them the percentile rests on.
4. Measure the cache hit fraction from the run if caching is on; otherwise set it to zero and say so.
5. Choose rates for tokens and for every metered tool: a list rate with its URL and the date you read it, or a placeholder labelled as one. Never a negotiated rate. Record the model version the run used.
6. Compute `costPerUnit` from the mean tokens, the mean metered calls and the rates, and write the arithmetic down. Split it by outcome from the same run and record the share of each.
7. Set the per-run ceiling from the high percentiles with a margin you can justify given how few fixtures the percentile rests on, the per-day ceiling from expected volume with a margin that covers runs in flight, and mark each ceiling enforced or report-only. Write down who can start a run and, from that, why per-user is enforced or not.
8. Implement the guard in the executor: turn budget, token budget, a call budget before every metered tool, a check before every side-effecting call, max output tokens capped at the remaining budget with a refusal below a minimum useful output or when the estimated input alone exceeds the remainder, no retry of a response that stopped at the cap, a kill switch, a shared daily counter. If the shape is an orchestrator, pass one budget into every specialist. Commit it separately so the link is clean.
9. Prove it. Mute the alerts in a non-production environment, force a loop that hits the ceiling you expect to trip first (in a document agent, that is often the metered call budget), confirm the run halts there, and keep the log. This log is the primary `eval-run` evidence for the guard.
10. Write `cost-model.json` with the five keys, run `check-cost-model.mjs` against it from your own repository, keep its output, and scan the file for any rate not labelled list or placeholder. The script is a keyword screen; `rubric.md` is the grade.
11. Submit with at least one piece of evidence the stage accepts: a `repo-url` a stranger can open, or an `eval-run` that can be re-executed.

## Check yourself

1. Your unit is "one conversation". A user opens one conversation and asks eleven unrelated questions. One unit or eleven, and what does your answer do to the per-run ceiling?
2. The baseline run's mean is twice its median. Which goes in `costPerUnit`, which sizes the ceiling, and what would change either choice?
3. A colleague routes the "draft the reply" step to a cheaper model and shows a lower `costPerUnit`. What must be true of the harness before that number is allowed into the artifact?
4. Your guard is a daily spend cap checked once a minute by a scheduled job. How much can a loop burn in the gap, and does that make the guard an alert?
5. The executor enforces a turn budget, but the retry wrapper around one tool sits below the executor and retries five times per turn. Where is the budget being spent, and where does the check belong?
6. Caching was turned on last week and nobody re-ran the harness. Is `tokensPerUnit` now too high, too low or unknown, and what does that do to the ceiling?
7. The only rate you have is the one in your contract. What goes in the file, and how does a reviewer recompute `costPerUnit` without seeing the contract?
8. A run's context is 4,000 tokens at turn one and each turn adds about 2,000 (a tool result and the model's reply). Input tokens re-sent on the eighth turn alone, and input tokens spent across all eight turns: work both out, then compare to the output spent if the model writes about 300 tokens a turn. Using the worked example's per-run ceiling of 8 turns and 60,000 total tokens, which cap would have stopped this run first, at which turn, and what does the check before that turn see if it only compares the running total to the ceiling?
9. Your document agent's OCR vendor bills per page and the tool is read-only in the authority matrix. The token budget is intact and the OCR bill is not. Which check is missing, where does it sit, and what unit does it count?
10. The orchestrator creates a `Budget` per run; each specialist, written by a different engineer, creates one too. How many per-run ceilings does one run have, and what is the smallest change that makes it one?

## Go deeper

- [AI gateway pattern, sections 2 to 4](../../../01-design-patterns/ai-gateway-pattern.md#2-model-router) — model router, rate limiter and cost tracker in one request path, with per-tenant and daily limits that refuse rather than warn. Skip the vendor-specific sections: deployment configuration, and the monitoring integration under Monitoring and Observability.
- [Multi-agent orchestration pattern, section 4 "Agent Handoff Protocol"](../../../01-design-patterns/multi-agent-orchestration-pattern.md#4-agent-handoff-protocol) — what a handoff carries, which is what an orchestrator shape pays on every transition. Skip the vendor-specific sections: the implementation guide, deployment considerations and the monitoring dashboard.
- `../05-threat-model/README.md` — the untrusted-inputs reasoning that decides whether per-user is enforced.
- `../04-eval-harness/README.md` — the fixture rules you must keep to when adding a failing tool call to the baseline.
- `../../../02-learning-paths/micro-modules/operations-cost-optimization.md` — a routing-and-caching procedure; its numbers are unsourced, so run its before-and-after through your harness.
- `../../../site/lib/academy-graph/production-agent-systems.ts` — the stage node, the artifact's required keys and redaction rule, and the eval's two assertions.
- `check-cost-model.mjs` — the keyword screen, runnable.
