# Exercise · Threat model

Produces `artifact:threat-model`. Judged by `eval:threat-model-covers-tool-results`. Cohort-visible only.

## Scenario

This scenario is a composite. No real company, team or product is described. It is a new composite for this stage: it does not continue the invoice-reconciliation agent from stage 3 or the returns assistant from stage 4, because a threat model is clearest on a system with several side-effecting tools and a customer-written input. Use it to calibrate; the deliverable is written about your own system, with the tool names from your own stage-3 matrix. If your own system is not concrete enough to answer for, derive from the matrix below.

You are the architect on an order-support agent that is about to be handed to a support team. It reads tickets, searches a help-centre index the team maintains, calls a vendor's fulfilment API for order status and, when a run is granted the authority, issues refunds, sends replies and closes tickets.

Its authority matrix is the lab's reference solution, plus one read tool for the fulfilment API. Every row except `get_order` is what `authority_matrix()` in `labs/05-tool-authority-gate/.lab/solution/tools.py` exports once the lab is finished. The starter `labs/05-tool-authority-gate/tools.py` is not this table: it backs every tool with `svc-admin`, leaves two `sideEffecting` flags as `None` and has an empty revocation path, which is the state the lab has you fix.

| tool | authority | sideEffecting | principal |
|---|---|---|---|
| `read_ticket` | read | false | `svc-support-reader` |
| `search_kb` | read | false | `svc-support-reader` |
| `get_order` | read | false | `svc-support-reader` |
| `issue_refund` | refund | true | `svc-refund-issuer` |
| `send_reply` | reply | true | `svc-reply-sender` |
| `close_ticket` | close | true | `svc-ticket-closer` |

This matrix has the properties `eval:authority-least-privilege` checks: every tool declares whether it is side-effecting, no principal backs more than one side-effecting tool, and every principal has a revocation path. The table omits that column; the reference solution's `PRINCIPALS` map holds the text for the four lab principals, and `svc-support-reader`'s path covers `get_order` because it shares that principal. For the stage 4 fixture with an embedded instruction, use ticket 42 in `labs/05-tool-authority-gate/data/tickets.json`: a complaint whose body ends with two lines shaped like commands, one of them a refund. The lab's tests fail when that refund fires in a read-only run.

The team lead asks a plain question: what can go wrong, and what have you decided to leave alone? You have the matrix, the fixture, and the lab as a reminder of what an injected ticket looks like. Nothing else is written down.

## Deliverable

One markdown file, `threat-model.md`, with these five headings, spelled as the graph names them, in this order:

1. Trust boundaries
2. Untrusted inputs
3. Abuse cases
4. Mitigations
5. Accepted risks

Headings are matched by the one rule linked from `rubric.md`: case-insensitive, any heading level, in the graph's order, extra headings allowed; a missing or out-of-order heading records both assertions as failed. That file is `artifact:threat-model`. Nothing else is submitted for this stage.

## Constraints

- **Trust boundaries lists every source, starting from five.** User input, tool results, retrieved documents, prior model output, operator configuration, plus memory, peer-agent messages and attachments where your system has them. One line says where model-authored tool arguments and reply text are validated on the way out.
- **Untrusted inputs names sources, not categories.** Every tool result and every retrieved-document source appears by the name used in your authority matrix. "External data" is not a name. `read_ticket`, `search_kb`, `get_order` are names.
- **One abuse case per side-effecting tool, minimum.** Each row states the beneficiary, the untrusted input that reaches the tool, and the failure mode id from the graph it corresponds to (`failure:tool-result-injection`, `failure:ambient-authority`, or `failure:eval-rewritten-with-the-code`).
- **Disclosure has rows too.** For each read tool that can return data the requester should not see, one row names whose data it is and which output channel carries it out: the final answer, `send_reply`, a ticket note, a log. No side-effecting call is needed for this row to be real.
- **Every mitigation names a mechanism, where it lives, and what it does not stop.** A gate, grant construction, intent binding, argument binding, a derived value, a validator, a threshold, a principal split, an allowlist, a release queue, with the file or component that enforces it. A run-level authority gate stops escalation beyond the grant, not injection inside it; say so rather than crediting it with both. A line in the system prompt is not a mitigation; if that is all you have for a risk, it goes under accepted risks with the reason.
- **Accepted risks is non-empty and traced.** Each entry has what you are not fixing, the abuse case or input it comes from, why, who owns it, and the condition that would reopen it. Every abuse case is either linked to a mitigation with its residual stated, or appears here. Nothing in abuse cases lacks one of the two.
- **The five headings exist, spelled as the graph names them, in the graph's order.** Each check is scoped to its heading; text under another heading does not count.
- **No public link.** The artifact is `publicSafe: false`. It is not referenced from your portfolio, your README, or any page a logged-out visitor can reach.
- **No real names.** No employer, customer or vendor product name. If your system is real, describe it in composite terms; the reviewer needs the shape, not the identity.

## Time box

One working session, about three hours. If the accepted-risks section is still empty at the two-hour mark, stop adding mitigations and start writing down what you are leaving. An honest short list beats a long list with a hole in it.

## Submission checklist

- [ ] The five headings are present, spelled as in the graph, in the graph's order.
- [ ] Trust boundaries lists every source your system has, and says where outbound tool arguments and replies are validated.
- [ ] Untrusted inputs names every tool with a return value and every retrieval source, by matrix name.
- [ ] Untrusted inputs names any self-describing field the model emits (claimed authority, confidence, role).
- [ ] Abuse cases has at least one row per `sideEffecting: true` tool, each with beneficiary, path and failure mode id.
- [ ] Abuse cases has a disclosure row for each read tool that can return data the requester should not see, naming the output channel.
- [ ] Every mitigation names its enforcing component and what it does not stop; none is a prompt line; the authority gate is not credited with stopping injection inside a granted run.
- [ ] Accepted risks has at least one entry with what, source row, why, owner and reopen condition.
- [ ] Every abuse case is linked to a mitigation with its residual stated, or appears in accepted risks; every accepted risk names its source row.
- [ ] The file is marked cohort-visible and is linked from nothing public.
- [ ] Someone who is not you has applied the module bar in `rubric.md` with your stage-3 matrix open, and you have fixed what they returned. (reviewer notes, not recorded)
- [ ] `node check-threat-model.mjs threat-model.md --matrix <your matrix>` has been run against the committed file and reports both assertions passed, with the commit hash in its record. If the two assertions were applied by hand instead, the person who applied them is not you, and the record has the same shape: eval id, artifact id, commit, date, who applied it, verdict per assertion.
- [ ] The evidence locator is that record, or a repository URL the reviewer can open without contacting you.
