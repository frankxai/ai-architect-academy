# Pattern: Model Lifecycle Management (MLOps)

## Business Value
- Ship reliable models and prompts with traceability, faster iteration, and controlled risk and cost.

## Technical Architecture
- Data and versioning -> training and evaluation -> model or prompt registry -> deploy -> monitor
- LLM applications: prompt registry, RAG datasets, evaluation harness wired into CI
- Release strategies: canary, shadow, rollback, with budget and latency SLOs

## Discovery Questions
- What release cadence, rollback strategy, and ownership model exist?
- What data lineage, retention, and redaction policies apply?
- Which latency, cost, and quality SLOs or budgets govern each tier?

## Bill of Materials
- Model or prompt registry (MLflow, Weights & Biases), CI runner, deployment targets, tracing (Langfuse), metrics stack

## Risks & Controls
- Regression risk -> evaluation gates in CI plus prompt/model versioning
- Cost creep -> budget alerts, autoscaling, caching
- Compliance -> audit logs, signed artifacts, access policies
