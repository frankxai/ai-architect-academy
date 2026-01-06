import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center px-4">
          <div className="text-8xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            404
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white">Page Not Found</h1>
          <p className="mt-2 text-slate-400 max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 px-6 py-3 font-semibold text-white hover:from-purple-500 hover:to-cyan-500 transition-all"
            >
              <Home className="h-5 w-5" />
              Go Home
            </Link>
            <Link
              href="/skills/"
              className="flex items-center gap-2 rounded-xl border border-slate-700 px-6 py-3 font-semibold text-white hover:border-purple-500/50 hover:bg-slate-900 transition-all"
            >
              <Search className="h-5 w-5" />
              Browse Skills
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
