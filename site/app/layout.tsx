import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aiarchitectacademy.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'AI Architect Academy — for the engineer who was just handed the AI work',
    template: '%s — AI Architect Academy',
  },
  description:
    'The docs teach the APIs. Nobody teaches which decision comes first, which one you cannot undo, and what getting it wrong costs. A cohort course built in the open. Waitlist, not checkout.',
  openGraph: {
    type: 'website',
    siteName: 'AI Architect Academy',
    title: 'AI Architect Academy',
    description:
      'For the engineer who was just handed the AI work. Judgement and sequence, taught by building. Waitlist open, no date yet.',
    url: SITE,
  },
  twitter: { card: 'summary' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-paper focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <header className="mx-auto flex w-full max-w-5xl flex-wrap items-baseline justify-between gap-x-8 gap-y-2 px-6 pt-7 sm:px-8">
          <Link href="/" className="display text-lg whitespace-nowrap">
            AI Architect Academy
          </Link>
          <nav aria-label="Primary" className="flex gap-5 text-sm whitespace-nowrap sm:gap-6">
            <Link href="/curriculum" className="hover:text-cobalt">
              What exists
            </Link>
            <Link href="/adr" className="hover:text-cobalt">
              Free ADR
            </Link>
            <Link href="/#waitlist" className="hover:text-cobalt">
              Waitlist
            </Link>
          </nav>
        </header>
        <main id="main" className="mx-auto w-full max-w-5xl px-6 sm:px-8">
          {children}
        </main>
        <footer className="mx-auto w-full max-w-5xl px-6 pb-14 pt-10 sm:px-8">
          <div className="rule pt-8 text-sm" style={{ color: 'var(--ink-3)' }}>
            <p className="measure">
              AI Architect Academy is independent work by Frank Riemer. It is not affiliated with, endorsed by, or
              sponsored by any employer, vendor, or client, and nothing on this site describes any organisation he
              has worked for.
            </p>
            <p className="mt-3">
              Source:{' '}
              <a className="link" href="https://github.com/frankxai/ai-architect-academy">
                github.com/frankxai/ai-architect-academy
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
