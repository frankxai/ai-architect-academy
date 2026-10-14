import type { MetadataRoute } from 'next'
import { projectProductionAgentSystems as project } from '@/lib/academy-graph'
import studio from '@/data/studio-catalog.json'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aiarchitectacademy.com'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE}/start`, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${SITE}/library`, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${SITE}/architectures`, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${SITE}/studio`, changeFrequency: 'weekly', priority: 0.85 },
    ...studio.patterns.map((p) => ({
      url: `${SITE}/studio/${p.id}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    { url: `${SITE}/studio/partners`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE}/studio/inventions`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE}/path`, changeFrequency: 'weekly', priority: 0.95 },
    ...project.stages.map((s) => ({
      url: `${SITE}/path/${s.id.replace(/^stage:/, '')}`,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),
    { url: `${SITE}/adr`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE}/worked-run`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE}/curriculum`, changeFrequency: 'weekly', priority: 0.8 },
  ]
}
