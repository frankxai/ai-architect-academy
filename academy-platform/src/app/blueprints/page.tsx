'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Layers,
  Shield,
  Database,
  Network,
  Server,
  Settings,
  DollarSign,
  Activity,
  Building,
  Lock,
  BookOpen,
  Sparkles,
} from 'lucide-react'

import blueprintsData from '@/data/blueprints.json'
import type { ArchitecturePrototype, PrototypeCategory, CloudProvider, DifficultyLevel } from '@/types/ai-architecture'

const blueprints = blueprintsData as ArchitecturePrototype[]

// Icon mapping for categories
const categoryIcons: Record<PrototypeCategory, typeof Shield> = {
  'ai-gateway': Shield,
  'rag-production': Database,
  'multi-agent-orchestration': Network,
  'mcp-servers': Server,
  'llm-ops': Settings,
  'vector-databases': Layers,
  'ai-coe': Building,
  'security-governance': Lock,
  'cost-optimization': DollarSign,
  'observability': Activity,
}

// Difficulty badge colors
const difficultyColors: Record<DifficultyLevel, string> = {
  beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
  intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  advanced: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  expert: 'bg-red-500/20 text-red-400 border-red-500/30',
}

// Cloud provider colors
const cloudColors: Record<CloudProvider, string> = {
  aws: 'bg-orange-500/10 text-orange-400',
  gcp: 'bg-blue-500/10 text-blue-400',
  azure: 'bg-cyan-500/10 text-cyan-400',
  oci: 'bg-red-500/10 text-red-400',
  'multi-cloud': 'bg-violet-500/10 text-violet-400',
}

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

function BlueprintCard({ blueprint, index }: { blueprint: ArchitecturePrototype; index: number }) {
  const Icon = categoryIcons[blueprint.category] || Layers

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/blueprints/${blueprint.slug}`} className="group block h-full">
        <div className="relative flex h-full flex-col rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/40 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-cyan-500/10">
          {/* Type badge */}
          <div className="absolute -right-2 -top-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-2.5 py-0.5 text-[10px] font-semibold uppercase text-white shadow-lg">
            Blueprint
          </div>

          {/* Icon and category */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400">
              <Icon className="h-6 w-6" />
            </div>
            <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${difficultyColors[blueprint.difficulty]}`}>
              {DIFFICULTY_NAMES[blueprint.difficulty]}
            </span>
          </div>

          {/* Title and subtitle */}
          <h3 className="mb-2 text-lg font-bold text-white group-hover:text-cyan-100">
            {blueprint.title}
          </h3>
          <p className="mb-4 text-sm text-slate-400 line-clamp-2">{blueprint.subtitle}</p>

          {/* Cloud providers */}
          <div className="mb-4 flex flex-wrap gap-1">
            {blueprint.cloudProviders.slice(0, 3).map((provider) => (
              <span
                key={provider}
                className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${cloudColors[provider]}`}
              >
                {CLOUD_NAMES[provider]}
              </span>
            ))}
            {blueprint.cloudProviders.length > 3 && (
              <span className="rounded px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                +{blueprint.cloudProviders.length - 3}
              </span>
            )}
          </div>

          {/* Technologies */}
          <div className="mb-4 flex flex-wrap gap-1">
            {blueprint.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-slate-400"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
            {blueprint.estimatedCost && (
              <span className="text-xs text-slate-500">
                ~${blueprint.estimatedCost.monthly.toLocaleString()}/mo
              </span>
            )}
            <div className="flex items-center gap-1 text-slate-400 group-hover:text-cyan-400 transition-colors">
              <span className="text-xs font-medium">Explore</span>
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function BlueprintsPage() {
  const publishedBlueprints = blueprints.filter((b) => b.status === 'published')

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="mx-auto max-w-6xl px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-4 py-1.5 mb-6">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-400 font-medium">Interactive Architecture Blueprints</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent">
              AI Architecture Blueprints
            </h1>

            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
              Production-ready architecture patterns with interactive diagrams, implementation guides,
              and realistic cost estimates. Cloud-agnostic designs that work anywhere.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>{publishedBlueprints.length} Blueprints</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Drag & Explore</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <DollarSign className="w-4 h-4 text-amber-400" />
                <span>Cost Estimates</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blueprints Grid */}
      <section className="pb-24">
        <div className="mx-auto max-w-6xl px-6">
          {publishedBlueprints.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {publishedBlueprints.map((blueprint, index) => (
                <BlueprintCard key={blueprint.id} blueprint={blueprint} index={index} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
              <BookOpen className="mx-auto mb-4 h-12 w-12 text-slate-500" />
              <h3 className="mb-2 text-lg font-semibold text-white">Coming Soon</h3>
              <p className="text-slate-400">
                Architecture blueprints are being prepared. Check back soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-white/5">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-4 text-2xl font-bold text-white">Need Custom Architecture?</h2>
          <p className="mb-6 text-slate-400">
            Book a consultation to design architectures tailored to your specific requirements.
          </p>
          <Link
            href="/offering"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/25"
          >
            View Services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}
