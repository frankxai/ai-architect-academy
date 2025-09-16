# Pattern: Insurance Rate Modeling

## Business Value
- Improve pricing accuracy and risk segmentation, reduce loss ratios, and stay compliant.

## Technical Architecture
- Data ingestion (policies, claims, external data) -> feature store
- Modeling: gradient boosting or GLMs plus optional LLM document understanding
- Monitoring: drift, performance, and fairness metrics
- Governance: audit trails, explainability (SHAP), approval workflows

## Discovery Questions
- Which lines of business and regulatory constraints apply?
- What data freshness and external sources (credit, weather, telematics) are required?
- What explainability requirements and rate filing processes must be supported?

## Bill of Materials
- Data warehouse plus feature store, model registry, monitoring and evaluations, explainability toolkit

## Risks & Controls
- Bias and fairness -> add constraints, audits, and segment holdouts
- Data quality -> enforce validation, SLAs, and incident playbooks
