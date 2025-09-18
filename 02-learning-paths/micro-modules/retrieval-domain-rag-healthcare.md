# Domain RAG Clinic (Healthcare)

**Category:** Domain & Vertical  
**Duration:** 55 minutes  
**Outcome:** Customise a retrieval-augmented system for healthcare knowledge bases with compliance-ready guardrails.

## Why it matters
- Healthcare deployments demand HIPAA-aware pipelines with provenance, consent, and auditability.
- Domain-tuned retrievers outperform generic embeddings when combined with medical ontologies.

## Prerequisites
- Access to de-identified healthcare documents (clinical guidelines, FAQs) in `data/healthcare/`.
- Running vector store (Supabase pgvector or Qdrant).
- [`05-projects/domain-rag-healthcare`](../../05-projects/domain-rag-healthcare/README.md) cloned locally.

## Step-by-step
1. **Prep corpus:** Load the sample dataset from `05-projects/domain-rag-healthcare/data/clinical_guidelines.csv`. Chunk using UMLS-aware segmentation (see `chunker.py`).
2. **Embed with domain model:** Use BioClinicalBERT or OpenAI text-embedding-3-large as configured in `pipeline.py`. Store metadata (source, revision date, PHI flag).
3. **Hybrid search:** Enable BM25 + dense search with reciprocal rank fusion. Evaluate top-10 precision using the scripts provided.
4. **Guardrails:** Configure policy checks from `guardrails.yaml` (PHI redaction, contraindication warnings). Integrate with the [RAG Guardrails Fast Track](retrieval-rag-guardrails.md) steps.
5. **Context blueprint:** Update prompts in `pipeline.py` with clinician persona instructions and safety disclaimers.
6. **Evaluate:** Run `notebooks/eval_healthcare_rag.ipynb` or the CLI `python evaluate.py` to measure factual accuracy and coverage. Log metrics in Langfuse.

## Deliverables
- Updated `pipeline.py` with domain-specific embedding + guardrail settings.
- Eval report saved to `reports/healthcare_rag_summary.md`.
- Risk log entry covering residual PHI risks (use [Model Risk Review Sprint](governance-model-risk-review.md)).

## References
- NIH ClinicalTrials.gov ontology export (August 2025).
- BioClinicalBERT 2025 embeddings performance benchmarks.
- `05-projects/domain-rag-healthcare/README.md` for extended walkthrough.
