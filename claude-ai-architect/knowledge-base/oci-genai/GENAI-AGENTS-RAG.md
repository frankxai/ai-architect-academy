# OCI Generative AI Agents - RAG & Knowledge Bases

## Overview

OCI Generative AI Agents is a fully managed service combining LLMs with enterprise data to create intelligent, context-aware virtual agents. The RAG (Retrieval-Augmented Generation) capability allows agents to search your knowledge bases before generating responses.

```
┌─────────────────────────────────────────────────────────────────┐
│                    OCI GenAI Agents                              │
│                                                                  │
│   User Query ──▶ [Agent] ──▶ [RAG Tool] ──▶ [Knowledge Base]   │
│                      │            │              │               │
│                      │            ▼              ▼               │
│                      │      Vector Search   Document Store       │
│                      │            │              │               │
│                      │            └──────┬───────┘               │
│                      │                   │                       │
│                      │            Retrieved Context              │
│                      │                   │                       │
│                      ▼                   ▼                       │
│                 [LLM Generation with Context]                    │
│                            │                                     │
│                            ▼                                     │
│                   Contextual Response                            │
└─────────────────────────────────────────────────────────────────┘
```

## Key Capabilities (March 2025 Release)

### 1. Enhanced RAG Tool
- **Hybrid Search**: Combines keyword and vector search for better accuracy
- **Multi-modal Parsing**: Extract insights from images and charts in PDFs
- **Improved Response Quality**: Enhanced accuracy based on customer feedback

### 2. Custom Instructions
Define preferences and fine-tune agent behavior:
```yaml
custom_instructions:
  tone: "Professional but friendly"
  response_length: "Concise, under 200 words"
  citation_style: "Always cite source documents"
  uncertainty_handling: "Explicitly state when unsure"
```

### 3. Multi-lingual Support
Supported languages:
- English (default)
- French
- Spanish
- Portuguese
- Arabic
- German
- Italian
- Japanese

### 4. Multiple Knowledge Bases
Single agent can query multiple knowledge sources:
```
Agent
├── KB1: Product Documentation
├── KB2: Support Tickets (Historical)
├── KB3: Internal Policies
└── KB4: FAQ Database
```

### 5. Metadata Ingestion & Filtering
Categorize and filter content:
```json
{
  "metadata": {
    "department": "engineering",
    "doc_type": "runbook",
    "access_level": "internal",
    "last_updated": "2025-01-01"
  }
}
```

## Architecture Components

### Knowledge Base
The foundation for all data sources an agent can query.

**Supported Data Sources:**
- OCI Object Storage (PDF, TXT files)
- Oracle Database 23ai (Vector Search)
- OpenSearch (coming soon)

**Limits:**
- Up to 1,000 files per Object Storage bucket
- 100 MB max per file
- 8 MB max for embedded images/charts in PDFs

### RAG Tool
Retrieves information from knowledge bases and generates responses.

**Capabilities:**
- Semantic search across documents
- Chunk-based retrieval
- Context ranking and selection
- Source citation

### Agent Endpoints
API endpoints for interacting with agents:
- Chat API (multi-turn conversations)
- Session management
- Context retention

## Implementation Guide

### Step 1: Create Knowledge Base

**Using OCI Console:**
1. Navigate to Generative AI Agents
2. Click "Create Knowledge Base"
3. Select data source (Object Storage bucket)
4. Configure indexing options
5. Wait for ingestion to complete

**Using Terraform:**
```hcl
resource "oci_generative_ai_agent_knowledge_base" "docs_kb" {
  compartment_id = var.compartment_id
  display_name   = "Product-Documentation-KB"

  index_config {
    index_config_type = "DEFAULT_INDEX_CONFIG"

    databases {
      connection_type = "OBJECT_STORAGE"
      connection_id   = oci_objectstorage_bucket.docs.id
    }
  }
}
```

### Step 2: Create Agent with RAG Tool

