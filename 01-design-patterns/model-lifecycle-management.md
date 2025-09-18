# Pattern: Model & Prompt Lifecycle Management

**Mission:** Provide a reusable SDLC for models, prompts, and agents covering build, deploy, monitor, and evolve phases with rigorous governance.

## High-Value Use Cases
| Use Case | Impact | KPIs |
| --- | --- | --- |
| Centralised model registry | Single source of truth for artefacts, approvals. | Time-to-promote, rollback frequency, audit completeness. |
| Automated evaluation gates | Prevent regressions before release. | Gate pass rate, defect escape rate. |
| Cost & latency optimisation | Control spend while maintaining UX. | Cost per request, latency SLO, utilisation. |
| Incident management & retrospectives | Rapid response, learning loop. | MTTR, postmortem completion, recurrence. |

## Experience Blueprint
| Stage | Human | AI/Agents | Systems |
| --- | --- | --- | --- |
| Plan & Intake | Product/tech lead defines scope, risk tier. | Intake agent maps required controls, pipeline templates. | Governance registry, project tracker. |
| Build & Evaluate | Engineers train/tune models/prompts, run tests. | Automation agent triggers CI/CD, Promptfoo suites, fairness checks. | Git, CI, evaluation harness, ML platform. |
| Deploy & Release | Release manager approves promotion strategy. | Deployment agent handles canary/shadow, updates routing, logs metadata. | K8s/API gateway, feature flag platform. |
| Monitor & Operate | Ops monitors metrics, costs, incidents. | Observability agent correlates telemetry, alerts, triggers incident workflows. | Langfuse, Prometheus, logging. |
| Learn & Iterate | Team reviews metrics, captures insights. | Retro agent produces summaries, backlog items, storytelling assets. | Retrospective workflow, analytics. |

## Technical Architecture Stack
1. **Source Control & CI/CD:** Git, Actions/Jenkins, IaC for environments.  
2. **Data & Feature Management:** Versioned data lake, feature store, lineage tracking.  
3. **Experimentation & Registry:** MLflow/W&B, prompt registry, metadata tracking.  
4. **Deployment Fabric:** KServe/SageMaker/Vertex, serverless endpoints, caching, vector services.  
5. **Observability & Cost:** Langfuse, OpenTelemetry, cost dashboards, evaluation pipeline.  
6. **Governance:** Policy engine, approvals, audit logs, runbooks.

## Data & Models
- Training datasets versioned with DVC/LakeFS, evaluation datasets (golden sets).  
- Models: any (LLM, classical).  
- Tools: Prompt management, experiment tracking, evaluation suites, cost calculators.

## Implementation Sprints
1. **Blueprint Setup** – Establish repos, branching policy, CI skeleton.  
2. **Data & Evaluation** – Set dataset versioning, golden sets, Promptfoo harness.  
3. **Registry & Promotion** – Configure metadata, artefact storage, approvals.  
4. **Deployment Workflows** – Implement canary/shadow, rollback automation.  
5. **Monitoring & Alerts** – Langfuse, metrics, budget alerts.  
6. **Operations & Governance** – Incident response, retrospectives, compliance.

## Agent Build Instructions
- Use `scripts/check_secrets.py` to ensure env parity.  
- Scaffold pipelines referencing `05-projects/eval-automation` and CoE templates for lifecycle.  
- Provide automation scripts for building, evaluating, deploying, and logging results.  
- Document step-by-step instructions so coding agents can replicate SDLC: repo layout, commands, environment variables, tests.  
- Produce runbook covering release management, incident response, audits.

## Evaluation & Observability
- Gate metrics: accuracy, drift, fairness, guardrail compliance.  
- Operational metrics: latency, error rate, cost per token.  
- Governance metrics: approval SLA, audit completeness.  
- Telemetry: Langfuse traces, CI logs.

## Governance & Controls
- Apply procurement, incident, and human oversight checklists as needed.  
- Maintain audit-ready logs of changes, approvals, evaluation results.  
- Enforce retention, access control, privacy obligations.

## Deliverables & Templates
- Lifecycle blueprint deck, RACI, runbooks.  
- CI/CD pipeline scripts, evaluation configs, documentation.  
- Observability dashboards, incident templates.  
- Storytelling assets for leadership updates.