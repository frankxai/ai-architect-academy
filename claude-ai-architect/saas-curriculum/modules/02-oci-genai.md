# Module 2: OCI GenAI Mastery

## 2.1 OCI GenAI Service Overview

### Learning Objectives
- Understand OCI GenAI service architecture
- Compare on-demand vs dedicated hosting
- Navigate the GenAI console and APIs

### OCI GenAI Architecture

```
┌───────────────────────────────────────────────────────────────────┐
│                     OCI GENERATIVE AI SERVICE                      │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                    INFERENCE LAYER                           │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │  │
│  │  │  On-Demand   │  │   Dedicated  │  │   Custom     │       │  │
│  │  │  Hosting     │  │   AI Cluster │  │   Endpoints  │       │  │
│  │  │  (Shared)    │  │   (DAC)      │  │              │       │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘       │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                      MODEL LAYER                             │  │
│  │  Cohere: Command R+, R, Light, Embed                        │  │
│  │  Meta: Llama 3.1 (8B, 70B, 405B)                           │  │
│  │  Custom: Fine-tuned models                                  │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                    AGENTS LAYER                              │  │
│  │  Knowledge Bases │ RAG Tools │ Function Calling             │  │
│  └─────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────┘
```

### On-Demand vs Dedicated AI Clusters

| Feature | On-Demand | Dedicated AI Cluster |
|---------|-----------|---------------------|
| Cost Model | Pay-per-token | Committed capacity |
| Performance | Shared resources | Guaranteed throughput |
| Customization | Limited | Full control |
| Fine-Tuning | Not supported | Supported |
| Best For | Dev/test, low volume | Production, high volume |

### Available Models (January 2025)

| Model | Parameters | Specialization | Context |
|-------|------------|----------------|---------|
| Command R+ | 104B | Complex reasoning | 128K |
| Command R | 35B | General purpose | 128K |
| Command Light | 6B | High throughput | 4K |
| Embed v3 | - | Embeddings | - |
| Llama 3.1 70B | 70B | Open source | 128K |

---

## 2.2 Dedicated AI Clusters (DACs)

### What is a DAC?

A Dedicated AI Cluster provides:
- **Guaranteed capacity**: No noisy neighbors
- **Fine-tuning support**: Customize with your data
- **Multiple endpoints**: Deploy different models
- **Predictable costs**: Fixed monthly pricing

### DAC Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                 DEDICATED AI CLUSTER (DAC)                       │
│                                                                  │
│  ┌──────────────────┐                                           │
│  │  Hosting Cluster │ ◀── Unit-based capacity                   │
│  │  (5-50 units)    │     Each unit = 1 endpoint capacity       │
│  └──────────────────┘                                           │
│           │                                                      │
│           ▼                                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    ENDPOINTS                               │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐      │   │
│  │  │Command  │  │Command  │  │Llama    │  │Custom   │      │   │
│  │  │R+       │  │R        │  │3.1 70B  │  │Fine-Tune│      │   │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘      │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Sizing Guide

| Workload | Units | Monthly Cost | Use Case |
|----------|-------|--------------|----------|
| Dev/Test | 2-5 | $3-7.5K | Prototyping |
| Small Prod | 5-10 | $7.5-15K | Internal apps |
| Medium Prod | 10-20 | $15-30K | Customer-facing |
| Large Prod | 20-30 | $30-45K | High volume |
| Enterprise | 30-50 | $45-75K | Mission critical |

### Creating a DAC with Terraform

```hcl
# terraform/oci-genai-dac/main.tf

resource "oci_generative_ai_dedicated_ai_cluster" "main" {
  compartment_id = var.compartment_id
  display_name   = "${var.project_name}-dac"
  type           = "HOSTING"

  unit_count = var.unit_count
  unit_shape {
    model_id = data.oci_generative_ai_model.command_r_plus.id
  }

  freeform_tags = {
    Project     = var.project_name
    Environment = var.environment
  }
}

resource "oci_generative_ai_endpoint" "inference" {
  compartment_id         = var.compartment_id
  dedicated_ai_cluster_id = oci_generative_ai_dedicated_ai_cluster.main.id
  display_name           = "${var.project_name}-endpoint"

  model_id = data.oci_generative_ai_model.command_r_plus.id
}
```

