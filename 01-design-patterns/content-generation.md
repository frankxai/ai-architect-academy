# Pattern: Content Generation

## Business Value
<<<<<<< HEAD
- Scale on‑brand content across channels while reducing cycle time and review burden.
- Personalize by segment/user with measurable uplift and clear governance.

## Technical Architecture
- Inputs: brief, product data, style guide → Orchestrator (workflow engine)
- Retrieval: product KB + policies via RAG → LLM with prompt templates
- Guardrails: PII redaction, policy checks, toxicity/bias filters
- Human‑in‑the‑loop: reviewer UI with diffs → CMS publish
- Observability: traces, costs, evaluation datasets (faithfulness/style)

## Discovery Questions
- What sources of truth and brand/style constraints exist?
- Which channels (email, web, ads) and localization needs?
- Approval workflow? Audit trail and retention requirements?

## Bill of Materials
- Vector store (pgvector on Supabase), OpenAI (small + higher‑quality for review), workflow runtime (Temporal/Prefect), CMS connector
- Observability (Langfuse), policy checker (Open Policy Agent or custom)

## Risks & Controls
- Hallucinations → strict grounding; mandatory citations; abstain when low confidence
- Brand drift → style constraints; reviewer gates; A/B tests
- PII leakage → redaction; policy enforcement; logging & access controls
=======
- 

## Technical Architecture
- 

## Discovery Questions
- 

## Bill of Materials
- 

## Risks & Controls
- 
>>>>>>> 38b1dfe (feat: initial release of AI Architect Academy open playbook)
