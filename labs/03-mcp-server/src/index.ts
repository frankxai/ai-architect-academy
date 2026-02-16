/**
 * Academy Knowledge Base MCP Server
 * YOUR MISSION: Implement the 3 tools below.
 *
 * The MCP SDK handles the protocol. You implement the logic.
 */

// TODO: Import from @modelcontextprotocol/sdk
// import { Server } from "@modelcontextprotocol/sdk/server/index.js";
// import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

interface Document {
  id: string;
  title: string;
  content: string;
  collection: string;
  tags: string[];
}

interface Collection {
  id: string;
  name: string;
  description: string;
  documentCount: number;
}

// Sample data — in production this would be a database
const DOCUMENTS: Document[] = [
  {
    id: "doc-001",
    title: "Introduction to RAG",
    content: "Retrieval-Augmented Generation (RAG) combines information retrieval with text generation...",
    collection: "ai-patterns",
    tags: ["rag", "retrieval", "llm"]
  },
  {
    id: "doc-002",
    title: "Multi-Agent Orchestration",
    content: "Multi-agent systems coordinate multiple AI agents to solve complex tasks...",
    collection: "ai-patterns",
    tags: ["agents", "orchestration", "coordination"]
  },
  {
    id: "doc-003",
    title: "MCP Server Architecture",
    content: "The Model Context Protocol enables AI assistants to interact with external tools...",
    collection: "mcp-guide",
    tags: ["mcp", "tools", "protocol"]
  }
];

const COLLECTIONS: Collection[] = [
  { id: "ai-patterns", name: "AI Design Patterns", description: "Common patterns in AI system design", documentCount: 2 },
  { id: "mcp-guide", name: "MCP Development Guide", description: "Building MCP servers and tools", documentCount: 1 }
];

// ============================================================
// TODO: Implement the MCP server
// ============================================================

/**
 * Step 1: Create the MCP server instance
 * - Initialize with name "academy-kb" and version "1.0.0"
 * - Declare capabilities: { tools: {} }
 */

/**
 * Step 2: Implement tool listing
 * - Handle "tools/list" request
 * - Return 3 tool definitions with proper JSON Schema:
 *   - search_docs: { query: string, collection?: string, limit?: number }
 *   - get_doc: { id: string }
 *   - list_collections: {} (no params)
 */

/**
 * Step 3: Implement tool execution
 * - Handle "tools/call" request
 * - Route to the correct handler based on tool name
 * - Return results as { content: [{ type: "text", text: "..." }] }
 *
 * search_docs: Simple keyword matching on title + content + tags
 * get_doc: Find by ID, return full document
 * list_collections: Return all collections with counts
 */

/**
 * Step 4: Connect transport and start
 * - Create StdioServerTransport
 * - Connect server to transport
 * - Log "Academy KB MCP Server running" to stderr
 */

// Placeholder main — replace with real implementation
async function main() {
  console.error("TODO: Implement MCP server");
  console.error("Run /hint for guidance");
  process.exit(1);
}

main().catch(console.error);
