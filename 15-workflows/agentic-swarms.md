# Workflows: Agentic Code Swarms

## Planner → Worker → Reviewer (P–W–R)
- Use for small, well‑scoped tasks
- Add `critic` for gated release when safety critical

## Round‑Robin with Ownership
- Each agent updates a shared plan; ownership fields resolve conflicts
- Good for brainstorming or multi‑discipline drafts

## Map‑Reduce
- Fan‑out to N workers and aggregate; add deduplication and scoring

## Operational Flow
1) Goal defined with acceptance criteria
2) Orchestrator runs; traces captured
3) Evals check outputs; failures routed to triage
4) Approved outputs promoted to deliverables