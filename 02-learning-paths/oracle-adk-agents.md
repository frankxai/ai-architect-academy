# Oracle ADK Agent Development Learning Path

> Build enterprise-grade agentic applications on Oracle Cloud Infrastructure using the Agent Development Kit (ADK).

## Overview

Oracle ADK is a **code-first client library** (released May 2025) for building production agents on OCI Generative AI Agents Service. This learning path takes you from fundamentals to multi-agent orchestration.

**Prerequisites:**
- Python 3.10+
- OCI account with Generative AI access
- Basic understanding of LLMs and prompt engineering

**Duration:** 40-50 hours | **Level:** Intermediate to Advanced

---

## Module 1: ADK Foundations (8 hours)

### 1.1 Environment Setup

```bash
# Install Oracle ADK
pip install oci-adk

# Configure OCI credentials
oci setup config
```

**Key Files:**
- `~/.oci/config` - OCI configuration
- Compartment OCID for GenAI access

### 1.2 Your First Agent

```python
from oci_adk import Agent

# Create a basic agent
agent = Agent(
    name="hello_agent",
    model="cohere.command-r-plus",
    system_prompt="You are a helpful assistant for Oracle Cloud questions."
)

# Single-turn interaction
response = agent.execute("What is OCI?")
print(response.text)
```

### 1.3 Multi-Turn Conversations

```python
# Maintain context across turns
conversation = agent.create_conversation()

response1 = conversation.send("I need help setting up a database")
response2 = conversation.send("Should I use Autonomous or Base DB?")
response3 = conversation.send("What's the pricing for the first option?")

# Agent remembers full conversation context
```

### Learning Outcomes:
- [ ] Install and configure Oracle ADK
- [ ] Create basic conversational agents
- [ ] Understand OCI authentication flow
- [ ] Build multi-turn conversation handlers

---

## Module 2: Function Tools (10 hours)

### 2.1 Creating Custom Tools

```python
from oci_adk import FunctionTool

@FunctionTool(
    name="get_oci_pricing",
    description="Get current pricing for OCI services",
    parameters={
        "service": {"type": "string", "required": True},
        "region": {"type": "string", "default": "us-ashburn-1"}
    }
)
def get_oci_pricing(service: str, region: str = "us-ashburn-1"):
    """Fetch pricing from OCI Cost Management API"""
    # Integration with OCI billing APIs
    return pricing_api.get_service_pricing(service, region)

# Attach tool to agent
agent = Agent(
    name="pricing_agent",
    tools=[get_oci_pricing]
)

response = agent.execute("What does Autonomous Database cost per hour?")
# Agent automatically calls get_oci_pricing tool
```

### 2.2 Database Integration Tools

```python
from oci_adk.tools import SQLTool

# Create SQL tool with safety constraints
db_tool = SQLTool(
    connection_string=os.getenv("AUTONOMOUS_DB_CONNECTION"),
    allowed_tables=["customers", "orders", "products"],
    read_only=True  # Prevent mutations
)

data_agent = Agent(
    name="data_analyst",
    tools=[db_tool],
    system_prompt="You analyze business data. Only query allowed tables."
)

response = data_agent.execute("Show me top 10 customers by order value")
```

### 2.3 Object Storage Tools

```python
from oci import object_storage

@FunctionTool(
    name="read_document",
    description="Read document from OCI Object Storage"
)
def read_document(bucket: str, object_name: str):
    client = object_storage.ObjectStorageClient(config)
    response = client.get_object(namespace, bucket, object_name)
    return response.data.text

document_agent = Agent(
    name="document_agent",
    tools=[read_document]
)
```

### Lab: Build a Customer Support Agent
Create an agent that:
1. Looks up customer data from Autonomous DB
2. Retrieves order history
3. Checks shipping status via API
4. Generates personalized responses

---

## Module 3: Deterministic Workflows (8 hours)

### 3.1 Sequential Pipelines

```python
from oci_adk import Workflow, Step

# Define a deterministic workflow
support_workflow = Workflow([
    Step("classify", classification_agent),
    Step("lookup", data_lookup_agent),
    Step("respond", response_agent)
])

result = support_workflow.execute(customer_ticket)
```

### 3.2 Conditional Branching

