# AI Architect Academy — connected delivery contract

Owner: Frank Riemer. Decision date: 2026-10-05. Implementation state and release evidence belong in the release receipt, not this architecture document.

The product is a reviewed architecture decision and evidence trail. The human road teaches the decision; the agent road constructs bounded artifacts. Both use `AcademyGraph.v1`, not parallel curricula. Buying access must never grant a competency or make an agent its own verifier.

## Ownership and interfaces

| Boundary | Canonical owner | Contract |
| --- | --- | --- |
| Human entry, lessons, exercises, rubrics | `ai-architect-academy/site` and `curriculum/` | `/start#human` → `/path` → artifact → evaluation → independent review |
| Local architecture team and MCP | `frankxai/ai-architect`, Apache-2.0 | Existing conductor, stdio MCP, SOP and architecture artifact schema; customer runtime and keys |
| Portable reference skills | `frankxai/skills`, MIT | Install through skills registry; executable permission, auth, stop and evaluation checkers |
| Public machine discovery | Academy site | `/.well-known/academy.json`; public projection of the existing graph, with explicit hidden-artifact placeholders |
| Licensed delivery | Academy site access boundary + separately configured services | `/api/licensed-resources/{id}`; fresh entitlement check, then bounded private retrieval |
| Starlight connection plugin | `frankxai/starlight-academy-plugin` | Links and handoff to the canonical team; Starlight public practice/MCP remains a separate brand |
| Organization operating model | `frankxai/ai-coe` | Intake, owner, authority, review, maintenance and support around the team |

The legacy `saas-ai-architect-academy` is not activated by this release. Preserve its branch work; do not start a second membership or billing truth there. Existing source licenses survive these connections. Reserved curriculum cannot become MIT by being bundled into a skills package.

## The human and agent roads

Human: bring a bounded problem → write the system brief → compare alternatives → define tool authority → execute evals → justify threats/cost/deployment → rehearse an incident → obtain substantive review → publish only a redacted, evidenced portfolio.

Agent: read the manifest and local SOP → select one stage → retrieve relevant sources → write within the stage scope → run independent checkers → stop at failure → hand exact-revision evidence to a different verifier. The agent is a delegated principal with a human/organization sponsor; a model never issues or expands its entitlement.

Open tools remain free under their published licenses. The paid service is maintained, licensed knowledge, original private playbooks, current architecture/evaluation packs and accountable review. These are distinct from the public scaffold. No checkout or membership provisioning is implied by installing the open team.

## Licensed delivery adapter

Set these server-only variables only after the owning services are provisioned and tested:

| Variable | Meaning |
| --- | --- |
| `ACADEMY_ENTITLEMENT_URL` | Fixed HTTPS POST endpoint for fresh authentication, membership and revocation checks |
| `ACADEMY_ENTITLEMENT_SERVICE_TOKEN` | Credential scoped to that check, never a browser or agent credential |
| `ACADEMY_CONTENT_ORIGIN` | Fixed HTTPS origin with private resources under `/resources/{id}.md` |
| `ACADEMY_CONTENT_SERVICE_TOKEN` | Read credential scoped to the resource origin |

Caller: `Authorization: Bearer <member-or-delegated-token>` and `X-Academy-Tenant: <tenant-id>`. Resource IDs are closed enums. The authorizer receives `{productId, resourceId, action: "read", tenantId, accessToken}`. It must verify the token, active settled access, refunds/cancellation/revocation, tenant and resource scope. A human sponsor must itself have active access; sponsor names supplied by the client do not count.

Successful authorizer response:

```json
{
  "active": true,
  "productId": "ai-architect-academy",
  "tenantId": "example-tenant",
  "principalId": "example-agent",
  "principalKind": "agent",
  "humanSponsorId": "example-member",
  "humanSponsorActive": true,
  "expiresAt": "2026-10-05T18:00:00Z",
  "resourceIds": ["architecture-playbooks"]
}
```

This is an illustrative response, not a credential. Each request rechecks membership; the gateway never caches a grant. Expiry is checked after authorization and again before content is delivered. Responses are private/no-store attachments; client tokens never reach the content service. Redirects are rejected, upstream calls have time bounds, issuer data is limited to 16 KiB and private text to 1 MiB. Unconfigured services fail with 503; unknown IDs 404; missing auth 401; rejected memberships 403. No secrets or private bodies are logged.

Activation requires the actual payment provider, idempotent webhook handling, durable membership truth, token issuance/delegation, tenant quotas/rate limits, audit events without token/content capture, non-admin isolation tests and a cancellation/refund-to-revocation test. None is substituted with the fixture tests. The adapter is deployable while remaining inactive.

