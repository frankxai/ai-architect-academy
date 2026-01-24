# Project: Build Your First Agent

> **"Coding Agents First"** - Learn by building, not reading.

## Overview

| | |
|---|---|
| **Difficulty** | Beginner |
| **Time** | 2 hours |
| **Skills Used** | `claude-sdk`, `tool-use-patterns` |
| **Output** | A working AI agent with custom tools |

## What You'll Build

A simple but complete AI agent that can:
1. Search the web for information
2. Read and analyze files
3. Execute custom tools you define
4. Maintain conversation context

This project teaches the fundamental pattern that every production agent uses.

---

## Prerequisites

- Claude Code installed (`npm install -g @anthropic/claude-code` or via Claude.ai)
- Basic understanding of TypeScript/Python
- An Anthropic API key (for SDK projects)

---

## Part 1: Understanding Agent Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    YOUR AGENT                            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   User Input                                             │
│       │                                                  │
│       ▼                                                  │
│   ┌──────────────┐                                       │
│   │    LLM       │  (Claude, GPT, etc.)                 │
│   │   Reasoning  │                                       │
│   └──────┬───────┘                                       │
│          │                                               │
│          ▼                                               │
│   ┌──────────────┐     ┌──────────────┐                 │
│   │  Tool Call?  │────▶│  Execute     │                 │
│   │  (Decision)  │     │  Tool        │                 │
│   └──────┬───────┘     └──────┬───────┘                 │
│          │                    │                          │
│          ▼                    ▼                          │
│   ┌──────────────────────────────────┐                  │
│   │         Generate Response         │                  │
│   └──────────────────────────────────┘                  │
│          │                                               │
│          ▼                                               │
│   User Output                                            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Key Insight:** An agent is just an LLM + Tools + Loop. The LLM decides when to use tools, executes them, and incorporates results.

---

## Part 2: Build with Claude SDK (Python)

### Step 1: Setup

```bash
# Create project directory
mkdir my-first-agent && cd my-first-agent

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install anthropic
```

### Step 2: Define Your Tools

Create `tools.py`:

```python
"""Custom tools for our agent."""
import ast
import operator

def get_weather(location: str) -> dict:
    """Get current weather for a location.

    In production, this would call a real weather API.
    For learning, we'll simulate the response.
    """
    # Simulated response
    return {
        "location": location,
        "temperature": 72,
        "conditions": "Sunny",
        "humidity": 45
    }


def calculate(expression: str) -> dict:
    """Safely evaluate a math expression using AST parsing.

    Args:
        expression: A mathematical expression like "2 + 2" or "100 * 1.08"

    Returns:
        The result of the calculation
    """
    # Safe operators mapping
    operators = {
        ast.Add: operator.add,
        ast.Sub: operator.sub,
        ast.Mult: operator.mul,
        ast.Div: operator.truediv,
        ast.Pow: operator.pow,
        ast.USub: operator.neg,
    }

    def safe_eval(node):
        """Recursively evaluate AST node safely."""
        if isinstance(node, ast.Constant):  # Numbers
            return node.value
        elif isinstance(node, ast.BinOp):  # Binary operations
            left = safe_eval(node.left)
            right = safe_eval(node.right)
            return operators[type(node.op)](left, right)
        elif isinstance(node, ast.UnaryOp):  # Unary operations (like -5)
            operand = safe_eval(node.operand)
            return operators[type(node.op)](operand)
        else:
            raise ValueError(f"Unsupported operation: {type(node)}")

    try:
        tree = ast.parse(expression, mode='eval')
        result = safe_eval(tree.body)
        return {"expression": expression, "result": result}
    except Exception as e:
        return {"error": str(e)}


def search_knowledge(query: str) -> dict:
    """Search our knowledge base.

    In production, this would search a vector database.
    For learning, we'll return simulated results.
    """
    # Simulated knowledge base
    knowledge = {
        "python": "Python is a high-level programming language known for readability.",
        "agent": "An AI agent is an LLM with tools that can take actions autonomously.",
        "rag": "RAG (Retrieval Augmented Generation) enhances LLMs with external knowledge.",
        "mcp": "MCP (Model Context Protocol) is a standard for connecting AI to data sources."
    }

    # Simple keyword matching
    results = []
    for key, value in knowledge.items():
        if query.lower() in key.lower() or query.lower() in value.lower():
            results.append({"topic": key, "content": value})

    return {"query": query, "results": results, "count": len(results)}


# Tool definitions for Claude
TOOL_DEFINITIONS = [
    {
        "name": "get_weather",
        "description": "Get current weather for a location. Use this when the user asks about weather.",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "The city or location to get weather for"
                }
            },
            "required": ["location"]
        }
    },
    {
        "name": "calculate",
        "description": "Calculate a mathematical expression. Use for any math questions.",
        "input_schema": {
            "type": "object",
            "properties": {
                "expression": {
                    "type": "string",
                    "description": "The math expression to evaluate, e.g., '2 + 2' or '100 * 1.08'"
                }
            },
            "required": ["expression"]
        }
    },
    {
        "name": "search_knowledge",
        "description": "Search the knowledge base for information about AI, programming, or technology topics.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query"
                }
            },
            "required": ["query"]
        }
    }
]

# Map tool names to functions
TOOL_FUNCTIONS = {
    "get_weather": get_weather,
    "calculate": calculate,
    "search_knowledge": search_knowledge
}
```

