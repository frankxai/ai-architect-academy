'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Code2,
  Sparkles,
  Layers,
  Terminal,
  BookOpen,
  Zap,
  Bot,
  Database,
  Cloud,
  GitBranch,
  ArrowRight,
  Globe,
  Shield,
  Cpu,
  Network,
  Rocket,
  Target,
  TrendingUp,
  Users,
  GraduationCap,
  Lightbulb
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Bot,
    title: 'Agent Orchestration',
    description: '60+ specialized AI agents organized into departments for complex multi-step workflows',
    color: 'from-cyan-500 to-blue-600',
    href: '/agents',
    stats: '60+ Agents'
  },
  {
    icon: Sparkles,
    title: 'Skills Catalog',
    description: 'Domain-specific expertise modules that enhance Claude Code capabilities',
    color: 'from-purple-500 to-pink-600',
    href: '/skills',
    stats: '80+ Skills'
  },
  {
    icon: Brain,
    title: 'AGI Research Hub',
    description: 'Alignment research, safety frameworks, and world model development tools',
    color: 'from-pink-500 to-rose-600',
    href: '/agi-research',
    stats: '6 Tracks'
  },
  {
    icon: Layers,
    title: 'Complete Offering',
    description: 'Three-tier ecosystem: Open Source, SaaS Platform, and Enterprise solutions',
    color: 'from-amber-500 to-orange-600',
    href: '/offering',
    stats: '3 Tiers'
  }
];

const patterns = [
  { name: 'Multi-Agent Orchestration', icon: Network, desc: 'Coordinate specialized agents' },
  { name: 'AI Gateway', icon: Shield, desc: 'Centralized multi-provider routing' },
  { name: 'RAG Production', icon: Database, desc: 'Semantic search & reranking' },
  { name: 'LLMOps', icon: Cpu, desc: 'Prompt management & monitoring' }
];

const worldProblems = [
  { name: 'Climate AI', color: 'from-green-400 to-emerald-500', hours: '100h' },
  { name: 'Health AI', color: 'from-red-400 to-rose-500', hours: '120h' },
  { name: 'Education AI', color: 'from-blue-400 to-indigo-500', hours: '100h' },
  { name: 'Economic AI', color: 'from-amber-400 to-orange-500', hours: '100h' }
];

const stats = [
  { label: 'Skills', value: '80+', icon: Sparkles, color: 'text-purple-400' },
  { label: 'Agents', value: '60+', icon: Bot, color: 'text-cyan-400' },
  { label: 'Patterns', value: '200+', icon: Layers, color: 'text-pink-400' },
  { label: 'Hours', value: '500+', icon: BookOpen, color: 'text-amber-400' }
];

