'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Code2, 
  Sparkles, 
  Layers, 
  Terminal, 
  Search, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap,
  Bot,
  Palette,
  Database,
  Cloud,
  GitBranch,
  Play,
  Settings,
  ChevronRight
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const features = [
  {
    icon: Brain,
    title: 'AI Architecture Assistant',
    description: 'Get intelligent recommendations for your architecture decisions',
    color: 'bg-gradient-to-br from-purple-500 to-pink-500',
    href: '/assistant'
  },
  {
    icon: Layers,
    title: 'Visual Architecture Builder',
    description: 'Design and visualize your AI systems with drag-and-drop',
    color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    href: '/builder'
  },
  {
    icon: Code2,
    title: 'Smart Project Scaffolding',
    description: 'Generate production-ready AI projects in seconds',
    color: 'bg-gradient-to-br from-green-500 to-emerald-500',
    href: '/scaffold'
  },
  {
    icon: Terminal,
    title: 'Live Playground',
    description: 'Test and compare AI models in real-time',
    color: 'bg-gradient-to-br from-orange-500 to-red-500',
    href: '/playground'
  },
  {
    icon: TrendingUp,
    title: 'Intelligence Hub',
    description: 'Track benchmarks, costs, and performance metrics',
    color: 'bg-gradient-to-br from-indigo-500 to-purple-500',
    href: '/intelligence'
  },
  {
    icon: BookOpen,
    title: 'Learning Paths',
    description: 'Master AI architecture with guided tutorials',
    color: 'bg-gradient-to-br from-yellow-500 to-orange-500',
    href: '/learn'
  }
];

const quickActions = [
  { icon: Bot, label: 'Chat with AI', action: 'openAssistant' },
  { icon: GitBranch, label: 'New Project', action: 'createProject' },
  { icon: Play, label: 'Open Playground', action: 'openPlayground' },
  { icon: Database, label: 'View Patterns', action: 'viewPatterns' }
];

const stats = [
  { label: 'Active Projects', value: '12', change: '+2 this week' },
  { label: 'API Costs', value: '$247', change: '-15% vs last month' },
  { label: 'Model Accuracy', value: '94.2%', change: '+3.1% improvement' },
  { label: 'Response Time', value: '120ms', change: '-45ms optimized' }
];

