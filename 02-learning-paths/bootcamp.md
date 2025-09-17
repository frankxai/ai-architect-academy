# Bootcamp Path — AI Center of Excellence Launch Plan (3 Weeks)

Designing an enterprise AI program demands fast wins, shared language, and governance maturity. This bootcamp equips leaders, product strategists, and solution architects with a 21-day sprint to align stakeholders, prove value, and publish an execution roadmap that teams can clone.

## Audience & Prerequisites
- You lead or advise an AI Center of Excellence, platform team, or innovation guild.
- You can commit ~15 focused hours per week (mix of workshops, asynchronous study, and build time).
- You have a Codex-style agent or research assistant ready to summarize docs, draft comms, and run lightweight analyses.

## Guiding Outcomes
- Shared vocabulary anchored in [BRAND-VOICE.md](../BRAND-VOICE.md) and [START-HERE.md](../START-HERE.md).
- Two validated use cases with supporting prototypes (RAG + agentic workflow) tied to business KPIs.
- A governance, risk, and compliance (GRC) framework referencing [08-governance](../08-governance/) materials.
- A 90-day execution roadmap backed by metrics, budget, and enablement plans.

---

## Week 1 — Align Vision, Personas, and Customer Experience

| Day | Focus | Human Leadership | Assign to Your AI Agent | Deliverable |
| --- | --- | --- | --- | --- |
| Day 1 | Kickoff Narrative | Run an orientation using [docs/experience.html](../docs/experience.html). Capture stakeholder goals and fears. | Draft meeting summary, decision log, and glossary updates. | Alignment brief + stakeholder map. |
| Day 2 | Persona Workshops | Map internal personas using [experience-map.svg](../assets/experience-map.svg) and [16-collaboration](../16-collaboration/) rituals. | Produce persona one-pagers and empathy maps. | Persona deck + engagement plan. |
| Day 3 | Opportunity Discovery | Facilitate value mapping with [workshop-agenda.md](../04-templates/workshop-agenda.md). Identify top 3 use cases. | Score ideas using impact/effort analysis referencing [docs/topics/value-loop.svg](../assets/value-loop.svg). | Prioritized opportunity matrix. |
| Day 4 | Customer Experience Blueprint | Prototype user journeys referencing [01-design-patterns](../01-design-patterns/) and [docs/concept.html](../docs/concept.html). | Generate CX copy, micro-interactions, and success metrics. | Experience blueprint + KPI targets. |
| Day 5 | Storytelling Pulse | Publish “Week 1 Wins” update for exec sponsors and community. | Draft LinkedIn/newsletter post, alt text, and SEO keywords. | Public recap + communications toolkit. |

**Checkpoint:** Executive sponsor confirms top use case shortlist and agrees on evaluation criteria for Week 2.

---

## Week 2 — Architecture, Data Platforms, and Governance Foundations

| Day | Focus | Human Leadership | Assign to Your AI Agent | Deliverable |
| --- | --- | --- | --- | --- |
| Day 1 | Data & Retrieval Strategy | Audit data readiness using [vector-search-pgvector.md](../05-projects/vector-search-pgvector.md), [awesome-vector-dbs.md](../03-awesome/awesome-vector-dbs.md), and [13-platforms](../13-platforms/). | Compile platform comparison sheet with costs, latency, SLAs. | Data platform recommendation memo. |
| Day 2 | Reference Architecture | Draft diagrams with [technical-architecture.md](../04-templates/technical-architecture.md). Highlight ingestion, orchestration, and observability. | Produce layered architecture narrative and slide visuals. | Architecture deck + decision record. |
| Day 3 | Governance Sprint | Apply [privacy-gdpr.md](../08-governance/privacy-gdpr.md) and [model-risk.md](../08-governance/model-risk.md). Design intake, review, and monitoring workflows. | Create policy templates, checklists, and risk register entries. | GRC starter pack + approval workflow. |
| Day 4 | Prototype Build | Stand up [RAG on Supabase](../05-projects/rag-on-supabase.md) with evaluation hooks from [eval-harness.md](../07-evaluation/eval-harness.md). | Auto-generate documentation, `.env` templates, and run smoke tests. | Working RAG demo + README. |
| Day 5 | Metrics & Funding | Use [metrics.md](../07-evaluation/metrics.md) and [docs/topics/costs.html](../docs/topics/costs.html) to outline KPIs, budget, and value realization. | Draft finance summary, OKRs, and dashboard requirements. | KPI tree + budget brief delivered to sponsor. |

**Checkpoint:** Steering committee signs off on the architecture direction and governance approach.

---

## Week 3 — Agents, Enablement, and Enterprise Rollout

| Day | Focus | Human Leadership | Assign to Your AI Agent | Deliverable |
| --- | --- | --- | --- | --- |
| Day 1 | Agentic Workflows | Prototype multi-agent flow using [agentic-swarms](../agentic-swarms/README.md) or [agentic-saas-planner](../05-projects/agentic-saas-planner.md). | Draft prompts, fallback logic, and routing tables. | Demo showcasing planner → builder → reviewer. |
| Day 2 | Platform Integration | Map integration surfaces (APIs, events, UI) referencing [06-toolchains](../06-toolchains/) and [12-concepts](../12-concepts/). | Generate sequence diagrams and backlog tickets. | Integration plan + backlog. |
| Day 3 | Enablement & Change Management | Develop training assets using [04-templates/discovery-questions.md](../04-templates/discovery-questions.md) and [workshop-agenda.md](../04-templates/workshop-agenda.md). | Create facilitator scripts, quizzes, and certification outline. | Enablement kit for teams. |
| Day 4 | Roadmap & Investment Case | Translate insights into a 90-day roadmap referencing [00-roadmap/ROADMAP.md](../00-roadmap/ROADMAP.md). Build business case with ROI, risk mitigations, and staffing model. | Draft exec summary, press release, and FAQ. | Roadmap document + leadership brief. |
| Day 5 | Showcase & Feedback | Host a demo day, capture testimonials, and gather open questions. | Compile Q&A doc, sentiment analysis, and follow-up tasks. | Final presentation + retrospective report. |

**Graduation:** Executive sponsor greenlights the roadmap and invites teams to clone the repo. Publish the bootcamp playbook internally and externally.

---

## Sustain & Scale
- Schedule monthly governance reviews and quarterly architecture audits.
- Encourage every new squad to start with the [Beginner Path](beginner.md), then graduate to the [Professional Path](professional.md).
- Keep AI agents warm by refreshing context with the latest `docs/index.html`, journal notes, and roadmap updates.
- Contribute templates, playbooks, and metrics back to this repo via PR to strengthen the global AI Architect community.
