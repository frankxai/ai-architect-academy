'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Brain, Sparkles } from 'lucide-react';

const navigation = [
  { name: 'Skills', href: '/skills/' },
  { name: 'Patterns', href: '/patterns/' },
  { name: 'Paths', href: '/paths/' },
  { name: 'Pricing', href: '/pricing/' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Brain className="h-8 w-8 text-purple-500 group-hover:text-purple-400 transition-colors" />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-cyan-400 animate-pulse" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              AI Architect Academy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="https://github.com/frankx/ai-architect-academy"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Link>
            <Link
              href="/paths/100-hour-ai-architect/"
              className="rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:from-purple-500 hover:to-cyan-500 transition-all"
            >
              Start Learning
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden rounded-lg p-2 text-slate-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800">
            <div className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-base font-medium text-slate-300 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/paths/100-hour-ai-architect/"
                className="mt-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 px-4 py-2 text-center text-sm font-semibold text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Start Learning
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
