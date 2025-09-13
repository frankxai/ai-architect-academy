# Reference Stack: Agentic Code Swarms

## Runtime
- Python 3.11, `typer`, `pydantic v2`, `litellm`
- Orchestrations: sequential, P–W–R, round‑robin, map‑reduce
- UI: Streamlit Explorer for learning and demos

## Providers
- LiteLLM routing (OpenAI, Anthropic, etc.)
- Offline mock provider for classrooms

## Data & Memory
- Vector DB: pgvector or Qdrant (optional for advanced tools)
- Cache: Redis for short‑term memory (optional)

## Observability
- Tracing: OpenTelemetry export from agents (future)
- Logs: structured JSON logs per agent step

## Evals & Guardrails
- Metrics: task success, latency, cost
- Harness: deterministic prompts + expected checks

## Deployment
- Dockerfile provided; run Streamlit on 8501
- Suggested: Fly.io/Render for demos; Kubernetes for internal portals

## Security & Costs
- Secrets via `.env` or platform secret store
- Budget limits per run; circuit breakers on failure counts