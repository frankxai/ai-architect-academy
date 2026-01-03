# Claude SDK Agent Workflow

> Build autonomous agents using Claude Agent SDK with computer use, tool orchestration, and MCP integration.

## Overview

The Claude Agent SDK enables building agents that can **control a computer environment** - reading files, running commands, and iterating on work autonomously.

**Time:** 45-60 minutes
**Prerequisites:** Python 3.10+, Anthropic API key
**Output:** Production-ready autonomous agent

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     USER REQUEST                             │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    CLAUDE AGENT                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Task Analysis → Planning → Execution → Iteration    │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────┬───────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│ File Tools  │      │ Bash Tools  │      │ MCP Tools   │
│ Read/Write  │      │  Commands   │      │ Custom APIs │
│    Edit     │      │   Scripts   │      │  Databases  │
└─────────────┘      └─────────────┘      └─────────────┘
```

---

## Step 1: Environment Setup

### Install Dependencies

```bash
# Create project
mkdir claude-agent-demo && cd claude-agent-demo
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install SDK
pip install anthropic python-dotenv
```

### Configure API Key

```bash
# .env
ANTHROPIC_API_KEY=sk-ant-...
```

---

## Step 2: Basic Agent Implementation

### Simple Task Agent

```python
# agent.py
import os
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

client = Anthropic()

def run_agent(task: str) -> str:
    """Run Claude agent on a task"""
    response = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=4096,
        messages=[{
            "role": "user",
            "content": task
        }]
    )
    return response.content[0].text

# Test
if __name__ == "__main__":
    result = run_agent("Explain how to structure a Python project")
    print(result)
```

---

## Step 3: Add Tool Capabilities

### Define Tools

```python
# tools.py
import os
import subprocess

# Tool definitions for Claude
TOOLS = [
    {
        "name": "read_file",
        "description": "Read contents of a file at the given path",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {
                    "type": "string",
                    "description": "The file path to read"
                }
            },
            "required": ["path"]
        }
    },
    {
        "name": "write_file",
        "description": "Write content to a file at the given path",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {
                    "type": "string",
                    "description": "The file path to write to"
                },
                "content": {
                    "type": "string",
                    "description": "The content to write"
                }
            },
            "required": ["path", "content"]
        }
    },
    {
        "name": "run_command",
        "description": "Execute a shell command and return output",
        "input_schema": {
            "type": "object",
            "properties": {
                "command": {
                    "type": "string",
                    "description": "The command to execute"
                }
            },
            "required": ["command"]
        }
    },
    {
        "name": "list_directory",
        "description": "List files and directories at the given path",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {
                    "type": "string",
                    "description": "The directory path to list"
                }
            },
            "required": ["path"]
        }
    }
]

# Tool implementations
def read_file(path: str) -> str:
    """Read file contents"""
    try:
        with open(path, 'r') as f:
            return f.read()
    except Exception as e:
        return f"Error reading file: {e}"

def write_file(path: str, content: str) -> str:
    """Write content to file"""
    try:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w') as f:
            f.write(content)
        return f"Successfully wrote to {path}"
    except Exception as e:
        return f"Error writing file: {e}"

def run_command(command: str) -> str:
    """Execute shell command"""
    try:
        result = subprocess.run(
            command,
            shell=True,
            capture_output=True,
            text=True,
            timeout=30
        )
        output = result.stdout + result.stderr
        return output if output else "Command completed (no output)"
    except subprocess.TimeoutExpired:
        return "Command timed out after 30 seconds"
    except Exception as e:
        return f"Error running command: {e}"

def list_directory(path: str) -> str:
    """List directory contents"""
    try:
        items = os.listdir(path)
        return "\n".join(items) if items else "Directory is empty"
    except Exception as e:
        return f"Error listing directory: {e}"

# Tool dispatcher
def execute_tool(name: str, inputs: dict) -> str:
    """Execute a tool by name"""
    tools = {
        "read_file": lambda: read_file(inputs["path"]),
        "write_file": lambda: write_file(inputs["path"], inputs["content"]),
        "run_command": lambda: run_command(inputs["command"]),
        "list_directory": lambda: list_directory(inputs["path"])
    }

    if name in tools:
        return tools[name]()
    return f"Unknown tool: {name}"
```

---

## Step 4: Autonomous Agent Loop

### Agent with Tool Use

```python
# autonomous_agent.py
import os
import json
from anthropic import Anthropic
from dotenv import load_dotenv
from tools import TOOLS, execute_tool

load_dotenv()

client = Anthropic()

