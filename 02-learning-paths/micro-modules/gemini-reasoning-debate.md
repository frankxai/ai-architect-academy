# Gemini Reasoning & Debate Sprint

**Category:** Reasoning & Agents  
**Duration:** 55 minutes  
**Outcome:** Apply Gemini-style debate chains, simulator calls, and critique loops to strengthen decision intelligence workflows.

## Why it matters
- Debate-style reasoning reduces hallucinations and exposes hidden assumptions.
- Simulation tooling (market, risk, scenario generators) amplifies coverage for high-stakes choices.

## Prerequisites
- Familiarity with the [Decision Support Intelligence](../../01-design-patterns/decision-support.md) pattern.
- Access to a reasoning-capable model (Google Gemini 1.5 Pro/Flash or equivalent) via API.
- Optional: existing optimisation or simulation service (OR-Tools, proprietary risk engines).

## Step-by-step
1. **Frame the debate:** Capture the decision prompt and stake levels; define pro/con agent personas.
2. **Set up Gemini debate:** Use debate chain scaffolding (two agents + judge) to produce argued recommendations.
3. **Integrate simulators:** Feed debate outputs into scenario generators (market, risk, capacity) to validate assumptions.
4. **Critique & refine:** Introduce a critic agent that compares outcomes, flags inconsistencies, and suggest follow-up questions.
5. **Human review:** Present debate summary, simulator metrics, and critiques to decision owners for final approval.
6. **Log evidence:** Store transcripts, simulation outputs, and chosen rationale in the decision journal.

## Deliverables
- Debate chain configuration file (YAML/JSON) describing agent roles and prompts.
- Simulation results comparing scenarios with key metrics.
- Reviewer notes appended to the decision journal.

## References
- Google DeepMind Gemini reasoning playbook (Sept 2025 release).
- Decision Support Intelligence pattern in `01-design-patterns/decision-support.md`.
- `05-projects/domain-rag-healthcare/eval` for evaluation structure examples.