---
name: multi-cloud-setup
description: Configure multi-cloud AI architecture
---

# Multi-Cloud AI Setup Workflow

You are the Multi-Cloud AI Architect configuring AI workloads across cloud providers.

## Pre-Setup Checklist

Before proceeding, confirm:
- [ ] Accounts in required cloud providers (OCI, AWS, Azure, GCP)
- [ ] Network connectivity requirements understood
- [ ] Data residency requirements documented
- [ ] Budget for cross-cloud egress

## Discovery Questions

### 1. Cloud Provider Selection
Ask user:
- Which clouds do you currently use?
- Any contractual commitments or credits?
- Regulatory requirements for data location?
- Existing expertise in team?

### 2. Workload Analysis
- What AI workloads need deployment?
- Expected traffic volume per region?
- Latency requirements?
- Data gravity (where does data live)?

### 3. Integration Requirements
- Need real-time cross-cloud communication?
- Shared identity/SSO requirement?
- Central monitoring preference?

## Provider Selection Matrix

| Workload | Best Provider | Why |
|----------|--------------|-----|
| GenAI (Cost Optimized) | OCI | 2-4x cheaper than Azure OpenAI |
| GPT-4/GPT-4o | Azure OpenAI | Exclusive access |
| Claude | AWS Bedrock | Native integration |
| Document AI | GCP | Document AI best in class |
| GPU Training | OCI | Price-performance leader |
| Enterprise with Azure Stack | Azure + OCI | Interconnect ready |

## Architecture Patterns

### Pattern 1: OCI Primary + Azure OpenAI
```
Best for: Organizations needing GPT-4 and cost-efficient GenAI

┌─────────────────────────────────────────────────────────┐
│                    AI Gateway (OCI)                      │
│                                                          │
│  ┌─────────────────┐        ┌─────────────────┐        │
│  │   Route Logic   │◄──────►│    Rate Limit   │        │
│  └────────┬────────┘        └─────────────────┘        │
└───────────┼──────────────────────────────────────────────┘
            │
    ┌───────┴───────┐
    ▼               ▼
┌─────────┐   ┌─────────────────┐
│ OCI     │   │ Azure OpenAI    │
│ GenAI   │   │ (via Interconn) │
│ DAC     │   │                 │
└─────────┘   └─────────────────┘
   80%             20%
(High volume)  (Complex reasoning)
```

### Pattern 2: Multi-Region with Failover
```
Best for: High availability requirements

          Primary: US-Chicago-1 (OCI)
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
   ┌─────────┐           ┌─────────────┐
   │ OCI DAC │           │ Azure       │
   │ (Active)│           │ (Standby)   │
   └─────────┘           └─────────────┘
        │                       │
        └───────────┬───────────┘
                    │
              Load Balancer
              (Health-based)
```

### Pattern 3: Data Gravity Model
```
Best for: Large data volumes, egress optimization

┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│  AWS Region   │     │  OCI Region   │     │ Azure Region  │
│               │     │               │     │               │
│ ┌───────────┐ │     │ ┌───────────┐ │     │ ┌───────────┐ │
│ │ S3 Data   │ │     │ │ OS Data   │ │     │ │ Blob Data │ │
│ │ 500TB     │ │     │ │ 200TB     │ │     │ │ 300TB     │ │
│ └───────────┘ │     │ └───────────┘ │     │ └───────────┘ │
│       │       │     │       │       │     │       │       │
│       ▼       │     │       ▼       │     │       ▼       │
│ ┌───────────┐ │     │ ┌───────────┐ │     │ ┌───────────┐ │
│ │ Bedrock   │ │     │ │ OCI GenAI │ │     │ │ Azure OAI │ │
│ │ Claude    │ │     │ │ Command R │ │     │ │ GPT-4     │ │
│ └───────────┘ │     │ └───────────┘ │     │ └───────────┘ │
└───────────────┘     └───────────────┘     └───────────────┘

Rule: Process data where it lives to minimize egress
```

## Network Configuration

### OCI-Azure Interconnect Setup

```hcl
# oci_azure_interconnect.tf

# OCI Side: FastConnect
resource "oci_core_virtual_circuit" "azure_interconnect" {
  compartment_id       = var.compartment_id
  type                 = "PRIVATE"
  bandwidth_shape_name = "10 Gbps"

  cross_connect_mappings {
    customer_bgp_peering_ip = "169.254.0.1/30"
    oracle_bgp_peering_ip   = "169.254.0.2/30"
  }

  provider_service_id = data.oci_core_fast_connect_provider_services.azure.services[0].id

  display_name = "Azure-Interconnect"
}

# Azure Side: ExpressRoute
resource "azurerm_express_route_circuit" "oci_interconnect" {
  name                  = "oci-interconnect"
  resource_group_name   = azurerm_resource_group.main.name
  location              = "eastus"
  service_provider_name = "Oracle Cloud FastConnect"
  peering_location      = "Washington DC"
  bandwidth_in_mbps     = 10000

  sku {
    tier   = "Premium"
    family = "MeteredData"
  }
}
```

