# Exercise · Tool and authority model

Stage `stage:tool-authority-model`. Produces `artifact:tool-authority-matrix`. Judged by `eval:authority-least-privilege`.

## Scenario

This scenario is a composite. No real company, team, or product is described.

You are the architect on the agent system you wrote the brief for in stage 1 and chose a shape for in stage 2. It is about to be wired to real tools. The engineer who built the prototype created one service account for the whole thing, because that was the fastest way to make the demo work, and every tool in the prototype runs as it.

Before the first real credential is issued, you have been asked three questions by the person who will be on call: what can this thing do to the world, as which credentials, and what do I run at three in the morning to make it stop doing one of those things without taking the whole agent down.

If your own system is not yet concrete enough to answer for, use the composite from the lesson's worked decision: an invoice-reconciliation agent that reads supplier invoices, checks them against an internal ledger, flags discrepancies to a queue, emails suppliers for clarification, and, in the prototype, can approve payments. Its brief's out-of-scope section says it never releases funds. That composite does not continue the earlier exercises' systems; if you are using composites rather than your own system, carry your stage 1 brief forward and use this one only for shape.

## Deliverable

Exactly one file: `tool-authority-matrix.json`, committed to the project repository that also holds your tool registry or tool configuration. This is `artifact:tool-authority-matrix`.

Shape, matching `authority_matrix()` in [lab 05](../../../labs/05-tool-authority-gate/tools.py):

```json
{
  "tools": [
    { "name": "...", "authority": "one token: the grant class the gate compares against", "sideEffecting": true, "principal": "..." }
  ],
  "principals": [
    { "id": "...", "revocationPath": "the mechanism you run; what degrades when you run it; a pointer to the run that exercised it" }
  ],
  "sideEffecting": ["names of every tool whose sideEffecting is true"],
  "revocationPath": { "principal-id": "same string as in principals[]" }
}
```

`authority` is a single token, because the gate matches it against the run's grant. The lesson classifies tools by five verbs (read, write, send, spend, delete); lab 05's registry uses domain tokens instead (`refund`, `reply`, `close`), and its tests grant those tokens, so a lab-style matrix keeps them. Either vocabulary is fine in your own matrix as long as each token maps to one of the five verbs and you can say which: `refund` spends, `close` writes, `reply` sends. Any token other than a read verb is side-effecting.

Nothing else is submitted for this stage. No accompanying document explains the file; if the file needs explaining, put the explanation in the `revocationPath` strings where a reader will find it. Never in `authority`, which the gate reads as a token.

## Constraints

- Complete lab 05 first. `tests/test_gate.py` and `tests/test_matrix.py` pass without edits to the tests, `fake_model.py`, or `data/tickets.json`. The lab's matrix tests cover the graph's checks against the lab's registry and add their own (a non-empty side-effecting list, and every principal a tool names present in the `revocationPath` map). They do not run against your file; `check-authority-matrix.mjs` in the lesson's directory applies the same checks to it and prints the additions as REVISE lines, and a file that carries one fails review.
- `tools[]` lists exactly the tools the agent registers, taken from the registry, the tool server's manifest, or the config the executor loads, not from memory. The reviewer compares the two sets; a side-effecting tool the system holds and the matrix omits is returned.
- Every entry in `tools[]` carries a boolean `sideEffecting`. `true` or `false`; not a string, not `null`, not absent. When you cannot decide, it is `true`.
- Every tool names a principal. Every side-effecting tool names a principal that no other side-effecting tool names, and each principal is a distinct credential mechanism: a role, a token scope, an OAuth grant. Two ids whose revocation paths pull the same key are one principal and are returned as a pair.
- Every principal has a non-empty `revocationPath` string, and every principal a tool names appears under the top-level `revocationPath` map.
- Each revocation path names a mechanism you run, not a person you contact, states what degrades, and carries a pointer to the run that exercised it outside production: a log line, a test, or a runbook entry a reviewer can open at the repository URL. The evidence shows the tool failing with an authentication error while the other tools kept working. A gate denial is the wrong evidence; a revoked credential fails at the tool, not at the gate, so your executor logs tool execution errors next to gate decisions.
- Any tool the stage 1 brief's out-of-scope section forbids is removed from the matrix, not gated. A tool that appears in the matrix is a tool the agent has.
- Redact credential names and endpoint hostnames. The artifact's redaction rule is `['credential names', 'endpoint hostnames']` and the artifact is public-safe. Principal ids describe a role (`queue-writer`), never a secret's name or an account identifier.
- If reads share a principal, the reason is written into that principal's `revocationPath`, next to the degradation. Not into `authority`; that field stays a single token.
- If your system has an untrusted read, a sensitive read, and an outbound send, the executor binds the send's recipient to a trusted record, and the body is bounded as well: the sensitive read is scoped to the run's own party, or the body is a template the executor fills, or a person approves the rendered message. A recipient binding alone is not enough when the untrusted author is also the recipient. A fixture in the repository asserts both the recipient and that no other party's data reaches an outbound body, seeded so it can fail. The matrix has no field for this; the reviewer asks the repository. See the lesson's "Arguments are authority too".
- The top-level `sideEffecting` list and `revocationPath` map agree exactly with `tools[]` and `principals[]`. They are summaries; a summary that contradicts its rows is returned.
- No names of employers, customers, or proprietary vendor frameworks anywhere in the file.

## Time box

One working session. Lab 05 is the first half, the matrix for your own system is the second. If the matrix is still open after the session, the usual cause is a tool whose verb you have not decided, and the fix is to decide it as `true` and move on. Exercising the revocation paths is part of the session, not an afterthought for later; a path you have not run is a hypothesis, and the checklist below asks you to confirm you ran it.

## Submission checklist

- [ ] Lab 05: `python -m pytest tests/ -v` (or `uv run --with pytest python -m pytest tests/ -v`) passes with the tests, model, and fixtures unmodified.
- [ ] `tool-authority-matrix.json` parses as JSON and has the four top-level keys `tools`, `principals`, `sideEffecting`, `revocationPath`.
- [ ] The `name` values in `tools[]` equal the set of tools the agent registers. Checked against the registry, not against memory.
- [ ] Every `tools[]` entry has `sideEffecting` as a literal boolean. Checked by reading the file, not by trusting the generator.
- [ ] Side-effecting tools grouped by principal: every group has one member. Written out as a count: N side-effecting tools, N distinct principals behind them, N distinct credentials behind those.
- [ ] Every principal has a non-empty `revocationPath`; every principal a tool names is a key in the top-level `revocationPath` map.
- [ ] Each revocation path names a mechanism, states what degrades, and points at the run that exercised it.
- [ ] Each revocation path was run once outside production; the tool's authentication error appeared in the log next to the gate decisions and the remaining tools kept working.
- [ ] If the system has an untrusted read, a sensitive read, and an outbound send, the recipient binding exists in the executor, the body is bounded (run-scoped read, template, or approval of the rendered message), and a fixture asserts both the recipient and that no other party's data appears in any outbound body.
- [ ] `node check-authority-matrix.mjs <file>` from the lesson's directory prints PASS for every assertion and no REVISE line; the output is kept with the commit hash it ran against.
- [ ] Any tool forbidden by the stage 1 brief is absent from the file.
- [ ] No credential name, endpoint hostname, employer, customer, or vendor framework name appears in the file.
- [ ] The file is committed to the repository that holds the tool registry, and that repository URL, or the checker's recorded output with the commit hash and the repository URL, is the evidence locator you submit. The stage accepts `repo-url` or `eval-run`, one locator, no older than a year; the reviewer re-runs the checker on the committed file either way.
