/**
 * AI-Optimized Content Layout
 *
 * This layout wraps all content pages with:
 * - Proper semantic structure for AI parsing
 * - Table of contents for navigation
 * - Last updated timestamps (freshness signal)
 * - Related content links (topical authority)
 */

import Link from 'next/link';
import { Header } from './Header';
import { Footer } from './Footer';
import { Clock, Calendar, ChevronRight, BookOpen } from 'lucide-react';

interface ContentLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  category: string;
  categoryHref: string;
  lastUpdated: string;
  readingTime?: string;
  tableOfContents?: { id: string; title: string; level: number }[];
  relatedContent?: { title: string; href: string; description: string }[];
}

export function ContentLayout({
  children,
  title,
  description,
  category,
  categoryHref,
  lastUpdated,
  readingTime,
  tableOfContents,
  relatedContent,
}: ContentLayoutProps) {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_280px] gap-12">
            {/* Main Content */}
            <article className="min-w-0">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
                <ChevronRight className="h-4 w-4" />
                <Link href={categoryHref} className="hover:text-white capitalize">
                  {category}
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-slate-300 truncate">{title}</span>
              </nav>

              {/* Article Header */}
              <header className="mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
                <p className="text-xl text-slate-400 mb-6">{description}</p>

                {/* Freshness Signals - Important for AI agents */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Last updated: {lastUpdated}
                  </span>
                  {readingTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {readingTime}
                    </span>
                  )}
                </div>
              </header>

              {/* Main Content - Prose styling for AI-readable content */}
              <div className="prose prose-slate prose-invert max-w-none">
                {children}
              </div>

              {/* Related Content - Builds topical authority */}
              {relatedContent && relatedContent.length > 0 && (
                <section className="mt-16 pt-8 border-t border-slate-800">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-purple-500" />
                    Related Content
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {relatedContent.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block rounded-xl border border-slate-800 bg-slate-900/50 p-4 hover:border-purple-500/50 transition-colors"
                      >
                        <h3 className="font-semibold text-white hover:text-purple-400">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-400 line-clamp-2">
                          {item.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </article>

            {/* Sidebar - Table of Contents */}
            {tableOfContents && tableOfContents.length > 0 && (
              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <h3 className="text-sm font-semibold text-white mb-4">On This Page</h3>
                  <nav className="space-y-2">
                    {tableOfContents.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`block text-sm text-slate-400 hover:text-white transition-colors ${
                          item.level === 3 ? 'pl-4' : ''
                        }`}
                      >
                        {item.title}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

/**
 * Quotable Definition Block
 *
 * Creates a visually distinct definition that AI agents can easily extract.
 */
export function Definition({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <blockquote className="not-prose my-6 border-l-4 border-purple-500 bg-purple-500/10 rounded-r-xl p-4">
      <p className="text-slate-200">
        <strong className="text-white">{term}</strong> — {children}
      </p>
    </blockquote>
  );
}

/**
 * Quick Answer Block
 *
 * First-paragraph answer for AI extraction.
 */
export function QuickAnswer({ children }: { children: React.ReactNode }) {
  return (
    <div className="not-prose my-6 rounded-xl bg-cyan-500/10 border border-cyan-500/20 p-6">
      <div className="flex items-start gap-3">
        <span className="font-semibold text-cyan-400">Quick Answer:</span>
        <p className="text-slate-200">{children}</p>
      </div>
    </div>
  );
}

/**
 * TL;DR Block
 *
 * Summary that AI agents can extract as a standalone response.
 */
export function TLDR({ children }: { children: React.ReactNode }) {
  return (
    <div className="not-prose my-6 rounded-xl bg-amber-500/10 border border-amber-500/20 p-6">
      <div className="flex items-start gap-3">
        <span className="font-semibold text-amber-400">TL;DR:</span>
        <p className="text-slate-200">{children}</p>
      </div>
    </div>
  );
}
