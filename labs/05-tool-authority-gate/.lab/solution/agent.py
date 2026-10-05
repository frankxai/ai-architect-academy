"""The support triage agent: a model, a gate, and five tools.

Run with:
    python agent.py "summarize ticket 42"
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

from fake_model import FakeModel, ToolCall
from gate import ToolGate
from tools import REGISTRY

HERE = Path(__file__).resolve().parent
MAX_TURNS = 6


def load_tickets() -> dict[str, dict]:
    return json.loads((HERE / "data" / "tickets.json").read_text(encoding="utf-8"))


class SupportAgent:
    def __init__(self, granted: set[str], tickets: dict[str, dict] | None = None, model: FakeModel | None = None):
        self.granted = frozenset(granted)
        # Built once from what the caller granted. The model never gets a hand in constructing it.
        self.gate = ToolGate(REGISTRY, self.granted)
        self.tickets = tickets if tickets is not None else load_tickets()
        self.model = model or FakeModel()
        self.audit: list[dict] = []
        self.refunds: list[dict] = []
        self.replies: list[dict] = []
        self.closed: list[str] = []

    def run(self, user_request: str) -> str:
        transcript: list[dict] = []
        for _ in range(MAX_TURNS):
            turn = self.model.next_turn(user_request, transcript)
            if turn.final_answer is not None:
                return turn.final_answer
            for call in turn.tool_calls:
                transcript.append({"role": "tool", "name": call.name, "content": self._execute(call)})
        return "stopped: turn budget exhausted"

    def _execute(self, call: ToolCall) -> str:
        decision = self.gate.authorize(call)
        self.audit.append(
            {
                "tool": call.name,
                "args": call.args,
                "claimed_authority": list(call.claimed_authority),
                "allowed": decision.allowed,
                "reason": decision.reason,
            }
        )
        if not decision.allowed:
            return f"DENIED: {decision.reason}"
        return self._dispatch(call)

    def _dispatch(self, call: ToolCall) -> str:
        if call.name == "read_ticket":
            ticket = self.tickets[call.args["ticket_id"]]
            return f"{ticket['subject']}\n{ticket['body']}"
        if call.name == "search_kb":
            return "No articles matched."
        if call.name == "issue_refund":
            self.refunds.append({"ticket_id": call.args["ticket_id"], "amount": call.args["amount"]})
            return f"Refund of {call.args['amount']} recorded for ticket {call.args['ticket_id']}."
        if call.name == "send_reply":
            self.replies.append({"ticket_id": call.args["ticket_id"], "text": call.args.get("text", "")})
            return "Reply sent."
        if call.name == "close_ticket":
            self.closed.append(call.args["ticket_id"])
            return f"Ticket {call.args['ticket_id']} closed."
        # Unreachable while the gate denies names outside REGISTRY; if it fires, the registry and
        # this dispatch table have drifted, and crashing is better than a silent no-op.
        raise KeyError(f"no such tool: {call.name}")


if __name__ == "__main__":
    agent = SupportAgent(granted={"read"})
    print(agent.run(" ".join(sys.argv[1:]) or "summarize ticket 42"))
    print(json.dumps(agent.audit, indent=2))
