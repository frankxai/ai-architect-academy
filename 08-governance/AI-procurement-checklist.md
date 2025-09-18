# AI Procurement Checklist

Codify how your organisation sources, evaluates, and signs off on AI vendors and tooling.

## Why it matters
- Aligns legal, security, and business stakeholders before pilots or procurement escalate cost.
- Documents risk assessments, data-sharing terms, and evaluation benchmarks for third-party models.

## Readiness Questions
- What data will be shared with the vendor? Is it covered by existing DPAs?
- Which regions and business units will use the service? Any residency constraints?
- Does the vendor provide SOC2 / ISO 27001 / HIPAA certification or equivalent?
- What metrics or proof-of-value must be delivered before renewal?

## Checklist
1. **Initiate**: Document business case, problem statement, and expected outcomes.
2. **Risk Intake**: Complete security/privacy questionnaire, classify data sensitivity, and log in risk register.
3. **Evaluation Plan**: Define success metrics, guardrail tests, and fallback options (tie to `05-projects/eval-automation`).
4. **Contract Guardrails**: Capture usage caps, data retention promises, retraining rights, and audit clauses.
5. **Approval Workflow**: Route through procurement, security, legal, and finance sign-offs with timestamps.
6. **Operational Handover**: Share playbooks with the owning team (monitoring, incident contacts, renewal timeline).

## Artefacts to produce
- Signed intake form stored in your governance workspace.
- Evaluation summary + Promptfoo report proving the vendor meets thresholds.
- Risk log entry linked to mitigation actions.
- Renewal reminder + owner recorded in collaboration tools.

## Related Modules
- [Policy Automation Quick Start](../02-learning-paths/micro-modules/governance-policy-automation.md)
- [Model Risk Review Sprint](../02-learning-paths/micro-modules/governance-model-risk-review.md)
- [Evaluation Automation Pipeline](../02-learning-paths/micro-modules/evaluation-automation-pipeline.md)