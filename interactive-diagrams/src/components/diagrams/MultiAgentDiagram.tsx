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
  // User
  {
    id: "user",
    type: "custom",
    position: { x: 400, y: 0 },
    data: { label: "User", icon: "👤", variant: "primary" },
  },

  // Supervisor
  {
    id: "supervisor",
    type: "custom",
    position: { x: 400, y: 100 },
    data: {
      label: "Supervisor Agent",
      icon: "🎯",
      variant: "accent",
      description: "Orchestrates all tasks",
    },
  },
  {
    id: "router",
    type: "custom",
    position: { x: 250, y: 200 },
    data: { label: "Task Router", icon: "🔀", variant: "accent" },
  },
  {
    id: "state",
    type: "custom",
    position: { x: 400, y: 200 },
    data: { label: "State Manager", icon: "📊", variant: "accent" },
  },
  {
    id: "handoff",
    type: "custom",
    position: { x: 550, y: 200 },
    data: { label: "Handoff Logic", icon: "🔄", variant: "accent" },
  },

  // Specialist Agents
  {
    id: "research",
    type: "custom",
    position: { x: 100, y: 350 },
    data: {
      label: "Research Agent",
      icon: "🔍",
      variant: "primary",
      description: "Web search, docs",
    },
  },
  {
    id: "analyst",
    type: "custom",
    position: { x: 300, y: 350 },
    data: {
      label: "Analysis Agent",
      icon: "📈",
      variant: "secondary",
      description: "Data processing",
    },
  },
  {
    id: "writer",
    type: "custom",
    position: { x: 500, y: 350 },
    data: {
      label: "Writing Agent",
      icon: "✍️",
      variant: "primary",
      description: "Content creation",
    },
  },
  {
    id: "coder",
    type: "custom",
    position: { x: 700, y: 350 },
    data: {
      label: "Coding Agent",
      icon: "💻",
      variant: "secondary",
      description: "Implementation",
    },
  },

  // Tools
  {
    id: "mcp",
    type: "custom",
    position: { x: 100, y: 500 },
    data: {
      label: "MCP Servers",
      icon: "🔧",
      variant: "warning",
      description: "GitHub, DB, Files",
    },
  },
  {
    id: "llm-pool",
    type: "custom",
    position: { x: 350, y: 500 },
    data: {
      label: "LLM Pool",
      icon: "🧠",
      variant: "warning",
      description: "Claude, GPT-4, Local",
    },
  },

  // Memory
  {
    id: "memory",
    type: "custom",
    position: { x: 600, y: 500 },
    data: {
      label: "Shared Memory",
      icon: "💾",
      variant: "muted",
      description: "Context, artifacts, state",
    },
  },
];

const initialEdges: Edge[] = [
  // User to Supervisor
  { id: "e1", source: "user", target: "supervisor", animated: true, style: { stroke: "#06b6d4", strokeWidth: 3 } },

  // Supervisor internal
  { id: "e2", source: "supervisor", target: "router" },
  { id: "e3", source: "supervisor", target: "state" },
  { id: "e4", source: "supervisor", target: "handoff" },

  // Router to specialists
  { id: "e5", source: "router", target: "research", style: { stroke: "#06b6d4" } },
  { id: "e6", source: "router", target: "analyst", style: { stroke: "#334155" } },
  { id: "e7", source: "router", target: "writer", style: { stroke: "#06b6d4" } },
  { id: "e8", source: "router", target: "coder", style: { stroke: "#334155" } },

  // Specialists to handoff (complete)
  { id: "e9", source: "research", target: "handoff", style: { stroke: "#22c55e" } },
  { id: "e10", source: "analyst", target: "handoff", style: { stroke: "#22c55e" } },
  { id: "e11", source: "writer", target: "handoff", style: { stroke: "#22c55e" } },
  { id: "e12", source: "coder", target: "handoff", style: { stroke: "#22c55e" } },

  // Tool access
  { id: "e13", source: "research", target: "mcp", style: { strokeDasharray: "5,5", stroke: "#f59e0b" } },
  { id: "e14", source: "coder", target: "mcp", style: { strokeDasharray: "5,5", stroke: "#f59e0b" } },
  { id: "e15", source: "analyst", target: "llm-pool", style: { strokeDasharray: "5,5", stroke: "#f59e0b" } },
  { id: "e16", source: "writer", target: "llm-pool", style: { strokeDasharray: "5,5", stroke: "#f59e0b" } },

  // Memory access
  { id: "e17", source: "state", target: "memory", style: { strokeDasharray: "5,5", stroke: "#0284c7" } },

  // Response back
  { id: "e18", source: "supervisor", target: "user", style: { stroke: "#22c55e", strokeWidth: 3 } },
];

export default function MultiAgentDiagram() {
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
