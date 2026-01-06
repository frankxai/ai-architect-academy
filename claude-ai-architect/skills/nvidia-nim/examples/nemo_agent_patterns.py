"""
NVIDIA NeMo Agent Toolkit Patterns
Examples for building agentic applications with NIM and NeMo Agent Toolkit
"""

import os
from typing import Any

# ============================================================================
# BASIC REACT AGENT
# ============================================================================

def basic_react_agent():
    """
    Basic ReAct (Reasoning + Acting) agent using NeMo Agent Toolkit.

    ReAct agents think step-by-step, deciding when to use tools
    and when to provide final answers.
    """
    from nemo_agent_toolkit import AgentConfig, ReactAgent
    from nemo_agent_toolkit.tools import PythonTool

    # Configure agent with NIM as the LLM backend
    config = AgentConfig(
        llm_config={
            "_type": "nim",
            "model": "meta/llama-3.1-70b-instruct",
            "base_url": "https://integrate.api.nvidia.com/v1",
            "api_key": os.environ["NVIDIA_API_KEY"],
            "temperature": 0.7,
            "max_tokens": 2048
        },
        tools=[
            PythonTool(
                name="calculator",
                description="Execute Python code for calculations"
            )
        ]
    )

    agent = ReactAgent(config)
    result = agent.run("Calculate the compound interest on $10,000 at 5% for 10 years")

    return result


# ============================================================================
# MULTI-TOOL AGENT
# ============================================================================

def multi_tool_agent():
    """
    Agent with multiple tools for different tasks.
    Demonstrates tool composition and selection.
    """
    from nemo_agent_toolkit import AgentConfig, ReactAgent
    from nemo_agent_toolkit.tools import (
        PythonTool,
        WebSearchTool,
        FileReadTool,
        FileWriteTool
    )

    config = AgentConfig(
        llm_config={
            "_type": "nim",
            "model": "meta/llama-3.1-70b-instruct",
            "base_url": "https://integrate.api.nvidia.com/v1",
            "api_key": os.environ["NVIDIA_API_KEY"]
        },
        tools=[
            PythonTool(
                name="python_executor",
                description="Execute Python code for data analysis and calculations"
            ),
            WebSearchTool(
                name="web_search",
                description="Search the web for current information"
            ),
            FileReadTool(
                name="file_reader",
                description="Read content from local files"
            ),
            FileWriteTool(
                name="file_writer",
                description="Write content to local files"
            )
        ],
        max_iterations=10,
        verbose=True
    )

    agent = ReactAgent(config)
    result = agent.run(
        "Research the latest NVIDIA NIM updates and create a summary report"
    )

    return result


# ============================================================================
# FUNCTION GROUPS
# ============================================================================

def function_group_example():
    """
    Using Function Groups to organize related tools.
    Function groups share configuration and can be enabled/disabled together.
    """
    from nemo_agent_toolkit import AgentConfig, ReactAgent
    from nemo_agent_toolkit.tools import FunctionGroup, function_tool

    # Define a function group for database operations
    class DatabaseTools(FunctionGroup):
        """Tools for database operations"""

        def __init__(self, connection_string: str):
            self.connection_string = connection_string

        @function_tool(description="Query the database")
        def query_db(self, sql: str) -> list[dict]:
            # Simulated database query
            return [{"id": 1, "name": "example"}]

        @function_tool(description="Insert data into the database")
        def insert_db(self, table: str, data: dict) -> bool:
            # Simulated insert
            return True

    # Define analytics function group
    class AnalyticsTools(FunctionGroup):
        """Tools for data analytics"""

        @function_tool(description="Calculate statistics")
        def calculate_stats(self, data: list[float]) -> dict:
            import statistics
            return {
                "mean": statistics.mean(data),
                "median": statistics.median(data),
                "stdev": statistics.stdev(data) if len(data) > 1 else 0
            }

        @function_tool(description="Generate a chart")
        def generate_chart(self, data: list, chart_type: str) -> str:
            return f"Chart generated: {chart_type} with {len(data)} points"

    config = AgentConfig(
        llm_config={
            "_type": "nim",
            "model": "meta/llama-3.1-70b-instruct",
            "base_url": "https://integrate.api.nvidia.com/v1",
            "api_key": os.environ["NVIDIA_API_KEY"]
        },
        tool_groups=[
            DatabaseTools(connection_string="postgresql://..."),
            AnalyticsTools()
        ]
    )

    agent = ReactAgent(config)
    return agent.run("Query user statistics and generate a summary chart")


# ============================================================================
# MCP CLIENT - CONSUMING MCP TOOLS
# ============================================================================

