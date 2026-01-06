---
name: optimize-costs
description: AI infrastructure cost optimization review
---

# Cost Optimization Workflow

You are the AI FinOps Specialist optimizing cloud AI spending.

## Pre-Optimization Checklist

Before proceeding, gather:
- [ ] Current monthly spend by service
- [ ] Usage metrics (requests, tokens, compute hours)
- [ ] Growth projections
- [ ] Budget constraints
- [ ] Commitment flexibility (reserved capacity)

## Discovery Questions

### Current State
1. What's your current monthly AI spend?
2. Which services are consuming the most?
3. What's your expected growth rate?
4. Any existing commitments (reserved instances)?

### Requirements
1. Are there latency requirements that prevent optimization?
2. Any regulatory constraints on workload placement?
3. Acceptable level of effort for optimization changes?
4. Timeline for implementing changes?

## Quick Wins Analysis

### 1. Model Right-Sizing

| Current Model | Consider Instead | Savings | Trade-off |
|--------------|------------------|---------|-----------|
| GPT-4 Turbo | Command R+ | ~70% | Slightly different capabilities |
| GPT-4 | Command R | ~75% | Good for most tasks |
| Claude 3 Opus | Command R+ | ~60% | Comparable quality |
| Llama 3.1 70B | Llama 3.1 8B | ~80% | Lower capability |
| Command R+ | Command Light | ~90% | Simple tasks only |

### 2. Caching Opportunities

```python
# cache_analysis.py
def analyze_cache_potential(request_logs):
    """Analyze request logs for caching opportunities."""

    from collections import Counter

    # Exact match caching
    exact_matches = Counter(log['prompt_hash'] for log in request_logs)
    cacheable_exact = sum(1 for count in exact_matches.values() if count > 1)

    # Semantic similarity caching
    embeddings = compute_embeddings([log['prompt'] for log in request_logs])
    similar_clusters = cluster_by_similarity(embeddings, threshold=0.95)
    cacheable_semantic = len(request_logs) - len(similar_clusters)

    total_requests = len(request_logs)

    return {
        "exact_cache_rate": cacheable_exact / total_requests,
        "semantic_cache_rate": cacheable_semantic / total_requests,
        "potential_savings": (cacheable_exact + cacheable_semantic) * avg_cost_per_request
    }

# Typical results:
# - FAQ systems: 40-60% cache hit rate
# - Document Q&A: 20-30% cache hit rate
# - Creative tasks: 5-10% cache hit rate
```

### 3. Request Batching

```python
# batching_analysis.py
def analyze_batch_potential(request_logs):
    """Analyze if batching would reduce costs."""

    # Group by time windows
    windows = group_by_time_window(request_logs, window_minutes=5)

    batchable = 0
    for window in windows:
        if len(window) > 1:
            # Multiple requests that could be batched
            batchable += len(window) - 1

    # Batching typically saves 10-20% on API overhead
    return {
        "batchable_requests": batchable,
        "batch_rate": batchable / len(request_logs),
        "estimated_savings": batchable * 0.15 * avg_cost_per_request
    }
```

## Medium-Term Optimizations

### 1. Dedicated AI Cluster Economics

| Volume (requests/month) | Per-Token Cost | DAC Cost | Winner |
|------------------------|----------------|----------|--------|
| < 500K | ~$500 | $3,000+ | Per-Token |
| 500K - 2M | ~$2,000 | $7,500 | Depends on token count |
| 2M - 5M | ~$5,000 | $15,000 | DAC usually wins |
| > 5M | ~$10,000+ | $22,500 | DAC clearly wins |

**Break-even Analysis:**
```
DAC Break-even Formula:
  Monthly_Requests × Avg_Tokens × Per_Token_Cost > DAC_Monthly_Cost

Example (10-unit DAC at $15K/month):
  $15,000 / ($3/M input + $15/M output) = ~800M tokens/month break-even
  At 1,000 tokens/request = ~800K requests/month
```

### 2. Fine-Tuning for Efficiency

| Approach | Cost | Latency | Quality |
|----------|------|---------|---------|
| GPT-4 base | $$$$ | Medium | High |
| Fine-tuned GPT-3.5 | $$ | Fast | High (task-specific) |
| Fine-tuned Command Light | $ | Very Fast | High (task-specific) |

**When to Fine-Tune:**
- Consistent output format needed (structured responses)
- Domain-specific terminology
- High volume of similar requests
- Current model is overkill for the task

### 3. Reserved Capacity

| Provider | Commitment | Typical Discount |
|----------|------------|------------------|
| OCI Flex | 1 year | 30-40% |
| OCI Flex | 3 year | 50-60% |
| Azure OpenAI PTU | 1 month min | Volume based |
| AWS Savings Plans | 1-3 year | 20-40% |

## Strategic Optimizations

### 1. Multi-Cloud Cost Routing