### Step 3: Build the Agent

Create `agent.py`:

```python
"""My First Agent - Learning the fundamentals."""

import json
from anthropic import Anthropic
from tools import TOOL_DEFINITIONS, TOOL_FUNCTIONS

# Initialize the client
client = Anthropic()

def run_agent(user_message: str, conversation_history: list = None) -> str:
    """Run the agent with a user message.

    Args:
        user_message: What the user wants
        conversation_history: Previous messages for context

    Returns:
        The agent's response
    """
    if conversation_history is None:
        conversation_history = []

    # Add user message to history
    conversation_history.append({
        "role": "user",
        "content": user_message
    })

    # System prompt defines agent behavior
    system_prompt = """You are a helpful AI assistant with access to tools.

When users ask questions:
1. If you need real-time data (weather, calculations), use your tools
2. If you need to look up information, use the search_knowledge tool
3. Always explain your reasoning briefly

Be concise but helpful."""

    # Main agent loop
    while True:
        # Call Claude with tools
        response = client.messages.create(
            model="claude-sonnet-4-5-20250514",
            max_tokens=1024,
            system=system_prompt,
            tools=TOOL_DEFINITIONS,
            messages=conversation_history
        )

        # Check if we need to use tools
        if response.stop_reason == "tool_use":
            # Find tool calls in the response
            tool_calls = [block for block in response.content if block.type == "tool_use"]

            # Add assistant's response (with tool calls) to history
            conversation_history.append({
                "role": "assistant",
                "content": response.content
            })

            # Execute each tool and collect results
            tool_results = []
            for tool_call in tool_calls:
                tool_name = tool_call.name
                tool_input = tool_call.input

                print(f"🔧 Using tool: {tool_name}")
                print(f"   Input: {json.dumps(tool_input, indent=2)}")

                # Execute the tool
                if tool_name in TOOL_FUNCTIONS:
                    result = TOOL_FUNCTIONS[tool_name](**tool_input)
                else:
                    result = {"error": f"Unknown tool: {tool_name}"}

                print(f"   Result: {json.dumps(result, indent=2)}")

                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": tool_call.id,
                    "content": json.dumps(result)
                })

            # Add tool results to history
            conversation_history.append({
                "role": "user",
                "content": tool_results
            })

            # Continue the loop to get final response
            continue

        # No more tool calls - extract final response
        final_response = ""
        for block in response.content:
            if hasattr(block, "text"):
                final_response += block.text

        # Add assistant response to history
        conversation_history.append({
            "role": "assistant",
            "content": final_response
        })

        return final_response


def main():
    """Interactive agent loop."""
    print("=" * 50)
    print("🤖 My First Agent")
    print("=" * 50)
    print("I can help you with:")
    print("  - Weather information")
    print("  - Math calculations")
    print("  - Knowledge searches")
    print("\nType 'quit' to exit\n")

    conversation_history = []

    while True:
        user_input = input("You: ").strip()

        if user_input.lower() in ['quit', 'exit', 'q']:
            print("Goodbye!")
            break

        if not user_input:
            continue

        response = run_agent(user_input, conversation_history)
        print(f"\nAgent: {response}\n")


if __name__ == "__main__":
    main()
```

