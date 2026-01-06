# AI Architecture Workflows

## Workflow Index

| Workflow | Purpose | Trigger |
|----------|---------|---------|
| Solution Design | End-to-end AI solution design | `/design-solution` |
| GenAI Deployment | Deploy GenAI on OCI DACs | `/deploy-genai` |
| RAG Implementation | Build RAG-based agents | `/build-rag` |
| Multi-Cloud Setup | Configure multi-cloud AI | `/multi-cloud-setup` |
| Cost Optimization | Optimize AI spending | `/optimize-costs` |
| Security Review | Security assessment | `/security-review` |
| Migration | Migrate AI workloads | `/migrate-ai` |

---

## Workflow 1: Solution Design

### Overview
Complete AI solution design from requirements to architecture.

```
┌─────────────────────────────────────────────────────────────────┐
│                    SOLUTION DESIGN WORKFLOW                      │
│                                                                  │
│   Requirements ──▶ Analysis ──▶ Design ──▶ Review ──▶ Approve   │
│                                                                  │
│   Duration: 1-3 hours                                           │
│   Output: Architecture document, Terraform, Estimates           │
└─────────────────────────────────────────────────────────────────┘
```

### Steps

#### Step 1: Requirements Gathering
```yaml
agent: Chief-Architect-Agent
inputs:
  - Business problem statement
  - Technical constraints
  - Budget (optional)
  - Timeline (optional)
activities:
  - Clarify requirements
  - Identify stakeholders
  - Define success criteria
  - Document constraints
output: Requirements document
```

#### Step 2: Analysis
```yaml
agents:
  - GenAI-Architect (if AI required)
  - Multi-Cloud-Architect (if cross-cloud)
  - Security-Architect (always)
activities:
  - Evaluate technology options
  - Compare cloud providers
  - Assess data requirements
  - Identify risks
output: Analysis report
```

#### Step 3: Architecture Design
```yaml
agent: Lead based on domain
parallel_agents:
  - GenAI-Architect (AI components)
  - OCI-Compute-Expert (infrastructure)
  - Security-Architect (security design)
  - Cost-Optimizer (cost model)
activities:
  - Design system architecture
  - Create component diagrams
  - Define data flows
  - Specify integrations
output:
  - Architecture diagram
  - Component specifications
  - Data flow diagrams
  - Terraform skeleton
```

#### Step 4: Review & Approval
```yaml
agent: Architecture-Review-Board
activities:
  - Review architecture against requirements
  - Validate security compliance
  - Verify cost estimates
  - Check for anti-patterns
output: Approved design with sign-off
```

### Artifacts Produced
```
/solutions/{project-name}/
├── README.md                    # Solution overview
├── architecture/
│   ├── solution-architecture.md # Full architecture doc
│   ├── diagrams/
│   │   ├── system-context.png   # C4 Level 1
│   │   ├── container.png        # C4 Level 2
│   │   └── data-flow.png        # Data flow diagram
│   └── decisions/
│       └── ADR-001.md           # Architecture Decision Record
├── infrastructure/
│   ├── main.tf                  # Terraform entry point
│   ├── variables.tf             # Input variables
│   └── modules/                 # Reusable modules
├── estimates/
│   ├── cost-estimate.md         # Monthly cost breakdown
│   └── timeline.md              # Implementation timeline
└── security/
    └── security-review.md       # Security assessment
```

---

## Workflow 2: GenAI Deployment

### Overview
Deploy Generative AI solution on OCI Dedicated AI Clusters.

```
┌─────────────────────────────────────────────────────────────────┐
│                    GENAI DEPLOYMENT WORKFLOW                     │
│                                                                  │
│   Plan ──▶ Cluster ──▶ Model ──▶ Endpoint ──▶ Test ──▶ Monitor │
│                                                                  │
│   Duration: 2-4 hours                                           │
│   Output: Running GenAI endpoint                                │
└─────────────────────────────────────────────────────────────────┘
```

### Steps

#### Step 1: Deployment Planning
```yaml
agent: GenAI-Architect
inputs:
  - Model requirements (capability, latency)
  - Traffic expectations (requests/sec)
  - Fine-tuning needs (yes/no)
activities:
  - Select model (Command R+, Llama, etc.)
  - Size cluster (units needed)
  - Plan endpoint configuration
output: Deployment plan
```

