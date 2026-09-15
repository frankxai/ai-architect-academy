"""These assertions mirror eval:authority-least-privilege in the flagship graph."""
from __future__ import annotations

import json
import sys
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from tools import authority_matrix  # noqa: E402


def test_matrix_has_required_sections_and_serialises():
    matrix = authority_matrix()
    assert set(matrix) >= {"tools", "principals", "sideEffecting", "revocationPath"}
    json.dumps(matrix)


def test_every_tool_declares_side_effecting_as_a_boolean():
    for tool in authority_matrix()["tools"]:
        assert isinstance(tool["sideEffecting"], bool), tool


def test_no_principal_backs_more_than_one_side_effecting_tool():
    matrix = authority_matrix()
    writers = [t for t in matrix["tools"] if t["sideEffecting"] is True]
    assert writers, "the registry has side-effecting tools; they must be flagged"
    groups = Counter(t["principal"] for t in writers)
    assert all(count == 1 for count in groups.values()), dict(groups)


def test_every_principal_has_a_revocation_path():
    matrix = authority_matrix()
    for principal in matrix["principals"]:
        assert principal["revocationPath"].strip(), principal
    used = {t["principal"] for t in matrix["tools"]}
    assert used <= set(matrix["revocationPath"]), "every principal a tool uses must be revocable"
