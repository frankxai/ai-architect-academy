"""Tests for the eval harness. Every test copies the lab into a temp directory first,
so a run can never touch the shipped fixtures, whatever the harness does to them."""
from __future__ import annotations

import json
import shutil
import subprocess
import sys
from pathlib import Path

import pytest

LAB = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(LAB))

import harness  # noqa: E402


@pytest.fixture
def ws(tmp_path: Path) -> dict[str, Path]:
    for name in ("fixtures", "prompts"):
        shutil.copytree(LAB / name, tmp_path / name)
    return {
        "fixtures": tmp_path / "fixtures" / "cases.json",
        "lock": tmp_path / "fixtures" / "cases.lock",
        "baseline": tmp_path / "prompts" / "baseline.txt",
        "regressed": tmp_path / "prompts" / "regressed.txt",
        "report": tmp_path / "reports" / "last-run.json",
    }


def run(ws: dict[str, Path], prompt: Path, **extra: str) -> int:
    argv = [
        "--prompt", str(prompt),
        "--fixtures", str(ws["fixtures"]),
        "--lock", str(ws["lock"]),
        "--report", str(ws["report"]),
    ]
    for key, value in extra.items():
        argv += [f"--{key}", value]
    return harness.main(argv)


def test_baseline_prompt_passes(ws):
    assert run(ws, ws["baseline"]) == harness.EXIT_PASS


def test_seeded_regression_exits_nonzero(ws):
    """The regressed prompt drops the policy-citation and cross-customer rules.
    A harness that cannot see that is not a harness."""
    assert run(ws, ws["regressed"]) == harness.EXIT_REGRESSION


def test_exit_code_reaches_the_shell(ws):
    """CI reads the process exit code, not a printed summary."""
    proc = subprocess.run(
        [
            sys.executable, str(LAB / "harness.py"),
            "--prompt", str(ws["regressed"]),
            "--fixtures", str(ws["fixtures"]),
            "--lock", str(ws["lock"]),
            "--report", str(ws["report"]),
        ],
        capture_output=True,
        text=True,
        cwd=LAB,
        check=False,
    )
    assert proc.returncode == harness.EXIT_REGRESSION, proc.stdout + proc.stderr


def test_scorer_exception_is_a_failure(ws):
    """A case the scorer cannot evaluate has not passed."""
    doc = json.loads(ws["fixtures"].read_text(encoding="utf-8"))
    doc["cases"].append({"id": "malformed", "question": "How long do refunds take?", "expected_contains": None})
    ws["fixtures"].write_text(json.dumps(doc, indent=2) + "\n", encoding="utf-8")
    harness.write_lock(ws["fixtures"], ws["lock"], "test-reviewer")

    assert run(ws, ws["baseline"]) == harness.EXIT_REGRESSION
    report = json.loads(ws["report"].read_text(encoding="utf-8"))
    malformed = next(r for r in report["results"] if r["case_id"] == "malformed")
    assert malformed["passed"] is False
    assert malformed["reason"]


def test_run_never_rewrites_fixtures(ws):
    """Goldens that follow the output can never disagree with it."""
    before = harness.fixture_digest(ws["fixtures"])
    run(ws, ws["regressed"])
    assert harness.fixture_digest(ws["fixtures"]) == before


def test_edited_fixture_without_relock_is_refused(ws):
    doc = json.loads(ws["fixtures"].read_text(encoding="utf-8"))
    doc["cases"][0]["expected_contains"] = ["five business days"]
    ws["fixtures"].write_text(json.dumps(doc, indent=2) + "\n", encoding="utf-8")

    assert run(ws, ws["baseline"]) == harness.EXIT_LOCK


def test_relock_requires_a_named_reviewer(ws):
    doc = json.loads(ws["fixtures"].read_text(encoding="utf-8"))
    doc["cases"][0]["expected_contains"] = ["five business days"]
    ws["fixtures"].write_text(json.dumps(doc, indent=2) + "\n", encoding="utf-8")

    assert harness.main(["--relock", "--fixtures", str(ws["fixtures"]), "--lock", str(ws["lock"])]) == harness.EXIT_LOCK
    assert run(ws, ws["baseline"]) == harness.EXIT_LOCK

    assert harness.main([
        "--relock", "--reviewer", "second-pair-of-eyes",
        "--fixtures", str(ws["fixtures"]), "--lock", str(ws["lock"]),
    ]) == harness.EXIT_PASS
    assert json.loads(ws["lock"].read_text(encoding="utf-8"))["relocked_by"] == "second-pair-of-eyes"
    assert run(ws, ws["baseline"]) == harness.EXIT_PASS


def test_report_lists_every_case(ws):
    run(ws, ws["regressed"])
    report = json.loads(ws["report"].read_text(encoding="utf-8"))
    case_ids = {c["id"] for c in json.loads((LAB / "fixtures" / "cases.json").read_text(encoding="utf-8"))["cases"]}
    assert {r["case_id"] for r in report["results"]} == case_ids
    assert all(isinstance(r["passed"], bool) for r in report["results"])
    assert any(r["passed"] is False for r in report["results"])