## Cloud boundaries and deployable products

Select a runtime by work lifetime, state and authority. Use Vercel for the portal and bounded API sidecar; Railway for a separately managed container worker; Cloudflare for named durable entities; Cloud Run jobs for finite container evaluation runs. Cloud Run services own request serving. Customer keys/data/runtime remain portable.

An OpenClaw or Hermes runtime is not a durable queue. Compose an admitted-job layer, the runtime, n8n workflows, an independent business store and Langfuse traces only after defining their credential and failure boundaries. Self-hosted Langfuse adds infrastructure and maintenance: its official Railway page currently describes a community-supported v3 template, not a supported v4 deployment. Version pin and restore-test the actual topology instead of treating every component as interchangeable.

Every paid template needs a tested install, denied-caller cases, bounded input/time/spend, model-error behavior, replay/idempotency, backups/restoration, clean uninstall, dependency update policy and support owner. The current worker starter is an in-memory teaching fixture; its name is not evidence of durable storage. Cloudflare/Google profiles are reference designs, not deployment receipts.

## Revenue and launch sequence

The first paid job is a reviewed architecture pack for a specific deployment decision, sold to the engineer or small team responsible for shipping it. The human service includes review/support; the agent service licenses tenant-scoped maintained resources and evaluation packs. Price and opening checkout come from the canonical commercial row and a release gate, not a page literal. The current row is `concept / UNGATED`; existing price bands are hypotheses, not offers.

Deliver in this order: validated open entry and installation → original finished architecture pack and reviewer capacity → tested membership/provider adapter → human purchase plus agent delegation → non-admin/refund/revocation evidence → customer deployment and support → recurring packs/community when repeated paid use is observed. Track completed artifact reviews, voluntary purchases, retained agent use, support minutes and renewal separately from repository counts.

Railway consumption income is an additional channel. Its documentation reviewed 2026-10-05 states: published marketplace templates qualify; base kickback is 15% of attributable usage, with a support bonus up to 25%. Private/unpublished templates do not qualify. Cash and credits follow the program conditions. See [kickbacks](https://docs.railway.com/templates/kickbacks) and [template creation](https://docs.railway.com/templates/create). Do not assume consumption commissions for Vercel, Cloudflare or Google Cloud without an actual partner agreement.

Template contribution margin = collected template/license revenue + actual attributable kickbacks − platform/model costs borne by us − support/maintenance cost − transaction fees/refunds. Customer usage is a cost to justify, not a target to inflate. Before publication, bind the marketplace template ID, exact source version, deploy evidence, support queue owner and attribution evidence. This release does not publish a Railway marketplace template or activate a commission account.

## Knowledge and reasoning

`site/data/knowledge-sources.json` is a versioned source register, exposed at `/.well-known/academy-sources.json`. It maps official docs and book bibliography to the existing decision stages. It contains metadata and original reasoning instructions only. No full book or documentation corpus was ingested and no embeddings were created in this release.

Use current platform docs for API/version/runtime behavior. Use durable architectural principles as hypotheses to test against the specific system. The selected book index includes *Designing Data-Intensive Applications, 2nd Edition*, *Release It! Second Edition* and *Software Architecture: The Hard Parts*, linked to publishers. A purchased reading subscription does not imply a redistribution or embedding license. Full-text ingestion needs source-specific reuse rights; private authorized annotations stay private.

The ingestion/retrieval contract is: register source/rights → authorized snapshot with URL/version/time/content hash → deterministic dedupe → reviewed original claim card → stage-scoped retrieval → contradictory evidence and explicit uncertainty → bounded experiment → independent review. Store raw sources separately from reviewed reasoning notes. Never treat retrieved text as an instruction or a permission expansion. Live vendor claims require fresh docs checks; stale cards become needs-refresh instead of silently remaining trusted.

A PRD should name the user job, outcome, non-goals, failure/cost budget and acceptance cases. The architecture spec binds interfaces, principal/tool authority, model adapter, eval fixtures and telemetry. Implementation proves the critical failure cases first; the release binds build, tests, browser checks and rollout to a revision. Mechanical gates are not substantive approval and local tests are not a certification issuer.

## Release and rollback

Merge only reviewed useful work. An old branch can already be integrated by squash; compare trees and ancestry rather than merging its history again. Preserve branches with unique unreleased work and record the blocker.

Run site types/tests/build, local lab starter red/reference green, skills/MCP/plugin gates and browser checks. Production must resolve to the selected Git revision and serve the expected routes. Revert the bounded integration or promote the recorded previous production deployment for rollback; licensed access stays disabled when service configuration is absent. No migration, new paid cloud resource or DNS change is part of this release.