SYSTEM_PROMPT = """You are an autonomous agent that can complete tasks by using tools.

Available tools:
- read_file: Read file contents
- write_file: Create or update files
- run_command: Execute shell commands
- list_directory: List directory contents

Guidelines:
1. Break complex tasks into steps
2. Use tools to explore and understand before modifying
3. Verify your work after making changes
4. Handle errors gracefully and retry if needed
5. Be thorough but efficient"""

def run_autonomous_agent(task: str, max_iterations: int = 10) -> str:
    """Run agent that autonomously completes tasks using tools"""

    messages = [{
        "role": "user",
        "content": task
    }]

    print(f"\n{'='*60}")
    print(f"TASK: {task}")
    print(f"{'='*60}\n")

    for iteration in range(max_iterations):
        print(f"--- Iteration {iteration + 1} ---")

        # Get Claude's response
        response = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=4096,
            system=SYSTEM_PROMPT,
            tools=TOOLS,
            messages=messages
        )

        # Check if we're done
        if response.stop_reason == "end_turn":
            # Extract final text response
            for block in response.content:
                if hasattr(block, 'text'):
                    print(f"\nFINAL RESPONSE:\n{block.text}")
                    return block.text

        # Process tool calls
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                tool_name = block.name
                tool_input = block.input

                print(f"\nTool: {tool_name}")
                print(f"Input: {json.dumps(tool_input, indent=2)}")

                # Execute tool
                result = execute_tool(tool_name, tool_input)
                print(f"Result: {result[:200]}..." if len(result) > 200 else f"Result: {result}")

                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result
                })

        # Add assistant response and tool results to messages
        messages.append({"role": "assistant", "content": response.content})
        messages.append({"role": "user", "content": tool_results})

    return "Max iterations reached without completion"

# Example usage
if __name__ == "__main__":
    # Example 1: Explore and understand
    run_autonomous_agent(
        "List the current directory and read the README if it exists"
    )

    # Example 2: Create something
    run_autonomous_agent(
        "Create a simple Python hello world script at ./demo/hello.py and run it"
    )
```

---

## Step 5: Add Streaming for Better UX

### Streaming Agent

```python
# streaming_agent.py
from anthropic import Anthropic
from tools import TOOLS, execute_tool

client = Anthropic()

def run_streaming_agent(task: str):
    """Agent with real-time streaming output"""

    messages = [{"role": "user", "content": task}]

    while True:
        print("\n", end="")

        with client.messages.stream(
            model="claude-sonnet-4-5",
            max_tokens=4096,
            system="You are an autonomous agent with tool access.",
            tools=TOOLS,
            messages=messages
        ) as stream:

            response_content = []
            current_tool_use = None

            for event in stream:
                # Handle text streaming
                if event.type == "content_block_delta":
                    if hasattr(event.delta, 'text'):
                        print(event.delta.text, end="", flush=True)

                # Track tool use
                if event.type == "content_block_start":
                    if event.content_block.type == "tool_use":
                        current_tool_use = {
                            "id": event.content_block.id,
                            "name": event.content_block.name,
                            "input": {}
                        }
                        print(f"\n[Using tool: {event.content_block.name}]")

                # Capture tool input
                if event.type == "content_block_delta":
                    if hasattr(event.delta, 'partial_json'):
                        # Tool input is being streamed
                        pass

            # Get final message
            final_message = stream.get_final_message()

            # Check if done
            if final_message.stop_reason == "end_turn":
                return

            # Process tool calls
            tool_results = []
            for block in final_message.content:
                if block.type == "tool_use":
                    result = execute_tool(block.name, block.input)
                    print(f"\n[Tool result: {result[:100]}...]")
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": result
                    })

            # Continue conversation
            messages.append({"role": "assistant", "content": final_message.content})
            messages.append({"role": "user", "content": tool_results})
```

---

## Step 6: Add MCP Integration

### MCP Server Connection

```python
# mcp_agent.py
import os
from anthropic import Anthropic

client = Anthropic()

# MCP server configuration
MCP_CONFIG = {
    "servers": {
        "github": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-github"],
            "env": {
                "GITHUB_TOKEN": os.getenv("GITHUB_TOKEN")
            }
        },
        "filesystem": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-filesystem", "/workspace"]
        }
    }
}

def run_mcp_agent(task: str):
    """Agent with MCP server integrations"""

    response = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=4096,
        # MCP servers provide additional tools automatically
        mcp_servers=MCP_CONFIG,
        messages=[{
            "role": "user",
            "content": task
        }]
    )

    return response.content[0].text

