"""
CLI Runner for Lab 04 — Agent Trust-Boundary Firewall.

Usage examples (100% offline, Python stdlib only):
  python cli.py --run-suite
  python cli.py --inject-fault F1_PROMPT_CONCAT
  python cli.py --verify-candidate exercises/faulty_starter.py
  python cli.py --verify-candidate .lab/solution/firewall_solution.py --emit-receipt out.json
"""

from __future__ import annotations

import argparse
import importlib.util
import json
from pathlib import Path
import sys
import tempfile
from typing import Any

LAB_DIR = Path(__file__).resolve().parent
if str(LAB_DIR) not in sys.path:
    sys.path.insert(0, str(LAB_DIR))

from faults import FaultScenarioResult, run_fault_scenarios  # noqa: E402
from firewall import (  # noqa: E402
    TrustBoundaryFirewall,
    default_lab_registry,
)


def _load_candidate_factory(candidate_path: Path) -> Any:
    resolved = candidate_path.resolve()
    if not resolved.is_file():
        raise FileNotFoundError(f"Candidate module not found: {resolved}")
    spec = importlib.util.spec_from_file_location("lab04_candidate", str(resolved))
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Unable to load module spec from {resolved}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    factory = getattr(module, "build_candidate_firewall", None)
    if not callable(factory):
        raise AttributeError(
            f"{resolved.name} must define callable build_candidate_firewall(...)."
        )
    return factory


def _print_report(label: str, results: list[FaultScenarioResult]) -> bool:
    all_passed = all(r.passed for r in results)
    verdict = "ADMITTED (ALL RED GATES GREEN)" if all_passed else "BLOCKED (RED GATE FAILURE)"
    print(f"=== Lab 04 Trust-Boundary Firewall :: {label} ===")
    for item in results:
        status = "PASS" if item.passed else "FAIL"
        print(f"  [{status}] {item.scenario_id:<22} ({item.gate}) — {item.detail}")
    print(f"Verdict: {verdict} ({sum(r.passed for r in results)}/{len(results)} scenarios passed)")
    return all_passed


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Run deterministic offline trust-boundary firewall checks and fault injections."
    )
    parser.add_argument(
        "--run-suite",
        action="store_true",
        help="Run all five adversarial fault scenarios against the reference firewall.",
    )
    parser.add_argument(
        "--inject-fault",
        metavar="SCENARIO_ID",
        default=None,
        help="Run a single fault scenario id (e.g. F1_PROMPT_CONCAT) or 'all'.",
    )
    parser.add_argument(
        "--verify-candidate",
        metavar="PY_FILE",
        default=None,
        help="Verify a candidate Python module exposing build_candidate_firewall(...).",
    )
    parser.add_argument(
        "--emit-receipt",
        metavar="JSON_PATH",
        default=None,
        help="Write a deterministic TrustFirewallReceipt.v1 JSON file.",
    )
    args = parser.parse_args(argv)

    label = "reference (firewall.py)"
    if args.verify_candidate:
        candidate_file = Path(args.verify_candidate)
        factory = _load_candidate_factory(candidate_file)
        label = f"candidate ({candidate_file.as_posix()})"
    else:
        factory = None

    scenario_filter = args.inject_fault if args.inject_fault else "all"
    results = (
        run_fault_scenarios(factory=factory, only_scenario=scenario_filter)
        if factory is not None
        else run_fault_scenarios(only_scenario=scenario_filter)
    )
    admitted = _print_report(label, results)

    if args.emit_receipt:
        with tempfile.TemporaryDirectory(prefix="lab04-receipt-") as tmp_dir:
            fw = (
                factory(
                    registry=default_lab_registry(),
                    sandbox_root=tmp_dir,
                    allowed_egress_hosts=("api.partner-contracts.example",),
                )
                if factory is not None
                else TrustBoundaryFirewall(
                    registry=default_lab_registry(),
                    sandbox_root=tmp_dir,
                    allowed_egress_hosts=("api.partner-contracts.example",),
                )
            )
            # Replay a representative blocked attack + clean read so the receipt captures real events
            try:
                fw.validate_outbound_url("http://169.254.169.254/latest/meta-data/")
            except Exception:
                pass
            try:
                fw.validate_outbound_url("https://api.partner-contracts.example/v1/clauses")
            except Exception:
                pass
            receipt = fw.emit_receipt(run_id="run:04-cli-verification")
            receipt["red_gate_admitted"] = admitted
            out_path = Path(args.emit_receipt)
            out_path.parent.mkdir(parents=True, exist_ok=True)
            out_path.write_text(json.dumps(receipt, indent=2, sort_keys=True) + "\n", encoding="utf-8")
            print(f"Receipt written: {out_path} (sha256={receipt['receipt_sha256']})")

    return 0 if admitted else 1


if __name__ == "__main__":
    raise SystemExit(main())
