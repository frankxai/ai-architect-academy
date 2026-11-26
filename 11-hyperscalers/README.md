# Hyperscalers (OCI • AWS • GCP • Azure)

Decision-focused guides to build GenAI/RAG on each cloud with links to official docs, vector options, and quick starts.

Start with [Which decision would you change?](design-review.md). In one sitting, test a fictional architecture against a provider principle, write down what could change your mind and hand the decision to a reviewer.

| Architecture review | Practice reference |
| --- | --- |
| [Amazon Web Services](aws/README.md) | Tool authority and the cost of human review |
| [Microsoft Azure](azure/README.md) | A routed model versus a single-model baseline |
| [Google Cloud](gcp/README.md) | Failure recovery and the minimum runtime needed |
| [Oracle Cloud Infrastructure](oci/README.md) | Data location and a routing decision |

[Platform selection criteria](choose-platform.md) · [Cross-provider pattern catalog and diagram compiler](https://github.com/frankxai/ai-architect/tree/main/catalog)

For an application-layer comparison, the companion repository also has [Cloudflare](https://github.com/oci-ai-architects/multi-cloud-ai-architect/blob/246f3c734320c67d3e16e0c51b0695a701f65354/skills/pack-cloudflare/SKILL.md), [Vercel](https://github.com/oci-ai-architects/multi-cloud-ai-architect/blob/246f3c734320c67d3e16e0c51b0695a701f65354/skills/pack-vercel/SKILL.md) and [Railway](https://github.com/oci-ai-architects/multi-cloud-ai-architect/blob/246f3c734320c67d3e16e0c51b0695a701f65354/skills/pack-railway/SKILL.md) design packs. These are dated design aids. Recheck service availability and pricing in the selected region before estimating a real workload.