export default function Home() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [modules, setModules] = useState([] as Array<{ id: string; title: string; category: string; summary: string; duration: string; url: string }>);
  const [moduleCategory, setModuleCategory] = useState('All');
  const [moduleQuery, setModuleQuery] = useState('');

  useEffect(() => {
    fetch('/api/micro-learning')
      .then(res => res.json())
      .then(data => {
        const items = Array.isArray(data.modules) ? data.modules : [];
        const mapped = items.map((mod: any) => ({
          id: mod.id,
          title: mod.title,
          category: mod.category,
          summary: mod.summary,
          duration: mod.duration,
          url: mod.path ? `https://github.com/frankxai/ai-architect-academy/blob/main/${mod.path}` : '#'
        }));
        setModules(mapped);
      })
      .catch(() => {});
  }, []);

  const moduleCategories = useMemo(() => {
    const cats = new Set(modules.map((m) => m.category));
    return ['All', ...Array.from(cats)];
  }, [modules]);

  const filteredModules = useMemo(() => {
    const term = moduleQuery.toLowerCase();
    return modules.filter(mod => {
      const inCategory = moduleCategory === 'All' || mod.category === moduleCategory;
      const haystack = `${mod.title} ${mod.summary} ${mod.category}`.toLowerCase();
      const matches = !term || haystack.includes(term);
      return inCategory && matches;
    });
  }, [modules, moduleCategory, moduleQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-purple-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Architect Hub
              </h1>
            </div>
            <span className="px-2 py-1 text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full">
              GENIUS
            </span>
          </div>
          
          <nav className="flex items-center gap-6">
            <Button variant="ghost" size="sm">Patterns</Button>
            <Button variant="ghost" size="sm">Projects</Button>
            <Button variant="ghost" size="sm">Community</Button>
            <Button variant="ghost" size="sm">Docs</Button>
            <Settings className="w-5 h-5 cursor-pointer" />
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white">
            <h2 className="text-4xl font-bold mb-4">
              Welcome to Your AI Command Center
            </h2>
            <p className="text-xl mb-6 text-purple-100">
              Design, build, and deploy AI systems with confidence
            </p>
            <div className="flex gap-4">
              {quickActions.map((action) => (
                <Button
                  key={action.action}
                  className="bg-white/20 backdrop-blur hover:bg-white/30"
                  size="sm"
                >
                  <action.icon className="w-4 h-4 mr-2" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="p-6 border-0 shadow-lg">
                <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
                <p className="text-xs text-green-600 mt-2">{stat.change}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <Card className="p-6 border-0 shadow-lg hover:shadow-2xl transition-all cursor-pointer">
                    <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">{feature.description}</p>
                    <Button variant="ghost" className="group">
                      Explore <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="assistant" className="mt-6">
            <Card className="p-8 border-0 shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">AI Architecture Assistant</h3>
                  <p className="text-slate-600">Your intelligent design companion</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Assistant</p>
                  <p className="mt-2">How can I help you architect your AI system today? I can help with pattern selection, cost optimization, scalability planning, and more.</p>
                </div>
                <textarea 
                  className="w-full p-4 border rounded-lg resize-none"
                  rows={3}
                  placeholder="Ask me anything about AI architecture..."
                />
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get AI Recommendations
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            <Card className="p-8 border-0 shadow-xl">
              <h3 className="text-2xl font-bold mb-6">Active Projects</h3>
              <div className="space-y-4">
                {['RAG System v2', 'Customer Support Bot', 'Document Analyzer'].map((project) => (
                  <div key={project} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg"></div>
                        <div>
                          <p className="font-semibold">{project}</p>
                          <p className="text-sm text-slate-600">Last updated 2 hours ago</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Open</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="learning" className="mt-6">
            <Card className="p-8 border-0 shadow-xl">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-1">Micro-Learning Atlas</h3>
                  <p className="text-slate-600 dark:text-slate-400">Browse 45-minute modules pulled directly from the docs.</p>
                </div>
                <div className="relative md:w-96">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    className="w-full pl-10 pr-3 py-2 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-700"
                    placeholder="Search micro-modules"
                    value={moduleQuery}
                    onChange={(e) => setModuleQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {moduleCategories.map((cat) => (
                  <Button
                    key={cat}
                    variant={cat === moduleCategory ? 'default' : 'outline'}
                    className={cat === moduleCategory ? 'bg-cyan-500 border-cyan-500' : ''}
                    onClick={() => setModuleCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredModules.length === 0 && (
                  <div className="col-span-full p-6 border rounded-lg bg-slate-50 dark:bg-slate-900 dark:border-slate-800 text-slate-500">
                    No modules match those filters yet.
                  </div>
                )}
                {filteredModules.map((mod) => (
                  <Card key={mod.id} className="p-5 border dark:border-slate-700">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{mod.category}</div>
                    <h4 className="mt-2 text-lg font-semibold">{mod.title}</h4>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{mod.summary}</p>
                    <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">{mod.duration}</div>
                    <div className="mt-4">
                      <Button asChild variant="outline" size="sm">
                        <a href={mod.url} target="_blank" rel="noopener">Open Module</a>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>
          <TabsContent value="analytics" className="mt-6">
            <Card className="p-8 border-0 shadow-xl">
              <h3 className="text-2xl font-bold mb-6">Performance Analytics</h3>
              <div className="h-64 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-lg flex items-center justify-center">
                <p className="text-slate-500">Analytics visualization will be rendered here</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Innovation Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-8 border-0 shadow-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Ready to build something amazing?</h3>
                <p className="text-indigo-100">Access cutting-edge AI tools and patterns</p>
              </div>
              <Button className="bg-white text-indigo-600 hover:bg-gray-100">
                <Zap className="w-4 h-4 mr-2" />
                Start Building
              </Button>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
