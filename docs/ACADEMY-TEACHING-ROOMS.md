# Academy teaching rooms

Status: implementation candidate, not an activated hosted teaching service. 4 November 2026.

## Admission

Learner job: take an architecture decision from a blank draft to a portable artifact another architect can review.
Owner: Frank Riemer. Owning issues: #35 (complete learner result), #53 (architecture critique lab).
Base: `8097219e5508ecf1c6001e1a22fedcc44b5340c8`.
Portfolio policy inspected: `frankxai/agentic-ops` default-branch snapshot `e0fb3fa4c2447517c666a6a67606f706f75d716d`, STRATEGY.md and registry/product_releases.yaml. Policy is loaded for this session; this change does not amend portfolio policy or admit a separate commercial product.
Production scope: existing `site/` and Vercel `aiarchitectacademy`. No second LMS, billing store or curriculum graph.
Budget: one bounded implementation and review cycle; no external model spend, provisioning, DNS, credentials or live messages. Stop before production promotion or Slack installation. Framework dependencies unchanged.
Acceptance: public graph projection → room → draft → honest structure feedback → correction → JSON export/import. Host failure and malformed import must not destroy a draft or grant a competency. Independent assessment and clean-host customer validation remain release gates.

## Recovery of earlier ideas

The canonical repository's historical PLATFORM_VISION.md describes students learning by deploying, teacher agents, professor publishing, a pattern marketplace and enterprise training. Its scale/revenue figures are aspirations, not product evidence. Current CONTENT-CONTRACT.md wins over those historical documents.

An archived private Replit repository was located and its project overview inspected through the authorized GitHub connection. It describes an earlier React/Vite/Express learning experience with prerequisite mapping, adaptive sequencing, mastery progression, course Q&A and project analysis. Those statements are historical documentation, not verified functioning features. Its private source and data are not copied into this public repository. Recover the interaction ideas through the current graph; do not restore its separate auth/database/payment stack. Full legacy code and visual review remain pending.

Reuse current `AcademyGraph.v1`, existing plugin/instructor, public lessons, studio/library and independent review rules. The existing Lab 05 evidence PR #101 remains separate; no competing exporter for its executable test receipts is introduced here. Browser JSON is an unassessed draft, not a lab receipt.

## Implemented candidate

`/rooms` projects only public artifacts from the current graph. Cohort-only threat/incident artifacts are excluded. Required sections and evaluation links remain graph-derived. It offers local prompts, structure presence checks, per-room tab-memory drafts, bounded JSON imports, no-silent-overwrite protection and portable exports. Imports discard claimed assessment fields. Text renders as React text/textarea values, never HTML. No provider call, account, persistent server store or Slack installation is implied.

Export before refresh or closing the tab. Import into an empty room; if the room already has non-empty work, export it and use a fresh tab. There is no localStorage retention of potentially sensitive architecture text. Server sync, version history and draft conflict resolution are future authenticated features.

The public homepage and Start page link into the practice studio. Existing lessons, cohort interest and licensed resource boundaries remain available. Hosted AI and Slack availability are explicitly planned.

## Proposed hosted system

| Layer | Decision | Authority / evidence |
| --- | --- | --- |
| Experience | Existing Next.js/Vercel app; streaming teacher conversation alongside an artifact editor, challenge rubric, evidence and revision history | Authenticated admission, cancellation, reconnect and explicit terminal state |
| Teacher runtime | Cloudflare durable entity scoped by tenant, learner and teacher; workflow for finite review/evaluation jobs | One authoritative session, bounded tool grants, revocation and recoverable run IDs |
| Model access | Existing shared gateway and model routing; benchmark a cheap tutor lane and a separate assessor lane | Reserve spend atomically before model admission; record actual usage and remaining reservation |
| Business truth | Existing shared identity/entitlement platform and Postgres | No access from supplied Slack display names or unverified client tenant IDs |
| Evidence | Versioned artifacts and run receipts; private object storage with authorized downloads | Content hash, source/skill revision, reviewer identity, visibility, export and deletion |
| Slack | Adapter to the same teacher service; one approved Academy app with teacher identities in explicitly mapped channels | Signed events, deduplication, channel/tenant mapping and opt-in onboarding |
| eve | Candidate adapter for bounded teaching/tool work or sandboxed challenge evaluation | Verify license, SDK contract and actual deployed integrations before reuse; never duplicate the durable session ledger |

Both Vercel and Cloudflare support durable agent approaches. Choose one execution owner per job. Cloudflare is the proposed persistent teacher/session owner; Vercel remains the existing experience owner. Evaluate eve for reusable tools and sandbox execution after a current code/license audit, rather than deploying a factory per teacher. No claim that Cloudflare or eve is necessary to teach the existing public material.

## Teacher roles and room behavior

