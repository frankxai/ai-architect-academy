from __future__ import annotations

from typing import Dict, List
from pydantic import BaseModel

from .models import Message
from .agent import Agent


class Orchestrator(BaseModel):
	agents: Dict[str, Agent]
	history: List[Message] = []

	def reset(self) -> None:
		self.history = []

	def run(self, goal: str, max_turns: int = 6) -> List[Message]:
		raise NotImplementedError


class PlannerWorkerReviewerOrchestrator(Orchestrator):
	"""Simple P-W-R pattern for teaching multi-agent coordination."""

	def run(self, goal: str, max_turns: int = 6) -> List[Message]:
		self.reset()

		planner = self.agents["planner"]
		worker = self.agents["worker"]
		reviewer = self.agents["reviewer"]

		self.history.append(Message(role="user", content=f"Goal: {goal}"))
		plan = planner.step(self.history)
		self.history.append(plan)

		work_input = self.history + [Message(role="user", content="Please execute the plan.")]
		work = worker.step(work_input)
		self.history.append(work)

		review_input = self.history + [Message(role="user", content="Review and provide final answer.")]
		review = reviewer.step(review_input)
		self.history.append(review)

		return self.history

