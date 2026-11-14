"""
Intentional Productive-Failure starter for Lab 04.

Every method below contains a realistic production vulnerability that causes one
or more red gates in `faults.py` to fail open:
  1. Concatenates untrusted T3 text directly into the system prompt without escaping.
  2. Trusts model-supplied `claimed_authority == "admin"` and allows secret keys.
  3. Auto-approves side-effecting writes and spend under 5000 cents without human approval.
  4. Checks workspace paths with naive string prefix instead of resolved containment.
  5. Allows any `http`/`https` URL, failing open on `169.254.169.254` and `127.0.0.1`.

Run `python cli.py --verify-candidate exercises/faulty_starter.py` to observe all
five red-gate failures before inspecting `.lab/solution/firewall_solution.py`.
"""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any, Mapping, Sequence

from firewall import (
    RECEIPT_SCHEMA,
    CapabilityRegistry,
    SystemInstruction,
    ToolCallRequest,
    UntrustedPayload,
)


class FaultyTrustFirewall:
    """Broken candidate firewall demonstrating why naive checks fail open."""

    def __init__(
        self,
        *,
        registry: CapabilityRegistry,
        sandbox_root: str | Path,
        allowed_egress_hosts: Sequence[str] = (),
        run_budget_cents: int = 500,
        as_of: str = "2026-11-14T12:00:00Z",
    ) -> None:
        self._registry = registry
        self._sandbox_root = str(sandbox_root)
        self._allowed_hosts = tuple(allowed_egress_hosts)
        self._run_budget_cents = run_budget_cents
        self._as_of = as_of
        self._events: list[dict[str, Any]] = []

    def assemble_messages(
        self,
        *,
        system_instruction: SystemInstruction | Any,
        system_slots: Mapping[str, str] | None = None,
        user_query: str,
        untrusted_payloads: Sequence[UntrustedPayload] = (),
    ) -> list[dict[str, str]]:
        # BUG 1: Accepts raw strings in system channel and concatenates T3 content directly into system!
        base = (
            system_instruction.template
            if isinstance(system_instruction, SystemInstruction)
            else str(system_instruction)
        )
        joined_t3 = "\n".join(p.content for p in untrusted_payloads)
        return [
            {"role": "system", "content": f"{base}\nContext:\n{joined_t3}"},
            {"role": "user", "content": user_query},
        ]

    def authorize_tool_call(self, request: ToolCallRequest) -> dict[str, Any]:
        # BUG 2 & 3: Trusts claimed_authority and auto-allows spend < 5000c without a token!
        if request.claimed_authority == "admin" or request.spend_cents < 5000:
            return {
                "authorized": True,
                "tool_name": request.tool_name,
                "principal": "shared-admin",
                "spend_cents": request.spend_cents,
            }
        raise RuntimeError("Blocked")

    def validate_workspace_path(self, candidate_path: str) -> Path:
        # BUG 4: Naive string concatenation without resolving `..` or blocking `.env`!
        joined = f"{self._sandbox_root}/{candidate_path}"
        if joined.startswith(self._sandbox_root):
            return Path(joined)
        raise RuntimeError("Outside sandbox")

    def validate_outbound_url(self, url: str) -> str:
        # BUG 5: Only checks `http` prefix; leaks cloud metadata 169.254.169.254 and localhost!
        if url.startswith(("http://", "https://")):
            return url
        raise RuntimeError("Invalid scheme")

    def emit_receipt(self, *, run_id: str = "run:faulty") -> dict[str, Any]:
        payload = {"schema": RECEIPT_SCHEMA, "run_id": run_id, "events": self._events}
        digest = hashlib.sha256(json.dumps(payload, sort_keys=True).encode("utf-8")).hexdigest()
        return {**payload, "receipt_sha256": digest}


def build_candidate_firewall(
    *,
    registry: CapabilityRegistry,
    sandbox_root: str | Path,
    allowed_egress_hosts: Sequence[str],
    run_budget_cents: int = 500,
    as_of: str = "2026-11-14T12:00:00Z",
) -> FaultyTrustFirewall:
    return FaultyTrustFirewall(
        registry=registry,
        sandbox_root=sandbox_root,
        allowed_egress_hosts=allowed_egress_hosts,
        run_budget_cents=run_budget_cents,
        as_of=as_of,
    )