#### Step 2: Create Dedicated AI Cluster
```yaml
agent: DAC-Specialist
terraform_resources:
  - oci_generative_ai_dedicated_ai_cluster
  - oci_identity_policy (for GenAI access)
activities:
  - Create hosting cluster
  - (Optional) Create fine-tuning cluster
  - Configure networking
  - Set up IAM policies
output: Running DAC cluster
```

#### Step 3: Model Configuration
```yaml
agent: DAC-Specialist
activities:
  - Select or import model
  - (If fine-tuning) Upload training data
  - (If fine-tuning) Start fine-tuning job
  - Validate model readiness
output: Configured model
```

#### Step 4: Create Endpoint
```yaml
agent: DAC-Specialist
terraform_resources:
  - oci_generative_ai_endpoint
activities:
  - Create endpoint on cluster
  - Configure inference parameters
  - Set up content moderation (optional)
output: Running endpoint
```

#### Step 5: Integration Testing
```yaml
agent: QA-Agent
activities:
  - Test API connectivity
  - Validate response quality
  - Measure latency
  - Load test (optional)
output: Test report
```

#### Step 6: Monitoring Setup
```yaml
agent: SRE-Agent
activities:
  - Configure OCI Monitoring
  - Set up alerts (latency, errors)
  - Create dashboards
  - Document runbooks
output: Monitoring dashboard
```

### Quick Start Script
```python
# genai_deployment.py
from oci.generative_ai import GenerativeAiClient
from oci.generative_ai.models import *

def deploy_genai_endpoint(config, compartment_id, cluster_units=10):
    """Deploy GenAI with Dedicated AI Cluster."""

    client = GenerativeAiClient(config)

    # Step 1: Create hosting cluster
    cluster = client.create_dedicated_ai_cluster(
        CreateDedicatedAiClusterDetails(
            compartment_id=compartment_id,
            type="HOSTING",
            unit_count=cluster_units,
            unit_shape="LARGE_COHERE",
            display_name="Production-Hosting"
        )
    )

    # Wait for cluster to be active
    wait_for_state(cluster.data.id, "ACTIVE")

    # Step 2: Create endpoint
    endpoint = client.create_endpoint(
        CreateEndpointDetails(
            compartment_id=compartment_id,
            dedicated_ai_cluster_id=cluster.data.id,
            model_id="cohere.command-r-plus",
            display_name="Command-R-Plus-Endpoint"
        )
    )

    return endpoint.data

# Usage
endpoint = deploy_genai_endpoint(config, compartment_id)
print(f"Endpoint ready: {endpoint.id}")
```

---

## Workflow 3: RAG Implementation

### Overview
Build Retrieval-Augmented Generation system with knowledge bases.

```
┌─────────────────────────────────────────────────────────────────┐
│                    RAG IMPLEMENTATION WORKFLOW                   │
│                                                                  │
│   Documents ──▶ KB ──▶ Agent ──▶ RAG Tool ──▶ Test ──▶ Deploy   │
│                                                                  │
│   Duration: 4-8 hours                                           │
│   Output: Working RAG agent                                     │
└─────────────────────────────────────────────────────────────────┘
```

### Steps

#### Step 1: Document Preparation
```yaml
agent: RAG-Specialist
inputs:
  - Source documents (PDF, TXT)
  - Metadata schema
  - Domain context
activities:
  - Analyze document structure
  - Define chunking strategy
  - Prepare metadata
  - Upload to Object Storage
output: Prepared document corpus
```

#### Step 2: Knowledge Base Creation
```yaml
agent: RAG-Specialist
terraform_resources:
  - oci_generative_ai_agent_knowledge_base
  - oci_objectstorage_bucket
activities:
  - Create knowledge base
  - Configure indexing
  - Trigger ingestion
  - Monitor embedding generation
output: Indexed knowledge base
```

#### Step 3: Agent Configuration
```yaml
agent: Agent-Architect
terraform_resources:
  - oci_generative_ai_agent
activities:
  - Create agent
  - Configure system message
  - Set custom instructions
  - Enable multi-lingual (if needed)
output: Configured agent
```