```hcl
resource "oci_generative_ai_agent" "support_agent" {
  compartment_id = var.compartment_id
  display_name   = "Customer-Support-Agent"

  description = "AI agent for customer support queries"

  knowledge_base_ids = [
    oci_generative_ai_agent_knowledge_base.docs_kb.id,
    oci_generative_ai_agent_knowledge_base.faq_kb.id
  ]

  welcome_message = "Hello! I'm your support assistant. How can I help you today?"

  system_message = <<-EOT
    You are a helpful customer support agent.
    Always cite your sources when providing information.
    If you don't know the answer, say so clearly.
    Be professional and concise.
  EOT
}
```

### Step 3: Prepare Documents

**Best Practices for Document Preparation:**

```
1. Structure for Chunking
   ├── Use clear headings (H1, H2, H3)
   ├── Keep paragraphs focused on single topics
   └── Add metadata for filtering

2. Optimize for Retrieval
   ├── Include keywords naturally
   ├── Use consistent terminology
   └── Add summaries at document start

3. Handle Special Content
   ├── Tables: Ensure text is extractable
   ├── Images: Add descriptive captions
   └── Code: Use proper formatting
```

**Example Document Structure:**
```markdown
# Product: Widget Pro 3000

## Overview
The Widget Pro 3000 is our flagship product for enterprise customers.
Key features include automated processing and AI-powered insights.

## Installation
### Requirements
- Operating System: Linux, Windows, macOS
- Memory: 8GB minimum, 16GB recommended
- Disk: 50GB free space

### Steps
1. Download the installer from portal.example.com
2. Run the installation wizard
3. Enter your license key
4. Complete the configuration

## Troubleshooting
### Error: Connection Timeout
This error occurs when the service cannot reach the API endpoint.
Solution: Check your firewall settings and ensure port 443 is open.

### Error: Invalid License
Your license key may have expired.
Solution: Contact support@example.com for renewal.
```

### Step 4: Integrate with Applications

**Python SDK:**
```python
import oci

# Initialize client
config = oci.config.from_file()
agent_client = oci.generative_ai_agent.GenerativeAiAgentClient(config)

# Create session
session = agent_client.create_session(
    agent_id="ocid1.generativeaiagent...",
    create_session_details=oci.generative_ai_agent.models.CreateSessionDetails(
        display_name="User-Session-123"
    )
)

# Send message
response = agent_client.chat(
    agent_id="ocid1.generativeaiagent...",
    session_id=session.data.id,
    chat_details=oci.generative_ai_agent.models.ChatDetails(
        user_message="How do I install Widget Pro 3000?"
    )
)

print(response.data.message)
# Output: "To install Widget Pro 3000, follow these steps:
#          1. Download the installer from portal.example.com
#          2. Run the installation wizard... [Source: Product Documentation]"
```

**REST API:**
```bash
# Create session
curl -X POST "https://agent.generativeai.us-chicago-1.oci.oraclecloud.com/20240331/agentEndpoints/{agentEndpointId}/sessions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"displayName": "user-session"}'

# Chat with agent
curl -X POST "https://agent.generativeai.us-chicago-1.oci.oraclecloud.com/20240331/agentEndpoints/{agentEndpointId}/sessions/{sessionId}/actions/chat" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userMessage": "How do I troubleshoot connection timeout errors?"}'
```

## Advanced Patterns

### Pattern 1: Multi-Domain Agent
```
┌─────────────────────────────────────────────────┐
│              MULTI-DOMAIN AGENT                  │
│                                                  │
│  Query Classifier                               │
│       │                                          │
│       ├── Technical Query ──▶ Technical KB      │
│       ├── Billing Query ──▶ Billing KB          │
│       ├── Policy Query ──▶ Policy KB            │
│       └── General Query ──▶ FAQ KB              │
│                                                  │
│  Response Synthesizer                           │
│       └── Merge results + format                │
└─────────────────────────────────────────────────┘
```

### Pattern 2: RAG with Fallback
```python
def query_with_fallback(agent, query):
    # Try RAG first
    response = agent.chat(query)

    if response.confidence < 0.7:
        # Low confidence - escalate to human
        return {
            "response": response.message,
            "confidence": response.confidence,
            "action": "escalate_to_human",
            "reason": "Low confidence in answer"
        }

    return {
        "response": response.message,
        "confidence": response.confidence,
        "sources": response.sources
    }
```

