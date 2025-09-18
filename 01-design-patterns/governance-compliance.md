# Pattern: Governance & Compliance Automation

## Business Value
- Provide end-to-end traceability for AI systems, ensuring policies, risk controls, and regulatory obligations are satisfied without slowing delivery teams.
- Reduce manual evidence collection and audit preparation by codifying governance workflows, checklists, and automated controls.
- Increase organisational trust in AI deployments through transparent reporting of model lineage, performance, and policy adherence.

## Technical Architecture
1. **Policy Repository**: Structured catalog of regulations, internal standards, and control templates linked to products and models.
2. **Workflow Orchestration**: Automated gating (ServiceNow/Jira) that enforces risk assessments, approvals, and segregation-of-duties before promotion.
3. **Evidence Collection**: Integrations with MLOps, data platforms, and observability tools to ingest artefacts (datasets, model cards, evaluation reports).
4. **Continuous Monitoring**: Real-time checks on drift, bias, privacy, and access logs with escalations to compliance officers.
5. **Reporting & Audit**: Dashboards and exportable audit packages summarising status by regulation, business unit, and control effectiveness.

## Discovery Questions
- Which external regulations (EU AI Act, GDPR, SOX, HIPAA) and internal policies apply to the AI portfolio?
- How are models currently catalogued, and what metadata is missing to satisfy governance requirements?
- Who are the control owners, reviewers, and approvers, and what SLAs must workflows meet?
- What evidence is required for audits, and how long must it be retained or made discoverable?

## Bill of Materials
- Governance platform (Azure AI Studio governance, Credo AI, or custom) with metadata catalog (DataHub, Collibra) and policy engine (OPA).
- Integration adapters for ML pipelines (MLflow, SageMaker), data lineage (OpenLineage), and observability (Langfuse, EvidentlyAI).
- Workflow automation (ServiceNow, Jira, Workato) connecting control tasks to accountable teams.
- Storage for immutable evidence (WORM-compliant object store) and reporting layer (Power BI, Looker) with RBAC.

## Risks & Controls
- **Policy Drift**: Version policies, automate change notifications, and maintain governance release notes linked to impacted systems.
- **Shadow AI Deployments**: Implement discovery scans, enforce registration through CI/CD hooks, and monitor infra for unregistered endpoints.
- **Audit Failure**: Automate evidence capture with tamper-proof storage, and run rehearsal audits to validate completeness.
- **Change Fatigue**: Provide self-service playbooks, training, and embedded compliance champions to ensure adoption across teams.