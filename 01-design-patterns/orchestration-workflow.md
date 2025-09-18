# Pattern: Intelligent Orchestration Workflow

**Mission:** Coordinate human experts, AI agents, and legacy systems through resilient workflows with full observability and compliance.

## High-Value Use Cases
| Use Case | Impact | KPIs |
| --- | --- | --- |
| Claims adjudication | Reduce cycle time, improve accuracy. | SLA compliance, rework %, customer CSAT. |
| Customer onboarding | Automate document collection, checks, approvals. | Time-to-activate, drop-off rate. |
| Content approval | Manage multi-stage creative review with guardrails. | Approval SLA, compliance violations. |
| Back-office escalations | Route issues to experts with context. | First contact resolution, backlog size. |

## Experience Blueprint
| Stage | Human | AI/Agents | Systems |
| --- | --- | --- | --- |
| Intake & Classification | User submits request/task. | Ingestion agent tags, prioritises, routes, fetches context. | Intake UI, CRM, CMS. |
| Task Decomposition | Ops lead defines required steps, resources. | Planner agent sequences tasks, assigns humans/bots, adds guardrails. | Workflow engine (Temporal/Camunda). |
| Execution & Collaboration | SMEs, bots complete tasks. | Task agents call APIs, update records, generate summaries, escalate exceptions. | Service APIs, RPA, LLM tools. |
| Review & Approval | Approvers review outcomes, provide feedback. | QA agent aggregates evidence, policy checks, diff view. | Review console. |
| Completion & Feedback | Ops communicates outcomes, logs metrics. | Reporter agent updates systems, notifies stakeholders, triggers retros. | Ticketing, analytics.

## Technical Architecture Stack
1. **Orchestration Engine:** Temporal/Camunda/Airflow for long-running workflows, retries, schedules.  
2. **Task Router:** Queue + rules engine, dynamic assignment, SLA monitoring.  
3. **Context Store:** Shared case file (Postgres/Elastic), embeddings for knowledge retrieval.  
4. **Agent Services:** Tool wrappers, LLM orchestrators, RPA integrations, deterministic microservices.  
5. **Experience Layer:** Unified worker workspace, approvals, dashboards.  
6. **Observability:** Langfuse, OpenTelemetry, audit logs, evaluation harness.

## Data & Models
- Case metadata, knowledge bases, policy documents, customer history.  
- Models: LLMs for instructions, summarisation; classifiers for routing; scoring models; analytics.  
- Tools: Prompt orchestration frameworks, guardrail libraries, RPA bots.

## Implementation Sprints
1. **Workflow Blueprint** – Map key processes, define SLA, identify automation opportunities.  
2. **Core Orchestrator** – Implement workflow engine with sample process.  
3. **Agent Integration** – Add retrieval, generation, API tools, RPA connectors.  
4. **Human Workspace** – Build UI with context, approvals, feedback loops.  
5. **Observability & Governance** – Add logging, metrics, incident handling.  
6. **Optimisation & Scale** – Experimentation loops, cost controls, new use cases.

## Agent Build Instructions
- Reference CoE template for orchestration technical architecture + BOM.  
- Start from `05-projects` to create orchestrated prototypes (integrate `eval-automation`).  
- Provide JSON/YAML workflow definitions, scripts for deployment.  
- Document tasks for coding agents: implement new step, add tool, add guardrail, create UI component.  
- Deliver full package: workflow diagram, state machine, runbook, evaluation results, retro log.

## Evaluation & Observability
- Process metrics (cycle time, SLA adherence, rework).  
- Quality metrics (guardrail hits, human overrides).  
- Operational metrics (queue depth, cost).  
- Observability via Langfuse + custom dashboards.

## Governance & Controls
- Procurement for automation vendors.  
- Human review for critical decisions.  
- Incident response plan for workflow failures.  
- Compliance logging (who approved, when, why).  
- Tie into governance library.

## Deliverables & Templates
- Orchestration pattern deck, BOM, technical design.  
- State machine diagrams, user flow charts.  
- Evaluation suite results, SLA dashboard.  
- Runbooks (incident, release, training).  
- Storytelling asset for stakeholders.