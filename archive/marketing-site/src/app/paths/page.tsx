import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/Card';
import { paths, pathCategories, type LearningPath } from '@/data/paths';
import { GraduationCap, Clock, BookOpen, Target } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Learning Paths - Structured AI Architecture Journeys',
  description:
    'Choose your learning path. From beginner to expert, 9 structured journeys to master AI architecture. 100-Hour AI Architect, AGI Research, World Problems tracks.',
  keywords: [
    'ai learning paths',
    'ai architect course',
    'ai training',
    '100 hour ai',
    'ai bootcamp',
    'ai certification',
  ],
  openGraph: {
    title: 'Learning Paths - Structured AI Architecture Journeys',
    description: 'Choose your learning path to master AI architecture',
    url: 'https://ai-architect-academy.vercel.app/paths/',
  },
};

function groupByCategory(paths: LearningPath[]): Record<string, LearningPath[]> {
  return paths.reduce(
    (acc, path) => {
      if (!acc[path.category]) {
        acc[path.category] = [];
      }
      acc[path.category].push(path);
      return acc;
    },
    {} as Record<string, LearningPath[]>
  );
}

export default function PathsPage() {
  const groupedPaths = groupByCategory(paths);
  const categories = Object.keys(pathCategories) as Array<keyof typeof pathCategories>;

  const totalHours = paths.reduce((sum, path) => sum + path.hours, 0);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/20 px-4 py-2 text-sm text-purple-300 mb-6">
              <GraduationCap className="h-4 w-4" />
              {paths.length} Learning Paths
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">Learning Paths</h1>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
              Structured journeys from beginner to expert. Choose your path based on your goals,
              experience level, and the problems you want to solve.
            </p>

            {/* Quick Stats */}
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-500" />
                {totalHours}+ Total Hours
              </span>
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-cyan-500" />
                {paths.reduce((sum, p) => sum + p.modules.length, 0)} Modules
              </span>
              <span className="flex items-center gap-2">
                <Target className="h-4 w-4 text-amber-500" />
                {paths.length} Certificates
              </span>
            </div>
          </div>

          {/* Paths by Category */}
          {categories.map((category) => {
            const categoryPaths = groupedPaths[category] || [];
            if (categoryPaths.length === 0) return null;

            return (
              <section key={category} className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <h2
                    className={`text-2xl font-bold bg-gradient-to-r ${pathCategories[category].color} bg-clip-text text-transparent`}
                  >
                    {pathCategories[category].name}
                  </h2>
                  <span className="text-sm text-slate-500">({categoryPaths.length} paths)</span>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryPaths.map((path) => (
                    <Card
                      key={path.slug}
                      title={path.name}
                      description={path.description}
                      href={`/paths/${path.slug}/`}
                      category={path.difficulty}
                      categoryColor={
                        path.difficulty === 'beginner'
                          ? 'from-green-500 to-emerald-600'
                          : path.difficulty === 'intermediate'
                            ? 'from-amber-500 to-orange-600'
                            : path.difficulty === 'advanced'
                              ? 'from-rose-500 to-red-600'
                              : 'from-purple-500 to-pink-600'
                      }
                      meta={`${path.hours} hours • ${path.duration}`}
                      badge={path.slug === '100-hour-ai-architect' ? 'Popular' : undefined}
                      icon={<GraduationCap className="h-3 w-3" />}
                    />
                  ))}
                </div>
              </section>
            );
          })}

          {/* SEO Content */}
          <section className="mt-20 prose prose-invert prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-white">AI Architect Learning Paths</h2>
            <p className="text-slate-400">
              The AI Architect Academy offers {paths.length} structured learning paths totaling{' '}
              {totalHours}+ hours of curriculum. Each path is designed to take you from your current
              level to mastery of specific AI architecture competencies.
            </p>
            <h3 className="text-xl font-semibold text-white mt-8">Path Categories</h3>
            <ul className="text-slate-400">
              <li>
                <strong className="text-white">Foundation Paths:</strong> Start here if you&apos;re
                new to AI architecture. The 100-Hour AI Architect path is our flagship curriculum
                covering the complete journey.
              </li>
              <li>
                <strong className="text-white">Advanced Paths:</strong> For experienced developers
                ready to build production systems. Includes bootcamp and professional tracks.
              </li>
              <li>
                <strong className="text-white">Specialization:</strong> Deep dive into cutting-edge
                areas like AGI research, alignment, and safety.
              </li>
              <li>
                <strong className="text-white">World Problems:</strong> Apply AI to solve humanity&apos;s
                biggest challenges in climate, health, education, and economics.
              </li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
