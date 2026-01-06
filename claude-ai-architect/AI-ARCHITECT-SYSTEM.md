# AI Architect Command Center

## System Overview

This repository transforms Claude Code into your comprehensive AI Architect helper, specializing in:
- **Multi-Cloud Architectures** (OCI focus)
- **OCI GenAI Services & Dedicated AI Clusters**
- **Enterprise AI Patterns**
- **Agent System Design**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     AI ARCHITECT COMMAND CENTER                              │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                     CHIEF ARCHITECT (Claude)                             ││
│  │                                                                          ││
│  │  Capabilities:                                                           ││
│  │  - Design multi-cloud AI architectures                                   ││
│  │  - Deploy OCI GenAI Dedicated AI Clusters                               ││
│  │  - Build RAG systems and AI agents                                       ││
│  │  - Optimize costs across cloud providers                                 ││
│  │  - Implement enterprise security patterns                                ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐│
│  │  KNOWLEDGE    │  │    SKILLS     │  │   WORKFLOWS   │  │    AGENTS     ││
│  │    BASE       │  │               │  │               │  │               ││
│  │               │  │ - OCI Expert  │  │ - Solution    │  │ - Cloud Dept  ││
│  │ - OCI GenAI   │  │ - RAG Expert  │  │   Design      │  │ - AI Dept     ││
│  │ - Multi-Cloud │  │ - Agent Arch  │  │ - GenAI       │  │ - Enterprise  ││
│  │ - GPU Infra   │  │ - MCP Expert  │  │   Deploy      │  │   Dept        ││
│  │ - Patterns    │  │ - Security    │  │ - RAG Build   │  │ - Delivery    ││
│  └───────────────┘  └───────────────┘  └───────────────┘  └───────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```

## Quick Start Commands

### Architecture Design
```
/design-solution "Description of your AI solution"
```

### OCI GenAI Deployment
```
/deploy-genai
```

### RAG System Build
```
/build-rag
```

### Multi-Cloud Setup
```
/multi-cloud-setup
```

### Cost Optimization
```
/optimize-costs
```

### Security Review
```
/security-review
```

## Directory Structure

```
claude-ai-architect/
├── CLAUDE.md                    # Project instructions
├── AI-ARCHITECT-SYSTEM.md       # This file - system overview
│
├── knowledge-base/              # Domain knowledge
│   ├── oci-genai/
│   │   ├── DEDICATED-AI-CLUSTERS.md
│   │   └── GENAI-AGENTS-RAG.md
│   ├── multi-cloud/
│   │   └── MULTI-CLOUD-AI-PATTERNS.md
│   ├── ai-infrastructure/
│   │   └── OCI-GPU-INFRASTRUCTURE.md
│   └── enterprise-patterns/
│
├── skills/                      # Claude Code skills
│   ├── oci-services-expert/
│   ├── oracle-adk/
│   ├── oracle-agent-spec/
│   ├── agentic-orchestration/
│   ├── mcp-architecture/
│   ├── mcp-2025-patterns/
│   ├── claude-sdk/
│   ├── langgraph-patterns/
│   ├── openai-agentkit/
│   ├── genai-dac-specialist/    # NEW
│   ├── rag-expert/              # NEW
│   └── enterprise-ai-patterns/  # NEW
│
├── agent-teams/                 # Agent organization
│   └── AGENT-DEPARTMENTS.md
│
├── workflows/                   # Architecture workflows
│   └── AI-ARCHITECTURE-WORKFLOWS.md
│
├── config/                      # Configuration
│   └── MCP-SERVERS-GUIDE.md
│
├── prompts/                     # Prompt templates
│
└── templates/                   # IaC templates
```

## Core Capabilities

### 1. OCI GenAI Expertise
- **Dedicated AI Clusters**: Design, deploy, and optimize DACs
- **Model Selection**: Choose between Cohere (Command R+, R, Light) and Llama models
- **Fine-Tuning**: Customize models with proprietary data
- **Production Operations**: Monitoring, scaling, cost optimization

### 2. Multi-Cloud Architecture
- **Workload Placement**: AWS, Azure, GCP, OCI - choose based on strengths
- **OCI-Azure Interconnect**: 2ms latency cross-cloud connectivity
- **Data Sovereignty**: Region-specific deployments for compliance
- **Cost Optimization**: Minimize egress, leverage commitments

### 3. RAG & Agent Systems
- **Knowledge Bases**: Design and implement with OCI GenAI Agents
- **Chunking Strategies**: Optimize for retrieval quality
- **Multi-Agent Orchestration**: Build complex agent workflows
- **MCP Integration**: Connect to enterprise data sources

### 4. Enterprise Patterns
- **Security**: Defense in depth, prompt injection protection
- **Governance**: Model registry, approval workflows
- **Observability**: Full AI pipeline monitoring
- **FinOps**: Cost tracking and optimization

## Agent Teams

### Cloud Infrastructure Department
- OCI Compute Expert
- OCI Network Expert
- AWS/Azure/GCP Experts
- Multi-Cloud Architect

### AI & ML Department
- GenAI Architect
- DAC Specialist
- RAG Specialist
- Agent Architect

### Enterprise Department
- Security Architect
- Cost Optimizer
- Standards Keeper

### Solution Delivery
- Terraform Developer
- QA Agent
- SRE Agent

## Key Workflows

### Solution Design Workflow
1. Requirements gathering
2. Technology analysis
3. Architecture design
4. Security review
5. Cost estimation
6. Approval

### GenAI Deployment Workflow
1. Model selection
2. Cluster sizing
3. DAC creation
4. Endpoint configuration
5. Testing
6. Monitoring setup

### RAG Implementation Workflow
1. Document preparation
2. Knowledge base creation
3. Agent configuration
4. RAG tool setup
5. Quality testing
6. Production deployment

## Usage Examples

### Design a Customer Support AI
```
User: Design an AI solution for customer support with RAG

