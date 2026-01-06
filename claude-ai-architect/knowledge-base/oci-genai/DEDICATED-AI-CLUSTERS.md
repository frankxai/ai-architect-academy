# OCI Generative AI - Dedicated AI Clusters (DACs)

## Executive Summary

Dedicated AI Clusters (DACs) are the enterprise backbone of Oracle's Generative AI service. They provide private, isolated GPU compute resources exclusively for your tenancy, enabling:
- **Fine-tuning** of foundation models with proprietary data
- **Hosting** production endpoints with guaranteed performance
- **Multi-model deployment** - up to 50 fine-tuned models per cluster

## Why Dedicated AI Clusters?

### The Enterprise Problem
- Shared AI infrastructure raises data privacy concerns
- Unpredictable performance in multi-tenant environments
- Regulatory requirements demand data isolation
- Need for customized models trained on proprietary data

### The DAC Solution
```
┌─────────────────────────────────────────────────────────────┐
│                YOUR OCI TENANCY                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │           DEDICATED AI CLUSTER                       │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │    │
│  │  │   GPU 1     │  │   GPU 2     │  │   GPU N     │  │    │
│  │  │ (Your Data) │  │ (Your Data) │  │ (Your Data) │  │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │    │
│  │         │                │                │          │    │
│  │         ▼                ▼                ▼          │    │
│  │  ┌─────────────────────────────────────────────┐    │    │
│  │  │        YOUR FINE-TUNED MODELS                │    │    │
│  │  │  - Customer Support Bot                      │    │    │
│  │  │  - Legal Document Analyzer                   │    │    │
│  │  │  - Code Generation (Your Patterns)           │    │    │
│  │  └─────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  NO ACCESS FROM OTHER TENANCIES - COMPLETE ISOLATION         │
└─────────────────────────────────────────────────────────────┘
```

## Cluster Types

### 1. Hosting Clusters
**Purpose:** Deploy and serve models in production

**Key Specifications:**
- Up to 50 endpoints per cluster (1 endpoint per unit)
- Stable, high-throughput inference
- Zero-downtime scaling
- Supports: Pretrained, fine-tuned, and imported models

**Use Cases:**
- Production chatbots and assistants
- Real-time content generation
- Document processing pipelines
- Code generation services

### 2. Fine-Tuning Clusters
**Purpose:** Train custom models on your data

**Key Specifications:**
- Specialized GPU configurations for training
- Isolated training environment
- Support for large datasets
- Private to your tenancy

**Use Cases:**
- Domain-specific language models
- Industry terminology adaptation
- Company voice/tone customization
- Specialized task optimization

## Supported Models

### Cohere Models
| Model | Type | Best For |
|-------|------|----------|
| Command R+ | Full-size | Complex reasoning, multi-step tasks |
| Command R | Medium | Balanced performance/cost |
| Command | Standard | General purpose |
| Command Light | Lightweight | Simple tasks, cost optimization |
| Embed | Embeddings | Vector search, RAG |

### Meta Llama Models
| Model | Parameters | Best For |
|-------|------------|----------|
| Llama 3.1 405B | 405 billion | Maximum capability |
| Llama 3.1 70B | 70 billion | Balanced enterprise use |
| Llama 3.1 8B | 8 billion | Cost-effective inference |
| Llama 3.2 | Various | Multimodal (vision + text) |

## Architecture Patterns

### Pattern 1: Single Cluster, Multiple Endpoints
```
DAC Hosting Cluster (50 units)
├── Endpoint 1: Customer Support (Command R+)
├── Endpoint 2: Legal Analysis (Fine-tuned Command)
├── Endpoint 3: Code Review (Llama 70B)
├── Endpoint 4: Content Generation (Fine-tuned Command)
└── ... up to 50 endpoints
```

**Best For:** Varied workloads, cost optimization, shared infrastructure

### Pattern 2: Workload-Specific Clusters
```
DAC 1: Production Traffic (High Throughput)
├── Command R+ endpoints (high volume)
└── Auto-scaling enabled

DAC 2: Batch Processing (Cost Optimized)
├── Command Light endpoints
└── Scheduled workloads

DAC 3: Fine-Tuning (Training)
├── Active training jobs
└── Model iteration
```