```python
from oci_adk import ConditionalWorkflow

def route_request(context):
    if context["urgency"] == "high":
        return "escalation_path"
    elif context["type"] == "technical":
        return "technical_path"
    return "general_path"

workflow = ConditionalWorkflow(
    router=route_request,
    paths={
        "escalation_path": [urgent_handler, manager_notifier],
        "technical_path": [tech_classifier, expert_agent],
        "general_path": [general_agent]
    }
)
```

### 3.3 Error Handling & Retries

```python
from oci_adk import Step, RetryPolicy

resilient_step = Step(
    name="api_call",
    agent=api_agent,
    retry_policy=RetryPolicy(
        max_retries=3,
        backoff_factor=2,
        retryable_errors=["timeout", "rate_limit"]
    ),
    on_failure=fallback_agent
)
```

### Lab: Build an ETL Pipeline Agent
Create a workflow that:
1. Extracts data from Object Storage (CSV)
2. Transforms using business rules
3. Loads to Autonomous Database
4. Sends completion notification

---

## Module 4: Multi-Agent Orchestration (12 hours)

### 4.1 Hierarchical Pattern

```
        Supervisor Agent
              │
    ┌─────────┼─────────┐
    ▼         ▼         ▼
Research   Analysis   Report
 Agent      Agent     Agent
```

```python
from oci_adk import Agent

# Specialist agents
research_agent = Agent(name="researcher", model="cohere.command-r-plus")
analysis_agent = Agent(name="analyst", model="cohere.command-r-plus")
report_agent = Agent(name="reporter", model="cohere.command-r-plus")

# Agent-as-a-Tool pattern
supervisor = Agent(
    name="supervisor",
    system_prompt="Coordinate specialists to complete complex tasks",
    tools=[research_agent, analysis_agent, report_agent]
)

result = supervisor.execute("Create a market analysis for AI services in healthcare")
# Supervisor delegates to specialists automatically
```

### 4.2 Parallel Processing

```python
import asyncio

async def parallel_analysis(data):
    """Run multiple agents concurrently"""
    results = await asyncio.gather(
        sentiment_agent.execute_async(data),
        entity_agent.execute_async(data),
        summary_agent.execute_async(data)
    )
    return aggregator_agent.synthesize(results)
```

### 4.3 Routing Pattern

```python
def intelligent_router(query):
    """Route to specialized agent based on query"""
    query_type = classifier_agent.execute(f"Classify: {query}")

    routes = {
        "technical": technical_support_agent,
        "billing": billing_agent,
        "sales": sales_agent,
        "general": general_agent
    }

    return routes.get(query_type, general_agent).execute(query)
```

### Lab: Build a Document Processing System
Multi-agent system that:
1. **Intake Agent** - Classifies document type
2. **Extraction Agent** - Pulls key entities
3. **Validation Agent** - Checks data quality
4. **Storage Agent** - Persists to database
5. **Notification Agent** - Alerts stakeholders

---

## Module 5: Production Deployment (10 hours)

### 5.1 FastAPI Integration

```python
from fastapi import FastAPI, HTTPException
from oci_adk import Agent

app = FastAPI()
support_agent = Agent.load("customer_support_v2")

@app.post("/api/chat")
async def chat(message: str, session_id: str):
    try:
        conversation = support_agent.get_conversation(session_id)
        response = await conversation.send_async(message)
        return {"reply": response.text, "session_id": session_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
def health():
    return {"status": "healthy", "agent": "loaded"}
```

### 5.2 OCI Container Deployment

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
```

```bash
# Deploy to OCI Container Instances
oci ce container-instance create \
    --compartment-id $COMPARTMENT_ID \
    --display-name "adk-agent" \
    --containers '[{"imageUrl":"...", "displayName":"agent"}]'
```

### 5.3 Monitoring & Observability

```python
from oci.monitoring import MonitoringClient
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("adk_agent")

def track_metrics(agent_id: str, metrics: dict):
    """Push metrics to OCI Monitoring"""
    monitoring_client.post_metric_data(
        post_metric_data_details={
            "namespace": "agent_metrics",
            "dimensions": {"agent_id": agent_id},
            "datapoints": [
                {"timestamp": datetime.now(), "value": metrics["latency"]},
            ]
        }
    )

