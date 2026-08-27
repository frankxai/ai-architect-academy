# Adopt the AI Architect plugin

Humans and agents use the same contract. The plugin writes into **your** repo at
`docs/architecture/`. It is not a hosted architect service.

Source: https://github.com/frankxai/ai-architect  
Process: `team/PROCESS.md` in that repo.

## What you install

| path | who | first move |
|---|---|---|
| Claude Code plugin | interactive humans | `/architect-init` then `/architect` |
| skills.sh pack `ai-architect` | any skill host | copy SOP + WORKFLOW, follow SOP |
| Conductor CLI | Codex and other CLIs | `node scripts/architect-conductor.mjs --root . card` |
| MCP stdio `mcp/server.mjs` | Hermes and other MCP hosts | `architect_init` then `architect_card` |
| `AGENTS.md` block | Cursor / Copilot / Windsurf | `install-cross-harness.mjs --agents-md` |

Keys stay with the operator. Do not stand up a public MCP host.

## Lifecycle (nine gates)

frame → discover → flow → decide → cost → secure → prove → operate → verify

`architecture.json` is the only resumable state. A FAIL earlier in the table
blocks later `--stage` jumps.

## Overlays (not extra gates)

- `/architect-red` — attack evidence, trust, cost, human-gate bypass
- `/architect-blue` — map each finding to a fail-closed control
- `/architect-cloud` — compare clouds and harnesses with evidence, no provisioning

Maker and checker are different models. Verify is a fresh context.

## Human gates (never an agent)

publish · external_send · spend · dns · credentials · destructive · legal_ip · brand_identity

If a lab prompt would cross one of these, stop and name the gate.

## Lab (30 minutes)

1. Clone or submodule `frankxai/ai-architect` next to a throwaway git repo.
2. `node scripts/architect-conductor.mjs --root <throwaway> init`
3. `node scripts/architect-conductor.mjs --root <throwaway> card`
4. Confirm the card's `write_paths` stay under `docs/architecture/`.
5. Do **not** run `/architect-cloud` against a live account.

Done when: SOP.md and WORKFLOW.md exist once, the card names `frame`, and no
cloud resource was created.
