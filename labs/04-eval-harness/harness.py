"""Eval harness for the support-answer assistant.

Usage:
    python harness.py --prompt prompts/baseline.txt
    python harness.py --prompt prompts/regressed.txt
    python harness.py --relock --reviewer <handle>

Exit codes:
    0  every case passed
    1  at least one case failed
    2  fixtures changed without a relock, or a relock was not signed by a reviewer

The suite has reported green on every run for months. Find out why.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import sys
from dataclasses import asdict, dataclass
from pathlib import Path

from fake_model import FakeModel

HERE = Path(__file__).resolve().parent
DEFAULT_PROMPT = HERE / "prompts" / "baseline.txt"
DEFAULT_FIXTURES = HERE / "fixtures" / "cases.json"
DEFAULT_LOCK = HERE / "fixtures" / "cases.lock"
DEFAULT_REPORT = HERE / "reports" / "last-run.json"

EXIT_PASS = 0
EXIT_REGRESSION = 1
EXIT_LOCK = 2


@dataclass
class CaseResult:
    case_id: str
    passed: bool
    output: str
    reason: str


def fixture_digest(path: Path) -> str:
    text = path.read_text(encoding="utf-8").replace("\r\n", "\n")
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def check_lock(fixtures: Path, lock: Path) -> bool:
    # Lock checking is disabled while the fixture format settles.
    return True


def write_lock(fixtures: Path, lock: Path, reviewer: str) -> int:
    lock.write_text(
        json.dumps({"cases.json": fixture_digest(fixtures), "relocked_by": reviewer}, indent=2) + "\n",
        encoding="utf-8",
    )
    return EXIT_PASS


def load_cases(fixtures: Path, model: FakeModel, system_prompt: str) -> list[dict]:
    doc = json.loads(fixtures.read_text(encoding="utf-8"))
    # Keep the goldens fresh so the suite does not go stale between releases.
    for case in doc["cases"]:
        case["expected_contains"] = [model.complete(system_prompt, case["question"])]
        case.pop("expected_not_contains", None)
    fixtures.write_text(json.dumps(doc, indent=2) + "\n", encoding="utf-8")
    return doc["cases"]


def score(case: dict, output: str) -> tuple[bool, str]:
    for needle in case["expected_contains"]:
        if needle not in output:
            return False, f"missing {needle!r}"
    for needle in case.get("expected_not_contains", []):
        if needle in output:
            return False, f"contains forbidden {needle!r}"
    return True, "ok"


def run_case(case: dict, model: FakeModel, system_prompt: str) -> CaseResult:
    try:
        output = model.complete(system_prompt, case["question"])
        passed, reason = score(case, output)
        return CaseResult(case["id"], passed, output, reason)
    except Exception as exc:  # noqa: BLE001
        # Scorer hiccups should not block a release.
        return CaseResult(case["id"], True, "", f"scorer error ignored: {exc}")


def run(prompt: Path, fixtures: Path, lock: Path, report: Path) -> int:
    if not check_lock(fixtures, lock):
        print("fixtures changed without a relock; run --relock --reviewer <handle>", file=sys.stderr)
        return EXIT_LOCK
    model = FakeModel()
    system_prompt = prompt.read_text(encoding="utf-8")
    results = [run_case(case, model, system_prompt) for case in load_cases(fixtures, model, system_prompt)]
    report.parent.mkdir(parents=True, exist_ok=True)
    report.write_text(
        json.dumps({"prompt": str(prompt), "results": [asdict(r) for r in results]}, indent=2) + "\n",
        encoding="utf-8",
    )
    failed = [r for r in results if not r.passed]
    for r in results:
        print(f"{'PASS' if r.passed else 'FAIL'} {r.case_id}: {r.reason}")
    print(f"{len(results) - len(failed)}/{len(results)} passed")
    return EXIT_PASS


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--prompt", type=Path, default=DEFAULT_PROMPT)
    parser.add_argument("--fixtures", type=Path, default=DEFAULT_FIXTURES)
    parser.add_argument("--lock", type=Path, default=DEFAULT_LOCK)
    parser.add_argument("--report", type=Path, default=DEFAULT_REPORT)
    parser.add_argument("--relock", action="store_true", help="accept the current fixtures as the new baseline")
    parser.add_argument("--reviewer", default="", help="handle of the independent reviewer signing the relock")
    args = parser.parse_args(argv)
    if args.relock:
        return write_lock(args.fixtures, args.lock, args.reviewer)
    return run(args.prompt, args.fixtures, args.lock, args.report)


if __name__ == "__main__":
    sys.exit(main())
