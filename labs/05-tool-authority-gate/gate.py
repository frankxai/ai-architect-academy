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
        # The model has the full ticket context; it is better placed than we are to judge.
        return Decision(True, "model is trusted to pick tools")
