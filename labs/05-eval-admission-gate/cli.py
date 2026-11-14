"""
CLI Runner & Adversarial Meta-Harness Verifier for Lab 05.

Usage examples (100% offline, Python stdlib only):
  python cli.py --run-gate --emit-receipt .lab/last-receipt.json
  python cli.py --verify-candidate exercises/faulty_starter.py
  python cli.py --verify-candidate .lab/solution/admission_gate_solution.py
"""

from __future__ import annotations

import argparse
import copy
import importlib.util
import json
from pathlib import Path
import sys
from typing import Any, Callable

LAB_DIR = Path(__file__).resolve().parent
if str(LAB_DIR) not in sys.path:
    sys.path.insert(0, str(LAB_DIR))

from admission_gate import (  # noqa: E402
    EvalAdmissionGate,
    calibrated_reference_grader,
    healthy_reference_traces,
)


def _load_fixtures() -> tuple[dict[str, Any], dict[str, Any], dict[str, Any]]:
    fixtures_dir = LAB_DIR / "fixtures"
    suite = json.loads((fixtures_dir / "golden_trajectories.json").read_text(encoding="utf-8"))
    lock = json.loads((fixtures_dir / "golden_trajectories.lock").read_text(encoding="utf-8"))
    cal = json.loads((fixtures_dir / "calibration_anchors.json").read_text(encoding="utf-8"))
    return suite, lock, cal


def _load_candidate_factory(candidate_path: Path) -> Callable[..., Any]:
    resolved = candidate_path.resolve()
    if not resolved.is_file():
        raise FileNotFoundError(f"Candidate module not found: {resolved}")
    spec = importlib.util.spec_from_file_location("lab05_candidate", str(resolved))
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Cannot load module spec from {resolved}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    factory = getattr(module, "build_candidate_gate", None)
    if not callable(factory):
        raise AttributeError(f"{resolved.name} must define callable build_candidate_gate(...).")
    return factory


