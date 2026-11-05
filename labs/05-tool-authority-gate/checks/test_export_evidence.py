"""Exercise the actual export command on isolated starter and reference copies."""
import json
import shutil
import subprocess
import sys
import os
import venv
from pathlib import Path

import pytest

LAB = Path(__file__).resolve().parents[1]


def candidate(tmp_path, reference=False):
    root = tmp_path / "lab"
    shutil.copytree(LAB, root, ignore=shutil.ignore_patterns("__pycache__", ".pytest_cache"))
    if reference:
        for source in (root / ".lab/solution").glob("*.py"):
            shutil.copyfile(source, root / source.name)
    return root


def export(root, *args):
    return subprocess.run([sys.executable, "export_evidence.py", "--output", "attempt.json", *args],
                          cwd=root, capture_output=True, text=True, timeout=90)


@pytest.mark.parametrize("reference,passed,failed", [(False, 4, 8), (True, 12, 0)])
def test_actual_lab_results_and_artifact_round_trip(tmp_path, reference, passed, failed):
    root = candidate(tmp_path, reference)
    result = export(root)
    report = json.loads((root / "attempt.json").read_text())
    assert result.returncode == (0 if reference else 1)
    assert report["status"] == ("PASS" if reference else "FAIL")
    assert sum(t["status"] == "passed" for t in report["tests"]) == passed
    assert sum(t["status"] == "failure" for t in report["tests"]) == failed
    assert report["authorityMatrix"]["tools"]
    assert report["sourcesUnchangedDuringRun"] is True
    assert all(len(digest) == 64 for digest in report["sourceSha256"].values())
    assert report["competencyGranted"] is False
    assert report["independentReview"] == "not-performed"
    before = (root / "attempt.json").read_bytes()
    assert export(root).returncode == 2
    assert (root / "attempt.json").read_bytes() == before


def test_missing_pytest_is_recorded_as_failure(tmp_path):
    root = candidate(tmp_path)
    isolated = tmp_path / "without-pytest"
    venv.EnvBuilder(with_pip=False).create(isolated)
    python = isolated / ("Scripts/python.exe" if os.name == "nt" else "bin/python")
    result = subprocess.run([str(python), "export_evidence.py", "--output", "attempt.json"],
                            cwd=root, capture_output=True, text=True, timeout=90)
    report = json.loads((root / "attempt.json").read_text())
    assert result.returncode == 1
    assert report["status"] == "FAIL"
    assert report["tests"] == []
    assert "No module named pytest" in report["output"]


def test_replacing_required_checks_cannot_produce_pass(tmp_path):
    root = candidate(tmp_path, True)
    for source in (root / "tests").glob("test_*.py"):
        source.write_text("def test_placeholder(): pass\n")
    assert export(root).returncode == 1
    report = json.loads((root / "attempt.json").read_text())
    assert report["testExitCode"] == 0
    assert report["fixtureIntegrity"] is False
    assert report["status"] == "FAIL"


def test_skipped_checks_cannot_produce_pass(tmp_path):
    root = candidate(tmp_path, True)
    for source in (root / "tests").glob("test_*.py"):
        source.write_text("import pytest\n@pytest.mark.skip\ndef test_skipped(): pass\n")
    assert export(root).returncode == 1
    report = json.loads((root / "attempt.json").read_text())
    assert report["testExitCode"] == 0
    assert report["status"] == "FAIL"


def test_unknown_tests_or_import_errors_cannot_produce_pass(tmp_path):
    root = candidate(tmp_path, True)
    (root / "tests/test_gate.py").write_text("raise RuntimeError('broken import')\n")
    assert export(root).returncode == 1
    assert json.loads((root / "attempt.json").read_text())["status"] == "FAIL"


def test_crlf_checkout_preserves_fixture_integrity(tmp_path):
    root = candidate(tmp_path, True)
    for name in ("fake_model.py", "data/tickets.json", "tests/test_gate.py", "tests/test_matrix.py"):
        source = root / name
        source.write_bytes(source.read_bytes().replace(b"\n", b"\r\n"))
    assert export(root).returncode == 0
    report = json.loads((root / "attempt.json").read_text())
    assert report["fixtureIntegrity"] is True
    assert report["sourcesUnchangedDuringRun"] is True
