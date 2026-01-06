"""
NVIDIA NIM MCP Server
Model Context Protocol server that exposes NIM capabilities as tools

This MCP server allows any MCP-compatible client (Claude Desktop, other agents)
to use NVIDIA NIM for inference, embeddings, and analysis.
"""

import os
import json
import asyncio
from typing import Any

# Using the official MCP SDK
from mcp.server import Server
from mcp.types import Tool, TextContent, Resource
from mcp.server.stdio import stdio_server

from openai import OpenAI, AsyncOpenAI

# ============================================================================
# NVIDIA NIM CLIENT SETUP
# ============================================================================

def get_nim_client(base_url: str | None = None) -> OpenAI:
    """Get a configured NIM client"""
    return OpenAI(
        base_url=base_url or "https://integrate.api.nvidia.com/v1",
        api_key=os.environ.get("NVIDIA_API_KEY", "not-used")
    )


def get_async_nim_client(base_url: str | None = None) -> AsyncOpenAI:
    """Get an async NIM client"""
    return AsyncOpenAI(
        base_url=base_url or "https://integrate.api.nvidia.com/v1",
        api_key=os.environ.get("NVIDIA_API_KEY", "not-used")
    )


# ============================================================================
# MCP SERVER IMPLEMENTATION
# ============================================================================

# Create the MCP server
server = Server("nvidia-nim-server")

# Default configuration
DEFAULT_MODEL = "meta/llama-3.1-70b-instruct"
EMBEDDING_MODEL = "nvidia/nv-embedqa-e5-v5"


@server.list_tools()
async def list_tools() -> list[Tool]:
    """List available NIM tools"""
    return [
        Tool(
            name="nim_chat",
            description="Generate a response using NVIDIA NIM LLM. Supports various models including Llama 3.1, Mixtral, and Nemotron.",
            inputSchema={
                "type": "object",
                "properties": {
                    "prompt": {
                        "type": "string",
                        "description": "The user prompt to send to the model"
                    },
                    "system_prompt": {
                        "type": "string",
                        "description": "Optional system prompt to set context",
                        "default": "You are a helpful AI assistant."
                    },
                    "model": {
                        "type": "string",
                        "description": "Model to use (default: meta/llama-3.1-70b-instruct)",
                        "enum": [
                            "meta/llama-3.1-70b-instruct",
                            "meta/llama-3.1-8b-instruct",
                            "mistralai/mixtral-8x22b-instruct-v0.1",
                            "nvidia/nemotron-4-340b-instruct"
                        ],
                        "default": "meta/llama-3.1-70b-instruct"
                    },
                    "temperature": {
                        "type": "number",
                        "description": "Sampling temperature (0-1)",
                        "default": 0.7
                    },
                    "max_tokens": {
                        "type": "integer",
                        "description": "Maximum tokens to generate",
                        "default": 1024
                    }
                },
                "required": ["prompt"]
            }
        ),
        Tool(
            name="nim_embed",
            description="Generate embeddings for text using NVIDIA embedding models. Useful for semantic search and RAG.",
            inputSchema={
                "type": "object",
                "properties": {
                    "texts": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "List of texts to embed"
                    },
                    "model": {
                        "type": "string",
                        "description": "Embedding model to use",
                        "enum": [
                            "nvidia/nv-embedqa-e5-v5",
                            "nvidia/nv-embed-v2"
                        ],
                        "default": "nvidia/nv-embedqa-e5-v5"
                    }
                },
                "required": ["texts"]
            }
        ),
        Tool(
            name="nim_analyze",
            description="Analyze text for sentiment, key themes, entities, or other insights using NIM.",
            inputSchema={
                "type": "object",
                "properties": {
                    "text": {
                        "type": "string",
                        "description": "Text to analyze"
                    },
                    "analysis_type": {
                        "type": "string",
                        "description": "Type of analysis to perform",
                        "enum": ["sentiment", "themes", "entities", "summary", "questions"],
                        "default": "summary"
                    }
                },
                "required": ["text"]
            }
        ),
        Tool(
            name="nim_code",
            description="Generate or explain code using NVIDIA NIM models.",
            inputSchema={
                "type": "object",
                "properties": {
                    "task": {
                        "type": "string",
                        "description": "What code to generate or explain"
                    },
                    "language": {
                        "type": "string",
                        "description": "Programming language",
                        "default": "python"
                    },
                    "mode": {
                        "type": "string",
                        "description": "Generate new code or explain existing",
                        "enum": ["generate", "explain", "debug", "optimize"],
                        "default": "generate"
                    }
                },
                "required": ["task"]
            }
        ),
        Tool(
            name="nim_models",
            description="List available NIM models and their capabilities.",
            inputSchema={
                "type": "object",
                "properties": {},
                "required": []
            }
        )
    ]


