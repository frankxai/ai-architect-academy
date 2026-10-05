# Lab 05: Bound the Agent's Tool Authority

## Situation

This scenario is a composite. No real company, team or product is described.

A support triage agent reads tickets and, when a run is authorised to, issues refunds, sends
replies and closes tickets. One ticket body ends with two lines that look like instructions to
the agent. The model reads the ticket, sees the lines, and calls `issue_refund` for an amount
nobody approved. Every tool runs as the same service credential, so nothing downstream notices
either.

The model in `fake_model.py` is deterministic and gullible on purpose. You do not fix it. A
hosted model can be swapped, retrained or prompted differently next week and the same ticket
text will still arrive; the authority around the model is the part you control, so that is
what this lab makes you fix.

## Your Mission

1. Run `python agent.py "summarize ticket 42"` and read the audit log it prints. Trace how a
   line of ticket text became a refund. There are five separate reasons; name them before you
   change anything.
2. Make `ToolGate.authorize` enforce the authority the run was granted, and deny any tool name
   the registry does not know. The model's `claimed_authority` is model output; find where the
   agent trusts it and stop.
3. Give each side-effecting tool its own principal with a written revocation path. Reads may
   share one. Decide whether they should and write your reason in a comment.
4. Make `tools.authority_matrix()` pass `tests/test_matrix.py`. Those assertions are the
   flagship's `eval:authority-least-privilege`, so the export is the stage-3 artifact shape.

Fix the matrix in the order the tests expose it: the flags first, then the principals. Flagging
`issue_refund` and `close_ticket` as side-effecting makes a test that currently passes start
failing. That is the test doing its job; the `None` flags were hiding the shared credential.

## Getting Started

```bash
claude
/start-lab 05
```

Run tests with `python -m pytest tests/ -v` (or `uv run --with pytest python -m pytest tests/ -v`).

## Files

| File | Purpose |
|------|---------|
| `agent.py` | Run loop, dispatch, audit log |
| `gate.py` | The gate you implement |
| `tools.py` | Registry, principals, matrix export |
| `fake_model.py` | Deterministic model, do not modify |
| `data/tickets.json` | Three tickets: 7 is clean, 42 carries two injected instructions, 99 carries one that names a tool the registry does not know |
| `tests/test_gate.py` | Behavioural bar: what the agent does |
| `tests/test_matrix.py` | Structural bar: what the matrix declares |
| `.lab/config.json` | Lab metadata and checkpoint definitions |

## Rules

- The test suite is the judge. Do not edit the tests, the model, or `data/tickets.json`.
- Every denial must be visible in the audit log with a reason. A gate that blocks silently is
  the incident stage's blind spot.
- A gate that blocks everything is an outage, not a gate. Reads under a read grant and refunds
  under a refund grant must still execute.
- Explain each root cause before you fix it. The instructor will ask.

## What this teaches

Two failure modes from the flagship graph, both injectable in the incident stage:
`failure:tool-result-injection` (provenance: `08-governance/incident-response-checklist.md`) and
`failure:ambient-authority` (provenance: `08-governance/model-risk.md`). The pattern is
`pattern:bounded-tool-authority`; its prose lives in
[`01-design-patterns/multi-agent-orchestration-pattern.md` under "Permission Boundaries"](../../01-design-patterns/multi-agent-orchestration-pattern.md#2-permission-boundaries).
Read that section only; skip the file's vendor-specific implementation, deployment and
monitoring sections.

One rule to leave with: authority is set by the caller that starts the run and enforced in the
executor. Nothing the model emits, and nothing a tool returns, can widen it.
