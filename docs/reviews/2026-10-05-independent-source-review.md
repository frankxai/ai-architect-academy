# Independent Academy review — 2026-10-05

Reviewer: `/root/starlight_academy_review`. No remote merge, comment, promotion, or production configuration mutation was performed by this reviewer. The two Academy brands remain distinct.

## AI Architect Academy release candidate

**Verdict: approve the reviewed source for the public, waitlist-first release with licensed delivery inactive.** This is a source/security/product-quality verdict, not a receipt for deployed payment, authentication, entitlement, or customer cloud execution. Root owns the exact Git commit, full build, visual review, preview checks, and production promotion.

Read the repository's `AGENTS.md`, `CONTENT-CONTRACT.md`, and `docs/BUILD-BRIEFS.md`. Review used the actual current source in `ai-architect-academy/site`, rather than prior diagnostic summaries. It covers the resource-access handler and tests, experience manifest and tests, `/start`, `/architectures`, the well-known JSON route, and the licensed-resource GET route.

Independent execution: `node --test lib/resource-access/handler.test.ts lib/academy-graph/experience.test.ts` — **11 passed, 0 failed**. Node emitted the existing module-type performance warning; it did not affect the result.

Concrete defects found and repaired by the root owner before this verdict:

- String coercion previously accepted `principalKind: ['agent']` while skipping the strict agent sponsor branch. The final handler accepts only the literal human/agent enum and requires `humanSponsorActive === true` plus a nonempty sponsor ID for an agent.
- The original request-start timestamp allowed a near-expiry grant to be delivered after it expired during an upstream fetch. The final handler reads a fresh clock after entitlement parsing and after content retrieval; both phases have regression coverage.
- The initial graph test expected a cohort-only artifact's sections in the public projection. The final projection omits that content, preserves the artifact ID/access placeholder, and tests the public boundary.
- The Vercel profile initially described an in-request model adapter, while its linked source is a worker admission/status sidecar. The final profile describes the actual sidecar and worker job boundary.

The final access boundary uses a fixed resource allowlist, trusted HTTPS server configuration, separate authorizer/content credentials, a fresh upstream grant check for each request, tenant/product/resource/principal checks, explicit sponsor status, expiry checks, redirect rejection, bounded UTF-8 bodies, five-second upstream abort signals, attachment delivery, and private/no-store responses. Missing configuration returns 503 without contacting an upstream. Caller-controlled resource IDs cannot select another upstream host or path. The route is dynamic and Node-only.

The public experience projects the existing Academy graph, does not grant competency from reading/payment, does not expose non-public artifact bodies or learner evidence, and uses the canonical commercial stage/gate. Human and agent entries share the artifact/evaluation path. The local agent install remains BYOK. Checkout is explicitly unavailable; licensed access is explicitly activation-pending. Railway durability and Cloudflare/Google reference designs are clearly distinguished from verified deployments. No new price, seat count, launch date, or cross-brand link was introduced in the reviewed pages.

Official Vercel Functions, Railway Create a Template, Cloudflare Durable Objects, and Google Cloud Run job documentation pages were opened during review. Linked `ai-architect` main source for the request sidecar, worker, install entry, and local MCP was read independently through the GitHub connector. Source existence and fixture behavior do not establish a hosted deployment or install certification for every runtime.

**Activation remains a separate implementation gate.** Before enabling licensed delivery, there must be a real authorizer that authenticates the caller, binds that caller to the returned principal/tenant, owns current payment/membership state and revocation, and verifies the agent's active human sponsor. Content-service configuration and real denied/expired/revoked/cross-tenant hosted receipts are still required. The injected-fetch test fixtures establish adapter behavior only.

Source SHA-256 binding at the passing test run:

| File | SHA-256 |
|---|---|
| `lib/resource-access/handler.ts` | `fc38bae1ba5b1113487f22d92b36bb39354148aceb9fd4c8af1282db553e4637` |
| `lib/resource-access/handler.test.ts` | `2ace6a7aaca122ac450054562fdb281846c435d79233a83b35883e225ef77a76` |
| `lib/academy-graph/experience.ts` | `ad43abf846c4b6a7eaec04ad0967d41730da2a3d1b87bf8d3dbaccc6ba4d45e1` |
| `lib/academy-graph/experience.test.ts` | `a5ff115b116cd7c039e8caf3d086658867c8f1127f8cb535fed42091d6a2fbac` |
| `app/start/page.tsx` | `c65f1083050d82f5d82b620ad6a2d5c716614ab07b9b2fd01879db8a4cbae377` |
| `app/architectures/page.tsx` | `78cad1ec1e42386f623a1c9ab08e5a7bb4634f87b37838fd59758b28aeefd496` |
| `app/.well-known/academy.json/route.ts` | `2c3e276996a472bd3ace31ac705a01b77de1d5b39a3c730653d4d473facec992` |
| `app/api/licensed-resources/[resource]/route.ts` | `584fd7c3f97f576e1778fe6d876abb52367dbf4c12e398b395f17c09090f096b` |
