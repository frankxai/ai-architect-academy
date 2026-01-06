# Solution Example: Multi-Cloud AI Analytics Platform

## Executive Summary

**Client**: Financial services firm with hybrid cloud infrastructure
**Challenge**: AI capabilities split across Azure and OCI, high egress costs
**Solution**: Unified AI Gateway with intelligent routing
**Results**: 45% cost reduction, unified API, improved latency

## Business Requirements

| Requirement | Specification |
|-------------|---------------|
| Existing Infra | Azure (data warehouse), OCI (compute) |
| AI Workloads | Document analysis, risk scoring, chatbot |
| Data Volume | 50TB in Azure, 20TB in OCI |
| Latency | < 500ms for real-time scoring |
| Compliance | SOX, PCI-DSS |

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MULTI-CLOUD AI ANALYTICS PLATFORM                         │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ Applications                                                            │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐              │ │
│  │  │ Trading  │  │   Risk   │  │ Customer │  │ Internal │              │ │
│  │  │ Platform │  │  Engine  │  │  Portal  │  │   Apps   │              │ │
│  │  └─────┬────┘  └─────┬────┘  └────┬─────┘  └────┬─────┘              │ │
│  └────────┼─────────────┼────────────┼─────────────┼─────────────────────┘ │
│           └─────────────┴─────┬──────┴─────────────┘                       │
│                               ▼                                             │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ AI Gateway (OCI)                                                        │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐              │ │
│  │  │   Auth   │  │  Router  │  │  Cache   │  │ Fallback │              │ │
│  │  └──────────┘  └────┬─────┘  └──────────┘  └──────────┘              │ │
│  └─────────────────────┼───────────────────────────────────────────────────┘ │
│                        │                                                     │
│         ┌──────────────┼──────────────┐                                     │
│         ▼              ▼              ▼                                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                           │
│  │   ORACLE    │ │   AZURE     │ │    AWS      │                           │
│  │   CLOUD     │ │             │ │  (Backup)   │                           │
│  └─────────────┘ └─────────────┘ └─────────────┘                           │
│         │              │              │                                     │
│  ┌──────┴──────┐ ┌─────┴─────┐ ┌─────┴─────┐                               │
│  │ GenAI DAC   │ │ Azure     │ │ Bedrock   │                               │
│  │ Command R+  │ │ OpenAI    │ │ Claude    │                               │
│  │             │ │ GPT-4     │ │ (Fallback)│                               │
│  └─────────────┘ └───────────┘ └───────────┘                               │
│         │              │                                                    │
│  ┌──────┴──────┐ ┌─────┴─────┐                                             │
│  │ OCI Object  │ │ Azure     │                                             │
│  │ Storage     │ │ Blob/SQL  │                                             │
│  │ (20TB)      │ │ (50TB)    │                                             │
│  └─────────────┘ └───────────┘                                             │
│         │              │                                                    │
│         └──────┬───────┘                                                    │
│                ▼                                                            │
│  ┌──────────────────────┐                                                  │
│  │ OCI-Azure Interconn  │ ◄─── 2ms latency, no egress fees                │
│  │ (10 Gbps)            │                                                  │
│  └──────────────────────┘                                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Routing Strategy

### Cost-Based Routing Logic

