# Human Review & Oversight Checklist

Ensure human experts stay empowered during AI-assisted workflows.

## When to Require Human Review
- High-risk decisions (medical, financial, legal recommendations).
- Content with brand/regulatory implications (public statements, press, regulated marketing).
- Model updates, prompt changes, or data migrations affecting customer-facing outcomes.

## Review Stages
1. **Eligibility**: Define which tasks demand human approval vs. automated release.
2. **Reviewer Assignment**: Map reviewers to domains; ensure training and access rights.
3. **Context Delivery**: Provide AI output, source citations, metrics, and change diff.
4. **Decision Logging**: Capture approve/reject/needs changes with rationale.
5. **Feedback Loop**: Feed reviewer notes into prompt/data improvements and evaluation suites.

## Checklist
- [ ] Decision matrix documented and accessible.
- [ ] Reviewer rosters up to date with coverage across time zones.
- [ ] Review UI surfaces context, guardrail scores, cost, and citations.
- [ ] Audit log stores reviewer actions with timestamps and linked artefacts.
- [ ] Workflow enforces segregation of duties (no self-approval for authors).
- [ ] SLA tracking for review turnaround with escalation triggers.

## Artefacts
- Review policy doc stored under governance workspace.
- Example annotated output demonstrating correct reviewer feedback.
- Dashboard tracking review throughput and override rates.
- Continuous improvement backlog referencing reviewer insights.

## Related Resources
- [Intelligent Orchestration Workflow Pattern](../01-design-patterns/orchestration-workflow.md)
- [Creator Content Orchestration Sprint](../02-learning-paths/micro-modules/creator-content-orchestration.md)
- [Evaluation Automation Pipeline](../02-learning-paths/micro-modules/evaluation-automation-pipeline.md)