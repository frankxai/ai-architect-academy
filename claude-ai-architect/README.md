# AI Architect Command Center

> Transform Claude Code into your expert AI Architecture assistant specializing in Multi-Cloud AI solutions with Oracle Cloud Infrastructure focus.

## Quick Start

```bash
# Clone and enter the repository
cd claude-ai-architect

# Start Claude Code with this as the working directory
claude

# Use slash commands to get started
/design-solution "Customer support AI with RAG"
/deploy-genai
/draw-architecture
```

## What This Repository Does

This repository configures Claude Code as an **AI Architect** with expertise in:

- **OCI GenAI & Dedicated AI Clusters** - Design, deploy, and optimize GenAI solutions
- **Multi-Cloud AI Architecture** - AWS, Azure, GCP, OCI workload placement
- **RAG & Agent Systems** - Knowledge bases, retrieval, multi-agent orchestration
- **Architecture Diagramming** - Professional D2, Draw.io, Mermaid diagrams
- **Enterprise AI Patterns** - Security, governance, FinOps

## Repository Structure

```
claude-ai-architect/
├── CLAUDE.md                    # Claude Code instructions
├── README.md                    # This file
│
├── knowledge-base/              # Domain expertise
│   ├── oci-genai/              # OCI GenAI documentation
│   ├── multi-cloud/            # Multi-cloud patterns
│   └── ai-infrastructure/      # GPU and infrastructure
│
├── skills/                      # 14 specialized skills
│   ├── architecture-diagramming/
│   ├── genai-dac-specialist/
│   ├── rag-expert/
│   ├── enterprise-ai-patterns/
│   └── ... (10 more)
│
├── templates/
│   ├── d2/                     # D2 diagram templates
│   ├── terraform/              # IaC modules
│   │   ├── oci-genai-dac/
│   │   ├── oci-rag-system/
│   │   ├── ai-gateway/
│   │   └── security-baseline/
│   ├── cost-calculator.md
│   └── discovery-questions.md
│
├── prompts/                    # Slash command definitions
│   ├── design-solution.md
│   ├── deploy-genai.md
│   ├── build-rag.md
│   ├── multi-cloud-setup.md
│   ├── optimize-costs.md
│   ├── security-review.md
│   └── draw-architecture.md
│
├── examples/                   # Real-world solutions
│   ├── customer-support-ai.md
│   └── multi-cloud-analytics.md
│
├── sdk-examples/               # Python code examples
│   └── oci_genai_examples.py
│
├── cheatsheets/               # Quick reference
│   ├── OCI-GENAI-CHEATSHEET.md
│   ├── D2-DIAGRAM-CHEATSHEET.md
│   └── MODEL-COMPARISON-MATRIX.md
│
├── mcp-servers/               # Custom MCP servers
│   ├── oci-infrastructure/    # OCI operations
│   └── terraform-ops/         # Terraform operations
│
├── agent-teams/               # Agent organization
├── workflows/                 # Architecture workflows
└── config/                    # MCP server configs
```

## Slash Commands

| Command | Description |
|---------|-------------|
| `/design-solution` | End-to-end AI solution design |
| `/deploy-genai` | Deploy OCI GenAI Dedicated AI Cluster |
| `/build-rag` | Build RAG system with knowledge bases |
| `/multi-cloud-setup` | Configure multi-cloud AI architecture |
| `/optimize-costs` | Cost optimization review |
| `/security-review` | Security assessment |
| `/draw-architecture` | Generate architecture diagrams |

## Features

### 1. Knowledge Base
Comprehensive documentation on:
- OCI Dedicated AI Clusters (DACs)
- OCI GenAI Agents and RAG
- Multi-cloud AI patterns
- GPU infrastructure and training

### 2. Terraform Modules
Ready-to-deploy infrastructure:
```bash
cd templates/terraform/oci-genai-dac
terraform init && terraform apply
```

### 3. D2 Diagram Templates
Professional architecture diagrams:
```bash
d2 --layout=tala templates/d2/oci-genai-rag.d2 output.svg
```