```python
# multi_cloud_router.py

class MultiCloudRouter:
    """Intelligent routing across cloud providers."""

    PROVIDERS = {
        "oci_command_r_plus": {
            "cost_per_1k_input": 0.003,
            "cost_per_1k_output": 0.015,
            "latency_ms": 150,
            "capabilities": ["reasoning", "analysis", "multilingual"],
            "data_location": "oci"
        },
        "oci_command_light": {
            "cost_per_1k_input": 0.0003,
            "cost_per_1k_output": 0.0006,
            "latency_ms": 80,
            "capabilities": ["classification", "extraction", "simple"],
            "data_location": "oci"
        },
        "azure_gpt4_turbo": {
            "cost_per_1k_input": 0.01,
            "cost_per_1k_output": 0.03,
            "latency_ms": 200,
            "capabilities": ["reasoning", "code", "creative"],
            "data_location": "azure"
        },
        "azure_gpt35_turbo": {
            "cost_per_1k_input": 0.0005,
            "cost_per_1k_output": 0.0015,
            "latency_ms": 100,
            "capabilities": ["chat", "simple", "fast"],
            "data_location": "azure"
        }
    }

    EGRESS_COST_PER_GB = {
        "oci_to_azure": 0,      # Interconnect - free
        "azure_to_oci": 0,      # Interconnect - free
        "oci_to_aws": 0.0085,   # Standard egress
        "azure_to_aws": 0.087,  # Standard egress
    }

    def route(self, request: dict) -> str:
        """Select optimal provider based on requirements and cost."""

        task_type = self.classify_task(request["prompt"])
        data_source = request.get("data_source", "none")
        priority = request.get("priority", "cost")  # cost, latency, quality

        # Filter providers by capability
        eligible = [
            (name, config)
            for name, config in self.PROVIDERS.items()
            if task_type in config["capabilities"]
        ]

        if not eligible:
            eligible = list(self.PROVIDERS.items())

        # Calculate total cost including egress
        def total_cost(provider_name, config):
            input_tokens = len(request["prompt"].split()) * 1.3
            output_tokens = request.get("max_tokens", 500)

            # API cost
            api_cost = (
                (input_tokens / 1000) * config["cost_per_1k_input"] +
                (output_tokens / 1000) * config["cost_per_1k_output"]
            )

            # Egress cost (if data needs to move)
            egress_cost = 0
            if data_source != "none" and data_source != config["data_location"]:
                # Estimate data size (rough: 1KB per 200 tokens)
                data_size_gb = (input_tokens / 200) / 1024 / 1024
                route_key = f"{data_source}_to_{config['data_location']}"
                egress_cost = data_size_gb * self.EGRESS_COST_PER_GB.get(route_key, 0.09)

            return api_cost + egress_cost

        # Sort by priority
        if priority == "cost":
            eligible.sort(key=lambda x: total_cost(x[0], x[1]))
        elif priority == "latency":
            eligible.sort(key=lambda x: x[1]["latency_ms"])
        elif priority == "quality":
            # Prefer more expensive (usually higher quality)
            eligible.sort(key=lambda x: -total_cost(x[0], x[1]))

        selected = eligible[0][0]

        return selected

    def classify_task(self, prompt: str) -> str:
        """Classify the task type from prompt."""

        prompt_lower = prompt.lower()

        if any(kw in prompt_lower for kw in ["classify", "categorize", "label"]):
            return "classification"
        elif any(kw in prompt_lower for kw in ["extract", "find", "identify"]):
            return "extraction"
        elif any(kw in prompt_lower for kw in ["analyze", "explain", "why"]):
            return "reasoning"
        elif any(kw in prompt_lower for kw in ["write", "create", "generate"]):
            return "creative"
        elif any(kw in prompt_lower for kw in ["code", "function", "script"]):
            return "code"
        else:
            return "simple"
```

## OCI-Azure Interconnect Setup

### Network Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    NETWORK INTERCONNECT                          │
│                                                                  │
│  ┌─────────────────────────┐    ┌─────────────────────────┐    │
│  │      OCI Region         │    │     Azure Region        │    │
│  │    (US-Chicago-1)       │    │     (East US)           │    │
│  │                         │    │                         │    │
│  │  ┌─────────────────┐   │    │   ┌─────────────────┐   │    │
│  │  │ VCN             │   │    │   │ VNet            │   │    │
│  │  │ 10.0.0.0/16     │   │    │   │ 10.1.0.0/16     │   │    │
│  │  │                 │   │    │   │                 │   │    │
│  │  │ ┌─────────────┐ │   │    │   │ ┌─────────────┐ │   │    │
│  │  │ │ GenAI DAC   │ │   │    │   │ │ Azure OAI   │ │   │    │
│  │  │ │ 10.0.1.x    │ │   │    │   │ │ 10.1.1.x    │ │   │    │
│  │  │ └─────────────┘ │   │    │   │ └─────────────┘ │   │    │
│  │  │                 │   │    │   │                 │   │    │
│  │  │ ┌─────────────┐ │   │    │   │ ┌─────────────┐ │   │    │
│  │  │ │ DRG         │ │◄──────────►│ │ ExpressRoute│ │   │    │
│  │  │ └─────────────┘ │   │    │   │ │ Gateway     │ │   │    │
│  │  └─────────────────┘   │    │   │ └─────────────┘ │   │    │
│  │                         │    │   └─────────────────┘   │    │
│  └─────────────────────────┘    └─────────────────────────┘    │
│                                                                  │
│  Connection: Oracle FastConnect ◄─► Azure ExpressRoute          │
│  Bandwidth: 10 Gbps                                             │
│  Latency: ~2ms                                                  │
│  Egress: $0 (no data transfer charges)                          │
└─────────────────────────────────────────────────────────────────┘
```

### Terraform Configuration

```hcl
# oci_azure_interconnect.tf

# OCI Dynamic Routing Gateway
resource "oci_core_drg" "main" {
  compartment_id = var.compartment_id
  display_name   = "azure-interconnect-drg"
}

