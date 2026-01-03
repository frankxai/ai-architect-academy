'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Shield,
  Network,
  Globe,
  Leaf,
  Heart,
  GraduationCap,
  DollarSign,
  BookOpen,
  Code2,
  Layers,
  Target,
  Users,
  Lightbulb,
  ChevronRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const agiModules = [
  {
    id: 'foundations',
    title: 'Foundations of AGI',
    hours: 10,
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
    topics: ['What is AGI?', 'Current State', 'Historical Context', 'Research Areas'],
    progress: 0
  },
  {
    id: 'alignment',
    title: 'Alignment & Safety',
    hours: 15,
    icon: Shield,
    color: 'from-red-500 to-orange-500',
    topics: ['The Alignment Problem', 'RLHF', 'Constitutional AI', 'Interpretability'],
    progress: 0
  },
  {
    id: 'multiagent',
    title: 'Multi-Agent Architectures',
    hours: 20,
    icon: Network,
    color: 'from-blue-500 to-cyan-500',
    topics: ['Emergent Intelligence', 'Swarm Patterns', 'Consensus Mechanisms', 'Handoffs'],
    progress: 0
  },
  {
    id: 'worldmodels',
    title: 'World Models & Reasoning',
    hours: 15,
    icon: Globe,
    color: 'from-green-500 to-emerald-500',
    topics: ['Internal Representations', 'Predictive Processing', 'Causal Reasoning'],
    progress: 0
  },
  {
    id: 'selfimprove',
    title: 'Self-Improvement Systems',
    hours: 10,
    icon: Sparkles,
    color: 'from-amber-500 to-yellow-500',
    topics: ['Meta-Learning', 'Safe Recursion', 'Neural Architecture Search'],
    progress: 0
  },
  {
    id: 'evaluation',
    title: 'AGI Evaluation',
    hours: 10,
    icon: Target,
    color: 'from-indigo-500 to-purple-500',
    topics: ['Benchmarks', 'Generalization Tests', 'Comprehensive Evaluation'],
    progress: 0
  }
];

const worldProblems = [
  {
    id: 'climate',
    title: 'Climate AI',
    icon: Leaf,
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
    description: 'Carbon modeling, optimization, and climate prediction systems',
    applications: [
      'Carbon footprint optimization',
      'Climate simulation models',
      'Renewable energy planning',
      'Sustainable resource allocation'
    ]
  },
  {
    id: 'health',
    title: 'Health AI',
    icon: Heart,
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    description: 'Drug discovery, diagnostics, and personalized medicine',
    applications: [
      'Drug molecule discovery',
      'Medical image diagnosis',
      'Treatment personalization',
      'Healthcare accessibility'
    ]
  },
  {
    id: 'education',
    title: 'Education AI',
    icon: GraduationCap,
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    description: 'Adaptive learning systems and educational accessibility',
    applications: [
      'Personalized tutoring',
      'Knowledge verification',
      'Learning path optimization',
      'Global education access'
    ]
  },
  {
    id: 'economic',
    title: 'Economic AI',
    icon: DollarSign,
    color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    description: 'Resource allocation and economic fairness systems',
    applications: [
      'Resource optimization',
      'Poverty prediction',
      'Fair distribution',
      'Economic modeling'
    ]
  }
];

const capstoneProjects = [
  {
    title: 'Safe Multi-Agent Researcher',
    difficulty: 'Advanced',
    hours: 40,
    description: 'Build a multi-agent system that researches topics autonomously while operating within safety constraints'
  },
  {
    title: 'Alignment Evaluation Framework',
    difficulty: 'Advanced',
    hours: 30,
    description: 'Create a comprehensive framework to evaluate and detect AI misalignment'
  },
  {
    title: 'Domain World Model',
    difficulty: 'Intermediate',
    hours: 25,
    description: 'Develop a world model for a specific domain like healthcare or economics'
  }
];

