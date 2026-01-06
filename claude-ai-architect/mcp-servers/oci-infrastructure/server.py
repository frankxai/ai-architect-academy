#!/usr/bin/env python3
"""
OCI Infrastructure MCP Server
=============================

Model Context Protocol server for Oracle Cloud Infrastructure operations.
Enables Claude to interact with OCI services including GenAI, Compute, and more.

Installation:
    pip install mcp oci

Usage:
    python server.py

Add to Claude settings:
    {
      "mcpServers": {
        "oci": {
          "command": "python",
          "args": ["/path/to/server.py"],
          "env": {
            "OCI_CONFIG_FILE": "~/.oci/config",
            "OCI_CONFIG_PROFILE": "DEFAULT"
          }
        }
      }
    }
"""

import asyncio
import json
import os
from typing import Any, Optional

try:
    import oci
    from mcp.server import Server
    from mcp.server.stdio import stdio_server
    from mcp.types import Tool, TextContent, Resource
except ImportError as e:
    print(f"Missing dependency: {e}")
    print("Install with: pip install mcp oci")
    exit(1)


# Initialize server
server = Server("oci-infrastructure")

# OCI Configuration
OCI_CONFIG_FILE = os.environ.get("OCI_CONFIG_FILE", "~/.oci/config")
OCI_CONFIG_PROFILE = os.environ.get("OCI_CONFIG_PROFILE", "DEFAULT")


def get_oci_config():
    """Get OCI configuration."""
    return oci.config.from_file(OCI_CONFIG_FILE, OCI_CONFIG_PROFILE)


def get_compute_client():
    """Get OCI Compute client."""
    return oci.core.ComputeClient(get_oci_config())


def get_genai_client():
    """Get OCI Generative AI client."""
    return oci.generative_ai.GenerativeAiClient(get_oci_config())


def get_genai_inference_client():
    """Get OCI Generative AI Inference client."""
    config = get_oci_config()
    return oci.generative_ai_inference.GenerativeAiInferenceClient(
        config,
        service_endpoint=f"https://inference.generativeai.{config['region']}.oci.oraclecloud.com"
    )


def get_identity_client():
    """Get OCI Identity client."""
    return oci.identity.IdentityClient(get_oci_config())


# ============================================================================
# Tools: GenAI Operations
# ============================================================================

@server.tool()
async def list_genai_clusters(compartment_id: str) -> str:
    """
    List all Dedicated AI Clusters in a compartment.

    Args:
        compartment_id: OCI Compartment OCID

    Returns:
        JSON list of clusters with id, name, type, units, state
    """
    try:
        client = get_genai_client()
        response = client.list_dedicated_ai_clusters(compartment_id=compartment_id)

        clusters = []
        for cluster in response.data.items:
            clusters.append({
                "id": cluster.id,
                "name": cluster.display_name,
                "type": cluster.type,
                "unit_count": cluster.unit_count,
                "unit_shape": cluster.unit_shape,
                "state": cluster.lifecycle_state,
                "time_created": str(cluster.time_created)
            })

        return json.dumps(clusters, indent=2)
    except Exception as e:
        return json.dumps({"error": str(e)})


@server.tool()
async def list_genai_endpoints(compartment_id: str, cluster_id: Optional[str] = None) -> str:
    """
    List GenAI endpoints in a compartment.

    Args:
        compartment_id: OCI Compartment OCID
        cluster_id: Optional - filter by cluster OCID

    Returns:
        JSON list of endpoints
    """
    try:
        client = get_genai_client()

        kwargs = {"compartment_id": compartment_id}
        if cluster_id:
            kwargs["dedicated_ai_cluster_id"] = cluster_id

        response = client.list_endpoints(**kwargs)

        endpoints = []
        for endpoint in response.data.items:
            endpoints.append({
                "id": endpoint.id,
                "name": endpoint.display_name,
                "model_id": endpoint.model_id,
                "cluster_id": endpoint.dedicated_ai_cluster_id,
                "state": endpoint.lifecycle_state
            })

        return json.dumps(endpoints, indent=2)
    except Exception as e:
        return json.dumps({"error": str(e)})


@server.tool()
async def list_genai_models(compartment_id: str) -> str:
    """
    List available GenAI models.

    Args:
        compartment_id: OCI Compartment OCID

    Returns:
        JSON list of available models
    """
    try:
        client = get_genai_client()
        response = client.list_models(compartment_id=compartment_id)

        models = []
        for model in response.data.items:
            models.append({
                "id": model.id,
                "name": model.display_name,
                "vendor": model.vendor,
                "version": model.version,
                "capabilities": model.capabilities,
                "type": model.type
            })

        return json.dumps(models, indent=2)
    except Exception as e:
        return json.dumps({"error": str(e)})


