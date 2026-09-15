"""Tool registry, principals, and the authority matrix export.

A principal is the credential a tool runs as. Whoever holds it can do everything it can do,
whatever the prompt said.
"""
from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Principal:
    id: str
    revocation_path: str


@dataclass(frozen=True)
class Tool:
    name: str
    authority: str
    side_effecting: bool
    principal: str


# One principal per side-effecting tool, so revoking a refund credential cannot also stop replies,
# and leaking a reply credential cannot also issue refunds. Blast radius equals one tool.
#
# The two read tools share a principal, and that is an accepted risk, not a clean decision.
# read_ticket returns ticket bodies (customer personal data); search_kb returns articles the
# support team published. Reads at different classifications should not share a credential,
# because the shared one carries the higher classification everywhere it goes. It is accepted
# here because search_kb is only ever called inside a run that has already called read_ticket
# under the same credential, so a second credential would change what the secrets store holds
# and not what any run can reach. Reopen, and give search_kb its own principal, the day it is
# called from anywhere that does not also hold read_ticket, or at the next credential rotation.
# The stage-5 threat model records this as accepted risk 4.
PRINCIPALS: dict[str, Principal] = {
    "svc-support-reader": Principal(
        "svc-support-reader",
        "Delete the API key named support-reader in the secrets manager; the ticket store rejects it on the next request.",
    ),
    "svc-refund-issuer": Principal(
        "svc-refund-issuer",
        "Revoke the payments-service token refund-issuer, then confirm the next refund call with it is rejected. On-call runs this.",
    ),
    "svc-reply-sender": Principal(
        "svc-reply-sender",
        "Disable the mail-relay sender identity reply-sender; queued messages are dropped, not sent.",
    ),
    "svc-ticket-closer": Principal(
        "svc-ticket-closer",
        "Remove the ticket-closer role binding in the ticket store; existing sessions are invalidated on removal.",
    ),
}

TOOLS: list[Tool] = [
    Tool("read_ticket", "read", False, "svc-support-reader"),
    Tool("search_kb", "read", False, "svc-support-reader"),
    Tool("issue_refund", "refund", True, "svc-refund-issuer"),
    Tool("send_reply", "reply", True, "svc-reply-sender"),
    Tool("close_ticket", "close", True, "svc-ticket-closer"),
]

REGISTRY: dict[str, Tool] = {tool.name: tool for tool in TOOLS}


def authority_matrix() -> dict:
    """The shape the flagship's stage-3 artifact requires: tools, principals, sideEffecting, revocationPath."""
    return {
        "tools": [
            {
                "name": t.name,
                "authority": t.authority,
                "sideEffecting": t.side_effecting,
                "principal": t.principal,
            }
            for t in TOOLS
        ],
        "principals": [{"id": p.id, "revocationPath": p.revocation_path} for p in PRINCIPALS.values()],
        "sideEffecting": [t.name for t in TOOLS if t.side_effecting],
        "revocationPath": {p.id: p.revocation_path for p in PRINCIPALS.values()},
    }
