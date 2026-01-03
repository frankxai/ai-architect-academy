# Arc x Cline MVP

## End Goal
Deliver a slim Arc experience by reusing Cline's autonomous agent panel to orchestrate Academy tasks inside VS Code within 2 sprints.

## Sprint Breakdown
- **Sprint A (Week 1):**
  - Forked repo: https://github.com/frankxai/arc-cline (now tracked as submodule).
  - Strip heavy onboarding flows; keep panel and command palette.
  - Replace storage layer with Arc `.aia/config.json` + `/api/usecases` calls.
- **Sprint B (Week 2):**
  - Integrate Arc baseline commands (open dashboard, sync use cases, proposal generate).
  - Instrument telemetry (Langfuse endpoints) and add Arc branding.
  - Package internal build `arc-cline-mvp.vsix` for testing.

## Technical Hooks
- Command routing through `src/commands/RunTask.ts` mapped to Arc actions.
- Webview messaging piped into Arc dashboard via `fetch('/api/usecases')`.
- Auth handled via VS Code secret storage (`arc.dashboardToken`, to be added).

## Outstanding Tasks
- [ ] Align Cline config with Arc settings schema (`arc.*`).
- [ ] Define TypeScript interfaces shared between Arc and dashboard for use cases.
- [ ] Draft regression checklist (agent actions, proposal generation, dashboard sync).
