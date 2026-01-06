import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://ai-architect-academy.vercel.app'),
  title: {
    default: 'AI Architect Academy - Design, Ship & Operate AI Systems',
    template: '%s | AI Architect Academy',
  },
  description:
    'The complete playbook for enterprise AI architecture. 80+ skills, 60+ agents, 200+ patterns. Learn to design, ship, and operate production AI systems.',
  keywords: [
    'AI architecture',
    'enterprise AI',
    'RAG systems',
    'multi-agent AI',
    'LangGraph',
    'Claude Code',
    'AI governance',
    'LLMOps',
  ],
  authors: [{ name: 'AI Architect Academy' }],
  creator: 'AI Architect Academy',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ai-architect-academy.vercel.app',
    siteName: 'AI Architect Academy',
    title: 'AI Architect Academy - Design, Ship & Operate AI Systems',
    description:
      'The complete playbook for enterprise AI architecture. 80+ skills, 60+ agents, 200+ patterns.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Architect Academy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Architect Academy',
    description: 'Design, Ship & Operate AI Systems',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
