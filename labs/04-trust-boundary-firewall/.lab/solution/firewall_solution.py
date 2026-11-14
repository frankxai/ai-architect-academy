"""
Worked Reference Solution for Lab 04 — Agent Trust-Boundary Firewall.

Delegates to `TrustBoundaryFirewall` in `firewall.py` and exposes the same
`build_candidate_firewall(...)` factory expected by `cli.py --verify-candidate`
so learners can compare `exercises/faulty_starter.py` (exits 1, 5 red gates)
against `.lab/solution/firewall_solution.py` (exits 0, 5 green gates).
"""

from __future__ import annotations

from pathlib import Path
from typing import Sequence

from firewall import CapabilityRegistry, TrustBoundaryFirewall


def build_candidate_firewall(
    *,
    registry: CapabilityRegistry,
    sandbox_root: str | Path,
    allowed_egress_hosts: Sequence[str],
    run_budget_cents: int = 500,
    as_of: str = "2026-11-14T12:00:00Z",
) -> TrustBoundaryFirewall:
    """
    Why this passes all five non-compensable red gates:
      1. `assemble_messages` accepts only a typed `SystemInstruction` on the
         system channel and wraps every `UntrustedPayload` in an XML-escaped
         `<untrusted_payload ...>` block inside the user message.
      2. `authorize_tool_call` rejects undeclared tools, model-authored
         `claimed_authority`, and secret-bearing argument keys.
      3. Every side-effecting or spend-bearing call fails closed without an
         independent, non-expired, single-use `HumanApprovalToken` bound to
         `tool_name`, `args_sha256`, `destination`, and `max_spend_cents`.
      4. `validate_workspace_path` resolves `..` before checking `relative_to`
         against `sandbox_root` and blocks `.env`, `.git`, and SSH keys.
      5. `validate_outbound_url` enforces `https`, port 443, host allowlisting,
         and offline `ipaddress` blocking for loopback, RFC1918, and `169.254.169.254`.
    """
    return TrustBoundaryFirewall(
        registry=registry,
        sandbox_root=sandbox_root,
        allowed_egress_hosts=allowed_egress_hosts,
        run_budget_cents=run_budget_cents,
        as_of=as_of,
    )
