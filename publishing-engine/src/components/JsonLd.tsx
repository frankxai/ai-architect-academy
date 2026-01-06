/**
 * JSON-LD Structured Data Component
 *
 * This component provides schema.org structured data that AI agents
 * can parse programmatically. Critical for AI-optimized content.
 *
 * Uses Next.js Script component for safe injection.
 */

import Script from 'next/script';

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  // Safely serialize the JSON-LD data
  const jsonString = JSON.stringify(data, null, 0);

  return (
    <Script
      id={`json-ld-${data['@type'] || 'generic'}`}
      type="application/ld+json"
      strategy="afterInteractive"
    >
      {jsonString}
    </Script>
  );
}

// Helper to create structured data objects (not components, just data)

export function createConceptSchema({
  name,
  description,
  url,
  datePublished,
  dateModified,
}: {
  name: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name,
    description,
    url,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'AI Architecture Concepts',
      url: 'https://ai-architect-academy.vercel.app/concepts/',
    },
    datePublished,
    dateModified,
    author: {
      '@type': 'Organization',
      name: 'AI Architect Academy',
      url: 'https://ai-architect-academy.vercel.app',
    },
  };
}

export function createGuideSchema({
  name,
  description,
  url,
  datePublished,
  dateModified,
  steps,
  totalTime,
}: {
  name: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  steps: { name: string; text: string }[];
  totalTime?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    url,
    datePublished,
    dateModified,
    totalTime,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
    author: {
      '@type': 'Organization',
      name: 'AI Architect Academy',
      url: 'https://ai-architect-academy.vercel.app',
    },
  };
}

export function createComparisonSchema({
  name,
  description,
  url,
  datePublished,
  dateModified,
  items,
}: {
  name: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  items: { name: string; description: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    description,
    url,
    datePublished,
    dateModified,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      description: item.description,
    })),
    author: {
      '@type': 'Organization',
      name: 'AI Architect Academy',
      url: 'https://ai-architect-academy.vercel.app',
    },
  };
}

export function createFAQSchema(questions: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
}

export function createArticleSchema({
  headline,
  description,
  url,
  datePublished,
  dateModified,
  keywords,
}: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  keywords?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline,
    description,
    url,
    datePublished,
    dateModified,
    keywords: keywords?.join(', '),
    author: {
      '@type': 'Organization',
      name: 'AI Architect Academy',
      url: 'https://ai-architect-academy.vercel.app',
    },
    publisher: {
      '@type': 'Organization',
      name: 'AI Architect Academy',
      url: 'https://ai-architect-academy.vercel.app',
    },
  };
}
