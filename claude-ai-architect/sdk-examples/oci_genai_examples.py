"""
OCI GenAI SDK Examples
======================

Complete examples for working with OCI Generative AI services.

Prerequisites:
    pip install oci

    Configure OCI CLI:
    oci setup config

Usage:
    python oci_genai_examples.py
"""

import oci
import json
from typing import Optional, List, Dict, Any
from dataclasses import dataclass


# ============================================================================
# Configuration
# ============================================================================

@dataclass
class GenAIConfig:
    """Configuration for OCI GenAI."""
    compartment_id: str
    region: str = "us-chicago-1"
    endpoint_id: Optional[str] = None  # For dedicated clusters
    model_id: str = "cohere.command-r-plus"


def get_clients(config_file: str = "~/.oci/config", profile: str = "DEFAULT"):
    """Initialize OCI clients."""

    config = oci.config.from_file(config_file, profile)

    # GenAI Inference Client (for generating text)
    inference_client = oci.generative_ai_inference.GenerativeAiInferenceClient(
        config,
        service_endpoint=f"https://inference.generativeai.{config['region']}.oci.oraclecloud.com"
    )

    # GenAI Management Client (for managing clusters, models)
    management_client = oci.generative_ai.GenerativeAiClient(config)

    # GenAI Agent Client (for RAG agents)
    agent_client = oci.generative_ai_agent.GenerativeAiAgentClient(config)

    return {
        "inference": inference_client,
        "management": management_client,
        "agent": agent_client,
        "config": config
    }


# ============================================================================
# Text Generation
# ============================================================================

def generate_text_on_demand(
    clients: dict,
    prompt: str,
    compartment_id: str,
    model_id: str = "cohere.command-r-plus",
    max_tokens: int = 500,
    temperature: float = 0.7
) -> str:
    """
    Generate text using on-demand (pay-per-token) serving.

    Best for: Low volume, variable workloads

    Args:
        clients: OCI clients dictionary
        prompt: The input prompt
        compartment_id: OCI compartment OCID
        model_id: Model to use (e.g., cohere.command-r-plus)
        max_tokens: Maximum tokens in response
        temperature: Creativity (0=deterministic, 1=creative)

    Returns:
        Generated text response
    """

    inference_client = clients["inference"]

    # Prepare request for Cohere models
    generate_text_details = oci.generative_ai_inference.models.GenerateTextDetails(
        compartment_id=compartment_id,
        serving_mode=oci.generative_ai_inference.models.OnDemandServingMode(
            model_id=model_id
        ),
        inference_request=oci.generative_ai_inference.models.CohereLlmInferenceRequest(
            prompt=prompt,
            max_tokens=max_tokens,
            temperature=temperature,
            is_stream=False
        )
    )

    response = inference_client.generate_text(generate_text_details)

    # Extract generated text
    generated_text = response.data.inference_response.generated_texts[0].text

    return generated_text


def generate_text_dedicated(
    clients: dict,
    prompt: str,
    compartment_id: str,
    endpoint_id: str,
    max_tokens: int = 500,
    temperature: float = 0.7
) -> str:
    """
    Generate text using Dedicated AI Cluster (DAC).

    Best for: High volume, predictable workloads, fine-tuned models

    Args:
        clients: OCI clients dictionary
        prompt: The input prompt
        compartment_id: OCI compartment OCID
        endpoint_id: Dedicated endpoint OCID
        max_tokens: Maximum tokens in response
        temperature: Creativity (0=deterministic, 1=creative)

    Returns:
        Generated text response
    """

    inference_client = clients["inference"]

    generate_text_details = oci.generative_ai_inference.models.GenerateTextDetails(
        compartment_id=compartment_id,
        serving_mode=oci.generative_ai_inference.models.DedicatedServingMode(
            endpoint_id=endpoint_id
        ),
        inference_request=oci.generative_ai_inference.models.CohereLlmInferenceRequest(
            prompt=prompt,
            max_tokens=max_tokens,
            temperature=temperature,
            is_stream=False
        )
    )

    response = inference_client.generate_text(generate_text_details)

    return response.data.inference_response.generated_texts[0].text


