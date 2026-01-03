# Arc Implementation Plan
## Overview
This plan outlines the phased approach to get Arc Core fully operational, then integrate Arc Cline MVP, and finally Arc Kilo Suite as importable VS Code extensions. The plan prioritizes verification, minimal fixes, and iterative building.

## Overall Phased Plan
Assumes working from `c:\Users\Frank\AI Architect Academy\Arc`. Total estimated effort: 4-6 hours.

### Phase 1: Get Arc Core Fully Working (1-2 hours)
Arc Core (`arc-core.vsix`) is the baseline VS Code extension with sidebar for chat, Kilo modes, and Academy progress.

1. **Verify Current Build & Install**:
   - Run `npm install` in `Arc/` to ensure dependencies (e.g., webpack, ts-loader) are up-to-date.
   - Build with `npm run compile` (dev) or `npm run vscode:prepublish` (prod).
   - Package VSIX: `npm run package` → generates `arc-0.0.5.vsix`.
   - Install in VS Code: Extensions → ... → Install from VSIX.
   - Test: Open Arc sidebar, trigger commands like `Arc: Open Dashboard`, `Arc: Sync Use Cases`, and `Arc: Generate Proposal`.

2. **Fix Blockers**:
   - If build fails, patch TypeScript errors in `src/extension.ts`.
   - Test Academy integration; mock API if needed.
   - Update `package.json` if needed.

3. **Success Criteria**: Extension installs, sidebar works, 3 core commands functional.

### Phase 2: Integrate & Build Arc Cline MVP (1-2 hours)
Reuses Cline fork for autonomous agent panel in Arc's chat. Goal: `arc-cline-mvp.vsix`.

1. **Submodule Setup & Alignment**:
   - Update submodule: `git submodule update --init --recursive` in `Arc/`.
   - Align configs in `package.json`.

2. **Wiring Integration**:
   - Hook Cline into `extension.ts` chat provider.
   - Update webview to load Cline UI.
   - Implement outstanding tasks (shared interfaces, storage replacement).

3. **Build & Test**:
   - Add build script, package VSIX.
   - Test chat integration.

4. **Success Criteria**: Chat uses Cline agents, Arc commands route through, VSIX installs.

### Phase 3: Integrate & Build Arc Kilo Suite (1-2 hours)
Builds on KiloCode fork for automation. Goal: `arc-kilo-suite.vsix`.

1. **Submodule Setup & Mode Sync**:
   - Update submodule.
   - Sync modes from `arc-kilocode/.kilocodemodes`.

2. **Wiring Integration**:
   - Extend `KiloModesProvider` to route to Kilo runtime.
   - Customize UX with Arc branding.

3. **Build & Test**:
   - Build with pnpm/Turbo, package VSIX.
   - Test mode workflows.

4. **Success Criteria**: Kilo modes trigger automation, integrates with chat/Core.

## Risks & Mitigations
- Update submodules if outdated.
- Use `execute_command` for builds.
- Test in dev mode first.
