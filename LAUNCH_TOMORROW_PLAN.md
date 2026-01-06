# Launch Tomorrow - Landing Page + SEO Engine

> **Goal**: Ship a beautiful marketing site with 150+ SEO-optimized micro-pages
> **Timeline**: Launch tomorrow
> **Complexity**: Minimal - no auth, no database, just static pages

---

## What We're Building (Phase 1)

### Included
- Landing page (home)
- Vision page
- Skills catalog + 80 individual skill pages
- Patterns catalog + 20 individual pattern pages
- Learning paths catalog + 12 individual path pages
- Agents showcase + department pages
- AGI Research page
- Offering/Pricing page
- Dynamic sitemap.xml
- robots.txt
- OG image generation
- Full SEO optimization

### NOT Included (Phase 2 - Later)
- User authentication
- Progress tracking
- Certificates
- User dashboards
- Database

---

## Technical Approach

### Stack (Keep It Simple)
- **Next.js 16** with App Router
- **Static Generation (SSG)** for all pages
- **Tailwind CSS 4** for styling
- **Vercel** for hosting
- **No database** - all content from TypeScript files

### URL Structure

```
/                           → Landing page
/vision                     → Platform vision
/skills                     → Skills catalog (listing)
/skills/[slug]              → Individual skill page (x80)
/patterns                   → Patterns catalog (listing)
/patterns/[slug]            → Individual pattern page (x20)
/paths                      → Learning paths (listing)
/paths/[slug]               → Individual path page (x12)
/agents                     → Agent teams (listing)
/agi-research               → AGI Research hub
/offering                   → Pricing tiers
/sitemap.xml                → Dynamic sitemap
/robots.txt                 → Search engine rules
```

**Total Pages**: ~150 SEO-optimized pages

---

## File Structure to Create

```
dashboard/src/
├── app/
│   ├── page.tsx                    # Landing (exists)
│   ├── vision/page.tsx             # Vision (exists)
│   ├── offering/page.tsx           # Offering (exists)
│   ├── agi-research/page.tsx       # AGI (exists)
│   │
│   ├── skills/
│   │   ├── page.tsx                # Catalog (exists)
│   │   └── [slug]/
│   │       └── page.tsx            # Individual [NEW]
│   │
│   ├── patterns/
│   │   ├── page.tsx                # Catalog [NEW]
│   │   └── [slug]/
│   │       └── page.tsx            # Individual [NEW]
│   │
│   ├── paths/
│   │   ├── page.tsx                # Catalog [NEW]
│   │   └── [slug]/
│   │       └── page.tsx            # Individual [NEW]
│   │
│   ├── agents/
│   │   └── page.tsx                # Showcase (exists)
│   │
│   ├── sitemap.ts                  # Dynamic sitemap [NEW]
│   └── robots.ts                   # Robots.txt [NEW]
│
├── data/                           # Content data [NEW]
│   ├── skills.ts                   # 80 skills
│   ├── patterns.ts                 # 20 patterns
│   ├── paths.ts                    # 12 learning paths
│   └── agents.ts                   # Agent teams
│
└── lib/
    └── seo.ts                      # SEO utilities [NEW]
```

---

## Content Data Structure

### skills.ts
```typescript
export const skills = [
  {
    slug: 'oracle-adk',
    name: 'Oracle ADK',
    command: '/oracle-adk',
    category: 'AI Architecture',
    level: 'advanced',
    description: 'Oracle Agent Development Kit for building multi-agent applications on OCI',
    longDescription: '...',  // For the page
    features: ['Multi-agent orchestration', 'OCI integration', '...'],
    useCases: ['Customer service bots', 'Document processing', '...'],
    relatedSkills: ['oracle-agent-spec', 'oci-services-expert'],
    keywords: ['oracle adk', 'oracle agent development kit', '...'],
  },
  // ... 79 more
];
```

### patterns.ts
```typescript
export const patterns = [
  {
    slug: 'rag-production',
    name: 'RAG Production Pattern',
    category: 'Retrieval',
    difficulty: 'intermediate',
    description: 'Production-ready RAG with hybrid search and reranking',
    problem: 'Building RAG systems that work at scale...',
    solution: 'Combine semantic chunking, hybrid search...',
    components: [...],
    implementation: '...',
    relatedPatterns: ['ai-gateway', 'multi-agent-orchestration'],
    keywords: ['rag architecture', 'production rag', '...'],
  },
  // ... 19 more
];
```

---

## SEO Per Page

### Meta Tags (generateMetadata)
```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const skill = getSkillBySlug(params.slug);

  return {
    title: `${skill.name} | AI Architect Academy`,
    description: skill.description,
    keywords: skill.keywords,
    openGraph: {
      title: skill.name,
      description: skill.description,
      url: `https://ai-architect-academy.vercel.app/skills/${skill.slug}`,
      type: 'article',
      images: [{ url: `/og/skills/${skill.slug}.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
    },
    alternates: {
      canonical: `https://ai-architect-academy.vercel.app/skills/${skill.slug}`,
    },
  };
}
```

### Static Generation
```typescript
export async function generateStaticParams() {
  return skills.map((skill) => ({
    slug: skill.slug,
  }));
}
```

---

## Launch Checklist

### Today (Build)
- [ ] Create `/data/skills.ts` with all 80 skills
- [ ] Create `/data/patterns.ts` with all 20 patterns
- [ ] Create `/data/paths.ts` with all 12 paths
- [ ] Build `/skills/[slug]/page.tsx`
- [ ] Build `/patterns/page.tsx` and `/patterns/[slug]/page.tsx`
- [ ] Build `/paths/page.tsx` and `/paths/[slug]/page.tsx`
- [ ] Create `sitemap.ts`
- [ ] Create `robots.ts`
- [ ] Test locally

### Tomorrow (Deploy)
- [ ] Push to GitHub
- [ ] Deploy to Vercel
- [ ] Verify all pages render
- [ ] Submit sitemap to Google Search Console
- [ ] Share launch!

---

## Environment Variables (Minimal)

```env
# Only need these for Phase 1
NEXT_PUBLIC_SITE_URL=https://ai-architect-academy.vercel.app
NEXT_PUBLIC_GA_ID=G-XXXXXXXX  # Optional: Google Analytics
```

---

## What You Need to Provide

For tomorrow's launch, I only need:

1. **Confirmation** to proceed with building
2. **Google Analytics ID** (optional, can add later)
3. **Any specific skills/patterns to prioritize** in the content

Everything else I can build from the existing markdown files in your repo.

---

## Phase 2 (Next Week)

After launch, we add:
- User authentication (NextAuth + Supabase)
- Progress tracking
- User dashboards
- Certificates
- Community features

---

**Ready to build? Say "go" and I'll start creating the micro-pages.**
