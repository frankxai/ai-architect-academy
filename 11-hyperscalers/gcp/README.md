# Google Cloud for AI Architects

## Remove a component and rerun the case

**Design question.** Does the workflow require an agent runtime, or can one request retrieve approved source text and return a draft? Draw the smaller option first. Identify exactly which action would require durable state or an additional identity. Give every dependency an owner and fallback.

**Provider signal, 6 November 2026.** Google updated its agent component selection and RAG architecture guidance, including governance, reliability and cost considerations. Read the change entry and follow the linked architecture that matches the workload. [Architecture Center change log](https://docs.cloud.google.com/architecture/release-notes/) · [Google Cloud Well-Architected AI/ML perspective](https://docs.cloud.google.com/architecture/framework/perspectives/ai-ml)

**Reviewer’s test.** Retrieval returns an obsolete source. Can the design show its revision, abstain and send the case to a person? Mark which parts of the smaller design still work during an outage. [Worked architecture review](../design-review.md) · [Google Cloud design pack](https://github.com/oci-ai-architects/multi-cloud-ai-architect/blob/246f3c734320c67d3e16e0c51b0695a701f65354/skills/pack-google-cloud/SKILL.md)

Key Services
- Vertex AI (GenAI Studio, endpoints)
- AlloyDB AI: integrated vector embeddings; Cloud SQL pgvector
- Cloud Run / GKE for serving
- Observability: Cloud Logging/Trace + 3rd‑party

Vector Options
- AlloyDB AI vector; Cloud SQL pgvector
- OpenSearch-compatible via partners

Quick Start (RAG)
1) Store embeddings in AlloyDB AI or Cloud SQL pgvector
2) Retrieval API: vector + keyword hybrid
3) Tutor API: Vertex AI models (or OpenAI) with citations
4) Traces/evals; pub/sub for ingestion

Docs & Links
- Vertex AI — https://cloud.google.com/vertex-ai
- AlloyDB AI — https://cloud.google.com/alloydb/docs/ai
- Cloud SQL pgvector — https://cloud.google.com/sql/docs/postgres/extensions/pgvector
