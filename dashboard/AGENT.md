# Dashboard Agent Guide

This dashboard consumes the repo's agent workflow. For detailed SDLC flow, read `/AGENT.md` and `process/pattern-delivery-sdlc.xml`.

## Quick Setup
- Copy `.env.local.example` to `.env.local`.
- Set `AI_ASSISTANT_MODEL` and provider-specific keys.
- Run `npm install`, `npm run dev`.

## Instructions for Assistants
1. Always fetch context from repo patterns & governance library.
2. Use persona dashboards (`/docs/experience.html`) to tailor responses.
3. Log important actions and update relevant project docs.
4. Trigger evaluation jobs when workflows complete (`eval-automation`, `creator-evals`).
5. Provide governance notes referencing checklists.

Refer to `/AGENT.md` for full process.
