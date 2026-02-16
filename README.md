<p align="center">
  <img src="https://img.shields.io/badge/AI%20Architect-Academy-06b6d4?style=for-the-badge&logo=anthropic&logoColor=white" alt="AI Architect Academy"/>
</p>

<h1 align="center">AI Architect Academy</h1>

<p align="center">
  <strong>The world's first coding-agent-native learning platform.</strong><br/>
  Learn AI architecture by building with an AI architect — inside your terminal.
</p>

<p align="center">
  <a href="#quick-start"><img src="https://img.shields.io/badge/Quick%20Start-2%20min-success?style=flat-square" alt="Quick Start"/></a>
  <a href="#interactive-labs"><img src="https://img.shields.io/badge/Labs-3%20Interactive-ff6b6b?style=flat-square" alt="Labs"/></a>
  <a href="#skills-library"><img src="https://img.shields.io/badge/Skills-80+-blue?style=flat-square" alt="Skills"/></a>
  <a href="#learning-paths"><img src="https://img.shields.io/badge/Paths-5%20Tracks-purple?style=flat-square" alt="Learning Paths"/></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License"/></a>
</p>

---

## What Makes This Different

```
Traditional course:     Read docs → Watch videos → Maybe build something
AI Architect Academy:   Clone repo → Open Claude Code → Build with an instructor
```

