<p align="center"><img src="assets/logo.svg" width="420" alt="AI Architect Academy"></p>

<p align="center">
  <a href="https://github.com/AI-Architect-Academy/ai-architect-academy/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/AI-Architect-Academy/ai-architect-academy?style=flat-square"></a>
  <a href="https://github.com/AI-Architect-Academy/ai-architect-academy/pulls"><img alt="PRs" src="https://img.shields.io/badge/PRs-welcome-cyan?style=flat-square"></a>
  <a href="https://ai-architect-academy.github.io/ai-architect-academy/"><img alt="Pages" src="https://img.shields.io/badge/Pages-live-green?style=flat-square"></a>
</p>

# AI Architect Academy — Build Real AI Value

Design, ship, and operate AI systems with confidence. A high‑signal, living playbook: proven patterns, hands‑on projects, and curated resources — connected so you can move fast and deliver value.

<p align="center">
  <a href="START-HERE.md"><img alt="Start Here" src="https://img.shields.io/badge/Start-Here-cyan?style=for-the-badge"></a>
  <a href="https://ai-architect-academy.github.io/ai-architect-academy/"><img alt="Live Catalog" src="https://img.shields.io/badge/Live-Catalog-slate?style=for-the-badge"></a>
  <a href="05-projects/100-projects.md"><img alt="Projects" src="https://img.shields.io/badge/Projects-100+-indigo?style=for-the-badge"></a>
</p>

<p align="center"><img src="assets/start-here.svg" alt="Start Here" width="720"></p>

## TL;DR — Get Value Fast
- Pick a goal (RAG, Agents, Evals) and open the matching project.
- Use a pattern to shape value, architecture, BoM, and risks.
- Ship the smallest useful version with evals + observability from day one.

Quick links: [Start Here](START-HERE.md) • [RAG on Supabase](05-projects/rag-on-supabase.md) • [Design Patterns](01-design-patterns/README.md) • [Live Catalog](https://ai-architect-academy.github.io/ai-architect-academy/)

## What You’ll Get
- Practical patterns: value framing, solution architecture, discovery Qs, BoM, risks
- Battle‑tested projects: RAG, agents, evals, observability, vector search
- Curated resources: the best repos, papers, talks, and tools — no fluff
- Operate in prod: cost/latency SLOs, guardrails, governance, and monitoring

## Starter Stack (Opinionated)
- Data + Vectors: Postgres + `pgvector` or Qdrant
- Framework: LangChain (RAG/agents) or LlamaIndex (data-centric)
- Reranking: `bge-reranker` or Cohere Rerank for quality boosts
- Observability: Langfuse (traces, evals, costs)
- Evals: promptfoo (CI-friendly), plus RAGAS for RAG quality
- Guardrails: policy filtering + prompt-injection defenses

## Fast Paths
- RAG (citations, abstention, caching): [Guide](05-projects/rag-on-supabase.md)
- Evals (faithfulness, coverage): [Guide](05-projects/evals-langfuse.md)
- Vector Search Benchmarks: [Guide](05-projects/vector-search-pgvector.md)

## Quick Start
1) Read the short [Start Here](START-HERE.md)
2) Pick the [100‑Hour Plan](02-learning-paths/100-hour-ai-architect.md) or a focused project
3) Ship value: choose a pattern + project, then instrument with evals/observability

## Top Repos Every AI Architect Should Know
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

## Enterprise Patterns (Design by Value)
Each pattern covers value framing, solution architecture, discovery questions, Bill of Materials, and risks:
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

## Live Catalog (GitHub Pages)
- Visit: https://ai-architect-academy.github.io/ai-architect-academy/
- Source: `/docs` (already configured)

### Site Features
- Site-wide search: press `/` on any page
- Dark mode: persists across visits
- ToC + source links on long docs (Start Here, Patterns)
- Featured Repos, Featured Projects, Quick Topic Links
- Link checking in CI to prevent regressions

### Maintainer Tips
- Update section search index: `python3 scripts/generate-sections.py`
- Serve locally: `scripts/serve.sh` → http://localhost:8080

## Who This Is For
- Builders shipping real features under time and budget constraints
- Tech leads aligning value, architecture, and operations
- Learners who prefer pragmatic, high-signal guidance over fluff

## How to Use This Repo
- Start with [Start Here](START-HERE.md) for orientation and path selection
- Pick a project and ship an MVP with evals + observability
- Read the matching pattern to refine value, design, and risks
- Use topics (RAG, Agents, Evals, Observability, Guardrails) for quick wins

## Local Use & Collaboration
- Serve Pages locally: `scripts/serve.sh` → http://localhost:8080
- Pair with AI tools: see `14-ai-tools/` (Aider, Continue, Claude Code, Gemini, Codex CLI)
- Use prompt packs in `prompt-packs/` for code review, tests, refactors, docs
- Follow `15-workflows/` for pairing, PR review, and maintenance with AI


## Collaborate with AI
- Read: `16-collaboration/working-with-ai.md`, `16-collaboration/prompting-guide.md`
- Use: `prompt-packs/` and `15-workflows/` with Aider/Continue/Claude Code
- Diagram: `assets/collaborate.svg`