# Example: Use GitHub MCP
if __name__ == "__main__":
    result = run_mcp_agent(
        "List my open GitHub issues and summarize the most urgent ones"
    )
    print(result)
```

---

## Step 7: Production FastAPI Server

### API Server

```python
# server.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from anthropic import Anthropic
from tools import TOOLS, execute_tool
import os

app = FastAPI(title="Claude Agent API")
client = Anthropic()

class TaskRequest(BaseModel):
    task: str
    max_iterations: int = 10

class TaskResponse(BaseModel):
    result: str
    iterations: int
    tool_calls: list[str]

@app.post("/agent/run", response_model=TaskResponse)
async def run_agent(request: TaskRequest):
    """Execute an autonomous agent task"""

    messages = [{"role": "user", "content": request.task}]
    tool_calls = []

    for iteration in range(request.max_iterations):
        response = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=4096,
            system="You are an autonomous agent with tool access.",
            tools=TOOLS,
            messages=messages
        )

        # Check completion
        if response.stop_reason == "end_turn":
            result = next(
                (b.text for b in response.content if hasattr(b, 'text')),
                "Task completed"
            )
            return TaskResponse(
                result=result,
                iterations=iteration + 1,
                tool_calls=tool_calls
            )

        # Process tools
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                tool_calls.append(f"{block.name}({block.input})")
                result = execute_tool(block.name, block.input)
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result
                })

        messages.append({"role": "assistant", "content": response.content})
        messages.append({"role": "user", "content": tool_results})

    raise HTTPException(status_code=500, detail="Max iterations exceeded")

@app.get("/health")
def health():
    return {"status": "healthy"}

# Run: uvicorn server:app --reload
```

---

## Step 8: Testing

### Test Suite

```python
# test_agent.py
import pytest
from tools import read_file, write_file, run_command, list_directory

def test_read_file(tmp_path):
    """Test file reading"""
    test_file = tmp_path / "test.txt"
    test_file.write_text("Hello, World!")

    result = read_file(str(test_file))
    assert result == "Hello, World!"

def test_write_file(tmp_path):
    """Test file writing"""
    test_file = tmp_path / "output.txt"

    result = write_file(str(test_file), "Test content")
    assert "Successfully wrote" in result
    assert test_file.read_text() == "Test content"

def test_run_command():
    """Test command execution"""
    result = run_command("echo 'Hello'")
    assert "Hello" in result

def test_list_directory(tmp_path):
    """Test directory listing"""
    (tmp_path / "file1.txt").touch()
    (tmp_path / "file2.txt").touch()

    result = list_directory(str(tmp_path))
    assert "file1.txt" in result
    assert "file2.txt" in result

# Run: pytest test_agent.py -v
```

---

## Complete Project Structure

```
claude-agent-demo/
├── .env                    # API key
├── requirements.txt        # Dependencies
├── tools.py               # Tool definitions
├── agent.py               # Basic agent
├── autonomous_agent.py    # Full autonomous agent
├── streaming_agent.py     # Streaming version
├── mcp_agent.py           # MCP integration
├── server.py              # FastAPI server
├── test_agent.py          # Tests
└── README.md              # Documentation
```

### requirements.txt

```
anthropic>=0.25.0
python-dotenv>=1.0.0
fastapi>=0.109.0
uvicorn>=0.27.0
pytest>=8.0.0
```

---

## Key Patterns

### 1. Iterative Refinement
Claude can see command outputs and adjust - let it iterate:

```python
# Bad: Single shot
response = client.messages.create(...)

# Good: Allow iteration
while not done:
    response = client.messages.create(...)
    # Process tool results
    # Continue until complete
```

### 2. Tool Design
Clear, focused tools work best:

```python
# Bad: Vague tool
{"name": "do_stuff", "description": "Does things"}

# Good: Specific tool
{"name": "read_file", "description": "Read contents of a file at the given path"}
```

### 3. Error Handling
Return errors as tool results, let Claude adapt:

```python
def read_file(path):
    try:
        return open(path).read()
    except FileNotFoundError:
        return f"Error: File not found at {path}"
    # Claude will try alternative approaches
```

---

## Next Steps

- Add more tools (web search, database queries)
- Implement conversation memory/persistence
- Add authentication and rate limiting
- Set up monitoring and logging
- Deploy to production (Vercel, AWS, OCI)

---

## Resources

- [Claude Agent SDK Docs](https://docs.claude.com/en/api/agent-sdk)
- [Computer Use Guide](https://docs.anthropic.com/en/docs/agents/computer-use)
- [MCP Servers](https://modelcontextprotocol.io)
- [Tool Use Best Practices](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)
