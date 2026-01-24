"use client";

import { useCallback } from "react";
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  Connection,
  Node,
  Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CustomNode, { CustomNodeData } from "./CustomNode";

const nodeTypes = { custom: CustomNode };

const initialNodes: Node<CustomNodeData>[] = [
  // Host Applications
  {
    id: "claude-desktop",
    type: "custom",
    position: { x: 50, y: 50 },
    data: { label: "Claude Desktop", icon: "🖥️", variant: "primary" },
  },
  {
    id: "vscode",
    type: "custom",
    position: { x: 50, y: 150 },
    data: { label: "VS Code + Cline", icon: "📝", variant: "primary" },
  },
  {
    id: "custom-host",
    type: "custom",
    position: { x: 50, y: 250 },
    data: { label: "Custom Host", icon: "🔧", variant: "primary" },
  },

  // MCP Client
  {
    id: "transport",
    type: "custom",
    position: { x: 250, y: 100 },
    data: {
      label: "Transport Layer",
      icon: "🔌",
      variant: "accent",
      description: "stdio / SSE / WebSocket",
    },
  },
  {
    id: "protocol",
    type: "custom",
    position: { x: 250, y: 200 },
    data: {
      label: "Protocol Handler",
      icon: "📡",
      variant: "accent",
      description: "JSON-RPC 2.0",
    },
  },

  // MCP Servers
  {
    id: "fs-server",
    type: "custom",
    position: { x: 500, y: 0 },
    data: {
      label: "Filesystem Server",
      icon: "📁",
      variant: "secondary",
      description: "read, write, list",
    },
  },
  {
    id: "github-server",
    type: "custom",
    position: { x: 500, y: 100 },
    data: {
      label: "GitHub Server",
      icon: "🐙",
      variant: "secondary",
      description: "repos, issues, PRs",
    },
  },
  {
    id: "db-server",
    type: "custom",
    position: { x: 500, y: 200 },
    data: {
      label: "Database Server",
      icon: "🗄️",
      variant: "secondary",
      description: "query, schema",
    },
  },
  {
    id: "web-server",
    type: "custom",
    position: { x: 500, y: 300 },
    data: {
      label: "Web Server",
      icon: "🌐",
      variant: "secondary",
      description: "fetch, scrape",
    },
  },

  // Capabilities
  {
    id: "tools",
    type: "custom",
    position: { x: 750, y: 50 },
    data: {
      label: "Tools",
      icon: "🔧",
      variant: "warning",
      description: "Functions LLM can call",
    },
  },
  {
    id: "resources",
    type: "custom",
    position: { x: 750, y: 150 },
    data: {
      label: "Resources",
      icon: "📚",
      variant: "warning",
      description: "Data LLM can read",
    },
  },
  {
    id: "prompts",
    type: "custom",
    position: { x: 750, y: 250 },
    data: {
      label: "Prompts",
      icon: "💬",
      variant: "warning",
      description: "Template prompts",
    },
  },

  // External Systems
  {
    id: "apis",
    type: "custom",
    position: { x: 500, y: 450 },
    data: { label: "REST APIs", icon: "🌍", variant: "muted" },
  },
  {
    id: "databases",
    type: "custom",
    position: { x: 650, y: 450 },
    data: { label: "Databases", icon: "💾", variant: "muted" },
  },
  {
    id: "cloud",
    type: "custom",
    position: { x: 800, y: 450 },
    data: { label: "Cloud Services", icon: "☁️", variant: "muted" },
  },
];

const initialEdges: Edge[] = [
  // Hosts to Transport
  { id: "e1", source: "claude-desktop", target: "transport", style: { stroke: "#14b8a6" } },
  { id: "e2", source: "vscode", target: "transport", style: { stroke: "#14b8a6" } },
  { id: "e3", source: "custom-host", target: "transport", style: { stroke: "#14b8a6" } },

  // Transport to Protocol
  { id: "e4", source: "transport", target: "protocol" },

  // Protocol to Servers
  { id: "e5", source: "protocol", target: "fs-server", style: { stroke: "#9333ea" } },
  { id: "e6", source: "protocol", target: "github-server", style: { stroke: "#9333ea" } },
  { id: "e7", source: "protocol", target: "db-server", style: { stroke: "#9333ea" } },
  { id: "e8", source: "protocol", target: "web-server", style: { stroke: "#9333ea" } },

  // Servers to Capabilities
  { id: "e9", source: "fs-server", target: "tools", style: { strokeDasharray: "5,5", stroke: "#f59e0b" } },
  { id: "e10", source: "github-server", target: "tools", style: { strokeDasharray: "5,5", stroke: "#f59e0b" } },
  { id: "e11", source: "db-server", target: "resources", style: { strokeDasharray: "5,5", stroke: "#f59e0b" } },
  { id: "e12", source: "web-server", target: "resources", style: { strokeDasharray: "5,5", stroke: "#f59e0b" } },

  // Servers to External
  { id: "e13", source: "github-server", target: "apis", style: { stroke: "#ef4444" } },
  { id: "e14", source: "db-server", target: "databases", style: { stroke: "#ef4444" } },
  { id: "e15", source: "web-server", target: "cloud", style: { stroke: "#ef4444" } },
];

export default function MCPDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      defaultEdgeOptions={{
        style: { strokeWidth: 2, stroke: "#64748b" },
        type: "smoothstep",
      }}
    >
      <Controls />
      <MiniMap
        nodeStrokeColor="#334155"
        nodeColor={(n) => {
          const data = n.data as CustomNodeData;
          if (data.variant === "primary") return "#06b6d4";
          if (data.variant === "accent") return "#9333ea";
          if (data.variant === "success") return "#22c55e";
          if (data.variant === "warning") return "#f59e0b";
          return "#334155";
        }}
      />
      <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
    </ReactFlow>
  );
}
