# Lab 03: Build Your Own MCP Server

## Situation

Your team uses Claude Code daily. You have an internal knowledge base with architecture patterns, API docs, and design decisions. Right now, engineers copy-paste from a wiki. You want Claude to query it directly.

MCP (Model Context Protocol) lets you extend Claude Code with custom tools. You're going to build an MCP server that gives Claude access to your knowledge base.

## Your Mission

Implement an MCP server in `src/index.ts` that exposes 3 tools:

| Tool | Purpose | Parameters |
|------|---------|------------|
| `search_docs` | Search documents by keyword | `query`, `collection?`, `limit?` |
| `get_doc` | Get a specific document | `id` |
| `list_collections` | List all collections | (none) |

## Getting Started

```bash
# Install dependencies
npm install

# Start the lab
claude
/start-lab 03
```

## Files

| File | Purpose |
|------|---------|
| `src/index.ts` | Starter scaffold — 4 TODOs to implement |
| `package.json` | Dependencies (MCP SDK included) |
| `tsconfig.json` | TypeScript configuration |
| `.lab/config.json` | Lab metadata and checkpoints |

## When Complete

Your server should be addable to any Claude Code project:

```bash
# Build
npx tsc

# Add to Claude Code
claude mcp add academy-kb -- node dist/index.js
```

Then in Claude Code, you can ask: "Search for documents about RAG" and Claude will use your tool.

## MCP Concepts You'll Learn

- **Server lifecycle** — initialization, capability declaration, transport
- **Tool definitions** — JSON Schema for parameters, handler functions
- **Content responses** — returning structured data to the model
- **Error handling** — graceful failures that don't crash the server
