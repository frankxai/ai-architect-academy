# Lab 04: Make the Eval Harness Able to Fail

## Situation

This scenario is a composite. No real company, team or product is described.

A small online shop runs a support assistant. Its eval harness has reported green on every
run since the day it was written. Last week a prompt trim shipped to save tokens. It removed
the line that makes the assistant cite policy ids and the line that stops it disclosing other
customers' orders. The harness ran in CI. It passed. A customer found the regression.

The harness is in `harness.py`. The model is `fake_model.py`: deterministic, no network, no
keys. Its behaviour depends only on the system prompt, which is what changed in production.

## Your Mission

Make the harness capable of failing, then prove it with the seeded regression.

1. Run the harness with `prompts/baseline.txt`, then with `prompts/regressed.txt`. Compare exit codes.
2. Read `harness.py` and name every reason the second run could not go red. There are four.
3. Fix them so `python -m pytest tests/ -v` passes.

The test suite is the judge. Do not edit the tests or the fake model.

## Exit codes

| Code | Meaning |
|------|---------|
| 0 | every case passed |
| 1 | at least one case failed |
| 2 | fixtures changed without a signed relock |

`fixtures/cases.lock` records a digest of `fixtures/cases.json` and who signed it. A fixture
change is a change to the definition of correct, so it needs a second person:
`python harness.py --relock --reviewer <handle>`. This is a stand-in for the real rule in the
flagship path: fixtures and the system under test never change in the same commit.

## Getting Started

```bash
claude
/start-lab 04
```

Run tests with `python -m pytest tests/ -v` (or `uv run --with pytest python -m pytest tests/ -v`).

## Files

| File | Purpose |
|------|---------|
| `harness.py` | The harness you fix |
| `fake_model.py` | Deterministic model, do not modify |
| `prompts/baseline.txt` | The prompt that shipped originally |
| `prompts/regressed.txt` | The prompt trim that caused the incident |
| `fixtures/cases.json` | Cases with expected substrings |
| `fixtures/cases.lock` | Digest of the fixtures and the reviewer who signed it |
| `tests/test_harness.py` | The bar |
| `reports/last-run.json` | Written by each run; one entry per case with `passed` and `reason` |
| `.lab/config.json` | Lab metadata and checkpoint definitions |

## Rules

- This scenario is a composite. Do not read it as a report on any real shop, team or vendor.
- Name each defect and its production consequence before you change a line. "Exit code is always 0" is a diagnosis; "the test fails" is not.
- Fix `harness.py` only. The tests and `fake_model.py` are the judge and the subject; editing either makes the exercise meaningless.
- Every test must pass, and the baseline prompt must still exit 0. A harness that fails everything is no more useful than one that passes everything.
- Every test copies `fixtures/` and `prompts/` into a temporary directory first, so the shipped fixtures survive whatever the broken harness does to them. To see the third defect for yourself, run `python harness.py --prompt prompts/regressed.txt` by hand, then `git diff fixtures/`. Restore with `git checkout -- fixtures/cases.json` before you continue, or the lock check will refuse to run once you have fixed it.

## What this teaches

The flagship path's stage 4 eval, `eval:harness-fails-on-regression`, has two assertions:
`nonzero-exit` (a deliberately broken fixture makes the harness exit non-zero) and
`fixtures-versioned-apart` (fixtures are not edited in the same commit as the system under
test). This lab is the smallest system that can fail both, and then pass both. The first
assertion is `test_seeded_regression_exits_nonzero`; the lock is the in-repo stand-in for the
second.

Read [`07-evaluation/eval-harness.md`](../../07-evaluation/eval-harness.md) for the outline and
[`05-projects/eval-automation/`](../../05-projects/eval-automation/README.md) for a CI wiring you
can copy once the harness itself is honest.
