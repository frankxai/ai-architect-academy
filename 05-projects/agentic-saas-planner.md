# Project: Agentic SaaS Planner

Goal: Use a Planner → Worker → Reviewer swarm to produce a product plan, architecture, and build plan for a simple SaaS idea.

## Steps
1) Run the example
```bash
cd agentic-swarms
python examples/saas_planner.py --product "AI interview coach for sales reps"
```
2) Add a `critic` agent to block release if risks are high
3) Extend output: Bill of Materials, API list, day-by-day build plan
4) Optional: Streamlit UI button to export a PDF brief

## Acceptance Criteria
- Outputs include target user, jobs-to-be-done, key features, risks, MVP outline
- Technical plan includes components, data flow, APIs, eval plan
- Reviewer summary is clear and actionable

## Stretch
- Integrate LiteLLM to compare models (OpenAI vs Anthropic)
- Add a test harness that verifies the plan includes eval metrics
