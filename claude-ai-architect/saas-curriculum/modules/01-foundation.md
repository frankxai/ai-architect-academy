# Module 1: Foundation - AI Architect Command Center

## 1.1 Introduction to AI Architecture

### Learning Objectives
- Understand the role of an AI Architect
- Learn the AI Architect Command Center system
- Recognize when to use AI-assisted architecture

### What is an AI Architect?

An AI Architect designs, implements, and governs AI systems at enterprise scale. This includes:

- **Solution Design**: Translating business requirements into AI architectures
- **Technology Selection**: Choosing the right models, frameworks, and infrastructure
- **Integration Patterns**: Connecting AI with existing enterprise systems
- **Governance**: Security, compliance, and cost management

### The AI Architect Command Center

The Command Center transforms Claude Code into your AI architecture assistant:

```
┌─────────────────────────────────────────────────────────────────┐
│                   AI ARCHITECT COMMAND CENTER                    │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  KNOWLEDGE  │  │   SKILLS    │  │  WORKFLOWS  │             │
│  │    BASE     │  │             │  │             │             │
│  │             │  │ 22 Expert   │  │ 7 Guided    │             │
│  │ OCI GenAI   │  │ Domains     │  │ Processes   │             │
│  │ Multi-Cloud │  │             │  │             │             │
│  │ Patterns    │  │             │  │             │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

### Key Components

1. **Knowledge Base**: Deep documentation on OCI GenAI, multi-cloud patterns, infrastructure
2. **Skills**: 22 specialized AI skills that auto-activate based on context
3. **Workflows**: Guided processes for common architecture tasks
4. **Templates**: D2 diagrams, Terraform modules, discovery questions

---

## 1.2 Setting Up AI Architect Command Center

### Prerequisites

```bash
# Required
- Claude Code CLI installed
- Git installed

# Recommended
- OCI CLI configured (for OCI operations)
- Terraform installed (for IaC)
- D2 installed (for diagrams)
```

### Installation Steps

```bash
# 1. Clone the Academy repository
git clone https://github.com/your-org/ai-architect-academy.git
cd ai-architect-academy/claude-ai-architect

# 2. Start Claude Code from this directory
claude

# 3. Test with a simple command
/design-solution "Hello World AI Architecture"
```

### Installing D2 for Diagrams

```bash
# macOS
brew install d2

# Linux
curl -fsSL https://d2lang.com/install.sh | sh

# Windows (PowerShell)
iwr -useb https://d2lang.com/install.ps1 | iex
```

### Verification Checklist

- [ ] Claude Code starts without errors
- [ ] `/design-solution` command recognized
- [ ] Skills folder accessible
- [ ] Knowledge base readable

---

## 1.3 Understanding Skills & Knowledge Bases

### What are Skills?

Skills are specialized knowledge modules that auto-activate based on keywords in your queries:

| Domain | Skills | Auto-Triggers |
|--------|--------|---------------|
| OCI | `oci-services-expert`, `genai-dac-specialist` | OCI, DAC, compartment |
| Multi-Cloud | `aws-ai-services`, `azure-ai-services` | Bedrock, Azure OpenAI |
| Agents | `oracle-adk`, `claude-sdk`, `langgraph-patterns` | ADK, agents, MCP |
| Security | `ai-security-expert` | guardrails, OWASP |
| Diagrams | `architecture-diagramming` | D2, diagram |

### Skill Structure

Each skill contains:

```
skills/oci-services-expert/
├── skill.md          # Main expertise document
├── examples/         # Code examples
└── templates/        # Reusable patterns
```

### Knowledge Base Structure

The knowledge base provides deep domain documentation:

```
knowledge-base/
├── oci-genai/
│   ├── DEDICATED-AI-CLUSTERS.md    # DAC deep dive
│   └── GENAI-AGENTS-RAG.md         # RAG systems
├── multi-cloud/
│   └── MULTI-CLOUD-AI-PATTERNS.md  # Cross-cloud patterns
└── ai-infrastructure/
    └── OCI-GPU-INFRASTRUCTURE.md   # GPU/training
```

### Exercise: Explore Skills

1. Navigate to `skills/` directory
2. Open `oci-services-expert/skill.md`
3. Identify key capabilities
4. Test by asking: "What OCI services support GenAI?"

---

## 1.4 First Architecture Design

### Using /design-solution

The `/design-solution` command initiates a guided architecture design:

```
/design-solution "Customer support AI with RAG"
```

This triggers:
1. Discovery questions
2. Technology analysis
3. Architecture diagram (D2)
4. Terraform scaffolding
5. Cost estimation

### Anatomy of an Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    REFERENCE ARCHITECTURE                        │
│                                                                  │
│  ┌─────────┐    ┌─────────────┐    ┌─────────────┐             │
│  │ Client  │───▶│ AI Gateway  │───▶│ OCI GenAI   │             │
│  │ Apps    │    │             │    │ DAC         │             │
│  └─────────┘    └─────────────┘    └─────────────┘             │
│                        │                  │                      │
│                        ▼                  ▼                      │
│               ┌─────────────┐    ┌─────────────┐                │
│               │ Monitoring  │    │ Knowledge   │                │
│               │ & Logs      │    │ Base        │                │
│               └─────────────┘    └─────────────┘                │
└─────────────────────────────────────────────────────────────────┘
```

### Exercise: Your First Design

1. Run: `/design-solution "Internal FAQ chatbot for HR policies"`
2. Answer the discovery questions
3. Review the generated architecture
4. Save the D2 diagram

### Assessment Checklist

- [ ] Understand AI Architect role
- [ ] Command Center installed and working
- [ ] Can navigate skills and knowledge base
- [ ] Completed first architecture design

---

## Next Steps

Proceed to **Module 2.1: OCI GenAI Service Overview** to dive deep into Oracle's GenAI capabilities.

---

*Module 1 Complete - You're now ready to become an AI Architect!*
