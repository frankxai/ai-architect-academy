# Learning Path: Agentic Code Swarms

Audience: AI Architects and Builders using Codex, Claude Code, Cursor, or other pair-programming copilots.
Outcome: Ship a working multi-agent swarm, understand orchestration patterns, and build a visual explorer with live telemetry.

Time: 10–16 hours (self-paced)

This lab is the capstone inside the [Agentic Systems Lab](curriculum-architecture.md#program-layers--flagship-outcomes). Pair it with the [Professional Studio](professional.md) for evaluation depth and the [Bootcamp](bootcamp.md) to socialise operating models with leadership.

## Curriculum Placement
- **Prerequisite:** Comfortable with the [100-Hour Launchpad](100-hour-ai-architect.md) retrieval pipeline and evaluation loop.
- **Parallel tracks:** Join weekly design reviews with Professional Studio cohorts to compare orchestrator decisions and failure modes.
- **Post-lab moves:** Publish your swarm pattern as a case study in `01-design-patterns/` or demo it during a bootcamp executive council.

## Prereqs
- Python 3.11
- Optional: OpenAI/Anthropic key (LiteLLM). Otherwise runs offline.

## Modules
1) Concepts and Patterns (1h)
   - Roles, messages, tools, orchestrators
   - Coordination: sequential, round-robin, planner–worker–reviewer
2) Core Setup (1h)
   - `agentic-swarms/requirements.txt`, venv, run Hello Swarm
3) Orchestration (2h)
   - Inspect `core/swarms/` and extend P–W–R with retries and critiques
4) Tools (2h)
   - Add a `search_web` and `python_exec` tool
5) Visual Explorer (2h)
   - Use `ui/streamlit_app.py`, add controls and message tracing
6) SaaS Planner (2–4h)
   - Extend `examples/saas_planner.py` to output a BoM and architecture diagram
7) Evaluate (2h)
   - Design acceptance checks and simple evals (see `07-evaluation/`)

## Hands-On Steps
```bash
cd agentic-swarms
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python examples/hello_swarm.py --goal "Create a tiny function to add two numbers"
streamlit run ui/streamlit_app.py --server.port 8501
```

## Challenges
- Add a `critic` agent that blocks the final answer if tests fail
- Add tracing to show token usage per agent (mock values offline)
- Swap providers (OpenAI ↔ Anthropic) via LiteLLM config only

## Deliverables
- Working swarm with at least 3 roles
- A recorded screen demo of the Streamlit explorer
- A short doc: architecture, trade-offs, and next steps

## Grading Rubric
- Functionality (40%): agents coordinate, produce coherent outputs
- Clarity (30%): code readability, clear prompts, thoughtful defaults
- UX (20%): UI communicates roles, history, and decisions visually
- Rigor (10%): eval checks or tests
