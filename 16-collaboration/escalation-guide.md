# Escalation Guide for AI Architect Teams

Use when incidents, policy risks, or critical blockers arise. Keep it visible next to your runbook.

## Levels
| Level | Trigger | Who to Engage | Response Time |
| --- | --- | --- | --- |
| P0 | Production outage, customer impact, critical security issue | Engineering lead, security, exec sponsor | Immediate |
| P1 | Major degradation (latency, cost spikes), policy breach | Tech lead, product lead, legal/compliance | < 2 hours |
| P2 | Evaluation failure, new risk identified, missing dependency | Team core, governance partner | < 1 business day |
| P3 | FYI / observation | Team async channel | Asynchronous |

## Escalation Checklist
1. Capture context (time, system, version, owner).
2. Attach observability evidence (Langfuse trace, logs, eval results).
3. Identify customer or stakeholder impact.
4. Propose immediate mitigation + longer-term fix.
5. Book follow-up with postmortem owner (`15-workflows/postmortem.md`).

## Communication Templates
```
Subject: [LEVEL] Incident - <system/component>
Context:
Impact:
Immediate action:
Support needed:
Next update:
```

## Prevention Loops
- Track incidents in a shared doc; review trends monthly.
- Review guardrail dashboards weekly with governance partners.
- Rotate incident commander role to build muscle across the team.
