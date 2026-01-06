# AI Architect Academy - Strategic Advancement Plan

> **Created**: January 2026
> **Purpose**: Transform the platform into a world-class learning experience with SEO-optimized micro-pages
> **Status**: Ready for Implementation

---

## Table of Contents

1. [Current State Assessment](#1-current-state-assessment)
2. [Ideal Customer Experience](#2-ideal-customer-experience)
3. [Technical Requirements Checklist](#3-technical-requirements-checklist)
4. [SEO Micro-Pages Strategy](#4-seo-micro-pages-strategy)
5. [Learning Experience Architecture](#5-learning-experience-architecture)
6. [Implementation Roadmap](#6-implementation-roadmap)
7. [Agent Team Assignments](#7-agent-team-assignments)

---

## 1. Current State Assessment

### What Exists

| Component | Status | Location |
|-----------|--------|----------|
| **Dashboard** | Built | `/dashboard/` - Next.js 16 + React 19 |
| **Pages** | 6 pages | Home, Vision, Agents, Skills, AGI Research, Offering |
| **Skills** | Configured | 80+ skills in catalog |
| **Agents** | Defined | 60+ agent teams |
| **Learning Paths** | Documented | 12+ paths in markdown |
| **Design Patterns** | Complete | 20+ enterprise patterns |
| **Templates** | Ready | Discovery, Strategy, Architecture |

### Gaps to Address

| Gap | Impact | Priority |
|-----|--------|----------|
| No individual skill pages | Poor SEO, no deep linking | **Critical** |
| No individual pattern pages | Missing organic traffic | **Critical** |
| No learning path detail pages | Weak user journey | **High** |
| No authentication/progress tracking | No personalization | **High** |
| No sitemap generation | Search indexing issues | **High** |
| No structured data (JSON-LD) | Poor rich snippets | **Medium** |
| No content CMS | Manual updates only | **Medium** |

---

## 2. Ideal Customer Experience

### 2.1 Customer Journey Map

```
DISCOVERY PHASE
───────────────────────────────────────────────────────────
Google Search                     LinkedIn Article
"RAG architecture patterns"       "Multi-agent AI systems"
        │                                │
        ▼                                ▼
┌─────────────────┐              ┌─────────────────┐
│ Micro-Page:     │              │ Micro-Page:     │
│ RAG Production  │              │ Multi-Agent     │
│ Pattern         │              │ Orchestration   │
└────────┬────────┘              └────────┬────────┘
         │                                │
         └──────────────┬─────────────────┘
                        ▼

ENGAGEMENT PHASE
───────────────────────────────────────────────────────────
                        │
                        ▼
             ┌─────────────────────┐
             │   Skills Catalog    │ ← Interactive filtering
             │   Pattern Library   │ ← Search & discovery
             │   Learning Paths    │ ← Progress indicators
             └──────────┬──────────┘
                        │
       ┌────────────────┼────────────────┐
       ▼                ▼                ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Skill Page  │  │ Pattern     │  │ Path        │
│ /skills/    │  │ /patterns/  │  │ /paths/     │
│ [slug]      │  │ [slug]      │  │ [slug]      │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                │                │
       └────────────────┴────────────────┘
                        │
                        ▼
             ┌─────────────────────┐
             │  Call-to-Action     │
             │  "Start Learning"   │
             └──────────┬──────────┘
                        │

CONVERSION PHASE
───────────────────────────────────────────────────────────
                        │
                        ▼
             ┌─────────────────────┐
             │   Account Creation  │ ← GitHub/Google OAuth
             │   Choose Your Path  │ ← Persona-based selection
             └──────────┬──────────┘
                        │
       ┌────────────────┼────────────────┐
       ▼                ▼                ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Student     │  │ Architect   │  │ Professor   │
│ Dashboard   │  │ Dashboard   │  │ Dashboard   │
└─────────────┘  └─────────────┘  └─────────────┘

RETENTION PHASE
───────────────────────────────────────────────────────────
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Progress     │    │ Certificates │    │ Community    │
│ Tracking     │    │ & Badges     │    │ Showcase     │
└──────────────┘    └──────────────┘    └──────────────┘
        │                   │                   │
        └───────────────────┴───────────────────┘
                            │
                            ▼
                  ┌─────────────────┐
                  │  Portfolio Page │ ← Public showcase
                  │  /u/[username]  │ ← Shareable link
                  └─────────────────┘
```

### 2.2 Experience Principles

| Principle | Implementation |
|-----------|----------------|
| **Zero Friction Start** | No signup required to browse; OAuth for tracking |
| **Progressive Disclosure** | Show depth as users go deeper |
| **Immediate Value** | Every page teaches something actionable |
| **Clear Next Steps** | Always show "what's next" |
| **Social Proof** | Testimonials, completion stats, community |
| **Mobile First** | Responsive, fast, offline-capable |

---

## 3. Technical Requirements Checklist

### 3.1 What You Need to Provide

#### Environment Variables (Required)

```env
# Authentication (Required for user accounts)
NEXTAUTH_SECRET=            # Generate: openssl rand -base64 32
NEXTAUTH_URL=               # https://ai-architect-academy.vercel.app

# OAuth Providers (At least one required)
GITHUB_CLIENT_ID=           # From GitHub OAuth App
GITHUB_CLIENT_SECRET=       # From GitHub OAuth App
GOOGLE_CLIENT_ID=           # From Google Cloud Console
GOOGLE_CLIENT_SECRET=       # From Google Cloud Console

# Database (Required for progress tracking)
DATABASE_URL=               # Supabase PostgreSQL connection string
DIRECT_URL=                 # Supabase direct connection (for migrations)

# Analytics (Recommended)
NEXT_PUBLIC_GA_ID=          # Google Analytics 4
NEXT_PUBLIC_POSTHOG_KEY=    # PostHog for product analytics

# AI Features (Optional, for AI assistant)
OPENAI_API_KEY=             # For AI-powered features
ANTHROPIC_API_KEY=          # For Claude integration

# SEO (Required)
NEXT_PUBLIC_SITE_URL=       # https://ai-architect-academy.vercel.app
```

#### OAuth App Setup

**GitHub OAuth:**
1. Go to GitHub Settings → Developer Settings → OAuth Apps
2. Create new OAuth App:
   - Application name: `AI Architect Academy`
   - Homepage URL: `https://ai-architect-academy.vercel.app`
   - Callback URL: `https://ai-architect-academy.vercel.app/api/auth/callback/github`
3. Copy Client ID and Client Secret

**Google OAuth:**
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Authorized redirect URIs: `https://ai-architect-academy.vercel.app/api/auth/callback/google`
3. Copy Client ID and Client Secret

#### Database Setup (Supabase)

1. Create Supabase project at https://supabase.com
2. Get connection strings from Settings → Database
3. Run migrations (I'll create these)

### 3.2 Technical Architecture

```
FRONTEND - Next.js 16 + React 19 + Tailwind CSS 4
───────────────────────────────────────────────────────────

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Static Pages │  │ Dynamic      │  │ API Routes   │
│ (SSG)        │  │ Pages (ISR)  │  │ (Edge)       │
└──────────────┘  └──────────────┘  └──────────────┘

/skills/[slug]    /u/[username]     /api/auth/*
/patterns/[slug]  /dashboard/*      /api/progress/*
/paths/[slug]                       /api/content/*

                        │
                        ▼

BACKEND
───────────────────────────────────────────────────────────

┌──────────────────────────────────────────────────────┐
│ NextAuth.js - Authentication                          │
│ - GitHub OAuth                                        │
│ - Google OAuth                                        │
│ - Session management                                  │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ Supabase - Database & Storage                         │
│ - User profiles                                       │
│ - Progress tracking                                   │
│ - Certificates                                        │
│ - Content metadata                                    │
└──────────────────────────────────────────────────────┘

                        │
                        ▼

DATA SOURCES
───────────────────────────────────────────────────────────

┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│ Markdown Files │  │ JSON/YAML      │  │ GitHub API     │
│ (Content)      │  │ (Metadata)     │  │ (Live stats)   │
└────────────────┘  └────────────────┘  └────────────────┘

/01-design-patterns/   /data/skills.json   Stars, forks,
/02-learning-paths/    /data/paths.json    contributors
/09-articles/          /data/agents.json
```

### 3.3 File Structure to Create

```
dashboard/
├── src/
│   ├── app/
│   │   ├── (marketing)/           # Public pages (SEO)
│   │   │   ├── skills/
│   │   │   │   ├── page.tsx       # Skills catalog
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx   # Individual skill [NEW]
│   │   │   ├── patterns/
│   │   │   │   ├── page.tsx       # Patterns catalog
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx   # Individual pattern [NEW]
│   │   │   ├── paths/
│   │   │   │   ├── page.tsx       # Learning paths
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx   # Individual path [NEW]
│   │   │   ├── agents/
│   │   │   │   ├── page.tsx       # Agent teams
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx   # Individual agent [NEW]
│   │   │   └── blog/
│   │   │       ├── page.tsx       # Blog listing [NEW]
│   │   │       └── [slug]/
│   │   │           └── page.tsx   # Blog post [NEW]
│   │   │
│   │   ├── (dashboard)/           # Protected pages
│   │   │   ├── layout.tsx         # Dashboard layout
│   │   │   ├── page.tsx           # Dashboard home
│   │   │   ├── progress/
│   │   │   │   └── page.tsx       # Progress tracking [NEW]
│   │   │   ├── certificates/
│   │   │   │   └── page.tsx       # Certificates [NEW]
│   │   │   └── settings/
│   │   │       └── page.tsx       # User settings [NEW]
│   │   │
│   │   ├── u/                     # Public profiles
│   │   │   └── [username]/
│   │   │       └── page.tsx       # Portfolio [NEW]
│   │   │
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts   # NextAuth [NEW]
│   │   │   ├── progress/
│   │   │   │   └── route.ts       # Progress API [NEW]
│   │   │   └── og/
│   │   │       └── [...slug]/
│   │   │           └── route.tsx  # OG images [NEW]
│   │   │
│   │   ├── sitemap.ts             # Dynamic sitemap [NEW]
│   │   └── robots.ts              # Robots.txt [NEW]
│   │
│   ├── data/                      # Content data [NEW]
│   │   ├── skills.ts              # Skills metadata
│   │   ├── patterns.ts            # Patterns metadata
│   │   ├── paths.ts               # Learning paths
│   │   └── agents.ts              # Agent teams
│   │
│   └── lib/
│       ├── auth.ts                # NextAuth config [NEW]
│       ├── db.ts                  # Supabase client [NEW]
│       └── seo.ts                 # SEO utilities [NEW]
│
├── prisma/
│   └── schema.prisma              # Database schema [NEW]
│
└── public/
    ├── og/                        # Pre-generated OG images
    └── icons/                     # Skill/pattern icons
```

---

## 4. SEO Micro-Pages Strategy

### 4.1 Page Types & URL Structure

| Page Type | URL Pattern | Count | SEO Target |
|-----------|-------------|-------|------------|
| **Skill Pages** | `/skills/[slug]` | 80+ | "Claude Code [skill]", "[skill] tutorial" |
| **Pattern Pages** | `/patterns/[slug]` | 20+ | "[pattern] architecture", "how to build [pattern]" |
| **Path Pages** | `/paths/[slug]` | 12+ | "learn [topic]", "[topic] course" |
| **Agent Pages** | `/agents/[slug]` | 60+ | "[agent] AI", "AI [agent] assistant" |
| **Blog Posts** | `/blog/[slug]` | unlimited | Long-tail keywords |

### 4.2 Keyword Strategy

#### Primary Keywords (High Volume)

| Keyword | Monthly Volume | Target Page |
|---------|---------------|-------------|
| "AI architecture" | 2,400 | Homepage |
| "RAG tutorial" | 1,900 | `/patterns/rag-production` |
| "multi-agent AI" | 1,600 | `/patterns/multi-agent-orchestration` |
| "AI governance" | 1,200 | `/paths/governance` |
| "LangGraph tutorial" | 890 | `/skills/langgraph-patterns` |
| "Claude Code skills" | 720 | `/skills` |
| "AI agent architecture" | 680 | `/agents` |
| "enterprise AI patterns" | 590 | `/patterns` |

#### Long-Tail Keywords (Per Micro-Page)

Each skill page targets:
```
/skills/oracle-adk
  - "Oracle ADK tutorial"
  - "Oracle Agent Development Kit guide"
  - "how to build AI agents with Oracle"
  - "OCI AI agents"
```

Each pattern page targets:
```
/patterns/rag-production
  - "production RAG architecture"
  - "RAG system design"
  - "how to build RAG with reranking"
  - "hybrid search RAG pattern"
```

### 4.3 On-Page SEO Requirements

Every micro-page must include:

1. **Meta Tags**: Title (60 chars), Description (155 chars), Keywords
2. **Open Graph**: Title, Description, Image (1200x630), Type
3. **Twitter Card**: Large image summary
4. **Canonical URL**: Self-referencing
5. **JSON-LD**: Structured data (TechArticle schema)
6. **Breadcrumbs**: With Schema.org markup
7. **Internal Links**: Related content, next steps
8. **H1-H6 Hierarchy**: Proper heading structure

### 4.4 Technical SEO Checklist

| Item | Implementation |
|------|----------------|
| **Sitemap** | Dynamic `/sitemap.ts` with all pages |
| **Robots.txt** | Allow all, point to sitemap |
| **Canonical URLs** | Every page has canonical |
| **OG Images** | Dynamic generation via `/api/og/[...slug]` |
| **JSON-LD** | Schema.org structured data |
| **Internal Linking** | Related skills, patterns, paths |
| **Breadcrumbs** | Schema.org BreadcrumbList |
| **Page Speed** | Target LCP < 2.5s, CLS < 0.1 |
| **Mobile Friendly** | Responsive, touch-friendly |
| **HTTPS** | Enforced by Vercel |

### 4.5 Content Template Per Page Type

#### Skill Page Content Structure

```
# [Skill Name]

## Overview
[2-3 paragraphs explaining what, why, when to use]

## Key Features
- Feature 1
- Feature 2
- Feature 3

## Quick Start
[Code example with command]

## Use Cases
1. Use case 1 with example
2. Use case 2 with example
3. Use case 3 with example

## Related Skills
- [Related Skill 1]
- [Related Skill 2]

## Learning Path
This skill is part of [Path Name].

## Community Examples
[Showcase from real users]
```

#### Pattern Page Content Structure

```
# [Pattern Name] Architecture Pattern

## Problem
[What problem does this solve?]

## Solution
[High-level solution overview]

## Architecture Diagram
[D2/Mermaid diagram]

## Components
[Table of components]

## Implementation Guide
[Step-by-step with code]

## When to Use / When NOT to Use

## Related Patterns
```

---

## 5. Learning Experience Architecture

### 5.1 Progression System

```
LEVELS
─────────────────────────────────────────────────────────
┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐
│  1  │→ │  2  │→ │  3  │→ │  4  │→ │  5  │
│     │  │     │  │     │  │     │  │     │
│ 0   │  │ 100 │  │ 300 │  │ 600 │  │1000 │ XP
└─────┘  └─────┘  └─────┘  └─────┘  └─────┘
Novice   Learner  Builder  Architect Master

XP EARNING
─────────────────────────────────────────────────────────
┌────────────────────────────┬────────┐
│ Activity                   │ XP     │
├────────────────────────────┼────────┤
│ Complete skill tutorial    │ +10    │
│ Complete pattern deep-dive │ +25    │
│ Finish learning path       │ +100   │
│ Earn certificate           │ +200   │
│ Contribute pattern         │ +50    │
│ Help in community          │ +5     │
│ Daily streak bonus         │ +5/day │
└────────────────────────────┴────────┘

BADGES
─────────────────────────────────────────────────────────
First Skill    Streak Master    Path Complete
Pattern Creator    Mentor    Expert
```

### 5.2 Learning Path Structure

Each path follows:

```
PATH HEADER
─────────────────────────────────────────────────────────
Title: 100-Hour AI Architect
Duration: 4 weeks
Difficulty: Intermediate
Prerequisites: Basic Python, API knowledge
Certificate: AI Architect Associate

MODULES
─────────────────────────────────────────────────────────
Module 1: Retrieval Foundations (Week 1)
├── Lesson 1.1: Tokenization & Embeddings
├── Lesson 1.2: Chunking Strategies
├── Lesson 1.3: Vector Databases
├── Project: Build RAG Chatbot
└── Quiz: Module 1 Assessment

Module 2: Agents & Tooling (Week 2)
├── Lesson 2.1: Function Calling
├── Lesson 2.2: LangGraph Workflows
├── Lesson 2.3: Observability with Langfuse
├── Project: Multi-Agent System
└── Quiz: Module 2 Assessment

... (continues)

CERTIFICATE REQUIREMENTS
─────────────────────────────────────────────────────────
✓ Complete all modules
✓ Pass all quizzes (>80%)
✓ Submit final project
→ Earn: AI Architect Associate Certificate
```

### 5.3 Interactive Features

| Feature | Purpose | Implementation |
|---------|---------|----------------|
| **Progress Bar** | Visual motivation | Database + UI component |
| **Checkmarks** | Completion tracking | Local + synced state |
| **Streaks** | Daily engagement | Login tracking |
| **Leaderboard** | Social competition | XP aggregation |
| **Study Groups** | Community learning | Discord integration |
| **Live Sessions** | Real-time learning | Cal.com integration |

### 5.4 Database Schema

```sql
-- Users (extends NextAuth)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  name VARCHAR,
  image VARCHAR,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak_days INTEGER DEFAULT 0,
  last_active_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Progress Tracking
CREATE TABLE progress (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  content_type VARCHAR, -- 'skill', 'pattern', 'path', 'lesson'
  content_slug VARCHAR,
  status VARCHAR, -- 'started', 'completed'
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Certificates
CREATE TABLE certificates (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  path_slug VARCHAR,
  certificate_id VARCHAR UNIQUE,
  issued_at TIMESTAMP DEFAULT NOW()
);

-- Badges
CREATE TABLE badges (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  badge_type VARCHAR,
  earned_at TIMESTAMP DEFAULT NOW()
);
```

---

## 6. Implementation Roadmap

### Phase 1: Foundation (Week 1-2)

| Task | Owner | Priority |
|------|-------|----------|
| Set up Supabase project | You | Critical |
| Create OAuth apps (GitHub, Google) | You | Critical |
| Configure environment variables | You | Critical |
| Database schema & migrations | Agent | High |
| NextAuth integration | Agent | High |
| Data layer (skills, patterns, paths) | Agent | High |

### Phase 2: Micro-Pages (Week 2-3)

| Task | Owner | Priority |
|------|-------|----------|
| Dynamic skill pages `/skills/[slug]` | Agent | Critical |
| Dynamic pattern pages `/patterns/[slug]` | Agent | Critical |
| Dynamic path pages `/paths/[slug]` | Agent | High |
| Dynamic agent pages `/agents/[slug]` | Agent | High |
| Sitemap generation | Agent | High |
| OG image generation | Agent | Medium |

### Phase 3: Learning Experience (Week 3-4)

| Task | Owner | Priority |
|------|-------|----------|
| Progress tracking system | Agent | High |
| XP & leveling system | Agent | Medium |
| Badge system | Agent | Medium |
| Certificate generation | Agent | Medium |
| User dashboard | Agent | High |

### Phase 4: Polish (Week 4-5)

| Task | Owner | Priority |
|------|-------|----------|
| SEO optimization pass | Agent | High |
| Performance optimization | Agent | High |
| Mobile experience polish | Agent | Medium |
| Analytics integration | Agent | Medium |
| Launch checklist | Both | Critical |

---

## 7. Agent Team Assignments

### Primary Agents for This Project

| Agent | Responsibility |
|-------|----------------|
| **Solution Architect Agent** | Overall architecture decisions |
| **Next.js Expert Agent** | Frontend implementation |
| **Database Architect Agent** | Schema design, queries |
| **SEO Specialist Agent** | Metadata, structured data |
| **UX Designer Agent** | User experience, flows |
| **Content Strategist Agent** | Page content, copy |

### Agent Workflow

```
User Request
    │
    ▼
┌─────────────────┐
│ Solution        │ ← Breaks down into tasks
│ Architect       │
└────────┬────────┘
         │
    ┌────┴────┬────────────┬────────────┐
    ▼         ▼            ▼            ▼
┌───────┐ ┌───────┐  ┌──────────┐ ┌─────────┐
│Next.js│ │Database│  │SEO       │ │UX       │
│Expert │ │Architect│ │Specialist│ │Designer │
└───────┘ └───────┘  └──────────┘ └─────────┘
    │         │            │            │
    └─────────┴────────────┴────────────┘
                    │
                    ▼
            ┌─────────────┐
            │ Code Review │
            │ & QA Agent  │
            └─────────────┘
                    │
                    ▼
            ┌─────────────┐
            │ Deployment  │
            └─────────────┘
```

---

## 8. Next Steps - Action Required

### What You Need to Provide

| Item | How to Get It | Priority |
|------|---------------|----------|
| **Supabase Project** | Create at supabase.com | Critical |
| **DATABASE_URL** | Supabase → Settings → Database | Critical |
| **GitHub OAuth** | GitHub → Settings → Developer → OAuth Apps | Critical |
| **Google OAuth** | Google Cloud Console → Credentials | Recommended |
| **Domain Confirmation** | Verify Vercel deployment URL | Critical |

### Once You Provide These, I Will:

1. **Create database schema** with Prisma migrations
2. **Build authentication system** with NextAuth
3. **Generate 80+ skill micro-pages** with SEO optimization
4. **Generate 20+ pattern micro-pages** with rich content
5. **Create dynamic sitemap** for search engines
6. **Build progress tracking** system
7. **Deploy and test** the complete experience

### Questions to Answer

1. **Authentication**: GitHub-only or also Google?
2. **Analytics**: GA4 or PostHog preference?
3. **Certificates**: PDF download or web verification page?
4. **Community**: Discord integration or in-app discussions?

---

**Ready to proceed? Share the credentials and I'll start building immediately.**
