"""
NVIDIA NIM SDK Examples
Complete examples for integrating with NVIDIA NIM inference microservices
"""

import os
from typing import Generator

# ============================================================================
# BASIC USAGE - OpenAI-Compatible API
# ============================================================================

def basic_chat_completion():
    """Basic chat completion using OpenAI client with NVIDIA NIM"""
    from openai import OpenAI

    # Cloud API
    client = OpenAI(
        base_url="https://integrate.api.nvidia.com/v1",
        api_key=os.environ.get("NVIDIA_API_KEY")
    )

    response = client.chat.completions.create(
        model="meta/llama-3.1-70b-instruct",
        messages=[
            {"role": "system", "content": "You are a helpful AI assistant."},
            {"role": "user", "content": "Explain the benefits of NVIDIA NIM."}
        ],
        temperature=0.7,
        max_tokens=1024
    )

    return response.choices[0].message.content


def streaming_chat_completion() -> Generator[str, None, None]:
    """Streaming chat completion for real-time responses"""
    from openai import OpenAI

    client = OpenAI(
        base_url="https://integrate.api.nvidia.com/v1",
        api_key=os.environ.get("NVIDIA_API_KEY")
    )

    stream = client.chat.completions.create(
        model="meta/llama-3.1-70b-instruct",
        messages=[{"role": "user", "content": "Write a haiku about AI"}],
        stream=True
    )

    for chunk in stream:
        if chunk.choices[0].delta.content:
            yield chunk.choices[0].delta.content


def self_hosted_nim():
    """Connect to a self-hosted NIM container"""
    from openai import OpenAI

    # Local NIM container (no API key needed)
    client = OpenAI(
        base_url="http://localhost:8000/v1",
        api_key="not-used"  # Required by client but not validated
    )

    response = client.chat.completions.create(
        model="meta/llama-3.1-8b-instruct",
        messages=[{"role": "user", "content": "Hello!"}]
    )

    return response.choices[0].message.content


# ============================================================================
# EMBEDDINGS
# ============================================================================

def generate_embeddings(texts: list[str]) -> list[list[float]]:
    """Generate embeddings using NVIDIA embedding models"""
    from openai import OpenAI

    client = OpenAI(
        base_url="https://integrate.api.nvidia.com/v1",
        api_key=os.environ.get("NVIDIA_API_KEY")
    )

    response = client.embeddings.create(
        model="nvidia/nv-embedqa-e5-v5",
        input=texts,
        encoding_format="float"
    )

    return [data.embedding for data in response.data]


def semantic_search_example():
    """Example of semantic search using NIM embeddings"""
    import numpy as np

    documents = [
        "NVIDIA NIM provides optimized inference microservices",
        "Machine learning models require significant compute resources",
        "TensorRT-LLM accelerates large language model inference",
        "Cloud computing enables scalable AI deployments"
    ]

    query = "How to speed up AI model inference?"

    # Generate embeddings
    doc_embeddings = generate_embeddings(documents)
    query_embedding = generate_embeddings([query])[0]

    # Calculate cosine similarity
    def cosine_similarity(a, b):
        return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

    similarities = [cosine_similarity(query_embedding, doc) for doc in doc_embeddings]

    # Return ranked results
    ranked_results = sorted(
        zip(documents, similarities),
        key=lambda x: x[1],
        reverse=True
    )

    return ranked_results


# ============================================================================
# FUNCTION CALLING / TOOL USE
# ============================================================================

def function_calling_example():
    """Example of tool/function calling with NIM"""
    from openai import OpenAI
    import json

    client = OpenAI(
        base_url="https://integrate.api.nvidia.com/v1",
        api_key=os.environ.get("NVIDIA_API_KEY")
    )

    # Define available tools
    tools = [
        {
            "type": "function",
            "function": {
                "name": "get_gpu_specs",
                "description": "Get specifications for an NVIDIA GPU",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "gpu_model": {
                            "type": "string",
                            "description": "The GPU model name (e.g., 'A100', 'H100')"
                        }
                    },
                    "required": ["gpu_model"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "calculate_inference_cost",
                "description": "Calculate the cost of running inference",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "model_name": {"type": "string"},
                        "tokens_per_day": {"type": "integer"},
                        "days": {"type": "integer"}
                    },
                    "required": ["model_name", "tokens_per_day"]
                }
            }
        }
    ]

    response = client.chat.completions.create(
        model="meta/llama-3.1-70b-instruct",
        messages=[
            {"role": "user", "content": "What are the specs of the H100 GPU?"}
        ],
        tools=tools,
        tool_choice="auto"
    )

    # Check if model wants to call a function
    if response.choices[0].message.tool_calls:
        tool_call = response.choices[0].message.tool_calls[0]
        function_name = tool_call.function.name
        function_args = json.loads(tool_call.function.arguments)

        return {
            "function": function_name,
            "arguments": function_args
        }

    return response.choices[0].message.content


