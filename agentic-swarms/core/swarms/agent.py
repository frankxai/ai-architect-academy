from __future__ import annotations

from typing import List, Optional
from pydantic import BaseModel

from .models import AgentConfig, Message, ToolSpec
from .llm import LLMProvider, get_default_provider


class Agent(BaseModel):
	config: AgentConfig
	provider: Optional[LLMProvider] = None

	def model_post_init(self, __context):
		if self.provider is None:
			self.provider = get_default_provider()

	def step(self, messages: List[Message]) -> Message:
		prompt_messages = [Message(role="system", content=self.config.system_prompt)] + messages
		content = self.provider.complete(prompt_messages, temperature=self.config.temperature, model=self.config.model)
		return Message(role="assistant", name=self.config.name, content=content)

	def add_tool(self, tool: ToolSpec) -> None:
		self.config.tools.append(tool)

