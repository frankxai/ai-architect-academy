# Incident Response Playbook for AI Systems

Respond quickly when AI services misbehave, integrating human-in-the-loop controls and communications.

## Signals to watch
- Guardrail breaches (toxicity, hallucinations, compliance infractions).
- Latency or cost spikes from runaway prompts or agent loops.
- Data exposure events (logs containing PII, model training on restricted data).

## Roles & Responsibilities
| Role | Ownership |
| --- | --- |
| Incident Commander | Coordinates response, decision making, and status updates. |
| AI Ops | Captures telemetry, triggers mitigations, performs rollbacks. |
| Domain SME | Evaluates business impact, approves messaging to stakeholders. |
| Communications | Notifies leadership, legal, and customers when applicable. |

## Response Checklist
1. **Detect & Acknowledge**: Auto-create ticket with severity, affected services, guardrail metrics, and last deploy ID.
2. **Stabilise**: Roll back to known good model/prompt, or route traffic to human fallback.
3. **Contain**: Disable risky features, rotate keys/tokens, purge compromised caches.
4. **Investigate**: Pull Langfuse traces, Promptfoo reports, deployment logs, and impacted dataset snapshots.
5. **Remediate**: Patch prompts/models, update guardrail rules, add regression tests.
6. **Communicate**: Issue updates every 30/60 minutes to stakeholders. Use templated incident briefs.
7. **Review**: Within 48 hours, run [Retrospective with AI](../15-workflows/retrospective-with-ai.md) and update risk registers / training.

## Artefacts
- Incident timeline (timestamps, decisions, owners).
- Root cause analysis with contributing factors and preventative actions.
- Updated playbooks (alerts, thresholds, rollback runbooks).
- Stakeholder comms archive (email/slack summaries).

## Related Resources
- [Model Lifecycle Management Pattern](../01-design-patterns/model-lifecycle-management.md)
- [AI Performance Optimisation Pattern](../01-design-patterns/performance-optimization.md)
- [Creator Evaluation Scorecards](../02-learning-paths/micro-modules/creator-evaluation-scorecards.md)