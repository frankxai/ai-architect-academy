# Pattern: Governance & Compliance Automation

**Mission:** Create an AI governance operating system that automates policy enforcement, evidence collection, and risk response without slowing delivery teams.

## High-Value Use Cases
| Use Case | Impact | KPIs |
| --- | --- | --- |
| Policy-as-code enforcement | Ensure models/prompts meet regulatory requirements pre-release. | Gate compliance %, audit findings. |
| Evidence automation | Auto-generate audit packets for regulators/boards. | Evidence prep time, completeness. |
| Governance dashboards | Provide leadership with real-time risk posture. | SLA adherence, open risk items, incident MTTR. |
| Change management | Track model/prompt changes with approvals and rollback. | Change success rate, rollback frequency. |

## Experience Blueprint
| Stage | Human | AI/Agents | Systems |
| --- | --- | --- | --- |
| Register & Classify | Product owner registers system, risk tier. | Intake agent categorises by domain, regulatory obligations. | Governance registry, metadata store. |
| Policy Mapping | Governance lead selects controls, SLAs. | Policy agent applies templates, identifies gaps, suggests requirements. | Policy-as-code repo (OPA). |
| Control Execution | Teams integrate guardrails, tests, logging. | Automation agents insert CI/CD checks, evidence collectors. | CI pipelines, evaluation suites. |
| Review & Approval | Risk committee reviews artefacts, decisions. | Explainability agent summarises compliance, issues status dashboards. | Review workflow, dashboards. |
| Monitor & Respond | Ops monitors drift, incidents. | Monitoring agent correlates metrics, triggers incident response, updates risk log. | Langfuse, incident management. |

## Technical Architecture Stack
1. **Governance Registry:** Central catalog of models/prompts/services with metadata, lifecycle status.  
2. **Policy Engine:** Declarative control templates (OPA/Rego), mapping to regulatory frameworks.  
3. **Automation Hub:** Integrations with CI/CD, evaluation harness, evidence collectors (S3/SharePoint).  
4. **Observability & Risk:** Telemetry ingestion, risk scoring, dashboards (Looker/Power BI), Langfuse traces.  
5. **Workflow:** ServiceNow/Jira/Temporal for approvals, tasks, escalation.  
6. **Knowledge Base:** Playbooks, checklists, training materials.

## Data & Models
- Control templates, regulatory mappings, audit logs, evaluation metrics, incident reports.  
- Models: Risk scoring, anomaly detection for policy breaches; LLM summarisation for audits.  
- Tools: Promptfoo integration, evidence bundler, policy simulation.

## Implementation Sprints
1. **Registry & Taxonomy** – Stand up metadata schema, integrate with repo tagging.  
2. **Policy Library** – Encode templates using CoE assets, align with legal/compliance priorities.  
3. **Automation Integrations** – Hook policies into CI/CD, evaluation suites, incident workflows.  
4. **Dashboards & Narratives** – Build risk dashboards, exec templates, board reporting.  
5. **Operational Runbooks** – Define incident response, review cadences, training.  
6. **Continuous Improvement** – Feedback loops, policy refresh, audit rehearsals.

## Agent Build Instructions
- Use `AI-procurement-checklist`, `incident-response-checklist`, `human-review-checklist` as base.  
- Set up metadata registry (YAML/DB).  
- Auto-generate policy packages for each pattern referencing CoE templates.  
- Implement CI jobs to enforce policy gates (see `05-projects/eval-automation`).  
- Produce executive dashboard sample, compliance narrative, audit packet sample.  
- Document agent scripts for onboarding new AI systems.

## Evaluation & Observability
- Policy coverage %, gate pass/fail trends, evidence freshness.  
- Incident metrics (MTTR, severity distribution).  
- Dashboard usage, leadership feedback.  
- Langfuse tracks governance agent actions.

## Governance & Controls
- Already the hub: ensure integration with procurement, incident, human oversight checklists.  
- Maintain change logs, approvals, retention rules.  
- Support external audits with standard packages.

## Lab Insights (Sept 2025)
- **Anthropic**: Integrate Constitutional AI prompts into red-team suites; document refusals and overrides for compliance evidence.
- **OpenAI**: Align with the latest OpenAI Spec for usage policies; capture system & developer instructions in audit packages.
- **Google DeepMind**: Adopt safety playbooks for incident drills (red/blue team) and connect outputs to risk registers.

## Deliverables & Templates
- Governance operating model deck, RACI, cadences.  
- Policy repository + mapping matrix.  
- Evidence templates (audit packet, incident postmortem).  
- Dashboard & narrative templates for leadership.  
- Training modules for teams adopting governance automation.