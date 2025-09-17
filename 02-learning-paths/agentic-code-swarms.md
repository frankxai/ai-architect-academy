# Learning Path: Agentic Code Swarms

Mobilize a multi-agent development crew that can plan, build, critique, and ship alongside you. This path transforms the `agentic-swarms/` workspace into a production-ready lab with observability, tooling, and governance layered in.

## Who This Path Is For
- AI architects and platform engineers who already ship RAG or LLM features and want resilient automation.
- Product leaders validating multi-agent workflows before rolling out to teams.
- Codex, Claude Code, Cursor, or GitHub Copilot X users eager to orchestrate agents as collaborators.

## Program Outcomes
- A configurable swarm (planner → builder → reviewer → critic) with robust prompting, retries, and evaluation hooks.
- A Streamlit-based control room that visualizes conversations, decisions, and telemetry.
- Runbooks, guardrails, and governance ready for enterprise adoption.

## Time & Prerequisites
- **Estimated time:** 12–18 focused hours (self-paced or weekend intensive).
- **Stack:** Python 3.11, optional LiteLLM provider keys, Node.js if customizing UI assets.
- **Pre-work:** Review [awesome-agents](../03-awesome/awesome-agents.md), [docs/topics/agents.html](../docs/topics/agents.html), and the [Bootcamp Path](bootcamp.md) governance cues.

---

## Orientation (1 Hour)
- Read `agentic-swarms/README.md` and map folder structure to the [experience map](../assets/experience-map.svg).
- Configure a `swarm-journal.md` to log experiments, prompts, and metrics; invite your AI agent to append summaries after every run.
- Run `examples/hello_swarm.py` to validate environment and inspect message traces.

```bash
cd agentic-swarms
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python examples/hello_swarm.py --goal "Create a tiny function to add two numbers"
```

---

## Module Breakdown

| Module | Focus | Human Lead | AI Agent Partner | Deliverables |
| --- | --- | --- | --- | --- |
| 1. Patterns & Roles (1h) | Study coordination strategies (sequential, round robin, planner–worker–reviewer) using `core/swarms/`. | Document strengths/risks per pattern, annotate code. | Summaries + decision tree for when to use each pattern. |
| 2. Core Setup (1h) | Configure virtual env, `.env`, LiteLLM provider routing. | Generate `.env.example`, provider comparison, and onboarding guide. | Reproducible setup instructions committed to repo. |
| 3. Orchestration Deep Dive (3h) | Extend planner–worker–reviewer with retries, critique loop, and memory store leveraging [06-toolchains](../06-toolchains/). | Draft prompts, fallback policies, and test cases. | Updated swarm class + prompt pack in `/prompts`. |
| 4. Tool Belt (2h) | Implement `search_web`, `python_exec`, and project-specific tools. Reference [05-projects/agentic-saas-planner.md](../05-projects/agentic-saas-planner.md). | Write unit tests, mocks, and documentation strings. | Tool registry + tests passing. |
| 5. Visual Explorer (2h) | Customize `ui/streamlit_app.py` to show timelines, token usage, and decision reasons. | Provide UX copy, accessibility checks, and alt text. | Polished UI + screenshot deck. |
| 6. SaaS Planner Scenario (2–3h) | Use `examples/saas_planner.py` to output BoM, timeline, architecture diagram with [04-templates/technical-architecture.md](../04-templates/technical-architecture.md). | Draft client brief, pricing estimates, and Q&A. | Scenario package with outputs + stakeholder-ready summary. |
| 7. Evaluate & Harden (2h) | Design acceptance tests referencing [07-evaluation/eval-harness.md](../07-evaluation/eval-harness.md) and [metrics.md](../07-evaluation/metrics.md). Add logging + telemetry. | Generate evaluation configs, dashboard schema, and risk log. | Evaluation report + monitoring checklist. |

---

## Advanced Labs & Challenges
- **Critic Sentinel:** Implement a critic agent that blocks merges if tests fail or coverage drops. Agents propose heuristics; humans tune thresholds.
- **Provider Swap Drill:** Toggle providers (OpenAI ↔ Anthropic ↔ Azure) using LiteLLM config only. Measure latency and quality using the eval harness.
- **Swarm-in-the-Loop:** Integrate with [agentic-saas-planner.md](../05-projects/agentic-saas-planner.md) to let the swarm design SaaS roadmaps end-to-end, with human approvals defined in [16-collaboration](../16-collaboration/).
- **Telemetry Wall:** Push logs to your preferred stack (OpenTelemetry, Langfuse) and surface insights in the Streamlit UI. Reference [docs/topics/observability.html](../docs/topics/observability.html).

---

## Governance & Safety Considerations
- Apply [privacy-gdpr.md](../08-governance/privacy-gdpr.md) and [model-risk.md](../08-governance/model-risk.md) to agent prompts and tool access.
- Maintain a risk register updated after every significant experiment.
- Define escalation paths: when must a human approve or intervene? Document in `swarm-governance.md`.

---

## Demo & Storytelling Kit
- Record a walkthrough of the Streamlit explorer demonstrating planning, execution, critiques, and telemetry.
- Publish a write-up using [solution-doc.md](../04-templates/solution-doc.md) and link to supporting notebooks or dashboards.
- Prepare a “How to clone & adapt this swarm” section referencing [START-HERE.md](../START-HERE.md) and [docs/experience.html](../docs/experience.html) for onboarding new teams.

---

## Success Criteria
- **Functionality (40%)** — Agents coordinate, recover from errors, and deliver coherent outputs.
- **Clarity (25%)** — Code, prompts, and docs are easy to follow; AI agents can brief newcomers.
- **UX & Observability (20%)** — UI highlights decisions, token usage, and system health at a glance.
- **Governance (15%)** — Guardrails, audit logs, and approval flows satisfy enterprise expectations.

Log every experiment, keep agents in the loop, and invite your community to run the swarm live. The more transparent the system, the faster collaborators will trust and extend it.
