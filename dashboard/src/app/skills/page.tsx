'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Cloud,
  Code2,
  Sparkles,
  Users,
  Palette,
  Heart,
  Shield,
  Database,
  Cpu,
  Network,
  Server,
  Terminal,
  BookOpen,
  Search,
  Filter,
  ChevronRight,
  Star,
  Zap
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Skill {
  name: string;
  description: string;
  category: string;
  level: 'core' | 'advanced' | 'specialized';
  command: string;
}

const skills: Skill[] = [
  // AI Architecture Skills
  { name: 'oracle-adk', description: 'Oracle Agent Development Kit for multi-agent applications on OCI', category: 'AI Architecture', level: 'core', command: '/oracle-adk' },
  { name: 'oracle-agent-spec', description: 'Framework-agnostic AI agents using Oracle Open Agent Specification', category: 'AI Architecture', level: 'core', command: '/oracle-agent-spec' },
  { name: 'mcp-architecture', description: 'Model Context Protocol servers for AI-to-data integration', category: 'AI Architecture', level: 'core', command: '/mcp-architecture' },
  { name: 'mcp-2025-patterns', description: 'Latest MCP best practices and 2025 ecosystem patterns', category: 'AI Architecture', level: 'advanced', command: '/mcp-2025-patterns' },
  { name: 'claude-sdk', description: 'Claude Agent SDK with computer use, tool calling, MCP integration', category: 'AI Architecture', level: 'core', command: '/claude-sdk' },
  { name: 'langgraph-patterns', description: 'Production agentic workflows with graph-based orchestration', category: 'AI Architecture', level: 'advanced', command: '/langgraph-patterns' },
  { name: 'openai-agentkit', description: 'OpenAI Agents SDK for multi-agent systems', category: 'AI Architecture', level: 'advanced', command: '/openai-agentkit' },
  { name: 'agentic-orchestration', description: 'Multi-agent coordination, task decomposition, handoffs', category: 'AI Architecture', level: 'core', command: '/agentic-orchestration' },
  { name: 'rag-expert', description: 'RAG systems, knowledge bases, chunking, embeddings', category: 'AI Architecture', level: 'core', command: '/rag-expert' },
  { name: 'enterprise-ai-patterns', description: 'AI Gateway, security, prompt injection defense, FinOps', category: 'AI Architecture', level: 'advanced', command: '/enterprise-ai-patterns' },
  { name: 'architecture-diagramming', description: 'Professional diagrams with D2, Draw.io, Mermaid', category: 'AI Architecture', level: 'specialized', command: '/architecture-diagramming' },
  { name: 'ai-security-expert', description: 'AI security and threat modeling expertise', category: 'AI Architecture', level: 'specialized', command: '/ai-security-expert' },
  { name: 'genai-dac-specialist', description: 'Dedicated AI Clusters deployment and management', category: 'AI Architecture', level: 'specialized', command: '/genai-dac-specialist' },
  { name: 'multi-cloud-ai-architect', description: 'Cross-cloud AI architecture and integration', category: 'AI Architecture', level: 'advanced', command: '/multi-cloud-ai-architect' },

  // Cloud & Infrastructure
  { name: 'oci-services-expert', description: 'Oracle Cloud Infrastructure services and best practices', category: 'Cloud & Infrastructure', level: 'core', command: '/oci-services-expert' },
  { name: 'terraform-expert', description: 'Infrastructure as Code for all major clouds', category: 'Cloud & Infrastructure', level: 'advanced', command: '/terraform-expert' },
  { name: 'kubernetes-expert', description: 'Container orchestration on OKE, EKS, AKS, GKE', category: 'Cloud & Infrastructure', level: 'advanced', command: '/kubernetes-expert' },

  // Creative Skills
  { name: 'suno-ai-mastery', description: 'AI music generation with Suno v4.5+', category: 'Creative', level: 'specialized', command: '/suno-ai-mastery' },
  { name: 'suno-prompt-architect', description: 'Expert Suno prompt engineering for cinematic music', category: 'Creative', level: 'specialized', command: '/suno-prompt-architect' },
  { name: 'golden-age-book-writing', description: 'Master-level book writing with 9-rubric refinement', category: 'Creative', level: 'advanced', command: '/golden-age-book-writing' },
  { name: 'frankx-brand', description: 'FrankX brand standards for visual consistency', category: 'Creative', level: 'specialized', command: '/frankx-brand' },
  { name: 'arcanea-lore', description: 'Arcanea world-building and lore expertise', category: 'Creative', level: 'specialized', command: '/arcanea-lore' },

  // Personal Development
  { name: 'greek-philosopher', description: 'Ancient wisdom through Socratic questioning and Stoic principles', category: 'Personal Development', level: 'specialized', command: '/greek-philosopher' },
  { name: 'spartan-warrior', description: 'Unbreakable discipline, courage, and excellence', category: 'Personal Development', level: 'specialized', command: '/spartan-warrior' },
  { name: 'gym-training-expert', description: 'Evidence-based training for optimal strength and muscle', category: 'Personal Development', level: 'specialized', command: '/gym-training-expert' },
  { name: 'health-nutrition-expert', description: '2025 nutrition science for longevity and metabolic health', category: 'Personal Development', level: 'specialized', command: '/health-nutrition-expert' },
  { name: 'frankx-daily-execution', description: 'Daily workflow with Starlight Intelligence', category: 'Personal Development', level: 'specialized', command: '/frankx-daily-execution' },

  // Development
  { name: 'nextjs-react-expert', description: 'Next.js and React best practices', category: 'Development', level: 'core', command: '/nextjs-react-expert' },
  { name: 'ui-ux-design-expert', description: 'UI/UX design, design systems, accessibility', category: 'Development', level: 'advanced', command: '/ui-ux-design-expert' },
  { name: 'framer-expert', description: 'Framer design and development with Framer Motion', category: 'Development', level: 'specialized', command: '/framer-expert' },
];

