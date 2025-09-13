# Agentic Teams: Roles, RACI, and Operating Model

## Roles
- Orchestrator (Architect): defines goals, orchestrations, and acceptance criteria
- Agent Lead (Tech): designs agents, tools, error handling, and eval hooks
- Data/Evals: defines metrics, datasets, and guardrails; triages failures
- Platform: CI/CD, secrets, cost controls, observability
- Product: scope, risks, UX, compliance sign‑offs

## RACI (example)
- Plan: Product (A), Architect (R), Tech (C), Evals (C)
- Build: Tech (A/R), Platform (C), Architect (C)
- Evaluate: Evals (A/R), Tech (C), Product (C)
- Ship: Platform (A/R), Product (C), Architect (C)

## Cadence
- Daily: 15‑min swarm review (top failures, costs, blocked items)
- Weekly: model/agent perf review; update evals and guardrails
- Monthly: pattern retro; consolidate lessons into the playbook

## Guardrails
- Budget envelopes per run and per environment
- Red‑team prompts and jailbreak checks in CI
- PII scans, citations required for claims, source attribution

## Artifacts
- Goals → plans → traces → final deliverables
- Architecture documents and BoMs
- Eval dashboards with trend lines and incidents