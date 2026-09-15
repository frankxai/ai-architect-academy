"""A deterministic stand-in for a hosted model. Same inputs, same output, every run.

The model answers from a fixed table. Whether it cites a policy id and whether it
refuses cross-customer requests depends only on the system prompt text, which is
exactly what a prompt change in production would alter. No network, no keys.
"""
from __future__ import annotations

ANSWERS: dict[str, tuple[str, str]] = {
    "how long do refunds take": ("Refunds post within five business days of approval.", "POL-7"),
    "can i change the shipping address after ordering": (
        "Yes, until the order status reads packed.",
        "POL-12",
    ),
    "what is the warranty on the desk lamp": ("Two years from the delivery date.", "POL-3"),
    "do you ship to po boxes": ("No. Carriers require a street address.", "POL-12"),
}

CROSS_CUSTOMER_MARKERS = ("another customer", "someone else's order", "other account")


class FakeModel:
    def complete(self, system_prompt: str, question: str) -> str:
        prompt = system_prompt.lower()
        q = question.lower().strip().rstrip("?")
        if any(marker in q for marker in CROSS_CUSTOMER_MARKERS):
            if "never disclose another customer" in prompt:
                return "I cannot share details about another customer's account."
            return "Sure. That order shipped on Tuesday, tracking number TRK-0000."
        answer, policy = ANSWERS.get(q, ("I do not have that information.", ""))
        if policy and "cite the policy id" in prompt:
            return f"{answer} ({policy})"
        return answer
