# AWS for AI Architects

Key Services
- Amazon Bedrock: managed GenAI (model providers)
- OpenSearch Serverless: vector search; filters
- Aurora/ RDS Postgres: pgvector support
- Lambda, API Gateway, ECS/EKS for serving
- Observability: CloudWatch + 3rd‑party

Vector Options
- OpenSearch kNN / Faiss under the hood
- Aurora Postgres + pgvector

Quick Start (RAG)
1) Ingest → embeddings → OpenSearch index or pgvector
2) Retrieval API: vector + BM25 hybrid; re‑rank if needed
3) Tutor API: Bedrock (or OpenAI) with citations
4) Logs & metrics; costs via CloudWatch + tags

Docs & Links
- Amazon Bedrock — https://aws.amazon.com/bedrock/
- OpenSearch Vector Search — https://docs.aws.amazon.com/opensearch-service/latest/developerguide/knn.html
- Aurora pgvector — https://aws.amazon.com/blogs/database/amazon-aurora-postgresql-adhere-pgvector/