#### Step 4: RAG Tool Setup
```yaml
agent: RAG-Specialist
activities:
  - Attach knowledge bases to agent
  - Configure retrieval parameters (top-k, threshold)
  - Enable hybrid search
  - Set citation preferences
output: RAG-enabled agent
```

#### Step 5: Quality Testing
```yaml
agent: QA-Agent
activities:
  - Test query accuracy
  - Validate citations
  - Check edge cases
  - Measure retrieval quality
output: Quality report
```

### Knowledge Base Configuration Template
```hcl
# knowledge_base.tf

resource "oci_generative_ai_agent_knowledge_base" "main" {
  compartment_id = var.compartment_id
  display_name   = "${var.project_name}-kb"

  index_config {
    index_config_type = "DEFAULT_INDEX_CONFIG"

    databases {
      connection_type = "OBJECT_STORAGE"

      connection_id = oci_objectstorage_bucket.docs.id
    }
  }

  freeform_tags = {
    Project = var.project_name
    Type    = "RAG"
  }
}

resource "oci_generative_ai_agent" "rag_agent" {
  compartment_id = var.compartment_id
  display_name   = "${var.project_name}-agent"

  description = var.agent_description

  knowledge_base_ids = [
    oci_generative_ai_agent_knowledge_base.main.id
  ]

  system_message = <<-EOT
    You are a helpful assistant for ${var.project_name}.
    Always cite your sources.
    If unsure, say so clearly.
  EOT
}
```

---

## Workflow 4: Multi-Cloud Setup

### Overview
Configure AI workloads across OCI, AWS, Azure.

```
┌─────────────────────────────────────────────────────────────────┐
│                    MULTI-CLOUD SETUP WORKFLOW                    │
│                                                                  │
│   Plan ──▶ Network ──▶ Identity ──▶ Workloads ──▶ Monitor       │
│                                                                  │
│   Duration: 1-2 days                                            │
│   Output: Connected multi-cloud environment                     │
└─────────────────────────────────────────────────────────────────┘
```

### Steps

#### Step 1: Architecture Planning
```yaml
agent: Multi-Cloud-Architect
activities:
  - Define workload placement
  - Plan data residency
  - Design failover strategy
  - Estimate cross-cloud costs
output: Multi-cloud architecture plan
```

#### Step 2: Network Setup
```yaml
agents:
  - OCI-Network-Expert
  - AWS-Expert / Azure-Expert
activities:
  - Configure OCI-Azure Interconnect (if Azure)
  - Set up VPN/FastConnect (if AWS)
  - Configure DNS resolution
  - Test connectivity
output: Connected networks
```

#### Step 3: Identity Federation
```yaml
agent: Security-Architect
activities:
  - Configure SSO across clouds
  - Set up identity mapping
  - Implement RBAC
  - Test access
output: Federated identity
```

#### Step 4: Workload Deployment
```yaml
agents:
  - GenAI-Architect (AI workloads)
  - Cloud-specific experts
activities:
  - Deploy AI services per cloud
  - Configure load balancing
  - Set up failover
output: Running workloads
```

---

## Workflow 5: Cost Optimization

### Overview
Analyze and optimize AI cloud spending.

```
┌─────────────────────────────────────────────────────────────────┐
│                    COST OPTIMIZATION WORKFLOW                    │
│                                                                  │
│   Analyze ──▶ Identify ──▶ Recommend ──▶ Implement ──▶ Monitor  │
│                                                                  │
│   Duration: 2-4 hours                                           │
│   Output: Cost reduction recommendations                        │
└─────────────────────────────────────────────────────────────────┘
```

### Steps

#### Step 1: Cost Analysis
```yaml
agent: Cost-Optimizer
inputs:
  - Current spending by service
  - Usage patterns
  - Growth projections
activities:
  - Pull cost data
  - Analyze usage patterns
  - Identify top spenders
output: Cost analysis report
```

#### Step 2: Optimization Identification
```yaml
agent: Cost-Optimizer
parallel_consultations:
  - OCI-Compute-Expert (GPU optimization)
  - GenAI-Architect (model selection)
  - Multi-Cloud-Architect (placement)
activities:
  - Right-sizing opportunities
  - Reserved capacity candidates
  - Model cost comparison
  - Egress optimization
output: Optimization opportunities list
```