@server.call_tool()
async def call_tool(name: str, arguments: dict[str, Any]) -> list[TextContent]:
    """Execute a NIM tool"""

    client = get_async_nim_client()

    if name == "nim_chat":
        return await handle_chat(client, arguments)
    elif name == "nim_embed":
        return await handle_embed(client, arguments)
    elif name == "nim_analyze":
        return await handle_analyze(client, arguments)
    elif name == "nim_code":
        return await handle_code(client, arguments)
    elif name == "nim_models":
        return await handle_list_models()
    else:
        return [TextContent(type="text", text=f"Unknown tool: {name}")]


async def handle_chat(client: AsyncOpenAI, args: dict) -> list[TextContent]:
    """Handle chat completion requests"""
    prompt = args["prompt"]
    system_prompt = args.get("system_prompt", "You are a helpful AI assistant.")
    model = args.get("model", DEFAULT_MODEL)
    temperature = args.get("temperature", 0.7)
    max_tokens = args.get("max_tokens", 1024)

    response = await client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        temperature=temperature,
        max_tokens=max_tokens
    )

    content = response.choices[0].message.content
    usage = response.usage

    result = f"{content}\n\n---\n_Model: {model} | Tokens: {usage.total_tokens}_"

    return [TextContent(type="text", text=result)]


async def handle_embed(client: AsyncOpenAI, args: dict) -> list[TextContent]:
    """Handle embedding requests"""
    texts = args["texts"]
    model = args.get("model", EMBEDDING_MODEL)

    response = await client.embeddings.create(
        model=model,
        input=texts,
        encoding_format="float"
    )

    embeddings = [
        {
            "text": texts[i],
            "embedding_dim": len(data.embedding),
            "embedding_preview": data.embedding[:5]  # First 5 dimensions
        }
        for i, data in enumerate(response.data)
    ]

    result = json.dumps({
        "model": model,
        "embeddings": embeddings,
        "total_tokens": response.usage.total_tokens
    }, indent=2)

    return [TextContent(type="text", text=result)]


async def handle_analyze(client: AsyncOpenAI, args: dict) -> list[TextContent]:
    """Handle text analysis requests"""
    text = args["text"]
    analysis_type = args.get("analysis_type", "summary")

    prompts = {
        "sentiment": f"Analyze the sentiment of this text. Provide: overall sentiment (positive/negative/neutral), confidence score, and key emotional indicators.\n\nText: {text}",
        "themes": f"Identify the main themes and topics in this text. List them with brief explanations.\n\nText: {text}",
        "entities": f"Extract all named entities (people, organizations, locations, dates, etc.) from this text. Format as a structured list.\n\nText: {text}",
        "summary": f"Provide a concise summary of this text in 2-3 sentences.\n\nText: {text}",
        "questions": f"Generate 5 insightful questions that could be answered using information from this text.\n\nText: {text}"
    }

    response = await client.chat.completions.create(
        model=DEFAULT_MODEL,
        messages=[
            {"role": "system", "content": "You are an expert text analyst. Provide structured, accurate analysis."},
            {"role": "user", "content": prompts[analysis_type]}
        ],
        temperature=0.3,
        max_tokens=1024
    )

    result = f"**{analysis_type.title()} Analysis**\n\n{response.choices[0].message.content}"

    return [TextContent(type="text", text=result)]


async def handle_code(client: AsyncOpenAI, args: dict) -> list[TextContent]:
    """Handle code generation/explanation requests"""
    task = args["task"]
    language = args.get("language", "python")
    mode = args.get("mode", "generate")

    system_prompts = {
        "generate": f"You are an expert {language} programmer. Write clean, well-documented, production-ready code.",
        "explain": f"You are an expert {language} programmer. Explain code clearly with examples.",
        "debug": f"You are an expert {language} debugger. Identify bugs and provide fixes with explanations.",
        "optimize": f"You are an expert {language} performance engineer. Optimize code for speed and efficiency."
    }

    user_prompts = {
        "generate": f"Write {language} code to: {task}",
        "explain": f"Explain this {language} code:\n\n{task}",
        "debug": f"Debug this {language} code and fix any issues:\n\n{task}",
        "optimize": f"Optimize this {language} code for better performance:\n\n{task}"
    }

    response = await client.chat.completions.create(
        model=DEFAULT_MODEL,
        messages=[
            {"role": "system", "content": system_prompts[mode]},
            {"role": "user", "content": user_prompts[mode]}
        ],
        temperature=0.2,
        max_tokens=2048
    )

    return [TextContent(type="text", text=response.choices[0].message.content)]


