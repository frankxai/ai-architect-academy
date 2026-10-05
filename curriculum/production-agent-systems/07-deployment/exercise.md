# Exercise — Deployment

Stage `stage:deployment` · Deliverable `artifact:deployment-record` · Checked by `eval:deployment-reachable`

## Scenario

*Composite. The system and the situation are invented for this exercise; no real organisation is described.*

You are carrying the agent system you have built through the previous six stages. It has a brief, an architecture decision, a tool and authority matrix with named principals, an eval harness that fails on regression, a threat model, and a cost model with a runaway guard. All of it lives in a repository. None of it is running anywhere a stranger can reach.

A colleague from a different team has agreed to be the stranger. They will `GET` one URL you give them, from their own machine, with no credentials, at a time you do not control, and report the status code and whether the body was empty. That is the whole check. They will not read your repository first.

Separately, a second colleague will, without warning, ask you to roll back to the previous version while they watch the live URL. They will time how long it takes from the request to the URL reporting the earlier version, and note every step where you had to look something up, ask for a permission, or discover a missing flag.

Both colleagues will later need to find your logs without asking you where they are.

## Deliverable

Exactly one artifact: `artifact:deployment-record`, with its three required sections filled in.

| Section | What must be there |
|---|---|
| **live URL** | A public `https://` URL that returns a 2xx with a non-empty body to an unauthenticated request within 30 seconds, cold start included. The route must exercise at least one dependency the agent actually needs (model, retrieval or a tool), not just the process. State which dependency it probes and what it returns when that dependency fails (status and body shape). If the probe result is cached, state the cache TTL. The body must expose the release id currently live, and an identifier for each other component the rollback reverts (prompt bundle, configuration, model pin). State which route the platform's own restart or readiness probe uses; it must not be this one. |
| **rollback command** | The exact command, with the version identifier form shown, that you have executed at least once against a real previous version. State which parts of the system it reverts (code, prompt bundle, fixtures, model pin, configuration, schema) and which it does not. Record the release id before the drill, the id the drill landed on, and the id live at submission; the observed time from the request to the live URL reporting the previous version; and every step that needed a lookup, a permission or a missing flag. Record the last harness run id for the rollback target. Say whether this release carries a migration, and whether the model pin it reverts to still answers. |
| **observability locator** | Where logs, metrics or traces, and eval runs live, described precisely enough that a colleague with access could open them without asking you: the log store and stream or query, the metric or trace location and its identifying tag, where eval runs are written, the stated retention, and the name of the correlation id that follows a request. Names and identifiers, not internal links. |

The graph records this artifact's format as `url` and marks it `publicSafe`. Its redaction rule is `internal URLs`. The record itself may live as a markdown file in your repository; the evidence you submit is the deploy URL.

## Constraints

- The public route must not be able to trigger any tool the authority matrix marks as side-effecting. If it runs the agent at all, side-effecting principals are denied at the authority layer, not by hoping the fixture never asks.
- One credential or identity per principal in `artifact:tool-authority-matrix` (a scoped secret, a role, or a workload identity), injected only into the component that holds that authority. A single credential that backs more than one side-effecting tool fails the spirit of this stage even though this eval does not check it; the incident stage can. Where a vendor issues one key per account and two principals need it, record the accepted gap and put a proxy or scoping layer in front of the key.
- If the public route costs money per hit, it is rate-limited or its probe result is cached, and the cap connects to the runaway guard from `artifact:cost-model`.
- The rollback command is written before the first deploy and executed at least once before you submit. "Executed" means you watched the live URL report the earlier version for every component the command claims to revert, then rolled forward and watched each return.
- No release reaches traffic without a harness run against it on the platform, and the release the rollback lands on has a harness run id you can cite. `pattern:eval-before-deploy` is the graph's name for this; the harness is the one from `artifact:eval-harness`.
- The credential revocation test runs on a path where the revoked principal is allowed by the authority layer. A failure on the public route, which denies that principal regardless, does not count.
- Log or trace retention must outlast the gap between now and your incident simulation, and one request identifier must follow a request through the model call and each tool call.
- No internal hostnames, private IPs, dashboard links behind a login, or credential values anywhere in the record.
- The URL must be reachable when checked, not only when you deployed. The reviewer waits 30 seconds for a response, one cold start included, and follows redirects only on the same host. If the platform sleeps idle deployments, either keep it warm or make sure the first request after a cold start still returns the system's own 2xx with a body inside that window. A platform "sleeping" page served with 200 is a FAIL, not a near miss.
- The platform's own restart or readiness probe points at a shallow process check, not at the route that probes the model or retrieval. A vendor outage may take your public route to 503; it must not take your instances into a restart loop.

