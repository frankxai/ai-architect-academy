# OCI GenAI Quick Reference Cheatsheet

## Model Selection

| Model | Best For | Input $/1M | Output $/1M |
|-------|----------|------------|-------------|
| **Command R+** | Complex reasoning, analysis | ~$3 | ~$15 |
| **Command R** | General purpose, balanced | ~$1.50 | ~$7.50 |
| **Command Light** | High volume, simple tasks | ~$0.30 | ~$0.60 |
| **Llama 3.1 70B** | Open source, capable | ~$3 | ~$10 |
| **Llama 3.1 8B** | Cost effective, simple | ~$0.30 | ~$0.60 |

## Dedicated AI Cluster Sizing

| Traffic | Units | Est. Monthly |
|---------|-------|--------------|
| Dev/Test (<10 req/s) | 2-5 | $3-7.5K |
| Production (10-50 req/s) | 5-15 | $7.5-22.5K |
| High Volume (50-200 req/s) | 15-30 | $22.5-45K |
| Enterprise (200+ req/s) | 30-50 | $45-75K |

## Quick Code Snippets

### Initialize Client
```python
import oci
config = oci.config.from_file()
client = oci.generative_ai_inference.GenerativeAiInferenceClient(
    config,
    service_endpoint=f"https://inference.generativeai.{config['region']}.oci.oraclecloud.com"
)
```

### Generate Text (On-Demand)
```python
response = client.generate_text(
    oci.generative_ai_inference.models.GenerateTextDetails(
        compartment_id=COMPARTMENT_ID,
        serving_mode=oci.generative_ai_inference.models.OnDemandServingMode(
            model_id="cohere.command-r-plus"
        ),
        inference_request=oci.generative_ai_inference.models.CohereLlmInferenceRequest(
            prompt="Your prompt here",
            max_tokens=500,
            temperature=0.7
        )
    )
)
text = response.data.inference_response.generated_texts[0].text
```

### Generate Text (Dedicated Cluster)
```python
response = client.generate_text(
    oci.generative_ai_inference.models.GenerateTextDetails(
        compartment_id=COMPARTMENT_ID,
        serving_mode=oci.generative_ai_inference.models.DedicatedServingMode(
            endpoint_id="ocid1.generativeaiendpoint..."
        ),
        inference_request=oci.generative_ai_inference.models.CohereLlmInferenceRequest(
            prompt="Your prompt here",
            max_tokens=500
        )
    )
)
```

### Chat Completion
```python
response = client.chat(
    oci.generative_ai_inference.models.ChatDetails(
        compartment_id=COMPARTMENT_ID,
        serving_mode=oci.generative_ai_inference.models.OnDemandServingMode(
            model_id="cohere.command-r-plus"
        ),
        chat_request=oci.generative_ai_inference.models.CohereChatRequest(
            message="User message here",
            chat_history=[
                oci.generative_ai_inference.models.CohereMessage(
                    role="USER", message="Previous user message"
                ),
                oci.generative_ai_inference.models.CohereMessage(
                    role="CHATBOT", message="Previous bot response"
                )
            ]
        )
    )
)
```

### Generate Embeddings
```python
response = client.embed_text(
    oci.generative_ai_inference.models.EmbedTextDetails(
        compartment_id=COMPARTMENT_ID,
        serving_mode=oci.generative_ai_inference.models.OnDemandServingMode(
            model_id="cohere.embed-english-v3.0"
        ),
        inputs=["Text 1", "Text 2"],
        input_type="SEARCH_DOCUMENT"
    )
)
embeddings = response.data.embeddings
```

## Terraform Quick Start

### Create Hosting Cluster
```hcl
resource "oci_generative_ai_dedicated_ai_cluster" "hosting" {
  compartment_id = var.compartment_id
  type           = "HOSTING"
  unit_count     = 10
  unit_shape     = "LARGE_COHERE"
  display_name   = "my-cluster"
}
```

### Create Endpoint
```hcl
resource "oci_generative_ai_endpoint" "main" {
  compartment_id           = var.compartment_id
  dedicated_ai_cluster_id  = oci_generative_ai_dedicated_ai_cluster.hosting.id
  model_id                 = "cohere.command-r-plus"
  display_name             = "my-endpoint"
}
```

## IAM Policies

### GenAI Access
```
Allow group genai-users to use generative-ai-family in compartment ai-workloads
Allow group genai-users to read generative-ai-dedicated-ai-clusters in compartment ai-workloads
```

### Full Admin
```
Allow group genai-admins to manage generative-ai-family in compartment ai-workloads
```

## GenAI Regions

| Region | Location |
|--------|----------|
| us-chicago-1 | Chicago, US |
| us-ashburn-1 | Ashburn, US |
| eu-frankfurt-1 | Frankfurt, DE |
| uk-london-1 | London, UK |
| ap-tokyo-1 | Tokyo, JP |

## Inference Parameters

| Parameter | Range | Default | Notes |
|-----------|-------|---------|-------|
| max_tokens | 1-4096 | - | Required |
| temperature | 0-1 | 0.7 | 0=deterministic |
| top_p | 0-1 | 0.75 | Nucleus sampling |
| top_k | 1-500 | 0 | Top-k sampling |
| frequency_penalty | 0-1 | 0 | Reduce repetition |
| presence_penalty | 0-1 | 0 | Encourage diversity |

## Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Invalid credentials | Check OCI config |
| 404 Not Found | Wrong region/endpoint | Verify region supports GenAI |
| 429 Too Many Requests | Rate limited | Implement backoff or use DAC |
| 503 Service Unavailable | Cluster not ready | Wait for ACTIVE state |

## OCI CLI Commands

```bash
# List clusters
oci generative-ai dedicated-ai-cluster list --compartment-id $COMP_ID

# Get cluster details
oci generative-ai dedicated-ai-cluster get --dedicated-ai-cluster-id $CLUSTER_ID

# List endpoints
oci generative-ai endpoint list --compartment-id $COMP_ID

# List models
oci generative-ai model list --compartment-id $COMP_ID
```

## Useful Links

- [OCI GenAI Docs](https://docs.oracle.com/en-us/iaas/Content/generative-ai/overview.htm)
- [DAC Management](https://docs.oracle.com/en-us/iaas/Content/generative-ai/ai-cluster.htm)
- [GenAI Agents](https://docs.oracle.com/en-us/iaas/Content/generative-ai-agents/overview.htm)
- [Python SDK](https://docs.oracle.com/en-us/iaas/tools/python/latest/api/generative_ai_inference.html)
- [Terraform Provider](https://registry.terraform.io/providers/oracle/oci/latest/docs/resources/generative_ai_dedicated_ai_cluster)
