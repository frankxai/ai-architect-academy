'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Sparkles,
  Users,
  Building2,
  GitBranch,
  Bot,
  Zap,
  Globe,
  GraduationCap,
  ArrowRight,
  Rocket,
  Target,
  TrendingUp,
  Code2,
  Briefcase,
  DollarSign,
  Award,
  Layers,
  CheckCircle2,
  CircleDot,
  Play,
  Trophy,
  Heart
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const personas = [
  {
    id: 'student',
    title: 'Student',
    subtitle: 'The Aspiring Builder',
    icon: GraduationCap,
    color: 'from-cyan-500 to-blue-600',
    painPoint: 'Tired of theory-only courses with no portfolio',
    solution: 'Every module = deployed system with live URL',
    journey: [
      { step: 'Learn', desc: 'Follow structured learning paths' },
      { step: 'Build', desc: 'Deploy real AI systems' },
      { step: 'Portfolio', desc: 'Showcase live deployments' },
      { step: 'Career', desc: 'Get hired with proof of work' }
    ],
    outcome: 'From learner to employed AI engineer',
    testimonial: '"I deployed 12 AI systems in 3 months. Got hired by Stripe as AI Engineer. My portfolio spoke louder than my resume."',
    stats: { deployments: '12+', timeframe: '3 months', outcome: 'Hired' }
  },
  {
    id: 'architect',
    title: 'Architect',
    subtitle: 'The System Designer',
    icon: Layers,
    color: 'from-purple-500 to-pink-600',
    painPoint: 'Building systems but lacking credible certification',
    solution: 'Certification = portfolio of production systems',
    journey: [
      { step: 'Master', desc: 'Learn advanced patterns' },
      { step: 'Certify', desc: 'Earn verified credentials' },
      { step: 'Consult', desc: 'Build for clients' },
      { step: 'Teach', desc: 'Become a Professor' }
    ],
    outcome: 'From engineer to trusted expert',
    testimonial: '"I built a HIPAA-compliant RAG system for clients. Turned it into a pattern. Now earning $3k/month passive income while consulting."',
    stats: { patterns: '5+', revenue: '$3k/mo', clients: '10+' }
  },
  {
    id: 'professor',
    title: 'Professor',
    subtitle: 'The Knowledge Creator',
    icon: Award,
    color: 'from-amber-500 to-orange-600',
    painPoint: 'Has expertise but can\'t monetize at scale',
    solution: 'Create once, earn 70% revenue forever',
    journey: [
      { step: 'Create', desc: 'Build patterns & workshops' },
      { step: 'Publish', desc: 'List on marketplace' },
      { step: 'Earn', desc: '70% revenue share' },
      { step: 'Scale', desc: '1-to-many impact' }
    ],
    outcome: 'From expert to passive income earner',
    testimonial: '"My enterprise RAG pattern sold 500+ copies. I now earn while I sleep. The platform handles everything."',
    stats: { sales: '500+', monthly: '$8k', rating: '4.9/5' }
  },
  {
    id: 'enterprise',
    title: 'Enterprise',
    subtitle: 'The Talent Seeker',
    icon: Building2,
    color: 'from-green-500 to-emerald-600',
    painPoint: 'Can\'t find AI talent; training is theoretical',
    solution: 'Hire architects with proven deployed systems',
    journey: [
      { step: 'Source', desc: 'Access verified talent pool' },
      { step: 'Validate', desc: 'Review live portfolios' },
      { step: 'Train', desc: 'Custom team programs' },
      { step: 'Hire', desc: 'Zero bad hires' }
    ],
    outcome: 'From talent shortage to dream team',
    testimonial: '"We hired 10 architects from the platform. Every single one had production systems in their portfolio. Zero bad hires."',
    stats: { hires: '10', success: '100%', savings: '$50k+' }
  }
];

const flywheel = [
  { label: 'Students Learn', icon: GraduationCap, color: 'text-cyan-400' },
  { label: 'Systems Deployed', icon: Rocket, color: 'text-purple-400' },
  { label: 'Patterns Improve', icon: TrendingUp, color: 'text-pink-400' },
  { label: 'Professors Earn', icon: DollarSign, color: 'text-amber-400' },
  { label: 'Agents Test 24/7', icon: Bot, color: 'text-green-400' },
  { label: 'Quality Rises', icon: Trophy, color: 'text-cyan-400' }
];

