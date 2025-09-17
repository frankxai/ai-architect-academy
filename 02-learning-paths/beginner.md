# Beginner Path — Launch Your AI Architect Journey (4 Weeks)

This path is a guided on-ramp for creators, product strategists, and fast-learning engineers who want to demo real value in 30 days. Every week blends foundational theory, hands-on build time, and narrative polish so your audience, clients, and Codex-style agents all know how to collaborate with you.

## What You’ll Walk Away With
- Confidence briefing stakeholders using stories from [START-HERE.md](../START-HERE.md) and the brand tone in [BRAND-VOICE.md](../BRAND-VOICE.md).
- A working retrieval-augmented application, shipped incrementally using [RAG on Supabase](../05-projects/rag-on-supabase.md) as the spine.
- Evaluation reports, guardrails, and documentation ready to hand to a leader or publish online.
- An onboarding kit so your AI copilots can continue iterating after the 4-week sprint.

## Weekly Flow Snapshot
- **Monday–Tuesday:** Learn concepts, curate research using [03-awesome](../03-awesome/).
- **Wednesday–Thursday:** Ship code and docs; pair with your AI agent on repetitive tasks.
- **Friday:** Publish a recap and review metrics.
- **Weekend (optional):** Tinker, record demos, gather community feedback.

---

## Week 1 — Foundations, Prompts, and Responsible Use

| Focus | Human Lead | AI Agent Partner | Outputs |
| --- | --- | --- | --- |
| LLM Concepts | Study transformer basics, context windows, and prompting strategies from [awesome-llms](../03-awesome/awesome-llms.md). Summarize in your own words. | Create flashcards and stakeholder analogies for each concept. | 1-page explainer + glossary snippets for your journal. |
| Prompt Systems | Follow [content-generation pattern](../01-design-patterns/content-generation.md) and build a simple prompt chaining notebook. | Suggest variations, guardrails, and evaluation prompts. | Notebook pushed to repo with commentary. |
| Safety & Ethics | Review [docs/topics/guardrails.html](../docs/topics/guardrails.html) and [privacy-gdpr.md](../08-governance/privacy-gdpr.md). Document non-negotiables for your context. | Draft disclaimers, moderation policy, and support FAQ. | Safety checklist + published policy gist. |
| Community Signal | Share a short post or Loom introducing your mission. Invite feedback or collaborators. | Generate headline options and social snippets aligned with [BRAND-VOICE.md](../BRAND-VOICE.md). | Public announcement + repo issue welcoming contributions. |

**Milestone:** Create a `beginner-playbook.md` in your clone capturing learnings and decisions. Agents will reference it later.

---

## Week 2 — Retrieval & Structured Knowledge

| Focus | Human Lead | AI Agent Partner | Outputs |
| --- | --- | --- | --- |
| Data Strategy | Audit source material using [10-resources/repos.md](../10-resources/repos.md) and [channels.md](../10-resources/channels.md). Categorize into public vs. private corpora. | Produce ingestion checklist and licensing considerations. | Data intake worksheet + ingestion plan. |
| Vector Foundations | Complete [vector-search-pgvector](../05-projects/vector-search-pgvector.md). Experiment with chunk sizes and hybrid search referencing [docs/topics/hybrid-search.html](../docs/topics/hybrid-search.html). | Benchmark embedding models, generate comparison table, and recommend defaults. | Working PGVector setup + decision doc. |
| Baseline RAG Build | Implement [RAG on Supabase](../05-projects/rag-on-supabase.md) with your data. Ensure environment variables and deployment steps are documented. | Draft README sections, `.env.example`, and onboarding prompts. | Running app + quickstart guide. |
| Reflection | Update `beginner-playbook.md` with trade-offs, open questions, and next experiments. | Flag missing telemetry, governance gaps, or blocked tasks. | Updated journal + backlog of improvements. |

**Milestone:** End the week with a usable knowledge assistant seeded with your content.

---

## Week 3 — Agents, Workflows, and Collaboration Rituals

| Focus | Human Lead | AI Agent Partner | Outputs |
| --- | --- | --- | --- |
| Agent Patterns | Explore [awesome-agents](../03-awesome/awesome-agents.md) and [agentic-swarms](../agentic-swarms/README.md). Prototype a planner → builder → reviewer workflow for one task. | Draft agent briefs, role prompts, and fallback strategies. | Prompt pack committed to `/prompts/`. |
| Tooling Integration | Instrument simple tools (web search, calculations, database queries) referencing [docs/topics/agents.html](../docs/topics/agents.html). | Generate API wrappers or mock responses for faster testing. | Tool registry file + usage documentation. |
| Collaboration | Adopt rituals from [16-collaboration](../16-collaboration/) to run daily syncs (solo journaling works) and weekly demos. | Summarize notes, produce agenda templates, and schedule reminders. | Meeting notes + facilitator agenda saved in repo. |
| Experience Polish | Map user journey with [assets/experience-map.svg](../assets/experience-map.svg) as inspiration. Adjust UI copy to match brand tone. | Suggest UX microcopy, CTAs, and alt text for visuals. | Updated UI screenshots + copy deck. |

**Milestone:** Your system can orchestrate at least one multi-step task with agent support and clear documentation.

---

## Week 4 — Evaluation, Observability, and Launch Narrative

| Focus | Human Lead | AI Agent Partner | Outputs |
| --- | --- | --- | --- |
| Evaluation Stack | Configure Langfuse or the flow in [eval-harness.md](../07-evaluation/eval-harness.md). Run accuracy + hallucination tests on 20+ queries. | Write evaluation configs, prompts, and scoring rubrics. | Eval report with charts/screenshots. |
| Observability | Implement logging, tracing, and cost tracking guided by [metrics.md](../07-evaluation/metrics.md) and [docs/topics/observability.html](../docs/topics/observability.html). | Produce dashboard descriptions and alert policies. | Monitoring checklist + incident playbook. |
| Launch Kit | Use [solution-doc.md](../04-templates/solution-doc.md) and [workshop-agenda.md](../04-templates/workshop-agenda.md) to craft executive summary + enablement session. | Draft blog post, newsletter snippet, and SEO metadata referencing [docs/search.html](../docs/search.html) best practices. | Launch folder with slides, writeup, and newsletter draft. |
| Celebration & Next Steps | Record demo, collect testimonials, and outline roadmap referencing [00-roadmap/ROADMAP.md](../00-roadmap/ROADMAP.md). | Suggest backlog order, automation ideas, and community follow-ups. | Demo link + roadmap section in README update. |

**Graduation Moment:** Publish your “Beginner to Architect in 30 Days” recap. Include metrics, what worked, and how others (humans or agents) can clone and adapt your approach.

---

## Support Kit & Continuing Momentum
- Keep `beginner-playbook.md` updated; it becomes the knowledge base for friends, family, and collaborators.
- Invite your AI agents to ingest `docs/experience.html`, [START-HERE.md](../START-HERE.md), and your build journal before each new sprint.
- Contribute back by filing issues or PRs to [05-projects/100-projects.md](../05-projects/100-projects.md) describing your build.
- Schedule monthly retrospectives using [bootcamp path](bootcamp.md) or [professional path](professional.md) when you’re ready to scale.

Your goal is momentum: narrate every win, capture every lesson, and keep the loop tight between ideas, implementation, and storytelling.
