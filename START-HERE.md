# Start Here — Build Your AI Architect Command Center

You’re here to ship real AI value, guide stakeholders with confidence, and show your work. This quickstart orients you to the refreshed curriculum so you can choose the right lane, lock in your learning rhythm, and publish proof every week.

## 1. Map Your Learning Spine
| Program Layer | Best For | Outcomes | Go-To Assets |
| --- | --- | --- | --- |
| **Launchpad — 100 Hours** | Builders who need momentum fast | Retrieval pipeline with eval harness, architecture brief, stakeholder recap | [100-Hour Plan](02-learning-paths/100-hour-ai-architect.md), [Design Patterns](01-design-patterns/), [RAG on Supabase](05-projects/rag-on-supabase.md) |
| **Creator Launch Sequence** | Educators, creators, advocates | Workshops, newsletters, and explainer content anchored in safe prompting and governance | [Beginner Path](02-learning-paths/beginner.md), [Brand Voice](BRAND-VOICE.md), [Article Outlines](09-articles/) |
| **Professional Architect Studio** | Staff/principal ICs, AI product leads | Multi-model system design, observability rollout, executive reviews | [Professional Path](02-learning-paths/professional.md), [Observability Playbook](15-workflows/observability-playbook.md), [Eval Harness](05-projects/evals-langfuse.md) |
| **AI CoE Bootcamp** | Platform leaders, transformation teams | Governance baseline, platform roadmap, adoption plan | [Bootcamp](02-learning-paths/bootcamp.md), [Governance Toolkit](08-governance/), [Collaboration Rituals](16-collaboration/) |
| **Agentic Systems Lab** | Advanced builders, R&D squads | Agent orchestration with tracing, guardrails, and UX | [Agentic Code Swarms](02-learning-paths/agentic-code-swarms.md), [Agentic SaaS Planner](05-projects/agentic-saas-planner.md) |

Need the full rationale behind each layer? Read the [Curriculum Architecture](02-learning-paths/curriculum-architecture.md).

## 2. Run the Weekly Value Loop
1. **Discover the stakeholder need.** Use the discovery questions packaged with each [design pattern](01-design-patterns/). Capture risks, KPIs, and constraints in a one-page brief.
2. **Build the smallest valuable slice.** Follow the hands-on sections inside the relevant [project guides](05-projects/). Prioritise retrieval quality, latency, and safe prompting.
3. **Measure with live telemetry.** Instrument metrics from day one with [Langfuse evals](05-projects/evals-langfuse.md), `promptfoo`, or your preferred harness. Log token/latency/cost in the [observability workflow](15-workflows/observability-playbook.md).
4. **Govern & document decisions.** Align with the [privacy](08-governance/privacy-gdpr.md) and [model risk](08-governance/model-risk.md) templates. Track mitigations and sign-offs in `16-collaboration/` rituals.
5. **Share the story.** Publish a recap using [article outlines](09-articles/) or the [executive brief template](04-templates/executive-brief.md). Drop demos into the [Projects catalog](docs/projects.html).

## 3. How We Teach
- **Blended cadence.** Each program pairs 30–45 minute async primers with live 90-minute build labs. Labs use mob-building, tracing walk-throughs, and peer critiques to keep everyone shipping.
- **Systems thinking first.** We emphasise retrieval, agents, and evaluation as a single loop. Every lab references the same core metrics, governance checklists, and storytelling prompts.
- **Latest intelligence.** Tooling recommendations include GPT-4.1, Claude 3.5 Sonnet, Llama 3, Mistral Large, LangGraph, CrewAI, LlamaIndex, LiteLLM, pgvector/Weaviate, Langfuse, and OpenTelemetry. All modules stay vendor-agnostic so you can swap stacks quickly.
- **Proof over theory.** Expect to submit code repos, Langfuse dashboards, guardrail policies, and executive-ready narratives. Rubrics live in `15-workflows/` and emphasise functionality, clarity, governance, and influence.

## 4. Assessments & Portfolio
- **Weekly checkpoints.** Finish each sprint with a demo recording, eval metrics table, and a short retrospective that highlights trade-offs.
- **Flagship deliverables.** Combine architecture diagrams, cost models, risk registers, and storytelling assets into a portfolio that wins stakeholder trust.
- **Signals & sharing.** Add your artifacts to `example-sessions/` or drop them into a cohort channel. Highlight lessons learned so the community compounds knowledge.

## 5. Set Up Your Workspace
1. Clone the repo: `git clone https://github.com/AI-Architect-Academy/ai-architect-academy.git`
2. Serve the site locally: `scripts/serve.sh` → http://localhost:8080 for the full experience hub.
3. Install dependencies once: `npm install`
4. Regenerate search as you add content: `npm run build:index`
5. Capture refreshed screenshots: `node scripts/capture-screenshots.mjs`
6. Tailor prompts, templates, and workflows inside `prompt-packs/` and `15-workflows/` for your team.

## 6. Keep Exploring
- Tour the full [Experience guide](docs/experience.html) for persona-specific journeys and navigation tips.
- Dive into the [Sitemap](docs/sitemap.xml) or use [Search](docs/search.html) to surface patterns, projects, and governance assets instantly.
- Track platform progress and upcoming drops in the [Roadmap](00-roadmap/ROADMAP.md).
- Propose upgrades via issues or PRs, and cite the [Curriculum Architecture](02-learning-paths/curriculum-architecture.md) so we keep the system coherent.
