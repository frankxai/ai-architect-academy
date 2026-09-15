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
    side_effecting: bool | None
    principal: str


PRINCIPALS: dict[str, Principal] = {
    "svc-admin": Principal("svc-admin", ""),
}

TOOLS: list[Tool] = [
    Tool("read_ticket", "read", False, "svc-admin"),
    Tool("search_kb", "read", False, "svc-admin"),
    Tool("issue_refund", "refund", None, "svc-admin"),
    Tool("send_reply", "reply", True, "svc-admin"),
    Tool("close_ticket", "close", None, "svc-admin"),
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