### Step 4: Run Your Agent

```bash
# Set your API key
export ANTHROPIC_API_KEY="your-key-here"

# Run the agent
python agent.py
```

### Step 5: Test It

Try these prompts:

```
You: What's the weather in San Francisco?
You: Calculate 15% tip on a $85 dinner
You: What is RAG in AI?
You: Search for information about MCP
```

---

## Part 3: Understanding What You Built

### The Agent Loop

```python
while True:
    response = llm.call(messages, tools)

    if response.wants_to_use_tool:
        result = execute_tool(response.tool_call)
        messages.append(result)
        continue  # Let LLM see the result

    return response.final_answer
```

This simple loop is the foundation of ALL agents:
1. **Ask LLM** what to do
2. **If tool needed**, execute it and show result to LLM
3. **Repeat** until LLM has a final answer

### Tool Design Principles

1. **Clear descriptions** - The LLM reads these to decide when to use tools
2. **Strict schemas** - Define exactly what inputs are needed
3. **Useful outputs** - Return structured data the LLM can reason about
4. **Error handling** - Return errors as data, not exceptions

---

## Part 4: Extend Your Agent

### Add More Tools

```python
# Add to tools.py

def read_file(filepath: str) -> dict:
    """Read contents of a file."""
    try:
        with open(filepath, 'r') as f:
            content = f.read()
        return {"filepath": filepath, "content": content[:1000]}  # Limit size
    except Exception as e:
        return {"error": str(e)}

def write_file(filepath: str, content: str) -> dict:
    """Write content to a file."""
    try:
        with open(filepath, 'w') as f:
            f.write(content)
        return {"status": "success", "filepath": filepath}
    except Exception as e:
        return {"error": str(e)}
```

### Add Memory

```python
# Simple memory using a file
import json

def save_memory(key: str, value: str) -> dict:
    """Save something to long-term memory."""
    try:
        # Load existing memory
        try:
            with open("memory.json", "r") as f:
                memory = json.load(f)
        except FileNotFoundError:
            memory = {}

        # Add new memory
        memory[key] = value

        # Save
        with open("memory.json", "w") as f:
            json.dump(memory, f, indent=2)

        return {"status": "saved", "key": key}
    except Exception as e:
        return {"error": str(e)}

def recall_memory(key: str) -> dict:
    """Recall something from long-term memory."""
    try:
        with open("memory.json", "r") as f:
            memory = json.load(f)
        return {"key": key, "value": memory.get(key, "Not found")}
    except FileNotFoundError:
        return {"error": "No memories yet"}
```

---

## Testing Your Solution

Your agent works correctly if:

1. **Weather queries** return simulated weather data
2. **Math questions** are calculated correctly
3. **Knowledge searches** return relevant results
4. **Multi-turn conversations** maintain context
5. **Unknown requests** are handled gracefully

---

## What You Learned

1. **Agent = LLM + Tools + Loop** - The fundamental pattern
2. **Tools enable actions** - Without tools, LLMs can only generate text
3. **Schemas matter** - Clear tool definitions help the LLM use them correctly
4. **The loop continues** - Until the LLM decides it has enough information

---

## Next Steps

| Project | Builds On |
|---------|-----------|
| [Multi-Agent RAG System](multi-agent-rag.md) | Add retrieval and multiple agents |
| [MCP Server Builder](mcp-server-builder.md) | Create reusable tools with MCP |
| [Production Agent](production-agent.md) | Add logging, error handling, deployment |

---

## Resources

- [Claude SDK Documentation](https://docs.anthropic.com/en/docs/agents)
- [Tool Use Guide](https://docs.anthropic.com/en/docs/tool-use)
- [Agent Patterns](../01-design-patterns/agent-patterns.md)

---

*Congratulations! You've built your first AI agent. This pattern scales to production systems.*
