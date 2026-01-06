import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/Card';
import { skills, skillCategories, type Skill } from '@/data/skills';
import { Code2, Filter } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Architecture Skills - 80+ Skills to Master',
  description:
    'Master 80+ skills for enterprise AI architecture. From RAG systems to multi-agent orchestration, Claude Code to LangGraph. Start your AI architect journey.',
  keywords: [
    'ai skills',
    'ai architecture skills',
    'claude code',
    'langgraph',
    'rag systems',
    'ai development skills',
  ],
  openGraph: {
    title: 'AI Architecture Skills - 80+ Skills to Master',
    description: 'Master 80+ skills for enterprise AI architecture',
    url: 'https://ai-architect-academy.vercel.app/skills/',
  },
};

function groupByCategory(skills: Skill[]): Record<string, Skill[]> {
  return skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>
  );
}

export default function SkillsPage() {
  const groupedSkills = groupByCategory(skills);
  const categories = Object.keys(skillCategories) as Array<keyof typeof skillCategories>;

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/20 px-4 py-2 text-sm text-purple-300 mb-6">
              <Code2 className="h-4 w-4" />
              {skills.length}+ Skills
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">AI Architecture Skills</h1>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
              Master the skills needed to design, build, and operate production AI systems. From
              fundamentals to advanced orchestration patterns.
            </p>
          </div>

          {/* Skills by Category */}
          {categories.map((category) => {
            const categorySkills = groupedSkills[category] || [];
            if (categorySkills.length === 0) return null;

            return (
              <section key={category} className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <h2
                    className={`text-2xl font-bold bg-gradient-to-r ${skillCategories[category].color} bg-clip-text text-transparent`}
                  >
                    {skillCategories[category].name}
                  </h2>
                  <span className="text-sm text-slate-500">({categorySkills.length} skills)</span>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categorySkills.map((skill) => (
                    <Card
                      key={skill.slug}
                      title={skill.name}
                      description={skill.description}
                      href={`/skills/${skill.slug}/`}
                      category={skill.level}
                      categoryColor={
                        skill.level === 'beginner'
                          ? 'from-green-500 to-emerald-600'
                          : skill.level === 'intermediate'
                            ? 'from-amber-500 to-orange-600'
                            : 'from-rose-500 to-red-600'
                      }
                      icon={<Code2 className="h-3 w-3" />}
                    />
                  ))}
                </div>
              </section>
            );
          })}

          {/* SEO Content */}
          <section className="mt-20 prose prose-invert prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-white">Learn AI Architecture Skills</h2>
            <p className="text-slate-400">
              The AI Architect Academy provides comprehensive training across {skills.length}+
              skills essential for modern AI development. Whether you&apos;re building RAG systems,
              orchestrating multi-agent workflows, or implementing enterprise governance, our
              curriculum covers the complete spectrum of AI architecture.
            </p>
            <h3 className="text-xl font-semibold text-white mt-8">Skill Categories</h3>
            <ul className="text-slate-400">
              {categories.map((category) => (
                <li key={category}>
                  <strong className="text-white">{skillCategories[category].name}:</strong>{' '}
                  {groupedSkills[category]?.length || 0} skills covering{' '}
                  {category === 'ai-architecture'
                    ? 'RAG, agents, evaluation, and production patterns'
                    : category === 'cloud'
                      ? 'OCI, deployment, and infrastructure'
                      : category === 'creative'
                        ? 'content, music, and creative AI applications'
                        : category === 'personal-dev'
                          ? 'productivity, wellness, and personal growth'
                          : 'automation, MCP servers, and tool development'}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
