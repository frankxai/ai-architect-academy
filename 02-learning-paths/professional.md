# Professional Path — Architect Studio (6 Weeks)

For staff/principal architects, AI product leads, and senior builders who need to orchestrate reliable, multi-model systems. Expect 12–15 hours per week with weekly design reviews and exec-facing presentations.

## Outcomes
- Design and deploy end-to-end architectures that combine retrieval, tool-enabled agents, and domain-specific adapters.
- Operationalise evaluation, observability, and governance with measurable SLOs and incident playbooks.
- Influence stakeholders using quantified trade-offs, cost models, and portfolio-ready narratives.

## Weekly Blueprint
| Week | Theme | Systems Focus | Labs & Deliverables |
| --- | --- | --- | --- |
| **1 — Discovery & Patterns** | Align on business goals, value loops, and risk posture | Pattern selection, capability map, stakeholder interviews | Discovery brief, architecture hypothesis, stakeholder playback |
| **2 — Retrieval Depth** | Hybrid search, reranking, structured prompting | Compare embedding providers, implement rerankers, context compression | Retrieval benchmark report, ingestion pipeline repo |
| **3 — Agents & Workflow Engines** | Planner-executor, LangGraph, CrewAI, AutoGen | Implement orchestrated agent flow with guardrails and retries | Agent workflow demo, design decision log |
| **4 — Evaluation & Observability** | Metrics, prompt regression, Langfuse/LangSmith, OpenTelemetry | Build eval datasets, automate regression suite, wire tracing dashboards | Evaluation dossier, cost/latency dashboard |
| **5 — Governance & Safety** | Policy automation, privacy, model risk, incident response | Map governance controls into CI/CD, simulate incident response drill | Governance playbook, risk register, mitigation backlog |
| **6 — Optimization & Executive Review** | Performance, cost, UX, stakeholder influence | Tune inference & caching, craft exec narrative, rehearse review | Final architecture doc, exec presentation, investment roadmap |

## Rituals & Teaching Model
- **Design reviews:** Weekly 60-minute review with peers/mentors. Use `15-workflows/pr-review.md` and `16-collaboration/design-review.md`.
- **Deep work sprints:** Two 2-hour build blocks dedicated to labs. Pair in repos under `05-projects/`.
- **Exec rehearsal:** Weeks 4–6 include stakeholder Q&A drills using `04-templates/executive-brief.md` and `16-collaboration/meeting-rituals.md`.

## Tooling & Research Refresh
- Track new model capabilities (GPT-4.1, Claude 3.5 Sonnet, Llama 3 405B, Mistral Large) and leverage [LiteLLM config](../06-toolchains/stack-reference.md) for provider swapping.
- Compare orchestration frameworks (LangGraph, LlamaIndex agents, CrewAI, AutoGen, Fiddle) with emphasis on failure modes and logging.
- Integrate observability via Langfuse, OpenTelemetry, Arize, Phoenix, or custom pipelines.
- Evaluate with domain-specific datasets (HELM/HEIM, GSM8K, MMLU, and your proprietary corpora).

## Assessment Rubric
- **System Reliability (35%)** — Robustness under edge cases, retries, guardrails, fallback behaviour.
- **Operational Excellence (25%)** — Depth of telemetry, alerts, governance automation, incident readiness.
- **Value Articulation (20%)** — Clarity of cost/ROI analysis, stakeholder impact, roadmap.
- **Story & Influence (20%)** — Quality of executive presentation, portfolio artifacts, community updates.

## Graduation Pathways
- Lead cross-functional adoption via the [AI CoE Bootcamp](bootcamp.md).
- Spin up an internal or public-facing [Agentic Systems Lab](agentic-code-swarms.md) sprint.
- Contribute new patterns or case studies to `01-design-patterns/` and `09-articles/`.
