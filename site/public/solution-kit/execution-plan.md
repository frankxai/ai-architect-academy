# Delivery sequence and acceptance backlog

Bounded plan authored 11 October 2026. Priorities follow dependency and customer proof. No dates, provider availability, operating ownership, partner arrangements or revenue are promised.

| Order | Deliverable | Current state | What establishes completion | Owner role |
|---|---|---|---|---|
| 1 | Canonical working book, reference registers, customer solution specification | Implemented working source | Source checks, independent review, author acceptance | Academy/engine maintainer and accountable author |
| 2 | Offline/localhost customer portal, exact GCP SVG and editable exports | Implemented synthetic demonstration | Interaction, visual viewport and import checks on exact source | Experience implementer; independent verifier |
| 3 | Academy reference projection and clone instructions | Prepared implementation | Type/build checks, source SHA, preview and navigation | Academy maintainer; release verifier |
| 4 | Authenticated company project workspace | Proposed | Customer roles, tenant ACLs, private source boundaries, save/history and deletion tests | Product owner; security reviewer |
| 5 | One customer workload baseline and provider decision | Proposed | Frozen representative tasks, latency budget, all-attempt cost, recovery and accepted-result comparison | Customer acceptance owner; principal architect |
| 6 | One live model/tool integration and durable jobs | Proposed | Authorized account, schema/tool denial tests, stop/cancel, retries, duplicate effects and restart recovery | Runtime engineer; security/evaluation reviewer |
| 7 | Provider deployment adapter | Static portal configs supplied; workload IaC absent | Reviewed plan, least privilege, real deployment, smoke, teardown and rollback | Customer cloud operator; release authority |
| 8 | Open wiki and industry portal projections | Reference HTML supplied; collaborative wiki absent | Rights/freshness, edit conflicts, attribution, source-to-page dependency and private/public separation | Knowledge owner; editorial reviewer |
| 9 | Partner and invention validation | Candidates/hypotheses registered | Executed permitted arrangement; prior-art review and controlled contribution experiment | Authorized partner owner; research reviewer |
| 10 | Reproducible production capsule and maintenance | Proposed | Accepted source/domain, customer journey, SLO/telemetry, metered economics, recovery drill and periodic ownership | Operating owner; independent acceptance |

Work in one admitted customer lane. Start with an accessible research brief because it can expose source provenance, correction and review before consequential external actions. This is a proposed first experiment, not a highest-ROI industry claim. Select the actual lane from the customer's measured task volume and constraints.

## Reproduction today

Clone `frankxai/ai-architect`, select the reviewed branch/commit and run `npm ci --ignore-scripts` then `npm test`. Compile with `node solution-kit/compile.mjs solution-kit/example.json /tmp/architect-portal`; open `index.html` offline or serve it on localhost. Choose a new output directory if it contains unrelated files. The generated `vercel.json`, `railway.json`, Dockerfile and nginx configuration deploy only the public static portal. Local nginx needs a PORT variable. Cloud config acceptance has no receipt yet.

The existing `templates/deploy/request-scoped-agent/README.md` and `templates/deploy/durable-worker/README.md` supply authenticated dry-run HTTP labs. Their tests run in `npm test`. Despite the worker directory name, its queue is in memory: no restart durability, live model, streaming, cancellation or end-user tenancy is implemented. Use them to understand the seams, then implement those missing contracts on the authorized customer lane. Merely setting DATABASE_URL or MODEL_API_KEY cannot create the missing implementation.

A real provider workload template needs pinned dependencies, model/region/capability checks, tenant ownership, secret handling, persistence, tools and evaluation cases, operations/teardown, and actual provider receipts. Promote only that measured artifact. Keep public static diagrams and private operational configuration distinct.

## Proactive next-step contract

At every accepted stage, the orchestrator computes missing obligations from the next stage's inputs; names one owner; predicts required tool access, customer facts, budget and verification; performs independent reversible work; then presents the smallest remaining decision. It cannot interpret a green UI or missing evidence as permission. A changed source, model, graph, runtime or authority invalidates affected receipts. Keep failed attempts and uncertainty in the record.

Maintenance belongs to the existing portfolio/execution system. The package includes review deadlines, not a second scheduler. Source drift should create an affected-claim diff, bounded regression run and reviewable correction. It should never automatically publish, spend, alter customer permissions or promote a model.
