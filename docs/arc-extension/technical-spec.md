# Arc Extension Technical Specification

## Architecture Overview
`
VS Code
├─ Arc Core Extension (arc-core)
│  ├─ Command Center webview & chat shell
│  ├─ Kilo Mode explorer (read-only JSON)
│  ├─ Commands → sync, proposal, dashboard launch
│  └─ Events → telemetry, dashboard API
├─ Arc Kilo Suite Extension (arc-kilo-suite)
│  ├─ Namespaced commands & settings (arcKiloSuite.*)
│  ├─ Agent pipeline wrappers → reuse Kilo runtime
│  ├─ Actions exposed to Arc Core (IPC / VS Code commands)
│  └─ Webview UI themed for Arc (Tailwind, tokens)
├─ Arc Cline MVP Extension (arc-cline-mvp)
│  ├─ Lightweight agent UI + plan view
│  ├─ Config mapped to Arc settings
│  └─ Optional integration with Command Center
└─ Dashboard API
   ├─ /api/usecases → Persist sync payload
   ├─ /api/telemetry → Capture agent events
   └─ Shared analytics (Langfuse, Supabase)
`

## Module Breakdown
| Module | Location | Responsibility | Integration |
| --- | --- | --- | --- |
| Arc Command Center | Arc/src/extension.ts | Webview chat shell, quick actions, mode explorer | Invokes Arc Kilo Suite & Cline commands; hits dashboard API |
| Arc Kilo Suite Adapter | Arc/integrations/kilo-fork/arc-kilocode/src | Namespaced fork with Arc defaults, safe command list | Expose verbs like rcKiloSuite.startTask, rcKiloSuite.explainCode |
| Kilo Mode Explorer | Arc/data/kilo-modes.json + tree provider | Surfaces curated .kilocodemodes plus Academy metadata | Rebuild on sync; update tree view |
| Dashboard Client | New module (Arc/src/dashboard.ts) | REST calls to Academy backend | Sync use-cases, record proposals |
| Telemetry | (Shared) Arc/src/telemetry.ts | Wrap Langfuse/analytics calls | Record agent runs, command usage |
| Cline Adapter | Arc/integrations/cline-mvp/arc-cline | Similar rename + Arc settings mappings | Provide quick-run agent flow |

## APIs & Commands
- rc.openDashboard: opens configured dashboard URL.
- rc.syncUseCases: pushes data to /api/usecases; updates local cache.
- rc.generateProposal: scaffolds markdown from templates.
- rc.showPanel: reveals command center.
- rc.kiloModes.refresh: reloads modes from JSON/remote.
- rc.kiloModes.open: open guidance panel.
- rcKiloSuite.*: new set (startTask, runTemplate, openTodoList, etc.).
- rcClineMvp.*: plan / execute functions after integration.

## Data Contracts
### Use Case Sync Payload
`json
{
  "syncedAt": "2025-09-22T23:10:00Z",
  "source": "http://localhost:3000",
  "items": [
    {
      "title": "RAG Onboarding",
      "path": "05-projects/rag-onboarding.md",
      "tags": ["rag", "starter"],
      "arcStatus": "draft"
    }
  ],
  "client": {
    "userId": "architect-123",
    "workspace": "acme-ai"
  }
}
`

### Proposal artifact structure
`markdown
---
title: Arc Proposal
client: <Name>
project: <Project>
mode: <KiloModeSlug>
created_at: <timestamp>
---
# Problem Statement
...
# Proposed Architecture
...
# Agent Workflow
...
# Next Steps
...
`

## Security & Governance
- Commands must validate paths and block destructive actions unless explicitly enabled.
- Store secrets via VS Code SecretStorage (rc.dashboardToken).
- Provide telemetry opt-out setting.
- Document license differences (Kilo MIT + Arc MIT overlay).

## Testing Strategy
- **Unit tests**: Arc command handlers, dashboard client (mocked HTTP).
- **Integration tests**: Launch VS Code with arc-core + arc-kilo-suite; run scenario from template.
- **E2E**: Use @roo-code/vscode-e2e harness to simulate tasks.
- **Manual smoke**: Verify no duplicate registration when both Arc and upstream Kilo are installed.

## Deployment
- Use GitHub Actions to build each VSIX on tag (rc-core, rc-kilo-suite, rc-cline-mvp).
- Optional: publish on Marketplace (requires bundling improvements).
