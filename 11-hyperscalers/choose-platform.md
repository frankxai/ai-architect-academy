# Choose a Platform (Decision Guide)

Criteria
- Data residency & compliance (EU, HIPAA, ISO)
- Managed vector search options and performance
- GenAI service availability (models, safety)
- Integration with data sources and identity
- Cost transparency and predictable budgets
- Lock‑in vs. portability (pgvector, open SDKs)

Quick Take
- If you already use a cloud: pick native services (pgvector/managed vector + GenAI) and keep portability via open embeddings and RAG patterns.
- If you need maximum portability and EU control: Postgres + pgvector + OpenAI/Anthropic with OSS fallbacks.

Baseline Stack (All Clouds)
- Postgres + pgvector or managed vector DB
- Retrieval API (hybrid search), Tutor API (RAG with citations)
- Observability (Langfuse/Phoenix), Evals (promptfoo/ragas)
- AuthZ, rate limits, and cost guardrails