# ============================================================================
# LANGCHAIN INTEGRATION
# ============================================================================

def langchain_chat_example():
    """Using LangChain with NVIDIA NIM"""
    from langchain_nvidia_ai_endpoints import ChatNVIDIA
    from langchain_core.messages import HumanMessage, SystemMessage

    llm = ChatNVIDIA(
        model="meta/llama-3.1-70b-instruct",
        temperature=0.7,
        max_tokens=1024
    )

    messages = [
        SystemMessage(content="You are an AI architecture expert."),
        HumanMessage(content="Design a RAG system using NIM.")
    ]

    response = llm.invoke(messages)
    return response.content


def langchain_rag_example():
    """RAG pipeline using LangChain and NIM"""
    from langchain_nvidia_ai_endpoints import ChatNVIDIA, NVIDIAEmbeddings
    from langchain_community.vectorstores import FAISS
    from langchain.chains import RetrievalQA
    from langchain.text_splitter import RecursiveCharacterTextSplitter

    # Initialize models
    llm = ChatNVIDIA(model="meta/llama-3.1-70b-instruct")
    embeddings = NVIDIAEmbeddings(model="nvidia/nv-embedqa-e5-v5")

    # Sample documents
    documents = [
        "NVIDIA NIM provides optimized inference for LLMs.",
        "TensorRT-LLM is the engine powering NIM performance.",
        "NIM supports both cloud and self-hosted deployments."
    ]

    # Create vector store
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )
    texts = text_splitter.create_documents(documents)
    vectorstore = FAISS.from_documents(texts, embeddings)

    # Create RAG chain
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vectorstore.as_retriever(search_kwargs={"k": 3})
    )

    return qa_chain.invoke("What powers NIM performance?")


def langchain_agent_example():
    """Agent with tools using LangChain and NIM"""
    from langchain_nvidia_ai_endpoints import ChatNVIDIA
    from langchain.agents import create_tool_calling_agent, AgentExecutor
    from langchain_core.prompts import ChatPromptTemplate
    from langchain_core.tools import tool

    llm = ChatNVIDIA(model="meta/llama-3.1-70b-instruct")

    @tool
    def get_model_info(model_name: str) -> str:
        """Get information about a NIM model"""
        models = {
            "llama-3.1-70b": "70B parameter model, excellent for complex reasoning",
            "llama-3.1-8b": "8B parameter model, fast and cost-effective",
            "mixtral-8x22b": "Mixture of experts, 141B parameters"
        }
        return models.get(model_name, "Model not found")

    tools = [get_model_info]

    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an AI model expert. Use tools to help answer questions."),
        ("human", "{input}"),
        ("placeholder", "{agent_scratchpad}")
    ])

    agent = create_tool_calling_agent(llm, tools, prompt)
    executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

    return executor.invoke({"input": "Tell me about llama-3.1-70b"})


# ============================================================================
# LLAMAINDEX INTEGRATION
# ============================================================================

def llamaindex_example():
    """Using LlamaIndex with NVIDIA NIM"""
    from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
    from llama_index.llms.nvidia import NVIDIA
    from llama_index.embeddings.nvidia import NVIDIAEmbedding
    from llama_index.core import Settings

    # Configure models
    Settings.llm = NVIDIA(
        model="meta/llama-3.1-70b-instruct",
        api_key=os.environ.get("NVIDIA_API_KEY")
    )
    Settings.embed_model = NVIDIAEmbedding(
        model="nvidia/nv-embedqa-e5-v5",
        truncate="END"
    )

    # Load documents and create index
    documents = SimpleDirectoryReader("./data").load_data()
    index = VectorStoreIndex.from_documents(documents)

    # Query the index
    query_engine = index.as_query_engine()
    response = query_engine.query("What are the key features of NIM?")

    return str(response)


