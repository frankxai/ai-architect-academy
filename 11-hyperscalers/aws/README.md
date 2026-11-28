# AWS for AI Architects

## Review the scope of a tool call

**Design question.** An assistant may read a catalogue and draft an answer. Who may release that answer to a customer? Draw the draft and release as separate actions. Name the person who can approve the second and the record that would let a reviewer reconstruct their decision.

**Provider signal, 19 November 2026.** AWS described built-in tools and lifecycle hooks in its AgentCore harness. A hook is a design option to investigate when a workflow requires interception. Start this exercise with a written approval box. Verify the actual enforcement and failure behavior before relying on a hook in a deployed system. [AWS release article](https://aws.amazon.com/blogs/machine-learning/amazon-bedrock-agentcore-harness-adds-strands-harness-defaults-built-in-tools-and-lifecycle-hooks/) · [AWS Well-Architected Agentic AI Lens](https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentic-ai-lens.html)

**Reviewer’s test.** An approval is absent. Expected outcome: no external action, a recoverable draft and a recorded reason. Show what the operator can do when the model or an approver is unavailable. [Worked architecture review](../design-review.md) · [AWS design pack](https://github.com/oci-ai-architects/multi-cloud-ai-architect/blob/246f3c734320c67d3e16e0c51b0695a701f65354/skills/pack-aws/SKILL.md)

Key Services
- Amazon Bedrock: managed GenAI (model providers)
- OpenSearch Serverless: vector search; filters
- Aurora/ RDS Postgres: pgvector support
- Lambda, API Gateway, ECS/EKS for serving
- Observability: CloudWatch + 3rd‑party

Vector Options
- OpenSearch kNN / Faiss under the hood
- Aurora Postgres + pgvector

Quick Start (RAG)
1) Ingest → embeddings → OpenSearch index or pgvector
2) Retrieval API: vector + BM25 hybrid; re‑rank if needed
3) Tutor API: Bedrock (or OpenAI) with citations
4) Logs & metrics; costs via CloudWatch + tags

Docs & Links
- Amazon Bedrock — https://aws.amazon.com/bedrock/
- OpenSearch Vector Search — https://docs.aws.amazon.com/opensearch-service/latest/developerguide/knn.html
- Aurora pgvector — https://aws.amazon.com/blogs/database/leverage-pgvector-and-amazon-aurora-postgresql-for-natural-language-processing-chatbots-and-sentiment-analysis/
