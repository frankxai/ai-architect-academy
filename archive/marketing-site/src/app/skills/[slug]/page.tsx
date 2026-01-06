import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/Card';
import { skills, skillCategories, getSkillBySlug, getAllSkillSlugs } from '@/data/skills';
import {
  ArrowLeft,
  Code2,
  Terminal,
  CheckCircle2,
  Lightbulb,
  Link2,
  ArrowRight,
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSkillSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const skill = getSkillBySlug(slug);

  if (!skill) {
    return { title: 'Skill Not Found' };
  }

  return {
    title: `${skill.name} - AI Architecture Skill`,
    description: skill.longDescription,
    keywords: skill.keywords,
    openGraph: {
      title: `${skill.name} - AI Architecture Skill`,
      description: skill.description,
      url: `https://ai-architect-academy.vercel.app/skills/${slug}/`,
    },
  };
}

export default async function SkillPage({ params }: Props) {
  const { slug } = await params;
  const skill = getSkillBySlug(slug);

  if (!skill) {
    notFound();
  }

  const relatedSkills = skill.relatedSkills
    .map((slug) => skills.find((s) => s.slug === slug))
    .filter(Boolean);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Link
            href="/skills/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            All Skills
          </Link>

          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${skillCategories[skill.category].color} px-3 py-1 text-xs font-medium text-white`}
              >
                {skillCategories[skill.category].name}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  skill.level === 'beginner'
                    ? 'bg-green-500/10 text-green-400'
                    : skill.level === 'intermediate'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-rose-500/10 text-rose-400'
                }`}
              >
                {skill.level}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white">{skill.name}</h1>

            {skill.command && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-800 border border-slate-700 px-4 py-2">
                <Terminal className="h-4 w-4 text-slate-400" />
                <code className="text-sm text-purple-400">{skill.command}</code>
              </div>
            )}

            <p className="mt-6 text-lg text-slate-300">{skill.longDescription}</p>
          </div>

          {/* Features */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              Key Features
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {skill.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-xl bg-slate-900/50 border border-slate-800 p-4"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">{feature}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Use Cases */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-amber-500" />
              Use Cases
            </h2>
            <div className="space-y-3">
              {skill.useCases.map((useCase, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-xl bg-slate-900/50 border border-slate-800 p-4"
                >
                  <ArrowRight className="h-5 w-5 text-purple-500 flex-shrink-0" />
                  <span className="text-slate-300">{useCase}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Related Skills */}
          {relatedSkills.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Link2 className="h-6 w-6 text-cyan-500" />
                Related Skills
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {relatedSkills.map(
                  (relatedSkill) =>
                    relatedSkill && (
                      <Card
                        key={relatedSkill.slug}
                        title={relatedSkill.name}
                        description={relatedSkill.description}
                        href={`/skills/${relatedSkill.slug}/`}
                        category={relatedSkill.level}
                        categoryColor={
                          relatedSkill.level === 'beginner'
                            ? 'from-green-500 to-emerald-600'
                            : relatedSkill.level === 'intermediate'
                              ? 'from-amber-500 to-orange-600'
                              : 'from-rose-500 to-red-600'
                        }
                        icon={<Code2 className="h-3 w-3" />}
                      />
                    )
                )}
              </div>
            </section>
          )}

          {/* CTA */}
          <section className="mt-16 rounded-2xl bg-gradient-to-r from-purple-900/50 to-cyan-900/50 border border-purple-500/20 p-8 text-center">
            <h2 className="text-2xl font-bold text-white">Master {skill.name}</h2>
            <p className="mt-2 text-slate-300">
              This skill is part of our comprehensive AI architecture curriculum
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/paths/100-hour-ai-architect/"
                className="rounded-xl bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-slate-100 transition-all"
              >
                Start Learning Path
              </Link>
              <Link
                href="/skills/"
                className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10 transition-all"
              >
                Browse All Skills
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
