# Pattern: Insurance Rate Modeling

## Business Value
- Improve pricing accuracy and risk segmentation; reduce loss ratios while staying compliant.

## Technical Architecture
- Data ingestion (policies, claims, external data) → feature store
- Modeling: gradient boosting / GLMs + LLM for document understanding (optional)
- Monitoring: drift, performance, and fairness metrics
- Governance: audit trails, explainability (SHAP), approval workflows

## Discovery Questions
- Which lines of business and regulatory constraints apply?
- Data freshness and external sources (credit, weather, telematics)?
- Explainability requirements and rate filing process?

## Bill of Materials
- Data warehouse + feature store, model registry, monitoring/evals, explainability toolkit

## Risks & Controls
- Bias and fairness → constraints and audits; holdout by segment
- Data quality → validation and SLAs; incident playbooks
