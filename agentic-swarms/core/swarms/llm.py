from __future__ import annotations

import os
from typing import List
from pydantic import BaseModel

from .models import Message


class LLMProvider(BaseModel):

	def complete(self, messages: List[Message], temperature: float = 0.0, model: str | None = None) -> str:
		raise NotImplementedError


class MockLLMProvider(LLMProvider):

	def complete(self, messages: List[Message], temperature: float = 0.0, model: str | None = None) -> str:
		# Deterministic teaching stub: echos last user instruction with a simple transform.
		last_user = next((m.content for m in reversed(messages) if m.role == "user"), "" )
		if not last_user:
			last_user = messages[-1].content if messages else ""
		return f"[MOCK ANSWER]\nI will: {last_user}"


class LiteLLMProvider(LLMProvider):
	"""Thin wrapper around litellm for portability across providers."""

	def model_post_init(self, __context):
		try:
			import litellm  # noqa: F401
		except Exception as exc:  # pragma: no cover
			raise RuntimeError("litellm is required for LiteLLMProvider. Install from requirements.txt") from exc

	def complete(self, messages: List[Message], temperature: float = 0.0, model: str | None = None) -> str:
		from litellm import completion

		provider_model = model or os.getenv("LITELLM_MODEL", "gpt-4o-mini")
		payload = [m.model_dump() for m in messages]
		resp = completion(
			model=provider_model,
			messages=payload,
			temperature=temperature,
		)
		try:
			return resp["choices"][0]["message"]["content"]
		except Exception:  # pragma: no cover
			return str(resp)


def get_default_provider() -> LLMProvider:
	# If any real key is present, use LiteLLM; otherwise mock
	if any(os.getenv(k) for k in ["OPENAI_API_KEY", "ANTHROPIC_API_KEY", "LITELLM_BASE_URL", "LITELLM_API_KEY"]):
		return LiteLLMProvider()
	return MockLLMProvider()

