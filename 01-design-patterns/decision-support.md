# Pattern: Decision Support Intelligence

**Mission:** Equip decision makers with transparent recommendations, simulations, and audit-ready reasoning while keeping humans accountable.

## High-Value Use Cases
| Use Case | Impact | KPIs |
| --- | --- | --- |
| Credit & underwriting adjudication | Increase approval speed without raising loss rates. | Decision cycle time, override rate, default delta. |
| Workforce & capacity planning | Align staffing and scheduling with demand surges. | Forecast accuracy ±5%, overtime reduction 12%. |
| Portfolio & pricing optimisation | Simulate scenarios, recommend mix changes. | Margin uplift per segment, scenario coverage. |
| Policy compliance review | Summarise regulations, flag conflicts before sign-off. | SLA adherence, audit findings reduced. |

## Experience Blueprint
| Stage | Human | AI/Agents | Systems |
| --- | --- | --- | --- |
| Request & Context | Decision owner submits case payload, selects scenario templates. | Intake agent validates metadata, pulls prior decisions. | Workflow engine + decision notebook. |
| Evidence Assembly | Analysts curate source-of-truth datasets, policies, playbooks. | Retrieval agent collects facts, comparable cases, regulations. | Data warehouse, policy KB (OPA). |
| Scenario Exploration | SMEs run what-if, tweak parameters. | Simulation agent drives optimisation solvers, risk calculators, LLM reasoning narrative. | Solver stack (Gurobi/OR-Tools), LLM runtime. |
| Recommendation & Review | Decision board reviews recommendations, set thresholds. | Explanation agent produces reason code, impact summary, uncertainty bands. | Review UI, Langfuse insights. |
| Execution & Feedback | Ops applies decision, tracks outcomes. | Feedback agent logs results, creates eval tasks, triggers model retraining backlog. | Line-of-business system, evaluation pipeline. |

## Technical Architecture Stack
1. **Workflow Backbone:** Temporal/Camunda for multi-step approvals, SLA tracking, escalations.  
2. **Context Fabric:** Unified warehouse + feature store (Snowflake/Tecton), policy registry (OPA).  
3. **Reasoning Layer:** Agent orchestrator (LangChain/Guidance) orchestrating optimisation, simulation, deterministic calculators, and LLM explanation.  
4. **Decision Journal:** Structured evidence store (Postgres/Elastic) capturing inputs, outputs, rationale, overrides.  
5. **Observability & Audit:** Langfuse traces, versioned evaluation datasets, prompt/model registry (MLflow/W&B).  
6. **Integration:** APIs into ERP/CRM/risk engines; RBAC via IAM; alerting (PagerDuty/Teams).

## Data & Models
- Historical decision logs, policy documents, risk tolerance matrices, market feeds.  
- Models: Gradient boosting/glm for numeric scoring, scenario simulations (Monte Carlo), LLMs for natural language explanation.  
- Toolset: Optimisation solvers, SHAP/feature attribution, Promptfoo evaluation harness for narrative accuracy.

## Implementation Sprints
1. **Foundation** – Set up decision schema, connect data warehouse, import policies.  
2. **Evidence Retrieval** – Build hybrid search across decisions + regulations, test with top 20 cases.  
3. **Scenario Engine** – Integrate solvers + calculators, wrap via agent interface.  
4. **Explanation Layer** – Generate reason codes, highlight constraints, capture reviewer feedback.  
5. **Governance & Audit** – Build decision journal views, integrate `08-governance/incident-response-checklist.md`.  
6. **Scale & Optimise** – Automate evaluation loops, cost controls, and run red-teaming.

## Agent Build Instructions
- Reference `AI CoE Templates/.../decision-support` for BOM + architecture diagrams.  
- Use `scripts/check_secrets.py` to ensure env parity.  
- Scaffold a `decision-support` project (clone pattern-specific repo from `05-projects` as baseline).  
- Implement evaluation pipelines with Promptfoo scenarios covering accuracy, fairness, citation.  
- Generate UI mockups using `AI CoE Templates/006-templates` wireframes; capture via `scripts/capture-screenshots.mjs`.  
- Deliver final package: architecture note, decision journal sample, eval report, runbook.

## Evaluation & Observability
- Decision accuracy vs shadow model, fairness metrics per protected attribute, override rate trending.  
- Langfuse dashboards for latency, tool calls, cost per decision.  
- Weekly retrospective referencing `storytelling-exec-brief`.

## Governance & Controls
- Procurement & vendor vetting via `AI-procurement-checklist`.  
- Human oversight enforced using `human-review-checklist`.  
- Incident handling per `incident-response-checklist`.  
- Compliance mapping (policy versioning, retention) tied into `08-governance/README.md` library.

## Deliverables & Templates
- Pattern deck & operating model from CoE templates.  
- SOPs for reviewers, runbook for incident response.  
- Evaluation dataset & Promptfoo outputs stored in `reports/`.  
- Storytelling assets for executives (metrics dashboards, narrative brief).