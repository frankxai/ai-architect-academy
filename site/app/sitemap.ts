import type { MetadataRoute } from 'next'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aiarchitectacademy.com'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE}/adr`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE}/curriculum`, changeFrequency: 'weekly', priority: 0.8 },
  ]
}