**Best For:** Clear workload separation, different SLAs, cost allocation

### Pattern 3: Regional Deployment
```
US-Ashburn DAC
├── North America traffic
└── US data residency

EU-Frankfurt DAC
├── European traffic
└── GDPR compliance

AP-Tokyo DAC
├── Asia-Pacific traffic
└── Local regulations
```

**Best For:** Global enterprises, data sovereignty, latency optimization

## Fine-Tuning Deep Dive

### The Fine-Tuning Process
```
1. Prepare Training Data
   └── JSONL format with prompt/completion pairs

2. Create Fine-Tuning Cluster
   └── OCI Console or Terraform

3. Upload Training Dataset
   └── OCI Object Storage

4. Start Fine-Tuning Job
   └── Select base model + hyperparameters

5. Monitor Progress
   └── Training metrics, loss curves

6. Deploy to Hosting Cluster
   └── Create endpoint from fine-tuned model
```

### Training Data Format
```json
{"prompt": "Summarize the following legal document:", "completion": "This document establishes..."}
{"prompt": "What is Oracle's refund policy?", "completion": "Oracle's refund policy allows..."}
{"prompt": "Generate a sales email for:", "completion": "Dear [Name], I hope this..."}
```

### Best Practices for Fine-Tuning
1. **Quality over quantity** - 100 high-quality examples beat 10,000 mediocre ones
2. **Consistent format** - Use the same prompt structure throughout
3. **Representative examples** - Cover edge cases and variations
4. **Validation set** - Hold out 10-20% for testing
5. **Iterative refinement** - Fine-tune, test, improve, repeat

## Security & Compliance

### Data Isolation
- GPUs dedicated to your tenancy
- No data sharing across tenants
- Private OCI environments
- Network isolation via VCN

### Access Control
```hcl
# IAM Policy for GenAI DAC Management
Allow group AI-Admins to manage generative-ai-family in compartment AI-Workloads
Allow group ML-Engineers to use generative-ai-endpoints in compartment AI-Workloads
Allow group Data-Scientists to read generative-ai-models in compartment AI-Workloads
```

### Compliance Features
- **RBAC** - Role-based access control
- **Audit Logging** - All operations logged
- **Encryption** - Data encrypted at rest and in transit
- **Regional Deployment** - Deploy in regulated regions
- **SOC 2, HIPAA, GDPR** - Enterprise compliance certifications

## Cost Optimization

### Pricing Model
- **Hosting Clusters**: Per-hour pricing based on cluster size
- **Fine-Tuning**: Per-hour for training compute
- **Inference**: Included in hosting cluster cost (no per-token fees)

### Optimization Strategies

#### 1. Right-Size Clusters
```
Assessment Questions:
- What's your peak traffic?
- How many endpoints do you need?
- What's your latency requirement?

Sizing Guide:
- Development: Minimal cluster, 1-5 endpoints
- Production: Medium cluster, 10-20 endpoints
- Enterprise: Large cluster, 30-50 endpoints
```

#### 2. Model Selection
```
Cost vs. Capability:
┌─────────────────┬──────────┬───────────────┐
│ Model           │ Cost     │ Capability    │
├─────────────────┼──────────┼───────────────┤
│ Command Light   │ $        │ Simple tasks  │
│ Command         │ $$       │ General       │
│ Command R       │ $$$      │ Complex       │
│ Command R+      │ $$$$     │ Advanced      │
│ Llama 3.1 8B    │ $        │ Simple        │
│ Llama 3.1 70B   │ $$$      │ Complex       │
│ Llama 3.1 405B  │ $$$$     │ Maximum       │
└─────────────────┴──────────┴───────────────┘

Strategy: Use lighter models for simple tasks, reserve
heavy models for complex reasoning.
```

#### 3. Fine-Tuning ROI
- Fine-tuned smaller models often outperform larger base models
- Train once, deploy many times
- Reduced inference costs with specialized models

## Integration Patterns

