from __future__ import annotations

from typing import Callable, Dict, List, Optional
from pydantic import BaseModel, Field


class Message(BaseModel):
	role: str = Field(..., description="system|user|assistant|tool")
	content: str
	name: Optional[str] = None
	tool_call_id: Optional[str] = None


class ToolSpec(BaseModel):
	name: str
	description: str
	func: Callable[[str], str]


class AgentConfig(BaseModel):
	name: str
	system_prompt: str
	tools: List[ToolSpec] = Field(default_factory=list)
	temperature: float = 0.1
	model: Optional[str] = None

