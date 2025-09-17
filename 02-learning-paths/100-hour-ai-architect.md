# 100‑Hour AI Architect Plan

Four focused sprints (≈25 hours each) to prove you can design, ship, and narrate production‑grade AI systems. Every milestone maps to an artifact you can show clients, leaders, or your personal audience.

## Who This Path Serves
- **Rising AI Architects** who want a credible portfolio within a month.
- **Creators & Influencers** who will remix the build into talks, streams, or newsletters.
- **Codex‑style agents** operating beside you—each week includes explicit tasking for an AI copilot.

## Outcomes You Will Ship
- A resilient [RAG on Supabase](../05-projects/rag-on-supabase.md) demo with hybrid search, evals, and observability wired in.
- A repeatable eval harness drawing from [Langfuse guidance](../05-projects/evals-langfuse.md) and the [07-evaluation/](../07-evaluation/) toolkit.
- A governance one‑pager referencing [privacy](../08-governance/privacy-gdpr.md) and [model risk](../08-governance/model-risk.md) playbooks.
- A polished story: architecture diagram, metrics, cost sheet, and launch post.

## Operating Rhythm
- **Cadence:** 5 working sessions (~3 hours) + 1 reflection/publishing block (~10 hours) per week.
- **Source of truth:** Maintain a `build-journal.md` in your clone; append daily decisions, prompts, and links.
- **AI copilots:** Load `README.md`, [START-HERE.md](../START-HERE.md), this plan, and the project docs into your agent context before each sprint.

---

## Week 1 — Foundations & Discovery (25h)

| Track | Human Focus | Assign to Your AI Agent | Ship This Week |
| --- | --- | --- | --- |
| Patterns & Vocabulary (6h) | Skim [content generation](../01-design-patterns/content-generation.md), [decision support](../01-design-patterns/decision-support.md), and [awesome RAG](../03-awesome/awesome-rag.md). Capture 10 insights in your journal. | Summarize each pattern into stakeholder-friendly bullets; draft glossary cards. | 1-page “North Star” brief + glossary snippet. |
| Data & Retrieval (8h) | Work through [vector-search-pgvector](../05-projects/vector-search-pgvector.md) and [chunking concepts](../docs/topics/chunking.html). Build a local notebook that chunks, embeds, and stores documents. | Generate comparison table of embedding models, costs, and use cases. | Notebook pushed + chunking decision doc. |
| Fast Proof (6h) | Pair-build the baseline [RAG on Supabase](../05-projects/rag-on-supabase.md). Focus on ingestion pipeline and streaming responses. | Draft README instructions and API reference from code comments. | Running app with README quickstart checked into repo. |
| Reflection & Story (5h) | Capture decisions in `build-journal.md`, publish a “Week 1 Field Notes” update. | Propose three SEO headlines using [10-resources/keywords](../10-resources/playlists.md) cues. | Public post + shareable Loom walkthrough (optional). |

**Checkpoint:** Tag any gaps for Week 2. Confirm data governance requirements with your sponsor or future self.

---

## Week 2 — Systems & Observability (25h)

| Track | Human Focus | Assign to Your AI Agent | Ship This Week |
| --- | --- | --- | --- |
| Tooling & Agents (6h) | Study [agentic-swarms](../agentic-swarms/README.md) quickstart and [awesome-agents](../03-awesome/awesome-agents.md). Implement a planner–worker–reviewer pattern inside your project (even if mocked). | Generate prompt templates for planner, builder, and reviewer roles. | Documented workflow with prompts checked into `/prompts`. |
| Evaluations (8h) | Wire Langfuse or an equivalent from [eval-harness.md](../07-evaluation/eval-harness.md). Capture faithfulness and relevance metrics for three scenarios. | Write the evaluation YAML/JSON config and seed datasets. | Eval dashboard screenshots + config committed. |
| Observability & Costs (6h) | Use [metrics.md](../07-evaluation/metrics.md) and [costs topic](../docs/topics/costs.html) to add tracing, latency, and spend logging. Validate on 20 sample queries. | Produce a cost sensitivity table and alert thresholds. | Monitoring checklist + alert plan appended to journal. |
| Reflection & Story (5h) | Update your architecture diagram using [technical-architecture template](../04-templates/technical-architecture.md). Publish “How we keep this system honest” blog draft. | Suggest SEO keywords + meta description. | Architecture doc + blog draft. |

