# LangGraph Planner Loop

**Category:** Agentic Patterns  
**Duration:** 45 minutes  
**Outcome:** Build a LangGraph 0.3 planner that decomposes tasks, manages memory, and calls tools with guardrails.

## Why it matters
- LangGraph 0.3 introduced native tool scheduling, retries, and graph visualisations.
- Organisations rely on deterministic planners before enabling autonomous steps.

## Prerequisites
- Python 3.11+ environment with LangChain/LangGraph installed.
- Toolset: search function, retrieval tool, evaluator (could be simple mock).
- Access to at least one high-signal dataset (e.g., company knowledge base).

## Step-by-step
1. **Define nodes:** Create planner, worker, evaluator, and reporter nodes as per `agentic-swarms/README.md`.
2. **Configure memory:** Store intermediate states in `RedisMemoryStore` or `langgraph.checkpoint.sqlite`. Limit history to 5 steps.
3. **Implement planner:** Use `StructuredChatAgent` with reasoning tokens enabled (OpenAI o4-mini or Claude 3.5 Sonnet) and define `MAX_STEPS = 8`.
4. **Add guardrails:** Integrate the RAG guardrails module for citations + policy enforcement before responses exit the graph.
5. **Visualise:** Render the graph with LangGraph's built-in `graph.draw()` and save a PNG in `assets/screenshots/`.
6. **Validate:** Run three tasks (e.g., "Draft migration plan", "Summarise governance policy") and capture success/failure metrics in Langfuse.

## Deliverables
- LangGraph graph definition file with planner loop and memory config.
- PNG of the graph structure for storytelling decks.
- Experiment notes in the Logbook + follow-up questions for the Multi-Agent Handoff module.

## References
- LangGraph 0.3 release (July 2025) docs.
- OpenAI o4 reasoning model best practices (August 2025).
- `15-workflows/peer-review.md` for validating agent behaviours.
