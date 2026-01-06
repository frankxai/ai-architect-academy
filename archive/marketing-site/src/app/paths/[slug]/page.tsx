import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/Card';
import { paths, pathCategories, getPathBySlug, getAllPathSlugs } from '@/data/paths';
import {
  ArrowLeft,
  GraduationCap,
  Clock,
  BookOpen,
  CheckCircle2,
  Award,
  Link2,
  ArrowRight,
  Target,
  Users,
  Play,
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPathSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const path = getPathBySlug(slug);

  if (!path) {
    return { title: 'Path Not Found' };
  }

  return {
    title: `${path.name} - AI Architect Academy`,
    description: path.longDescription,
    keywords: path.keywords,
    openGraph: {
      title: `${path.name} - AI Architect Academy`,
      description: path.description,
      url: `https://ai-architect-academy.vercel.app/paths/${slug}/`,
    },
  };
}

export default async function PathPage({ params }: Props) {
  const { slug } = await params;
  const path = getPathBySlug(slug);

  if (!path) {
    notFound();
  }

  const relatedPaths = path.relatedPaths
    .map((slug) => paths.find((p) => p.slug === slug))
    .filter(Boolean);

  const totalTopics = path.modules.reduce((sum, m) => sum + m.topics.length, 0);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Link
            href="/paths/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            All Paths
          </Link>

          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${pathCategories[path.category].color} px-3 py-1 text-xs font-medium text-white`}
              >
                {pathCategories[path.category].name}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  path.difficulty === 'beginner'
                    ? 'bg-green-500/10 text-green-400'
                    : path.difficulty === 'intermediate'
                      ? 'bg-amber-500/10 text-amber-400'
                      : path.difficulty === 'advanced'
                        ? 'bg-rose-500/10 text-rose-400'
                        : 'bg-purple-500/10 text-purple-400'
                }`}
              >
                {path.difficulty}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white">{path.name}</h1>
            <p className="mt-6 text-lg text-slate-300">{path.longDescription}</p>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl bg-slate-900/50 border border-slate-800 p-4 text-center">
                <Clock className="h-5 w-5 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{path.hours}</div>
                <div className="text-xs text-slate-500">Hours</div>
              </div>
              <div className="rounded-xl bg-slate-900/50 border border-slate-800 p-4 text-center">
                <BookOpen className="h-5 w-5 text-cyan-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{path.modules.length}</div>
                <div className="text-xs text-slate-500">Modules</div>
              </div>
              <div className="rounded-xl bg-slate-900/50 border border-slate-800 p-4 text-center">
                <Target className="h-5 w-5 text-amber-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{totalTopics}</div>
                <div className="text-xs text-slate-500">Topics</div>
              </div>
              <div className="rounded-xl bg-slate-900/50 border border-slate-800 p-4 text-center">
                <Award className="h-5 w-5 text-green-500 mx-auto mb-2" />
                <div className="text-lg font-bold text-white truncate">{path.certificate}</div>
                <div className="text-xs text-slate-500">Certificate</div>
              </div>
            </div>
          </div>

          {/* Prerequisites */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Users className="h-6 w-6 text-purple-500" />
              Prerequisites
            </h2>
            <div className="flex flex-wrap gap-3">
              {path.prerequisites.map((prereq, index) => (
                <span
                  key={index}
                  className="rounded-full bg-slate-800 border border-slate-700 px-4 py-2 text-sm text-slate-300"
                >
                  {prereq}
                </span>
              ))}
            </div>
          </section>

          {/* Outcomes */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              What You&apos;ll Learn
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {path.outcomes.map((outcome, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-xl bg-slate-900/50 border border-slate-800 p-4"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">{outcome}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Modules */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-cyan-500" />
              Curriculum
            </h2>
            <div className="space-y-4">
              {path.modules.map((module, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-slate-900/50 border border-slate-800 overflow-hidden"
                >
                  <div className="flex items-center justify-between p-4 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 text-sm font-semibold">
                        {index + 1}
                      </span>
                      <h3 className="font-semibold text-white">{module.name}</h3>
                    </div>
                    <span className="text-sm text-slate-500">{module.hours} hours</span>
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {module.topics.map((topic, topicIndex) => (
                        <span
                          key={topicIndex}
                          className="rounded-lg bg-slate-800 px-3 py-1 text-xs text-slate-400"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Related Paths */}
          {relatedPaths.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Link2 className="h-6 w-6 text-purple-500" />
                Related Paths
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {relatedPaths.map(
                  (relatedPath) =>
                    relatedPath && (
                      <Card
                        key={relatedPath.slug}
                        title={relatedPath.name}
                        description={relatedPath.description}
                        href={`/paths/${relatedPath.slug}/`}
                        category={relatedPath.difficulty}
                        categoryColor={
                          relatedPath.difficulty === 'beginner'
                            ? 'from-green-500 to-emerald-600'
                            : relatedPath.difficulty === 'intermediate'
                              ? 'from-amber-500 to-orange-600'
                              : relatedPath.difficulty === 'advanced'
                                ? 'from-rose-500 to-red-600'
                                : 'from-purple-500 to-pink-600'
                        }
                        meta={`${relatedPath.hours} hours`}
                        icon={<GraduationCap className="h-3 w-3" />}
                      />
                    )
                )}
              </div>
            </section>
          )}

          {/* CTA */}
          <section className="mt-16 rounded-2xl bg-gradient-to-r from-purple-900/50 to-cyan-900/50 border border-purple-500/20 p-8 text-center">
            <h2 className="text-2xl font-bold text-white">Start Your Journey</h2>
            <p className="mt-2 text-slate-300">
              Begin the {path.name} and earn your {path.certificate} certificate
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="#"
                className="group flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-slate-100 transition-all"
              >
                <Play className="h-5 w-5" />
                Start Learning
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/paths/"
                className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10 transition-all"
              >
                Browse All Paths
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