const categories = [
  { name: 'All', icon: Zap, color: 'from-purple-500 to-pink-500' },
  { name: 'AI Architecture', icon: Brain, color: 'from-cyan-500 to-blue-500' },
  { name: 'Cloud & Infrastructure', icon: Cloud, color: 'from-blue-500 to-indigo-500' },
  { name: 'Creative', icon: Palette, color: 'from-pink-500 to-rose-500' },
  { name: 'Personal Development', icon: Heart, color: 'from-amber-500 to-orange-500' },
  { name: 'Development', icon: Code2, color: 'from-green-500 to-emerald-500' },
];

const levelColors = {
  core: 'bg-green-500/20 text-green-400 border-green-500/30',
  advanced: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  specialized: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

export default function SkillsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           skill.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
      const matchesLevel = !selectedLevel || skill.level === selectedLevel;
      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [searchQuery, selectedCategory, selectedLevel]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: skills.length };
    skills.forEach((skill) => {
      counts[skill.category] = (counts[skill.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Skills Catalog</h1>
              <p className="text-xs text-slate-400">{skills.length} specialized skills</p>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/'}>
              Dashboard
            </Button>
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/agents'}>
              Agents
            </Button>
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/offering'}>
              Offering
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              80+ Claude Code Skills
            </span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Specialized expertise modules that enhance Claude Code with domain-specific knowledge and capabilities
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-900 border-slate-800"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <Button
                key={cat.name}
                variant={selectedCategory === cat.name ? 'default' : 'outline'}
                size="sm"
                className={selectedCategory === cat.name ? `bg-gradient-to-r ${cat.color}` : ''}
                onClick={() => setSelectedCategory(cat.name)}
              >
                <cat.icon className="w-4 h-4 mr-2" />
                {cat.name}
                <span className="ml-2 text-xs opacity-70">({categoryCounts[cat.name] || 0})</span>
              </Button>
            ))}
          </div>

          {/* Level Filters */}
          <div className="flex justify-center gap-2">
            {(['core', 'advanced', 'specialized'] as const).map((level) => (
              <Button
                key={level}
                variant="outline"
                size="sm"
                className={selectedLevel === level ? levelColors[level] : ''}
                onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-5 bg-slate-900 border-slate-800 hover:border-purple-500/50 transition-all h-full">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-cyan-400" />
                    <code className="text-sm font-mono text-cyan-400">{skill.command}</code>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs border ${levelColors[skill.level]}`}>
                    {skill.level}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{skill.name}</h3>
                <p className="text-sm text-slate-400 mb-4">{skill.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs text-slate-500">{skill.category}</span>
                  <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
                    Learn More
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No skills match your search criteria</p>
          </div>
        )}

        {/* Usage Guide */}
        <Card className="mt-12 p-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
          <h3 className="text-2xl font-bold text-white mb-4">How to Use Skills</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-slate-300 mb-3">Via Slash Commands</h4>
              <code className="block p-4 rounded-lg bg-slate-900 text-sm text-cyan-400 mb-2">
                /oracle-adk &quot;Build a customer service agent&quot;
              </code>
              <p className="text-sm text-slate-400">
                Invoke skills directly with a prompt for context-specific expertise
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-slate-300 mb-3">Automatic Selection</h4>
              <p className="text-sm text-slate-400 mb-2">
                Claude Code automatically selects relevant skills based on your task context.
                Skills are defined in <code className="text-cyan-400">~/.claude-skills/</code>
              </p>
              <Button variant="outline" size="sm">
                <BookOpen className="w-4 h-4 mr-2" />
                View Documentation
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
