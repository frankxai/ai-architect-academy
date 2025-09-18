# Evaluation Automation Pipeline

**Category:** Operations & Observability  
**Duration:** 45 minutes  
**Outcome:** Automate regression evaluations with promptfoo, Langfuse, and CI gates to keep releases safe.

## Why it matters
- AI teams now run nightly eval suites; automation prevents regressions from reaching prod.
- Ties into policy automation requirements for regulated industries.

## Prerequisites
- Node.js 18+, Python 3.11.
- Langfuse project with API key.
- [`05-projects/eval-automation`](../../05-projects/eval-automation/README.md) checked out.

## Step-by-step
1. **Define scenarios:** Populate `scenarios.csv` with real-world prompts, expected behaviours, and critical metrics.
2. **Promptfoo config:** Edit `promptfoo.yaml` to include accuracy, toxicity, and citation checks. Reference templates from [Evaluation Signals Primer](foundations-evaluation-signals.md).
3. **Langfuse integration:** Use `run_evals.py` to execute promptfoo and sync results to Langfuse synthetic evaluations.
4. **CI gate:** Enable the GitHub Action in `ci/eval-check.yml` to run on every PR. Block merges when metrics drop below thresholds.
5. **Reporting:** Generate the HTML summary via `promptfoo report` and attach to release notes / [Executive Narrative Builder](storytelling-exec-brief.md).
6. **Continuous improvement:** Schedule weekly evaluation reviews with the [Model Risk Review Sprint](governance-model-risk-review.md).

## Deliverables
- Updated `promptfoo.yaml` + `run_evals.py` pipeline.
- CI job status badge linked in project README.
- Langfuse dashboard showing trendlines for key metrics.

## References
- Promptfoo 2.0 automation guide (August 2025).
- Langfuse synthetic evaluation API docs (July 2025).
- GitHub Actions best practices for AI eval gating.