**Checkpoint:** Are evals and monitoring automated? If not, queue tasks for Week 3.

---

## Week 3 — Governance, Performance, and Trust (25h)

| Track | Human Focus | Assign to Your AI Agent | Ship This Week |
| --- | --- | --- | --- |
| Safety & Compliance (6h) | Review [privacy-gdpr.md](../08-governance/privacy-gdpr.md) and [model-risk.md](../08-governance/model-risk.md). Document data classification, retention, and human-in-the-loop controls. | Draft policy snippets and risk register entries. | 2-page governance memo linked to repo. |
| Performance Lab (8h) | Benchmark embedding sizes, context windows, and caching using [awesome-vector-dbs](../03-awesome/awesome-vector-dbs.md). Record latency + accuracy deltas. | Analyze logs to recommend cache TTLs and batching strategies. | Performance notebook + recommendations table. |
| Guardrails & UX (6h) | Implement guardrails from [guardrails topic](../docs/topics/guardrails.html) and integrate a refusal / clarification UX state. | Generate user-facing copy for refusal states and tooltips. | UX demo video + guardrail checklist. |
| Reflection & Story (5h) | Package results into stakeholder deck via [workshop-agenda template](../04-templates/workshop-agenda.md). | Compose email summary + CTA for leadership. | Deck + email copy. |

**Checkpoint:** Validate with a friend or advisor. Ask for feedback on clarity and trust signals.

---

## Week 4 — Specialization & Launch Narrative (25h)

| Track | Human Focus | Assign to Your AI Agent | Ship This Week |
| --- | --- | --- | --- |
| Domain Deep Dive (6h) | Pick an industry pattern from [platforms](../13-platforms/) or [awesome-aggregators](../03-awesome/awesome-aggregators.md). Adapt your RAG experience to that vertical (data schema, tone, workflows). | Curate competitor scan + differentiators table. | Domain addendum in architecture doc. |
| Flagship Build (10h) | Complete end-to-end PoC with onboarding flow, evaluations, and analytics all green. | Generate test suite stubs and regression checklist. | Tagged release + demo environment link. |
| Storytelling & SEO (5h) | Draft launch narrative referencing [BRAND-VOICE.md](../BRAND-VOICE.md). Outline long-form post + short social snippets. | Produce optimized metadata, alt text, and newsletter CTA. | Launch kit folder with copy + images. |
| Celebration & Next Steps (4h) | Record video walkthrough, capture lessons learned, define roadmap using [solution-doc template](../04-templates/solution-doc.md). | Assemble FAQ for prospects/investors. | Published recap + roadmap section in repo. |

**Final Showcase:** Host a live or recorded demo, share metrics, invite collaborators to clone and build on top.

---

## Evidence Packet Checklist
- ✅ Working repository with docs, prompts, configs, and deployment notes.
- ✅ `build-journal.md` capturing daily choices, prompts, and retrospectives.
- ✅ Governance memo, eval reports, performance benchmarks, and launch story packaged for easy download.
- ✅ Link to public talk/post or replay that narrates your journey.

## Agent Co-Pilot Brief (Copy into Your Assistant)
1. Always reference the latest `build-journal.md` and highlight unanswered decisions.
2. Draft summaries in the brand tone described in [BRAND-VOICE.md](../BRAND-VOICE.md).
3. Propose at least one automation or integration idea per week using assets from [agentic-swarms](../agentic-swarms/README.md).
4. Surface SEO keywords from [10-resources/playlists.md](../10-resources/playlists.md) and [10-resources/repos.md](../10-resources/repos.md) when crafting content.
5. Flag any dependencies or blockers that require human approval.

## Stretch Extensions
- **Leadership Mode:** Convert Week 4 deliverables into an internal enablement workshop (agenda, facilitator guide, pre-reads).
- **Productization:** Package the PoC as a starter kit template for clients or community members.
- **Community Signal:** Submit a PR to [100-projects](../05-projects/100-projects.md) describing your build and lessons learned.

Document everything, narrate progress weekly, and invite collaborators into the repo so they can feel the momentum as soon as they land.
