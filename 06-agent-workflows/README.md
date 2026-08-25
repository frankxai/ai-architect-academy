# Agent Workflows

> **Build AI systems faster with coding agents.** We recommend Claude Code, but use whatever works for you.

---

## 🎯 Overview

This directory contains **step-by-step workflows** for building AI systems with coding agents.

**What's a workflow?**
- Architecture breakdown
- Specific prompts for the agent
- Expected code outputs
- Testing and deployment steps

**Who are these for?**
- AI Architects who want to build faster
- Teams learning to work with AI agents
- Anyone who wants structured guidance

---

## 🚀 Available Workflow

### [Claude SDK Agent Workflow](claude-code/claude-sdk-workflow.md)
- Build: Autonomous agent using the Claude Agent SDK — computer use, tool orchestration, MCP integration
- Time: 45-60 minutes
- Prerequisites: Python 3.10+, Anthropic API key

This is the only workflow currently in this directory. Workflows for other tools (Cursor, Copilot, manual) or other build targets (RAG chatbot, ReAct agent, multi-modal) don't exist yet — see [Contributing](#-contributing-workflows) if you want to add one.

### How to Use It

1. **Open the workflow markdown** — `claude-code/claude-sdk-workflow.md`
2. **Read the architecture overview** - Understand what you're building
3. **Copy prompts one by one** - Into Claude Code interface
4. **Review generated code** - Understand, don't just copy-paste
5. **Test incrementally** - Validate each phase
6. **Deploy** - Follow the deployment guide in the workflow

---

## 📂 Directory Structure

```
06-agent-workflows/
├── README.md                    # You are here
└── claude-code/
    └── claude-sdk-workflow.md   # The only workflow that exists today
```

---

## 💡 Best Practices

### When Using AI Agents

**Do:**
- ✅ Read the architecture first
- ✅ Understand what you're building
- ✅ Review generated code
- ✅ Test incrementally
- ✅ Ask questions when stuck
- ✅ Adapt prompts to your needs

**Don't:**
- ❌ Blindly copy-paste code
- ❌ Skip understanding the architecture
- ❌ Ignore security concerns
- ❌ Deploy without testing
- ❌ Expect perfect code first try
- ❌ Give up after one attempt

### Working Effectively

**1. Start with the workflow**
- Read entire workflow first
- Understand the end goal
- Note prerequisites

**2. Build phase by phase**
- Complete one phase fully
- Test before moving on
- Don't rush

**3. Understand the code**
- Read what the agent generates
- Ask questions about unclear parts
- Modify to fit your needs

**4. Test thoroughly**
- Unit tests for functions
- Integration tests for systems
- Manual testing in UI
- Load testing if needed

**5. Deploy incrementally**
- Start with dev environment
- Test in staging
- Monitor in production
- Iterate based on feedback

---

## 🤝 Contributing Workflows

**Help us grow this directory:**

1. **Add a workflow**
   - Pick a build target (RAG chatbot, ReAct agent, MCP server, etc.)
   - Document architecture, prompts, and deployment steps
   - Follow the structure of `claude-code/claude-sdk-workflow.md`

2. **Report issues**
   - Workflow didn't work?
   - Prompt unclear?
   - Missing steps?

3. **Suggest improvements**
   - Better architecture?
   - More efficient approach?
   - Additional best practices?

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

---

## 📚 Related Resources

**[patterns/](../patterns/)** - Architecture patterns these workflows implement
**[04-templates/](../04-templates/)** - Documentation templates
**[05-projects/](../05-projects/)** - Reference implementations
**[02-learning-paths/](../02-learning-paths/)** - Structured learning

---

## ⚡ Quick Links

**Get Started:**
- [Claude SDK Agent Workflow](claude-code/claude-sdk-workflow.md)

**Learn More:**
- [Architecture Patterns](../patterns/)
- [AI Architect Start Guide](../00-getting-started/AI-ARCHITECT-START-HERE.md)

**Get Help:**
- Discussions
- [Issues](https://github.com/frankxai/ai-architect-academy/issues)

---

## 🎯 Remember

**The tool doesn't matter. The architecture does.**

**These workflows help you build faster, but understanding the architecture is what matters.**

---

← [Back to Main README](../README.md)
→ [Claude SDK Agent Workflow](claude-code/claude-sdk-workflow.md)
