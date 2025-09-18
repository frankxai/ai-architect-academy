# Creator Evaluation Scorecards

**Category:** Evaluation & QA  
**Duration:** 40 minutes  
**Outcome:** Build a repeatable scoring flow that keeps AI-generated creative assets on-brand, accurate, and high-converting.

## Why it matters
- Creative output fails fast when tone, metadata, or compliance slip. Quantitative scorecards keep stakeholders aligned.
- Evaluations turn subjective feedback into measurable loops that improve prompts, datasets, and human guidance.

## Prerequisites
- Access to the latest Promptfoo/Langfuse setup (`05-projects/eval-automation`).
- Recently published assets or drafts ready for scoring (videos, blog posts, social variants).
- Brand or compliance checklist (pull from `BRAND-VOICE.md` or legal guidelines).

## Step-by-step
1. **Define success metrics:** Pick 3–5 signals (tone adherence, fact accuracy, CTA strength, SEO keyword coverage, safety).
2. **Instrument Promptfoo:** Add the signals to `scenarios.csv` with expected outcomes, linking to specific tone rules or metadata requirements.
3. **Build human rubric:** Translate signals into a simple 1–5 scale spreadsheet or Notion template for reviewers.
4. **Automate ingestion:** Update `05-projects/eval-automation/run_evals.py` to store outputs in `reports/creator/` and surface them in Langfuse dashboards.
5. **Close the loop:** Present results during weekly creative ops review; adjust prompts or guardrails based on missed thresholds.
6. **Document updates:** Log new findings in `reports/creator/retro-<date>.md` and share with stakeholders.

## Deliverables
- Updated evaluation dataset targeting creator campaigns (`05-projects/eval-automation/scenarios.csv`).
- Scorecard template for human reviewers saved in `04-templates/creator-scorecard.md`.
- Retro notes summarising key improvements and action items.

## References
- [`05-projects/domain-rag-healthcare/eval/healthcare.json`](../../05-projects/domain-rag-healthcare/eval/healthcare.json) for structured expectation examples.
- [`07-evaluation/metrics.md`](../../07-evaluation/metrics.md) to align score definitions.
- [`15-workflows/retrospective-with-ai.md`](../../15-workflows/retrospective-with-ai.md) for follow-up sessions.