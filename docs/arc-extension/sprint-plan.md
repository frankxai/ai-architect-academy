# Arc Extension Sprint Plan

## Sprint 0 – Foundations (2 days)
- Stabilise repo structure, document plan (PRD, spec, flows).
- Align Node version (use volta / nvm to pin 20.19.2 for Kilo).
- Ensure arc-core builds rc-0.0.4.vsix repeatably.
- Task: pnpm install baseline, update README instructions.

## Sprint 1 – Kilo Namespace & API (1 week)
- Refactor rc-kilo-suite fork:
  - Rename all commands/settings/view IDs to rcKiloSuite.*.
  - Update webview telemetry + brand.
  - Expose minimal command API (startTask, explainCode, eviewPR).
- Package rc-kilo-suite.vsix that coexists with upstream Kilo.
- Add integration tests (VS Code + extension).

## Sprint 2 – Arc ↔ Kilo Wiring (1 week)
- Modify Arc command center to call rcKiloSuite commands.
- Display streaming responses in chat view.
- Add quick action buttons to run key workflows (RAG scaffold, Governance checklist).
- Implement /api/usecases endpoint in dashboard + Arc client.
- Telemetry pipeline (Langfuse / custom) for agent runs.

## Sprint 3 – Cline MVP (4 days)
- Fork Cline → rc-cline-mvp (namespaced).
- Integrate minimal agent flow into Arc command center (toggle between Kilo and Cline).
- Package rc-cline-mvp.vsix.

## Sprint 4 – Hardening & Docs (4 days)
- Security review: command allow/deny lists, guardrails.
- Trim .vscodeignore / bundling for marketplace limits.
- Author documentation in docs/arc-extension/ (user guide, troubleshooting).
- Manual QA across Windows/macOS/Linux.

## Sprint 5 – Launch Prep (3 days)
- Prepare marketplace listings (assets, descriptions).
- Final telemetry hooks & opt-outs.
- Publish release notes, upgrade path from upstream Kilo/Cline.
- Launch internal pilot (Academy architects + mentors).
