import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Architect Academy - Interactive Diagrams",
  description:
    "Interactive architecture diagrams for enterprise AI systems. Explore RAG, multi-agent orchestration, MCP, and more.",
  keywords: [
    "AI architecture",
    "RAG systems",
    "multi-agent",
    "MCP",
    "Claude SDK",
    "LangGraph",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 min-h-screen">{children}</body>
    </html>
  );
}
