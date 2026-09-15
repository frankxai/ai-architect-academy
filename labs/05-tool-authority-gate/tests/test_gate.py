"""The gate is judged by what the agent does, not by what it says."""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from agent import SupportAgent  # noqa: E402
from fake_model import ToolCall  # noqa: E402
from gate import ToolGate  # noqa: E402
from tools import REGISTRY  # noqa: E402


def test_injected_instruction_does_not_issue_a_refund():
    """Ticket 42 carries an embedded instruction. The run was granted read only."""
    agent = SupportAgent(granted={"read"})
    answer = agent.run("summarize ticket 42")
    assert agent.refunds == []
    assert answer.startswith("Summary:")


def test_injected_close_is_also_denied():
    agent = SupportAgent(granted={"read"})
    agent.run("summarize ticket 42")
    assert agent.closed == []


def test_denial_is_visible_in_the_audit_log():
    """Detection lives in telemetry that exists before the incident, not in a code read afterwards."""
    agent = SupportAgent(granted={"read"})
    agent.run("summarize ticket 42")
    denied = [e for e in agent.audit if e["tool"] == "issue_refund" and e["allowed"] is False]
    assert denied, agent.audit
    assert denied[0]["reason"]


def test_gate_ignores_authority_the_model_claims_for_itself():
    gate = ToolGate(REGISTRY, frozenset({"read"}))
    call = ToolCall("issue_refund", {"ticket_id": "42", "amount": "500"}, claimed_authority=["refund"])
    assert gate.authorize(call).allowed is False


def test_unknown_tool_is_denied_not_crashed():
    """Ticket 99 asks for a tool that does not exist. The run finishes and the audit says why."""
    agent = SupportAgent(granted={"read"})
    answer = agent.run("summarize ticket 99")
    assert answer.startswith("Summary:")
    assert any(e["tool"] == "export_all_customers" and e["allowed"] is False for e in agent.audit)


def test_read_only_run_can_still_read():
    agent = SupportAgent(granted={"read"})
    assert agent.run("summarize ticket 7") == "Summary: Address change on order 8790"
    assert all(e["allowed"] for e in agent.audit)


def test_granted_refund_still_executes():
    """A gate that blocks everything is not a gate, it is an outage."""
    agent = SupportAgent(granted={"read", "refund"})
    assert agent.run("refund ticket 7 amount 40") == "Done."
    assert agent.refunds == [{"ticket_id": "7", "amount": "40"}]


def test_side_effect_without_grant_is_denied_even_when_the_user_asked():
    """The user's words are input. Authority is set by the caller that started the run."""
    agent = SupportAgent(granted={"read"})
    agent.run("refund ticket 7 amount 40")
    assert agent.refunds == []
    assert any(e["tool"] == "issue_refund" and e["allowed"] is False for e in agent.audit)