### LangChain Integration
```python
from langchain_community.llms import OCIGenAI

llm = OCIGenAI(
    model_id="cohere.command-r-plus",
    service_endpoint="https://inference.generativeai.us-chicago-1.oci.oraclecloud.com",
    compartment_id="ocid1.compartment...",
    auth_type="API_KEY"
)

response = llm.invoke("Explain quantum computing")
```

### LlamaIndex Integration
```python
from llama_index.llms.oci_genai import OCIGenAI

llm = OCIGenAI(
    model="cohere.command-r-plus",
    service_endpoint="https://inference.generativeai.us-chicago-1.oci.oraclecloud.com"
)

# Use in RAG pipeline
index = VectorStoreIndex.from_documents(documents, llm=llm)
query_engine = index.as_query_engine()
```

### REST API
```bash
curl -X POST "https://inference.generativeai.us-chicago-1.oci.oraclecloud.com/20231130/actions/generateText" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "compartmentId": "ocid1.compartment...",
    "servingMode": {
      "servingType": "DEDICATED",
      "endpointId": "ocid1.generativeaiendpoint..."
    },
    "inferenceRequest": {
      "prompt": "Write a poem about clouds",
      "maxTokens": 500
    }
  }'
```

## Monitoring & Operations

### Key Metrics to Monitor
1. **Throughput** - Requests per second
2. **Latency** - P50, P95, P99 response times
3. **Error Rate** - Failed requests percentage
4. **Token Usage** - Input/output token consumption
5. **Cluster Utilization** - GPU usage percentage

### OCI Monitoring Integration
```hcl
# Terraform: Create alarm for high latency
resource "oci_monitoring_alarm" "genai_latency" {
  compartment_id = var.compartment_id
  display_name   = "GenAI-High-Latency"

  query = "GenerativeAILatency[1m].p95() > 5000"

  severity = "CRITICAL"

  destinations = [oci_ons_notification_topic.alerts.id]
}
```

## Terraform Deployment

### Complete DAC Setup
```hcl
# Create Hosting Cluster
resource "oci_generative_ai_dedicated_ai_cluster" "hosting" {
  compartment_id = var.compartment_id
  type           = "HOSTING"

  unit_count = 10
  unit_shape = "LARGE_COHERE"

  display_name = "Production-Hosting-Cluster"

  freeform_tags = {
    "Environment" = "Production"
    "Team"        = "AI-Platform"
  }
}

# Create Endpoint on Cluster
resource "oci_generative_ai_endpoint" "command_r_plus" {
  compartment_id            = var.compartment_id
  dedicated_ai_cluster_id   = oci_generative_ai_dedicated_ai_cluster.hosting.id
  model_id                  = "cohere.command-r-plus"

  display_name = "Command-R-Plus-Production"
}

# Create Fine-Tuning Cluster
resource "oci_generative_ai_dedicated_ai_cluster" "finetuning" {
  compartment_id = var.compartment_id
  type           = "FINE_TUNING"

  unit_count = 2
  unit_shape = "LARGE_COHERE"

  display_name = "Fine-Tuning-Cluster"
}
```

## Decision Framework

### When to Use DACs

**Use Dedicated AI Clusters when:**
- Data privacy/isolation is required
- Need predictable, guaranteed performance
- Fine-tuning with proprietary data
- Running production workloads
- Regulatory compliance requirements
- Hosting multiple custom models

**Consider On-Demand/Shared when:**
- Development and testing
- Low-volume, sporadic usage
- Cost is primary concern
- Standard models sufficient
- Quick prototyping

## Resources

- [OCI GenAI Documentation](https://docs.oracle.com/en-us/iaas/Content/generative-ai/overview.htm)
- [Managing Dedicated AI Clusters](https://docs.oracle.com/en-us/iaas/Content/generative-ai/ai-cluster.htm)
- [GenAI Service Features](https://www.oracle.com/artificial-intelligence/generative-ai/generative-ai-service/features/)
- [DAC Enterprise Guide](https://blogs.oracle.com/ai-and-datascience/oci-generative-ai-dac)