def generate_text_streaming(
    clients: dict,
    prompt: str,
    compartment_id: str,
    model_id: str = "cohere.command-r-plus"
):
    """
    Generate text with streaming response.

    Best for: Real-time chat applications, long responses

    Yields:
        Text chunks as they are generated
    """

    inference_client = clients["inference"]

    generate_text_details = oci.generative_ai_inference.models.GenerateTextDetails(
        compartment_id=compartment_id,
        serving_mode=oci.generative_ai_inference.models.OnDemandServingMode(
            model_id=model_id
        ),
        inference_request=oci.generative_ai_inference.models.CohereLlmInferenceRequest(
            prompt=prompt,
            max_tokens=1000,
            is_stream=True
        )
    )

    response = inference_client.generate_text(generate_text_details)

    # Stream the response
    for event in response.data.events():
        if event.data:
            chunk = json.loads(event.data)
            if "text" in chunk:
                yield chunk["text"]


# ============================================================================
# Chat / Conversational AI
# ============================================================================

def chat_completion(
    clients: dict,
    messages: List[Dict[str, str]],
    compartment_id: str,
    model_id: str = "cohere.command-r-plus",
    system_message: Optional[str] = None
) -> str:
    """
    Multi-turn chat completion.

    Args:
        clients: OCI clients dictionary
        messages: List of {"role": "user|assistant", "content": "..."}
        compartment_id: OCI compartment OCID
        model_id: Model to use
        system_message: Optional system prompt

    Returns:
        Assistant's response
    """

    inference_client = clients["inference"]

    # Convert messages to Cohere format
    chat_history = []
    current_message = ""

    for msg in messages[:-1]:  # All but last message go to history
        chat_history.append(
            oci.generative_ai_inference.models.CohereMessage(
                role="USER" if msg["role"] == "user" else "CHATBOT",
                message=msg["content"]
            )
        )

    # Last message is the current query
    current_message = messages[-1]["content"]

    chat_details = oci.generative_ai_inference.models.ChatDetails(
        compartment_id=compartment_id,
        serving_mode=oci.generative_ai_inference.models.OnDemandServingMode(
            model_id=model_id
        ),
        chat_request=oci.generative_ai_inference.models.CohereChatRequest(
            message=current_message,
            chat_history=chat_history if chat_history else None,
            preamble_override=system_message,
            is_stream=False
        )
    )

    response = inference_client.chat(chat_details)

    return response.data.chat_response.text


# ============================================================================
# Embeddings
# ============================================================================

def generate_embeddings(
    clients: dict,
    texts: List[str],
    compartment_id: str,
    model_id: str = "cohere.embed-english-v3.0",
    input_type: str = "SEARCH_DOCUMENT"
) -> List[List[float]]:
    """
    Generate embeddings for texts.

    Args:
        clients: OCI clients dictionary
        texts: List of texts to embed
        compartment_id: OCI compartment OCID
        model_id: Embedding model
        input_type: SEARCH_DOCUMENT, SEARCH_QUERY, CLASSIFICATION, CLUSTERING

    Returns:
        List of embedding vectors
    """

    inference_client = clients["inference"]

    embed_details = oci.generative_ai_inference.models.EmbedTextDetails(
        compartment_id=compartment_id,
        serving_mode=oci.generative_ai_inference.models.OnDemandServingMode(
            model_id=model_id
        ),
        inputs=texts,
        input_type=input_type
    )

    response = inference_client.embed_text(embed_details)

    return response.data.embeddings


# ============================================================================
# Dedicated AI Cluster Management
# ============================================================================

def create_hosting_cluster(
    clients: dict,
    compartment_id: str,
    display_name: str,
    unit_count: int = 10,
    unit_shape: str = "LARGE_COHERE"
) -> str:
    """
    Create a Dedicated AI Cluster for hosting models.

    Args:
        clients: OCI clients dictionary
        compartment_id: OCI compartment OCID
        display_name: Cluster name
        unit_count: Number of units (1-50)
        unit_shape: LARGE_COHERE, SMALL_COHERE, LARGE_LLAMA

    Returns:
        Cluster OCID
    """

    management_client = clients["management"]

    cluster_details = oci.generative_ai.models.CreateDedicatedAiClusterDetails(
        compartment_id=compartment_id,
        type="HOSTING",
        unit_count=unit_count,
        unit_shape=unit_shape,
        display_name=display_name,
        description=f"Hosting cluster for {display_name}"
    )

    response = management_client.create_dedicated_ai_cluster(cluster_details)

    cluster_id = response.data.id

    print(f"Created cluster: {cluster_id}")
    print(f"Status: {response.data.lifecycle_state}")
    print("Note: Cluster provisioning takes ~15-30 minutes")

    return cluster_id


