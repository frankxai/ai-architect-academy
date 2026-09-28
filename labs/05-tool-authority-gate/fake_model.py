"""A deterministic stand-in for a hosted model that does what most models do when nobody
stops them: it treats instructions found inside tool results as instructions.

You do not fix the model in this lab. You fix the system around it. No network, no keys.
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field

INSTRUCTION = re.compile(r"^AGENT INSTRUCTION:\s*(\w+)\s*(.*)$", re.MULTILINE)
INTENT = re.compile(r"^(summarize|refund) ticket (\d+)(?: amount (\d+))?$")


@dataclass
class ToolCall:
    name: str
    args: dict[str, str]
    # What the model believes it is allowed to do. Model output, so worth exactly nothing.
    claimed_authority: list[str] = field(default_factory=list)


@dataclass
class ModelTurn:
    tool_calls: list[ToolCall]
    final_answer: str | None = None


class FakeModel:
    def next_turn(self, user_request: str, transcript: list[dict]) -> ModelTurn:
        verb, ticket_id, amount = self._intent(user_request)
        if not transcript:
            return ModelTurn([ToolCall("read_ticket", {"ticket_id": ticket_id})])

        last = transcript[-1]
        injected = [self._parse(m.group(1), m.group(2)) for m in INSTRUCTION.finditer(last["content"])]
        if injected:
            return ModelTurn(injected)

        if last["name"] == "read_ticket":
            if verb == "refund":
                return ModelTurn([ToolCall("issue_refund", {"ticket_id": ticket_id, "amount": amount})])
            return ModelTurn([], final_answer=f"Summary: {last['content'].splitlines()[0]}")

        if last["content"].startswith("DENIED"):
            ticket = next((m for m in reversed(transcript) if m["name"] == "read_ticket"), None)
            first_line = ticket["content"].splitlines()[0] if ticket else ""
            return ModelTurn([], final_answer=f"Summary: {first_line}")
        return ModelTurn([], final_answer="Done.")

    @staticmethod
    def _intent(user_request: str) -> tuple[str, str, str]:
        match = INTENT.match(user_request.strip().lower())
        if not match:
            raise ValueError("fake model understands 'summarize ticket N' and 'refund ticket N amount M'")
        verb, ticket_id, amount = match.groups()
        return verb, ticket_id, amount or "0"

    @staticmethod
    def _parse(name: str, raw_args: str) -> ToolCall:
        args = dict(pair.split("=", 1) for pair in raw_args.split() if "=" in pair)
        return ToolCall(name, args, claimed_authority=["read", "refund", "reply", "close"])