### Pattern 3: Continuous Knowledge Update
```
┌─────────────────────────────────────────────────┐
│          KNOWLEDGE UPDATE PIPELINE               │
│                                                  │
│  1. New Document Added to Object Storage        │
│              │                                   │
│              ▼                                   │
│  2. OCI Events → Trigger Function              │
│              │                                   │
│              ▼                                   │
│  3. Function → Re-index Knowledge Base         │
│              │                                   │
│              ▼                                   │
│  4. Agent uses updated knowledge               │
└─────────────────────────────────────────────────┘
```

## Performance Optimization

### 1. Chunk Size Tuning
```
Small Chunks (256 tokens):
├── More precise retrieval
├── Better for specific questions
└── Higher API calls

Large Chunks (1024 tokens):
├── More context per retrieval
├── Better for complex questions
└── Fewer API calls

Recommended: 512 tokens with 50-token overlap
```

### 2. Retrieval Count
```
Top-K Settings:
├── K=3: Fast, focused responses
├── K=5: Balanced (recommended)
├── K=10: Comprehensive but slower
└── K>10: Diminishing returns
```

### 3. Embedding Model Selection
```
OCI Cohere Embed:
├── Multi-lingual support
├── 1024 dimensions
└── Optimized for OCI
```

## Use Cases

### 1. Customer Support
- Answer product questions
- Troubleshooting guidance
- Policy explanations
- Order status (with integration)

### 2. IT Helpdesk
- System troubleshooting
- Runbook retrieval
- Configuration guidance
- Incident resolution

### 3. HR Assistant
- Policy questions
- Benefits information
- Onboarding guidance
- Compliance queries

### 4. Legal Research
- Contract analysis
- Regulatory compliance
- Case law search
- Policy interpretation

### 5. Sales Enablement
- Product information
- Competitive analysis
- Pricing guidance
- Proposal templates

## Monitoring & Analytics

### Key Metrics
1. **Query Volume**: Requests per hour/day
2. **Response Latency**: P50, P95, P99
3. **Retrieval Quality**: Relevance scores
4. **User Satisfaction**: Thumbs up/down
5. **Escalation Rate**: Queries requiring human help

### OCI Logging Integration
```hcl
resource "oci_logging_log" "agent_logs" {
  display_name = "genai-agent-logs"
  log_group_id = oci_logging_log_group.ai.id
  log_type     = "SERVICE"

  configuration {
    source {
      category    = "all"
      resource    = oci_generative_ai_agent.support_agent.id
      service     = "generativeaiagent"
      source_type = "OCISERVICE"
    }
  }
}
```

## Security Best Practices

### 1. Access Control
```hcl
# Least privilege for agents
Allow group Support-Team to use generative-ai-agents in compartment Support
Allow group Support-Team to read generative-ai-knowledge-bases in compartment Support

# Admin access for management
Allow group AI-Admins to manage generative-ai-agent-family in compartment AI
```

### 2. Data Classification
- Don't include PII in knowledge bases unless necessary
- Implement data masking for sensitive information
- Use separate KBs for different sensitivity levels

### 3. Audit Logging
Enable audit logging for all agent interactions:
- Who queried what
- What was retrieved
- What was generated

## Pricing Considerations

### Cost Components
1. **Knowledge Base Storage**: Object Storage costs
2. **Embedding Generation**: Per-token for initial indexing
3. **Agent Endpoints**: Per-hour hosting
4. **Inference**: Per-token for responses

### Optimization Tips
- Use appropriate chunk sizes (balance accuracy vs. tokens)
- Implement caching for common queries
- Monitor and prune unused knowledge bases
- Right-size agent endpoints for traffic

## Resources

- [GenAI Agents Overview](https://docs.oracle.com/en-us/iaas/Content/generative-ai-agents/overview.htm)
- [Managing Knowledge Bases](https://docs.oracle.com/en-us/iaas/Content/generative-ai-agents/knowledge-bases.htm)
- [RAG Tool Guide](https://docs.oracle.com/en-us/iaas/Content/generative-ai-agents/RAG-tool.htm)
- [OCI GenAI Agents RAG Blog](https://blogs.oracle.com/ai-and-datascience/oci-generative-ai-agents-rag-service)
