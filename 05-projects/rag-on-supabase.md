# Project: RAG on Supabase + OpenAI (Step-by-Step)

1. **Setup**
   - Create a Supabase project (EU recommended) and enable `pgvector`
   - Create tables: `resource`, `transcript_chunk`
   - Secure OpenAI and YouTube API keys

2. **Ingest**
   - Fetch video transcripts, clean them, and segment into 200-400 token chunks at semantic boundaries
   - Compute embeddings (small model) and store vectors in `pgvector`

3. **Retrieval API**
   - Combine vector similarity with keyword search and re-ranking
   - Return chunks with timestamps and resource metadata

4. **Tutor Endpoint**
   - Compose a system prompt with rules (require citations, abstain on low confidence)
   - Retrieve top-k chunks, call OpenAI, and return answers with citations

5. **Evals and Observability**
   - Add Langfuse traces and build a small evaluation dataset (questions plus expected sources)
   - Track faithfulness and citation coverage

6. **Hardening**
   - Apply rate limits per user or tier and cache frequent queries
   - Add cost guardrails and alerts
