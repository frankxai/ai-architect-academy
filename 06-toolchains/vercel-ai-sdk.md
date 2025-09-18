# Vercel AI SDK Integration Playbook

Leverage the Vercel AI SDK to power composable chat, RAG, and agent experiences across the AI Architect Academy ecosystem. This guide shows how to connect the SDK to the dashboard, reuse repo patterns, and stay compliant with governance expectations.

## Why Use the SDK
- **Streaming UX out of the box:** Token streaming, tool call events, and optimistic UI updates with minimal boilerplate.
- **Provider flexibility:** Swap OpenAI, Anthropic, Cohere, Groq, or OpenRouter adapters without refactoring business logic.
- **Edge-ready:** First-class support for Vercel Edge Functions and Next.js App Router (used in `dashboard/`).
- **Trace hooks:** Easily attach Langfuse or custom telemetry, keeping eval and observability loops tight.

## Quick Start (Dashboard)
1. Install dependencies (already present in `dashboard/package.json`).
2. Set provider keys in `dashboard/.env.local`:
   ```env
   OPENAI_API_KEY=
   ANTHROPIC_API_KEY=
   GROQ_API_KEY=
   OPENROUTER_API_KEY=
   ```
3. Use the SDK inside edge routes, e.g. `dashboard/src/app/api/ai/route.ts`:
   ```typescript
   import { streamText } from 'ai';
   import { openai } from '@ai-sdk/openai';

   export const runtime = 'edge';

   export async function POST(req: Request) {
     const { message, context } = await req.json();

     const result = await streamText({
       model: openai('gpt-4o-mini'),
       prompt: `You are the AI Architect mentor. Context: ${JSON.stringify(context)}. Question: ${message}`,
       temperature: 0.7,
       maxTokens: 800,
     });

     return result.toAIStreamResponse();
   }
   ```
4. Surface responses in the React client using the `useChat` hook from `ai/react` for full streaming UX.

## Pair With Repo Patterns
- **RAG Projects:** Use the SDK’s `tool` support to call retrieval endpoints built from `05-projects/rag-on-supabase.md`.
- **Agentic Swarms:** Map tool calls to orchestrations described in `agentic-swarms/README.md` and log hand-offs via `15-workflows/peer-review.md`.
- **Governance:** Pipe model + prompt metadata into `07-evaluation/metrics.md` and `16-collaboration/escalation-guide.md` for traceability.

## OpenRouter & Local Models
- Add an adapter (e.g. `@openrouter/ai-sdk`) and set `OPENROUTER_API_KEY` in `.env.local`.
- For local models (Open WebUI, Big-AGI), point the SDK’s fetcher to your local endpoint:
  ```typescript
  import { createOpenAI } from '@ai-sdk/openai';
  export const localLLM = createOpenAI({
    name: 'open-webui',
    apiKey: process.env.OPENWEBUI_API_KEY,
    baseURL: process.env.OPENWEBUI_URL ?? 'http://localhost:3001/v1',
  });
  ```
- Document the setup in [`dashboard/AGENT.md`](../dashboard/AGENT.md) so teammates can replicate your environment.

## Observability Hooks
- Wrap `streamText` with Langfuse logging (see `05-projects/evals-langfuse.md`) or add custom spans to track latency and cost.
- Use the dashboards in Langfuse to validate evals from `07-evaluation/eval-harness.md`.

## Deployment Checklist
- Secrets stored via Vercel environment variables or your secrets manager.
- Feature flags (`ENABLE_AI_ASSISTANT`, `ENABLE_PLAYGROUND`) toggled per environment in `.env.local`.
- Regression suite staged via `npm run lint && npm run test` (add tests as your flows mature).

## Next Steps
- Extend the SDK usage to power the dashboard Playground and Builder modules.
- Pair with `scripts/capture-screenshots.mjs` to document AI flows for stakeholder readouts.
- Share learnings back into `03-awesome/` or `09-articles/` so the community benefits.