#### Step 3: Recommendations
```yaml
agent: Cost-Optimizer
activities:
  - Prioritize by savings impact
  - Calculate implementation effort
  - Assess risks
  - Create action plan
output: Prioritized recommendations
```

### Cost Optimization Checklist
```markdown
## GPU & Compute
- [ ] Right-size GPU instances
- [ ] Use preemptible/spot for fault-tolerant workloads
- [ ] Consider reserved capacity for steady workloads
- [ ] Shut down dev/test during off-hours

## GenAI & Models
- [ ] Use lighter models for simple tasks
- [ ] Batch requests where possible
- [ ] Cache common responses
- [ ] Fine-tune smaller models vs. using larger base

## Storage
- [ ] Archive infrequently accessed data
- [ ] Delete unused snapshots
- [ ] Use appropriate storage tiers

## Networking
- [ ] Minimize cross-cloud data transfer
- [ ] Use Interconnect for Azure (lower egress)
- [ ] Process data where it lives
```

---

## Workflow 6: Security Review

### Overview
Comprehensive security assessment for AI solutions.

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY REVIEW WORKFLOW                      │
│                                                                  │
│   Scope ──▶ Assess ──▶ Report ──▶ Remediate ──▶ Verify          │
│                                                                  │
│   Duration: 4-8 hours                                           │
│   Output: Security assessment with action items                 │
└─────────────────────────────────────────────────────────────────┘
```

### Security Review Checklist
```markdown
## Identity & Access
- [ ] IAM policies follow least privilege
- [ ] No overly permissive policies
- [ ] MFA enabled for all users
- [ ] Service accounts properly scoped
- [ ] API keys rotated regularly

## Network
- [ ] Private subnets for AI workloads
- [ ] Security lists/NSGs configured
- [ ] No unnecessary public endpoints
- [ ] WAF enabled for public APIs
- [ ] VPN/FastConnect for cross-cloud

## Data
- [ ] Encryption at rest enabled
- [ ] Encryption in transit (TLS 1.2+)
- [ ] Customer-managed keys where required
- [ ] Data classification applied
- [ ] PII properly protected

## AI-Specific
- [ ] Model inputs validated
- [ ] Prompt injection mitigated
- [ ] Output filtering enabled
- [ ] Training data secured
- [ ] Model access logged

## Monitoring
- [ ] Audit logging enabled
- [ ] Alerts for security events
- [ ] Incident response plan
```

---

## Workflow Automation

### Using Slash Commands
```bash
# Start a workflow
/design-solution "Build customer support AI with RAG"

# Check status
/workflow-status

# Resume paused workflow
/resume-workflow sol-2025-0102-001
```

### Programmatic Triggers
```python
# workflow_trigger.py
from ai_architect import WorkflowEngine

engine = WorkflowEngine()

# Trigger solution design workflow
result = engine.start_workflow(
    workflow="solution-design",
    inputs={
        "problem": "Customer support automation",
        "constraints": {
            "budget": 50000,
            "timeline": "3 months",
            "cloud": "OCI"
        },
        "requirements": {
            "response_time": "< 2 seconds",
            "languages": ["en", "es"],
            "documents": 5000
        }
    }
)

print(f"Workflow started: {result.workflow_id}")
```

---

## Workflow States

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ PENDING  │────▶│ RUNNING  │────▶│ COMPLETED│
└──────────┘     └────┬─────┘     └──────────┘
                      │
                      ▼
                ┌──────────┐     ┌──────────┐
                │  PAUSED  │────▶│  FAILED  │
                │ (Human   │     │ (Error)  │
                │  Input)  │     └──────────┘
                └──────────┘
```

### State Transitions
- **PENDING → RUNNING**: Workflow starts
- **RUNNING → PAUSED**: Needs human input or approval
- **PAUSED → RUNNING**: Input received, continues
- **RUNNING → COMPLETED**: All steps done
- **RUNNING → FAILED**: Unrecoverable error
- **FAILED → RUNNING**: Retry after fix
