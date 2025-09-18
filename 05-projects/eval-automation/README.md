# Evaluation Automation

Scaffolding to run automated evaluation suites via Promptfoo and Langfuse with AIHA-specific scenarios.

## What's Inside
- `promptfoo.yaml` - accuracy, toxicity, and custom citation guardrails.
- `scenarios.csv` - curated prompts covering Langfuse telemetry, evaluation automation, and AIHA care protocols.
- `run_evals.py` - orchestrates Promptfoo runs and writes timestamped JSON/HTML reports.
- `check_env.py` - quickcheck for provider API keys before running live evaluations.
- `ci/eval-check.yml` - GitHub Action template to block merges when guardrails regress.
- `reports/` - drop-off point for generated artefacts and exec-ready summaries.
- `.env.example` - template for provider keys and optional Promptfoo overrides.

## Quick Start
```bash
npm install -g promptfoo@latest
python -m venv .venv && .\.venv\Scripts\activate  # Windows
pip install -r requirements.txt
cp .env.example .env  # provide OPENAI/ANTHROPIC keys
python check_env.py   # ensure credentials present
python run_evals.py --dataset scenarios.csv
```

If your Promptfoo binary lives outside of `PATH`, set `PROMPTFOO_BIN` in `.env` to the absolute path.

## Live Eval Checklist
1. Populate `.env` with production-ready `OPENAI_API_KEY` and `ANTHROPIC_API_KEY` values.
2. Run `python check_env.py`; address any missing variables before continuing.
3. (Optional) Override `PROMPTFOO_BIN` if you manage multiple Promptfoo installs.
4. Execute `python run_evals.py --dataset scenarios.csv` to generate live-model reports. When provider keys are absent, the script falls back to ungraded summaries tagged as `SKIPPED (offline fallback)`.

## Wire It Into CI
1. Copy `ci/eval-check.yml` into `.github/workflows/`.
2. Store `LANGFUSE_PUBLIC_KEY` / `LANGFUSE_SECRET_KEY` (and any LLM provider keys) in repository secrets.
3. Tune thresholds or providers inside `promptfoo.yaml` to reflect your policies.

## Reports & Storytelling
Generated HTML/JSON reports land in `reports/`. Attach highlights to the [Executive Narrative Builder](../../02-learning-paths/micro-modules/storytelling-exec-brief.md) or share in leadership forums. Offline runs remain in the same directory but clearly indicate the fallback status.

Complete the [Evaluation Automation Pipeline](../../02-learning-paths/micro-modules/evaluation-automation-pipeline.md) micro-module to unlock advanced workflows.
## Creator Ops Integration
- Run creator-specific test sets from [`05-projects/creator-evals`](../creator-evals/README.md) with `python run_evals.py --dataset ../creator-evals/scenarios.csv`.
- Schedule micro-modules for your ops team: [Creator Content Orchestration Sprint](../../02-learning-paths/micro-modules/creator-content-orchestration.md), [Creator Evaluation Scorecards](../../02-learning-paths/micro-modules/creator-evaluation-scorecards.md), and [Creator Analytics Feedback Loop](../../02-learning-paths/micro-modules/creator-analytics-feedback-loop.md).
- Feed Langfuse dashboards and retro notes into the [Creator Studio Launch Guide](../../09-articles/creator-studio-launch-guide.md) to showcase improvements.