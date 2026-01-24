"use client";

import { useState } from "react";
import RAGDiagram from "@/components/diagrams/RAGDiagram";
import MultiAgentDiagram from "@/components/diagrams/MultiAgentDiagram";
import MCPDiagram from "@/components/diagrams/MCPDiagram";

const diagrams = [
  {
    id: "rag",
    title: "Production RAG System",
    description: "Enterprise-grade retrieval augmented generation",
    component: RAGDiagram,
  },
  {
    id: "multi-agent",
    title: "Multi-Agent Orchestration",
    description: "Supervisor pattern with specialist agents",
    component: MultiAgentDiagram,
  },
  {
    id: "mcp",
    title: "MCP Architecture",
    description: "Model Context Protocol server patterns",
    component: MCPDiagram,
  },
];

export default function Home() {
  const [activeDiagram, setActiveDiagram] = useState("rag");

  const ActiveComponent =
    diagrams.find((d) => d.id === activeDiagram)?.component || RAGDiagram;

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              AI Architect Academy
            </h1>
            <p className="text-sm text-slate-500">Interactive Diagrams</p>
          </div>
          <a
            href="https://github.com/AI-Architect-Academy/ai-architect-academy"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm"
          >
            View on GitHub
          </a>
        </div>
      </header>

      {/* Diagram Selector */}
      <nav className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto">
          {diagrams.map((diagram) => (
            <button
              key={diagram.id}
              onClick={() => setActiveDiagram(diagram.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeDiagram === diagram.id
                  ? "bg-brand-purple text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {diagram.title}
            </button>
          ))}
        </div>
      </nav>

      {/* Diagram Container */}
      <div className="h-[calc(100vh-140px)]">
        <ActiveComponent />
      </div>

      {/* Info Panel */}
      <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs border border-slate-200">
        <h3 className="font-semibold text-slate-800 mb-1">
          {diagrams.find((d) => d.id === activeDiagram)?.title}
        </h3>
        <p className="text-sm text-slate-500">
          {diagrams.find((d) => d.id === activeDiagram)?.description}
        </p>
        <p className="text-xs text-slate-400 mt-2">
          Drag nodes to rearrange. Scroll to zoom.
        </p>
      </div>
    </main>
  );
}
