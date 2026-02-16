"""Tests for Multi-Agent Orchestrator."""
import pytest
import asyncio
from orchestrator import Coordinator, AgentRole, MessageType


@pytest.mark.asyncio
async def test_full_pipeline():
    """Complete pipeline should produce a report."""
    coord = Coordinator()
    result = await coord.run("AI testing")
    assert "title" in result or "report" in str(result).lower()
    assert coord.status in ("completed", "done", "success")


@pytest.mark.asyncio
async def test_message_routing():
    """Messages should flow: Researcher → Analyst → Writer."""
    coord = Coordinator()
    await coord.run("test topic")

    senders = [m.sender for m in coord.message_log]
    assert "researcher" in senders
    assert "analyst" in senders
    assert "writer" in senders


@pytest.mark.asyncio
async def test_error_handling():
    """Coordinator should handle agent failures gracefully."""
    coord = Coordinator()
    # Even if something fails internally, should not raise unhandled exception
    try:
        result = await coord.run("")
        assert result is not None
    except NotImplementedError:
        pytest.fail("Coordinator.run() must be implemented")
