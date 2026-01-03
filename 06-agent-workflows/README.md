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

## 🛠️ Recommended: Claude Code

### Why We Recommend Claude Code

**Strengths:**
- **Long context (200K tokens)** - Sees your entire codebase
- **Strong reasoning** - Good at architecture and system design
- **Follows patterns well** - Works great with our structured workflows
- **Code quality** - Produces production-ready code

**When to use:**
- Building from scratch
- Refactoring complex systems
- Architectural decisions
- Research and exploration

### How to Use Claude Code Workflows

1. **Open the workflow markdown** (e.g., `claude-code/rag-chatbot-workflow.md`)
2. **Read the architecture overview** - Understand what you're building
3. **Copy prompts one by one** - Into Claude Code interface
4. **Review generated code** - Understand, don't just copy-paste
5. **Test incrementally** - Validate each phase
6. **Deploy** - Follow deployment guide

---

## 🔧 Alternative Tools

### You Can Use Any Tool You Want

**We provide workflows for Claude Code, but you can use:**

- **Cursor** - Fast iterations, VS Code-like
- **GitHub Copilot** - Familiar, integrated
- **Codex (via API)** - Programmatic access
- **ChatGPT** - Copy-paste workflow
- **Manual coding** - Full control

**Our workflows adapt easily:**
- Prompts work with any LLM
- Architecture is tool-agnostic
- Code examples are standard
- Deployment same regardless

---

## 📂 Directory Structure

```
06-agent-workflows/
├── README.md                    # You are here
│
├── claude-code/                # Recommended
│   ├── README.md               # Claude Code guide
│   ├── rag-chatbot-workflow.md
│   ├── react-agent-workflow.md
│   └── multimodal-workflow.md
│
├── cursor/                     # Alternative
│   ├── README.md
│   └── quick-build-workflow.md
│
├── copilot/                    # Alternative
│   ├── README.md
│   └── assisted-dev-workflow.md
│
└── manual/                     # No agent
    ├── README.md
    └── standard-development.md
```

---

## 🚀 Available Workflows

### Claude Code Workflows (Recommended)

**[RAG Chatbot](claude-code/rag-chatbot-workflow.md)**
- Build: Complete RAG system with vector search
- Time: 30-45 minutes
- Tech: Next.js, OpenAI, Pinecone
- Phases: 5 (setup, backend, frontend, polish, deploy)

**[ReAct Agent](claude-code/react-agent-workflow.md)**
- Build: Function-calling agent with reasoning
- Time: 45-60 minutes
- Tech: Python, LangChain, OpenAI
- Phases: 6 (setup, tools, agent, testing, deploy, monitoring)

**[Multi-Modal AI](claude-code/multimodal-workflow.md)**
- Build: Vision + text processing system
- Time: 60-90 minutes
- Tech: Next.js, GPT-4V, Claude 3
- Phases: 7 (setup, vision, text, integration, UI, deploy, optimization)

### Quick Build (Cursor)

**[Rapid Prototyping](cursor/quick-build-workflow.md)**
- Build: Fast iteration on UI and features
- Time: 15-30 minutes
- Focus: Speed over architecture depth
- Best for: MVPs, demos, quick tests

### Assisted Development (Copilot)

**[Incremental Building](copilot/assisted-dev-workflow.md)**
- Build: Traditional dev with AI assistance
- Time: Varies (similar to manual)
- Focus: Code completion and suggestions
- Best for: Familiar codebases, gradual adoption

### Manual Development

**[Standard Process](manual/standard-development.md)**
- Build: Without AI agents
- Time: Varies (full development time)
- Focus: Complete control and understanding
- Best for: Learning deeply, custom requirements

---

## 🎯 Choosing Your Approach

### Use Claude Code If:
✅ Building something new
✅ Want to move fast
✅ Need architectural guidance
✅ Working alone or small team
✅ Comfortable reviewing AI-generated code

### Use Cursor If:
✅ Rapid prototyping
✅ UI-heavy work
✅ Already familiar with VS Code
✅ Want fast iteration cycles

### Use Copilot If:
✅ Traditional development workflow
✅ Code completion needs
✅ Familiar codebase
✅ Incremental AI adoption

### Go Manual If:
✅ Learning the technology deeply
✅ Highly custom requirements
✅ No AI agent access
✅ Prefer full control

---

## 📝 Workflow Structure

### Every Workflow Includes:

**1. Architecture Overview**
- System design
- Component breakdown
- Technology choices
- Trade-offs explained

**2. Prerequisites**
- Required tools
- Dependencies
- Account setups
- Environment config

**3. Step-by-Step Phases**
- Numbered phases (typically 5-7)
- Specific prompts for agent
- Expected code outputs
- Testing checkpoints

**4. Deployment Guide**
- Production setup
- Environment variables
- Testing checklist
- Monitoring setup

**5. Troubleshooting**
- Common issues
- Debug strategies
- Performance tips
- Security considerations

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

## 🔍 Example: Using a Workflow

### Building RAG Chatbot with Claude Code

**Step 1: Preparation (5 min)**
```bash
# Read workflow
open claude-code/rag-chatbot-workflow.md

# Check prerequisites
- Node.js installed ✓
- OpenAI API key ✓
- Pinecone account ✓
```

**Step 2: Phase 1 - Setup (10 min)**
```
Copy prompt from workflow into Claude Code:
"Create a Next.js 14 project for a RAG chatbot.
Include: TypeScript, Tailwind, API routes.
Set up environment variables for OpenAI and Pinecone."

Review generated code, run: npm install
```

**Step 3: Phase 2 - Backend (15 min)**
```
Copy next prompt:
"Create API route for chat that implements RAG:
1. Embed user query
2. Search vector database
3. Augment prompt with context
4. Call OpenAI API
5. Stream response"

Review code, test API endpoint
```

**Step 4: Continue phases...**
- Phase 3: Frontend (UI)
- Phase 4: Polish (error handling, loading states)
- Phase 5: Deploy (Vercel)

**Total Time: 30-45 minutes**
**Result: Working RAG chatbot**

---

## 🤝 Contributing Workflows

**Help us improve:**

1. **Share your workflows**
   - Used a different agent?
   - Found a better prompt?
   - Built something new?

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
**[03-templates/](../03-templates/)** - Documentation templates
**[05-projects/](../05-projects/)** - Reference implementations
**[02-learning-paths/](../02-learning-paths/)** - Structured learning

---

## ⚡ Quick Links

**Get Started:**
- [Claude Code Setup](claude-code/README.md)
- [Your First Workflow](claude-code/rag-chatbot-workflow.md)

**Learn More:**
- [Architecture Patterns](../patterns/)
- [AI Architect Start Guide](../00-getting-started/AI-ARCHITECT-START-HERE.md)

**Get Help:**
- [Discussions](https://github.com/yourusername/AI-Architect-Academy/discussions)
- [Issues](https://github.com/yourusername/AI-Architect-Academy/issues)

---

## 🎯 Remember

**The tool doesn't matter. The architecture does.**

- Use Claude Code (recommended)
- Or use your preferred tool
- Or go manual

**These workflows help you build faster, but understanding the architecture is what matters.**

---

← [Back to Main README](../README.md)
→ [Claude Code Workflows](claude-code/)
