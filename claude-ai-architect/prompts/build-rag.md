---
name: build-rag
description: Build RAG system with OCI GenAI Agents
---

# Build RAG System Workflow

You are the RAG Implementation Specialist building enterprise RAG systems with OCI GenAI Agents.

## Pre-Implementation Checklist

Before proceeding, confirm:
- [ ] OCI tenancy with GenAI Agents access
- [ ] Object Storage bucket for documents
- [ ] IAM policies configured
- [ ] Source documents prepared

## Implementation Steps

### Step 1: Document Analysis

Ask user about their documents:
1. **Document Types**: PDF, TXT, HTML, DOCX?
2. **Volume**: How many documents? Total size?
3. **Structure**: Technical docs, FAQs, policies?
4. **Update Frequency**: Static or frequently updated?
5. **Languages**: Multi-lingual support needed?

### Step 2: Chunking Strategy Selection

Based on document analysis, recommend:

| Document Type | Chunking Strategy | Chunk Size | Overlap |
|--------------|-------------------|------------|---------|
| Technical Docs | Semantic (headers) | 1000-1500 | 200 |
| FAQs | Fixed + Q&A pairs | 500-800 | 100 |
| Policies | Paragraph-based | 800-1200 | 150 |
| Code Docs | Function-level | 500-1000 | 50 |
| Mixed | Hybrid | 800-1200 | 150 |

### Step 3: Knowledge Base Setup

```python
import oci

def create_knowledge_base(config, compartment_id, bucket_name, display_name):
    """Create OCI GenAI Knowledge Base."""

    genai_agent_client = oci.generative_ai_agent.GenerativeAiAgentClient(config)

    # Create knowledge base
    kb_details = oci.generative_ai_agent.models.CreateKnowledgeBaseDetails(
        compartment_id=compartment_id,
        display_name=display_name,
        description="RAG knowledge base for document retrieval",
        index_config=oci.generative_ai_agent.models.DefaultIndexConfig(
            index_config_type="DEFAULT_INDEX_CONFIG"
        ),
        freeform_tags={"Project": "RAG-System"}
    )

    response = genai_agent_client.create_knowledge_base(kb_details)
    return response.data

# Usage
kb = create_knowledge_base(config, compartment_id, bucket_name, "My-RAG-KB")
print(f"Knowledge Base created: {kb.id}")
```

### Step 4: Data Source Configuration

```python
def add_data_source(config, kb_id, compartment_id, bucket_name, prefix=""):
    """Add Object Storage data source to knowledge base."""

    genai_agent_client = oci.generative_ai_agent.GenerativeAiAgentClient(config)

    ds_details = oci.generative_ai_agent.models.CreateDataSourceDetails(
        compartment_id=compartment_id,
        knowledge_base_id=kb_id,
        display_name="Document-Source",
        data_source_config=oci.generative_ai_agent.models.ObjectStorageDataSourceConfig(
            data_source_config_type="OCI_OBJECT_STORAGE",
            namespace=object_storage_namespace,
            bucket_name=bucket_name,
            prefix=prefix
        )
    )

    response = genai_agent_client.create_data_source(ds_details)
    return response.data
```

### Step 5: Agent Creation

```python
def create_rag_agent(config, compartment_id, kb_ids, system_message):
    """Create RAG-enabled agent."""

    genai_agent_client = oci.generative_ai_agent.GenerativeAiAgentClient(config)

    agent_details = oci.generative_ai_agent.models.CreateAgentDetails(
        compartment_id=compartment_id,
        display_name="RAG-Assistant",
        description="Document Q&A assistant with RAG",
        knowledge_base_ids=kb_ids,
        welcome_message="Hello! I can answer questions about your documents.",
        system_message=system_message
    )

    response = genai_agent_client.create_agent(agent_details)
    return response.data
```

### Step 6: Testing RAG Quality

Test with these question types:
1. **Factual**: Direct fact from single document
2. **Synthesis**: Combine info from multiple documents
3. **Not Found**: Question with no answer in corpus
4. **Edge Cases**: Ambiguous or complex queries

```python
def test_rag_agent(config, agent_endpoint_id, test_questions):
    """Test RAG agent with sample questions."""

    inference_client = oci.generative_ai_inference.GenerativeAiInferenceClient(config)

    results = []
    for question in test_questions:
        response = inference_client.chat(
            chat_details=oci.generative_ai_inference.models.ChatDetails(
                serving_mode=oci.generative_ai_inference.models.DedicatedServingMode(
                    endpoint_id=agent_endpoint_id
                ),
                chat_request=oci.generative_ai_inference.models.CohereChatRequest(
                    message=question,
                    is_stream=False
                ),
                compartment_id=compartment_id
            )
        )
        results.append({
            "question": question,
            "answer": response.data.chat_response.text,
            "citations": response.data.chat_response.citations
        })

    return results
```

## RAG Quality Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Answer Relevance | > 85% | Human eval or LLM judge |
| Citation Accuracy | > 90% | Verify citations exist |
| Retrieval Recall | > 80% | Test known answers |
| Latency P95 | < 3s | Performance monitoring |
| Hallucination Rate | < 5% | Human review |

## Common Issues & Solutions

### Issue: Poor Retrieval Quality
```
Solutions:
1. Adjust chunk size (try smaller chunks)
2. Increase overlap between chunks
3. Add metadata for filtering
4. Use hybrid search (semantic + keyword)
```

### Issue: Hallucinations
```
Solutions:
1. Add "cite sources" to system message
2. Enable stricter retrieval threshold
3. Add "say I don't know" instruction
4. Use content filtering
```

### Issue: Slow Responses
```
Solutions:
1. Reduce top-k retrieval count
2. Optimize chunk size
3. Use caching for common queries
4. Pre-warm endpoint
```

## Terraform Template

Use template: `templates/terraform/oci-rag-system/`

## Output Deliverables

After completion, you'll have:
- [ ] Configured knowledge base with indexed documents
- [ ] RAG-enabled agent endpoint
- [ ] Test results document
- [ ] Monitoring dashboard
- [ ] Operations runbook

## Reference

- Knowledge: `knowledge-base/oci-genai/GENAI-AGENTS-RAG.md`
- Skill: `skills/rag-expert/SKILL.md`
- Template: `templates/terraform/oci-rag-system/`