```python
# cost_router.py
class CostOptimizedRouter:
    def __init__(self):
        self.providers = {
            "oci_command_light": {
                "input_cost": 0.30,  # per 1M tokens
                "output_cost": 0.60,
                "capabilities": ["simple", "classification", "extraction"]
            },
            "oci_command_r": {
                "input_cost": 1.50,
                "output_cost": 7.50,
                "capabilities": ["medium", "summarization", "qa"]
            },
            "oci_command_r_plus": {
                "input_cost": 3.00,
                "output_cost": 15.00,
                "capabilities": ["complex", "reasoning", "analysis"]
            },
            "azure_gpt4": {
                "input_cost": 10.00,
                "output_cost": 30.00,
                "capabilities": ["complex", "creative", "code"]
            }
        }

    def route(self, request):
        """Route to cheapest provider meeting requirements."""
        required_capability = self.classify_request(request)

        eligible = [
            (name, config)
            for name, config in self.providers.items()
            if required_capability in config["capabilities"]
        ]

        # Sort by total cost estimate
        cheapest = min(
            eligible,
            key=lambda x: self.estimate_cost(x[1], request)
        )

        return cheapest[0]

    def estimate_cost(self, provider, request):
        input_tokens = len(request.prompt.split()) * 1.3
        output_tokens = request.max_tokens or 500

        return (
            (input_tokens / 1_000_000) * provider["input_cost"] +
            (output_tokens / 1_000_000) * provider["output_cost"]
        )
```

### 2. Egress Optimization

| Scenario | Current Cost | Optimized | Savings |
|----------|--------------|-----------|---------|
| AWS → Azure (1TB) | ~$90 | Via OCI Interconnect: $0 | 100% |
| GCP → OCI (1TB) | ~$85 | Process in GCP: $0 | 100% |
| Multi-region sync | Variable | Single region + cache | 60-80% |

### 3. Auto-Scaling Configuration

```yaml
# auto_scaling_config.yaml
scaling:
  schedule:
    # Scale down during off-hours (save ~40%)
    - cron: "0 22 * * 1-5"  # 10 PM weekdays
      min_replicas: 1
      max_replicas: 3

    - cron: "0 6 * * 1-5"   # 6 AM weekdays
      min_replicas: 3
      max_replicas: 20

    - cron: "0 0 * * 0,6"   # Weekends
      min_replicas: 1
      max_replicas: 5

  metrics:
    - type: requests_per_second
      target: 100
      scale_up_threshold: 80
      scale_down_threshold: 20
```

## Cost Tracking Dashboard

### Key Metrics

| Metric | Formula | Target |
|--------|---------|--------|
| Cost per Request | Total Cost / Requests | Decreasing |
| Cost per Token | Total Cost / Tokens | Stable/Decreasing |
| Cache Hit Rate | Cached / Total | > 30% |
| Model Efficiency | Quality / Cost | Increasing |
| Egress Ratio | Egress Cost / Total | < 10% |

### OCI Cost Monitoring Query

```sql
-- Monthly GenAI cost breakdown
SELECT
  resource_id,
  SUM(cost) as total_cost,
  SUM(quantity) as total_units,
  AVG(cost/quantity) as unit_cost
FROM
  cost_and_usage
WHERE
  service = 'Generative AI'
  AND time_period >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
GROUP BY
  resource_id
ORDER BY
  total_cost DESC;
```

## Optimization Action Plan Template

```markdown
# Cost Optimization Action Plan

## Executive Summary
- Current Monthly Spend: $X
- Target Monthly Spend: $Y
- Projected Savings: $Z (W%)

## Quick Wins (This Week)
| Action | Effort | Savings | Owner |
|--------|--------|---------|-------|
| Enable response caching | Low | $X/mo | |
| Downgrade model for simple tasks | Low | $X/mo | |
| Remove unused endpoints | Low | $X/mo | |

## Medium Term (This Month)
| Action | Effort | Savings | Owner |
|--------|--------|---------|-------|
| Implement cost-based routing | Medium | $X/mo | |
| Set up auto-scaling | Medium | $X/mo | |
| Fine-tune smaller model | High | $X/mo | |

## Strategic (This Quarter)
| Action | Effort | Savings | Owner |
|--------|--------|---------|-------|
| Move to DAC (if volume justifies) | High | $X/mo | |
| Negotiate reserved capacity | Medium | $X/mo | |
| Implement multi-cloud routing | High | $X/mo | |
```

## Output Deliverables

After completion, you'll have:
- [ ] Current cost analysis
- [ ] Optimization opportunities ranked by ROI
- [ ] Implementation action plan
- [ ] Cost tracking dashboard setup
- [ ] Automated alerts for budget thresholds

## Reference

- Template: `templates/cost-calculator.md`
- Knowledge: `knowledge-base/multi-cloud/MULTI-CLOUD-AI-PATTERNS.md`
- Skill: `skills/enterprise-ai-patterns/SKILL.md`
