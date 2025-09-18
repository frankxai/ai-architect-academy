# Pattern: Insurance Rate Intelligence

**Mission:** Deliver compliant, data-rich pricing decisions with transparent models, human oversight, and rapid iteration.

## High-Value Use Cases
| Use Case | Impact | KPIs |
| --- | --- | --- |
| Personal lines pricing refresh | Adjust rates quickly with granular risk signals. | Time-to-rate change, loss ratio, hit ratio. |
| Commercial underwriting assistance | Equip underwriters with insights, narratives, data retrieval. | Underwriter productivity, approval speed. |
| Regulatory filing automation | Generate SERFF-ready documentation with evidence. | Filing success rate, prep time. |
| Portfolio monitoring & risk alerts | Track drift, adverse trends, recommend actions. | Drift alerts, profitability, retention. |

## Experience Blueprint
| Stage | Human | AI/Agents | Systems |
| --- | --- | --- | --- |
| Intake & Data Prep | Actuary/underwriter collects exposure, claims, external data. | Data agent validates, enriches, logs provenance. | Data warehouse, feature store. |
| Model Development | Actuarial team trains GLM/GBM, sets constraints. | AutoML agent runs experiments, enforces monotonicity, fairness checks. | ML platform (Databricks/SageMaker). |
| Rate Scenario Analysis | Pricing team explores impact by segment. | Simulation agent generates rate curves, sensitivity analysis, scenario narratives. | Solver + analytics workspace. |
| Filing & Governance | Compliance/legal review justification, produce documentation. | Narrative agent creates SERFF filing, citations, reviewer checklist. | Document generator, governance workflow. |
| Monitoring & Feedback | Ops monitors metrics, runs regular evals. | Evaluation agent triggers drift alerts, recalibration tasks, updates dashboards. | Evaluation pipeline, Langfuse.

## Technical Architecture Stack
1. **Data Foundation:** Governed lakehouse + feature store, external data connectors (credit, weather, telematics).  
2. **Model Factory:** Versioned training pipelines (GLM, GBM, neural nets), experiment tracking, fairness checks.  
3. **Scenario Engine:** Elastic compute for pricing simulations, risk appetite integration, regulatory constraints.  
4. **Documentation & Governance:** Automated filing generator, risk register, policy-as-code integration.  
5. **Monitoring:** Drift detection, KPI dashboards, evaluation automation, Langfuse traces.

## Data & Models
- Policies, claims, exposures, third-party enrichment, geographic risk data.  
- Models: GLM with monotonic constraints, gradient boosting, deep embeddings for unstructured underwriting, LLM summarisation.  
- Tools: SHAP, fairness toolkits, Promptfoo for narrative evaluation.

## Implementation Sprints
1. **Data & Feature Store** – Consolidate data sources, data quality pipelines.  
2. **Model Baseline** – Train baseline models, log metrics, fairness, calibration.  
3. **Scenario + Governance** – Build simulation UI, integrate compliance steps.  
4. **Documentation Automation** – Generate filings, create reviewer workflows.  
5. **Monitoring & Alerts** – Drift detection, cost monitoring, incident response.  
6. **Continuous Improvement** – Feedback loops from underwriters, regulators, customers.

## Agent Build Instructions
- Reference CoE templates for insurance pattern architecture + BOM.  
- Use `05-projects` scaffolds (creator-evals for evaluation patterns).  
- Implement pipelines: data ingestion, model training, evaluation, documentation.  
- Provide command scripts and notebooks for coding agents to run full SDLC.  
- Deploy evaluation harness with Promptfoo, fairness tests, scenario metrics.  
- Output deliverable pack: architecture note, actuarial summary, filing template, monitoring dashboard.

## Evaluation & Observability
- Model metrics (Gini, loss ratio impact, calibration), fairness per segment.  
- Governance metrics (policy coverage, overrides, review SLA).  
- Operational metrics (deployment latency, cost).  
- Langfuse & logs for agent traceability.

## Governance & Controls
- Procurement check on external data providers.  
- Human review for rate changes; approvals logged.  
- Incident response for compliance/regulator queries.  
- Data retention, audit build according to governance library.

## Deliverables & Templates
- Pricing strategy deck, model documentation from CoE templates.  
- Filing kit (SERFF doc, evidence attachments).  
- Evaluation suite outputs + fairness report.  
- Ops runbook (monitoring, incidents, change management).