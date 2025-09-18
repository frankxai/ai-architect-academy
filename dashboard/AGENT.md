# Agent Integration Guide

Connect the AI Architect Dashboard to coding copilots, hosted LLMs, or local models. Use this playbook to align assistant behaviour with the main repo’s guardrails.

## 1. Choose Your Provider
| Provider | Why use it | Minimum setup |
| --- | --- | --- |
| **OpenAI / Anthropic / Groq** | Best default experience, broad tooling support | API key in `.env.local` |
| **OpenRouter** | Single key for multiple foundation models | `OPENROUTER_API_KEY` + optional model route |
| **Open WebUI / Big-AGI** | Run local models or self-hosted assistants | Local endpoint (HTTP) + optional auth |
| **Custom Agent (coding co-pilot)** | Plug in scripts like Frank's coding agent for repo-aware automation | REST/WS endpoint with JSON payloads |

## 2. Configure `.env.local`
```env
# Primary assistant
AI_ASSISTANT_MODEL=openai:gpt-4o-mini
AI_ASSISTANT_TEMPERATURE=0.6

# Optional: OpenRouter
OPENROUTER_API_KEY=
AI_ASSISTANT_MODEL=openrouter:meta-llama/llama-3.1-70b-instruct
OPENROUTER_SITE_URL=https://dash.yourdomain.com
OPENROUTER_APP_NAME=ai-architect-dashboard

# Optional: Local model (Open WebUI / Big-AGI)
OPENWEBUI_URL=http://localhost:3001/v1
OPENWEBUI_API_KEY=
```
Set `AI_ASSISTANT_MODEL` to match the provider adapter you load in `src/lib/ai/providers.ts`.

## 3. Update Provider Adapters
Edit `dashboard/src/lib/ai/providers.ts` (or create a new file) and register adapters:
```typescript
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

type RunParams = { message: string; context?: unknown };

enum FallbackModel {
  Default = 'gpt-4o-mini'
}

export const providers = {
  openai: createOpenAI({ apiKey: process.env.OPENAI_API_KEY! }),
  openrouter: createOpenAI({
    apiKey: process.env.OPENROUTER_API_KEY!,
    baseURL: 'https://openrouter.ai/api/v1',
  }),
  openwebui: createOpenAI({
    name: 'open-webui',
    apiKey: process.env.OPENWEBUI_API_KEY,
    baseURL: process.env.OPENWEBUI_URL,
  }),
};

export async function runAssistant(model: string, params: RunParams) {
  const [provider, modelId] = model.split(':');
  const selected = providers[provider as keyof typeof providers];
  if (!selected) {
    throw new Error(`Unknown provider: ${provider}`);
  }

  return streamText({
    model: selected(modelId ?? FallbackModel.Default),
    ...params,
  });
}
```

## 4. Wire Into Routes
Update `src/app/api/ai/route.ts` to consume `runAssistant` and log activity:
```typescript
import { NextResponse } from 'next/server';
import { runAssistant } from '@/lib/ai/providers';

export const runtime = 'edge';

export async function POST(req: Request) {
  const body = await req.json();
  const { message, context, model = process.env.AI_ASSISTANT_MODEL ?? 'openai:gpt-4o-mini' } = body;

  const stream = await runAssistant(model, { message, context });
  return stream.toAIStreamResponse();
}
```

## 5. Connect Custom Coding Agents
If you run a separate coding agent (for example, Frank's repo-aware assistant):
1. Expose it via HTTP or WebSocket with a simple JSON contract (`prompt`, `repoHints`, `filesChanged`).
2. Add a provider entry in `providers.ts` that forwards payloads to the agent endpoint.
3. Map dashboard intents (e.g. "draft tests", "refactor module") to agent actions and stream responses back into the UI.
4. Log outcomes to [`15-workflows/retrospective-with-ai.md`](../15-workflows/retrospective-with-ai.md) so context lands in the main repo.

## 6. Observability & Governance
- Attach Langfuse spans before returning responses (see [`05-projects/evals-langfuse.md`](../05-projects/evals-langfuse.md)).
- Persist prompts/responses if you need full audit trails; align with [`08-governance/model-risk.md`](../08-governance/model-risk.md).
- Use the [Escalation Guide](../16-collaboration/escalation-guide.md) when incidents arise.

## 7. Sync With the Main Playbook
- Surface assistant output in repo docs (e.g. update the [Learning Logbook](../02-learning-paths/logbook.md)).
- Capture new prompts or workflows inside `prompt-packs/` so others can reuse them.
- Submit improvements to the dashboard via PRs referencing learning paths or governance goals.

**Need more context?** Review the [Vercel AI SDK integration guide](../06-toolchains/vercel-ai-sdk.md) for deeper examples and streaming patterns.