@server.tool()
async def generate_text(
    compartment_id: str,
    prompt: str,
    model_id: str = "cohere.command-r-plus",
    max_tokens: int = 500,
    temperature: float = 0.7
) -> str:
    """
    Generate text using OCI GenAI (on-demand).

    Args:
        compartment_id: OCI Compartment OCID
        prompt: Input prompt
        model_id: Model ID (default: cohere.command-r-plus)
        max_tokens: Maximum tokens in response
        temperature: Creativity (0-1)

    Returns:
        Generated text response
    """
    try:
        client = get_genai_inference_client()

        response = client.generate_text(
            oci.generative_ai_inference.models.GenerateTextDetails(
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
        )

        generated_text = response.data.inference_response.generated_texts[0].text
        return json.dumps({
            "text": generated_text,
            "model": model_id,
            "tokens": len(generated_text.split()) * 1.3  # Rough estimate
        })
    except Exception as e:
        return json.dumps({"error": str(e)})


# ============================================================================
# Tools: Compute Operations
# ============================================================================

@server.tool()
async def list_compute_instances(compartment_id: str, shape_filter: Optional[str] = None) -> str:
    """
    List compute instances in a compartment.

    Args:
        compartment_id: OCI Compartment OCID
        shape_filter: Optional filter (e.g., "GPU" for GPU instances)

    Returns:
        JSON list of instances
    """
    try:
        client = get_compute_client()
        response = client.list_instances(compartment_id=compartment_id)

        instances = []
        for instance in response.data:
            if shape_filter and shape_filter.upper() not in instance.shape.upper():
                continue
            instances.append({
                "id": instance.id,
                "name": instance.display_name,
                "shape": instance.shape,
                "state": instance.lifecycle_state,
                "availability_domain": instance.availability_domain,
                "time_created": str(instance.time_created)
            })

        return json.dumps(instances, indent=2)
    except Exception as e:
        return json.dumps({"error": str(e)})


@server.tool()
async def list_gpu_instances(compartment_id: str) -> str:
    """
    List GPU instances in a compartment.

    Args:
        compartment_id: OCI Compartment OCID

    Returns:
        JSON list of GPU instances
    """
    return await list_compute_instances(compartment_id, shape_filter="GPU")


@server.tool()
async def get_instance_details(instance_id: str) -> str:
    """
    Get detailed information about a compute instance.

    Args:
        instance_id: Instance OCID

    Returns:
        JSON with instance details
    """
    try:
        client = get_compute_client()
        response = client.get_instance(instance_id=instance_id)
        instance = response.data

        return json.dumps({
            "id": instance.id,
            "name": instance.display_name,
            "shape": instance.shape,
            "state": instance.lifecycle_state,
            "availability_domain": instance.availability_domain,
            "fault_domain": instance.fault_domain,
            "region": instance.region,
            "compartment_id": instance.compartment_id,
            "time_created": str(instance.time_created),
            "shape_config": {
                "ocpus": instance.shape_config.ocpus if instance.shape_config else None,
                "memory_gb": instance.shape_config.memory_in_gbs if instance.shape_config else None,
                "gpus": instance.shape_config.gpus if instance.shape_config and hasattr(instance.shape_config, 'gpus') else None
            },
            "metadata": instance.metadata,
            "freeform_tags": instance.freeform_tags
        }, indent=2, default=str)
    except Exception as e:
        return json.dumps({"error": str(e)})


# ============================================================================
# Tools: Identity Operations
# ============================================================================

@server.tool()
async def list_compartments(tenancy_id: str) -> str:
    """
    List compartments in a tenancy.

    Args:
        tenancy_id: Tenancy OCID

    Returns:
        JSON list of compartments
    """
    try:
        client = get_identity_client()
        response = client.list_compartments(
            compartment_id=tenancy_id,
            compartment_id_in_subtree=True
        )

        compartments = []
        for comp in response.data:
            compartments.append({
                "id": comp.id,
                "name": comp.name,
                "description": comp.description,
                "state": comp.lifecycle_state
            })

        return json.dumps(compartments, indent=2)
    except Exception as e:
        return json.dumps({"error": str(e)})


# ============================================================================
# Resources
# ============================================================================

@server.resource("oci://config")
async def get_oci_config_resource() -> str:
    """Get current OCI configuration (sanitized)."""
    try:
        config = get_oci_config()
        return json.dumps({
            "region": config.get("region"),
            "tenancy": config.get("tenancy"),
            "user": config.get("user"),
            "config_file": OCI_CONFIG_FILE,
            "profile": OCI_CONFIG_PROFILE
        }, indent=2)
    except Exception as e:
        return json.dumps({"error": str(e)})


@server.resource("oci://regions")
async def get_oci_regions() -> str:
    """Get list of OCI regions with GenAI availability."""
    return json.dumps({
        "genai_regions": [
            {"name": "us-chicago-1", "location": "Chicago, US"},
            {"name": "us-ashburn-1", "location": "Ashburn, US"},
            {"name": "eu-frankfurt-1", "location": "Frankfurt, DE"},
            {"name": "uk-london-1", "location": "London, UK"},
            {"name": "ap-tokyo-1", "location": "Tokyo, JP"}
        ]
    }, indent=2)


# ============================================================================
# Main
# ============================================================================

async def main():
    """Run the MCP server."""
    async with stdio_server() as (read_stream, write_stream):
        await server.run(read_stream, write_stream)


if __name__ == "__main__":
    asyncio.run(main())
