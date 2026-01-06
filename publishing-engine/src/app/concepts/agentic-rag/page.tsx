import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { JsonLd, createConceptSchema, createFAQSchema } from '@/components/JsonLd';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Code2,
  ArrowRight,
  Clock,
  Calendar,
  BookOpen,
} from 'lucide-react';

const LAST_UPDATED = '2026-01-06';
const URL = 'https://ai-architect-academy.vercel.app/concepts/agentic-rag/';

export const metadata: Metadata = {
  title: 'What is Agentic RAG? Complete Guide to Self-Correcting Retrieval',
  description:
    'Agentic RAG combines retrieval-augmented generation with autonomous agent capabilities for self-correcting, multi-step retrieval. Learn how it works and when to use it.',
  keywords: [
    'agentic RAG',
    'self-correcting RAG',
    'autonomous retrieval',
    'multi-hop RAG',
    'RAG with agents',
    'adaptive retrieval',
  ],
  openGraph: {
    title: 'What is Agentic RAG? Complete Guide',
    description: 'Self-correcting RAG with autonomous agent capabilities',
    url: URL,
    type: 'article',
  },
};

const conceptSchema = createConceptSchema({
  name: 'Agentic RAG',
  description:
    'An AI architecture pattern that combines retrieval-augmented generation with autonomous agent capabilities, enabling self-correcting, multi-step retrieval and adaptive query refinement.',
  url: URL,
  datePublished: '2026-01-06',
  dateModified: LAST_UPDATED,
});

const faqSchema = createFAQSchema([
  {
    question: 'What is the difference between Agentic RAG and traditional RAG?',
    answer:
      'Traditional RAG performs a single retrieval step before generation. Agentic RAG uses an autonomous agent that can perform multiple retrieval iterations, evaluate result quality, refine queries, and self-correct until sufficient information is gathered.',
  },
  {
    question: 'When should I use Agentic RAG instead of standard RAG?',
    answer:
      'Use Agentic RAG for complex queries requiring multi-hop reasoning, when retrieval quality varies, when queries need decomposition, or when you need the system to autonomously decide when it has enough information.',
  },
  {
    question: 'What frameworks support Agentic RAG?',
    answer:
      'LangGraph is the most popular framework for building Agentic RAG systems, providing graph-based workflow orchestration. LlamaIndex also offers agentic retrieval patterns, and CrewAI can be used for multi-agent retrieval scenarios.',
  },
]);

