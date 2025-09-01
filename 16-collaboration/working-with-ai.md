# Working With AI Assistants (Playbook)

Goal: Get high‑quality, verifiable outcomes quickly while keeping control over scope, cost, and quality.

Principles
- Be specific: State goal, constraints, acceptance criteria, and non‑goals.
- Provide context: File paths, snippets, errors, env, versions.
- Ask for a plan: Have the AI outline steps; approve/refine.
- Prefer minimal diffs: Request patch/diff instead of full files.
- Verify: Run tests, check outputs, and ask for self‑checks.
- Iterate: Small scopes → apply → re‑ask with updated context.

When to use which tool
- Editor‑native (Claude Code, Continue, Cursor): fast inline edits and refactors.
- Git‑aware CLI (Aider, Codex CLI): patch‑first changes with review and commits.
- Long‑running agents (Devin): exploratory tasks; keep guardrails and review gates.

Common patterns
- Spec → Tests → Code: Ask for acceptance tests before implementation.
- Investigate → Hypothesize → Patch: Paste stack traces; ask for debugging steps.
- Design Doc → Skeleton → Fill‑in: Draft and iterate on design before coding.

Anti‑patterns
- Vague asks; no acceptance criteria.
- Oversized changes in one shot.
- Blindly pasting generated code without review.
