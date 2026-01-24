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
  // Data Ingestion
  {
    id: "docs",
    type: "custom",
    position: { x: 50, y: 100 },
    data: { label: "Documents", icon: "📄", variant: "muted" },
  },
  {
    id: "loader",
    type: "custom",
    position: { x: 50, y: 200 },
    data: { label: "Document Loader", icon: "📥", variant: "secondary" },
  },
  {
    id: "chunker",
    type: "custom",
    position: { x: 50, y: 300 },
    data: { label: "Semantic Chunker", icon: "✂️", variant: "secondary" },
  },

  // Embedding
  {
    id: "embedder",
    type: "custom",
    position: { x: 250, y: 200 },
    data: { label: "Embedding Model", icon: "🧠", variant: "primary" },
  },
  {
    id: "cache",
    type: "custom",
    position: { x: 250, y: 300 },
    data: { label: "Embedding Cache", icon: "💾", variant: "muted" },
  },

  // Vector DB
  {
    id: "vectordb",
    type: "custom",
    position: { x: 450, y: 200 },
    data: {
      label: "Vector Database",
      icon: "🗄️",
      variant: "accent",
      description: "Pinecone / pgvector",
    },
  },

  // Query Pipeline
  {
    id: "query",
    type: "custom",
    position: { x: 650, y: 50 },
    data: { label: "User Query", icon: "👤", variant: "primary" },
  },
  {
    id: "search",
    type: "custom",
    position: { x: 650, y: 150 },
    data: { label: "Semantic Search", icon: "🔍", variant: "secondary" },
  },
  {
    id: "rerank",
    type: "custom",
    position: { x: 650, y: 250 },
    data: {
      label: "Cross-Encoder Rerank",
      icon: "⚡",
      variant: "accent",
    },
  },

  // Generation
  {
    id: "context",
    type: "custom",
    position: { x: 850, y: 150 },
    data: { label: "Context Assembly", icon: "📋", variant: "secondary" },
  },
  {
    id: "llm",
    type: "custom",
    position: { x: 850, y: 250 },
    data: {
      label: "LLM",
      icon: "🤖",
      variant: "primary",
      description: "Claude / GPT-4",
    },
  },
  {
    id: "response",
    type: "custom",
    position: { x: 850, y: 350 },
    data: {
      label: "Response + Citations",
      icon: "💬",
      variant: "success",
    },
  },

  // Observability
  {
    id: "traces",
    type: "custom",
    position: { x: 1050, y: 250 },
    data: {
      label: "LangFuse Traces",
      icon: "📊",
      variant: "warning",
    },
  },
];

const initialEdges: Edge[] = [
  // Ingestion flow
  { id: "e1", source: "docs", target: "loader", animated: true },
  { id: "e2", source: "loader", target: "chunker" },
  { id: "e3", source: "chunker", target: "embedder" },
  { id: "e4", source: "embedder", target: "cache", style: { strokeDasharray: "5,5" } },
  { id: "e5", source: "embedder", target: "vectordb", style: { stroke: "#9333ea" } },

  // Query flow
  { id: "e6", source: "query", target: "search", animated: true },
  { id: "e7", source: "search", target: "vectordb", style: { stroke: "#9333ea" } },
  { id: "e8", source: "vectordb", target: "rerank" },
  { id: "e9", source: "rerank", target: "context", style: { stroke: "#22c55e" } },
  { id: "e10", source: "context", target: "llm" },
  { id: "e11", source: "llm", target: "response", style: { stroke: "#06b6d4" } },

  // Observability
  {
    id: "e12",
    source: "llm",
    target: "traces",
    style: { strokeDasharray: "5,5", stroke: "#f59e0b" },
  },
];

export default function RAGDiagram() {
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