def create_endpoint(
    clients: dict,
    compartment_id: str,
    cluster_id: str,
    model_id: str,
    display_name: str
) -> str:
    """
    Create an endpoint on a Dedicated AI Cluster.

    Args:
        clients: OCI clients dictionary
        compartment_id: OCI compartment OCID
        cluster_id: Hosting cluster OCID
        model_id: Model to serve
        display_name: Endpoint name

    Returns:
        Endpoint OCID
    """

    management_client = clients["management"]

    endpoint_details = oci.generative_ai.models.CreateEndpointDetails(
        compartment_id=compartment_id,
        dedicated_ai_cluster_id=cluster_id,
        model_id=model_id,
        display_name=display_name,
        content_moderation_config=oci.generative_ai.models.ContentModerationConfig(
            is_enabled=True
        )
    )

    response = management_client.create_endpoint(endpoint_details)

    return response.data.id


def list_clusters(clients: dict, compartment_id: str) -> List[Dict]:
    """List all Dedicated AI Clusters in a compartment."""

    management_client = clients["management"]

    response = management_client.list_dedicated_ai_clusters(
        compartment_id=compartment_id
    )

    clusters = []
    for cluster in response.data.items:
        clusters.append({
            "id": cluster.id,
            "name": cluster.display_name,
            "type": cluster.type,
            "unit_count": cluster.unit_count,
            "state": cluster.lifecycle_state
        })

    return clusters


# ============================================================================
# RAG with GenAI Agents
# ============================================================================

def create_knowledge_base(
    clients: dict,
    compartment_id: str,
    display_name: str
) -> str:
    """
    Create a Knowledge Base for RAG.

    Args:
        clients: OCI clients dictionary
        compartment_id: OCI compartment OCID
        display_name: Knowledge base name

    Returns:
        Knowledge Base OCID
    """

    agent_client = clients["agent"]

    kb_details = oci.generative_ai_agent.models.CreateKnowledgeBaseDetails(
        compartment_id=compartment_id,
        display_name=display_name,
        description=f"Knowledge base for {display_name}",
        index_config=oci.generative_ai_agent.models.DefaultIndexConfig(
            index_config_type="DEFAULT_INDEX_CONFIG"
        )
    )

    response = agent_client.create_knowledge_base(kb_details)

    return response.data.id


def create_rag_agent(
    clients: dict,
    compartment_id: str,
    knowledge_base_ids: List[str],
    display_name: str,
    system_message: str
) -> str:
    """
    Create a RAG-enabled Agent.

    Args:
        clients: OCI clients dictionary
        compartment_id: OCI compartment OCID
        knowledge_base_ids: List of Knowledge Base OCIDs
        display_name: Agent name
        system_message: System instructions

    Returns:
        Agent OCID
    """

    agent_client = clients["agent"]

    agent_details = oci.generative_ai_agent.models.CreateAgentDetails(
        compartment_id=compartment_id,
        display_name=display_name,
        description=f"RAG agent for {display_name}",
        knowledge_base_ids=knowledge_base_ids,
        welcome_message="Hello! How can I help you today?",
        system_message=system_message
    )

    response = agent_client.create_agent(agent_details)

    return response.data.id


def query_rag_agent(
    clients: dict,
    compartment_id: str,
    agent_endpoint_id: str,
    query: str,
    session_id: Optional[str] = None
) -> Dict[str, Any]:
    """
    Query a RAG agent.

    Args:
        clients: OCI clients dictionary
        compartment_id: OCI compartment OCID
        agent_endpoint_id: Agent endpoint OCID
        query: User question
        session_id: Optional session ID for multi-turn

    Returns:
        Response with answer and citations
    """

    inference_client = clients["inference"]

    chat_details = oci.generative_ai_inference.models.ChatDetails(
        compartment_id=compartment_id,
        serving_mode=oci.generative_ai_inference.models.DedicatedServingMode(
            endpoint_id=agent_endpoint_id
        ),
        chat_request=oci.generative_ai_inference.models.CohereChatRequest(
            message=query,
            is_stream=False
        )
    )

    response = inference_client.chat(chat_details)

    return {
        "answer": response.data.chat_response.text,
        "citations": response.data.chat_response.citations if hasattr(response.data.chat_response, 'citations') else [],
        "session_id": session_id
    }


