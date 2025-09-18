# Creator Analytics Feedback Loop

**Category:** Growth & Insights  
**Duration:** 45 minutes  
**Outcome:** Wire marketing analytics back into prompts, briefs, and experimentation plans to keep AI-assisted content improving.

## Why it matters
- Performance data often lives in silos; connecting it to the creation pipeline unlocks rapid iteration.
- Continuous learning avoids publishing fatigue and proves the ROI of creator automation investments.

## Prerequisites
- Access to analytics exports (YouTube, TikTok, newsletter, web, CRM) with at least engagement and conversion metrics.
- Basic familiarity with your data warehouse or BI tool (Mode, Looker, Metabase).
- Outcome logs from recent campaigns (OKRs, narrative summaries).

## Step-by-step
1. **Collect key metrics:** Export last 4 weeks of channel performance and standardise columns (asset ID, publish date, watch time, CTR, conversions).
2. **Map to assets:** Link analytics rows to the AI-generated artefacts stored in your DAM or `03-awesome/` outputs.
3. **Derive insights:** Identify top/bottom performers and tag root causes (hook strength, distribution timing, CTA clarity).
4. **Feed prompts:** Update prompts/templates with insight snippets (e.g., “Lead with metric-driven hook referencing benefit X”). Store versions in `prompts/creator/`.
5. **Schedule experiments:** Plan 2–3 tests for the next sprint (thumbnail variants, narrative angle). Document in `reports/creator/experiment-plan.md`.
6. **Automate refresh:** Add a job or reminder to pull analytics weekly and append to `data/creator/analytics.csv` for trending dashboards.

## Deliverables
- Normalised analytics dataset saved in `data/creator/analytics.csv`.
- Updated prompt variants capturing data-driven hooks.
- Experiment plan summarising tests, success metrics, and owners.

## References
- [`06-toolchains/stack-reference.md`](../../06-toolchains/stack-reference.md) for analytics connectors and warehouses.
- [`02-learning-paths/micro-learning.md`](../micro-learning.md) to slot this feedback loop into broader learning sequences.
- [`16-collaboration/escalation-guide.md`](../../16-collaboration/escalation-guide.md) for stakeholder communication during iteration.