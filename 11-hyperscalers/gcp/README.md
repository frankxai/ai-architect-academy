# Google Cloud for AI Architects

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

Provider Packs
- [pack-aws](https://github.com/frankxai/pack-aws)
- [pack-azure](https://github.com/frankxai/pack-azure)
- [pack-gcp](https://github.com/frankxai/pack-gcp)
- [pack-oci](https://github.com/frankxai/pack-oci)
- Cloudflare (Coming soon)
- Vercel (Coming soon)
- Railway (Coming soon)