# ============================================================================
# Utility Functions
# ============================================================================

def wait_for_cluster_active(
    clients: dict,
    cluster_id: str,
    timeout_minutes: int = 45
) -> bool:
    """Wait for cluster to become active."""

    import time

    management_client = clients["management"]

    start_time = time.time()
    timeout_seconds = timeout_minutes * 60

    while True:
        response = management_client.get_dedicated_ai_cluster(cluster_id)
        state = response.data.lifecycle_state

        if state == "ACTIVE":
            print(f"Cluster {cluster_id} is now ACTIVE")
            return True
        elif state in ["FAILED", "DELETED"]:
            print(f"Cluster {cluster_id} is in state: {state}")
            return False

        elapsed = time.time() - start_time
        if elapsed > timeout_seconds:
            print(f"Timeout waiting for cluster after {timeout_minutes} minutes")
            return False

        print(f"Cluster state: {state}. Waiting... ({int(elapsed/60)} min)")
        time.sleep(60)  # Check every minute


def estimate_tokens(text: str) -> int:
    """Rough estimate of token count."""
    # Cohere models: ~1.3 tokens per word
    return int(len(text.split()) * 1.3)


def estimate_cost(
    input_tokens: int,
    output_tokens: int,
    model: str = "command-r-plus"
) -> float:
    """Estimate cost for on-demand inference."""

    PRICING = {
        "command-r-plus": {"input": 3.0, "output": 15.0},  # per 1M tokens
        "command-r": {"input": 1.5, "output": 7.5},
        "command-light": {"input": 0.3, "output": 0.6},
        "embed-english-v3.0": {"input": 0.1, "output": 0}
    }

    if model not in PRICING:
        return 0.0

    input_cost = (input_tokens / 1_000_000) * PRICING[model]["input"]
    output_cost = (output_tokens / 1_000_000) * PRICING[model]["output"]

    return input_cost + output_cost


# ============================================================================
# Example Usage
# ============================================================================

if __name__ == "__main__":
    # Initialize clients
    clients = get_clients()

    # Example compartment (replace with your own)
    COMPARTMENT_ID = "ocid1.compartment.oc1..example"

    # Example 1: Simple text generation
    print("=== Text Generation ===")
    response = generate_text_on_demand(
        clients=clients,
        prompt="Explain quantum computing in simple terms.",
        compartment_id=COMPARTMENT_ID,
        model_id="cohere.command-r-plus",
        max_tokens=200
    )
    print(response)

    # Example 2: Chat completion
    print("\n=== Chat Completion ===")
    messages = [
        {"role": "user", "content": "What is machine learning?"},
        {"role": "assistant", "content": "Machine learning is a subset of AI..."},
        {"role": "user", "content": "Can you give me an example?"}
    ]
    response = chat_completion(
        clients=clients,
        messages=messages,
        compartment_id=COMPARTMENT_ID
    )
    print(response)

    # Example 3: Embeddings
    print("\n=== Embeddings ===")
    texts = [
        "How do I reset my password?",
        "What are your business hours?",
        "I need to return a product."
    ]
    embeddings = generate_embeddings(
        clients=clients,
        texts=texts,
        compartment_id=COMPARTMENT_ID
    )
    print(f"Generated {len(embeddings)} embeddings of dimension {len(embeddings[0])}")

    # Example 4: List clusters
    print("\n=== Dedicated AI Clusters ===")
    clusters = list_clusters(clients, COMPARTMENT_ID)
    for cluster in clusters:
        print(f"  {cluster['name']}: {cluster['state']} ({cluster['unit_count']} units)")

    # Example 5: Cost estimation
    print("\n=== Cost Estimation ===")
    input_tokens = estimate_tokens("What is the capital of France?")
    output_tokens = 100
    cost = estimate_cost(input_tokens, output_tokens, "command-r-plus")
    print(f"Estimated cost: ${cost:.6f}")
