# 07 — Deployment

Stage `stage:deployment` · Artifact `artifact:deployment-record` · Eval `eval:deployment-reachable`

Everything you have produced so far in this path is a document, checked by reading it. This stage is checked by an HTTP request from someone who is not you.

## The decision

**Where does it run so a stranger can reach it, and how do you roll it back?**

You cannot defer this one because the two stages after it consume it. The incident simulation needs a running system to break and a telemetry signal that existed before the break. The portfolio needs links that resolve for a logged-out visitor. Neither can be faked from a repository.

There is a second reason. Until the system runs, the authority matrix is a drawing and the cost model is arithmetic. Deployment is where the paper model meets the running model, and only the running one matters. Every stage before this had a way to be quietly wrong. This one does not.

The graph makes the bar explicit. The evidence rule for this stage accepts only a `deploy-url`, no older than 90 days when checked. A repository link does not count. An eval run does not count. Something has to be up.

## What goes wrong

**Health check that lies.** The route returns 200 while the model, retrieval or tools are unreachable. The eval passes; the system is down. Detection: call the route, then break the dependency you most fear (rotate the model key to garbage, point retrieval at an empty index) and call it again. If the status did not change, the route checks nothing. Make it exercise that dependency.

**Rollback as intention.** The rollback section describes a plan nobody has run. Under incident pressure the command turns out to need a flag, a permission, or a version that no longer exists. Detection: run it, against a real previous version, on the platform, with the principal that would run it during an incident, and watch the live URL change. If you cannot say what the URL returned before and after, you have not tested it.

**One credential in production.** The authority matrix declared separate principals; the deploy wired one service key to everything. Detection: count the distinct credentials or identities (scoped secrets, roles, workload identities) that back side-effecting tools and count the principals in `artifact:tool-authority-matrix`. If the runtime has fewer, the matrix is fiction. Then revoke one and confirm exactly one tool stops working, on a path where that tool is allowed. A route that denies the tool at the authority layer fails whether the credential is live or dead, so a failure there proves nothing.

**Rollback that reverts one component.** The command promotes the previous release id and the live route reports it, so the drill counts as passed. The prompt bundle, a config value or the model pin lived outside the release and stayed at the new version. Detection: the second release in the drill must change every component the record claims to revert, the live route must report an identifier for each, and every identifier must go back. A drill that changes only code cannot catch this.

**Internal URL leak.** The record names an internal host, a dashboard behind your SSO, or a private IP. It is on this artifact's redaction list (`redactionRule: ['internal URLs']`) because the portfolio eval later scans every source artifact's redaction list and fails on a hit. Detection: open the record in a private browser window with no sessions. Anything you would have to log in to see is internal.

## Concepts

### Deployment is a stage, not a step

A step is something you do on the way to something else. A stage ends when its eval passes, and this eval is not run by you. A deploy you watched succeed in a terminal is not done. A deploy that answered a stranger's GET with a 2xx and a body, at the time they checked, is done.

### Choosing a surface a stranger can reach

You need a public route. You do not need a public agent. The trade-off is between how much the route proves and how much it exposes.

- **A liveness route** (process is up) proves almost nothing about an agent system and costs nothing per hit. It will pass the eval and lie about the system.
- **A readiness route** (dependencies answer) proves the parts you most fear are reachable. It costs a real call per hit unless you cache the probe result, and it takes your public URL down when a vendor blips. For this stage that honesty is the point.
- **A demo route** runs one fixed fixture through the agent with side-effecting tools denied by the authority layer. It proves the most and costs the most per hit; it needs a rate limit and a spend cap wired to the runaway guard from `artifact:cost-model`. Set the per-IP ceiling above the handful of requests a reviewer makes, including a re-check; a 429 on the second request is a FAIL on a working system.
- **A fully open chat endpoint** hands every stranger a bill and an injection vector. Not for the eval.

Behind authentication: anything that can write, send, spend or delete, and anything that returns data about a real person. The authority matrix already names those tools. The public surface touches none of them.

