# Arc Extension User Flows

## Flow 1 – Get Started with Arc Command Center
1. Install rc-core.vsix.
2. Click Arc icon in sidebar → Command Center opens.
3. Click Open Dashboard → Launches Academy dashboard (web).
4. Click Sync Use Cases → Sends payload to dashboard API (falls back to local cache).
5. Click Generate Proposal → Prompts for template, opens Markdown doc.
6. Optional: type message in chat → Arc responds (wire to agent later).

## Flow 2 – Explore Kilo Modes
1. Open Arc sidebar.
2. Switch to Kilo Agent Modes view.
3. Select a mode → Panel opens with role instructions.
4. Click Run in Arc Kilo Suite (future command) → executes agent plan via rc-kilo-suite.
5. Review output, sync updates back to dashboard.

## Flow 3 – Run Arc Kilo Suite Automation (Target)
1. Install rc-kilo-suite.vsix (Arc build of Kilo).
2. In Command Center, choose "Architect Workspace" quick action.
3. Arc calls rcKiloSuite.startTask with context (workspace metadata, template, instructions).
4. Agent executes tasks (create files, run tests) with guardrails.
5. Results appear in chat + mode detail view; user can accept or retry steps.
6. Arc LOG: store run summary, proposals, telemetry.

## Flow 4 – Quick Autonomy via Arc Cline MVP (Future)
1. Install rc-cline-mvp.vsix.
2. From Command Center, choose "Quick Agent".
3. Arc opens Cline panel pre-populated with templates.
4. User supplies prompt → Cline plan + executes minimal tasks.
5. Output surfaces in Command Center chat.

## Flow 5 – Governance & Telemetry
1. Sync use cases → Dashboard captures entries with rcStatus.
2. Run agent → telemetry event to Langfuse: { sessionId, command, duration }.
3. Governance lead filters flows by status, sees outcomes, can export to PDF.

## Flow 6 – Proposal Lifecycle
1. Generate proposal from template.
2. Edit content in VS Code.
3. Command Arc: Publish Proposal (future) → push to dashboard + send to stakeholder.
4. Dashboard tracks acceptance and follow-up tasks.

## Flow 7 – Namespace Isolation
1. User already has marketplace Kilo installed.
2. Arc Kilo Suite registers under rcKiloSuite.*.
3. No duplicate contributions → both extensions can coexist.
