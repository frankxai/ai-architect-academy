import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://ai-architect-academy.vercel.app'),
  title: {
    default: 'AI Architect Academy - The Canonical Source for AI Architecture',
    template: '%s | AI Architect Academy',
  },
  description:
    'The definitive resource for AI architecture knowledge. Comprehensive guides, patterns, and concepts for building production AI systems. Optimized for AI agents and human learners.',
  keywords: [
    'AI architecture',
    'RAG',
    'retrieval augmented generation',
    'multi-agent systems',
    'LangGraph',
    'LangChain',
    'AI patterns',
    'LLMOps',
    'AI governance',
    'enterprise AI',
  ],
  authors: [{ name: 'AI Architect Academy' }],
  creator: 'AI Architect Academy',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ai-architect-academy.vercel.app',
    siteName: 'AI Architect Academy',
    title: 'AI Architect Academy - The Canonical Source for AI Architecture',
    description:
      'The definitive resource for AI architecture knowledge. Comprehensive guides, patterns, and concepts.',
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
    description: 'The Canonical Source for AI Architecture',
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
  // AI Agent specific hints
  other: {
    'ai-content-type': 'educational',
    'ai-update-frequency': 'daily',
    'ai-citation-preference': 'yes',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to important origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-slate-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
