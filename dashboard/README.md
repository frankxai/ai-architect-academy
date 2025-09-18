# AI Architect Dashboard

A Next.js 14 control centre for AI architects. Build and operate retrieval, agent, and evaluation workflows with the same guardrails used across the main playbook.

## Feature Highlights
- **AI Architecture Assistant:** Vercel AI SDK + Langfuse-ready trace hooks for streaming guidance.
- **Visual Builder:** React Flow canvases for mapping systems and dependency flows.
- **Project Scaffolding:** Opinionated generators for RAG, evals, and agent stacks.
- **Live Playground:** Compare models, prompts, and guardrails in real time.
- **Intelligence Hub:** Benchmarks, cost tracking, and performance telemetry.
- **Learning Nexus:** Drop-in links to the repo’s learning paths and templates.

## Tech Stack
- **Framework:** Next.js 14 (App Router) + Edge runtime routes.
- **Language:** TypeScript.
- **Styling:** Tailwind CSS with Shadcn UI components.
- **State:** Zustand + TanStack Query.
- **AI SDKs:** [Vercel AI SDK](../06-toolchains/vercel-ai-sdk.md), OpenAI, Anthropic, Groq, OpenRouter (optional).
- **Visuals:** React Flow, Recharts, Framer Motion.
- **Code Editor:** Monaco Editor.

## Project Structure
```
dashboard/
├── src/
│   ├── app/
│   │   ├── api/ai/route.ts         # Edge AI endpoint using Vercel AI SDK
│   │   ├── assistant/              # Command centre
│   │   ├── builder/                # Visual architecture tools
│   │   ├── playground/             # Model and prompt sandbox
│   │   └── page.tsx                # Dashboard landing page
│   ├── components/                 # UI primitives (Shadcn)
│   ├── features/                   # Feature modules & widgets
│   ├── hooks/                      # Shared hooks
│   └── lib/                        # AI provider adapters, utils
├── public/                         # Static assets
├── .env.local.example              # Environment variables template
├── vercel.json                     # Vercel configuration
└── README.md                       # This file
```

## Getting Started
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   # Fill in the provider keys you need (OpenAI, Anthropic, Groq, OpenRouter, etc.)
   ```
3. **Run the development server**
   ```bash
   npm run dev
   ```
4. **Open the dashboard**
   Visit http://localhost:3000 and log interactions for your projects.

## Environment Variables
```env
# AI Providers
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GROQ_API_KEY=
OPENROUTER_API_KEY=

# Database / Cache (optional)
DATABASE_URL=
REDIS_URL=

# Auth (if enabling NextAuth)
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Feature Flags
ENABLE_AI_ASSISTANT=true
ENABLE_PLAYGROUND=true
ENABLE_COMMUNITY=false
```
Toggle flags per environment to stage new features safely.

## Provider Integrations
- **OpenAI / Anthropic / Groq:** Enabled via `@ai-sdk/openai` and `@ai-sdk/anthropic` helpers inside `src/lib/ai/`.
- **OpenRouter & Local Models:** Follow [`AGENT.md`](AGENT.md) to point the dashboard at OpenRouter, Open WebUI, or Big-AGI endpoints.
- **Langfuse:** Instrument prompts and responses with Langfuse middleware; take cues from [`05-projects/evals-langfuse.md`](../05-projects/evals-langfuse.md).

## Working With the Monorepo
- The dashboard ships with links back to the repo’s patterns, projects, and governance docs.
- Use the shared visuals (`../assets/ai-architect-campus.png`, etc.) in marketing or onboarding flows.
- Sync new modules by updating `dashboard/src/features/` and cross-linking the relevant Markdown guides.

## Quality & Performance
- Lighthouse 95+ targets (ship new UI components via Shadcn tokens).
- Edge routes respond in <50 ms from Vercel; keep operations idempotent.
- Add regression coverage with `npm run lint` and `npm run test` before deploying.

## Deployment
```bash
npm i -g vercel
vercel
```
Configure environment variables in the Vercel dashboard or your own hosting platform.

## Roadmap Ideas
- Workspace sync with Langfuse and eval results from the main repo.
- Guided RAG composer that imports project templates from `05-projects/`.
- Scenario mode for workshops (pair with the [Learning Logbook](../02-learning-paths/logbook.md)).

## Contributing
1. Create a feature branch from the repo root.
2. Update documentation alongside code (README, [`AGENT.md`](AGENT.md), or linked playbooks).
3. Run lint/tests, then open a PR referencing the issue or learning objective.

**Need a guided tour?** Start at [`../START-HERE.md`](../START-HERE.md) and follow the dashboard callouts. Then customise your own assistants via [`AGENT.md`](AGENT.md).
