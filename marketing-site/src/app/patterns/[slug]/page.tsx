import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/Card';
import { patterns, patternCategories, getPatternBySlug, getAllPatternSlugs } from '@/data/patterns';
import {
  ArrowLeft,
  Layers,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Cpu,
  Link2,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPatternSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pattern = getPatternBySlug(slug);

  if (!pattern) {
    return { title: 'Pattern Not Found' };
  }

  return {
    title: `${pattern.name} - AI Architecture Pattern`,
    description: pattern.description,
    keywords: pattern.keywords,
    openGraph: {
      title: `${pattern.name} - AI Architecture Pattern`,
      description: pattern.description,
      url: `https://ai-architect-academy.vercel.app/patterns/${slug}/`,
    },
  };
}

export default async function PatternPage({ params }: Props) {
  const { slug } = await params;
  const pattern = getPatternBySlug(slug);

  if (!pattern) {
    notFound();
  }

  const relatedPatterns = pattern.relatedPatterns
    .map((slug) => patterns.find((p) => p.slug === slug))
    .filter(Boolean);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Link
            href="/patterns/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            All Patterns
          </Link>

          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${patternCategories[pattern.category].color} px-3 py-1 text-xs font-medium text-white`}
              >
                {patternCategories[pattern.category].name}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  pattern.difficulty === 'beginner'
                    ? 'bg-green-500/10 text-green-400'
                    : pattern.difficulty === 'intermediate'
                      ? 'bg-amber-500/10 text-amber-400'
                      : pattern.difficulty === 'advanced'
                        ? 'bg-rose-500/10 text-rose-400'
                        : 'bg-purple-500/10 text-purple-400'
                }`}
              >
                {pattern.difficulty}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white">{pattern.name}</h1>
            <p className="mt-6 text-lg text-slate-300">{pattern.description}</p>
          </div>

          {/* Problem */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
              The Problem
            </h2>
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-6">
              <p className="text-slate-300">{pattern.problem}</p>
            </div>
          </section>

          {/* Solution */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-green-500" />
              The Solution
            </h2>
            <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-6">
              <p className="text-slate-300">{pattern.solution}</p>
            </div>
          </section>

          {/* Components */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Cpu className="h-6 w-6 text-purple-500" />
              Components
            </h2>
            <div className="space-y-4">
              {pattern.components.map((component, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-slate-900/50 border border-slate-800 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-white">{component.name}</h3>
                      <p className="mt-1 text-sm text-slate-400">{component.purpose}</p>
                    </div>
                    <span className="flex-shrink-0 rounded-lg bg-slate-800 px-3 py-1 text-xs text-slate-300">
                      {component.technology}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Use Cases */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-cyan-500" />
              Use Cases
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {pattern.useCases.map((useCase, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-xl bg-slate-900/50 border border-slate-800 p-4"
                >
                  <ArrowRight className="h-5 w-5 text-cyan-500 flex-shrink-0" />
                  <span className="text-slate-300">{useCase}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Anti-Patterns */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <XCircle className="h-6 w-6 text-rose-500" />
              Anti-Patterns to Avoid
            </h2>
            <div className="space-y-3">
              {pattern.antiPatterns.map((antiPattern, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-xl bg-rose-500/10 border border-rose-500/20 p-4"
                >
                  <XCircle className="h-5 w-5 text-rose-500 flex-shrink-0" />
                  <span className="text-slate-300">{antiPattern}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Related Patterns */}
          {relatedPatterns.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Link2 className="h-6 w-6 text-purple-500" />
                Related Patterns
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {relatedPatterns.map(
                  (relatedPattern) =>
                    relatedPattern && (
                      <Card
                        key={relatedPattern.slug}
                        title={relatedPattern.name}
                        description={relatedPattern.description}
                        href={`/patterns/${relatedPattern.slug}/`}
                        category={relatedPattern.difficulty}
                        categoryColor={
                          relatedPattern.difficulty === 'beginner'
                            ? 'from-green-500 to-emerald-600'
                            : relatedPattern.difficulty === 'intermediate'
                              ? 'from-amber-500 to-orange-600'
                              : relatedPattern.difficulty === 'advanced'
                                ? 'from-rose-500 to-red-600'
                                : 'from-purple-500 to-pink-600'
                        }
                        icon={<Layers className="h-3 w-3" />}
                      />
                    )
                )}
              </div>
            </section>
          )}

          {/* CTA */}
          <section className="mt-16 rounded-2xl bg-gradient-to-r from-purple-900/50 to-cyan-900/50 border border-purple-500/20 p-8 text-center">
            <h2 className="text-2xl font-bold text-white">Learn This Pattern</h2>
            <p className="mt-2 text-slate-300">
              Master the {pattern.name} in our comprehensive curriculum
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/paths/100-hour-ai-architect/"
                className="rounded-xl bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-slate-100 transition-all"
              >
                Start Learning Path
              </Link>
              <Link
                href="/patterns/"
                className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10 transition-all"
              >
                Browse All Patterns
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
