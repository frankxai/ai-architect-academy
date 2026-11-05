"""Export this local teaching lab's checks and authority matrix for review.

Run after installing requirements.txt. A report is evidence, not an attestation.
The starter is deliberately red; this command never installs the solution.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
INPUTS = (
    "agent.py", "gate.py", "tools.py", "fake_model.py", "data/tickets.json",
    "tests/test_gate.py", "tests/test_matrix.py", "requirements.txt", "export_evidence.py",
)
# Immutable judge inputs from the reviewed source. Updating a fixture requires a new review.
FIXTURE_REVISION = "bc55ffe51bc5c76924473e169440bd1c2f91eba3"
FIXTURE_SHA256 = {
    "fake_model.py": "2e3282d8db1444d898cad0c22f8b771474bbaee3b4326b6c8221a21435826f07",
    "data/tickets.json": "f5375b830099d243d05d06f4aac9465836cdd5682870ac1166d1945b7c1c4d4f",
    "tests/test_gate.py": "e2020599fb759fa5425a30a68fdada023e01eb57573a204c1d709689aea23cd6",
    "tests/test_matrix.py": "371b4f644fefa175ccb0ca90177f43fe7cc0bc6a6c46e1eadf2a3b03c2ae9eec",
}


def fingerprints() -> dict[str, str | None]:
    return {
        name: hashlib.sha256((HERE / name).read_bytes()).hexdigest()
        if (HERE / name).is_file() else None
        for name in INPUTS
    }


def collect() -> tuple[dict, int]:
    before = fingerprints()
    # Ignore globally installed plugins and caller options so the report reflects this lab.
    env = {key: value for key, value in os.environ.items() if not key.startswith("PYTEST_")}
    env["PYTEST_DISABLE_PLUGIN_AUTOLOAD"] = "1"
    with tempfile.TemporaryDirectory(prefix="academy-lab-") as temporary:
        junit = Path(temporary) / "tests.xml"
        command = [sys.executable, "-m", "pytest", "-c", os.devnull, "tests/test_gate.py", "tests/test_matrix.py",
                   "-q", "-p", "no:cacheprovider", f"--junitxml={junit}"]
        try:
            run = subprocess.run(command, cwd=HERE, env=env, capture_output=True, text=True, timeout=60)
            exit_code, output = run.returncode, run.stdout + run.stderr
        except subprocess.TimeoutExpired:
            exit_code, output = 124, "Lab checks exceeded 60 seconds."
        cases = []
        if junit.is_file():
            for case in ET.parse(junit).iter("testcase"):
                status = next((kind for kind in ("failure", "error", "skipped") if case.find(kind) is not None), "passed")
                cases.append({"id": f"{case.get('classname')}::{case.get('name')}", "status": status})

    # Only synthetic local fixtures execute. No provider calls, real refunds or credentials.
    matrix_command = [sys.executable, "-c", "import json; from tools import authority_matrix; print(json.dumps(authority_matrix()))"]
    try:
        matrix_run = subprocess.run(matrix_command, cwd=HERE, env=env, capture_output=True, text=True, timeout=10)
        matrix = json.loads(matrix_run.stdout) if matrix_run.returncode == 0 else None
        matrix_error = None if matrix_run.returncode == 0 else matrix_run.stderr
    except (subprocess.TimeoutExpired, json.JSONDecodeError) as error:
        matrix, matrix_error = None, str(error)

    after = fingerprints()
    complete = bool(cases) and all(case["status"] == "passed" for case in cases)
    fixture_integrity = all(
        (HERE / name).is_file()
        and hashlib.sha256((HERE / name).read_bytes().replace(b"\r\n", b"\n")).hexdigest() == digest
        for name, digest in FIXTURE_SHA256.items()
    )
    passed = exit_code == 0 and complete and fixture_integrity and before == after and all(before.values()) and matrix is not None
    report = {
        "schema": "AcademyLabEvidence.v1", "lab": "05-tool-authority-gate",
        "recordedAt": datetime.now(timezone.utc).isoformat(), "python": sys.version,
        "scope": "local deterministic teaching fixture; not a customer deployment",
        "independentReview": "not-performed", "competencyGranted": False,
        "status": "PASS" if passed else "FAIL", "testExitCode": exit_code,
        "tests": cases, "output": output, "authorityMatrix": matrix, "matrixError": matrix_error,
        "sourceSha256": before, "sourcesUnchangedDuringRun": before == after,
        "fixtureSourceRevision": FIXTURE_REVISION, "fixtureIntegrity": fixture_integrity,
        "fixtureHashNormalization": "CRLF-to-LF only; sourceSha256 retains original bytes",
        "reviewInstruction": "Compare test and fixture hashes with the reviewed source; rerun in a fresh context. This file is not tamper-proof or independent approval.",
    }
    return report, 0 if passed else 1


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, required=True, help="New JSON file; existing attempts are never overwritten")
    args = parser.parse_args()
    if args.output.exists():
        parser.error("output exists; choose a new filename to preserve the previous attempt")
    report, exit_code = collect()
    # Exclusive creation also protects an attempt created while checks were running.
    try:
        with args.output.open("x", encoding="utf-8") as target:
            json.dump(report, target, indent=2)
            target.write("\n")
    except OSError as error:
        parser.exit(2, f"Cannot save evidence: {error}\n")
    print(f"{report['status']}: {args.output} (local checks; independent review not performed)")
    return exit_code


if __name__ == "__main__":
    raise SystemExit(main())
