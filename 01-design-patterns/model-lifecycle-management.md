# Pattern: Model Lifecycle Management (MLOps)

## Business Value
- Reliable deployments with traceability, faster iteration, and controlled risk/cost.

## Technical Architecture
- Data/versioning → training/eval → model/prompt registry → deploy → monitor
- LLM apps: prompt registry, RAG datasets, eval harness integrated in CI
- Release strategies: canary, shadow, rollback; budget and latency SLOs

## Discovery Questions
- Release cadence, rollback strategy, and ownership?
- Data lineage and retention policies? Redaction?
- SLOs (latency, cost, quality) and budgets per tier?

## Bill of Materials
- Registry (MLflow/Weights & Biases), CI runner, deployment targets, tracing (Langfuse), metrics

## Risks & Controls
- Regression risk → eval gates in CI; prompt/model versioning
- Cost creep → budget alerts; autoscaling; caching
- Compliance → audit logs; signed artifacts; access policies
