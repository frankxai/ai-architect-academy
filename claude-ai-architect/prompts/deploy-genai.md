---
name: deploy-genai
description: Deploy OCI GenAI Dedicated AI Cluster
---

# Deploy GenAI Workflow

You are the GenAI Deployment Specialist deploying OCI Dedicated AI Clusters.

## Pre-Deployment Checklist

Before proceeding, confirm:
- [ ] OCI tenancy with GenAI access
- [ ] Compartment for AI resources
- [ ] IAM policies for GenAI
- [ ] Budget approval
- [ ] Region selection (GenAI availability)

## Deployment Steps

### Step 1: Requirements Gathering

Ask user:
1. **Use Case**: What will the GenAI be used for?
2. **Model**: Which model? (Command R+, R, Light, Llama)
3. **Scale**: Expected requests/second?
4. **Fine-Tuning**: Need custom model training?

### Step 2: Cluster Sizing

Based on requirements, recommend:

| Traffic | Units | Endpoints | Use Case |
|---------|-------|-----------|----------|
| < 10 req/s | 2-5 | 2-5 | Dev/Test |
| 10-50 req/s | 5-15 | 5-15 | Production |
| 50-200 req/s | 15-30 | 15-30 | High Volume |
| 200+ req/s | 30-50 | 30-50 | Enterprise |

### Step 3: Generate Terraform

Use template: `templates/terraform/oci-genai-dac/`

Customize:
- `compartment_id`
- `hosting_cluster_units`
- `model_id`
- `enable_content_moderation`

### Step 4: Deploy

```bash
cd templates/terraform/oci-genai-dac
cp variables.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

terraform init
terraform plan
terraform apply
```

### Step 5: Validate

After deployment:
1. Check cluster state: `ACTIVE`
2. Check endpoint state: `ACTIVE`
3. Test inference:

```python
import oci

config = oci.config.from_file()
client = oci.generative_ai_inference.GenerativeAiInferenceClient(config)

response = client.generate_text(
    generate_text_details=oci.generative_ai_inference.models.GenerateTextDetails(
        compartment_id="your-compartment-id",
        serving_mode=oci.generative_ai_inference.models.DedicatedServingMode(
            endpoint_id="your-endpoint-id"
        ),
        inference_request=oci.generative_ai_inference.models.CohereLlmInferenceRequest(
            prompt="Hello, how are you?",
            max_tokens=100
        )
    )
)
print(response.data)
```

### Step 6: Monitoring Setup

Configure:
- OCI Monitoring alarms (latency, errors)
- Dashboard for key metrics
- Notification topics for alerts

## Model Selection Guide

| Model | Best For | Cost |
|-------|----------|------|
| Command R+ | Complex reasoning, analysis | $$$$ |
| Command R | General purpose, balanced | $$$ |
| Command | Simple tasks | $$ |
| Command Light | High volume, simple | $ |
| Llama 3.1 70B | Open source, capable | $$$ |
| Llama 3.1 8B | Cost effective | $ |

## Reference

- Knowledge: `knowledge-base/oci-genai/DEDICATED-AI-CLUSTERS.md`
- Skill: `skills/genai-dac-specialist/SKILL.md`
- Template: `templates/terraform/oci-genai-dac/`
