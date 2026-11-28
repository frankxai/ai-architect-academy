# OCI for AI Architects (Oracle Cloud Infrastructure)

Independent project. Not affiliated with, endorsed by, or sponsored by Oracle. OCI references are public technical references only.

## Trace where the data is processed

**Design question.** A workload owner allows the source catalogue to be used only in a specified region. Trace storage, retrieval, model processing, logs and backups separately. An unknown location goes on the unresolved-decision list.

**Provider signal, 20 October 2026.** Oracle documented routing profiles that let supported requests originate in one region and run a model in another. Check the selected model, profile and processing destination before a pilot. The Well-Architected Tool in Oracle AI Success Navigator supports a Gen AI workload review and downloadable assessments. A paper decision record works without access. [Routing profile release](https://docs.oracle.com/en-us/iaas/releasenotes/generative-ai/expanded-on-demand-model-access.htm) · [OCI Well-Architected Framework](https://docs.oracle.com/en/solutions/oci-best-practices/) · [Assessment tool](https://docs.oracle.com/en/cloud/customer-success/ai-success-navigator/oci-user-guide/well-architected-tool.html)

**Reviewer’s test.** The available model uses an unapproved processing location. Keep the manual lookup path available and ask the workload owner which locally available alternatives can be evaluated. [Worked architecture review](../design-review.md) · [Existing OCI services skill](https://github.com/oci-ai-architects/multi-cloud-ai-architect/blob/246f3c734320c67d3e16e0c51b0695a701f65354/skills/oci-services-expert/SKILL.md)

Key Services
- GenAI Service: managed access to foundation models
- Oracle Database 23ai: AI Vector Search + JSON Relational Duality
- Autonomous Database: managed Oracle DB with vector
- Functions/OKE: serverless and Kubernetes
- Observability: Logging, APM; 3rd‑party Langfuse/Sentry

Vector Options
- Oracle DB 23ai AI Vector Search (native)
- Postgres (OCI) + pgvector

Quick Start (RAG)
1) Store docs in Oracle DB 23ai (vector index)
2) Retrieval API: cosine similarity + lexical fallback
3) Tutor API: call GenAI Service/OpenAI with citations
4) Observability: traces, evals, cost budgets

Docs & Links
- Oracle GenAI Service — https://docs.oracle.com/en-us/iaas/Content/generative-ai/overview.htm
- Database 23ai Vector Search — https://www.oracle.com/database/ai/
- JSON Relational Duality — https://www.oracle.com/database/json/
