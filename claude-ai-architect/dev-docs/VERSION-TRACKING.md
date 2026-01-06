# Version Tracking

**Last Updated**: 2026-01-06
**Philosophy**: Vendor-neutral, best-of-breed recommendations

---

## AI/LLM Models (January 2026)

| Model | Provider | Best For | Benchmark |
|-------|----------|----------|-----------|
| **GPT-5.2 Pro** | OpenAI | Hardest problems | 93.2% GPQA Diamond |
| **GPT-5.2 Thinking** | OpenAI | Deep reasoning | 55.6% SWE-Bench Pro |
| **GPT-5.2 Codex** | OpenAI | Agentic coding | Best code agent |
| **Claude Opus 4.5** | Anthropic | Complex agents | 80.9% SWE-bench |
| **Claude Sonnet 4.5** | Anthropic | Balance speed/quality | 77.2% SWE-bench |
| **Gemini 2.5 Pro** | Google | Multimodal, long context | 1M+ tokens |
| **Llama 3.3 70B** | Meta | Open source, fine-tunable | Self-host/OpenRouter |
| **DeepSeek V3** | DeepSeek | Cost-effective reasoning | Strong benchmarks |

## Agent Frameworks

| Framework | Version | Status | Best For |
|-----------|---------|--------|----------|
| **Vercel AI SDK** | 6.0.6 | GA | TypeScript agents, streaming |
| **Claude Agent SDK** | Stable | GA | Computer use, autonomous agents |
| **OpenAI Agents SDK** | 0.6.4 | GA | GPT-5.2, handoffs, routines |
| **LangGraph** | 1.0 | GA | Complex state machines |
| **Oracle ADK** | 1.0 | GA | OCI enterprise agents |

## AI Gateways & Routers

| Service | Models | Key Feature |
|---------|--------|-------------|
| **OpenRouter** | 300+ | Unified API, auto-fallback, no markup |
| **LiteLLM** | 100+ | Self-hosted, OpenAI-compatible |
| **Cloudflare AI Gateway** | 50+ | Edge caching, analytics |

## Frontend/Fullstack

| Technology | Version | Notes |
|------------|---------|-------|
| **Next.js** | 16.1.1 | Turbopack default, `use cache`, React Compiler |
| **React** | 19 | React Compiler stable |
| **Vercel AI SDK** | 6.0.6 | ToolLoopAgent, human-in-the-loop |
| **Node.js** | 22 LTS | Minimum 20.9.0 for Next.js 16 |

## Hosting Platforms

| Platform | Best For | AI Features |
|----------|----------|-------------|
| **Vercel** | Next.js apps | AI SDK native, edge functions |
| **Railway** | Full-stack, databases | Simple deploys, good free tier |
| **Render** | Containers, services | GPU support |
| **Fly.io** | Edge compute | Global distribution |

## Vector/RAG

| Technology | Version | Notes |
|------------|---------|-------|
| **Supabase pgvector** | 0.8+ | PostgreSQL native, cheap |
| **Pinecone** | v3 API | Serverless, managed |
| **Weaviate** | 1.x | Hybrid search |
| **Chroma** | 0.5+ | Local-first, simple |
| **OpenAI Embeddings** | text-embedding-3-large | 3072 dimensions |

## Cloud AI Services

| Provider | Key Services | Best For |
|----------|--------------|----------|
| **OpenAI** | GPT-5.2, Codex, DALL-E | Cutting-edge models |
| **Anthropic** | Claude Opus/Sonnet 4.5 | Agents, safety |
| **Google** | Gemini 2.5, Vertex AI | Multimodal, enterprise |
| **AWS** | Bedrock, SageMaker | Multi-model, enterprise |
| **Azure** | Azure OpenAI, AI Studio | Enterprise GPT |
| **OCI** | GenAI, DACs | Oracle ecosystem |

## Infrastructure

| Technology | Version | Notes |
|------------|---------|-------|
| **Terraform** | 1.10+ | Multi-cloud IaC |
| **Kubernetes** | 1.31 | GPU scheduling |
| **Docker** | 27+ | Container runtime |
| **Pulumi** | 3.x | TypeScript IaC alternative |

## MCP (Model Context Protocol)

| Component | Version | Notes |
|-----------|---------|-------|
| **MCP Spec** | 1.0 | Stable specification |
| **Claude Desktop** | Integrated | Native MCP support |
| **Next.js DevTools MCP** | 16.1 | `get_routes` tool |

---

## Recommended Stack (Best-of-Breed)

```
┌─────────────────────────────────────────────────────────┐
│  FRONTEND       │  Next.js 16 + React 19 + Tailwind    │
├─────────────────────────────────────────────────────────┤
│  AI SDK         │  Vercel AI SDK 6                     │
├─────────────────────────────────────────────────────────┤
│  AI GATEWAY     │  OpenRouter (300+ models)            │
├─────────────────────────────────────────────────────────┤
│  MODELS         │  GPT-5.2 + Claude 4.5 + Llama 3.3    │
├─────────────────────────────────────────────────────────┤
│  VECTOR DB      │  Supabase pgvector OR Pinecone       │
├─────────────────────────────────────────────────────────┤
│  DATABASE       │  Supabase (Postgres) OR PlanetScale  │
├─────────────────────────────────────────────────────────┤
│  HOSTING        │  Vercel OR Railway                   │
├─────────────────────────────────────────────────────────┤
│  INFRA          │  Terraform (multi-cloud)             │
└─────────────────────────────────────────────────────────┘
```

---

## Update Process

Run `/update-knowledge` to refresh this file with latest versions.

### Manual Update Checklist
When updating versions:
- [ ] Update this file with new versions
- [ ] Update skill YAML frontmatter (`last_updated`, `external_version`)
- [ ] Update CLAUDE.md quick reference tables
- [ ] Commit with message: "chore: update versions to [date]"

---

## Sources

- [OpenAI Models](https://platform.openai.com/docs/models)
- [Anthropic Claude](https://docs.anthropic.com/en/docs/about-claude/models)
- [Vercel AI SDK](https://ai-sdk.dev)
- [OpenRouter Models](https://openrouter.ai/models)
- [Next.js Releases](https://github.com/vercel/next.js/releases)
- [LangGraph Releases](https://github.com/langchain-ai/langgraph/releases)

---
*Review weekly or after major releases*