### VPN Fallback (AWS/GCP)

```hcl
# vpn_fallback.tf

resource "oci_core_ipsec" "aws_vpn" {
  compartment_id = var.compartment_id
  cpe_id         = oci_core_cpe.aws.id
  drg_id         = oci_core_drg.main.id

  static_routes = ["10.0.0.0/8"]  # AWS CIDR

  display_name = "AWS-VPN-Backup"
}
```

## Identity Federation

### Cross-Cloud SSO Setup

```yaml
# Identity federation architecture
Federation Hub: OCI IAM Identity Domains

Providers:
  - Azure AD (via SAML 2.0)
  - AWS IAM Identity Center
  - GCP Cloud Identity

User Flow:
  1. User authenticates to OCI Identity Domain
  2. SAML assertion generated
  3. Cloud-specific role assumed
  4. Access granted with mapped permissions
```

## Cost Optimization Strategies

### Egress Reduction

| Strategy | Savings | Implementation |
|----------|---------|----------------|
| OCI-Azure Interconnect | 100% on interconnect | Setup FastConnect+ExpressRoute |
| Data Processing at Source | 80-100% | Deploy compute near data |
| Caching Layer | 40-60% | Redis/Memcached for common queries |
| Compression | 30-50% | Gzip API responses |
| Batch Processing | 20-40% | Aggregate requests |

### Model Routing for Cost

```python
# cost_based_routing.py

def route_to_provider(request):
    """Route to cheapest provider meeting requirements."""

    complexity = analyze_complexity(request.prompt)

    if complexity == "simple":
        # Use cheapest: OCI Command Light
        return "oci_command_light"

    elif complexity == "medium":
        # Use balanced: OCI Command R
        return "oci_command_r"

    elif complexity == "complex" and request.needs_gpt4:
        # Use premium: Azure GPT-4
        return "azure_gpt4"

    else:
        # Default: OCI Command R+
        return "oci_command_r_plus"

# Cost comparison (per 1M tokens)
COSTS = {
    "oci_command_light": {"input": 0.30, "output": 0.60},
    "oci_command_r": {"input": 1.50, "output": 7.50},
    "oci_command_r_plus": {"input": 3.00, "output": 15.00},
    "azure_gpt4": {"input": 10.00, "output": 30.00},
}
```

## Monitoring & Observability

### Unified Dashboard

```yaml
# Multi-cloud monitoring stack
Metrics Collection:
  - OCI: Monitoring Service + Telemetry
  - AWS: CloudWatch
  - Azure: Azure Monitor

Central Aggregation:
  - Option 1: Grafana Cloud (recommended)
  - Option 2: Datadog
  - Option 3: OCI Stack with custom collectors

Key Metrics:
  - Request latency by provider
  - Cost per request
  - Error rates by provider
  - Cross-cloud latency
```

## Implementation Steps

### Step 1: Network Foundation
```bash
# Deploy network connectivity
cd templates/terraform/multi-cloud-network
terraform init
terraform apply -var-file=your-config.tfvars
```

### Step 2: Identity Federation
```bash
# Configure SSO
cd templates/terraform/multi-cloud-identity
terraform init
terraform apply -var-file=your-config.tfvars
```

### Step 3: AI Gateway Deployment
```bash
# Deploy routing layer
cd templates/terraform/ai-gateway
terraform init
terraform apply -var-file=your-config.tfvars
```

### Step 4: Provider Endpoints
```bash
# Deploy AI services
cd templates/terraform/oci-genai-dac  # OCI
cd templates/terraform/azure-openai    # Azure (if needed)
```

### Step 5: Testing & Validation
```bash
# Run connectivity tests
./scripts/test-multi-cloud.sh
```

## Output Deliverables

After completion, you'll have:
- [ ] Connected multi-cloud network
- [ ] Federated identity across providers
- [ ] AI Gateway with smart routing
- [ ] Cost-optimized AI endpoints
- [ ] Unified monitoring dashboard
- [ ] Operations runbook

## Reference

- Knowledge: `knowledge-base/multi-cloud/MULTI-CLOUD-AI-PATTERNS.md`
- Skill: `skills/agentic-orchestration/SKILL.md`
- Templates: `templates/terraform/multi-cloud-*/`