def mcp_client_example():
    """
    Using NeMo Agent Toolkit as an MCP client to consume tools
    from external MCP servers.
    """
    from nemo_agent_toolkit import AgentConfig, ReactAgent
    from nemo_agent_toolkit.mcp import MCPClient

    # Configure MCP clients for external tool servers
    mcp_clients = [
        MCPClient(
            name="github_tools",
            url="http://localhost:3000/mcp",
            description="GitHub repository operations"
        ),
        MCPClient(
            name="database_tools",
            url="http://localhost:3001/mcp",
            description="Database query and management"
        )
    ]

    config = AgentConfig(
        llm_config={
            "_type": "nim",
            "model": "meta/llama-3.1-70b-instruct",
            "base_url": "https://integrate.api.nvidia.com/v1",
            "api_key": os.environ["NVIDIA_API_KEY"]
        },
        mcp_clients=mcp_clients
    )

    agent = ReactAgent(config)
    result = agent.run("List the open issues in our repository")

    return result


# ============================================================================
# MCP SERVER - PUBLISHING TOOLS
# ============================================================================

def mcp_server_workflow():
    """
    Create an NeMo Agent workflow that can be published as an MCP server.
    Other agents can then consume these tools via MCP.

    Start with: nat mcp --config workflow_config.yaml
    """
    workflow_config = """
name: nim_assistant_workflow
description: AI assistant powered by NIM

llm:
  _type: nim
  model: meta/llama-3.1-70b-instruct
  base_url: https://integrate.api.nvidia.com/v1
  api_key: ${NVIDIA_API_KEY}

functions:
  - name: analyze_text
    description: Analyze text for sentiment and key themes
    parameters:
      text:
        type: string
        description: Text to analyze

  - name: summarize_document
    description: Create a concise summary of a document
    parameters:
      content:
        type: string
        description: Document content to summarize
      max_length:
        type: integer
        description: Maximum summary length in words
        default: 100

  - name: generate_code
    description: Generate code based on requirements
    parameters:
      language:
        type: string
        description: Programming language
      requirements:
        type: string
        description: What the code should do

mcp_server:
  enabled: true
  host: localhost
  port: 9901
"""
    return workflow_config


# ============================================================================
# MULTI-AGENT ORCHESTRATION
# ============================================================================

def multi_agent_example():
    """
    Orchestrate multiple specialized agents working together.
    Each agent has its own tools and expertise.
    """
    from nemo_agent_toolkit import AgentConfig, ReactAgent, Orchestrator
    from nemo_agent_toolkit.tools import PythonTool, WebSearchTool

    # Research agent - searches and gathers information
    research_config = AgentConfig(
        name="researcher",
        description="Expert at finding and analyzing information",
        llm_config={
            "_type": "nim",
            "model": "meta/llama-3.1-70b-instruct",
            "base_url": "https://integrate.api.nvidia.com/v1",
            "api_key": os.environ["NVIDIA_API_KEY"]
        },
        tools=[WebSearchTool()]
    )

    # Analyst agent - processes and analyzes data
    analyst_config = AgentConfig(
        name="analyst",
        description="Expert at data analysis and calculations",
        llm_config={
            "_type": "nim",
            "model": "meta/llama-3.1-70b-instruct",
            "base_url": "https://integrate.api.nvidia.com/v1",
            "api_key": os.environ["NVIDIA_API_KEY"]
        },
        tools=[PythonTool()]
    )

    # Writer agent - creates reports and content
    writer_config = AgentConfig(
        name="writer",
        description="Expert at writing clear, engaging content",
        llm_config={
            "_type": "nim",
            "model": "meta/llama-3.1-70b-instruct",
            "base_url": "https://integrate.api.nvidia.com/v1",
            "api_key": os.environ["NVIDIA_API_KEY"]
        },
        tools=[]  # Writer uses LLM directly
    )

    # Create orchestrator to coordinate agents
    orchestrator = Orchestrator(
        agents=[
            ReactAgent(research_config),
            ReactAgent(analyst_config),
            ReactAgent(writer_config)
        ],
        llm_config={
            "_type": "nim",
            "model": "meta/llama-3.1-70b-instruct",
            "base_url": "https://integrate.api.nvidia.com/v1",
            "api_key": os.environ["NVIDIA_API_KEY"]
        }
    )

    result = orchestrator.run(
        "Research NVIDIA's Q4 2024 earnings, analyze the key metrics, "
        "and write a summary report for investors"
    )

    return result


# ============================================================================
# PROFILING AND OBSERVABILITY
# ============================================================================