### Exercise: Design DAC Architecture

Design a DAC for a customer support system:
- Expected: 1M requests/month
- Peak: 10x during business hours
- Latency: < 2 seconds
- Budget: $20K/month

---

## 2.3 RAG Systems with OCI GenAI Agents

### RAG Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      RAG SYSTEM FLOW                             │
│                                                                  │
│  User Query                                                      │
│      │                                                           │
│      ▼                                                           │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │   Embed     │───▶│   Vector    │───▶│  Retrieve   │         │
│  │   Query     │    │   Search    │    │  Context    │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
│                                               │                  │
│                                               ▼                  │
│                     ┌─────────────────────────────┐             │
│                     │   Augmented Prompt          │             │
│                     │   Query + Retrieved Context │             │
│                     └─────────────────────────────┘             │
│                                               │                  │
│                                               ▼                  │
│                     ┌─────────────────────────────┐             │
│                     │   LLM Generation            │             │
│                     │   (OCI GenAI / DAC)         │             │
│                     └─────────────────────────────┘             │
│                                               │                  │
│                                               ▼                  │
│                           Response to User                       │
└─────────────────────────────────────────────────────────────────┘
```

### OCI GenAI Agents Components

1. **Knowledge Base**: Document store with automatic chunking
2. **Data Source**: Object Storage bucket with documents
3. **RAG Tool**: Retrieval configuration
4. **Agent Endpoint**: Chat interface

### Creating a Knowledge Base

```python
# SDK Example
from oci import generative_ai_agent

# Create knowledge base
kb = client.create_knowledge_base(
    compartment_id=compartment_id,
    display_name="support-kb",
    description="Customer support documentation"
)

# Add data source (Object Storage)
ds = client.create_data_source(
    knowledge_base_id=kb.id,
    data_source_config={
        "type": "OCI_OBJECT_STORAGE",
        "bucket": "support-docs",
        "prefix": "knowledge/"
    }
)
```

### Chunking Strategies

| Strategy | Chunk Size | Overlap | Best For |
|----------|------------|---------|----------|
| Small | 256 tokens | 32 | Q&A, FAQs |
| Medium | 512 tokens | 64 | Articles |
| Large | 1024 tokens | 128 | Documents |
| Semantic | Variable | - | Mixed content |

---

## 2.4 Fine-Tuning Models on OCI

### When to Fine-Tune

- Domain-specific vocabulary
- Consistent output format
- Brand voice/tone
- Specialized tasks

### Fine-Tuning Process

```
┌─────────────────────────────────────────────────────────────────┐
│                   FINE-TUNING PIPELINE                           │
│                                                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │   Prepare   │───▶│   Upload    │───▶│   Create    │         │
│  │   Dataset   │    │   to OCI    │    │   Training  │         │
│  │   (JSONL)   │    │             │    │   Job       │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
│                                               │                  │
│                                               ▼                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │   Deploy    │◀───│   Evaluate  │◀───│   Train     │         │
│  │   Model     │    │   Results   │    │   (GPU)     │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

### Dataset Format

```jsonl
{"prompt": "User: What's the return policy?\nAssistant:", "completion": "Our return policy allows returns within 30 days..."}
{"prompt": "User: How do I track my order?\nAssistant:", "completion": "You can track your order by..."}
```

### Assessment

- [ ] Can explain DAC architecture
- [ ] Understand RAG system components
- [ ] Know when to fine-tune
- [ ] Can size a DAC for requirements

---

*Module 2 Complete - You're now an OCI GenAI specialist!*
