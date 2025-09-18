# AI Architect Curriculum Architecture

Design the most capable AI architects on the planet. This map shows how every learner moves from foundations to executive-level influence with clear feedback loops, live build labs, and evergreen research refreshes.

## Program Layers & Flagship Outcomes
| Layer | Duration & Cadence | Primary Persona | Focus & Flagship Deliverables | Core Assets |
| --- | --- | --- | --- | --- |
| **Launchpad — 100-Hour Architect Sprint** | 4 weeks · 25 h/week · mix of async lessons + 2 live labs | Hands-on builders, technical founders | Ship a production-ready retrieval pipeline with eval harness, instrument costs, publish an architecture brief | [100-hour AI Architect](100-hour-ai-architect.md), [RAG on Supabase](../05-projects/rag-on-supabase.md), [Eval Harness](../05-projects/evals-langfuse.md) |
| **Creator Launch Sequence** | 4 weeks · 8–10 h/week · cohort-friendly | Creators, community leads, educators | Translate key concepts into workshops, articles, and explainer assets while demonstrating safe prompting patterns | [Beginner Path](beginner.md), [Article Outlines](../09-articles/), [Brand Voice](../BRAND-VOICE.md) |
| **Professional Architect Studio** | 6 weeks · 12–15 h/week · weekly design reviews | Staff/principal architects, AI product leads | Orchestrate multi-model systems, deploy eval+observability stack, defend trade-offs in exec review | [Professional Path](professional.md), [Design Patterns](../01-design-patterns/), [Observability Playbook](../15-workflows/observability-playbook.md) |
| **AI CoE Bootcamp** | 3 intensive weeks · 2 executive councils/week | Heads of AI, platform leaders, cross-functional squads | Align roadmap, governance, and platform choices; produce a board-ready adoption plan | [Bootcamp Path](bootcamp.md), [Governance Toolkit](../08-governance/), [Collaboration Rituals](../16-collaboration/) |
| **Agentic Systems Lab** | 2–4 week studio · blended async + live swarm critiques | Applied researchers, advanced builders | Design resilient agentic workflows with tracing, guardrails, and evaluation loops | [Agentic Code Swarms](agentic-code-swarms.md), [Agentic SaaS Planner](../05-projects/agentic-saas-planner.md), [Metrics](../07-evaluation/metrics.md) |

## Learning Rhythms & Teaching Model
- **Weekly value loop.** Every layer follows Discover → Build → Measure → Share. Learners interview a stakeholder, ship an incremental artifact, wire evals, then publish a recap.
- **Blended delivery.** Asynchronous primers cover theory. Live labs (90 minutes) focus on joint builds, troubleshooting, and peer critique. Daily Slack/email nudges surface micro-challenges.
- **Proof over lectures.** Each sprint ends with evidence: working code, observability dashboards, governance decisions, and narrative assets.
- **Stack agility.** Patterns reference up-to-date tools (OpenAI GPT-4.1, Claude 3.5 Sonnet, Llama 3, Mistral Large, LangGraph, LlamaIndex, LiteLLM, Weaviate/Supabase vector, OpenTelemetry) while emphasising vendor-agnostic principles.

## Curriculum Pillars & Depth
1. **Architectural Foundations.** Retrieval paradigms, hybrid search, structured prompting, evaluation metrics, latency/cost budgeting. Updated quarterly with latest retrieval research, embedding benchmarks, and context-windows studies.
2. **Systems Orchestration.** Agents, planners, workflow engines, and streaming UX. Learners compare LangGraph, CrewAI, AutoGen, and open-source orchestrators to model trade-offs.
3. **Trust, Safety, and Governance.** Privacy frameworks (GDPR, NIST AI RMF), model-risk scoring, incident response, red-teaming, and policy automation. Bootcamp maps policy to shipping rituals.
4. **Observability & Operations.** Langfuse tracing, Phoenix/LlamaIndex diagnostics, structured logging, OpenTelemetry pipelines, cost observability, eval-driven regression alerts.
5. **Story & Influence.** Portfolio building, stakeholder communications, executive storytelling, go-to-market narratives, pricing/value calculators, and community activation.

## Feedback, Assessment, and Credentialing
- **Rubrics.** Shared rubric templates live in `15-workflows/` and emphasise functionality (40%), clarity (30%), governance & reliability (20%), and storytelling (10%).
- **Eval-first grading.** All projects must log metrics via Langfuse (or an equivalent open-source stack), run prompt regression tests (`promptfoo`, `langsmith`, or custom harness), and document mitigations.
- **Signals & badges.** Finishers receive shareable artifacts: architecture briefs, guardrail policy packs, and video demos ready for clients or internal sponsors.

## Continuous Research & Refresh Cycle
- **Monthly intel sweep.** Curators refresh references across `03-awesome/` and `10-resources/` with the latest benchmarks (e.g., Massive Multitask Language Understanding, HEIM, and Retrieval Augmented Generation Leaderboards) and new governance guidance.
- **Quarterly curriculum ship.** Every quarter we run a release sprint: update metrics guidance, include new model capabilities, revise toolchain recommendations, and expand sector-specific case studies.
- **Community feedback.** Cohort retros, GitHub issues, and Slack polls feed directly into `00-roadmap/ROADMAP.md` so the academy stays responsive.

## How to Use This Map
1. **Pick your layer** based on persona and immediate stakes. Start with Launchpad if you need hands-on evidence fast.
2. **Pair with the Experience Hub** ([docs/experience.html](../docs/experience.html)) to see navigation, visuals, and search in action.
3. **Clone and customise.** Adapt modules to your team’s tooling, swap providers using `06-toolchains/`, and embed your own datasets.
4. **Report back.** Log wins, blockers, and requests in `16-collaboration/weekly-sync.md` or open an issue. The curriculum is built to evolve with you.
