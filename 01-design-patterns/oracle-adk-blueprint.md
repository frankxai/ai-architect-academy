# Oracle ADK Enterprise Blueprint

> Reference architecture for building production-grade agentic applications on Oracle Cloud Infrastructure using the Agent Development Kit.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ Web App  │  │ Slackbot │  │ Mobile   │  │ API      │            │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘            │
└───────┼─────────────┼─────────────┼─────────────┼───────────────────┘
        │             │             │             │
        └─────────────┴─────────────┴─────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      API GATEWAY (OCI API Gateway)                   │
│  • Authentication  • Rate Limiting  • Request Routing               │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      ORCHESTRATION LAYER                             │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │              SUPERVISOR AGENT (Router)                      │    │
│  │  • Intent Classification  • Agent Selection  • Aggregation  │    │
│  └───────────────────────────┬────────────────────────────────┘    │
│                              │                                       │
│         ┌────────────────────┼────────────────────┐                 │
│         ▼                    ▼                    ▼                  │
│  ┌────────────┐      ┌────────────┐      ┌────────────┐            │
│  │ Support    │      │ Analytics  │      │ Operations │            │
│  │ Agent      │      │ Agent      │      │ Agent      │            │
│  └─────┬──────┘      └─────┬──────┘      └─────┬──────┘            │
└────────┼───────────────────┼───────────────────┼────────────────────┘
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         TOOL LAYER                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ SQL Tool │  │ API Tool │  │ Doc Tool │  │ Search   │            │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘            │
└───────┼─────────────┼─────────────┼─────────────┼───────────────────┘
        │             │             │             │
        ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        DATA LAYER (OCI)                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │Autonomous│  │ Object   │  │ Fusion   │  │ GenAI    │            │
│  │ Database │  │ Storage  │  │ Apps     │  │ Service  │            │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. Supervisor Agent (Orchestrator)

The central routing agent that classifies requests and delegates to specialists.

```python
from oci_adk import Agent, Router

class SupervisorAgent:
    def __init__(self):
        self.classifier = Agent(
            name="classifier",
            model="cohere.command-r-plus",
            system_prompt="""Classify user requests into categories:
            - SUPPORT: Customer issues, troubleshooting
            - ANALYTICS: Data queries, reports, insights
            - OPERATIONS: System actions, workflows, automation
            - GENERAL: Everything else

            Respond with only the category name."""
        )

        self.agents = {
            "SUPPORT": SupportAgent(),
            "ANALYTICS": AnalyticsAgent(),
            "OPERATIONS": OperationsAgent(),
            "GENERAL": GeneralAgent()
        }

    async def handle(self, user_query: str, context: dict):
        # Step 1: Classify intent
        category = await self.classifier.execute_async(user_query)
        category = category.text.strip().upper()

        # Step 2: Route to specialist
        agent = self.agents.get(category, self.agents["GENERAL"])

        # Step 3: Execute and return
        return await agent.handle(user_query, context)
```

### 2. Specialist Agents

Domain-specific agents with tailored tools and prompts.

```python
class SupportAgent:
    def __init__(self):
        self.agent = Agent(
            name="support_specialist",
            model="cohere.command-r-plus",
            system_prompt="""You are a customer support specialist.

            Guidelines:
            - Be empathetic and professional
            - Look up customer data before responding
            - Escalate complex issues to human agents
            - Document all interactions""",
            tools=[
                customer_lookup_tool,
                order_status_tool,
                ticket_creation_tool,
                escalation_tool
            ]
        )

    async def handle(self, query: str, context: dict):
        return await self.agent.execute_async(
            query,
            context={"customer_id": context.get("customer_id")}
        )
```

### 3. Function Tools

Reusable tools that connect agents to data and systems.

```python
from oci_adk import FunctionTool
from oci import database, object_storage

@FunctionTool(
    name="query_database",
    description="Execute read-only SQL queries against Autonomous Database",
    parameters={
        "query": {"type": "string", "required": True},
        "max_rows": {"type": "integer", "default": 100}
    }
)
async def query_database(query: str, max_rows: int = 100):
    """Safe database query with row limits"""
    # Validate query is read-only
    if not query.strip().upper().startswith("SELECT"):
        raise ValueError("Only SELECT queries allowed")

    async with db_pool.acquire() as conn:
        result = await conn.execute(query + f" FETCH FIRST {max_rows} ROWS ONLY")
        return result.fetchall()

@FunctionTool(
    name="get_document",
    description="Retrieve document from Object Storage",
    parameters={
        "bucket": {"type": "string", "required": True},
        "object_name": {"type": "string", "required": True}
    }
)
async def get_document(bucket: str, object_name: str):
    """Fetch document from OCI Object Storage"""
    client = object_storage.ObjectStorageClient(oci_config)
    response = client.get_object(namespace, bucket, object_name)
    return response.data.text
```