# Instrument agent
agent = Agent(
    name="monitored_agent",
    on_tool_call=lambda t: logger.info(f"Tool: {t.name}"),
    on_complete=lambda r: track_metrics("agent_1", {"latency": r.latency})
)
```

### 5.4 Multi-Region Deployment

```python
regions = ["us-ashburn-1", "eu-frankfurt-1", "ap-tokyo-1"]

for region in regions:
    deploy_agent(
        agent=production_agent,
        region=region,
        config={
            "min_instances": 2,
            "max_instances": 10,
            "scaling_policy": "cpu_utilization"
        }
    )
```

### Lab: Production Deployment
Deploy a complete agent system:
1. Containerize with Docker
2. Deploy to OCI Container Instances
3. Set up OCI Monitoring dashboards
4. Configure auto-scaling
5. Implement health checks

---

## Module 6: Enterprise Integrations (6 hours)

### 6.1 Oracle Fusion Integration

```python
from oci_adk.integrations import FusionConnector

fusion = FusionConnector(
    host=os.getenv("FUSION_HOST"),
    credentials=os.getenv("FUSION_CREDENTIALS")
)

@FunctionTool(name="get_employee_data")
def get_employee_data(employee_id: str):
    return fusion.hcm.get_employee(employee_id)

@FunctionTool(name="create_expense_report")
def create_expense_report(data: dict):
    return fusion.erp.create_expense(data)

hr_agent = Agent(
    name="hr_assistant",
    tools=[get_employee_data, create_expense_report]
)
```

### 6.2 Integration Cloud Service (OIC)

```python
@FunctionTool(name="trigger_integration")
def trigger_integration(integration_id: str, payload: dict):
    """Trigger OIC integration flow"""
    response = oic_client.integrations.run(
        integration_id=integration_id,
        payload=payload
    )
    return response.result
```

### 6.3 Analytics Cloud Integration

```python
@FunctionTool(name="query_analytics")
def query_analytics(report_path: str, filters: dict):
    """Query Oracle Analytics Cloud reports"""
    return oac_client.execute_report(report_path, filters)

analytics_agent = Agent(
    name="analytics_agent",
    tools=[query_analytics],
    system_prompt="You help users analyze business data from Oracle Analytics."
)
```

---

## Capstone Project: Enterprise AI Assistant

Build a production-ready enterprise assistant that:

1. **Authentication**: OCI IAM integration
2. **Data Access**:
   - Autonomous Database queries
   - Object Storage document retrieval
   - Fusion application data
3. **Multi-Agent**:
   - HR queries routed to HR agent
   - Finance queries to Finance agent
   - IT queries to IT agent
4. **Workflows**:
   - Expense report submission
   - PTO requests
   - IT ticket creation
5. **Deployment**:
   - Containerized on OCI
   - Auto-scaling enabled
   - Full observability

**Deliverables:**
- [ ] Working multi-agent system
- [ ] API documentation
- [ ] Deployment scripts
- [ ] Monitoring dashboard
- [ ] Security audit report

---

## Assessment Criteria

| Skill | Beginner | Intermediate | Advanced |
|-------|----------|--------------|----------|
| Agent Creation | Single agent | Multi-turn | Multi-agent |
| Tool Design | Basic tools | OCI integrations | Enterprise integrations |
| Workflows | Sequential | Conditional | Parallel + error handling |
| Deployment | Local | Container | Multi-region + monitoring |

---

## Resources

**Official Documentation:**
- [Oracle ADK Docs](https://docs.oracle.com/en-us/iaas/Content/generative-ai-agents/adk/)
- [OCI GenAI Agents Service](https://docs.oracle.com/en-us/iaas/Content/generative-ai-agents/)
- [ADK API Reference](https://docs.oracle.com/en-us/iaas/Content/generative-ai-agents/adk/api-reference/)

**Tutorials:**
- [Adding Tools to ADK](https://docs.public.content.oci.oraclecloud.com/en-us/iaas/Content/generative-ai-agents/add-tool-adk.htm)

**Next Steps:**
- [Multi-Agent Orchestration Patterns](../01-design-patterns/orchestration-workflow.md)
- [Oracle ADK Blueprint](../01-design-patterns/oracle-adk-blueprint.md)
- [OCI Services Reference](../11-hyperscalers/oci/README.md)
