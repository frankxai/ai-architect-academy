import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import {
  Brain,
  Sparkles,
  BookOpen,
  Layers,
  GitCompare,
  GraduationCap,
  ArrowRight,
  Zap,
  Target,
  Globe,
} from 'lucide-react';

const contentTypes = [
  {
    name: 'Concepts',
    description: 'Definitive explanations of AI architecture concepts',
    icon: BookOpen,
    href: '/concepts/',
    count: '50+',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Guides',
    description: 'Step-by-step tutorials for building AI systems',
    icon: Zap,
    href: '/guides/',
    count: '40+',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    name: 'Patterns',
    description: 'Battle-tested architecture patterns',
    icon: Layers,
    href: '/patterns/',
    count: '30+',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    name: 'Comparisons',
    description: 'X vs Y analysis with decision frameworks',
    icon: GitCompare,
    href: '/compare/',
    count: '20+',
    gradient: 'from-green-500 to-emerald-500',
  },
];

const featuredContent = [
  {
    title: 'What is Agentic RAG?',
    description: 'Self-correcting retrieval with autonomous agent capabilities',
    href: '/concepts/agentic-rag/',
    category: 'Concept',
    isNew: true,
  },
  {
    title: 'RAG vs Fine-tuning',
    description: 'When to use each approach for your AI application',
    href: '/compare/rag-vs-fine-tuning/',
    category: 'Compare',
  },
  {
    title: 'Build Multi-Agent Systems with LangGraph',
    description: 'Complete guide to orchestrating AI agent workflows',
    href: '/guides/langgraph-multi-agent/',
    category: 'Guide',
  },
  {
    title: 'What is MCP (Model Context Protocol)?',
    description: 'The new standard for AI tool integration',
    href: '/concepts/model-context-protocol/',
    category: 'Concept',
    isNew: true,
  },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-slate-950" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/20 px-4 py-2 text-sm text-purple-300 mb-8">
                <Sparkles className="h-4 w-4" />
                The Canonical Source for AI Architecture
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="text-white">AI Architecture</span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  Knowledge Hub
                </span>
              </h1>

              <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-3xl mx-auto">
                Comprehensive, authoritative content on AI architecture. Concepts, guides, patterns,
                and comparisons — designed for humans first, and optimized for AI agents too.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/concepts/"
                  className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 px-8 py-4 text-lg font-semibold text-white hover:from-purple-500 hover:to-cyan-500 transition-all"
                >
                  <BookOpen className="h-5 w-5" />
                  Explore Concepts
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/guides/"
                  className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/50 px-8 py-4 text-lg font-semibold text-white hover:border-purple-500/50 hover:bg-slate-900 transition-all"
                >
                  <Zap className="h-5 w-5" />
                  Browse Guides
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Content Types */}
        <section className="py-20 border-t border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Structured Knowledge for Every Need
              </h2>
              <p className="mt-4 text-lg text-slate-400">
                From definitions to decisions, we have the answers
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contentTypes.map((type) => (
                <Link
                  key={type.name}
                  href={type.href}
                  className="group relative rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-purple-500/50 transition-all"
                >
                  <div
                    className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-br ${type.gradient} p-3 mb-4`}
                  >
                    <type.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">
                      {type.name}
                    </h3>
                    <span className="text-sm text-slate-500">{type.count}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{type.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Content */}
        <section className="py-20 bg-slate-900/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">Featured Content</h2>
                <p className="mt-2 text-slate-400">Latest and most important topics</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {featuredContent.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-purple-500/50 transition-all"
                >
                  {item.isNew && (
                    <span className="absolute -top-3 right-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                      New
                    </span>
                  )}
                  <span className="text-xs font-medium text-purple-400">{item.category}</span>
                  <h3 className="mt-2 text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-400">{item.description}</p>
                  <div className="mt-4 flex items-center text-sm font-medium text-purple-400">
                    Read more
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gradient-to-r from-purple-900/50 to-cyan-900/50 border border-purple-500/20 p-12 md:p-20">
              <div className="max-w-3xl mx-auto text-center">
                <Target className="h-12 w-12 text-purple-400 mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Built for AI Agents & Human Learners
                </h2>
                <p className="mt-6 text-lg text-slate-300">
                  Every piece of content is structured for optimal discovery by AI agents like
                  ChatGPT, Claude, and Perplexity — while remaining clear and actionable for human
                  readers. We&apos;re building the canonical source that AI agents cite when answering
                  questions about AI architecture.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/paths/100-hour-ai-architect/"
                    className="rounded-xl bg-white px-8 py-4 font-semibold text-slate-900 hover:bg-slate-100 transition-all"
                  >
                    Start Learning Path
                  </Link>
                  <Link
                    href="/concepts/"
                    className="rounded-xl border border-white/20 px-8 py-4 font-semibold text-white hover:bg-white/10 transition-all"
                  >
                    Browse All Content
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