Claude: I'll activate the Solution Design workflow...

[Activates: GenAI-Architect, RAG-Specialist, Security-Architect, Cost-Optimizer]

Architecture Recommendation:
- OCI GenAI DAC with Command R+
- Knowledge base from support documentation
- Multi-lingual support (OCI March 2025 features)
- Estimated cost: $X/month
- Timeline: 2-3 weeks

[Generates: Architecture diagram, Terraform code, Cost estimate]
```

### Deploy GenAI Cluster
```
User: Deploy a production GenAI cluster for inference

Claude: I'll activate the GenAI Deployment workflow...

[Activates: DAC-Specialist]

Recommendations:
- Hosting cluster: 10 units (supports 10 endpoints)
- Model: Command R+ for complex reasoning
- Region: US-Chicago-1 (GenAI availability)

[Generates: Terraform code, IAM policies, Monitoring dashboards]
```

### Multi-Cloud AI Setup
```
User: Set up multi-cloud AI with Azure OpenAI and OCI GenAI

Claude: I'll activate the Multi-Cloud workflow...

[Activates: Multi-Cloud-Architect, Azure-Expert, OCI-Expert]

Architecture:
- Azure: GPT-4 for conversational AI
- OCI: Command R+ for document analysis (cost efficient)
- OCI-Azure Interconnect for low-latency data sharing
- AI Gateway for unified routing

[Generates: Network diagram, Terraform for both clouds, Routing logic]
```

## MCP Servers to Install

### Essential
```bash
npm install -g @modelcontextprotocol/server-github
npm install -g @modelcontextprotocol/server-filesystem
npm install -g @modelcontextprotocol/server-postgres
```

### Recommended
```bash
npm install -g @modelcontextprotocol/server-puppeteer
npm install -g @modelcontextprotocol/server-memory
npm install -g @notionhq/notion-mcp-server
```

### Custom (Build These)
- OCI Infrastructure Server
- Terraform Operations Server
- Cost Analysis Server

## Resources

### OCI Documentation
- [OCI GenAI Overview](https://docs.oracle.com/en-us/iaas/Content/generative-ai/overview.htm)
- [Dedicated AI Clusters](https://docs.oracle.com/en-us/iaas/Content/generative-ai/ai-cluster.htm)
- [GenAI Agents](https://docs.oracle.com/en-us/iaas/Content/generative-ai-agents/overview.htm)
- [OCI GPU Infrastructure](https://www.oracle.com/cloud/compute/gpu/)

### Architecture Patterns
- [Multi-Cloud Strategies](https://www.itconvergence.com/blog/multi-cloud-strategies-the-2025-2026-primer/)
- [Enterprise AI Patterns](https://blogs.oracle.com/ai-and-datascience/)

### Agent Frameworks
- [Claude Agent SDK](https://github.com/anthropics/anthropic-cookbook)
- [Oracle ADK](https://docs.oracle.com/en-us/iaas/Content/generative-ai-agents/adk/)
- [Oracle Agent Spec](https://github.com/oracle/agent-spec)
- [MCP Protocol](https://modelcontextprotocol.io/)

## Getting Started

1. **Review Knowledge Base**: Start with the OCI GenAI and Multi-Cloud docs
2. **Explore Skills**: Each skill has detailed expertise
3. **Use Workflows**: Trigger workflows for structured tasks
4. **Customize**: Add your own knowledge, templates, and patterns

## Activation

Simply start working! Ask about:
- "Design an AI architecture for..."
- "How do I deploy a GenAI cluster?"
- "What's the best model for...?"
- "Optimize my AI costs"
- "Review security of my AI system"

The AI Architect is ready to help.