- Concierge: welcome a learner after consent, establish their project and prerequisite, route to the next graph stage. Do not infer competence from confidence, demographics or chat volume.
- Stage tutor: ask a focused question, retrieve the pinned lesson, critique a specific artifact section, suggest a bounded experiment. Distinguish guidance from assessed evidence.
- Challenge evaluator: execute a pinned harness in an isolated sandbox; keep learner text out of runtime configuration, network authority and credentials.
- Independent assessor: fresh context and separate model/provider where feasible; inspect exact artifact and receipts, record pass/revise with rationale. The existing grant function remains the only capability grant path.
- Community steward: answer scoped channel questions, summarize an opted-in challenge thread, suggest moderated escalations. Humans retain membership, payments, final discipline, curriculum publication and administrative authority.

Teachers are disclosed AI service identities under a human owner. They may maintain assigned room context; they do not own the workspace or independently expand app scopes, create accounts, invite members, moderate access, change billing or browse unrelated private channels.

## Slack activation contract

Use the existing Academy community workspace; internal operations and client work remain separate access zones. Do not merge, rename or delete existing workspaces as part of this candidate.

Proposed channels: `#academy-welcome`, `#academy-help`, `#academy-showcase`, plus graph-derived `#academy-<stage>` rooms when supported. Keep individual assessments and sensitive architecture artifacts private in the web app; link to authenticated artifacts rather than copying them into public channels. Channel names in code are proposed identifiers, not created channels.

Before installation: verify owner/workspace, existing app/bot inventory, installed scopes, channel IDs, membership and entitlement mapping. Start with mentions and explicit room events. Add member-join events only for the approved onboarding surface. Avoid workspace-wide history access and admin scopes. Post a welcome once per workspace/member/flow version; require opt-in for reminders and honor mute/leave/revocation. Never impersonate a human professor.

Verify raw-body HMAC with Slack signing secret and timestamp freshness before processing; acknowledge accepted events promptly, persist unique workspace/event IDs, queue work and reply in the originating approved thread. Reject replay, cross-workspace and unmapped-channel events. Ignore bot/self events. Model text cannot choose destination channel IDs. Retry only within the bounded delivery policy; a retry must not spend twice or send duplicate welcomes.

## Rollout and proof

| Milestone | Required result | Current state |
| --- | --- | --- |
| Practice studio | Blank draft, missing-section feedback, revision, export, clean import, invalid import, mobile/keyboard check | Source implemented; validation recorded in PR |
| Hosted critique | Authenticated non-admin learner, one bounded provider run, tool authorization, cost ledger, failed provider, cancel/reconnect without duplicate spend | Not implemented/activated |
| Persistent teacher | Private session retrieval, concurrent edits, restart/reconnect, revocation, export/deletion test | Proposed |
| Slack pilot | Approved app/channel, real opt-in welcome and thread help, duplicate/replay/cross-tenant and bot-loop denial | Not installed |
| Reviewed progress | Separate assessor verifies one real learner artifact and executable evidence | Pending |
| Paid access | Existing commerce rail, sandbox checkout-to-entitlement-to-delivery-to-refund/revocation | Gated; no live pricing or checkout |

Measure activated learners / unique starts, exported artifacts / unique starts, independently accepted artifacts / submitted artifacts, median time to accepted artifact, provider cost per accepted artifact, support minutes, return practice and opt-outs. A filled textarea, message count, green structure check or model self-rating is not learning success.

Commercial sequence: useful free practice → maintained hosted teacher allowance → assessed projects/cohorts → team licenses. Keep research, drafting, execution and human review costs separate. Price remains a product-owner decision after usage/support measurements. No unbounded AI subscription or marketplace payouts before rights and support obligations are settled.

## Sources inspected

- https://vercel.com/templates/eve/eve-software-factory — separate agent stations, independent reviewer and draft PR/human approval boundary. Adapt the separation of teaching and assessment, not its factory interface.
- https://developers.cloudflare.com/agents/examples/slack-agent/ — stateful Slack agent boundary.
- https://developers.cloudflare.com/agents/concepts/workflows/ — durable finite work separate from live communication.
- https://docs.slack.dev/authentication/verifying-requests-from-slack/ — raw body request authentication.
- https://docs.slack.dev/apis/events-api/ — event delivery and retry contract.
- Current live Academy `/` — observed waitlist-first structure; existing paper/cobalt editorial identity retained for the studio.

Visual comparison is limited to the inspected Academy and eve surfaces; no market-leadership claim is made. Windows-local design kernel files are unavailable in this execution environment. Existing deployed identity and the loaded taste rules govern this candidate.

## Recovery and release

Rollback the bounded room/navigation commit. No schema migration, external resource, provider spend or Slack message needs reversal. A READY preview is not production acceptance. Public promotion needs exact-revision review, browser QA, an owner decision and stable-domain deployment binding. Hosted runtime and Slack work need separate executable evidence before being described as live.
