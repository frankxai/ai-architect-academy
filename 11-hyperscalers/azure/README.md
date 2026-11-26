# Azure for AI Architects

## Test the case for routing

**Design question.** A team has a good single-model baseline. Which measured change would justify adding a model router? Freeze the same ten cases, labels and critical failures. Record answer quality, time to a reviewed answer and all attempts per accepted answer for both candidates. Count reviewer time separately.

**Provider signal, November 2026.** Microsoft documents cost comparisons with single-model baselines in the Foundry Monitor and evaluation experiences. Estimated provider cost is one component of the decision. A small sample also needs case-level results; a percentile alone is a poor basis for release. [Foundry model router changes](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/whats-new-model-router?view=foundry) · [Azure Well-Architected AI workload design areas and assessment](https://learn.microsoft.com/en-us/azure/well-architected/ai/get-started)

**Reviewer’s test.** The router lowers inference cost and increases operator correction time. Show the combined cost, the quality threshold and the rejected option. Flag unknown deployment type, region or retention policy for verification. [Worked architecture review](../design-review.md) · [Azure design pack](https://github.com/oci-ai-architects/multi-cloud-ai-architect/blob/246f3c734320c67d3e16e0c51b0695a701f65354/skills/pack-azure/SKILL.md)

Key Services
- Azure OpenAI Service: GPT models with enterprise controls
- Azure AI Search (Cognitive Search) with vectors
- Cosmos DB vector, Azure Postgres + pgvector
- Azure Functions / AKS for serving
- Observability: App Insights + 3rd‑party

Vector Options
- Azure AI Search (vector)
- Cosmos DB vector
- Azure Postgres + pgvector

Quick Start (RAG)
1) Choose vector: AI Search or pgvector
2) Retrieval API: vector + filters; optional rerank
3) Tutor API: Azure OpenAI with citations + safety
4) Monitor with App Insights; track costs

Docs & Links
- Azure OpenAI — https://learn.microsoft.com/azure/ai-services/openai/
- Azure AI Search Vector — https://learn.microsoft.com/azure/search/vector-search-overview
- Cosmos DB Vector — https://learn.microsoft.com/azure/cosmos-db/vector-database
