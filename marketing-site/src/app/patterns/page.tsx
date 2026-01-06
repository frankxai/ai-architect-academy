import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/Card';
import { patterns, patternCategories, type Pattern } from '@/data/patterns';
import { Blocks, Layers } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Architecture Patterns - Battle-Tested Production Patterns',
  description:
    'Explore 200+ battle-tested architecture patterns for production AI systems. RAG, multi-agent orchestration, AI gateway, guardrails, and more.',
  keywords: [
    'ai architecture patterns',
    'rag patterns',
    'multi-agent patterns',
    'ai gateway',
    'llmops patterns',
    'ai design patterns',
  ],
  openGraph: {
    title: 'AI Architecture Patterns - Battle-Tested Production Patterns',
    description: 'Explore 200+ battle-tested architecture patterns for production AI systems',
    url: 'https://ai-architect-academy.vercel.app/patterns/',
  },
};

function groupByCategory(patterns: Pattern[]): Record<string, Pattern[]> {
  return patterns.reduce(
    (acc, pattern) => {
      if (!acc[pattern.category]) {
        acc[pattern.category] = [];
      }
      acc[pattern.category].push(pattern);
      return acc;
    },
    {} as Record<string, Pattern[]>
  );
}

export default function PatternsPage() {
  const groupedPatterns = groupByCategory(patterns);
  const categories = Object.keys(patternCategories) as Array<keyof typeof patternCategories>;

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 text-sm text-cyan-300 mb-6">
              <Blocks className="h-4 w-4" />
              200+ Patterns
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">Architecture Patterns</h1>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
              Battle-tested patterns for building production AI systems. Learn the proven solutions
              to common challenges in enterprise AI.
            </p>
          </div>

          {/* Patterns by Category */}
          {categories.map((category) => {
            const categoryPatterns = groupedPatterns[category] || [];
            if (categoryPatterns.length === 0) return null;

            return (
              <section key={category} className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <h2
                    className={`text-2xl font-bold bg-gradient-to-r ${patternCategories[category].color} bg-clip-text text-transparent`}
                  >
                    {patternCategories[category].name}
                  </h2>
                  <span className="text-sm text-slate-500">
                    ({categoryPatterns.length} patterns)
                  </span>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryPatterns.map((pattern) => (
                    <Card
                      key={pattern.slug}
                      title={pattern.name}
                      description={pattern.description}
                      href={`/patterns/${pattern.slug}/`}
                      category={pattern.difficulty}
                      categoryColor={
                        pattern.difficulty === 'beginner'
                          ? 'from-green-500 to-emerald-600'
                          : pattern.difficulty === 'intermediate'
                            ? 'from-amber-500 to-orange-600'
                            : pattern.difficulty === 'advanced'
                              ? 'from-rose-500 to-red-600'
                              : 'from-purple-500 to-pink-600'
                      }
                      icon={<Layers className="h-3 w-3" />}
                    />
                  ))}
                </div>
              </section>
            );
          })}

          {/* SEO Content */}
          <section className="mt-20 prose prose-invert prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-white">AI Architecture Design Patterns</h2>
            <p className="text-slate-400">
              Our pattern library contains {patterns.length}+ documented patterns covering the full
              spectrum of AI system design. Each pattern includes the problem context, solution
              approach, components, use cases, and anti-patterns to avoid.
            </p>
            <h3 className="text-xl font-semibold text-white mt-8">Pattern Categories</h3>
            <ul className="text-slate-400">
              <li>
                <strong className="text-white">Retrieval & RAG:</strong> Production RAG, semantic
                caching, agentic RAG, and hybrid search patterns
              </li>
              <li>
                <strong className="text-white">Agents & Orchestration:</strong> Multi-agent
                supervision, handoffs, state management, and workflow patterns
              </li>
              <li>
                <strong className="text-white">Infrastructure:</strong> AI gateway, routing, rate
                limiting, and multi-provider patterns
              </li>
              <li>
                <strong className="text-white">Governance & Security:</strong> LLMOps, guardrails,
                evaluation, and compliance patterns
              </li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
