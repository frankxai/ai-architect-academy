"""
Multi-Agent Research Orchestrator
YOUR MISSION: Implement the orchestration logic.
The agent interfaces are defined — you build the coordinator.
"""
from dataclasses import dataclass, field
from enum import Enum
from typing import Any
import asyncio


class AgentRole(Enum):
    RESEARCHER = "researcher"
    ANALYST = "analyst"
    WRITER = "writer"


class MessageType(Enum):
    TASK = "task"
    RESULT = "result"
    ERROR = "error"
    STATUS = "status"


@dataclass
class Message:
    sender: str
    receiver: str
    msg_type: MessageType
    payload: Any
    timestamp: float = 0.0


@dataclass
class AgentState:
    role: AgentRole
    status: str = "idle"  # idle, working, done, failed
    results: list = field(default_factory=list)
    error: str | None = None


class BaseAgent:
    """Base class for all agents. DO NOT MODIFY."""

    def __init__(self, role: AgentRole):
        self.role = role
        self.state = AgentState(role=role)
        self.inbox: asyncio.Queue = asyncio.Queue()

    async def receive(self) -> Message:
        return await asyncio.wait_for(self.inbox.get(), timeout=30.0)

    async def process(self, message: Message) -> Message:
        raise NotImplementedError


class ResearcherAgent(BaseAgent):
    """Gathers information on a topic. DO NOT MODIFY."""

    def __init__(self):
        super().__init__(AgentRole.RESEARCHER)

    async def process(self, message: Message) -> Message:
        self.state.status = "working"
        topic = message.payload.get("topic", "")

        # Simulate research (in production, this would call APIs/web search)
        await asyncio.sleep(0.5)
        findings = {
            "topic": topic,
            "sources": [
                {"title": f"Source about {topic}", "key_points": ["Point A", "Point B"]},
                {"title": f"Analysis of {topic}", "key_points": ["Point C", "Point D"]},
            ],
            "raw_data": f"Comprehensive research findings on {topic}..."
        }

        self.state.status = "done"
        self.state.results.append(findings)
        return Message(
            sender=self.role.value,
            receiver="coordinator",
            msg_type=MessageType.RESULT,
            payload=findings
        )


class AnalystAgent(BaseAgent):
    """Analyzes research findings. DO NOT MODIFY."""

    def __init__(self):
        super().__init__(AgentRole.ANALYST)

    async def process(self, message: Message) -> Message:
        self.state.status = "working"
        findings = message.payload

        await asyncio.sleep(0.3)
        analysis = {
            "summary": f"Analysis of {findings.get('topic', 'unknown')}",
            "key_themes": ["Theme 1", "Theme 2"],
            "confidence": 0.85,
            "recommendations": ["Recommendation A", "Recommendation B"]
        }

        self.state.status = "done"
        self.state.results.append(analysis)
        return Message(
            sender=self.role.value,
            receiver="coordinator",
            msg_type=MessageType.RESULT,
            payload=analysis
        )


class WriterAgent(BaseAgent):
    """Writes the final report. DO NOT MODIFY."""

    def __init__(self):
        super().__init__(AgentRole.WRITER)

    async def process(self, message: Message) -> Message:
        self.state.status = "working"
        analysis = message.payload

        await asyncio.sleep(0.3)
        report = {
            "title": f"Research Report: {analysis.get('summary', '')}",
            "sections": [
                {"heading": "Executive Summary", "content": analysis.get("summary", "")},
                {"heading": "Key Findings", "content": str(analysis.get("key_themes", []))},
                {"heading": "Recommendations", "content": str(analysis.get("recommendations", []))},
            ],
            "word_count": 500
        }

        self.state.status = "done"
        self.state.results.append(report)
        return Message(
            sender=self.role.value,
            receiver="coordinator",
            msg_type=MessageType.RESULT,
            payload=report
        )


# ============================================================
# TODO: Implement the Coordinator class below
# ============================================================

class Coordinator:
    """
    YOUR TASK: Implement the coordinator that orchestrates the agents.

    Requirements:
    1. Route messages between agents in the correct order:
       Research → Analysis → Writing
    2. Handle agent timeouts (30s per agent)
    3. Handle agent errors gracefully (retry once, then report failure)
    4. Track overall pipeline status
    5. Return the final report or an error summary
    """

    def __init__(self):
        self.agents: dict[AgentRole, BaseAgent] = {
            AgentRole.RESEARCHER: ResearcherAgent(),
            AgentRole.ANALYST: AnalystAgent(),
            AgentRole.WRITER: WriterAgent(),
        }
        self.message_log: list[Message] = []
        self.status: str = "initialized"

    async def run(self, topic: str) -> dict:
        """
        Execute the full research pipeline.

        TODO: Implement this method.

        Steps:
        1. Send topic to Researcher
        2. Wait for research results
        3. Send results to Analyst
        4. Wait for analysis
        5. Send analysis to Writer
        6. Return final report

        Handle errors at each step.
        """
        raise NotImplementedError("Implement the coordinator pipeline")


# Entry point
if __name__ == "__main__":
    import json

    async def main():
        coordinator = Coordinator()
        result = await coordinator.run("The future of multi-agent AI systems")
        print(json.dumps(result, indent=2))

    asyncio.run(main())
