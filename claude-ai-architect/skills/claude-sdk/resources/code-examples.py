"""
Claude Agent SDK Code Examples
Reference from SKILL.md for implementation patterns
"""

from anthropic import Anthropic
import os
import time
import logging
from datetime import datetime

# ============================================================
# PATTERN 1: Autonomous Task Completion
# ============================================================

def autonomous_task_example():
    """Agent completes multi-step task without human intervention"""
    client = Anthropic()

    response = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=4096,
        tools=[
            {"type": "computer_use"},
            {"type": "bash"},
            {"type": "file_operations"}
        ],
        messages=[{
            "role": "user",
            "content": "Analyze the last 30 days of sales data and create a summary report"
        }]
    )
    # Claude autonomously:
    # 1. Reads sales data files
    # 2. Runs analysis scripts
    # 3. Generates report
    # 4. Saves to file
    return response


# ============================================================
# PATTERN 2: Human-in-the-Loop Approval
# ============================================================

def human_in_loop_example():
    """Agent proposes actions, waits for approval"""
    client = Anthropic()

    # Step 1: Generate plan
    plan_response = client.messages.create(
        model="claude-sonnet-4-5",
        messages=[{
            "role": "user",
            "content": "Create a plan to refactor the authentication system"
        }]
    )

    # Step 2: Human reviews plan
    if human_approves(plan_response.content):
        # Step 3: Execute with tools
        execution_response = client.messages.create(
            model="claude-sonnet-4-5",
            tools=all_tools,
            messages=[{
                "role": "user",
                "content": f"Execute this plan: {plan_response.content}"
            }]
        )
        return execution_response
    return None


# ============================================================
# TOOL DESIGN EXAMPLES
# ============================================================

# Good Tool Design - Clear, focused
GOOD_TOOL_SCHEMA = {
    "name": "get_customer_orders",
    "description": "Retrieve all orders for a specific customer ID",
    "input_schema": {
        "type": "object",
        "properties": {
            "customer_id": {
                "type": "string",
                "description": "The unique customer identifier"
            },
            "since_date": {
                "type": "string",
                "description": "ISO date to filter orders from (optional)"
            }
        },
        "required": ["customer_id"]
    }
}

# Poor Tool Design - Too broad
POOR_TOOL_SCHEMA = {
    "name": "do_customer_stuff",
    "description": "Does various things with customers",
    "input_schema": {
        "type": "object",
        "properties": {
            "action": {"type": "string"},
            "data": {"type": "object"}
        }
    }
}


# ============================================================
# MCP INTEGRATION
# ============================================================

def mcp_integration_example():
    """Connect MCP servers for external data"""
    client = Anthropic()

    mcp_config = {
        "servers": {
            "github": {
                "command": "npx",
                "args": ["-y", "@modelcontextprotocol/server-github"],
                "env": {
                    "GITHUB_TOKEN": os.getenv("GITHUB_TOKEN")
                }
            },
            "postgres": {
                "command": "docker",
                "args": ["run", "mcp-postgres-server"],
                "env": {
                    "DATABASE_URL": os.getenv("DATABASE_URL")
                }
            }
        }
    }

    response = client.messages.create(
        model="claude-sonnet-4-5",
        mcp_servers=mcp_config,
        messages=[{
            "role": "user",
            "content": "Find all GitHub issues assigned to me and update the project database"
        }]
    )
    return response


# ============================================================
# STREAMING FOR UX
# ============================================================

def streaming_example():
    """Show real-time progress to users"""
    client = Anthropic()

    with client.messages.stream(
        model="claude-sonnet-4-5",
        max_tokens=4096,
        tools=tools,
        messages=messages
    ) as stream:
        for event in stream:
            if event.type == "content_block_delta":
                print(event.delta.text, end="", flush=True)
            elif event.type == "tool_use":
                print(f"\nUsing tool: {event.name}")


# ============================================================
# ERROR HANDLING
# ============================================================

def robust_error_handling():
    """Production-grade error management"""
    client = Anthropic()

    try:
        response = client.messages.create(
            model="claude-sonnet-4-5",
            tools=tools,
            messages=messages
        )
        return response
    except anthropic.APIError as e:
        log_error(f"API Error: {e}")
        return fallback_response()
    except anthropic.RateLimitError:
        time.sleep(60)
        return retry()
    except Exception as e:
        log_error(f"Tool Error: {e}")
        return safe_error_message()