def profiling_example():
    """
    Enable profiling to track token usage, timing, and costs.
    Integrates with Phoenix, Weave, or Langfuse.
    """
    from nemo_agent_toolkit import AgentConfig, ReactAgent
    from nemo_agent_toolkit.profiling import Profiler, PhoenixExporter

    # Configure profiler with Phoenix exporter
    profiler = Profiler(
        exporters=[
            PhoenixExporter(endpoint="http://localhost:6006")
        ],
        track_tokens=True,
        track_timing=True,
        track_costs=True
    )

    config = AgentConfig(
        llm_config={
            "_type": "nim",
            "model": "meta/llama-3.1-70b-instruct",
            "base_url": "https://integrate.api.nvidia.com/v1",
            "api_key": os.environ["NVIDIA_API_KEY"]
        },
        profiler=profiler
    )

    agent = ReactAgent(config)
    result = agent.run("Explain quantum computing in simple terms")

    # Get profiling stats
    stats = profiler.get_stats()
    print(f"Total tokens: {stats['total_tokens']}")
    print(f"Total time: {stats['total_time_ms']}ms")
    print(f"Estimated cost: ${stats['estimated_cost']:.4f}")

    return result, stats


# ============================================================================
# EVALUATION AND VALIDATION
# ============================================================================

def evaluation_example():
    """
    Evaluate agent performance using built-in validation mechanisms.
    """
    from nemo_agent_toolkit import AgentConfig, ReactAgent
    from nemo_agent_toolkit.evaluation import Evaluator, AccuracyMetric

    config = AgentConfig(
        llm_config={
            "_type": "nim",
            "model": "meta/llama-3.1-70b-instruct",
            "base_url": "https://integrate.api.nvidia.com/v1",
            "api_key": os.environ["NVIDIA_API_KEY"]
        }
    )

    agent = ReactAgent(config)

    # Define test cases
    test_cases = [
        {
            "input": "What is 2 + 2?",
            "expected": "4"
        },
        {
            "input": "What is the capital of France?",
            "expected": "Paris"
        }
    ]

    evaluator = Evaluator(
        agent=agent,
        metrics=[AccuracyMetric()]
    )

    results = evaluator.run(test_cases)
    print(f"Accuracy: {results['accuracy']:.2%}")

    return results


# ============================================================================
# SELF-HOSTED NIM WITH NEMO AGENT TOOLKIT
# ============================================================================

def self_hosted_agent():
    """
    Configure NeMo Agent Toolkit with a self-hosted NIM container.
    Useful for on-premises deployments with data privacy requirements.
    """
    from nemo_agent_toolkit import AgentConfig, ReactAgent

    config = AgentConfig(
        llm_config={
            "_type": "nim",
            "model": "meta/llama-3.1-8b-instruct",
            # Point to local NIM container
            "base_url": "http://localhost:8000/v1",
            "api_key": "not-used",  # No auth for self-hosted
            "temperature": 0.7,
            "max_tokens": 1024
        },
        # Shorter max iterations for faster model
        max_iterations=5
    )

    agent = ReactAgent(config)
    return agent.run("Summarize the key points about machine learning")


# ============================================================================
# CONFIGURATION FILE EXAMPLE
# ============================================================================

def get_workflow_config_yaml() -> str:
    """
    Example YAML configuration file for NeMo Agent Toolkit workflow.
    Save as workflow.yaml and run with: nat run workflow.yaml
    """
    return """
# NeMo Agent Toolkit Workflow Configuration
name: nim_powered_assistant
description: Production-ready AI assistant using NVIDIA NIM

# LLM Configuration
llm:
  _type: nim
  model: meta/llama-3.1-70b-instruct
  base_url: https://integrate.api.nvidia.com/v1
  api_key: ${NVIDIA_API_KEY}
  temperature: 0.7
  max_tokens: 2048

# Agent Configuration
agent:
  type: react
  max_iterations: 10
  verbose: true

# Tool Definitions
tools:
  - name: web_search
    type: builtin
    config:
      max_results: 5

  - name: python_executor
    type: builtin
    config:
      timeout: 30

  - name: file_operations
    type: builtin
    config:
      allowed_paths:
        - /data
        - /output

# MCP Integration
mcp:
  # Act as MCP client
  clients:
    - name: github
      url: http://localhost:3000/mcp

  # Publish as MCP server
  server:
    enabled: true
    port: 9901

# Profiling
profiling:
  enabled: true
  exporters:
    - type: phoenix
      endpoint: http://localhost:6006
    - type: console
      level: info

# Guardrails
guardrails:
  enabled: true
  config_path: ./guardrails.yaml
"""


if __name__ == "__main__":
    print("NeMo Agent Toolkit with NVIDIA NIM Examples")
    print("=" * 50)

    # Check for API key
    if not os.environ.get("NVIDIA_API_KEY"):
        print("Set NVIDIA_API_KEY environment variable to run examples")
        print("\nShowing configuration examples instead:\n")
        print(get_workflow_config_yaml())