## Time box

One working day. Split it deliberately:

- **First half:** get any honest route up and reachable by a stranger. If the deploy is not answering by the midpoint, stop adding to the surface and simplify it. A minimal readiness route that truthfully probes one dependency beats an ambitious demo route that is not up.
- **Second half:** promote gate, rollback, credentials, observability, and the record. Run the harness against the candidate and the rollback target. Execute the rollback against a second release that changed every component the command reverts, then roll forward. Rotate one credential and, on a path where its principal is allowed, confirm exactly one tool fails. Write the record and redact it.

If the time box runs out with a reachable URL and an untested rollback, you are not done. The eval requires only that the rollback section is non-empty, but the stage requires that you have run it, and the incident stage will find out whether you did.

## Submission checklist

Before you submit the deploy URL as evidence:

- [ ] From a network or machine that is not yours, after the platform's idle timeout has passed, `GET` the live URL with no credentials. Status is 2xx. Body is non-empty and is the system's own response. Time to first byte is under 30 seconds.
- [ ] Break the dependency the route probes (rotate a key to a dead value, empty the index). Wait longer than the probe cache TTL, then re-request. The route no longer returns a 2xx, and what it returns matches what the record says it returns. Restore it. The record states the TTL.
- [ ] The record names the dependency the route probes and the route the platform's own probe uses, and they are different routes.
- [ ] The second release in the rollback drill changed each component the record claims the rollback reverts (code, prompt bundle, configuration, model pin where possible), and the live URL's body reports an identifier for each.
- [ ] The rollback command is copied into the record verbatim, with the version identifier form shown, and you have executed it at least once and seen every reported identifier go back to the earlier release.
- [ ] After the rollback you rolled forward and saw every identifier return. The record names the release id before the drill, the id the drill landed on, and the id live at submission, and the live URL reports that last one.
- [ ] The record gives the observed time from the rollback request to the live URL reporting the previous version, and lists every lookup, permission or missing flag the run needed.
- [ ] The record states which parts of the system the rollback reverts and which it does not, whether the release carries a migration, and whether the model pin it reverts to still answers.
- [ ] The release currently live and the release the rollback lands on each have a harness run against them on the platform; the rollback target's run id is in the record.
- [ ] The principal that runs the rollback is named, and it is one that will exist during an incident.
- [ ] Every principal in `artifact:tool-authority-matrix` maps to its own credential or identity. Revoking one broke exactly one tool, tested on a path where that tool is allowed by the authority layer, and the failure was an authentication error from the vendor or proxy, not an authority-layer denial. Any vendor-forced shared or over-broad key is recorded as an accepted gap, with the scoping layer in front of it named and a statement of which principal holds what if the layer is bypassed.
- [ ] The observability locator names the log store and stream or query, the metrics or trace location and its identifying tag, where eval runs are written, the retention, and the correlation id name.
- [ ] Retention on the log store outlasts the gap to your incident simulation.
- [ ] The record opened in a private browser window with no sessions shows nothing you would have to log in to see. No internal URLs, private IPs, or credential values.
- [ ] The deploy URL you submit is the same one in the record's live URL section.
- [ ] You know what happens to the first request after the platform's idle timeout, if it has one, and it answers inside 30 seconds.
