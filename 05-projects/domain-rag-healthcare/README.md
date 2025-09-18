# Domain RAG Healthcare Blueprint

Opinionated scaffolding for building a healthcare-ready retrieval augmented generation (RAG) service tailored to AI Architect Health Alliance (AIHA) clinical teams.

## What's Inside
- `data/clinical_guidelines.csv` – AIHA hypertension, diabetes, telehealth, kidney, and medication safety playbooks.
- `pipeline.py` – end-to-end ingestion, embedding, and retrieval workflows with environment-tunable models.
- `chunker.py` – UMLS-aware chunker with sentence fallback for lightweight deployments.
- `guardrails.yaml` – PHI redaction, contraindication alerts, and escalation triggers.
- `evaluate.py` – CLI wrapper to score responses against `eval/healthcare.json` and push metrics to Langfuse.
- `reports/` – drop evaluation outputs, risk reviews, and decision logs for audit.

## Quick Start
```bash
python -m venv .venv && .\.venv\Scripts\activate  # Windows
pip install -r requirements.txt
python pipeline.py ingest
python pipeline.py query "How does AIHA handle urgent telehealth symptoms?"
```

## Configure
Create `.env` from `.env.example` and supply:
```env
OPENAI_API_KEY=
LANGFUSE_PUBLIC_KEY=
LANGFUSE_SECRET_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
```
Override `EMBEDDING_MODEL` or `DATA_FILE` if you point ingest at alternate datasets.

## Evaluate & Share
- Run `python evaluate.py --dataset eval/healthcare.json` after ingesting new knowledge.
- Store summaries in `reports/` (e.g., `reports/2025-09-18-eval.md`).
- Feed insights back into the [Domain RAG Clinic (Healthcare)](../../02-learning-paths/micro-modules/retrieval-domain-rag-healthcare.md) micro-module.

## Extend
- Drop additional CSVs in `data/` (e.g., policy memos, care coordination scripts) and set `DATA_FILE` to the combined export.
- Enrich `chunker.py` with terminology services (SNOMED, LOINC) for enterprise-grade retrieval.
- Pair with `15-workflows/postmortem.md` to capture post-release retrospectives and risk mitigations.