# Solution Example: Enterprise Customer Support AI

## Executive Summary

**Client**: Large retail company with 500K+ monthly customer inquiries
**Challenge**: High support costs, inconsistent responses, long wait times
**Solution**: OCI GenAI-powered support system with RAG
**Results**: 65% cost reduction, 90% faster response, 40% ticket deflection

## Business Requirements

| Requirement | Specification |
|-------------|---------------|
| Languages | English, Spanish |
| Response Time | < 3 seconds |
| Accuracy | > 95% for common questions |
| Volume | 500K queries/month |
| Integration | Salesforce, Zendesk |
| Compliance | SOC 2, CCPA |

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    CUSTOMER SUPPORT AI ARCHITECTURE                      │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ Customer Channels                                                 │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐             │   │
│  │  │   Web   │  │  Mobile │  │  Email  │  │   Chat  │             │   │
│  │  │  Widget │  │   App   │  │  Parser │  │   Bot   │             │   │
│  │  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘             │   │
│  └───────┼────────────┼────────────┼────────────┼───────────────────┘   │
│          └────────────┴─────┬──────┴────────────┘                       │
│                             ▼                                            │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ API Gateway (OCI)                                                 │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐             │   │
│  │  │  Auth   │  │  Rate   │  │  Route  │  │  Cache  │             │   │
│  │  │         │  │  Limit  │  │         │  │         │             │   │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘             │   │
│  └──────────────────────────────┬───────────────────────────────────┘   │
│                                 ▼                                        │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ AI Processing Layer (Private Subnet)                             │   │
│  │                                                                   │   │
│  │  ┌─────────────────┐    ┌─────────────────┐                      │   │
│  │  │ Intent Router   │───▶│ OCI GenAI Agent │                      │   │
│  │  │ (OCI Functions) │    │ (Command R+)    │                      │   │
│  │  └─────────────────┘    └────────┬────────┘                      │   │
│  │                                  │                                │   │
│  │         ┌────────────────────────┼────────────────────────┐      │   │
│  │         ▼                        ▼                        ▼      │   │
│  │  ┌─────────────┐         ┌─────────────┐         ┌─────────────┐ │   │
│  │  │ Knowledge   │         │ Knowledge   │         │ Knowledge   │ │   │
│  │  │ Base: FAQs  │         │ Base: Docs  │         │ Base: Policy│ │   │
│  │  └─────────────┘         └─────────────┘         └─────────────┘ │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                 │                                        │
│                                 ▼                                        │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ Integration Layer                                                 │   │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │   │
│  │  │ Salesforce  │    │  Zendesk    │    │  Analytics  │          │   │
│  │  │ Connector   │    │  Connector  │    │  (OCI)      │          │   │
│  │  └─────────────┘    └─────────────┘    └─────────────┘          │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

## D2 Diagram Source

```d2
direction: down

# Title
title: Customer Support AI - OCI GenAI {
  shape: text
  near: top-center
  style.font-size: 24
}

# Customer Layer
customers: Customer Channels {
  style.fill: "#E8F5E9"

  web: Web Widget
  mobile: Mobile App
  email: Email Parser
  chat: Chat Bot
}

# Gateway Layer
gateway: API Gateway {
  style.fill: "#E3F2FD"

  auth: Authentication
  rate: Rate Limiting
  route: Routing
  cache: Response Cache
}

# AI Layer
ai: AI Processing {
  style.fill: "#FFF3E0"

  router: Intent Router {
    shape: hexagon
  }

  genai: OCI GenAI Agent {
    shape: cylinder
    style.fill: "#FF6B00"
    style.font-color: white
  }

  kb_faqs: KB: FAQs
  kb_docs: KB: Product Docs
  kb_policy: KB: Policies

  router -> genai
  genai -> kb_faqs
  genai -> kb_docs
  genai -> kb_policy
}

# Integration Layer
integrations: Integrations {
  style.fill: "#F3E5F5"

  salesforce: Salesforce
  zendesk: Zendesk
  analytics: OCI Analytics
}

# Connections
customers -> gateway: HTTPS
gateway -> ai: Internal
ai -> integrations: Events
```

## Component Details

### 1. OCI GenAI Dedicated AI Cluster

```hcl
# Terraform configuration
resource "oci_generative_ai_dedicated_ai_cluster" "support" {
  compartment_id = var.compartment_id
  type           = "HOSTING"
  unit_count     = 15  # Sized for 500K/month
  unit_shape     = "LARGE_COHERE"
  display_name   = "customer-support-dac"
}
```

**Sizing Rationale**:
- 500K queries/month = ~700 queries/hour average
- Peak: 3x average = 2,100 queries/hour
- 15 units provides headroom for peaks

