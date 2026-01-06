import { MetadataRoute } from 'next';
import { getAllSkillSlugs } from '@/data/skills';
import { getAllPatternSlugs } from '@/data/patterns';
import { getAllPathSlugs } from '@/data/paths';

const baseUrl = 'https://ai-architect-academy.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const skillSlugs = getAllSkillSlugs();
  const patternSlugs = getAllPatternSlugs();
  const pathSlugs = getAllPathSlugs();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/skills/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/patterns/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/paths/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // Skill pages
  const skillPages: MetadataRoute.Sitemap = skillSlugs.map((slug) => ({
    url: `${baseUrl}/skills/${slug}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Pattern pages
  const patternPages: MetadataRoute.Sitemap = patternSlugs.map((slug) => ({
    url: `${baseUrl}/patterns/${slug}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Path pages
  const pathPages: MetadataRoute.Sitemap = pathSlugs.map((slug) => ({
    url: `${baseUrl}/paths/${slug}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...skillPages, ...patternPages, ...pathPages];
}