export default function Home() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-cyan-500/10 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-lg opacity-50" />
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Brain className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold">AI Architect Academy</h1>
                <p className="text-xs text-slate-400">Command Center for Visionary Builders</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-2">
              {[
                { label: 'Agents', href: '/agents', icon: Bot },
                { label: 'Skills', href: '/skills', icon: Sparkles },
                { label: 'AGI Research', href: '/agi-research', icon: Brain },
                { label: 'Offering', href: '/offering', icon: Layers }
              ].map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  size="sm"
                  className="text-slate-300 hover:text-white hover:bg-slate-800"
                  onClick={() => window.location.href = item.href}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              ))}
              <Button
                size="sm"
                className="ml-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Rocket className="w-4 h-4 mr-2" />
                Get Started
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-6 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-sm mb-8">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300">80+ Skills | 60+ Agents | 200+ Patterns</span>
            </div>

            <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Design, Ship & Operate
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                AI Systems
              </span>
            </h2>

            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              The complete playbook for enterprise AI architecture, AGI research, and solving humanity&apos;s greatest challenges
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8"
                onClick={() => window.location.href = '/agents'}
              >
                <Bot className="w-5 h-5 mr-2" />
                Explore Agents
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-700 hover:bg-slate-800 text-lg px-8"
                onClick={() => window.open('https://github.com/frankxai/ai-architect-academy', '_blank')}
              >
                <GitBranch className="w-5 h-5 mr-2" />
                View on GitHub
              </Button>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {stats.map((stat, i) => (
              <Card key={stat.label} className="p-6 bg-slate-900/50 border-slate-800 backdrop-blur-sm text-center">
                <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </Card>
            ))}
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold mb-4">Core Capabilities</h3>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Everything you need to architect, build, and deploy production AI systems
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                onClick={() => window.location.href = feature.href}
                className="cursor-pointer"
              >
                <Card className={`relative p-8 bg-slate-900/50 border-slate-800 hover:border-purple-500/50 transition-all duration-300 overflow-hidden ${hoveredFeature === index ? 'scale-[1.02]' : ''}`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity duration-300 ${hoveredFeature === index ? 'opacity-5' : ''}`} />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                        <feature.icon className="w-7 h-7 text-white" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-300">
                        {feature.stats}
                      </span>
                    </div>

                    <h4 className="text-2xl font-bold mb-3 text-white">{feature.title}</h4>
                    <p className="text-slate-400 mb-6">{feature.description}</p>

                    <div className="flex items-center text-purple-400 font-medium">
                      <span>Explore</span>
                      <ArrowRight className={`w-4 h-4 ml-2 transition-transform ${hoveredFeature === index ? 'translate-x-2' : ''}`} />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Enterprise Patterns */}
        <section className="container mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold mb-6">Enterprise AI Patterns</h3>
              <p className="text-slate-400 mb-8">
                Production-ready architecture patterns for building scalable, secure, and maintainable AI systems
              </p>

              <div className="space-y-4">
                {patterns.map((pattern, i) => (
                  <div key={pattern.name} className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-purple-500/30 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                      <pattern.icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">{pattern.name}</div>
                      <div className="text-sm text-slate-400">{pattern.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="w-8 h-8 text-purple-400" />
                  <h4 className="text-2xl font-bold">World Problems AI</h4>
                </div>
                <p className="text-slate-300 mb-6">
                  Apply AI to solve humanity&apos;s greatest challenges with specialized learning tracks
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {worldProblems.map((problem) => (
                    <div key={problem.name} className={`p-4 rounded-lg bg-gradient-to-r ${problem.color} bg-opacity-10 border border-white/10`}>
                      <div className="font-semibold text-white">{problem.name}</div>
                      <div className="text-sm text-white/70">{problem.hours}</div>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500"
                  onClick={() => window.location.href = '/agi-research'}
                >
                  Start Learning
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="container mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-12 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 border-purple-500/20 text-center">
              <Target className="w-12 h-12 mx-auto mb-6 text-purple-400" />
              <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto italic">
                &quot;Democratize AI architecture education and accelerate AGI research for solving humanity&apos;s greatest challenges&quot;
              </p>

              <div className="flex justify-center gap-8 mt-10">
                <div className="text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
                  <div className="text-2xl font-bold text-white">10K+</div>
                  <div className="text-sm text-slate-400">Learners</div>
                </div>
                <div className="text-center">
                  <GraduationCap className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                  <div className="text-2xl font-bold text-white">500+</div>
                  <div className="text-sm text-slate-400">Hours Content</div>
                </div>
                <div className="text-center">
                  <Lightbulb className="w-8 h-8 mx-auto mb-2 text-pink-400" />
                  <div className="text-2xl font-bold text-white">200+</div>
                  <div className="text-sm text-slate-400">Patterns</div>
                </div>
              </div>
            </Card>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-16 mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Card className="relative overflow-hidden p-12 bg-gradient-to-r from-purple-600 to-pink-600 border-0">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">Ready to architect the future?</h3>
                  <p className="text-purple-100">Join thousands of AI architects building the next generation of intelligent systems</p>
                </div>

                <div className="flex gap-4">
                  <Button
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-purple-50"
                    onClick={() => window.location.href = '/offering'}
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Get Started
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                    onClick={() => window.open('https://github.com/frankxai/ai-architect-academy', '_blank')}
                  >
                    View GitHub
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 bg-slate-950">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6 text-purple-400" />
              <span className="font-semibold">AI Architect Academy</span>
            </div>
            <p className="text-sm text-slate-500">
              Open Source | MIT License | Building the future of AI
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <GitBranch className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <Globe className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
