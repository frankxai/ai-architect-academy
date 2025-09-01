# Prompting Guide (Structure & Recipes)

Prompt Canvas
- Role: what assistant is (e.g., senior TS engineer)
- Task: the concrete outcome
- Context: files, errors, versions, constraints
- Output: format requirements (diff, table, steps)
- Checks: tests, constraints, guardrails

Example (Patch‑First)
```
Role: Senior Node/TS engineer.
Task: Fix /apps/api/src/index.ts to validate input for /api/tutor.
Context: Current handler trusts req.body; add zod validation. Node 18.
Output: Unified diff patch only; minimal change; explain rationale in 3 bullets.
Checks: Run unit test stub passes; no behavior changes except validation.
```

Recipes
- Code Review: see `prompt-packs/code-review.md`
- Test Generator: see `prompt-packs/test-generator.md`
- Refactor: see `prompt-packs/refactor.md`
- Docs Writer: see `prompt-packs/doc-writer.md`
- Pattern Drafter: see `prompt-packs/pattern-drafter.md`
- RAG Eval: see `prompt-packs/rag-eval.md`
