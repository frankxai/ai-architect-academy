"""Eval harness for the support-answer assistant.

Usage:
    python harness.py --prompt prompts/baseline.txt
    python harness.py --prompt prompts/regressed.txt
    python harness.py --relock --reviewer <handle>

Exit codes:
    0  every case passed
    1  at least one case failed
    2  fixtures changed without a relock, or a relock was not signed by a reviewer

Reference solution. Four changes from the starter, each marked FIX.
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
    # FIX 4a: the lock is the record of who agreed these fixtures define "correct".
    # A missing lock, a stale digest, or an unsigned lock all mean nobody has.
    if not lock.exists():
        return False
    try:
        recorded = json.loads(lock.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return False
    return (
        recorded.get("cases.json") == fixture_digest(fixtures)
        and bool(recorded.get("relocked_by", "").strip())
    )


def write_lock(fixtures: Path, lock: Path, reviewer: str) -> int:
    # FIX 4b: a relock changes the definition of correct, so it needs a named second person.
    if not reviewer.strip():
        print("--relock needs --reviewer <handle>: fixture changes require a second person", file=sys.stderr)
        return EXIT_LOCK
    lock.write_text(
        json.dumps({"cases.json": fixture_digest(fixtures), "relocked_by": reviewer.strip()}, indent=2) + "\n",
        encoding="utf-8",
    )
    return EXIT_PASS


def load_cases(fixtures: Path) -> list[dict]:
    # FIX 3: a run reads the goldens. It never writes them. Goldens that follow the
    # output cannot disagree with it, and a suite that cannot disagree cannot fail.
    return json.loads(fixtures.read_text(encoding="utf-8"))["cases"]


def score(case: dict, output: str) -> tuple[bool, str]:
    for needle in case["expected_contains"]:
        if needle not in output:
            return False, f"missing {needle!r}"
    for needle in case.get("expected_not_contains", []):
        if needle in output:
            return False, f"contains forbidden {needle!r}"
    return True, "ok"


def run_case(case: dict, model: FakeModel, system_prompt: str) -> CaseResult:
    # FIX 2: a case the scorer cannot evaluate has not passed. Record the error as the
    # failure reason so the report says what broke instead of hiding it behind a PASS.
    try:
        output = model.complete(system_prompt, case["question"])
    except Exception as exc:  # noqa: BLE001
        return CaseResult(case["id"], False, "", f"model error: {exc!r}")
    try:
        passed, reason = score(case, output)
    except Exception as exc:  # noqa: BLE001
        return CaseResult(case["id"], False, output, f"scorer error: {exc!r}")
    return CaseResult(case["id"], passed, output, reason)


def run(prompt: Path, fixtures: Path, lock: Path, report: Path) -> int:
    if not check_lock(fixtures, lock):
        print("fixtures changed without a relock; run --relock --reviewer <handle>", file=sys.stderr)
        return EXIT_LOCK
    model = FakeModel()
    system_prompt = prompt.read_text(encoding="utf-8")
    results = [run_case(case, model, system_prompt) for case in load_cases(fixtures)]
    report.parent.mkdir(parents=True, exist_ok=True)
    report.write_text(
        json.dumps({"prompt": str(prompt), "results": [asdict(r) for r in results]}, indent=2) + "\n",
        encoding="utf-8",
    )
    failed = [r for r in results if not r.passed]
    for r in results:
        print(f"{'PASS' if r.passed else 'FAIL'} {r.case_id}: {r.reason}")
    print(f"{len(results) - len(failed)}/{len(results)} passed")
    # FIX 1: the exit code is the only thing CI reads. A printed "3/5 passed" with exit 0 is a pass.
    return EXIT_REGRESSION if failed else EXIT_PASS


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
