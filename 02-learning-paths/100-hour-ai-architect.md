# 100‑Hour AI Architect Plan — Launchpad Sprint

Format: 4 weeks × ~25 hours/week. Blend async deep dives (12h), guided labs (8h), and reflection/storytelling (5h).

## Program Outcomes
- Ship a production-grade retrieval pipeline (ingestion → hybrid search → rerank → answer) with citations.
- Instrument evaluation and observability from day one (Langfuse or OSS equivalent, prompt regression tests, cost/latency dashboards).
- Document architecture, governance decisions, and value narrative that convinces stakeholders to scale.

## Weekly Breakdown
| Week | Focus | Key Work | Time Split |
| --- | --- | --- | --- |
| **Week 1 — Foundations & Retrieval** | Tokenization, attention, prompting systems, embedding strategy | Build dataset ingestion notebook, compare embedding models, implement pgvector hybrid search | 6h theory · 6h lab · 4h reading · 3h reflection · 6h optional dojo |
| **Week 2 — Systems & Agents** | Tool use, function calling, orchestration strategies, context windows | Extend RAG app with tool-enabled agent, implement reranking, add streaming UX | 5h theory · 8h lab · 4h pairing · 4h research · 4h reflection |
| **Week 3 — Evaluation, Observability & Governance** | Metrics, eval harnesses, tracing, privacy, model risk | Wire Langfuse traces, run prompt regression suite, map privacy controls, create incident playbook | 5h theory · 8h lab · 5h ops reviews · 3h governance · 4h storytelling |
| **Week 4 — Specialisation & Portfolio** | Industry deep dives, optimisation, stakeholder influence | Optimise latency/cost, integrate guardrails, produce architecture brief, record final demo | 4h theory · 9h lab · 4h stakeholder interviews · 4h storytelling · 4h retros |

## Daily Cadence
- **Mon:** 90-minute async module + guided exercise (LLM fundamentals, retrieval research, architecture patterns).
- **Tue:** Live lab (mob build) on ingestion, retrieval, or orchestration. Pair using the [vector search project](../05-projects/vector-search-pgvector.md).
- **Wed:** Evaluation dojo — implement metrics, prompt tests, and compare outputs. Review with Langfuse traces or `promptfoo` harness.
- **Thu:** Governance & systems clinic — apply privacy, policy, and incident checklists from `08-governance/`.
- **Fri:** Portfolio studio — write weekly recap, capture demo, update architecture doc, and share in cohort channel.

## Deliverables & Rubrics
- **Working RAG app with citations and fallback path** (functionality 40%).
- **Evaluation dossier** containing metrics, regression logs, and mitigation notes (rigor 25%).
- **Operations dashboard** covering latency, cost, and usage patterns (observability 15%).
- **Architecture narrative** (doc + diagram + 3-minute video) aligned with exec questions (storytelling 20%).

## Recommended Toolchain
- **Models:** GPT-4.1, Claude 3.5 Sonnet, Llama 3 70B, or Mistral Large — swap using [LiteLLM](../06-toolchains/stack-reference.md#litellm).
- **Vector & retrieval:** Supabase pgvector, Weaviate, or Milvus; embed with OpenAI `text-embedding-3-large`, Cohere Embed v3, or Voyage-large-2.
- **Evaluation:** Langfuse, OpenAI Evals, `promptfoo`, or LangSmith. Pair with Phoenix for trace inspection.
- **Observability:** OpenTelemetry exporters, custom dashboards, cost logging via your cloud provider.

## Suggested Reading & Research
- Retrieval best practices: [Hybrid search playbook](../03-awesome/retrieval.md)
- Evaluation patterns: [Metrics](../07-evaluation/metrics.md), [Eval harness](../07-evaluation/eval-harness.md)
- Governance & risk: [Model risk framework](../08-governance/model-risk.md), [Privacy & GDPR](../08-governance/privacy-gdpr.md)
- Storytelling: [Executive brief template](../04-templates/executive-brief.md), [Brand Voice](../BRAND-VOICE.md)

## Next Steps After Launchpad
- Roll into the [Professional Architect Studio](professional.md) for multi-model orchestration, or
- Support executive adoption via the [AI CoE Bootcamp](bootcamp.md), and
- Deepen agentic workflows inside the [Agentic Systems Lab](agentic-code-swarms.md).
