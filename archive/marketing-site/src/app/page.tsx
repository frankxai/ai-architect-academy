import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, FeatureCard, StatsCard } from '@/components/Card';
import { skills, skillCategories } from '@/data/skills';
import { patterns, patternCategories } from '@/data/patterns';
import { paths, pathCategories } from '@/data/paths';
import {
  Brain,
  Sparkles,
  Zap,
  Shield,
  Target,
  Rocket,
  Users,
  BookOpen,
  Code2,
  Globe,
  ArrowRight,
  CheckCircle2,
  Play,
} from 'lucide-react';

export default function HomePage() {
  const featuredPaths = paths.slice(0, 4);
  const featuredSkills = skills.slice(0, 6);
  const featuredPatterns = patterns.slice(0, 4);

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-slate-950" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/20 px-4 py-2 text-sm text-purple-300 mb-8">
                <Sparkles className="h-4 w-4" />
                The Complete AI Architecture Playbook
              </div>

              {/* Headline */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="text-white">Design, Ship & Operate</span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  Production AI Systems
                </span>
              </h1>

              {/* Subheadline */}
              <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-3xl mx-auto">
                Master enterprise AI architecture with 80+ skills, 60+ agents, and 200+ patterns.
                From RAG systems to multi-agent orchestration, become the AI architect your organization needs.
              </p>

              {/* CTA Buttons */}
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/paths/100-hour-ai-architect/"
                  className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 px-8 py-4 text-lg font-semibold text-white hover:from-purple-500 hover:to-cyan-500 transition-all shadow-lg shadow-purple-500/25"
                >
                  <Play className="h-5 w-5" />
                  Start 100-Hour Journey
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/skills/"
                  className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/50 px-8 py-4 text-lg font-semibold text-white hover:border-purple-500/50 hover:bg-slate-900 transition-all"
                >
                  <BookOpen className="h-5 w-5" />
                  Explore Skills
                </Link>
              </div>

              {/* Social Proof */}
              <div className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Free & Open Source
                </span>
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  1,000+ Learners
                </span>
                <span className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-cyan-500" />
                  Enterprise Ready
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 border-y border-slate-800 bg-slate-900/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatsCard value="80+" label="Skills" gradient="from-purple-400 to-pink-400" />
              <StatsCard value="60+" label="Agents" gradient="from-pink-400 to-cyan-400" />
              <StatsCard value="200+" label="Patterns" gradient="from-cyan-400 to-blue-400" />
              <StatsCard value="9" label="Learning Paths" gradient="from-blue-400 to-purple-400" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Everything You Need to Build AI Systems
              </h2>
              <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
                A comprehensive curriculum covering the full lifecycle of enterprise AI
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                title="Retrieval & RAG"
                description="Master production RAG systems with semantic chunking, hybrid search, and reranking"
                icon={<Brain className="h-6 w-6 text-white" />}
                gradient="from-cyan-500 to-blue-600"
              />
              <FeatureCard
                title="Multi-Agent Systems"
                description="Build supervisor patterns, orchestrate complex workflows with LangGraph"
                icon={<Users className="h-6 w-6 text-white" />}
                gradient="from-purple-500 to-pink-600"
              />
              <FeatureCard
                title="AI Gateway"
                description="Centralized routing, rate limiting, and cost tracking across providers"
                icon={<Zap className="h-6 w-6 text-white" />}
                gradient="from-amber-500 to-orange-600"
              />
              <FeatureCard
                title="Governance & Safety"
                description="Implement guardrails, PII detection, and compliance frameworks"
                icon={<Shield className="h-6 w-6 text-white" />}
                gradient="from-green-500 to-emerald-600"
              />
              <FeatureCard
                title="LLMOps"
                description="Prompt versioning, evaluation pipelines, and production monitoring"
                icon={<Target className="h-6 w-6 text-white" />}
                gradient="from-rose-500 to-red-600"
              />
              <FeatureCard
                title="World Problems"
                description="Apply AI to climate, health, education, and economic challenges"
                icon={<Globe className="h-6 w-6 text-white" />}
                gradient="from-indigo-500 to-violet-600"
              />
            </div>
          </div>
        </section>

        {/* Learning Paths Section */}
        <section className="py-20 bg-slate-900/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">Learning Paths</h2>
                <p className="mt-2 text-slate-400">Structured journeys from beginner to expert</p>
              </div>
              <Link
                href="/paths/"
                className="hidden md:flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                View all paths
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredPaths.map((path) => (
                <Card
                  key={path.slug}
                  title={path.name}
                  description={path.description}
                  href={`/paths/${path.slug}/`}
                  category={pathCategories[path.category].name}
                  categoryColor={pathCategories[path.category].color}
                  meta={`${path.hours} hours • ${path.duration}`}
                  badge={path.slug === '100-hour-ai-architect' ? 'Popular' : undefined}
                />
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link
                href="/paths/"
                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                View all paths
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">Popular Skills</h2>
                <p className="mt-2 text-slate-400">80+ skills to master AI architecture</p>
              </div>
              <Link
                href="/skills/"
                className="hidden md:flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                View all skills
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredSkills.map((skill) => (
                <Card
                  key={skill.slug}
                  title={skill.name}
                  description={skill.description}
                  href={`/skills/${skill.slug}/`}
                  category={skillCategories[skill.category].name}
                  categoryColor={skillCategories[skill.category].color}
                  icon={<Code2 className="h-3 w-3" />}
                />
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link
                href="/skills/"
                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                View all skills
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Patterns Section */}
        <section className="py-20 bg-slate-900/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">Architecture Patterns</h2>
                <p className="mt-2 text-slate-400">Battle-tested patterns for production AI</p>
              </div>
              <Link
                href="/patterns/"
                className="hidden md:flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                View all patterns
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredPatterns.map((pattern) => (
                <Card
                  key={pattern.slug}
                  title={pattern.name}
                  description={pattern.description}
                  href={`/patterns/${pattern.slug}/`}
                  category={patternCategories[pattern.category].name}
                  categoryColor={patternCategories[pattern.category].color}
                />
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link
                href="/patterns/"
                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                View all patterns
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl bg-gradient-to-r from-purple-900/50 to-cyan-900/50 border border-purple-500/20 p-12 md:p-20 overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

              <div className="relative text-center">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                  Ready to Become an AI Architect?
                </h2>
                <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
                  Join thousands of developers learning to build production AI systems.
                  Start your journey today with our free 100-hour curriculum.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/paths/100-hour-ai-architect/"
                    className="group flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-slate-900 hover:bg-slate-100 transition-all"
                  >
                    <Rocket className="h-5 w-5" />
                    Start Learning Free
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/paths/"
                    className="flex items-center gap-2 rounded-xl border border-white/20 px-8 py-4 text-lg font-semibold text-white hover:bg-white/10 transition-all"
                  >
                    Browse All Paths
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