# ============================================================
# SECURITY PATTERNS
# ============================================================

# Tool Permission Restrictions
SAFE_FILE_TOOLS = {
    "read": {
        "allowed_paths": ["/data/public"],
        "denied_paths": ["/etc", "/secrets"]
    },
    "write": {
        "allowed_paths": ["/output"],
        "denied_paths": ["/"]
    }
}

def sanitize_bash_command(cmd: str) -> str:
    """Prevent dangerous commands"""
    dangerous = ["rm -rf", ":(){ :|:& };:", "dd if="]
    for danger in dangerous:
        if danger in cmd:
            raise SecurityError(f"Dangerous command blocked: {danger}")
    return cmd


def log_agent_action(action: dict):
    """Track all agent actions for security audit"""
    audit_log.write({
        "timestamp": datetime.now(),
        "tool": action["tool_name"],
        "input": action["input"],
        "user": action["user_id"],
        "result": action["result"]
    })


# ============================================================
# CACHING
# ============================================================

def caching_example():
    """Cache system prompts for cost savings"""
    client = Anthropic()

    response = client.messages.create(
        model="claude-sonnet-4-5",
        system=[{
            "type": "text",
            "text": large_system_prompt,
            "cache_control": {"type": "ephemeral"}
        }],
        messages=messages
    )
    return response


# ============================================================
# TESTING
# ============================================================

def test_customer_lookup_tool():
    """Unit test for individual tool"""
    result = get_customer_orders("CUST123")
    assert result["customer_id"] == "CUST123"
    assert isinstance(result["orders"], list)


def test_agent_workflow():
    """Integration test for agent workflow"""
    client = Anthropic()

    response = client.messages.create(
        model="claude-sonnet-4-5",
        tools=[tool1, tool2, tool3],
        messages=[{
            "role": "user",
            "content": "Process order #12345"
        }]
    )

    tool_calls = extract_tool_calls(response)
    assert "verify_order" in tool_calls
    assert "process_payment" in tool_calls


# ============================================================
# COMMON AGENT PATTERNS
# ============================================================

async def research_agent(query: str):
    """Agent researches topic using multiple sources"""
    client = Anthropic()

    response = await client.messages.create(
        model="claude-sonnet-4-5",
        tools=[web_search, web_fetch, summarize],
        messages=[{
            "role": "user",
            "content": f"Research '{query}' and provide comprehensive summary"
        }]
    )
    return response.content


def code_agent(requirements: str):
    """Agent writes and tests code"""
    client = Anthropic()

    response = client.messages.create(
        model="claude-sonnet-4-5",
        tools=[write_file, bash, read_file],
        messages=[{
            "role": "user",
            "content": f"Write and test code for: {requirements}"
        }]
    )
    return response.content


def data_pipeline_agent(source: str, destination: str):
    """Agent ETL pipeline"""
    client = Anthropic()

    response = client.messages.create(
        model="claude-sonnet-4-5",
        tools=[read_file, bash, postgres_insert],
        messages=[{
            "role": "user",
            "content": f"Extract data from {source}, transform it, load to {destination}"
        }]
    )
    return response.content


# ============================================================
# FRAMEWORK INTEGRATIONS
# ============================================================

# FastAPI Integration
"""
from fastapi import FastAPI
from anthropic import Anthropic

app = FastAPI()
client = Anthropic()

@app.post("/agent/task")
async def run_agent_task(task: dict):
    response = client.messages.create(
        model="claude-sonnet-4-5",
        tools=load_tools_for_task(task),
        messages=[{"role": "user", "content": task["description"]}]
    )
    return {"result": response.content}
"""

# LangChain Integration
"""
from langchain_anthropic import ChatAnthropic
from langchain.agents import initialize_agent

llm = ChatAnthropic(model="claude-sonnet-4-5")
agent = initialize_agent(
    tools=[tool1, tool2],
    llm=llm,
    agent_type="structured-chat-zero-shot-react-description"
)
result = agent.run("Complete this task")
"""


# ============================================================
# MONITORING
# ============================================================

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("claude-agent")

def run_agent_with_logging(task):
    """Production logging for agents"""
    client = Anthropic()

    logger.info(f"Starting task: {task}")

    response = client.messages.create(
        model="claude-sonnet-4-5",
        tools=tools,
        messages=[{"role": "user", "content": task}]
    )

    logger.info(f"Tools used: {extract_tools(response)}")
    logger.info(f"Token usage: {response.usage}")

    return response