### 4. Python SDK Examples
Working code for OCI GenAI:
```python
# See sdk-examples/oci_genai_examples.py
from oci.generative_ai_inference import GenerativeAiInferenceClient
```

### 5. MCP Servers
Custom servers for Claude integration:
- **oci-infrastructure** - OCI API operations
- **terraform-ops** - Terraform plan/apply/state

## Installation

### Prerequisites
- Claude Code CLI installed
- OCI CLI configured (for OCI operations)
- Terraform installed (for IaC)
- D2 installed (for diagrams)

### Install D2 (for diagrams)
```bash
# macOS
brew install d2

# Linux
curl -fsSL https://d2lang.com/install.sh | sh

# Windows (PowerShell)
iwr -useb https://d2lang.com/install.ps1 | iex
```

### Install MCP Servers
```bash
# OCI Infrastructure Server
cd mcp-servers/oci-infrastructure
pip install -r requirements.txt

# Terraform Operations Server
cd mcp-servers/terraform-ops
pip install -r requirements.txt
```

### Configure MCP Servers
Add to `~/.claude/settings.json`:
```json
{
  "mcpServers": {
    "oci": {
      "command": "python",
      "args": ["/path/to/mcp-servers/oci-infrastructure/server.py"]
    },
    "terraform": {
      "command": "python",
      "args": ["/path/to/mcp-servers/terraform-ops/server.py"]
    }
  }
}
```

## Usage Examples

### Design a Solution
```
User: Design an AI solution for customer support

Claude: I'll use the /design-solution workflow...
[Generates architecture, D2 diagram, Terraform, cost estimate]
```

### Deploy GenAI Cluster
```
User: Deploy a production GenAI cluster

Claude: I'll use the /deploy-genai workflow...
[Recommends sizing, generates Terraform, provides validation steps]
```

### Generate Diagram
```
User: Create an architecture diagram for our RAG system

Claude: I'll generate a D2 diagram...
[Creates professional diagram with OCI components]
```

## Model Comparison

| Model | Best For | Cost |
|-------|----------|------|
| Command R+ | Complex reasoning, RAG | $$$ |
| Command R | General purpose | $$ |
| Command Light | High volume, simple | $ |
| Llama 3.1 70B | Open source | $$$ |
| GPT-4 Turbo | Best capability | $$$$ |
| Claude 3.5 Sonnet | Best balance | $$$ |

See `cheatsheets/MODEL-COMPARISON-MATRIX.md` for full comparison.

## Cost Reference

| DAC Size | Units | Monthly Est. |
|----------|-------|--------------|
| Dev/Test | 2-5 | $3-7.5K |
| Production | 5-15 | $7.5-22.5K |
| High Volume | 15-30 | $22.5-45K |
| Enterprise | 30-50 | $45-75K |

See `templates/cost-calculator.md` for detailed scenarios.

## Contributing

1. Add knowledge to `knowledge-base/`
2. Create skills in `skills/`
3. Add templates to `templates/`
4. Document in `cheatsheets/`

## Resources

### OCI Documentation
- [OCI GenAI](https://docs.oracle.com/en-us/iaas/Content/generative-ai/overview.htm)
- [Dedicated AI Clusters](https://docs.oracle.com/en-us/iaas/Content/generative-ai/ai-cluster.htm)
- [GenAI Agents](https://docs.oracle.com/en-us/iaas/Content/generative-ai-agents/overview.htm)
- [OCI Icons](https://docs.oracle.com/en-us/iaas/Content/General/Reference/graphicsfordiagrams.htm)

### Diagramming
- [D2 Language](https://d2lang.com/)
- [D2 Playground](https://play.d2lang.com/)

### Agent Frameworks
- [Claude Agent SDK](https://github.com/anthropics/anthropic-cookbook)
- [Oracle ADK](https://docs.oracle.com/en-us/iaas/Content/generative-ai-agents/adk/)
- [MCP Protocol](https://modelcontextprotocol.io/)

## License

MIT License - Use freely for your AI architecture projects.

---

*AI Architect Command Center - Design with excellence, diagram with clarity, deploy with confidence.*