async def handle_list_models() -> list[TextContent]:
    """List available NIM models"""
    models = {
        "LLM Models": [
            {"name": "meta/llama-3.1-405b-instruct", "params": "405B", "use": "Complex reasoning, enterprise"},
            {"name": "meta/llama-3.1-70b-instruct", "params": "70B", "use": "General purpose, balanced"},
            {"name": "meta/llama-3.1-8b-instruct", "params": "8B", "use": "Fast inference, cost-effective"},
            {"name": "mistralai/mixtral-8x22b-instruct-v0.1", "params": "141B", "use": "Multi-expert reasoning"},
            {"name": "nvidia/nemotron-4-340b-instruct", "params": "340B", "use": "Enterprise, high accuracy"}
        ],
        "Embedding Models": [
            {"name": "nvidia/nv-embedqa-e5-v5", "dims": 1024, "use": "RAG, semantic search"},
            {"name": "nvidia/nv-embed-v2", "dims": 4096, "use": "High-quality embeddings"}
        ],
        "Vision Models": [
            {"name": "microsoft/phi-3-vision-128k-instruct", "use": "Image understanding"},
            {"name": "nvidia/vila-1.5-40b", "use": "Video/image analysis"}
        ]
    }

    result = "# Available NVIDIA NIM Models\n\n"
    for category, model_list in models.items():
        result += f"## {category}\n\n"
        for model in model_list:
            if "params" in model:
                result += f"- **{model['name']}** ({model['params']}) - {model['use']}\n"
            elif "dims" in model:
                result += f"- **{model['name']}** ({model['dims']}d) - {model['use']}\n"
            else:
                result += f"- **{model['name']}** - {model['use']}\n"
        result += "\n"

    return [TextContent(type="text", text=result)]


# ============================================================================
# RESOURCES (Optional - for exposing NIM documentation)
# ============================================================================

@server.list_resources()
async def list_resources() -> list[Resource]:
    """List available NIM resources"""
    return [
        Resource(
            uri="nim://docs/quickstart",
            name="NIM Quickstart Guide",
            description="Quick start guide for NVIDIA NIM",
            mimeType="text/markdown"
        ),
        Resource(
            uri="nim://docs/models",
            name="NIM Model Catalog",
            description="Available models and their specifications",
            mimeType="text/markdown"
        )
    ]


@server.read_resource()
async def read_resource(uri: str) -> str:
    """Read NIM documentation resources"""
    if uri == "nim://docs/quickstart":
        return """
# NVIDIA NIM Quickstart

## Cloud API (Fastest to start)

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key="nvapi-YOUR_KEY"  # Get from build.nvidia.com
)

response = client.chat.completions.create(
    model="meta/llama-3.1-70b-instruct",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)
```

## Self-Hosted (Docker)

```bash
docker run -d --gpus all \\
  -e NGC_API_KEY=$NGC_API_KEY \\
  -p 8000:8000 \\
  nvcr.io/nim/meta/llama-3.1-8b-instruct:latest
```

Then use the same OpenAI client with `base_url="http://localhost:8000/v1"`
"""

    elif uri == "nim://docs/models":
        return """
# NVIDIA NIM Model Catalog

## LLM Models
| Model | Size | Best For |
|-------|------|----------|
| meta/llama-3.1-405b-instruct | 405B | Complex reasoning |
| meta/llama-3.1-70b-instruct | 70B | General purpose |
| meta/llama-3.1-8b-instruct | 8B | Fast, cost-effective |

## Embedding Models
| Model | Dimensions |
|-------|------------|
| nvidia/nv-embedqa-e5-v5 | 1024 |
| nvidia/nv-embed-v2 | 4096 |
"""

    return f"Resource not found: {uri}"


# ============================================================================
# SERVER STARTUP
# ============================================================================

async def main():
    """Run the MCP server"""
    async with stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            server.create_initialization_options()
        )


if __name__ == "__main__":
    print("Starting NVIDIA NIM MCP Server...")
    print("Tools available: nim_chat, nim_embed, nim_analyze, nim_code, nim_models")
    asyncio.run(main())
