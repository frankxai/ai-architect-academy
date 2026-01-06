# AI Architect Command Center - Learning Path

> Master the Claude-powered AI Architecture toolkit for enterprise solutions.

## Overview

The AI Architect Command Center transforms Claude Code into your expert AI architecture assistant. This learning path teaches you to use, customize, and extend the system.

## Prerequisites

- Basic understanding of cloud services
- Familiarity with AI/ML concepts
- Claude Code CLI installed

## Quick Start

```bash
# Navigate to the Command Center
cd claude-ai-architect/

# Start Claude Code
claude

# Run your first architecture design
/design-solution "Customer support AI with RAG"
```

---

## Learning Path

### Foundation Track (8 hours)

| Module | Topic | Time | Resources |
|--------|-------|------|-----------|
| 1.1 | Introduction to AI Architecture | 2h | `saas-curriculum/modules/01-foundation.md` |
| 1.2 | Setting Up Command Center | 1h | `README.md` |
| 1.3 | Skills & Knowledge Bases | 2h | `skills/`, `knowledge-base/` |
| 1.4 | First Architecture Design | 3h | `/design-solution` command |

**Learning Outcomes:**
- Understand AI Architect role
- Navigate the Command Center
- Use slash commands
- Create first architecture

---

### OCI GenAI Track (12 hours)

| Module | Topic | Time | Resources |
|--------|-------|------|-----------|
| 2.1 | OCI GenAI Service Overview | 2h | `knowledge-base/oci-genai/` |
| 2.2 | Dedicated AI Clusters | 3h | `templates/terraform/oci-genai-dac/` |
| 2.3 | RAG Systems | 4h | `knowledge-base/oci-genai/GENAI-AGENTS-RAG.md` |
| 2.4 | Fine-Tuning Models | 3h | `/deploy-genai` command |

**Learning Outcomes:**
- Design DAC architectures
- Build RAG systems
- Fine-tune models
- Estimate costs

---

### Multi-Cloud Track (12 hours)

| Module | Topic | Time | Resources |
|--------|-------|------|-----------|
| 3.1 | Multi-Cloud Patterns | 2h | `knowledge-base/multi-cloud/` |
| 3.2 | AWS Bedrock | 2h | `skills/aws-ai-services/` |
| 3.3 | Azure OpenAI | 2h | `skills/azure-ai-services/` |
| 3.4 | OCI-Azure Interconnect | 3h | `examples/multi-cloud-analytics.md` |
| 3.5 | AI Gateway Design | 3h | `templates/terraform/ai-gateway/` |

**Learning Outcomes:**
- Design cross-cloud architectures
- Optimize workload placement
- Implement AI gateways
- Manage egress costs

---

### Agent Development Track (17 hours)

| Module | Topic | Time | Resources |
|--------|-------|------|-----------|
| 4.1 | Agent Architecture Patterns | 3h | `skills/agentic-orchestration/` |
| 4.2 | Oracle ADK Development | 4h | `skills/oracle-adk/` |
| 4.3 | Claude Agent SDK | 3h | `skills/claude-sdk/` |
| 4.4 | MCP Server Integration | 3h | `mcp-servers/`, `skills/mcp-architecture/` |
| 4.5 | Multi-Agent Orchestration | 4h | `skills/langgraph-patterns/` |

**Learning Outcomes:**
- Build production agents
- Integrate MCP servers
- Orchestrate multi-agent systems
- Choose the right framework

---

### Enterprise Track (14 hours)

| Module | Topic | Time | Resources |
|--------|-------|------|-----------|
| 5.1 | Security & Compliance | 3h | `skills/ai-security-expert/` |
| 5.2 | Cost Optimization | 2h | `skills/finops-ai/`, `templates/cost-calculator.md` |
| 5.3 | Infrastructure as Code | 3h | `templates/terraform/`, `skills/terraform-iac/` |
| 5.4 | Monitoring | 3h | `cheatsheets/` |
| 5.5 | CI/CD for AI | 3h | `.github/workflows/` |

**Learning Outcomes:**
- Implement security patterns
- Optimize costs
- Deploy with IaC
- Monitor AI systems

---

### Advanced Track (14 hours)

| Module | Topic | Time | Resources |
|--------|-------|------|-----------|
| 6.1 | Custom Skill Development | 4h | `skills/` templates |
| 6.2 | Custom MCP Servers | 4h | `mcp-servers/` |
| 6.3 | Architecture Diagramming | 3h | `skills/architecture-diagramming/`, `templates/d2/` |
| 6.4 | Custom Workflows | 3h | `workflows/` |

**Learning Outcomes:**
- Create custom skills
- Build MCP servers
- Generate professional diagrams
- Design custom workflows

---

## Certifications

### AI Architect Associate
- Complete Foundation + OCI GenAI tracks
- Pass Foundation Assessment
- Complete 1 hands-on project

### AI Architect Professional
- Complete Foundation through Agent Development
- Pass Professional Assessment
- Complete 3 hands-on projects

### AI Architect Expert
- Complete all tracks
- Pass Expert Assessment
- Complete capstone project
- Contribute to community

---

## Hands-On Projects

### Project 1: Customer Support AI
Build an intelligent customer support system.
- **Skills**: RAG, OCI GenAI, DAC
- **Output**: Working chatbot + architecture diagram
- **File**: `examples/customer-support-ai.md`

### Project 2: Multi-Cloud Analytics
Design cross-cloud analytics pipeline.
- **Skills**: Multi-cloud, AI Gateway, Cost optimization
- **Output**: Architecture + Terraform code
- **File**: `examples/multi-cloud-analytics.md`

### Project 3: Enterprise Agent System
Build production-ready multi-agent system.
- **Skills**: Agent development, MCP, Security
- **Output**: Working agents + documentation

### Capstone: Full Solution Design
End-to-end enterprise AI solution.
- **All skills combined**
- **Output**: Complete architecture, IaC, diagrams, documentation

---

## Resources

### Cheatsheets
- `cheatsheets/OCI-GENAI-CHEATSHEET.md`
- `cheatsheets/D2-DIAGRAM-CHEATSHEET.md`
- `cheatsheets/MODEL-COMPARISON-MATRIX.md`

### Templates
- `templates/d2/` - Architecture diagrams
- `templates/terraform/` - IaC modules
- `templates/discovery-questions.md` - Requirements gathering

### Documentation
- `AI-ARCHITECT-SYSTEM.md` - Full system overview
- `CLAUDE.md` - Claude configuration
- `config/MCP-SERVERS-GUIDE.md` - MCP setup

---

## Slash Commands Reference

| Command | Purpose |
|---------|---------|
| `/design-solution` | End-to-end AI solution design |
| `/deploy-genai` | Deploy OCI GenAI DAC |
| `/build-rag` | Build RAG system |
| `/multi-cloud-setup` | Multi-cloud architecture |
| `/optimize-costs` | Cost optimization review |
| `/security-review` | Security assessment |
| `/draw-architecture` | Generate diagrams |

---

## Next Steps

1. **Start**: Navigate to `claude-ai-architect/`
2. **Learn**: Follow Module 1.1
3. **Practice**: Complete Project 1
4. **Certify**: Take the assessment
5. **Contribute**: Add your own skills

---

*Total Learning Time: ~77 hours*
*Certification Path: 12 weeks at 6 hours/week*
