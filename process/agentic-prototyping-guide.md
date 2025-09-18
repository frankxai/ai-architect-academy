# Agentic Prototyping Guide

This repository assumes only a coding agent (human or automated) plus the ability to execute shell commands. Follow the XML workflow `process/pattern-delivery-sdlc.xml` for the canonical SDLC. The steps below summarise the same flow.

## Inputs
1. Problem brief (business goals, personas, KPIs) – store as `problem.xml`.
2. Selected design pattern(s) in `/01-design-patterns/`.
3. Applicable AI CoE templates for BOM/architecture.

## Workflow Summary
1. **Discover**
   - Parse `problem.xml`, map to persona dashboards (`docs/data/personas.json`).
   - Review design pattern guidance and governance checklists.
2. **Define**
   - Produce blueprint (use cases, experience map, architecture stack, implementation sprints).
3. **Prototype**
   - Scaffold project in `/05-projects/`.
   - Implement retrieval/generation/evaluation flows.
   - Run environment setup commands:
     - `npm install`
     - `npm run build:index`
     - `python -m venv .venv && .\.venv\Scripts\activate`
     - `pip install -r 05-projects/eval-automation/requirements.txt`
     - `python scripts/check_secrets.py`
     - `python 05-projects/eval-automation/check_env.py`
     - `python 05-projects/eval-automation/run_evals.py --dataset <dataset>`
4. **Industrialise**
   - Add observability, guardrails, CI/CD automation.
   - Apply governance checklists (`08-governance/`).
5. **Operate**
   - Capture metrics, retrospectives, narratives.
   - Update persona dashboards, project catalog, documentation.

## Required Outputs
- Updated pattern file(s) reflecting solution.
- Project artefacts in `05-projects/` (code, README, reports).
- Evaluation reports (JSON/HTML) and analytics notes.
- Governance evidence (checklists, approvals, incident plan).
- Storytelling artefacts (deck, logbook, narrative).

Refer to `/AGENT.md` for agent responsibilities and the XML playbook for machine execution.
