# Arc x Kilo Fork

## Vision
Create a full-spectrum Arc IDE by building on Kilo's workspace automation, giving architects pre-built flows for pattern execution, evaluation, and storytelling.

## Latest Status
- `arc-0.0.4.vsix` now surfaces **Kilo Agent Modes** in the Arc sidebar using data from `arc-kilocode/.kilocodemodes`.
- Selecting a mode opens a detailed webview with role guidance and instructions.
- Quick actions link to dashboard sync and proposal generation so architects can act on each mode.

## Milestones
1. **Fork & Setup**
   - Forked repo: https://github.com/frankxai/arc-kilocode (tracked as submodule here).
   - Sync monorepo layout: cloned under `integrations/kilo-fork/arc-kilocode/`.
   - Mapped initial mode data into Arc (`data/kilo-modes.json`).
2. **Arc Integration (In Progress)**
   - Replace default workflows with Academy-specific starters (RAG, agents, governance).
   - Connect Kilo actions to Arc chat so modes trigger runnable tasks.
   - Implement one-click proposal export using Arc templates (baseline command exists).
3. **Launch Prep (Pending)**
   - Harden permissions (disable destructive shell commands by default, whitelist allowed tasks).
   - Bundle Arc analytics and feedback capture.
   - Package as `arc-kilo-suite.vsix` once automation hooks are live.

## Key Workstreams
- **Mode Data Sync:** continue mapping Kilo `.kilocodemodes` updates into Arc.
- **UX Customisation:** update React components (from Kilo webview) to reflect Arc branding.
- **Agent Wiring:** route chat messages into arc-kilocode agent runtime.

## Open Questions
- How much of Kilo's container orchestration do we retain? (Decision pending capacity assessment.)
- Should Arc provide a toggle between "Kilo mode" and "Cline mode" inside the same extension vs. separate VSIX builds?
- Licensing compatibility check (Kilo license vs Arc MIT).