---

## Workflow Patterns

### Pattern 1: Sequential Processing

```python
from oci_adk import Workflow, Step

document_workflow = Workflow([
    Step("ingest", document_ingestion_agent),
    Step("extract", entity_extraction_agent),
    Step("validate", validation_agent),
    Step("store", database_storage_agent),
    Step("notify", notification_agent)
])

# Execute pipeline
result = await document_workflow.execute_async(document_input)
```

### Pattern 2: Parallel Fan-Out

```python
import asyncio

async def parallel_analysis(data: dict):
    """Run multiple analyses concurrently"""
    tasks = [
        sentiment_agent.execute_async(data["text"]),
        entity_agent.execute_async(data["text"]),
        classification_agent.execute_async(data["text"]),
        summary_agent.execute_async(data["text"])
    ]

    results = await asyncio.gather(*tasks)

    return {
        "sentiment": results[0],
        "entities": results[1],
        "classification": results[2],
        "summary": results[3]
    }
```

### Pattern 3: Conditional Routing

```python
from oci_adk import ConditionalWorkflow

def urgency_router(context: dict) -> str:
    """Route based on urgency and type"""
    if context.get("urgency") == "critical":
        return "critical_path"
    elif context.get("type") == "technical":
        return "technical_path"
    return "standard_path"

support_workflow = ConditionalWorkflow(
    router=urgency_router,
    paths={
        "critical_path": [
            immediate_response_agent,
            manager_notification_agent,
            escalation_agent
        ],
        "technical_path": [
            technical_classifier_agent,
            expert_matching_agent,
            resolution_agent
        ],
        "standard_path": [
            general_support_agent
        ]
    }
)
```

---

## Security Architecture

### OCI IAM Integration

```python
from oci.config import from_file
from oci.signer import Signer

# Load OCI config from default location
oci_config = from_file()

# Create authenticated agent
secure_agent = Agent(
    name="secure_agent",
    model="cohere.command-r-plus",
    oci_config=oci_config,
    compartment_id="ocid1.compartment.oc1..example"
)
```

### Tool Permission Boundaries

```python
@FunctionTool(
    name="database_query",
    description="Query database with restrictions",
    parameters={"query": {"type": "string"}},
    permissions={
        "allowed_tables": ["customers", "orders", "products"],
        "denied_operations": ["DELETE", "UPDATE", "INSERT", "DROP"],
        "row_limit": 1000
    }
)
def safe_database_query(query: str):
    # Validate against permissions before execution
    validate_query(query, permissions)
    return execute_query(query)
```

### Audit Logging

```python
import logging
from datetime import datetime

audit_logger = logging.getLogger("agent_audit")

def audit_decorator(func):
    """Log all agent actions for compliance"""
    async def wrapper(*args, **kwargs):
        action = {
            "timestamp": datetime.utcnow().isoformat(),
            "function": func.__name__,
            "args": args,
            "kwargs": kwargs,
            "user": get_current_user()
        }

        try:
            result = await func(*args, **kwargs)
            action["status"] = "success"
            return result
        except Exception as e:
            action["status"] = "error"
            action["error"] = str(e)
            raise
        finally:
            audit_logger.info(json.dumps(action))

    return wrapper
```

---

## Deployment Architecture

### Container Deployment

```yaml
# docker-compose.yml
version: '3.8'

services:
  agent-api:
    build: .
    ports:
      - "8080:8080"
    environment:
      - OCI_CONFIG_FILE=/app/.oci/config
      - COMPARTMENT_ID=${COMPARTMENT_ID}
      - DB_CONNECTION=${DB_CONNECTION}
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '2'
          memory: 4G
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### OCI Kubernetes (OKE) Deployment

```yaml
# kubernetes/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: adk-agent
spec:
  replicas: 3
  selector:
    matchLabels:
      app: adk-agent
  template:
    metadata:
      labels:
        app: adk-agent
    spec:
      containers:
      - name: agent
        image: ${REGION}.ocir.io/${NAMESPACE}/adk-agent:latest
        ports:
        - containerPort: 8080
        env:
        - name: OCI_RESOURCE_PRINCIPAL_VERSION
          value: "2.2"
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
          limits:
            memory: "4Gi"
            cpu: "2000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
```

### Multi-Region Setup

```python
# Multi-region deployment configuration
REGIONS = {
    "primary": {
        "region": "us-ashburn-1",
        "priority": 1,
        "config": {
            "min_instances": 3,
            "max_instances": 10
        }
    },
    "secondary": {
        "region": "us-phoenix-1",
        "priority": 2,
        "config": {
            "min_instances": 2,
            "max_instances": 5
        }
    },
    "dr": {
        "region": "eu-frankfurt-1",
        "priority": 3,
        "config": {
            "min_instances": 1,
            "max_instances": 3
        }
    }
}