One wiring mistake turns the honest route into an outage amplifier. If your platform polls a health path to restart or de-route instances, as Kubernetes does (its [probe documentation](https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/) says a container that fails its liveness probe past the tolerance is restarted, a Pod that fails its readiness probe is removed from its Services' endpoints, and an incorrectly implemented liveness probe can cascade into restarts under load), do not point that probe at the route that probes the model. A short vendor outage would become every instance restarting or de-routed at once, and your system is down harder than the vendor is. Keep the platform's restart probe on a shallow process check. Put the deep dependency check on a separate route the platform does not use to restart or de-route, cache its result as the worked example does, and write in the record which route the platform probes and which the reviewer `GET`s.

### Rollback before rollout

Write the rollback command before the first deploy, then execute it once against a real previous version. "Redeploy the old commit" is an intention. A command has a binary, a subcommand, a target, a version identifier and a principal allowed to run it, and each is a way it can fail when you need it.

Rollback also has a scope wider than code. An agent's behaviour is the product of code, a prompt bundle, eval fixtures, a model pin, tool configuration and sometimes a schema. Decide which your command reverts and write down which it does not. Last week's code against this week's prompt is a third version nobody has tested.

The drill has to be able to catch that. A second release that differs from the first by one line of code rolls back cleanly while the prompt store stays where it was, and you learn nothing. So the second release changes each component the record claims the command reverts (code, prompt bundle, configuration, and the model pin where the provider offers two versions), and the reviewer route reports an identifier for each: release id, prompt bundle digest, config digest, model id. Roll back and require every reported value to go back. Then roll forward and require every value to return, so you submit the version the record describes, and the record holds three ids: the release before the drill, the one the drill landed on, and the one live at submission.

Two more checks while the platform is open: how long previous versions are retained (a target that expires in seven days is a rollback with a deadline), and whether the rollback principal is one from your matrix or an ambient admin login that will not exist at three in the morning.

Three cases where the command runs and still does not restore the previous state. A forward-only data or schema migration: the old code now runs against the new schema, which is the untested third version again. Make migrations expand-then-contract, so the previous release still runs against the new schema, and only contract after the release it would roll back to has aged out. A model pin the provider has retired: the pin is in the bundle, but the version it names no longer answers. Write in the rollback section whether the pin can still be restored today and, if not, which version you fall back to and which harness run says it is acceptable. Runs in progress during the promote: an agent halfway through a tool sequence, or a queued tool call that arrives after the switch, spans two versions. State what happens to them, drained, retried from the start, or abandoned with a record, because the incident stage will ask which version produced the side effect.

### The promote gate

`pattern:eval-before-deploy` is the graph's name for one rule: a behaviour change is measured before a customer meets it. Stage 04 built the instrument, `artifact:eval-harness`, with an exit code CI can read; the [stage 04 module](../04-eval-harness/README.md) covers what makes that instrument honest, and this stage does not repeat it. This stage decides where in the deploy the instrument sits.

Running the harness in CI against the code catches a code or prompt regression and tests nothing about the platform: the credentials the platform injects, the model the pin resolves to there, the config store the CLI does not manage. The gate that matters runs against the candidate release on the platform, before traffic moves to it. Bring the candidate up where traffic does not reach it (a preview slot, a second instance, a canary that receives a fixed slice), run the harness against that URL, and let the promote step require the passing exit code. If the platform can split traffic, promote in steps: a slice, the harness plus the live signal from the locator, then the rest. While the gate is red nothing moves traffic by hand.

The same gate runs against the rollback target, because a rollback promotes a version nobody has measured in today's surroundings: the same code against today's credentials, today's index and the model the pin resolves to today. Run the harness against the previous release before you need it and keep the run id in the rollback section. A target with no passing run is not a rollback target; it is a guess with a version number. Where the provider has retired the model pin, the run against the fallback version is what says the fallback is acceptable, and its id is the one the rollback section cites.

### The observability locator

The incident stage requires detection from "a log, metric, or eval that predates the injection". A signal can only predate the injection if it exists now. So this is where you decide where logs, metrics and eval runs live, and write down how to find them.

A locator is not a link. It is a description precise enough that a colleague with access could open the thing without asking you: the log store and stream or query, the metrics namespace and the request-level metric's name, the trace project and the tag that marks agent runs, where results from `artifact:eval-harness` are written. The dashboard itself is almost always an internal URL; the locator is its redaction-safe form.

Two properties matter more than the tool: retention and correlation. If logs retain for less time than the gap to the incident simulation, the signal you need will have been deleted. If one identifier cannot follow a request from the public route through the model call to each tool call, you will detect the incident by reading code, which the incident eval rejects.

### Principals become credentials

`artifact:tool-authority-matrix` named principals, one per authority class, each with a revocation path. Now they become secrets in a runtime. The temptation is one service key that can do everything, because it makes the first deploy work in one attempt. Resist it: the incident stage can inject `failure:ambient-authority`. The graph's detection text for that failure is: "The tool authority matrix has more tools than distinct principals. Count them; the mismatch is the finding." That count is on paper. This stage extends it one layer down: count the distinct credentials or identities behind side-effecting tools in the runtime and compare to the principals. Fewer credentials than principals is the same finding, found in the deploy instead of the matrix.

Practically: one credential or identity per principal, whether that is a scoped secret, a role or a workload identity the platform issues, named after the principal and injected only into the component that holds that authority. A short-lived token from a role is as much a principal as a stored key; the point is that revoking it stops exactly one authority class.

Then test the revocation path you wrote, and test it where it can fail. Rotate or revoke one credential and run the tool it backs on a path where the authority layer allows that principal: an authenticated internal fixture, a non-public route, a test the deploy pipeline runs. Not the public demo route, which denies side-effecting principals whatever the credential holds; a failed label there proves the denial, not the revocation. Require the failure to be an authentication error from the vendor or the proxy in front of it, not an authority-layer denial, and require the other tools to keep working. If more than one fails, two principals share a credential and the matrix is wrong in the running system. Restore the credential and run the fixture again until the tool succeeds.

Sometimes the vendor forces a mismatch, in one of two shapes. One key per account and two of your principals call that vendor: revoking the key stops two authority classes. Or one principal calls the vendor but the account key can do more than that principal's class (create a label, and also void, refund or export): the blast radius of the credential is the account, not the task. In both, the honest move is to say so. Record it as an accepted gap, put a proxy or scoping layer between the tools and the key so that the layer, not the key, decides what each principal can do, and write down which principal holds what if the layer is bypassed.

### Freshness

This stage's evidence expires 90 days after it was last verified, not 90 days after you deployed. That is the graph marking the difference between having deployed and running: a system that has run for a year and answered a reviewer today is fresh, and a system that was up once and is down when checked does not meet the bar. Keep it up through the incident and portfolio stages, and if the platform sleeps idle deployments, know what a cold start does to the first request. The reviewer waits 30 seconds, cold start included.

### Writing the record

Three required sections: live URL, rollback command, observability locator. Short by design: a stranger reaches the system, a colleague recovers it, a future you finds the signal. Redact internal URLs before it leaves the cohort; the portfolio eval will check.

## A worked decision

*This scenario is a composite. The system, the team and the platform are invented for teaching; no real organisation is described.*

The system is a returns-triage agent for an online store: it reads a return request, retrieves the order and the returns policy, and drafts either an approval with a shipping label or an escalation to a human. Its authority matrix has three principals: `reader` (order lookup, policy retrieval; no side effects), `labeller` (creates a shipping label; side-effecting) and `escalator` (opens a ticket for a person; side-effecting).

**Surface.** An open chat endpoint is rejected at once: it would let a stranger create shipping labels. A liveness route is rejected because it would pass with the model key revoked. They settle on three routes. `GET /live` returns 200 when the process can serve a request and nothing else; the platform's own restart probe points here, so a vendor outage never triggers a restart loop. `GET /health` probes the model with a one-token request and the retrieval index with a fixed query, caches the result for sixty seconds so a stranger cannot run up the bill, and returns `{"model":"ok","retrieval":"ok","release":"<release id>","prompt":"<bundle digest>","config":"<config digest>","model_id":"<pinned model>"}`, or a 503 with the same shape and the failed probe marked `"down"` if either fails. The record states the sixty-second cache, so a reviewer who breaks nothing but re-requests too soon knows why the body did not change. `GET /demo` runs one canned return request through the full agent with `labeller` and `escalator` denied by the authority layer, rate-limited per IP at a ceiling a reviewer making a handful of requests will not hit, under a daily spend cap wired to the runaway guard. The eval needs only `/health`; `/demo` is for the portfolio. The record says which route the platform probes and which the reviewer fetches.

**Promote.** The deploy script brings the candidate release up on a preview slot that receives no traffic, runs the stage 04 harness against that slot's `/demo`, and promotes only on the passing exit code. The run id goes into the release notes. The same script, pointed at the previous release, gives the rollback target its run id; that id goes into the rollback section.

**Rollback.** The platform's CLI can promote a previous release by id. For the drill they cut a second release that changes every component the record will claim to revert: one line of code, one word in the system prompt, one config value, and the model pin moved to the provider's other current version, so all four values in the `/health` body change. The first attempt to roll back fails: the deploy principal can deploy but cannot promote. They grant the permission, run the command, and watch `/health` report the previous release id, and the previous config digest and model id, while the prompt digest stays at the new value. The system prompt lives in a config store the CLI does not manage, so the "rollback" was old code against the new prompt, and only the prompt digest in the body showed it. They move the prompt into the release bundle so one command reverts both, repeat the drill until every value goes back, then roll forward and confirm every value returns to the newer release. The record notes that eval fixtures are versioned separately and are not reverted. The returns-policy index has no schema migration in this release, and they write that down too, with the rule that any future migration ships expand-first. The final command, release id as a placeholder, goes into the record with the three release ids (before the drill, landed on, live at submission), the harness run id for the rollback target, the time the second colleague measured from the request to `/health` reporting the earlier release, and the one permission grant it needed. They have run it once, in both directions.

**Observability.** Logs go to the platform's log stream, retained for thirty days, longer than the gap to the incident stage. Every request gets an id at the public route, attached to the model call and each tool call; the locator names the field. Traces go to a tracing project tagged `returns-triage`. Harness results land in a `runs/` directory in the repository, commit hash in the filename. The locator names all three, the retention, and the correlation id, and omits the dashboard URL, which is behind the team's SSO.

**Credentials.** Three credentials, `READER_KEY`, `LABELLER_KEY`, `ESCALATOR_KEY`, each injected only into the component that uses it. The label vendor issues one key per account, and that key can create, void and refund labels. Only `labeller` calls the vendor, so no two principals share it; the gap is the second shape: the account key carries more authority than `labeller`'s class. They put a small proxy between `labeller` and the vendor that holds the account key and accepts only label-creation calls, and the record states the gap as: `labeller` reaches the vendor through a proxy that narrows an account-wide key; if the proxy is bypassed, `labeller` holds the account's full authority, void and refund included. The revocation test cannot run on `/demo`, where `labeller` is denied by the authority layer whatever the key holds. They run it from an authenticated internal fixture where `labeller` is allowed: rotate `LABELLER_KEY` to a dead value, run the fixture, and require the failure to be a 401 from the proxy, not a denial from the authority layer, while lookup and escalation still succeed. Then they restore the key and run the fixture again to a created label. The matrix and the runtime now agree, with one gap written down.

**The record.** Live URL: `/health` on the public hostname, with a line saying it probes model and retrieval, caches for sixty seconds, returns 503 naming the failed probe, and that the platform's restart probe uses `/live`. Rollback command: the CLI promote command with the release id placeholder, what it does and does not revert, the three release ids, the harness run id for the rollback target, the measured time and the permission it needed. Observability locator: log stream name and retention, trace project and tag, runs directory, correlation id field. Nothing in it requires a login to read.

## Producing the artifact

1. Open `artifact:tool-authority-matrix` and list the side-effecting tools. They define what stays behind authentication.
2. Choose the public route. Make it exercise the dependency you most fear. If it costs money per hit, cache the probe or rate-limit the route, and connect the cap to the runaway guard from `artifact:cost-model`. Write down what the route returns when that dependency fails.
3. Find the path the platform polls to restart or de-route an instance. Point it at a shallow process check, not at the route from step 2, and note both routes for the record.
4. Map each principal in the matrix to one credential or identity (a scoped secret, a role, a workload identity), named after the principal. Where a vendor forces a shared key, put a scoping layer in front of it and record the gap.
5. Write the exact rollback command before the first deploy, with the version identifier form and the principal that runs it. State whether this release carries a migration and whether the model pin it reverts to still answers.
6. Wire the promote gate. The candidate release comes up where traffic does not reach it, the harness from `artifact:eval-harness` runs against that URL, and the promote step requires the passing exit code. Run the same gate against the release the rollback lands on and keep its run id.
7. Deploy. Then cut a second release that changes each component the record claims the rollback reverts: code, prompt bundle, configuration, and the model pin where the provider offers two versions. Make the reviewer route report an identifier for each, so a rollback that reverts only one is visible.
8. Execute the rollback. Confirm every reported value went back to the earlier release, not only the release id. Note the time from the request to that report and every lookup or permission it needed. Fix whatever the command needed (a flag, a permission, a scope decision) and record the final form. Then roll forward, confirm every value returned, and record the release id before the drill, the one it landed on, and the one live at submission.
9. Rotate one credential to a dead value. On a path where its principal is allowed (an authenticated internal fixture, not the public route that denies it), confirm exactly one tool fails, with an authentication error from the vendor or proxy rather than an authority-layer denial. Restore it and confirm the tool works again.
10. Decide where logs, metrics, traces and eval runs live. Confirm retention outlasts the gap to the incident stage and one identifier follows a request through model and tool calls.
11. Write the record with the three required sections: live URL, rollback command, observability locator.
12. Open it in a private browser window with no sessions. Remove any URL you would have to log in to see.
13. From a machine or network that is not yours, after the platform's idle timeout has passed, `GET` the live URL. Require a 2xx and a non-empty body inside 30 seconds. Submit that URL as the `deploy-url` evidence for `artifact:deployment-record`.

## Check yourself

1. Your health route probes the model with a real request and a stranger starts calling it every second. What do you change, and what does the change cost you in honesty?
2. The platform retains previous releases for seven days and your incident simulation is later than that. Is your rollback command still a rollback? What do you do about it?
3. Your rollback reverts code and prompt but not eval fixtures. Name a situation where that is correct and one where it produces a version nobody has tested.
4. Two of your three principals need the same upstream API key because the vendor issues one per account. Does the running system still match the matrix? What goes in the record, and what sits between the tools and the key?
5. Your locator is precise but the log store retains twelve hours. What does the incident stage's `detection-source-is-telemetry` assertion make of that?
6. A reviewer gets a 2xx and the platform's "sleeping" page. Which verdict does the rubric give, and what would you have had to do the day before to get a different one?
7. The platform's restart probe and the reviewer's route are the same `/health`. The model vendor is down for four minutes. Trace what the platform does to your instances in those four minutes, and in the ten after.
8. Your release adds a column and the old code ignores it. The next release renames it. Which of the two can you roll back, and what does that tell you about how to ship the second?
9. Which single line of your record would you most regret pasted into a public portfolio unchanged?
10. You rotate `LABELLER_KEY` to garbage, hit `/demo`, and label creation fails. What have you shown, and what would you have to run instead to show the revocation path works?
11. Your rollback drill used a second release that changed one line of code, and `/health` reported the earlier release id within a minute. Name two components that could still be at the newer version and say what the route would have to report for you to know.
12. The harness run against your rollback target is three weeks old and the provider has since retired the model pin. Is the target still a rollback target? What do you run, and what goes in the record?

## Go deeper

- [`04-eval-harness/README.md`](../04-eval-harness/README.md) — the harness the promote gate runs; what its exit code means and why fixtures are versioned apart from prompts, which is why a rollback does not revert them.
- [`01-design-patterns/llm-ops-pattern.md`, section 3 "Monitoring and Observability"](../../../01-design-patterns/llm-ops-pattern.md#3-monitoring-and-observability) — read that section against your locator. Skip the vendor-specific sections: deployment configuration and the monitoring dashboard.
- [`01-design-patterns/model-lifecycle-management.md`](../../../01-design-patterns/model-lifecycle-management.md) — promotion, registry and rollback as a lifecycle, and the audit trail a rollback should leave.
- [`02-learning-paths/micro-modules/operations-langfuse-telemetry.md`](../../../02-learning-paths/micro-modules/operations-langfuse-telemetry.md) — a short telemetry baseline: trace propagation, metadata capture, alerting.
- [`12-concepts/caching-and-observability.md`](../../../12-concepts/caching-and-observability.md) — the concept list for traces, spans and cost tracking; a checklist for what the locator should find.
- [`08-governance/human-review-checklist.md`](../../../08-governance/human-review-checklist.md) — when a deploy or prompt change needs a person to approve it, and what that person needs in front of them.