# Attach DRG to VCN
resource "oci_core_drg_attachment" "vcn" {
  drg_id       = oci_core_drg.main.id
  vcn_id       = oci_core_vcn.main.id
  display_name = "vcn-attachment"
}

# FastConnect Virtual Circuit
resource "oci_core_virtual_circuit" "azure" {
  compartment_id       = var.compartment_id
  type                 = "PRIVATE"
  bandwidth_shape_name = "10 Gbps"

  cross_connect_mappings {
    customer_bgp_peering_ip = "169.254.21.1/30"
    oracle_bgp_peering_ip   = "169.254.21.2/30"
  }

  gateway_id = oci_core_drg.main.id

  # Azure ExpressRoute provider
  provider_service_id = data.oci_core_fast_connect_provider_services.azure.services[0].id

  display_name = "azure-expressroute"
}

# Route table for Azure traffic
resource "oci_core_route_table" "azure" {
  compartment_id = var.compartment_id
  vcn_id         = oci_core_vcn.main.id
  display_name   = "azure-routes"

  route_rules {
    destination       = "10.1.0.0/16"  # Azure VNet CIDR
    destination_type  = "CIDR_BLOCK"
    network_entity_id = oci_core_drg.main.id
  }
}
```

## Workload Distribution

| Workload | Provider | Reason |
|----------|----------|--------|
| Document Analysis | OCI Command R+ | Cost efficient, data in OCI |
| Risk Scoring | OCI Command Light | High volume, simple classification |
| Customer Chatbot | Azure GPT-4 | Creative responses, data in Azure |
| Code Generation | Azure GPT-4 | Best code capabilities |
| Batch Processing | OCI Command R | Cost optimized for volume |

## Cost Comparison

### Before: Single Provider (Azure OpenAI)

| Component | Monthly Cost |
|-----------|--------------|
| Azure OpenAI GPT-4 (all workloads) | $85,000 |
| Azure Blob Storage | $2,500 |
| Azure Compute | $15,000 |
| **Total** | **$102,500** |

### After: Multi-Cloud Optimized

| Component | Monthly Cost |
|-----------|--------------|
| OCI GenAI DAC (20 units) | $30,000 |
| Azure OpenAI GPT-4 (20% workloads) | $17,000 |
| OCI-Azure Interconnect | $500 |
| OCI Compute | $5,000 |
| Azure Blob Storage | $2,500 |
| **Total** | **$55,000** |

**Savings: $47,500/month (46%)**

## Failover Strategy

```yaml
# failover_config.yaml
providers:
  primary:
    - name: oci_command_r_plus
      health_check: /v1/health
      timeout_ms: 5000

  secondary:
    - name: azure_gpt4_turbo
      health_check: /health
      timeout_ms: 5000

  tertiary:
    - name: aws_bedrock_claude
      health_check: /health
      timeout_ms: 5000

failover:
  trigger_conditions:
    - error_rate > 5%
    - latency_p99 > 10000ms
    - consecutive_failures > 3

  behavior:
    - log_event: true
    - notify: pagerduty
    - auto_failback: true
    - failback_delay_minutes: 10
```

## Monitoring Dashboard

### Key Metrics by Provider

| Metric | OCI | Azure | Target |
|--------|-----|-------|--------|
| Latency P95 | 180ms | 250ms | < 500ms |
| Error Rate | 0.1% | 0.2% | < 1% |
| Cost/Request | $0.02 | $0.08 | Minimize |
| Traffic % | 75% | 25% | By design |

## Implementation Checklist

### Phase 1: Network Foundation
- [ ] Provision OCI-Azure Interconnect
- [ ] Configure DRG and ExpressRoute
- [ ] Validate network connectivity
- [ ] Test latency and throughput

### Phase 2: AI Gateway
- [ ] Deploy OCI API Gateway
- [ ] Implement routing logic
- [ ] Configure authentication
- [ ] Set up caching layer

### Phase 3: Provider Integration
- [ ] Deploy OCI GenAI DAC
- [ ] Configure Azure OpenAI endpoints
- [ ] Implement health checks
- [ ] Set up failover logic

### Phase 4: Migration
- [ ] Migrate 10% traffic
- [ ] Monitor metrics
- [ ] Adjust routing weights
- [ ] Full migration

## Files & References

- Architecture: `examples/multi-cloud-analytics.md` (this file)
- Gateway: `templates/terraform/ai-gateway/`
- D2 Diagram: `templates/d2/multi-cloud-ai.d2`
- Prompts: `prompts/multi-cloud-setup.md`
