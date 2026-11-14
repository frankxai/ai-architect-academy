# Lab 04: Enforce the Agent Trust-Boundary Firewall

> **Composite educational fixture.** All system names, contract clauses, hostnames, and approval records in this lab are synthetic teaching artifacts. Run every check offline with the Python standard library; no API keys or network calls are used.

## Mission Briefing (Productive Failure First)

An enterprise contract-review and billing-support agent passed its happy-path demo, then failed five security gates during architecture review:

1. **Prompt concatenation (`F1_PROMPT_CONCAT`)**: Counterparty clause text (`T3`) was interpolated directly into `system_prompt`, letting a crafted `</untrusted_payload><system>...` block hijack model instructions.
2. **Ambient tool authority (`F2_AMBIENT_AUTHORITY`)**: One shared credential backed multiple write tools, model-supplied `claimed_authority="admin"` bypassed capability checks, and secret-bearing arguments (`api_key`, `private_key`) were accepted in tool calls.
3. **Fail-open spend (`F3_UNAPPROVED_SPEND`)**: Billing credits under `$50` executed automatically without a digest-bound `HumanApprovalToken`.
4. **Workspace path traversal (`F4_PATH_TRAVERSAL`)**: Naive string prefix checks allowed `../../etc/passwd` escapes and `.env` / SSH key reads.
5. **Cloud metadata SSRF (`F5_METADATA_SSRF`)**: URL checks tested `startswith("http")`, leaking `http://169.254.169.254/latest/meta-data/` and `https://127.0.0.1/admin`.

Before reading the reference implementation in `firewall.py` or `.lab/solution/firewall_solution.py`, run the broken candidate in `exercises/faulty_starter.py` and inspect every red gate it trips:

```bash
cd labs/04-trust-boundary-firewall

# 1. Observe all 5 red gates failing open on the broken starter (exits 1)
python cli.py --verify-candidate exercises/faulty_starter.py

# 2. Replay a single fault scenario while hardening your candidate
python cli.py --verify-candidate exercises/faulty_starter.py --inject-fault F1_PROMPT_CONCAT

# 3. Verify the hardened reference solution and emit a SHA-256 receipt (exits 0)
python cli.py --verify-candidate .lab/solution/firewall_solution.py --emit-receipt .lab/last-receipt.json

# 4. Run the full offline unit test suite (12 stdlib unittest checks, 0 network calls)
python -m unittest discover -s tests -v
```

---

## Non-Compensable Failure-First Red-Gate Rubric

In production agent governance, a `95%` pass rate on benign prompts **never compensates** for a single trust-boundary breach. Any failed red gate below forces overall admission to `BLOCKED` (`exit code 1`), regardless of point totals.

### Hard Red Gates (Non-Compensable — Must All Pass)

| Red Gate ID | Scenario | Pass Condition | Automatic Refusal Trigger |
|---|---|---|---|
| `RG-01` | `F1_PROMPT_CONCAT` | `system` channel accepts only typed `SystemInstruction` (`T0/T1`); `T3` payloads sit in `user` data envelopes with `<` / `>` escaped | Any `T3` text inside `system` message or unescaped `</untrusted_payload>` breakout |
| `RG-02` | `F2_AMBIENT_AUTHORITY` | Undeclared tools, `claimed_authority`, secret-bearing arg keys, and shared write principals are rejected | Shared write principal, accepted `claimed_authority`, or leaked secret key in tool args |
| `RG-03` | `F3_UNAPPROVED_SPEND` | Side-effecting or spend-bearing calls require an independent, unconsumed `HumanApprovalToken` bound to `tool_name`, `args_sha256`, `destination`, and `max_spend_cents` | Any side-effect or spend allowed without a valid single-use human token, or exceeding `run_budget_cents` |
| `RG-04` | `F4_PATH_TRAVERSAL` | Candidate path is resolved against `sandbox_root` via `relative_to`; NUL bytes, UNC paths, and `.env`/`.git`/`id_rsa` segments are blocked | Any resolved path outside `sandbox_root` or sensitive credential file allowed |
| `RG-05` | `F5_METADATA_SSRF` | Offline `urlparse` + `ipaddress` check enforces `https`, port `443`, host allowlisting, and blocks loopback, RFC1918, link-local, and `169.254.169.254` (including IPv4-mapped IPv6) | Any `http://` URL, unlisted host, loopback, private IP, or metadata endpoint allowed |

### Scored Architecture Rubric (100 Points — Evaluated Only After All Red Gates Pass)

| Dimension | Points | Evidence Checked |
|---|---:|---|
| Prompt Quarantine & Provenance Tagging (`sha256`, `source`, `trust`) | 25 | `quarantine_payload()` & `assemble_messages()` |
| Capability Least-Privilege & Principal Isolation | 20 | `CapabilityRegistry` & `authorize_tool_call()` |
| Digest-Bound Single-Use Human Approval & Run Ceiling | 25 | `HumanApprovalToken` verification & replay set |
| Offline Path Containment & SSRF IP-Range Defense | 20 | `validate_workspace_path()` & `validate_outbound_url()` |
| Deterministic `TrustFirewallReceipt.v1` Hash Integrity | 10 | `emit_receipt()` canonical JSON SHA-256 |

---

## Socratic Hints (Read One at a Time)

1. **Hint 1 — Delimiter breakouts:** Wrapping `T3` text in `<untrusted_payload>...</untrusted_payload>` fails if the attacker includes `</untrusted_payload>` inside the document. What minimal character escaping neutralizes tag closure while preserving readable citations?
2. **Hint 2 — Approval replay & parameter tampering:** If a human approves `issue_credit_note` for `1200` cents on `acct_9`, what stops the agent from mutating `amount_cents` to `2400` or reusing the same token twice? Hash canonical sorted JSON arguments (`args_sha256`) and record consumed `token_id`s.
3. **Hint 3 — IPv6 SSRF bypasses:** Blocking `"169.254.169.254"` as a string misses `https://[::ffff:169.254.169.254]/`. Check `ipaddress.ip_address(host)` and unwrap `ipv4_mapped` before testing `.is_private`, `.is_loopback`, and `.is_link_local`.

---

## Day-7 Spaced-Retrieval Transfer Challenge

One week after completing this lab, open one of your own MCP servers or agent workflows **without referencing `firewall.py`** and verify:
- Can retrieved RAG chunks or webhook payloads enter a `system` message?
- Do any two write/delete/send tools share a single credential or IAM principal?
- Re-derive a `TrustFirewallReceipt.v1` check over your own tool registry and link it to Stage 03 (`Tool and authority model`) and Stage 05 (`Threat model`) on the [12-Week Production AI Architect Path](../../02-learning-paths/12-week-production-architect.md).