export default function AgenticRagPage() {
  return (
    <>
      <JsonLd data={conceptSchema} />
      <JsonLd data={faqSchema} />
      <Header />
      <main className="min-h-screen pt-24 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/concepts/" className="hover:text-white">Concepts</Link>
            <span>/</span>
            <span className="text-slate-300">Agentic RAG</span>
          </nav>

          {/* Header */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              What is Agentic RAG?
            </h1>
            <p className="text-xl text-slate-400 mb-6">
              Complete guide to self-correcting retrieval-augmented generation with autonomous agent capabilities
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Last updated: {LAST_UPDATED}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                12 min read
              </span>
            </div>
          </header>

          {/* Main Content */}
          <article className="prose prose-slate prose-invert max-w-none">
            {/* CRITICAL: First paragraph - direct answer for AI extraction */}
            <p className="text-lg text-slate-300 leading-relaxed">
              <strong>Agentic RAG</strong> is an AI architecture pattern that combines retrieval-augmented
              generation (RAG) with autonomous agent capabilities, enabling systems to perform
              multi-step retrieval, evaluate result quality, and self-correct until sufficient
              information is gathered. Unlike traditional RAG which performs a single retrieval step,
              Agentic RAG uses an intelligent agent that can decompose complex queries, iteratively
              refine searches, and autonomously decide when it has enough context to generate an
              accurate response.
            </p>

            {/* Quotable Definition */}
            <blockquote className="border-l-4 border-purple-500 bg-purple-500/10 rounded-r-xl p-4 my-8">
              <p className="text-slate-200 m-0">
                <strong className="text-white">Definition:</strong> Agentic RAG — An architecture pattern
                that augments retrieval-augmented generation with autonomous agent capabilities,
                enabling self-correcting, multi-step retrieval and adaptive query refinement for
                complex information needs.
              </p>
            </blockquote>

            {/* TL;DR */}
            <div className="rounded-xl bg-cyan-500/10 border border-cyan-500/20 p-6 my-8">
              <p className="text-slate-200 m-0">
                <span className="font-semibold text-cyan-400">TL;DR:</span> Agentic RAG adds an
                intelligent agent layer to RAG that can retry failed retrievals, break down complex
                questions, and evaluate whether retrieved context is sufficient before generating
                responses. Use it when standard RAG struggles with multi-hop reasoning or inconsistent
                retrieval quality.
              </p>
            </div>

            <h2 id="how-it-works">How Agentic RAG Works</h2>

            <p>
              Traditional RAG follows a linear pipeline: embed query → retrieve documents → generate
              response. Agentic RAG introduces an agent that orchestrates this process dynamically:
            </p>

            <div className="bg-slate-900 rounded-xl p-6 my-6 font-mono text-sm">
              <pre className="text-slate-300 whitespace-pre-wrap">{`┌─────────────────────────────────────────────────────────┐
│                    AGENTIC RAG FLOW                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  User Query                                             │
│      ↓                                                  │
│  ┌─────────────┐                                        │
│  │ Query       │ ← Decompose complex queries            │
│  │ Analyzer    │   into sub-questions                   │
│  └──────┬──────┘                                        │
│         ↓                                               │
│  ┌─────────────┐    ┌─────────────┐                     │
│  │ Retrieval   │───→│ Result      │ ← Evaluate quality  │
│  │ Executor    │    │ Evaluator   │   and relevance     │
│  └──────┬──────┘    └──────┬──────┘                     │
│         ↑                  │                            │
│         │    Insufficient  │  Sufficient               │
│         └──────────────────┘      ↓                     │
│                           ┌─────────────┐               │
│                           │ Response    │               │
│                           │ Generator   │               │
│                           └─────────────┘               │
│                                                         │
└─────────────────────────────────────────────────────────┘`}</pre>
            </div>

            <h3 id="key-components">Key Components</h3>

            <div className="grid gap-4 my-6">
              <div className="rounded-xl bg-slate-900/50 border border-slate-800 p-4">
                <h4 className="font-semibold text-white m-0">1. Query Analyzer</h4>
                <p className="text-slate-400 mt-2 mb-0">
                  Decomposes complex queries into sub-questions, identifies required information types,
                  and plans the retrieval strategy.
                </p>
              </div>
              <div className="rounded-xl bg-slate-900/50 border border-slate-800 p-4">
                <h4 className="font-semibold text-white m-0">2. Retrieval Executor</h4>
                <p className="text-slate-400 mt-2 mb-0">
                  Performs the actual retrieval, potentially from multiple sources with different
                  strategies (vector search, keyword search, structured queries).
                </p>
              </div>
              <div className="rounded-xl bg-slate-900/50 border border-slate-800 p-4">
                <h4 className="font-semibold text-white m-0">3. Result Evaluator</h4>
                <p className="text-slate-400 mt-2 mb-0">
                  Assesses retrieved context quality, relevance, and completeness. Decides whether to
                  retry with refined queries or proceed to generation.
                </p>
              </div>
              <div className="rounded-xl bg-slate-900/50 border border-slate-800 p-4">
                <h4 className="font-semibold text-white m-0">4. Response Generator</h4>
                <p className="text-slate-400 mt-2 mb-0">
                  Generates the final response using accumulated context, with awareness of information
                  gaps and confidence levels.
                </p>
              </div>
            </div>

            <h2 id="when-to-use">When to Use Agentic RAG</h2>

            <div className="grid md:grid-cols-2 gap-4 my-6">
              <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-4">
                <h4 className="font-semibold text-green-400 flex items-center gap-2 m-0">
                  <CheckCircle2 className="h-5 w-5" />
                  Use Agentic RAG When:
                </h4>
                <ul className="text-slate-300 mt-3 mb-0 space-y-2">
                  <li>Queries require multi-hop reasoning</li>
                  <li>Information is spread across sources</li>
                  <li>Retrieval quality is inconsistent</li>
                  <li>Questions need decomposition</li>
                  <li>Domain complexity is high</li>
                </ul>
              </div>
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4">
                <h4 className="font-semibold text-amber-400 flex items-center gap-2 m-0">
                  <AlertTriangle className="h-5 w-5" />
                  Stick to Standard RAG When:
                </h4>
                <ul className="text-slate-300 mt-3 mb-0 space-y-2">
                  <li>Queries are simple and direct</li>
                  <li>Single retrieval usually sufficient</li>
                  <li>Latency is critical (&lt;1s)</li>
                  <li>Cost per query is a concern</li>
                  <li>Retrieval quality is consistently high</li>
                </ul>
              </div>
            </div>

            <h2 id="implementation">Implementation with LangGraph</h2>

            <p>
              LangGraph is the most popular framework for building Agentic RAG. Here&apos;s a minimal
              implementation:
            </p>

            <pre className="bg-slate-900 rounded-xl p-4 overflow-x-auto">
              <code className="text-sm">{`from langgraph.graph import StateGraph, END
from langchain_core.messages import HumanMessage

# Define the state
class AgentState(TypedDict):
    query: str
    retrieved_docs: list[Document]
    evaluation: str
    response: str
    iterations: int

# Create the graph
workflow = StateGraph(AgentState)

# Add nodes
workflow.add_node("analyze", analyze_query)
workflow.add_node("retrieve", retrieve_documents)
workflow.add_node("evaluate", evaluate_results)
workflow.add_node("generate", generate_response)

# Add edges with conditional routing
workflow.add_edge("analyze", "retrieve")
workflow.add_edge("retrieve", "evaluate")
workflow.add_conditional_edges(
    "evaluate",
    should_continue,
    {
        "retry": "retrieve",  # Loop back if insufficient
        "generate": "generate"  # Proceed if sufficient
    }
)
workflow.add_edge("generate", END)

# Compile and run
app = workflow.compile()
result = app.invoke({"query": "How does semantic caching work?"})`}</code>
            </pre>

            <h2 id="best-practices">Best Practices</h2>

            <div className="space-y-4 my-6">
              <div className="flex items-start gap-3 rounded-xl bg-slate-900/50 border border-slate-800 p-4">
                <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white m-0">Set iteration limits</h4>
                  <p className="text-slate-400 mt-1 mb-0">
                    Prevent infinite loops by limiting retrieval iterations (typically 3-5 max).
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-slate-900/50 border border-slate-800 p-4">
                <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white m-0">Use quality thresholds</h4>
                  <p className="text-slate-400 mt-1 mb-0">
                    Define clear criteria for when retrieved context is &quot;good enough&quot; to proceed.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-slate-900/50 border border-slate-800 p-4">
                <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white m-0">Track retrieval history</h4>
                  <p className="text-slate-400 mt-1 mb-0">
                    Maintain state of what&apos;s been tried to avoid redundant searches.
                  </p>
                </div>
              </div>
            </div>

            <h2 id="faq">Frequently Asked Questions</h2>

            <div className="space-y-6 my-6">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  What is the difference between Agentic RAG and traditional RAG?
                </h3>
                <p className="text-slate-300">
                  Traditional RAG performs a single retrieval step before generation. Agentic RAG
                  uses an autonomous agent that can perform multiple retrieval iterations, evaluate
                  result quality, refine queries, and self-correct until sufficient information is
                  gathered.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  When should I use Agentic RAG instead of standard RAG?
                </h3>
                <p className="text-slate-300">
                  Use Agentic RAG for complex queries requiring multi-hop reasoning, when retrieval
                  quality varies, when queries need decomposition, or when you need the system to
                  autonomously decide when it has enough information.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  What frameworks support Agentic RAG?
                </h3>
                <p className="text-slate-300">
                  LangGraph is the most popular framework for building Agentic RAG systems. LlamaIndex
                  also offers agentic retrieval patterns, and CrewAI can be used for multi-agent
                  retrieval scenarios.
                </p>
              </div>
            </div>

            <h2 id="related">Related Concepts</h2>

            <div className="grid md:grid-cols-2 gap-4 my-6 not-prose">
              <Link
                href="/concepts/rag/"
                className="block rounded-xl border border-slate-800 bg-slate-900/50 p-4 hover:border-purple-500/50 transition-colors"
              >
                <h4 className="font-semibold text-white">What is RAG?</h4>
                <p className="text-sm text-slate-400 mt-1">
                  Foundation concepts of retrieval-augmented generation
                </p>
              </Link>
              <Link
                href="/patterns/multi-agent-orchestration/"
                className="block rounded-xl border border-slate-800 bg-slate-900/50 p-4 hover:border-purple-500/50 transition-colors"
              >
                <h4 className="font-semibold text-white">Multi-Agent Orchestration</h4>
                <p className="text-sm text-slate-400 mt-1">
                  Coordinating multiple AI agents for complex tasks
                </p>
              </Link>
              <Link
                href="/guides/langgraph-multi-agent/"
                className="block rounded-xl border border-slate-800 bg-slate-900/50 p-4 hover:border-purple-500/50 transition-colors"
              >
                <h4 className="font-semibold text-white">LangGraph Tutorial</h4>
                <p className="text-sm text-slate-400 mt-1">
                  Step-by-step guide to building with LangGraph
                </p>
              </Link>
              <Link
                href="/concepts/semantic-chunking/"
                className="block rounded-xl border border-slate-800 bg-slate-900/50 p-4 hover:border-purple-500/50 transition-colors"
              >
                <h4 className="font-semibold text-white">Semantic Chunking</h4>
                <p className="text-sm text-slate-400 mt-1">
                  Intelligent document splitting for better retrieval
                </p>
              </Link>
            </div>
          </article>

          {/* CTA */}
          <section className="mt-16 rounded-2xl bg-gradient-to-r from-purple-900/50 to-cyan-900/50 border border-purple-500/20 p-8 text-center">
            <h2 className="text-2xl font-bold text-white">Learn Agentic RAG</h2>
            <p className="mt-2 text-slate-300">
              Master advanced RAG patterns in our comprehensive curriculum
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/guides/build-agentic-rag/"
                className="rounded-xl bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-slate-100 transition-all"
              >
                Build Agentic RAG →
              </Link>
              <Link
                href="/concepts/"
                className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10 transition-all"
              >
                Browse All Concepts
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
