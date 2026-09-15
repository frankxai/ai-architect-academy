# Repository Instructions

This repo is part of the FrankX / Starlight / Arcanea agent estate. Brand: **AI-Architect**.

## Classification

- Repo: ai-architect-academy
- Class: product (public surface: aiarchitectacademy.com)
- Default health command: `cd site && pnpm test && pnpm build`
- Remote: https://github.com/frankxai/ai-architect-academy (canonical; the `AI-Architect-Academy`
  org copy is a 2025 snapshot, see `OWNERSHIP-DECISION.md`)

## What This Repo Is

Two things, kept apart:

1. **The open material** — patterns (`01-design-patterns/`), labs (`labs/`), learning paths,
   governance, evaluation, and a Claude Code instructor (`CLAUDE.md`, `.claude/commands/`) that
   teaches it Socratically inside the terminal.
2. **The site** (`site/`, Next.js 16, pnpm) — the waitlist-first front door for the cohort course,
   plus the free ADR gift and an `llms.txt` for agents. Vercel project `aiarchitectacademy`,
   Root Directory `site`.

`redirect-bridge/` is the retired July 2026 redirect to Starlight Intelligence Academy. Frank
ruled on 2026-09-11 that the Academy is its own brand; the bridge is deleted once the cutover is
verified (`docs/BUILD-BRIEFS.md`, B1). Do not link to Starlight Intelligence Academy from here.

## Where each claim comes from

`CONTENT-CONTRACT.md` is binding. In short: structure from `site/lib/academy-graph/`, counts from
`site/scripts/sync-curriculum.mjs`, commercial state from `starlight/graph/products.graph.json`.
The ~30 top-level strategy markdown files (`V2_*`, `V3_*`, `PLATFORM_*`, `STATUS_*`) are history,
never a source for a public claim.

## Sibling repos (link, never copy)

| Repo | Licence | Relationship |
|---|---|---|
| `frankxai/ai-architect` | Apache-2.0 | the nine-stage `/architect` agent team the site tells people to install |
| `frankxai/skills` | MIT | architect skills pack on skills.sh |
| `frankxai/ai-coe` | — | the operating model for the organisation around the team |

This repo is FSL-1.1-ALv2 with curriculum prose reserved (`LICENSING.md`). Do not mix licences
by copying files between these repos.

## Agent Rules

- Read this file, `CONTENT-CONTRACT.md` and `docs/BUILD-BRIEFS.md` before making changes.
- One agent, one branch `agent/<harness>/<scope>`. Preserve other agents' dirty files.
- No price, date, seat count or countdown on the site while the products row is `UNGATED`.
- No employer, vendor, customer or internal detail on any public surface. The sync script's
  `EXCLUDE` filter covers titles and paths only, not file bodies.
- Human gates, always Frank's: DNS, Vercel settings, env vars, publishing, spend, credentials,
  anything destructive.

## Handoff

Summarize changed files, the health command's output, risks, and any follow-up needed.

## Design Taste Kernel

For any site, app, landing page, dashboard, visual identity, brand, motion, media, social, or frontend task, apply the shared Design Taste Kernel before handoff:

- C:\Users\frank\starlight\repos\DESIGN_TASTE.md
- C:\Users\frank\starlight\repos\WEB_EXPERIENCE_STANDARD.md
- C:\Users\frank\starlight\repos\MOTION_TASTE_RUBRIC.md
- C:\Users\frank\starlight\repos\MULTI_AGENT_DESIGN_COUNCIL.md
- C:\Users\frank\starlight\repos\VISUAL_QA_GATE.md

When motion, scroll, generated media, GIF/video, or premium polish matters, route through the Motion Design Studio plugin/skills and verify the result visually.


<!-- PRODUCT-OUTCOME-CONTRACT:START -->
## Product outcome acceptance

Before substantial product work, name the intended user's job, current local product decision, owning issue, exact base revision, relevant skills, budget, acceptance and stop condition. Reuse an existing implementation candidate before creating a competing one.

Use the local product, brand, canon, licensing and release rules above. Portfolio work also resolves reviewed `frankxai/agentic-ops` strategy, Registry and quality at one recorded commit through the authorized connection; do not copy private records into this repository or treat proposal branches as accepted policy. An inaccessible source is an explicit limitation, never permission to invent it.

Review availability, function, customer usefulness, design/editorial quality and economics separately. Unsupported claims, lost work, broken authorization or missing required evidence cannot be offset by style scores. Apply only relevant gates and explain non-applicability.

For production-intent work, bind checks and independent review to the exact candidate revision; bind the stable domain to the accepted deployment/source revision. Record recovery/export behavior, failures, all attempts and human intervention. A preview, merge, or READY deployment does not establish customer success.

At handoff distinguish policy proposed, merged, loaded in this agent session and verified in execution. Include the owning issue, policy/source SHA, artifact, verifier, highest evidenced environment and next action. Dates and goals remain targets until measured.
<!-- PRODUCT-OUTCOME-CONTRACT:END -->

Current quality implementation: https://github.com/frankxai/ai-architect-academy/issues/35. Reconcile historical instructions against accepted current decisions before changing product scope.
