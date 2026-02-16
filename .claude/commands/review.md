# Architect Review

The student wants their current work reviewed.

Read `.academy/progress.json` to determine the active lab.
Read the student's current code (the modified lab files).
Read the lab's test files.

**Review as a Senior AI Architect:**

1. **Correctness** (Does it work?)
   - Run the tests if possible: `cd labs/[lab-id] && python -m pytest tests/ -v` or equivalent
   - Report pass/fail for each test

2. **Architecture** (Is the approach sound?)
   - Does the solution follow established patterns?
   - Is it production-quality or just "makes tests pass"?

3. **Understanding** (Do they get WHY?)
   - Ask 1-2 follow-up questions about their implementation choices
   - "Why did you choose 512 for chunk_size?" / "What happens if this agent times out?"

4. **Score** (0-100)
   - Correctness: /40 (all tests pass = 40)
   - Architecture: /30 (clean, idiomatic, scalable)
   - Understanding: /30 (can explain their choices)

Display as:
```
┌─────────────────────────────────┐
│  ARCHITECT REVIEW               │
│  Lab: [name]                    │
│  Score: [X]/100                 │
│  Tests: [passed]/[total]        │
│  Verdict: [PASS/NEEDS WORK]     │
└─────────────────────────────────┘
```

Update `.academy/progress.json` with the review score. Mark lab as "completed" if score >= 70.
