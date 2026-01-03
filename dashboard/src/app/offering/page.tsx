'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Code2,
  Cloud,
  Sparkles,
  Users,
  Building2,
  GitBranch,
  Bot,
  Shield,
  Zap,
  Globe,
  Heart,
  GraduationCap,
  Leaf,
  DollarSign,
  ChevronRight,
  Check,
  ExternalLink
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const tiers = [
  {
    name: 'Open Source',
    layer: 'LAYER 1',
    price: 'Free',
    priceDetail: 'MIT License',
    description: 'Free patterns, templates, and workflows for the community',
    color: 'from-green-500 to-emerald-500',
    icon: GitBranch,
    features: [
      '200+ Architecture Patterns',
      'Professional Templates',
      'Learning Paths (100+ hours)',
      'Agent Workflows',
      'Governance Frameworks',
      'Community Support'
    ],
    cta: 'View on GitHub',
    href: 'https://github.com/frankxai/ai-architect-academy'
  },
  {
    name: 'SaaS Platform',
    layer: 'LAYER 2',
    price: '$29-99',
    priceDetail: '/month',
    description: 'Full-featured dashboard with agent orchestration',
    color: 'from-purple-500 to-pink-500',
    icon: Bot,
    recommended: true,
    features: [
      '8 Specialized AI Agents',
      'Visual Architecture Builder',
      'Three-Sided Marketplace',
      'Portfolio Certifications',
      'Analytics Dashboard',
      '70% Creator Revenue Share'
    ],
    cta: 'Start Building',
    href: '/agents'
  },
  {
    name: 'Enterprise',
    layer: 'LAYER 3',
    price: 'Custom',
    priceDetail: 'Contact us',
    description: 'Custom solutions and strategic partnerships',
    color: 'from-amber-500 to-orange-500',
    icon: Building2,
    features: [
      'Team Licenses',
      'Custom Training Programs',
      'Private Pattern Libraries',
      'Hiring Pipeline Access',
      'White-Label Options',
      'Dedicated Support'
    ],
    cta: 'Contact Sales',
    href: 'mailto:frank@aiarchitectacademy.com'
  }
];

const skillCategories = [
  {
    name: 'AI Architecture',
    count: 16,
    icon: Brain,
    color: 'bg-cyan-500/20 text-cyan-400',
    skills: ['oracle-adk', 'mcp-architecture', 'rag-expert', 'claude-sdk', 'langgraph-patterns']
  },
  {
    name: 'Cloud & Infrastructure',
    count: 12,
    icon: Cloud,
    color: 'bg-blue-500/20 text-blue-400',
    skills: ['oci-services', 'multi-cloud', 'terraform', 'kubernetes', 'devops']
  },
  {
    name: 'Creative & Content',
    count: 20,
    icon: Sparkles,
    color: 'bg-pink-500/20 text-pink-400',
    skills: ['suno-ai', 'book-writing', 'arcanea-lore', 'brand', 'video-production']
  },
  {
    name: 'Personal Development',
    count: 25,
    icon: Users,
    color: 'bg-amber-500/20 text-amber-400',
    skills: ['philosopher', 'spartan', 'nutrition', 'soulbook-pillars', 'daily-execution']
  }
];

const agentDepartments = [
  {
    name: 'Cloud Infrastructure',
    count: 11,
    color: 'from-blue-500 to-cyan-500',
    agents: ['OCI-Compute', 'OCI-Network', 'AWS-Expert', 'Azure-Expert', 'GCP-Expert', 'Terraform', 'Kubernetes']
  },
  {
    name: 'AI & Machine Learning',
    count: 11,
    color: 'from-purple-500 to-pink-500',
    agents: ['GenAI-Architect', 'RAG-Specialist', 'Agent-Architect', 'MCP-Developer', 'Fine-Tuning', 'MLOps']
  },
  {
    name: 'Enterprise Architecture',
    count: 9,
    color: 'from-amber-500 to-orange-500',
    agents: ['Security-Architect', 'Compliance', 'API-Architect', 'Cost-Optimizer', 'Data-Privacy']
  },
  {
    name: 'Solution Delivery',
    count: 10,
    color: 'from-green-500 to-emerald-500',
    agents: ['Python-Dev', 'TypeScript-Dev', 'QA-Agent', 'Security-Tester', 'SRE-Agent']
  }
];

const worldProblems = [
  { name: 'Climate AI', icon: Leaf, color: 'text-green-400 border-green-500/30', desc: 'Carbon modeling, optimization' },
  { name: 'Health AI', icon: Heart, color: 'text-red-400 border-red-500/30', desc: 'Drug discovery, diagnostics' },
  { name: 'Education AI', icon: GraduationCap, color: 'text-blue-400 border-blue-500/30', desc: 'Adaptive learning' },
  { name: 'Economic AI', icon: DollarSign, color: 'text-amber-400 border-amber-500/30', desc: 'Resource allocation' }
];

