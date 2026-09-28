# Context

Support questions for a software product. This scenario is a composite.

# Options considered

**Single model with tools.** A reasonable default. We dropped it because the documentation changes every release and cannot live in the prompt.

**Retrieval-first.** Chosen.

# Decision

Retrieval-first.

# Consequences

An index to operate.

# What would reverse this

The share of escalations tagged "needed account state and documentation together" exceeds one in five for two consecutive weeks, read from the transcript log. Next notch: a fixed pipeline that conditions retrieval on account state.
