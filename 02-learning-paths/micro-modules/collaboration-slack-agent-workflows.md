# Micro-Module: Slack Agent Collaboration Playbook

**Category:** Collaboration & Rituals  \
**Duration:** 45 minutes  \
**Persona Fit:** Builders, Creators, Operators  \
**Pre-reads:** [Storytelling & Adoption Modules](storytelling-adoption-metrics.md), [Executive Narrative Builder](storytelling-exec-brief.md)

---

## Why this matters
Slack is the control plane for the AI Architect Academy. Teams prototype ideas, orchestrate agent workflows, and collect evidence directly in channel threads, canvases, and lists. This module shows how to partner with the AI Architect bot in Slack to go from fuzzy intent to production-ready assets through conversational design and structured prompt vaults.

---

## Learning outcomes
By the end of this micro-module you will be able to:

1. Frame a build request for the AI Architect bot in Slack using personas, context packs, and desired artefacts.
2. Design conversation flows that move work forward across channels, Slack Canvas, and Slack Lists without losing accountability.
3. Capture reusable prompt vaults that keep tone, governance, and delivery quality consistent across the team.
4. Operationalise review loops so humans stay in the decision chair while agents automate the heavy lifting.

---

## Module flow

| Phase | Time | Focus | What you ship |
| --- | --- | --- | --- |
| Kickoff | 5 min | Align on the problem and success criteria using a lightweight canvas | Canvas card capturing stakeholders, KPIs, constraints |
| Conversation Architecture | 10 min | Map channel + DM touchpoints, agent triggers, and approval points | Swimlane sketch in Canvas with agent + human turns |
| Guided Build | 15 min | Drive a live build with the AI Architect bot via thread prompts and Canvas embeds | Initial artefact (spec, flowchart, prompt pack draft) |
| Review & Lists | 10 min | Convert actions into Slack Lists, assign owners, and wire guardrails | Action list with owners, due dates, and linked artefacts |
| Prompt Vault & Retrospective | 5 min | Capture reusable prompts and reflection notes | Prompt vault entry shared in `#ai-architect-vault` |

---

## Step-by-step guide

### 1. Prime the bot in-channel
- Pin a `Build Brief` Canvas to the channel with:
  - Business goal + problem statement
  - Persona focus (Builder, Leader, Creator, Operator)
  - Artefacts required (e.g., evaluation harness, adoption narrative)
- @mention the AI Architect bot with a kickoff message:
  ```
  @AI-Architect We're launching a customer onboarding copilot for the Creator persona. Use the build brief canvas, follow the Compliance guardrail pack, and propose a three-step delivery plan before writing docs.
  ```
- Save the kickoff message to the channel bookmarks so new teammates can replay the context instantly.

### 2. Orchestrate the conversation flow
- **Thread discipline:** keep each deliverable inside a dedicated thread. Summarise decisions using `/summary` and let the bot provide status snapshots.
- **Agent loops:** alternate between human checkpoints and bot executions. Example loop:
  1. Human posts intent + constraints → bot drafts options.
  2. Human selects path, adds nuance → bot updates artefact.
  3. Human requests QA → bot runs evaluation pack and posts results.
- **Cross-channel handoffs:** when work shifts (e.g., from `#design` to `#delivery`), drop a Canvas embed and use `/handoff` template so the receiving team gets context + next steps.

### 3. Use Canvas as the shared brain
- Structure canvases with sections for Context, Decisions, Prompts, and Evidence.
- Enable **Canvas <→ thread sync**: paste Canvas block links back into the conversation so the bot can reference specific sections.
- Host architecture diagrams, policy checklists, and runbooks inside Canvas. Ask the bot to refresh them using `/canvas update` prompts.

### 4. Manage execution with Slack Lists
- Convert agreed actions into a List directly from the thread using `More actions → Add to list`.
- Add fields for `Owner`, `Due date`, `Agent assist? (Y/N)`, and `Evidence link`.
- Request the bot to monitor progress: `@AI-Architect watch list #Launch-Checklist and remind owners 24h before due dates.`
- Use list views (`by Owner`, `by Status`) during stand-ups; capture decisions back into the Canvas log.

### 5. Build and share prompt vaults
- After a successful loop, extract the high-signal prompts:
  - Trigger prompt (how you ask the bot to start)
  - Iteration prompts (how you nudge for revisions)
  - QA prompts (how you request validation or tests)
- Store them in the Prompt Vault (see [`prompt-packs/slack-collaboration-vault.md`](../../prompt-packs/slack-collaboration-vault.md)). Tag each entry with scenario, persona, and artefact.
- Encourage remixing: ask the bot `Generate a variant of the Creator Campaign Brief prompt for the Operator persona` and append the result to the vault with attribution.

### 6. Close the loop with retrospectives
- Use `/canvas retrospective` to capture what worked, blockers, and prompts to refine.
- Update the Prompt Vault with lessons learned (e.g., "Add compliance reviewer step before final publish").
- Announce the shipped artefact with a short summary thread linking to Canvas, Lists, and vault entry.

---

## Deliverables checklist
- ✅ Canvas build brief with KPIs, personas, guardrails.
- ✅ Conversation flow diagram (image or text) embedded in Canvas.
- ✅ Slack List with owners, due dates, and evidence links.
- ✅ Prompt Vault entry created or updated.
- ✅ Retrospective note posted with follow-up actions.

---

## Metrics to track
- Time from kickoff message to first artefact draft.
- Number of human checkpoints vs. automated steps.
- Prompt reuse rate (entries pulled from the vault per sprint).
- Completion rate of Slack List items by due date.

---

## Tooling & integrations
- Slack Canvas + Lists (Enterprise Grid features recommended).
- AI Architect bot with access to Canvas, Lists, and shared file store.
- Optional: Zapier or Workato to sync Slack Lists to Jira/Asana, Loom for async demos.

---

## Next modules
- [Creator Content Orchestration Sprint](creator-content-orchestration.md) – extend prompts into omnichannel publishing.
- [LangGraph Planner Loop](agents-langgraph-planner.md) – design deeper agent planning logic.
- [Storytelling Exec Brief](storytelling-exec-brief.md) – package outcomes for leadership updates.

