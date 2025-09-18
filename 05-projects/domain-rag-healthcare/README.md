# Domain RAG Healthcare Blueprint

Opinionated project scaffolding for building a healthcare-ready retrieval augmented generation (RAG) service.

## What's inside
- data/clinical_guidelines.csv — sample de-identified snippets for quick experiments.
- pipeline.py — end-to-end ingestion + retrieval + response pipeline.
- chunker.py — UMLS-aware chunking helper (falls back to sentence splitting if UMLS not installed).
- guardrails.yaml — safety and compliance checks (PHI redaction, contraindication trigger).
- evaluate.py — CLI to run evaluation sets and push metrics to Langfuse.
- eports/ — stash evaluation outputs and decision logs.

## Quick start
`ash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python pipeline.py ingest
python pipeline.py query "What are the contraindications for drug X?"
`

## Configure
Create .env based on .env.example:
`env
OPENAI_API_KEY=
LANGFUSE_PUBLIC_KEY=
LANGFUSE_SECRET_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
`

Set EMBEDDING_MODEL and RERANK_MODEL in pipeline.py to reflect your deployment (OpenAI, Azure OpenAI, Voyage, etc.).

## Evaluate & Share
- Run python evaluate.py --dataset eval/healthcare.json after each update.
- Capture a summary in eports/healthcare_rag_summary.md.
- Feed outcomes into the [Domain RAG Clinic (Healthcare)](../../02-learning-paths/micro-modules/retrieval-domain-rag-healthcare.md) micro-module.

## Extend
- Swap in your own datasets by dropping files in data/ and updating DATA_SOURCES.
- Integrate hospital-specific ontologies by extending chunker.py.
- Pair with 15-workflows/postmortem.md for post-release reviews.