When you open this repo in [Claude Code](https://docs.anthropic.com/en/docs/claude-code), the agent becomes your **personal AI architecture instructor**. It knows your progress, guides you with questions (not answers), and reviews your work like a senior engineer.

**The medium is the message.** You learn to build AI systems by building AI systems — with an AI.

---

## Quick Start

```bash
# 1. Clone the academy
git clone https://github.com/frankxai/ai-architect-academy.git
cd ai-architect-academy

# 2. Open Claude Code
claude

# 3. Start learning
/academy
```

That's it. The instructor takes over from here.

---

## The Experience

When you launch Claude Code in this directory, you'll see:

```
Academy | 0/3 labs completed | Current: none | Type /academy for menu
```

Type `/start-lab 01` and the instructor begins:

```
╔══════════════════════════════════════════════════════════════╗
║  AI ARCHITECT ACADEMY — Lab Mode                            ║
║  Lab: Fix the Broken RAG Pipeline                           ║
║  Difficulty: Intermediate | Est. Time: 45m                  ║
╚══════════════════════════════════════════════════════════════╝

Welcome, Architect.

Your company's customer support AI is returning irrelevant answers.
The RAG pipeline is live but broken. There are 3 bugs in rag_pipeline.py.

Before I guide you — take a look at the code. What do you notice about
the chunk_documents() method?
```

The instructor uses **Socratic method** — it asks questions, not gives answers. When you're stuck, type `/hint` for incremental clues. When ready, type `/review` for an architect-grade code review.

---

## Interactive Labs

| Lab | What You Build | Difficulty | Time |
|-----|---------------|-----------|------|
| **01: Fix the Broken RAG Pipeline** | Debug chunking, search, and context assembly in a production RAG system | Intermediate | 45m |
| **02: Build a Multi-Agent System** | Implement a coordinator that orchestrates Researcher, Analyst, and Writer agents | Advanced | 60m |
| **03: Build Your Own MCP Server** | Create a TypeScript MCP server with 3 tools for Claude Code | Advanced | 60m |

Each lab includes:
- Real source code (broken or scaffolded)
- Test suites (your objective pass/fail gate)
- Sample data
- Checkpoints tracked in your progress file

---

## Commands

| Command | What It Does |
|---------|-------------|
| `/academy` | Main menu — see everything available |
| `/start-lab 01` | Begin (or resume) an interactive lab |
| `/hint` | Get a Socratic hint — direction, not answers |
| `/review` | Architect review: tests + score + feedback |
| `/next` | Context-aware "what should I do next?" |
| `/progress` | Your full progress dashboard |
| `/solution` | Reveal the solution (requires prior attempt) |

### Architecture Skills

| Command | What It Does |
|---------|-------------|
| `/design-solution` | End-to-end AI solution architecture |
| `/build-rag` | Build a RAG system from scratch |
| `/mcp-server` | Build a custom MCP server |
| `/security-review` | Security assessment |
| `/optimize-costs` | Cost optimization analysis |

---

## How It Works (Architecture)

```
ai-architect-academy/
├── CLAUDE.md                    # Instructor Engine — persona, rules, curriculum state
├── .academy/
│   └── progress.json            # Your progress (gitignored, personal to you)
├── .claude/
│   ├── commands/                # /hint, /review, /next, /academy, etc.
│   ├── hooks/                   # Session-start welcome, progress tracking
│   └── skill-rules.json         # Auto-activation rules for 80+ skills
├── labs/                        # Interactive coding labs
│   ├── 01-rag-pipeline/         # Python — fix broken RAG (3 bugs)
│   ├── 02-multi-agent-system/   # Python — build coordinator pattern
│   └── 03-mcp-server/           # TypeScript — build MCP server
├── claude-ai-architect/         # Knowledge base + 22 expert skills
│   ├── skills/                  # RAG, MCP, multi-cloud, security, etc.
│   ├── knowledge-base/          # OCI GenAI, infrastructure docs
│   ├── templates/               # D2 diagrams, Terraform modules
│   └── saas-curriculum/         # 12-week structured curriculum
├── 01-design-patterns/          # 20+ architecture patterns
├── 02-learning-paths/           # Structured learning tracks
└── 05-projects/                 # 100+ project ideas
```

### The Three Layers

1. **Instructor Engine** (`CLAUDE.md`) — Defines the teaching persona, Socratic rules, skill activation, and progress tracking. This is what turns Claude from a generic assistant into a domain-expert instructor.

2. **Interactive Labs** (`labs/`) — Real codebases with real bugs and real test suites. The student writes code. The instructor guides. Tests are the judge.

3. **Knowledge Base** (`claude-ai-architect/skills/`) — 22+ deep-dive skills that auto-activate based on context. Working on RAG? The RAG skill loads. Building an MCP server? The MCP patterns load.

---

## Learning Paths

| Path | Hours | Focus |
|------|-------|-------|
| **Foundation** | 20h | Claude SDK, MCP basics, first agent |
| **Agent Developer** | 40h | Multi-agent, RAG, orchestration |
| **Multi-Cloud** | 40h | OCI, AWS, Azure, GCP patterns |
| **Enterprise Lead** | 30h | Security, governance, compliance |
| **Bootcamp** | 40h | Intensive: all labs + capstone |

---

## Certification

| Level | Requirements |
|-------|-------------|
| **Associate** | Complete 2 labs with avg score >= 70 |
| **Professional** | Complete all 3 labs + 2 learning path modules |
| **Expert** | All labs (avg >= 85) + capstone project + security review |

---

## Skills Library (80+)

Auto-activated by context. You never need to load them manually.

| Category | Count | Examples |
|----------|-------|---------|
| Agent Frameworks | 12 | Claude SDK, Oracle ADK, LangGraph, OpenAI Agents, CrewAI |
| Multi-Cloud AI | 16 | OCI, AWS Bedrock, Azure OpenAI, Vertex AI, Terraform |
| MCP & Integration | 10 | MCP architecture, server builder, tool use patterns |
| RAG & Knowledge | 8 | Vector DBs, chunking, retrieval strategies, knowledge graphs |
| Enterprise & Security | 12 | Guardrails, compliance, audit logging, red teaming |
| Evaluation & Production | 18 | LangFuse, LangSmith, CI/CD, monitoring, scaling |

---

## Built With

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) — The agent runtime
- [Model Context Protocol](https://modelcontextprotocol.io/) — Tool integration standard
- ACOS patterns — Skill activation, hooks, and progress tracking adapted from the [Agentic Creator OS](https://github.com/frankxai/agentic-creator-os)

---

## Contributing

PRs welcome. If you want to add a lab, create a `labs/[id]-[name]/` directory with:
- `.lab/config.json` — Lab metadata
- Source code (broken or scaffolded)
- `tests/` — Test suite
- `README.md` — Mission briefing

---

<p align="center">
  <strong>Built by <a href="https://frankx.ai">FrankX</a></strong><br/>
  <sub>The era of watching videos to learn code is over. Build with agents.</sub>
</p>
