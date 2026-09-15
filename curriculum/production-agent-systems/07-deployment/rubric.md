# Rubric — `eval:deployment-reachable`

Eval title (from the graph): **It is actually deployed**
Target: `artifact:deployment-record`
Pass threshold: `1` (a fraction; every assertion must pass)

The graph records only pass or fail, per assertion, per run (`advanceCapability` reads the latest run's passed and failed assertion lists against the threshold). This rubric separates two things for each assertion:

- **Graph assertion (verbatim).** The check exactly as `site/lib/academy-graph/production-agent-systems.ts` states it. Its PASS or FAIL is what a run records.
- **Stage bar (this rubric).** What the stage needs beyond the assertion for the next two stages to work. A stage-bar miss is a REVISE note: the reviewer records the graph assertion's literal result, sends the submission back with the one edit that would clear the bar, and re-reads on resubmission. The stage bar never changes the recorded result, and this stage has no Review node to hold; the bar's items are proposed to the graph owner below as check-text changes, which is the only way they can gate.

Recording follows the one rule in [`../01-system-brief/rubric.md`](../01-system-brief/rubric.md#revise-the-one-rule-for-every-rubric-on-this-path): the recorded result is the literal check, PASS or FAIL; REVISE is a note naming one edit and never changes the recorded result; a reviewer-layer finding gates only through the stage's Review node, or goes to the integrator as a proposed tightening.

This rubric is written so a reviewer can apply it without the author present. Where a judgement is needed, the rubric says what to look at, not what to feel.

## Assertions

### `responds-200`

> **description:** The live URL responds successfully to an unauthenticated third party.
> **check:** HTTP GET the deploy URL; require a 2xx and a non-empty body.

**How to perform the GET.** From a machine and network the author does not control, with no cookies, tokens or headers beyond a plain `GET`, request the URL in the record's live URL section. Record the status code, the body, the body length, the time to first byte and the timestamp. Do this at the time of review, not from the author's screenshot. Mechanics, fixed so two reviewers get the same verdict:

- **Scheme.** The submitted URL must be `https://`. An `http://` URL is FAIL before any request is made.
- **Timeout.** No response within 30 seconds is a failed check. That window includes one cold start; a platform that sleeps idle deployments must wake and answer inside it.
- **Redirects.** Follow redirects on the same host, and an HTTP-to-HTTPS redirect on the same host. For this rule the apex and `www` of the same registrable domain are the same host, because the author controls both. A redirect to any other host, to a login page or to an identity provider is FAIL. The final response after redirects is the one you judge.
- **Retry.** On a non-2xx, a timeout or a connection error, re-check once. Wait longer than the probe cache TTL the record states, and at least 10 minutes; if the record states no TTL, wait 10 minutes. The assertion FAILs only if both checks fail. Record both timestamps, status codes and bodies. A 503 whose body matches the failure shape the record documents is an honest route and still FAIL: the graph requires a 2xx, and the author resubmits when the dependency is back. Two checks means two requests from one address; a route whose per-IP limit returns 429 on the second is FAIL on the second check.

**Graph assertion (verbatim).**

| Verdict | Description |
|---|---|
| **PASS** | The final response after allowed redirects is a 2xx with a non-empty body, on at least one of the two checks, inside the timeout. |
| **FAIL** | Both checks return a non-2xx, a connection error, a DNS failure, no response within 30 seconds, or a 2xx with an empty body; the URL is not `https://`; a redirect goes to another host, a login page or an identity provider; or the URL requires any credential, header or network position to reach. |

**Stage bar (this rubric).** Reviewer notes; not part of the graph assertion.

- The body is the system's own response: a status object, a fixture result, a page the system rendered. A platform-generated page served with a success status (a "this deployment is sleeping" or "site not found" page) is not the system responding. Applying the graph literally this is PASS and is recorded as PASS; this rubric returns it with a REVISE note that the first request after idling must produce the system's own body inside 30 seconds.
- The record's live URL section states which dependency the route exercises (model, retrieval or a tool), what the route returns when that dependency fails (for example a 503 with a body naming the failed probe), and the probe cache TTL if there is one. You cannot see the probe from one `GET`, so you check the statement, then check that the body you received is consistent with it: a body that reports dependency status, or a fixture result that could not exist without the dependency. A bare `ok`, a static page or a version string alone is a liveness check that would still return 2xx with the model unreachable. REVISE, with that reason; the incident stage needs the route to be honest.
- The body exposes the release id currently live, and an identifier for each other component the rollback section claims to revert. `rollback-exists` below needs it.

| Stage-bar outcome | Description |
|---|---|
| **Met** | Graph assertion PASS; body is the system's own; record states the probed dependency, the failure shape and the TTL; body is consistent with the statement and carries the release id. Record the run with no note. |
| **REVISE** | Graph assertion PASS but one of the three points above is missing. Record the run as the assertion read, PASS, and return the submission with the missing point named as a note. |

**Proposed graph change.** Extend the `responds-200` check to: "HTTP GET the deploy URL; require a 2xx and a non-empty body produced by the system itself, which reports the status of at least one dependency and the release id." Until the graph owner adopts it, the stage bar stands here.

### `rollback-exists`

> **description:** A rollback path is written down before it is needed.
> **check:** The rollback command section is non-empty.

**How to apply it.** Open the record. Find the rollback command section. Read it as if you had to run it at three in the morning with no author to ask. Do not run it yourself.

**Graph assertion (verbatim).**

| Verdict | Description |
|---|---|
| **PASS** | The section contains text beyond its heading. |
| **FAIL** | The section is missing or empty, or contains only a heading. |

This rubric reads a placeholder ("TBD", "to be written") as text beyond the heading, so the graph assertion passes on it. The stage bar is what returns it, as a note.

**Stage bar (this rubric).** Reviewer notes; not part of the graph assertion.

- An executable command: a tool, a subcommand or verb, a target, and a version identifier or the form one takes. "Redeploy the previous commit" and "revert in the platform UI" are intentions, not commands.
- Which parts of the system it reverts and which it does not, and the principal that runs it.
- Evidence the command was executed against a real previous version that a stranger can check: the release id before the drill, the release id the drill landed on, and the release id live at submission; the observed time from the request to the live URL reporting the earlier release; and every step that needed a lookup, a permission or a missing flag. The word "tested" with no ids is not evidence.
- The reviewer route's body (from your `responds-200` check) reports a release id, and it matches the id the record names as live at submission. If the body has no release id, or it names a different one, REVISE: the record describes a version that is not the one running.
- The last harness run id for the rollback target (`pattern:eval-before-deploy` applied to the release the command lands on). A target with no run id is REVISE with the note that the rollback lands on an unmeasured version.

| Stage-bar outcome | Description |
|---|---|
| **Met** | Graph assertion PASS and all five points above are present. The live release id matches the record. Record the run with no note. |
| **REVISE** | Graph assertion PASS but a point is missing: an intention instead of a command, no scope statement, no version identifier form, no principal, an execution claim without release ids, a live id that does not match the record, or no harness run id for the target. Record the run as the assertion read, PASS, and return the submission with the missing point named as a note; the section must be one a colleague could execute verbatim. |

**Proposed graph change.** Extend the `rollback-exists` check to: "The rollback command section names an executable command, the release ids before and after one executed drill, and the id currently live, which matches the deploy URL's body."

## Evidence

The evidence rule for `stage:deployment` in the graph:

- **accepts:** `deploy-url` only
- **minimumCount:** 1
- **maxAgeDays:** 90

What that means when reviewing:

- A repository URL, an eval run, a screenshot, a video or a reviewer attestation is not evidence for this stage. If the only thing submitted is a link to the record in a repository, the evidence is missing even if the record is excellent.
- The deploy URL must be the same URL as the record's live URL section, and it must be `https://`. A different URL is a different system.
- Age is measured from the evidence's `verifiedAt`, the date a reviewer last confirmed the URL answers, not from the date of the deploy. Evidence last verified more than 90 days before the check is stale and does not count. Re-verifying a URL that still answers makes it fresh again; a system that has run for a year and was checked today is fresh. A URL that no longer answers fails `responds-200` whatever its age.
- The reviewer performs the `GET`. The author's own report of a 2xx is a claim, not evidence.

## Required sections and redaction

The artifact's required sections are `live URL`, `rollback command`, `observability locator`, matched and ordered under the one rule in [`../01-system-brief/rubric.md`](../01-system-brief/rubric.md#required-sections-the-one-rule-for-every-rubric-on-this-path): a missing or out-of-order section records both assertions as FAIL with the section named. The eval asserts on the first two. The third is not asserted here, but it is required for the artifact to exist, and the incident stage's `detection-source-is-telemetry` assertion depends on it. When the section is present, check it for these fields; a missing field is a REVISE note with the field named:

- the log store and the stream, or the query that selects this system's logs;
- the metric or trace location and the tag that marks this system's runs;
- where results from `artifact:eval-harness` are written;
- the stated retention of the log store, and that it is longer than the gap to the author's incident simulation;
- the name of the correlation id that follows a request through the model call and each tool call.

"Logs are in the platform" names none of these and is REVISE.

The artifact's redaction rule is `internal URLs`. It is marked `publicSafe`. The portfolio eval (`eval:portfolio-links-resolve`, assertion `no-redacted-leakage`) scans rendered text against the union of every source artifact's redaction rules. An internal hostname, private IP, or login-gated dashboard link in this record does not fail this eval, and is expected to fail under the 09 rubric's expanded scan, which has a reviewer turn those labels into concrete strings. Flag it now as a REVISE note so it is fixed before it costs a later stage.

## The two most common ways a submission looks right but fails

**1. The URL answers, but not with the system.**
The author deployed, tested it the same day, and submitted. By review time the platform has idled the deployment. The reviewer's `GET` returns a 2xx and a body: the platform's own "waking up" or "not found" page, served with a success status. Or the route is `/` on a static placeholder the author put up while the real service sat behind authentication. Everything in the record reads correctly. The check is to look at the body, not just the status: it must be the system's own response, and a platform page is a stage-bar REVISE even though the graph assertion passes on it. If the platform sleeps deployments, the first request after idling must still produce the system's response inside the 30-second window.

**2. The rollback section is full of words and empty of a command.**
The section reads: "Rollback is done by redeploying the previous release from the platform dashboard. This has been tested." It is non-empty, so `rollback-exists` passes mechanically. But there is no command, no version identifier, no principal, no release ids, and "tested" is asserted rather than shown. During the incident stage the author discovers the dashboard action requires a role they do not hold, or that the previous release has aged out of retention, or that reverting code left the new prompt bundle in place. The check is to ask whether a colleague could run the section verbatim, right now, whether it says what would and would not change when they did, and whether the release id in the live body is the one the record says is live.

## Reviewer notes

- Do the `GET` yourself, from somewhere the author does not control, before reading anything else. If it fails, apply the retry rule; if both checks fail, stop. The other assertions do not matter until it passes.
- Do not run the rollback command yourself. You are checking that it is written, complete, and that its execution left evidence a stranger can check: the release ids it names, and the live id in the body you already fetched.
- Record the status code, body length, time to first byte and timestamp of each check alongside the verdict. The timestamp of the passing check becomes the evidence's `verifiedAt`; the 90-day rule is measured from it.
- If the record names a platform probe route and a reviewer route, `GET` the reviewer route. The platform's own probe is meant to be shallow; it is not the one under review.
- If the record contains anything you needed to log in to see, say which line. Authors who could open it never notice.
