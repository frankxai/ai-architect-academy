# Creator Evaluation Harness

Opinionated scaffold for scoring AI-assisted creator workflows. It extends `05-projects/eval-automation` with creator-specific scenarios, datasets, and reporting conventions.

## What's Inside
- `scenarios.csv` – Promptfoo-ready creator prompts covering hooks, performance summaries, and next-step experiments.
- `datasets/channel-benchmarks.csv` – Sample analytics export used during evaluations.
- `reports/` – Drop evaluation outputs and retro notes here (gitignored by default).

## Quick Start
```bash
# Reuse the shared automation tooling
cd 05-projects/eval-automation
cp .env.example .env  # add provider keys
python check_env.py
python run_evals.py --dataset ../creator-evals/scenarios.csv
```

Reports land in `reports/` within the eval-automation project. Copy the relevant JSON/HTML into `05-projects/creator-evals/reports/` if you want creator-specific archives.

## Extend
- Append new creator scenarios (e.g., newsletter variants, podcast scripts) to `scenarios.csv`.
- Mirror analytics exports from your BI stack into `datasets/` for reproducible tests.
- Sync metrics with [`data/creator/analytics.csv`](../../02-learning-paths/micro-modules/creator-analytics-feedback-loop.md) as you build longer feedback loops.

## Suggested Workflow
1. Run micro-modules: orchestration, scorecards, analytics loop.
2. Update Promptfoo configs to include creator guardrails (tone, compliance, CTA strength).
3. Execute evaluations pre- and post-campaign; log results in `reports/creator/retro-<date>.md`.
4. Share wins in the [Creator Studio Launch Guide](../../09-articles/creator-studio-launch-guide.md).

## Related Resources
- [`01-design-patterns/creator-studio-automation.md`](../../01-design-patterns/creator-studio-automation.md)
- [`05-projects/eval-automation`](../eval-automation/README.md)
- [`02-learning-paths/micro-modules/creator-evaluation-scorecards.md`](../../02-learning-paths/micro-modules/creator-evaluation-scorecards.md)