export default function AGIResearchPage() {
  const [activeTab, setActiveTab] = useState('modules');
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);

  const totalHours = agiModules.reduce((sum, m) => sum + m.hours, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AGI Research</h1>
              <p className="text-xs text-slate-400">AI Architect Academy</p>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/'}>
              Dashboard
            </Button>
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/offering'}>
              Offering
            </Button>
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/agents'}>
              Agents
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400">New Learning Path</span>
          </div>
          <h1 className="text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              AGI Research & World Problems
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-8">
            Accelerate safe AGI development and solve humanity&apos;s greatest challenges through structured learning and research
          </p>
          <div className="flex justify-center gap-4">
            <div className="px-6 py-3 rounded-xl bg-slate-800 border border-slate-700">
              <div className="text-2xl font-bold text-white">{totalHours}+</div>
              <div className="text-sm text-slate-400">Learning Hours</div>
            </div>
            <div className="px-6 py-3 rounded-xl bg-slate-800 border border-slate-700">
              <div className="text-2xl font-bold text-white">{agiModules.length}</div>
              <div className="text-sm text-slate-400">Core Modules</div>
            </div>
            <div className="px-6 py-3 rounded-xl bg-slate-800 border border-slate-700">
              <div className="text-2xl font-bold text-white">{worldProblems.length}</div>
              <div className="text-sm text-slate-400">World Tracks</div>
            </div>
            <div className="px-6 py-3 rounded-xl bg-slate-800 border border-slate-700">
              <div className="text-2xl font-bold text-white">{capstoneProjects.length}</div>
              <div className="text-sm text-slate-400">Capstones</div>
            </div>
          </div>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Card className="p-8 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/30">
            <div className="flex items-center gap-4 mb-4">
              <Lightbulb className="w-8 h-8 text-amber-400" />
              <h2 className="text-2xl font-bold text-white">Our Mission</h2>
            </div>
            <p className="text-lg text-slate-300 italic">
              &quot;Democratize AI architecture education and accelerate AGI research for solving humanity&apos;s greatest challenges&quot;
            </p>
          </Card>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-xl mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="modules">AGI Modules</TabsTrigger>
            <TabsTrigger value="world">World Problems</TabsTrigger>
            <TabsTrigger value="capstone">Capstones</TabsTrigger>
          </TabsList>

          {/* AGI Modules Tab */}
          <TabsContent value="modules">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agiModules.map((module, i) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="p-6 bg-slate-900 border-slate-800 hover:border-purple-500/50 transition-all h-full">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-4`}>
                      <module.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{module.title}</h3>
                    <p className="text-sm text-slate-400 mb-4">{module.hours} hours</p>
                    <div className="space-y-2 mb-4">
                      {module.topics.map((topic) => (
                        <div key={topic} className="flex items-center gap-2 text-sm text-slate-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                          {topic}
                        </div>
                      ))}
                    </div>
                    <div className="mt-auto">
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Progress</span>
                        <span>{module.progress}%</span>
                      </div>
                      <Progress value={module.progress} className="h-2" />
                    </div>
                    <Button className="w-full mt-4" variant="outline" size="sm">
                      Start Module
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* World Problems Tab */}
          <TabsContent value="world">
            <div className="grid md:grid-cols-2 gap-6">
              {worldProblems.map((problem, i) => (
                <motion.div
                  key={problem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card
                    className={`p-6 bg-slate-900 border cursor-pointer transition-all ${
                      selectedProblem === problem.id
                        ? problem.color
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                    onClick={() => setSelectedProblem(selectedProblem === problem.id ? null : problem.id)}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-xl ${problem.color.split(' ')[0]} flex items-center justify-center`}>
                        <problem.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{problem.title}</h3>
                        <p className="text-sm text-slate-400">{problem.description}</p>
                      </div>
                    </div>

                    {selectedProblem === problem.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 pt-4 border-t border-slate-800"
                      >
                        <h4 className="text-sm font-semibold text-slate-300 mb-3">Applications</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {problem.applications.map((app) => (
                            <div key={app} className="flex items-center gap-2 text-sm text-slate-400">
                              <Code2 className="w-3 h-3" />
                              {app}
                            </div>
                          ))}
                        </div>
                        <Button className="w-full mt-4" size="sm">
                          Explore Track
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>

            <Card className="mt-8 p-6 bg-slate-900 border-slate-800">
              <div className="flex items-center gap-4 mb-4">
                <Users className="w-8 h-8 text-cyan-400" />
                <div>
                  <h3 className="text-xl font-bold text-white">Community Impact</h3>
                  <p className="text-sm text-slate-400">Join researchers solving real problems</p>
                </div>
              </div>
              <p className="text-slate-300 mb-4">
                These tracks are designed to create real-world impact. Complete a track and deploy your solution
                to earn the World Problems Certification and connect with organizations tackling these challenges.
              </p>
              <div className="flex gap-4">
                <Button>
                  Join Research Community
                </Button>
                <Button variant="outline">
                  View Impact Stories
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Capstone Tab */}
          <TabsContent value="capstone">
            <div className="space-y-6">
              {capstoneProjects.map((project, i) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="p-6 bg-slate-900 border-slate-800 hover:border-purple-500/50 transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-white">{project.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            project.difficulty === 'Advanced'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {project.difficulty}
                          </span>
                        </div>
                        <p className="text-slate-400 mb-4">{project.description}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {project.hours} hours
                          </span>
                          <span className="flex items-center gap-1">
                            <Layers className="w-4 h-4" />
                            Full implementation
                          </span>
                        </div>
                      </div>
                      <Button variant="outline">
                        Start Project
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Card className="mt-8 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">AGI Research Certification</h3>
                <p className="text-slate-400 mb-4">
                  Complete all modules and one capstone project to earn your certification
                </p>
                <div className="flex justify-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">80-100</div>
                    <div className="text-xs text-slate-400">Hours Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-400">6</div>
                    <div className="text-xs text-slate-400">Core Modules</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">1</div>
                    <div className="text-xs text-slate-400">Capstone Required</div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
