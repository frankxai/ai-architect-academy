"""The authority gate. It sits between the model's requested call and the tool's execution.

The model proposes. The gate disposes. Nothing the model writes may widen what the gate allows.
"""
from __future__ import annotations

from dataclasses import dataclass

from fake_model import ToolCall
from tools import Tool


@dataclass(frozen=True)
class Decision:
    allowed: bool
    reason: str


class ToolGate:
    def __init__(self, registry: dict[str, Tool], granted: frozenset[str]):
        self.registry = registry
        self.granted = granted

    def authorize(self, call: ToolCall) -> Decision:
        # call.claimed_authority is model output. It is never read here, and that is the point.
        tool = self.registry.get(call.name)
        if tool is None:
            return Decision(False, f"unknown tool {call.name!r}: not in the registry, so it has no principal and no authority")
        if tool.authority not in self.granted:
            return Decision(
                False,
                f"{call.name} requires authority {tool.authority!r}; this run was granted {sorted(self.granted)}",
            )
        return Decision(True, f"{call.name} runs under granted authority {tool.authority!r} as {tool.principal}")
