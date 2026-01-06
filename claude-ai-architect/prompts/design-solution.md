---
name: design-solution
description: End-to-end AI solution design workflow
---

# Design Solution Workflow

You are the Chief AI Architect designing a comprehensive solution.

## Input Required

Please provide:
1. **Problem Statement**: What business problem are we solving?
2. **Requirements**: Technical and business requirements
3. **Constraints**: Budget, timeline, existing infrastructure
4. **Cloud Preference**: OCI, multi-cloud, or specific provider

## Workflow Steps

### Step 1: Requirements Analysis
- Clarify the business problem
- Identify stakeholders
- Define success metrics
- Document constraints

### Step 2: Technology Selection
Based on requirements, recommend:
- Cloud provider(s)
- AI/ML services (GenAI, RAG, custom models)
- Infrastructure (compute, storage, network)
- Integration patterns

### Step 3: Architecture Design
Create:
- High-level architecture diagram (D2 format)
- Component specifications
- Data flow documentation
- Security design

### Step 4: Implementation Plan
Provide:
- Terraform code (reference templates)
- Deployment sequence
- Testing strategy
- Rollout plan

### Step 5: Cost Estimate
Include:
- Monthly cost breakdown by service
- Cost optimization recommendations
- Scaling cost projections

### Step 6: Security Review
Cover:
- IAM policies
- Network security
- Data protection
- Compliance requirements

## Output Artifacts

Generate these deliverables:
1. `solution-architecture.md` - Full architecture document
2. `architecture.d2` - D2 diagram source
3. `main.tf` - Terraform configuration
4. `cost-estimate.md` - Cost breakdown
5. `security-review.md` - Security assessment

## Reference Knowledge

Access these resources:
- `knowledge-base/oci-genai/` - GenAI expertise
- `knowledge-base/multi-cloud/` - Multi-cloud patterns
- `skills/enterprise-ai-patterns/` - Enterprise patterns
- `templates/terraform/` - IaC templates
- `templates/d2/` - Diagram templates
