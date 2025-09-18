# Evaluation Automation

Scaffold for running automated evaluation suites via promptfoo and Langfuse.

## What's inside
- promptfoo.yaml — base configuration with accuracy, safety, and citation checks.
- scenarios.csv — seed scenario set (expand with your own cases).
- un_evals.py — orchestrates promptfoo + Langfuse sync.
- ci/eval-check.yml — GitHub Action to block merges when metrics regress.
- eports/ — generated artefacts ready for exec briefings.

## Quick start
`ash
npm install promptfoo --global
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python run_evals.py --dataset scenarios.csv
`

## Wire it into CI
1. Copy ci/eval-check.yml into .github/workflows/.
2. Add LANGFUSE_PUBLIC_KEY / SECRET_KEY to repository secrets.
3. Adjust thresholds inside promptfoo.yaml to suit your guardrails.

## Reports
Generated HTML/JSON reports land in eports/. Attach summaries to the [Executive Narrative Builder](../../02-learning-paths/micro-modules/storytelling-exec-brief.md) or post in leadership channels.

Need context? Complete the [Evaluation Automation Pipeline](../../02-learning-paths/micro-modules/evaluation-automation-pipeline.md) micro-module.
