import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronLeft,
  Clock,
  DollarSign,
  ExternalLink,
  BookOpen,
  Code,
  Layers,
} from 'lucide-react'

import blueprintsData from '@/data/blueprints.json'
import type { ArchitecturePrototype, CloudProvider, DifficultyLevel } from '@/types/ai-architecture'
import { BlueprintDiagramWrapper } from '@/components/blueprints/BlueprintDiagramWrapper'

const blueprints = blueprintsData as ArchitecturePrototype[]

const CLOUD_NAMES: Record<CloudProvider, string> = {
  aws: 'AWS',
  gcp: 'GCP',
  azure: 'Azure',
  oci: 'OCI',
  'multi-cloud': 'Multi-Cloud',
}

const DIFFICULTY_NAMES: Record<DifficultyLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
}

const CATEGORY_NAMES: Record<string, string> = {
  'ai-gateway': 'AI Gateway',
  'rag-production': 'RAG Production',
  'multi-agent-orchestration': 'Multi-Agent Orchestration',
  'mcp-servers': 'MCP Servers',
  'llm-ops': 'LLM Operations',
  'vector-databases': 'Vector Databases',
  'ai-coe': 'AI Center of Excellence',
  'security-governance': 'Security & Governance',
  'cost-optimization': 'Cost Optimization',
  'observability': 'Observability',
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return blueprints.map((b) => ({ slug: b.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const blueprint = blueprints.find((b) => b.slug === slug)
  if (!blueprint) return { title: 'Blueprint Not Found' }

  return {
    title: `${blueprint.title} | AI Architect Academy`,
    description: blueprint.metaDescription || blueprint.subtitle,
  }
}

export default async function BlueprintPage({ params }: Props) {
  const { slug } = await params
  const blueprint = blueprints.find((b) => b.slug === slug)

  if (!blueprint) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <section className="pt-24 pb-12 border-b border-white/5">
        <div className="mx-auto max-w-5xl px-6">
          <Link
            href="/blueprints"
            className="mb-6 inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            All Blueprints
          </Link>

          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 px-3 py-1 text-xs font-semibold text-cyan-400">
              BLUEPRINT
            </span>
            <span className="text-sm text-slate-500">
              {CATEGORY_NAMES[blueprint.category] || blueprint.category}
            </span>
          </div>

          <h1 className="mb-4 text-4xl md:text-5xl font-bold text-white">{blueprint.title}</h1>
          <p className="mb-6 text-lg text-slate-400">{blueprint.subtitle}</p>

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 text-sm">
            <span className={`rounded-full border px-3 py-1 ${
              blueprint.difficulty === 'beginner' ? 'border-green-500/30 text-green-400 bg-green-500/10' :
              blueprint.difficulty === 'intermediate' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' :
              blueprint.difficulty === 'advanced' ? 'border-orange-500/30 text-orange-400 bg-orange-500/10' :
              'border-red-500/30 text-red-400 bg-red-500/10'
            }`}>
              {DIFFICULTY_NAMES[blueprint.difficulty]}
            </span>
            {blueprint.timeToImplement && (
              <span className="flex items-center gap-1 text-slate-400 bg-white/5 rounded-full px-3 py-1">
                <Clock className="h-4 w-4" />
                {blueprint.timeToImplement}
              </span>
            )}
            {blueprint.estimatedCost && (
              <span className="flex items-center gap-1 text-slate-400 bg-white/5 rounded-full px-3 py-1">
                <DollarSign className="h-4 w-4" />
                ~${blueprint.estimatedCost.monthly.toLocaleString()}/mo
              </span>
            )}
          </div>

          {/* Cloud providers */}
          <div className="mt-6 flex flex-wrap gap-2">
            {blueprint.cloudProviders.map((provider) => (
              <span
                key={provider}
                className="rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-sm text-slate-300"
              >
                {CLOUD_NAMES[provider]}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-6">
          {/* Problem & Solution */}
          <div className="mb-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/5 to-red-500/10 p-6">
              <h3 className="mb-3 text-lg font-semibold text-red-400">The Problem</h3>
              <p className="text-slate-300 leading-relaxed">{blueprint.problem}</p>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 p-6">
              <h3 className="mb-3 text-lg font-semibold text-emerald-400">The Solution</h3>
              <p className="text-slate-300 leading-relaxed">{blueprint.solution}</p>
            </div>
          </div>

          {/* Overview */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <h2 className="text-2xl font-bold text-white">Overview</h2>
            </div>
            <p className="text-slate-300 leading-relaxed text-lg">{blueprint.overview}</p>
          </div>

          {/* Interactive Architecture Diagram */}
          {blueprint.architecture.components.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5 text-cyan-400" />
                <h2 className="text-2xl font-bold text-white">Interactive Architecture</h2>
              </div>
              <BlueprintDiagramWrapper
                components={blueprint.architecture.components}
                flows={blueprint.architecture.flows}
                title={`${blueprint.title} Architecture`}
              />
            </div>
          )}

          {/* Components */}
          {blueprint.architecture.components.length > 0 && (
            <div className="mb-12">
              <h2 className="mb-4 text-2xl font-bold text-white">Components</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {blueprint.architecture.components.map((component) => (
                  <div
                    key={component.id}
                    className="rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/[0.07] transition-colors"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="font-semibold text-white">{component.name}</h4>
                      <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 text-xs text-cyan-400">
                        {component.type}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">{component.description}</p>
                    {component.cloudService && (
                      <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        {component.cloudService}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Implementation Steps */}
          {blueprint.implementationSteps.length > 0 && (
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-white">Implementation Roadmap</h2>
              <div className="space-y-6">
                {blueprint.implementationSteps.map((step, idx) => (
                  <div key={step.phase} className="relative">
                    {idx < blueprint.implementationSteps.length - 1 && (
                      <div className="absolute left-4 top-14 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500/50 to-transparent" />
                    )}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                      <div className="mb-4 flex items-center gap-4">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-sm font-bold text-white shadow-lg shadow-cyan-500/25">
                          {step.phase}
                        </span>
                        <div>
                          <h4 className="font-semibold text-white text-lg">{step.title}</h4>
                          {step.estimatedDuration && (
                            <p className="text-xs text-slate-500">{step.estimatedDuration}</p>
                          )}
                        </div>
                      </div>
                      <p className="mb-4 text-slate-400">{step.description}</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="mb-2 text-xs font-semibold uppercase text-slate-500">Tasks</h5>
                          <ul className="space-y-1">
                            {step.tasks.map((task, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                <span className="mt-2 h-1 w-1 rounded-full bg-cyan-500" />
                                {task}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="mb-2 text-xs font-semibold uppercase text-slate-500">Deliverables</h5>
                          <div className="flex flex-wrap gap-2">
                            {step.deliverables.map((d, i) => (
                              <span key={i} className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 text-xs text-emerald-400">
                                {d}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Code Examples */}
          {blueprint.codeExamples.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <Code className="w-5 h-5 text-cyan-400" />
                <h2 className="text-2xl font-bold text-white">Code Examples</h2>
              </div>
              <div className="space-y-6">
                {blueprint.codeExamples.map((example) => (
                  <div key={example.id} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/10 bg-white/5">
                      <h4 className="font-semibold text-white">{example.title}</h4>
                      {example.description && (
                        <p className="mt-1 text-sm text-slate-400">{example.description}</p>
                      )}
                    </div>
                    <pre className="overflow-x-auto p-6 text-sm text-slate-300 bg-black/30">
                      <code>{example.code}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cost Breakdown */}
          {blueprint.estimatedCost && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-amber-400" />
                <h2 className="text-2xl font-bold text-white">Cost Estimate</h2>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="mb-6 flex items-center gap-6">
                  <div>
                    <p className="text-4xl font-bold text-white">
                      ${blueprint.estimatedCost.monthly.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-500">per month</p>
                  </div>
                  <div className="text-slate-600">|</div>
                  <div>
                    <p className="text-2xl font-bold text-slate-300">
                      ${blueprint.estimatedCost.annual.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-500">per year</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {blueprint.estimatedCost.breakdown.map((item) => (
                    <div key={item.category} className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">{item.category}</span>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-32 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="w-20 text-right text-sm text-slate-400">
                          ${item.amount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {blueprint.estimatedCost.assumptions && (
                  <div className="mt-4 border-t border-white/5 pt-4">
                    <p className="text-xs text-slate-500">
                      Assumptions: {blueprint.estimatedCost.assumptions.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Technologies */}
          <div className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-white">Technologies</h2>
            <div className="flex flex-wrap gap-2">
              {blueprint.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/10 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Use Cases */}
          {blueprint.useCases.length > 0 && (
            <div className="mb-12">
              <h2 className="mb-4 text-2xl font-bold text-white">Use Cases</h2>
              <div className="flex flex-wrap gap-2">
                {blueprint.useCases.map((useCase, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-2 text-sm text-cyan-300"
                  >
                    {useCase}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-white/5">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-4 text-2xl font-bold text-white">Ready to Implement?</h2>
          <p className="mb-6 text-slate-400">
            Get expert guidance to implement this architecture in your organization.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/offering"
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/25"
            >
              Book Consultation
            </Link>
            <Link
              href="/blueprints"
              className="flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition-all hover:bg-white/10"
            >
              Explore More Blueprints
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
