# Arc by AI Architect Academy

**Arc** is the unified AI architect workspace extension for VS Code, bringing together multi-agent orchestration, Academy dashboard integration, and specialized coding modes into one powerful platform.

## 🌟 Features

### Command Center
- **Quick Actions**: Open dashboard, sync use cases, generate proposals
- **Embedded Chat**: Preview chat interface ready for agent integration
- **Proposal Generation**: Create structured proposals from Academy templates

### Kilo Agent Modes
- **AI Architecture Specialist**: System design and architectural patterns
- **RAG Engineer**: Retrieval-augmented generation systems
- **Governance Architect**: EU AI Act compliance and risk management
- **MLOps Engineer**: Model deployment and lifecycle management
- **Test Specialist**: Jest testing and TDD practices
- **Translate**: Localization and internationalization

### Academy Integration
- **Real-time Progress Tracking**: Sync your VS Code work with Academy dashboard
- **Knowledge Point Linking**: Connect your code to certification tracks
- **Certification Readiness**: Track progress across AI Core, GenAI, Data Science, and Industry tracks
- **Learning Analytics**: View insights on your skill development

## 🚀 Quick Start

1. Install the Arc extension from VS Code Marketplace
2. Open the Arc sidebar (click the Arc icon in the activity bar)
3. Configure your Academy dashboard URL in settings
4. Start coding and track your progress automatically!

## ⚙️ Configuration

```json
{
  "arc.dashboardUrl": "http://localhost:3000",
  "arc.templatesPath": "../",
  "arc.useCaseCache": ".aia/usecases.json",
  "arc.academyAPI": {
    "baseUrl": "http://localhost:3000/api",
    "timeout": 30000,
    "retryAttempts": 3
  },
  "arc.governance": {
    "enableSafetyChecks": true,
    "requireHumanOversight": true,
    "auditTrail": true
  }
}
```

## 📚 Commands

- `Arc: Open Dashboard` - Launch Academy dashboard in browser
- `Arc: Open Command Center` - Show Arc chat interface
- `Arc: Sync Use Cases` - Sync project use cases with dashboard
- `Arc: Generate Proposal` - Create proposal from template
- `Arc: View Academy Progress` - View your certification progress
- `Arc: Link to Knowledge Points` - Connect current work to knowledge points
- `Arc: Refresh Kilo Modes` - Reload agent modes
- `Arc Kilo Suite: Start Academy Task` - Launch automated Academy workflow

## 🏗️ Architecture

Arc is built on three integrated layers:

1. **Arc Core**: Command center, dashboard sync, and Academy integration
2. **Arc Kilo Suite**: Autonomous agent workflows and mode governance (submodule: arc-kilocode)
3. **Arc Cline MVP**: Express agent for quick experiments (submodule: arc-cline)

## Fork Targets

Both forks are tracked as Git submodules:
- Arc/integrations/cline-mvp/arc-cline → https://github.com/frankxai/arc-cline
- Arc/integrations/kilo-fork/arc-kilocode → https://github.com/frankxai/arc-kilocode

## Build & Install

1. `npm install`
2. `npm run compile` (development) or `npm run vscode:prepublish` (production)
3. `npm run package` (produces `arc-0.0.5.vsix`)
4. Install in VS Code via Extensions → … → Install from VSIX

## Planned VSIX Bundles
- `arc-core.vsix`: command center, chat preview, Kilo mode explorer (current package)
- `arc-cline-mvp.vsix`: ships once Cline integration is wired into the chat panel
- `arc-kilo-suite.vsix`: full Kilo workflow automation leveraging arc-kilocode

## 🎯 Roadmap

### Phase 1: Fork Integration (✅ Complete)
- [x] Kilo Code integration with Academy modes
- [x] Cline MVP integration
- [x] Basic orchestration layer

### Phase 2: Multi-Agent Platform (In Progress)
- [ ] Claude Code integration
- [ ] Gemini and Codex support
- [ ] Intelligent task assignment
- [ ] Session management with git worktrees

### Phase 3: Advanced Features
- [ ] ML-powered agent selection
- [ ] Performance analytics
- [ ] Professor mentoring integration
- [ ] NFT credential generation

## 🤝 Contributing

Arc is part of the AI Architect Academy ecosystem. Contributions welcome!

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- [AI Architect Academy](https://github.com/frankxai/ai-architect-academy)
- [Documentation](https://github.com/frankxai/ai-architect-academy/tree/main/docs)
- [Issue Tracker](https://github.com/frankxai/ai-architect-academy/issues)

---

Built with ❤️ by the AI Architect Academy Team
