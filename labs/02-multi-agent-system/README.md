# Lab 02: Build a Multi-Agent Research System

## Situation

Your team is building an internal research tool. The idea: give it a topic, and it produces a structured report — automatically. Three specialized agents handle different parts of the work:

- **Researcher** — gathers raw information
- **Analyst** — evaluates and synthesizes findings
- **Writer** — produces the final report

The agent interfaces are built. The message protocol is defined. What's missing is the **Coordinator** — the orchestration layer that routes messages between agents, handles failures, and tracks the pipeline state.

## Your Mission

Implement `Coordinator.run()` in `orchestrator.py`. The agent classes are complete and tested — don't modify them. Your job is the coordination logic.

### Requirements

1. Route messages in order: Researcher → Analyst → Writer
2. Handle agent timeouts (each agent has a 30s limit)
3. Handle agent errors (retry once, then report failure)
4. Track all messages in `self.message_log`
5. Return the Writer's final report

## Getting Started

```bash
claude
/start-lab 02
```

## Files

| File | Purpose |
|------|---------|
| `orchestrator.py` | Agent classes (complete) + Coordinator (your task) |
| `tests/test_orchestrator.py` | Async test suite — 3 tests to pass |
| `.lab/config.json` | Lab metadata and checkpoints |

## Architecture

```
                 ┌──────────────────┐
                 │   Coordinator    │
                 │   (YOUR CODE)    │
                 └──────┬───────────┘
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
    ┌──────────┐  ┌──────────┐  ┌──────────┐
    │Researcher│  │ Analyst  │  │  Writer  │
    │  Agent   │→ │  Agent   │→ │  Agent   │
    └──────────┘  └──────────┘  └──────────┘
```

## Constraints

- Agents communicate via `Message` objects and async queues — no direct function calls
- The Coordinator must be resilient — one agent failing shouldn't crash the whole pipeline
- All agent outputs must be validated before passing downstream
- Run tests with: `python -m pytest tests/ -v`