const uniqueAdvantages = [
  {
    title: 'Deploy to Learn',
    desc: 'Every certification = deployed system. Portfolios beat certificates.',
    icon: Rocket,
    color: 'from-cyan-500 to-blue-500'
  },
  {
    title: 'Agent Workforce',
    desc: '1000s of AI agents testing patterns 24/7. Quality improves automatically.',
    icon: Bot,
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: '70% Creator Revenue',
    desc: 'Best in industry. Professors earn passive income from expertise.',
    icon: DollarSign,
    color: 'from-amber-500 to-orange-500'
  },
  {
    title: 'Three-Sided Marketplace',
    desc: 'Students, Professors, Enterprises. Network effects compound.',
    icon: Users,
    color: 'from-green-500 to-emerald-500'
  }
];

export default function VisionPage() {
  const [activePersona, setActivePersona] = useState('student');
  const currentPersona = personas.find(p => p.id === activePersona)!;

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
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.location.href = '/'}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-lg opacity-50" />
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Brain className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold">AI Architect Academy</h1>
                <p className="text-xs text-slate-400">Our Vision</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-2">
              {[
                { label: 'Dashboard', href: '/', icon: Layers },
                { label: 'Agents', href: '/agents', icon: Bot },
                { label: 'Skills', href: '/skills', icon: Sparkles },
                { label: 'AGI Research', href: '/agi-research', icon: Brain },
                { label: 'Offering', href: '/offering', icon: Briefcase }
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
              <Heart className="w-4 h-4 text-pink-400" />
              <span className="text-purple-300">For Humans and Agents, Together</span>
            </div>

            <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Learn. Build. Deploy.
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Earn.
              </span>
            </h2>

            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              The platform that transforms how you learn AI architecture, build production systems, and monetize your expertise
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8"
                onClick={() => window.location.href = '/offering'}
              >
                <Rocket className="w-5 h-5 mr-2" />
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-700 hover:bg-slate-800 text-lg px-8"
                onClick={() => window.open('https://github.com/frankxai/ai-architect-academy', '_blank')}
              >
                <GitBranch className="w-5 h-5 mr-2" />
                Explore Open Source
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Mission Statement */}
        <section className="container mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Card className="p-12 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 border-purple-500/20 text-center">
              <Target className="w-12 h-12 mx-auto mb-6 text-purple-400" />
              <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
              <p className="text-2xl text-slate-300 max-w-4xl mx-auto italic leading-relaxed">
                &quot;Democratize AI architecture education and accelerate AGI research for solving humanity&apos;s greatest challenges&quot;
              </p>
            </Card>
          </motion.div>
        </section>

        {/* Who We Help - Persona Selector */}
        <section className="container mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-4xl font-bold mb-4">Who We Help</h3>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Every persona has a unique journey. Select yours to see how we transform your path.
            </p>
          </motion.div>

          {/* Persona Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {personas.map((persona) => (
              <button
                key={persona.id}
                onClick={() => setActivePersona(persona.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 ${
                  activePersona === persona.id
                    ? `bg-gradient-to-r ${persona.color} text-white shadow-lg scale-105`
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700'
                }`}
              >
                <persona.icon className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-bold">{persona.title}</div>
                  <div className="text-sm opacity-80">{persona.subtitle}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Active Persona Detail */}
          <motion.div
            key={activePersona}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8 md:p-12 bg-slate-900/80 border-slate-800 backdrop-blur-sm">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Left Column - Problem & Solution */}
                <div>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${currentPersona.color} bg-opacity-20 text-sm mb-6`}>
                    <currentPersona.icon className="w-5 h-5" />
                    <span className="font-semibold">{currentPersona.title} Journey</span>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <CircleDot className="w-4 h-4 text-red-400" />
                      </div>
                      <div>
                        <div className="text-sm text-red-400 font-semibold mb-1">THE PAIN</div>
                        <p className="text-xl text-slate-300">{currentPersona.painPoint}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <div className="text-sm text-green-400 font-semibold mb-1">THE SOLUTION</div>
                        <p className="text-xl text-white font-semibold">{currentPersona.solution}</p>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial */}
                  <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
                    <p className="text-lg text-slate-300 italic mb-4">{currentPersona.testimonial}</p>
                    <div className="flex gap-6">
                      {Object.entries(currentPersona.stats).map(([key, value]) => (
                        <div key={key}>
                          <div className="text-2xl font-bold text-white">{value}</div>
                          <div className="text-sm text-slate-500 capitalize">{key}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Journey */}
                <div>
                  <h4 className="text-xl font-bold mb-6 text-white">Your Transformation Journey</h4>

                  <div className="space-y-4">
                    {currentPersona.journey.map((step, i) => (
                      <div key={step.step} className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${currentPersona.color} flex items-center justify-center flex-shrink-0`}>
                          <span className="text-xl font-bold text-white">{i + 1}</span>
                        </div>
                        <div className="flex-1 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                          <div className="font-bold text-white">{step.step}</div>
                          <div className="text-sm text-slate-400">{step.desc}</div>
                        </div>
                        {i < currentPersona.journey.length - 1 && (
                          <ArrowRight className="w-5 h-5 text-slate-600 hidden md:block" />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                    <div className="flex items-center gap-3 mb-2">
                      <Trophy className="w-6 h-6 text-amber-400" />
                      <span className="font-bold text-white">Outcome</span>
                    </div>
                    <p className="text-lg text-slate-300">{currentPersona.outcome}</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </section>

        {/* The Flywheel */}
        <section className="container mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-4xl font-bold mb-4">The Flywheel Effect</h3>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              A self-reinforcing ecosystem where every participant makes the platform better
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            {/* Flywheel Visual */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {flywheel.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="p-6 bg-slate-900/50 border-slate-800 hover:border-purple-500/30 transition-all text-center group">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <item.icon className={`w-8 h-8 ${item.color}`} />
                    </div>
                    <div className="font-semibold text-white">{item.label}</div>
                    {i < flywheel.length - 1 && (
                      <ArrowRight className="w-5 h-5 text-slate-600 mx-auto mt-4 hidden md:block" />
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Center Circle */}
            <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center z-10">
              <div className="text-center">
                <Zap className="w-8 h-8 text-white mx-auto mb-1" />
                <span className="text-xs font-bold text-white">COMPOUND</span>
              </div>
            </div>
          </div>
        </section>

        {/* Unique Advantages */}
        <section className="container mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-4xl font-bold mb-4">Why We Win</h3>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Unique advantages that no other platform offers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {uniqueAdvantages.map((advantage, i) => (
              <motion.div
                key={advantage.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-6 h-full bg-slate-900/50 border-slate-800 hover:border-purple-500/30 transition-all">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${advantage.color} flex items-center justify-center mb-4`}>
                    <advantage.icon className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">{advantage.title}</h4>
                  <p className="text-slate-400">{advantage.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* The Ultimate Vision */}
        <section className="container mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-12 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-cyan-600/20 border-purple-500/30">
              <div className="text-center max-w-3xl mx-auto">
                <Globe className="w-16 h-16 mx-auto mb-6 text-purple-400" />
                <h3 className="text-3xl font-bold mb-6 text-white">The Ultimate Vision</h3>

                <div className="space-y-4 text-lg text-slate-300 mb-8">
                  <p><strong className="text-white">In 5 years,</strong> AI Architect Academy is:</p>
                  <ul className="space-y-2 text-left max-w-xl mx-auto">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                      The #1 platform for AI architecture education
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                      The largest marketplace for AI patterns and expertise
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                      The most advanced agent workforce (millions of agents)
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                      The de facto standard for AI architecture certification
                    </li>
                  </ul>
                </div>

                <p className="text-xl text-purple-300 italic mb-8">
                  &quot;Every AI architect will learn here, build here, teach here, earn here, and hire here.&quot;
                </p>

                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  onClick={() => window.location.href = '/offering'}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Join the Movement
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
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
                  <h3 className="text-3xl font-bold text-white mb-2">Ready to transform your AI journey?</h3>
                  <p className="text-purple-100">Join thousands building the next generation of intelligent systems</p>
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
                    onClick={() => window.location.href = '/agents'}
                  >
                    Explore Agents
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
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" onClick={() => window.open('https://github.com/frankxai/ai-architect-academy', '_blank')}>
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
