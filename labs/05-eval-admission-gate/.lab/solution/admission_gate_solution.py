"""
Worked Reference Solution for Lab 05 — Non-Compensable Eval Admission Gate.

Exposes `build_candidate_gate(...)` backed by `EvalAdmissionGate` so learners can
compare `exercises/faulty_starter.py` (exits 1 on adversarial audit) against
`.lab/solution/admission_gate_solution.py` (exits 0).
"""

from __future__ import annotations

from typing import Any, Callable, Mapping

from admission_gate import EvalAdmissionGate, calibrated_reference_grader


def build_candidate_gate(
    *,
    grader_fn: Callable[[Mapping[str, Any]], float] = calibrated_reference_grader,
    as_of: str = "2026-11-14T12:00:00Z",
) -> EvalAdmissionGate:
    return EvalAdmissionGate(grader_fn=grader_fn, as_of=as_of)
