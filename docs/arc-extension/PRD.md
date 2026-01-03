# Arc Extension Product Requirements Document (PRD)

## Vision
Deliver an AI architect workspace in VS Code that unifies:
1. **Command Center** – Arc-specific quick actions, dashboards, proposals.
2. **Kilo Suite** – Workspace automation, multi-step coding agent, mode governance.
3. **Cline MVP** – Lightweight autonomous agent flows.
4. **Academy Dashboard** – Shared telemetry, use-case catalog, proposal templates.

## Success Metrics
- ≥70% of pilot architects adopt Arc as their primary VS Code extension within 2 weeks.
- Generate ≥5 demo-quality proposals per week directly from the extension.
- Mean time from idea → runnable agent flow < 10 minutes.
- Zero critical errors in runtime (no duplicate registration, clean profile boot).

## Personas
- **Builder Architect**: Needs fast environment setup, agent orchestration, code generation.
- **Governance Lead**: Verifies guardrails, tracks use-case compliance and telemetry.
- **Professor Mentor**: Reviews learner progress, provides curated instructions/modes.

## Key Requirements
1. **Arc Core** (already partially delivered)
   - Sidebar command center with quick actions, proposals, dashboard launcher.
   - Embedded chat surface ready to be wired to agents.
   - Local use-case sync (later via dashboard API).

2. **Arc Kilo Suite Integration**
   - Namespace isolation (rcKiloSuite.*) so it can coexist with upstream Kilo.
   - Mode explorer surfaces curated .kilocodemodes plus Academy overlays.
   - Chat commands pipeline into Kilo’s agent runtime (generate, explain, refactor, TODO).
   - Guardrail toggles (allowed/denied commands, execution timeout) shipped with defaults.
   - One-click run of Academy workflows (RAG scaffold, evaluation harness, governance checks).

3. **Arc Cline MVP Integration**
   - Standalone “Express Agent” command palette with Cline’s conversation/plan view.
   - Optionally run in parallel with Kilo for quick experiments.

4. **Dashboard Connectivity**
   - /api/usecases endpoint to persist sync from Arc.
   - Telemetry hooks (Langfuse tags, proposal logs) per session.

5. **Packaging**
   - rc-core.vsix: core sidebar + read-only integrations.
   - rc-kilo-suite.vsix: full Kilo automation.
   - rc-cline-mvp.vsix: autonomous express mode.
   - Optional meta bundle once stable.

## Constraints & Risks
- Kilo’s codebase expects Node 20.19.2 and a pnpm/turbo toolchain.
- Large extension size (>30 MB) → require bundling/ignores to pass marketplace limits.
- Need to update license attribution when forking Kilo/Cline code.
- Governance toggles must default to safe values.

## Out of Scope (for MVP)
- Multi-user collaboration inside VS Code (handled via dashboard later).
- Full dashboard embedding inside VS Code (link out for now).
- Non-VS Code IDE integrations.