# ============================================================================
# VISION MODELS (VLM)
# ============================================================================

def vision_model_example(image_path: str):
    """Using vision-language models with NIM"""
    import base64
    from openai import OpenAI

    client = OpenAI(
        base_url="https://integrate.api.nvidia.com/v1",
        api_key=os.environ.get("NVIDIA_API_KEY")
    )

    # Encode image to base64
    with open(image_path, "rb") as image_file:
        base64_image = base64.standard_b64encode(image_file.read()).decode("utf-8")

    response = client.chat.completions.create(
        model="microsoft/phi-3-vision-128k-instruct",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Describe this image in detail."},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            }
        ],
        max_tokens=1024
    )

    return response.choices[0].message.content


# ============================================================================
# RERANKING
# ============================================================================

def reranking_example(query: str, documents: list[str]) -> list[tuple[str, float]]:
    """Rerank documents using NIM reranking models"""
    import requests

    headers = {
        "Authorization": f"Bearer {os.environ.get('NVIDIA_API_KEY')}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "nvidia/nv-rerankqa-mistral-4b-v3",
        "query": {"text": query},
        "passages": [{"text": doc} for doc in documents]
    }

    response = requests.post(
        "https://integrate.api.nvidia.com/v1/ranking",
        headers=headers,
        json=payload
    )

    results = response.json()
    ranked = [(documents[r["index"]], r["logit"]) for r in results["rankings"]]

    return sorted(ranked, key=lambda x: x[1], reverse=True)


# ============================================================================
# ASYNC USAGE
# ============================================================================

async def async_chat_completion():
    """Async chat completion for high-throughput applications"""
    from openai import AsyncOpenAI
    import asyncio

    client = AsyncOpenAI(
        base_url="https://integrate.api.nvidia.com/v1",
        api_key=os.environ.get("NVIDIA_API_KEY")
    )

    async def generate_response(prompt: str) -> str:
        response = await client.chat.completions.create(
            model="meta/llama-3.1-70b-instruct",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=512
        )
        return response.choices[0].message.content

    # Run multiple requests concurrently
    prompts = [
        "Explain quantum computing",
        "What is machine learning?",
        "Describe neural networks"
    ]

    results = await asyncio.gather(*[generate_response(p) for p in prompts])
    return results


# ============================================================================
# BATCH PROCESSING
# ============================================================================

def batch_processing_example(prompts: list[str], batch_size: int = 5):
    """Process multiple prompts in batches"""
    from openai import OpenAI
    from concurrent.futures import ThreadPoolExecutor

    client = OpenAI(
        base_url="https://integrate.api.nvidia.com/v1",
        api_key=os.environ.get("NVIDIA_API_KEY")
    )

    def process_prompt(prompt: str) -> str:
        response = client.chat.completions.create(
            model="meta/llama-3.1-8b-instruct",  # Faster model for batch
            messages=[{"role": "user", "content": prompt}],
            max_tokens=256
        )
        return response.choices[0].message.content

    results = []
    with ThreadPoolExecutor(max_workers=batch_size) as executor:
        results = list(executor.map(process_prompt, prompts))

    return results


# ============================================================================
# ERROR HANDLING & RETRIES
# ============================================================================

def robust_completion_with_retry(prompt: str, max_retries: int = 3):
    """Robust completion with exponential backoff retry"""
    from openai import OpenAI, RateLimitError, APIError
    import time

    client = OpenAI(
        base_url="https://integrate.api.nvidia.com/v1",
        api_key=os.environ.get("NVIDIA_API_KEY")
    )

    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model="meta/llama-3.1-70b-instruct",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=1024
            )
            return response.choices[0].message.content

        except RateLimitError:
            wait_time = (2 ** attempt) + 1
            print(f"Rate limited. Waiting {wait_time}s...")
            time.sleep(wait_time)

        except APIError as e:
            if attempt == max_retries - 1:
                raise
            print(f"API error: {e}. Retrying...")
            time.sleep(1)

    raise Exception("Max retries exceeded")


if __name__ == "__main__":
    # Test basic functionality
    print("Testing NVIDIA NIM integration...")

    # Ensure API key is set
    if not os.environ.get("NVIDIA_API_KEY"):
        print("Please set NVIDIA_API_KEY environment variable")
        exit(1)

    # Run basic test
    result = basic_chat_completion()
    print(f"Basic completion: {result[:200]}...")
