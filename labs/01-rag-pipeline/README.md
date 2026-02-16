# Lab 01: Fix the Broken RAG Pipeline

## Situation

You've just joined the platform engineering team at a B2B SaaS company. Last week, the team deployed a RAG-based customer support system. It was supposed to handle 80% of tier-1 support tickets automatically.

**It's not going well.**

Customer satisfaction dropped from 92% to 41%. The support team is drowning in tickets that the AI was supposed to handle. The VP of Customer Success is asking what happened.

The pipeline is in `rag_pipeline.py`. The test suite in `tests/` defines the quality bar you need to hit.

## Your Mission

1. Read the pipeline code and understand how it works
2. Run the tests to see what's failing: `python -m pytest tests/ -v`
3. Diagnose the root causes (there are multiple issues)
4. Fix the pipeline so all tests pass

## Getting Started

```bash
# Open Claude Code in this directory
claude

# Start the lab
/start-lab 01
```

Your instructor will guide you through the diagnosis. Don't jump to fixing — understanding WHY it's broken is the real skill.

## Files

| File | Purpose |
|------|---------|
| `rag_pipeline.py` | The broken pipeline — this is what you fix |
| `tests/test_rag.py` | Test suite — your pass/fail criteria |
| `data/support_articles.json` | Sample knowledge base (7 articles) |
| `.lab/config.json` | Lab metadata and checkpoint definitions |

## Rules

- Explain your diagnosis before the instructor helps you fix it
- Each fix must pass its corresponding test
- Think about production implications, not just making tests green