export default function OfferingPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Architect Academy</h1>
              <p className="text-xs text-slate-400">Complete Offering</p>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/'}>
              Dashboard
            </Button>
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/agents'}>
              Agents
            </Button>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              GitHub
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            80+ Skills | 60+ Agents | 200+ Patterns
          </div>
          <h1 className="text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Complete AI Architecture Ecosystem
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Enterprise AI education, AGI research, and tools to solve humanity&apos;s greatest challenges
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8">
            <TabsTrigger value="overview">Tiers</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="agi">AGI Research</TabsTrigger>
          </TabsList>

          {/* Tiers Tab */}
          <TabsContent value="overview">
            <div className="grid md:grid-cols-3 gap-8">
              {tiers.map((tier, i) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className={`relative p-8 bg-slate-900 border-slate-800 hover:border-purple-500/50 transition-all ${tier.recommended ? 'ring-2 ring-purple-500' : ''}`}>
                    {tier.recommended && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-xs font-bold">
                        RECOMMENDED
                      </div>
                    )}
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-6`}>
                      <tier.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-slate-500 mb-1">{tier.layer}</div>
                    <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                    <p className="text-slate-400 text-sm mb-6">{tier.description}</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-white">{tier.price}</span>
                      <span className="text-slate-400 text-sm ml-2">{tier.priceDetail}</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3 text-sm text-slate-300">
                          <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${tier.recommended ? 'bg-gradient-to-r from-purple-500 to-pink-500' : ''}`}
                      variant={tier.recommended ? 'default' : 'outline'}
                      onClick={() => window.open(tier.href, '_blank')}
                    >
                      {tier.cta}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills">
            <div className="grid md:grid-cols-2 gap-6">
              {skillCategories.map((cat, i) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="p-6 bg-slate-900 border-slate-800">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center`}>
                        <cat.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{cat.name}</h3>
                        <p className="text-sm text-slate-400">{cat.count} skills</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cat.skills.map((skill) => (
                        <span
                          key={skill}
                          className={`px-3 py-1 rounded-full text-xs ${cat.color}`}
                        >
                          {skill}
                        </span>
                      ))}
                      <span className="px-3 py-1 rounded-full text-xs bg-slate-800 text-slate-400">
                        +{cat.count - cat.skills.length} more
                      </span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <h3 className="text-xl font-bold text-white mb-4">Skills Usage</h3>
              <p className="text-slate-400 mb-4">
                Skills are invoked via Claude Code slash commands or automatically selected based on task context.
              </p>
              <code className="block p-4 rounded-lg bg-slate-900 text-sm text-cyan-400">
                /oracle-adk &quot;Build a multi-agent customer service system on OCI&quot;
              </code>
            </div>
          </TabsContent>

          {/* Agents Tab */}
          <TabsContent value="agents">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {agentDepartments.map((dept, i) => (
                <motion.div
                  key={dept.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="p-6 bg-slate-900 border-slate-800">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${dept.color} flex items-center justify-center`}>
                        <Bot className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{dept.name}</h3>
                        <p className="text-sm text-slate-400">{dept.count} agents</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {dept.agents.map((agent) => (
                        <div
                          key={agent}
                          className="px-3 py-2 rounded-lg bg-slate-800 text-sm text-slate-300"
                        >
                          {agent}
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Dashboard Agents */}
            <Card className="p-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
              <h3 className="text-2xl font-bold text-white text-center mb-6">Dashboard Agent System</h3>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                {['Pattern Builder', 'QA Agent', 'Documentation', 'Architecture', 'Learning', 'Optimizer', 'GitHub', 'Compliance'].map((agent) => (
                  <div key={agent} className="p-4 rounded-xl bg-slate-900/50 text-center">
                    <Bot className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                    <p className="text-xs text-slate-300">{agent}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button onClick={() => window.location.href = '/agents'}>
                  Open Agent Dashboard
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* AGI Research Tab */}
          <TabsContent value="agi">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-sm font-semibold mb-4">
                <Globe className="w-4 h-4 text-purple-400" />
                NEW MISSION
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">AGI Research & World Problems</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Evolving beyond enterprise AI to accelerate AGI research and solve humanity&apos;s greatest challenges
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* AGI Research */}
              <Card className="p-8 bg-slate-900 border-slate-800">
                <div className="flex items-center gap-3 mb-6">
                  <Brain className="w-8 h-8 text-purple-400" />
                  <h3 className="text-xl font-bold text-white">AGI Research Track</h3>
                </div>
                <div className="space-y-4">
                  {['Agent Architectures for General Intelligence', 'Alignment Research & Safety', 'Self-Improvement Systems', 'Multi-Agent Coordination'].map((item) => (
                    <div key={item} className="p-4 rounded-lg bg-slate-800">
                      <p className="text-slate-300">{item}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* World Problems */}
              <Card className="p-8 bg-slate-900 border-slate-800">
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="w-8 h-8 text-cyan-400" />
                  <h3 className="text-xl font-bold text-white">World Problem Tracks</h3>
                </div>
                <div className="space-y-4">
                  {worldProblems.map((problem) => (
                    <div key={problem.name} className={`p-4 rounded-lg bg-slate-800 border ${problem.color}`}>
                      <div className="flex items-center gap-3">
                        <problem.icon className={`w-5 h-5 ${problem.color.split(' ')[0]}`} />
                        <div>
                          <p className="font-semibold text-white">{problem.name}</p>
                          <p className="text-sm text-slate-400">{problem.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Mission Statement */}
            <div className="p-8 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-center">
              <p className="text-sm text-purple-400 font-semibold mb-2">New Mission Statement</p>
              <p className="text-xl text-white italic">
                &quot;Democratize AI architecture education and accelerate AGI research for solving humanity&apos;s greatest challenges&quot;
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-8 py-12 border-t border-slate-800">
          {[
            { value: '200+', label: 'Patterns' },
            { value: '80+', label: 'Skills' },
            { value: '60+', label: 'Agents' },
            { value: '100+', label: 'Learning Hours' },
            { value: '5', label: 'Workflows' }
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