async def deploy_multi_region(agent: Agent):
    """Deploy agent across multiple OCI regions"""
    for name, config in REGIONS.items():
        await deploy_to_region(
            agent=agent,
            region=config["region"],
            **config["config"]
        )
```

---

## Observability

### Metrics Collection

```python
from oci.monitoring import MonitoringClient

metrics_client = MonitoringClient(oci_config)

async def publish_metrics(agent_id: str, metrics: dict):
    """Publish agent metrics to OCI Monitoring"""
    await metrics_client.post_metric_data(
        post_metric_data_details={
            "metricData": [{
                "namespace": "agent_metrics",
                "compartmentId": compartment_id,
                "name": "agent_latency",
                "dimensions": {"agent_id": agent_id},
                "datapoints": [{
                    "timestamp": datetime.utcnow(),
                    "value": metrics["latency_ms"]
                }]
            }]
        }
    )
```

### Logging to OCI Logging

```python
from oci.loggingingestion import LoggingClient

logging_client = LoggingClient(oci_config)

async def log_agent_event(event: dict):
    """Send agent events to OCI Logging"""
    await logging_client.put_logs(
        log_id=log_ocid,
        put_logs_details={
            "specversion": "1.0",
            "logEntryBatches": [{
                "entries": [{
                    "data": json.dumps(event),
                    "time": datetime.utcnow().isoformat()
                }]
            }]
        }
    )
```

### Dashboard Metrics

| Metric | Description | Alert Threshold |
|--------|-------------|-----------------|
| `agent_latency_p99` | 99th percentile response time | > 5000ms |
| `agent_error_rate` | Percentage of failed requests | > 1% |
| `tool_call_count` | Number of tool invocations | Monitoring only |
| `token_usage` | Tokens consumed per request | > 10000 |
| `active_conversations` | Concurrent conversation count | > 1000 |

---

## Cost Optimization

### Model Selection Strategy

```python
# Route to appropriate model based on complexity
def select_model(task_complexity: str) -> str:
    models = {
        "simple": "cohere.command-light",      # $0.0004/1K tokens
        "standard": "cohere.command-r",        # $0.001/1K tokens
        "complex": "cohere.command-r-plus"     # $0.003/1K tokens
    }
    return models.get(task_complexity, models["standard"])

# Simple classifier for routing
complexity_classifier = Agent(
    name="complexity_classifier",
    model="cohere.command-light",  # Use cheap model for classification
    system_prompt="Classify as: simple, standard, or complex"
)
```

### Caching Layer

```python
from functools import lru_cache
import hashlib

@lru_cache(maxsize=10000)
def cached_tool_call(tool_name: str, args_hash: str):
    """Cache expensive tool calls"""
    return execute_tool(tool_name, args_hash)

def get_args_hash(args: dict) -> str:
    return hashlib.sha256(json.dumps(args, sort_keys=True).encode()).hexdigest()
```

---

## Testing Strategy

### Unit Tests

```python
import pytest
from unittest.mock import Mock, patch

@pytest.mark.asyncio
async def test_support_agent_handles_order_query():
    agent = SupportAgent()

    with patch('tools.order_status_tool') as mock_tool:
        mock_tool.return_value = {"status": "shipped", "eta": "2025-01-05"}

        result = await agent.handle(
            "Where is my order #12345?",
            context={"customer_id": "CUST001"}
        )

        assert "shipped" in result.text.lower()
        mock_tool.assert_called_once()
```

### Integration Tests

```python
@pytest.mark.integration
async def test_full_workflow():
    workflow = document_workflow

    test_document = {
        "content": "Invoice #INV-2025-001...",
        "type": "invoice"
    }

    result = await workflow.execute_async(test_document)

    assert result.status == "success"
    assert result.stored_id is not None
```

---

## When to Use This Pattern

**Ideal For:**
- Enterprise applications on OCI
- Multi-agent orchestration needs
- Integration with Oracle Fusion/Cloud apps
- Compliance-heavy industries (finance, healthcare)
- Multi-region deployment requirements

**Consider Alternatives When:**
- Not using Oracle Cloud infrastructure
- Need visual agent builder (consider AgentKit)
- Want framework-agnostic approach (consider Agent Spec)
- Building simple single-agent applications

---

## Related Patterns

- [Orchestration Workflow Pattern](./orchestration-workflow.md)
- [Multi-Agent Swarms](../15-workflows/agentic-swarms.md)
- [OCI Services Reference](../11-hyperscalers/oci/README.md)
- [Oracle ADK Learning Path](../02-learning-paths/oracle-adk-agents.md)
