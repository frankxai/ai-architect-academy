# AI Architect Academy Agent Guide

## 1. Mission
Transform business problems into production-ready AI solutions using the academy's pattern library, process guides, and governance assets.

## 2. Inputs Required
- **Problem Definition**: Provide context, stakeholder goals, KPIs, constraints (PRD/vision brief).
- **Persona Selection**: Identify primary persona (Builder, Leader, Creator, Operator).
- **Target Pattern(s)**: Choose relevant design pattern(s) under `01-design-patterns/` referencing CoE templates.

## 3. Standard Workflow
1. **Discover**
   - Review problem statement, align with persona needs (`docs/data/personas.json`).
   - Lookup design patterns in `01-design-patterns/` and supporting CoE template folders.
   - Consult governance library (`08-governance/`).
2. **Define**
   - Compose blueprint using pattern structure (use-case table, experience blueprint, architecture stack).
   - Reference `AI CoE Templates` for BOM, architecture diagrams.
3. **Prototype**
   - Scaffold projects in `05-projects/` (clone nearest base if available).
   - Implement retrieval/generation/evaluation using guidance in pattern and templates.
   - Run evaluations with `05-projects/eval-automation` or scenario-specific harness.
4. **Industrialise**
   - Add observability (Langfuse, cost dashboards), guardrails, governance checklists.
   - Integrate with existing systems.
5. **Operate & Iterate**
   - Capture metrics, retrospectives, stories.
   - Update persona dashboards, project catalog as needed.

Follow the detailed instructions in `process/pattern-delivery-sdlc.xml`.

## 4. Outputs
- Updated pattern file (including customer-specific notes if applicable).
- Project folder with code/evaluation assets.
- Evaluation reports, metrics snapshots, runbooks.
- Governance deliverables (checklists, approvals).
- Storytelling artefacts (deck, narrative, logbook entry).

## 5. Governance
- Apply `AI-procurement-checklist`, `incident-response-checklist`, `human-review-checklist` when relevant.
- Document risk register entries and compliance evidence.
- Follow incident escalation via `16-collaboration/escalation-guide.md`.

## 6. Agent Types
- **Builder Agent**: Implements code, tests, automation.
- **Research Agent**: Synthesises references, knowledge.
- **Governance Agent**: Ensures policies/compliance.
- **Storyteller Agent**: Prepares narratives, dashboards.

Each agent should log decisions, commands executed, files changed.

## 7. Command Cheatsheet
```
git clone <repo>
npm install
npm run build:index
python -m venv .venv && .\.venv\Scripts\activate
pip install -r 05-projects/eval-automation/requirements.txt
python scripts/check_secrets.py
python 05-projects/eval-automation/check_env.py
python 05-projects/eval-automation/run_evals.py --dataset <dataset>
```