def run_meta_audit(factory: Callable[..., Any]) -> list[tuple[str, bool, str]]:
    """
    Tests the gate itself: a trustworthy admission gate must ADMIT the clean
    baseline AND BLOCK every seeded regression, lock tamper, transcript illusion,
    and calibration drift scenario.
    """
    suite, lock, cal = _load_fixtures()
    base_traces = healthy_reference_traces()
    checks: list[tuple[str, bool, str]] = []

    # 1. Healthy baseline -> must ADMIT
    clean_gate = factory(grader_fn=calibrated_reference_grader)
    r_clean = clean_gate.evaluate_admission(
        suite_doc=suite,
        lock_doc=lock,
        calibration_doc=cal,
        traces_doc=base_traces,
        candidate_author="agent:builder",
    )
    ok_clean = r_clean.get("admitted") is True and r_clean.get("verdict") == "PASS"
    checks.append(
        (
            "M1_ADMITS_CLEAN_BASELINE",
            ok_clean,
            "Admitted clean golden + refusal + injection baseline."
            if ok_clean
            else "Failed to admit clean baseline.",
        )
    )

    # 2. Non-compensable injection breach (5/6 = 83.3% text ok, 1 forbidden tool executed) -> must BLOCK
    injected_traces = copy.deepcopy(base_traces)
    injected_traces[-1]["tool_log"] = [{"tool": "post_customer_reply", "status": "ok"}]
    r_inj = clean_gate.evaluate_admission(
        suite_doc=suite,
        lock_doc=lock,
        calibration_doc=cal,
        traces_doc=injected_traces,
        candidate_author="agent:builder",
    )
    ok_inj = r_inj.get("admitted") is False and r_inj.get("verdict") == "BLOCK"
    checks.append(
        (
            "M2_BLOCKS_NON_COMPENSABLE_INJECTION",
            ok_inj,
            "Blocked 5/6 run when injection-002 executed forbidden post_customer_reply."
            if ok_inj
            else "FAIL OPEN: Admitted candidate despite forbidden side-effect on injection-002.",
        )
    )

    # 3. Transcript illusion (prose quotes clause, but search_contracts errored) -> must BLOCK
    illusion_traces = copy.deepcopy(base_traces)
    illusion_traces[0]["tool_log"] = [{"tool": "search_contracts", "status": "error"}]
    r_ill = clean_gate.evaluate_admission(
        suite_doc=suite,
        lock_doc=lock,
        calibration_doc=cal,
        traces_doc=illusion_traces,
        candidate_author="agent:builder",
    )
    ok_ill = r_ill.get("admitted") is False
    checks.append(
        (
            "M3_BLOCKS_TRANSCRIPT_ILLUSION",
            ok_ill,
            "Blocked fabricated citation when search_contracts status='error' in tool_log."
            if ok_ill
            else "FAIL OPEN: Trusted assistant prose when durable tool_log showed error.",
        )
    )

    # 4. Golden fixture rewritten without independent relock -> must BLOCK
    tampered_suite = copy.deepcopy(suite)
    tampered_suite["pass_threshold"] = 0.5
    r_lock = clean_gate.evaluate_admission(
        suite_doc=tampered_suite,
        lock_doc=lock,
        calibration_doc=cal,
        traces_doc=base_traces,
        candidate_author="agent:builder",
    )
    ok_lock = r_lock.get("admitted") is False
    checks.append(
        (
            "M4_BLOCKS_UNLOCKED_SUITE_EDIT",
            ok_lock,
            "Blocked silent edit to golden_trajectories.json via SHA-256 lock mismatch."
            if ok_lock
            else "FAIL OPEN: Allowed golden suite threshold edit without independent relock.",
        )
    )

    # 5. Calibration drift (rubber-stamp grader scores weak anchor 0.99) -> must BLOCK
    drifted_gate = factory(grader_fn=lambda _sample: 0.99)
    r_drift = drifted_gate.evaluate_admission(
        suite_doc=suite,
        lock_doc=lock,
        calibration_doc=cal,
        traces_doc=base_traces,
        candidate_author="agent:builder",
    )
    ok_drift = r_drift.get("admitted") is False
    checks.append(
        (
            "M5_BLOCKS_CALIBRATION_DRIFT",
            ok_drift,
            "Blocked rubber-stamp grader caught by weak/borderline calibration anchors."
            if ok_drift
            else "FAIL OPEN: Accepted uncalibrated rubber-stamp grader.",
        )
    )

    return checks


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Run deterministic offline eval admission gate and meta-harness checks."
    )
    parser.add_argument(
        "--run-gate",
        action="store_true",
        help="Evaluate healthy reference traces against locked golden fixtures.",
    )
    parser.add_argument(
        "--verify-candidate",
        metavar="PY_FILE",
        default=None,
        help="Audit a candidate gate module exposing build_candidate_gate(...).",
    )
    parser.add_argument(
        "--emit-receipt",
        metavar="JSON_PATH",
        default=None,
        help="Write a deterministic EvalAdmissionReceipt.v1 JSON file.",
    )
    args = parser.parse_args(argv)

    suite, lock, cal = _load_fixtures()
    factory: Callable[..., Any]
    label = "reference (admission_gate.py)"
    if args.verify_candidate:
        cand_path = Path(args.verify_candidate)
        factory = _load_candidate_factory(cand_path)
        label = f"candidate ({cand_path.as_posix()})"
    else:
        factory = lambda **kw: EvalAdmissionGate(**kw)

    checks = run_meta_audit(factory)
    all_ok = all(ok for _, ok, _ in checks)
    print(f"=== Lab 05 Eval Admission Gate :: {label} ===")
    for cid, ok, detail in checks:
        print(f"  [{'PASS' if ok else 'FAIL'}] {cid:<36} — {detail}")
    print(
        f"Meta-Audit Verdict: {'ADMITTED' if all_ok else 'BLOCKED'} "
        f"({sum(ok for _, ok, _ in checks)}/{len(checks)} checks passed)"
    )

    if args.emit_receipt or args.run_gate:
        gate = factory(grader_fn=calibrated_reference_grader)
        receipt = gate.evaluate_admission(
            suite_doc=suite,
            lock_doc=lock,
            calibration_doc=cal,
            traces_doc=healthy_reference_traces(),
            candidate_author="agent:builder",
            run_id="run:05-cli-verification",
        )
        receipt["meta_audit_passed"] = all_ok
        if args.emit_receipt:
            out_path = Path(args.emit_receipt)
            out_path.parent.mkdir(parents=True, exist_ok=True)
            out_path.write_text(json.dumps(receipt, indent=2, sort_keys=True) + "\n", encoding="utf-8")
            print(f"Receipt written: {out_path} (sha256={receipt['receipt_sha256']})")

    return 0 if all_ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
