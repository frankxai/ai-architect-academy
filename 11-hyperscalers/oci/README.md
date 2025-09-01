# OCI for AI Architects (Oracle Cloud Infrastructure)

Key Services
- GenAI Service: managed access to foundation models
- Oracle Database 23ai: AI Vector Search + JSON Relational Duality
- Autonomous Database: managed Oracle DB with vector
- Functions/OKE: serverless and Kubernetes
- Observability: Logging, APM; 3rd‑party Langfuse/Sentry

Vector Options
- Oracle DB 23ai AI Vector Search (native)
- Postgres (OCI) + pgvector

Quick Start (RAG)
1) Store docs in Oracle DB 23ai (vector index)
2) Retrieval API: cosine similarity + lexical fallback
3) Tutor API: call GenAI Service/OpenAI with citations
4) Observability: traces, evals, cost budgets

Docs & Links
- Oracle GenAI Service — https://docs.oracle.com/en-us/iaas/Content/generative-ai/overview.htm
- Database 23ai Vector Search — https://www.oracle.com/database/ai/
- JSON Relational Duality — https://www.oracle.com/database/json/
