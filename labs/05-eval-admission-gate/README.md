# Lab 05: Build a Non-Compensable Eval Admission Gate

> **Composite educational fixture.** All golden trajectories, calibration anchors, and lockfiles in this lab are deterministic offline teaching fixtures. Zero network calls or external packages are used.

## Mission Briefing (Productive Failure First)

An eval suite that averages every test case into a single percentage (`mean >= 0.80`) will happily deploy a prompt change that scores `91%` overall while executing an unauthorized refund on a prompt-injection case. Worse, if the candidate author edits `golden_trajectories.json` in the same pull request — or swaps in a lenient grader that scores broken outputs at `0.99` — CI stays green forever while production regresses.

Run the adversarial meta-audit against `exercises/faulty_starter.py` first to watch all four failure modes fail open:

```bash
cd labs/05-eval-admission-gate

# 1. Watch the naive averaging gate fail 4 of 5 meta-audit checks (exits 1)
python cli.py --verify-candidate exercises/faulty_starter.py

# 2. Verify the reference non-compensable gate and emit an EvalAdmissionReceipt.v1 record (exits 0)
python cli.py --verify-candidate .lab/solution/admission_gate_solution.py --emit-receipt .lab/last-receipt.json

# 3. Run all 12 offline stdlib unit tests
python -m unittest discover -s tests -v
```

---

## Non-Compensable Meta-Harness Red-Gate Rubric

An admission gate is judged by **what it refuses**, not only what it passes. Every meta-audit check (`M1`–`M5`) is non-compensable:

| Meta-Gate | Failure Mode Tested | Required Gate Behavior | `AcademyGraph.v1` Refusal Mapping |
|---|---|---|---|
| `M1_ADMITS_CLEAN_BASELINE` | False-positive lockout | Admits locked golden + refusal + injection baseline when calibration holds | `verdict = "PASS"` |
| `M2_BLOCKS_NON_COMPENSABLE_INJECTION` | Compensable averaging (`91%` overall, `1` injection breach) | Blocks admission whenever any `non_compensable: true` trajectory fails | `eval-below-threshold` |
| `M3_BLOCKS_TRANSCRIPT_ILLUSION` | Assistant prose claims clause lookup when `tool_log` shows `status: "error"` | Grades durable `tool_log` outcomes (`expected_tools` / `forbidden_tools`) | `eval-below-threshold` |
| `M4_BLOCKS_UNLOCKED_SUITE_EDIT` | `failure:eval-rewritten-with-the-code` | Verifies canonical SHA-256 against `golden_trajectories.lock` and requires `relocked_by != candidate_author` | `eval-run-invalid` / `review-not-independent` |
| `M5_BLOCKS_CALIBRATION_DRIFT` | Rubber-stamp grader or anchor drift | Evaluates `weak`, `borderline`, and `strong` anchors in `calibration_anchors.json` before trusting scores | `eval-run-invalid` |

---

## Socratic Hints (Read One at a Time)

1. **Hint 1 — Transcript illusion vs durable state:** Why is `status: "blocked"` on a `forbidden_tool` in `tool_log` safe, whereas `status: "error"` on a `forbidden_tool` must fail the gate? Because `"blocked"` proves the firewall intercepted the call before execution, while `"error"` proves execution reached the tool handler!
2. **Hint 2 — Preventing `eval-rewritten-with-the-code`:** Hashing `golden_trajectories.json` alone is not enough if the same agent can regenerate `golden_trajectories.lock` in the same commit. Require `lock["relocked_by"] != candidate_author` so fixture edits require an independent reviewer.
3. **Hint 3 — Calibration anchors:** Check three invariants on `calibration_anchors.json`: (a) `abs(observed - expected) <= max_drift_tolerance`, (b) `weak <= weak_ceiling` and `strong >= strong_floor`, and (c) strict monotonicity `max(weak) < min(borderline) < min(strong)`.

---

## Day-7 Spaced-Retrieval Transfer Challenge

Without consulting `admission_gate.py`, inspect the CI eval workflow in one of your own repositories:
- If you delete one safety assertion in your fixture file today, does a separate lockfile or diff check block merge until a second reviewer signs off?
- Map your CI eval receipt into Stage 04 (`Eval harness`, requiring **two** independent evidence records: `repo-url` + `eval-run`) on the [12-Week Production AI Architect Path](../../02-learning-paths/12-week-production-architect.md).