### 2. Knowledge Bases

| Knowledge Base | Documents | Purpose |
|----------------|-----------|---------|
| FAQs | 500 Q&A pairs | Common questions |
| Product Docs | 2,000 pages | Product information |
| Policies | 200 pages | Returns, warranty, etc. |

### 3. Intent Classification

```python
# intent_router.py
INTENT_CATEGORIES = {
    "order_status": {
        "keywords": ["order", "tracking", "delivery", "shipping"],
        "action": "lookup_order",
        "kb": "none"  # Direct API call
    },
    "product_info": {
        "keywords": ["product", "feature", "specification", "compare"],
        "action": "rag_query",
        "kb": "product_docs"
    },
    "returns": {
        "keywords": ["return", "refund", "exchange", "warranty"],
        "action": "rag_query",
        "kb": "policies"
    },
    "general": {
        "keywords": [],
        "action": "rag_query",
        "kb": "faqs"
    }
}

def route_query(query: str) -> dict:
    """Route query to appropriate handler."""

    query_lower = query.lower()

    for intent, config in INTENT_CATEGORIES.items():
        if any(kw in query_lower for kw in config["keywords"]):
            return {
                "intent": intent,
                "action": config["action"],
                "kb": config["kb"]
            }

    return {
        "intent": "general",
        "action": "rag_query",
        "kb": "faqs"
    }
```

## Cost Analysis

### Monthly Costs

| Component | Cost | Notes |
|-----------|------|-------|
| OCI GenAI DAC (15 units) | $22,500 | Fixed monthly |
| Object Storage (100GB) | $25 | Document storage |
| API Gateway | $150 | Based on calls |
| Functions | $200 | Processing |
| Logging/Monitoring | $100 | Observability |
| **Total OCI** | **$22,975** | |

### ROI Calculation

| Metric | Before | After |
|--------|--------|-------|
| Cost per query | $2.50 | $0.05 |
| Queries handled by AI | 0% | 70% |
| Agent handle time | 8 min | 3 min |
| Monthly support cost | $125,000 | $43,750 |
| **Monthly savings** | | **$81,250** |

**Payback Period**: < 1 month

## Implementation Timeline

### Phase 1: Foundation (Weeks 1-2)
- [ ] Deploy OCI infrastructure (Terraform)
- [ ] Configure VCN, subnets, security
- [ ] Set up GenAI DAC cluster
- [ ] Create knowledge base structure

### Phase 2: Content (Weeks 3-4)
- [ ] Ingest FAQ documents
- [ ] Ingest product documentation
- [ ] Ingest policy documents
- [ ] Configure chunking and indexing

### Phase 3: Agent Development (Weeks 5-6)
- [ ] Create GenAI agent
- [ ] Configure RAG tools
- [ ] Develop intent router
- [ ] Implement API Gateway

### Phase 4: Integration (Weeks 7-8)
- [ ] Salesforce integration
- [ ] Zendesk integration
- [ ] Analytics setup
- [ ] Monitoring dashboards

### Phase 5: Testing & Launch (Weeks 9-10)
- [ ] Quality testing
- [ ] Load testing
- [ ] Soft launch (10% traffic)
- [ ] Full rollout

## Security Considerations

1. **Data Protection**
   - All data encrypted at rest (OCI Vault)
   - TLS 1.3 for all communications
   - PII redaction in logs

2. **Access Control**
   - OAuth 2.0 for API access
   - Role-based access for admin
   - Audit logging enabled

3. **AI Safety**
   - Content moderation enabled
   - Prompt injection defense
   - Human escalation for sensitive topics

## Monitoring & Alerts

```yaml
# Key metrics to monitor
metrics:
  - name: response_latency_p95
    threshold: 3000ms
    alert: warning

  - name: error_rate
    threshold: 1%
    alert: critical

  - name: deflection_rate
    threshold: 60%
    alert: info  # Below target

  - name: customer_satisfaction
    threshold: 4.0
    alert: warning  # Below target
```

## Lessons Learned

1. **Start with high-quality FAQs** - 80% of queries hit 20% of content
2. **Implement caching early** - 30% hit rate reduced costs significantly
3. **Human escalation is critical** - Build clear handoff paths
4. **Monitor hallucinations** - Weekly quality reviews essential
5. **Iterate on system prompts** - Small tweaks had big impact

## Files & References

- Architecture: `examples/customer-support-ai.md` (this file)
- Terraform: `templates/terraform/oci-rag-system/`
- D2 Diagram: `templates/d2/customer-support-ai.d2`
- Prompts: `prompts/build-rag.md`
