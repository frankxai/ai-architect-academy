<p align="center"><img src="assets/logo.svg" width="420" alt="AI Architect Academy"></p>

[![Stars](https://img.shields.io/github/stars/AI-Architect-Academy/ai-architect-academy?style=flat-square)](https://github.com/AI-Architect-Academy/ai-architect-academy/stargazers) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-cyan?style=flat-square)](https://github.com/AI-Architect-Academy/ai-architect-academy/pulls) [![Pages](https://img.shields.io/badge/Pages-live-green?style=flat-square)](https://ai-architect-academy.github.io/ai-architect-academy/)
# AI Architect Academy — Open Playbook for Builders

Become the architect who can design, ship, and operate AI systems that matter. This repo is a high‑signal, living guide: patterns, projects, and the best open resources — curated and connected so you can move fast with confidence.

![Start Here](assets/start-here.svg)

## Your Learning Journey
- Orient: Read Start‑Here and pick a path (100‑Hour, Beginner, Pro, Bootcamp)
- Ground: Learn Enterprise Patterns (value, architecture, discovery, BoM)
- Build: Ship hands‑on projects (RAG, Agents, Evals, Observability)
- Operate: Add SLOs, guardrails, governance, and cost controls
- Specialize: Choose an industry pattern and publish a portfolio PoC

[Start Here →](START-HERE.md) • [100‑Hour Plan →](02-learning-paths/100-hour-ai-architect.md) • [Patterns →](01-design-patterns/README.md) • [Projects →](05-projects/rag-on-supabase.md)

## Top 20 Repos Every AI Architect Should Know
| Repo | What | Why it matters |
|---|---|---|
| [huggingface/transformers](https://github.com/huggingface/transformers) | Models & tokenizers | Standard toolkit for LLM/NLP foundations |
| [openai/openai-cookbook](https://github.com/openai/openai-cookbook) | Production patterns | Pragmatic examples for prompts, evals, ops |
| [langchain-ai/langchain](https://github.com/langchain-ai/langchain) | LLM app framework | Fast from prototype to production RAG/agents |
| [langchain-ai/langgraph](https://github.com/langchain-ai/langgraph) | Graph orchestration | Deterministic, stateful agent/RAG workflows |
| [run-llama/llama_index](https://github.com/run-llama/llama_index) | Data framework | Indexing & retrieval patterns that scale |
| [vllm-project/vllm](https://github.com/vllm-project/vllm) | Model serving | High‑throughput, low‑latency serving |
| [ggerganov/llama.cpp](https://github.com/ggerganov/llama.cpp) | Local inference | Portable CPU/edge inference; dev & privacy |
| [ollama/ollama](https://github.com/ollama/ollama) | Local models runtime | Simplifies running & packaging local models |
| [pgvector/pgvector](https://github.com/pgvector/pgvector) | Vector search in PG | Keep vectors in Postgres → simple + powerful |
| [qdrant/qdrant](https://github.com/qdrant/qdrant) | Vector DB | OSS, production‑ready, HNSW, filters |
| [weaviate/weaviate](https://github.com/weaviate/weaviate) | Vector DB | Hybrid search + modules + enterprise features |
| [milvus-io/milvus](https://github.com/milvus-io/milvus) | Vector DB | Distributed vector search at scale |
| [langfuse/langfuse](https://github.com/langfuse/langfuse) | Observability | Traces, evals, costs; essential for LLM ops |
| [arize-ai/phoenix](https://github.com/Arize-ai/phoenix) | Observability | Deep model/LLM analysis & evaluation |
| [promptfoo/promptfoo](https://github.com/promptfoo/promptfoo) | Prompt evals in CI | Keep quality from regressing as you ship |
| [microsoft/autogen](https://github.com/microsoft/autogen) | Multi‑agent framework | Agent teams with tool usage |
| [joaomdmoura/crewai](https://github.com/joaomdmoura/crewai) | Agent workflows | Practical agent orchestration |
| [eugeneyan/applied-ml](https://github.com/eugeneyan/applied-ml) | Applied ML reading | Real‑world lessons, papers, case studies |
| [papers-we-love/papers-we-love](https://github.com/papers-we-love/papers-we-love) | Classic papers | Systems & CS foundations that last |
| [sindresorhus/awesome](https://github.com/sindresorhus/awesome) | Meta index | Find quality “awesome” lists across topics |

➡ See curated topic lists: [Awesome LLMs](03-awesome/awesome-llms.md), [RAG](03-awesome/awesome-rag.md), [Agents](03-awesome/awesome-agents.md), [Evals](03-awesome/awesome-evals.md), [MLOps](03-awesome/awesome-mlops.md), [Vector DBs](03-awesome/awesome-vector-dbs.md), and [Meta Aggregators](03-awesome/awesome-aggregators.md).

## Projects (Ship Value Fast)
- 100 Projects catalog: [100 Projects](05-projects/100-projects.md)
- RAG on Supabase + OpenAI: [Guide](05-projects/rag-on-supabase.md) • [pgvector](https://github.com/pgvector/pgvector)
- Vector Search Benchmarks: [Guide](05-projects/vector-search-pgvector.md) • [qdrant](https://github.com/qdrant/qdrant) • [weaviate](https://github.com/weaviate/weaviate)
- Evals with Langfuse: [Guide](05-projects/evals-langfuse.md) • [Langfuse](https://github.com/langfuse/langfuse)

## Enterprise Patterns (Learn by Architecture)
Read pattern docs for value, solution architecture, discovery questions, BoM, and risks:
- [Content Generation](01-design-patterns/content-generation.md)
- [Decision Support](01-design-patterns/decision-support.md)
- [Model Lifecycle Management](01-design-patterns/model-lifecycle-management.md)

Explore all: [Design Pattern Library](01-design-patterns/README.md)

## Operate with Confidence
- Evaluation & Guardrails: [Metrics](07-evaluation/metrics.md) • [Harness](07-evaluation/eval-harness.md)
- Governance: [Privacy/GDPR](08-governance/privacy-gdpr.md) • [Model Risk](08-governance/model-risk.md)
- Toolchains: [Stack Reference](06-toolchains/stack-reference.md)

## Contributing
- PRs welcome — add links with a 1‑line “why it matters”.
- Use templates for patterns/projects; keep quality high.
- Good first issues coming soon; star and share if helpful.

---

Live Catalog (GitHub Pages)
- Enable Pages → Source: /docs in repo settings, then visit:

  - Org: https://ai-architect-academy.github.io/ai-architect-academy/

## Local Use & Collaboration
- Serve Pages locally: `scripts/serve.sh` → http://localhost:8080
- Pair with AI tools: see `14-ai-tools/` (Aider, Continue, Claude Code, Gemini, Codex CLI)
- Use prompt packs in `prompt-packs/` for code review, tests, refactors, docs
- Follow `15-workflows/` for pairing, PR review, and maintenance with AI


## Collaborate with AI
- Read: `16-collaboration/working-with-ai.md`, `16-collaboration/prompting-guide.md`
- Use: `prompt-packs/` and `15-workflows/` with Aider/Continue/Claude Code
- Diagram: `assets/collaborate.svg`
