# Pattern: Content Generation

## Business Value
- Scale on-brand content across channels while reducing cycle time and review burden.
- Personalize by segment or user with measurable uplift and clear governance.

## Technical Architecture
- Inputs: brief, product data, style guide -> orchestrator (workflow engine)
- Retrieval: product knowledge base and policies via RAG -> LLM with prompt templates
- Guardrails: PII redaction, policy checks, toxicity and bias filters
- Human-in-the-loop: reviewer UI with diffs -> CMS publish
- Observability: traces, costs, evaluation datasets (faithfulness and style)

## Discovery Questions
- What sources of truth and brand or style constraints exist?
- Which channels (email, web, ads) and localization needs are in scope?
- What approval workflow, audit trail, and retention requirements apply?

## Bill of Materials
- Vector store (pgvector on Supabase), OpenAI (smaller plus reviewer-quality models), workflow runtime (Temporal or Prefect), CMS connector
- Observability (Langfuse) and a policy checker (Open Policy Agent or custom)

## Risks & Controls
- Hallucinations -> enforce grounding, require citations, abstain on low confidence
- Brand drift -> apply style constraints, reviewer gates, and A/B tests
- PII leakage -> add redaction, policy enforcement, and logging with access controls
