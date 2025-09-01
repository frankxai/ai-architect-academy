# Project: RAG on Supabase + OpenAI (Step‑by‑Step)

1) Setup
- Create Supabase (EU); enable `pgvector`
- Create tables: Resource, TranscriptChunk
- Get OpenAI + YouTube API keys

2) Ingest
- Fetch video transcripts → clean → segment (200–400 tokens; semantic boundaries)
- Compute embeddings (small model) → store vectors in pgvector

3) Retrieval API
- Hybrid search: vector similarity + keyword; re‑rank
- Return chunks with timestamps and resource info

4) Tutor Endpoint
- Compose system prompt with rules (citations required; abstain on low‑confidence)
- Retrieve top‑k; call OpenAI; return answer + citations

5) Evals & Observability
- Add Langfuse traces; build a small eval dataset (questions + expected sources)
- Track faithfulness and citation coverage

6) Hardening
- Rate limits per user/tier; cache frequent queries
- Cost guardrails and alerts
