# V3 Marketplace Implementation Plan

> Actionable roadmap to launch the AI Architect Academy marketplace.

## Current State Assessment

### Completed (95% Design)
- [x] Database schema (32 models, 935 lines Prisma)
- [x] API routes (professors, marketplace)
- [x] UI pages (professor dashboard, marketplace browse)
- [x] Revenue model documentation
- [x] Partnership strategy

### Critical Gaps
| Gap | Impact | Priority |
|-----|--------|----------|
| PostgreSQL database not provisioned | Blocker | P0 |
| Stripe Connect not integrated | No payments | P0 |
| NextAuth not configured | No users | P0 |
| No seed data | Empty marketplace | P1 |
| Email notifications missing | Poor UX | P2 |

---

## Phase 1: Foundation (Days 1-3)

### Day 1: Database Setup

**Task 1.1: Provision PostgreSQL**
```bash
# Option A: Supabase (Recommended for speed)
# 1. Create project at supabase.com
# 2. Get connection string from Settings > Database

# Option B: OCI Autonomous Database
# oci db autonomous-database create ...

# Option C: Local development
docker run --name academy-db -e POSTGRES_PASSWORD=secret -p 5432:5432 -d postgres:15
```

**Task 1.2: Configure Prisma**
```bash
cd academy-dashboard

# Update .env
DATABASE_URL="postgresql://user:password@host:5432/academy?schema=public"

# Generate client and migrate
npx prisma generate
npx prisma migrate dev --name v3_marketplace
```

**Task 1.3: Verify Schema**
```bash
npx prisma studio  # Visual database browser
```

### Day 2: Authentication

**Task 2.1: Install NextAuth**
```bash
npm install next-auth @auth/prisma-adapter
```

**Task 2.2: Configure Providers**
```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user) {
        session.user.id = user.id
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }
```

**Task 2.3: Protect Routes**
```typescript
// middleware.ts
import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/auth/signin",
  },
})

export const config = {
  matcher: ["/professor/:path*", "/api/professors/:path*"],
}
```

### Day 3: Stripe Integration

**Task 3.1: Set Up Stripe Connect**
```bash
npm install stripe @stripe/stripe-js
```

**Task 3.2: Create Stripe Connect Account**
```typescript
// app/api/professors/stripe/connect/route.ts
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const { professorId } = await req.json()

  // Create connected account
  const account = await stripe.accounts.create({
    type: 'express',
    country: 'US',
    capabilities: {
      transfers: { requested: true },
    },
  })

  // Save to database
  await prisma.professorAccount.update({
    where: { id: professorId },
    data: { stripeAccountId: account.id },
  })

  // Create onboarding link
  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${process.env.NEXT_PUBLIC_URL}/professor/stripe/refresh`,
    return_url: `${process.env.NEXT_PUBLIC_URL}/professor/stripe/complete`,
    type: 'account_onboarding',
  })

  return Response.json({ url: accountLink.url })
}
```

**Task 3.3: Handle Purchases**
```typescript
// app/api/marketplace/checkout/route.ts
export async function POST(req: Request) {
  const { listingId, userId } = await req.json()

  const listing = await prisma.patternListing.findUnique({
    where: { id: listingId },
    include: { professor: true },
  })

  if (!listing) throw new Error('Listing not found')

  // Calculate split
  const platformFee = Math.round(listing.price * 0.30 * 100) // 30%
  const professorPayout = Math.round(listing.price * 0.70 * 100) // 70%

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: listing.pattern.title },
        unit_amount: Math.round(listing.price * 100),
      },
      quantity: 1,
    }],
    payment_intent_data: {
      application_fee_amount: platformFee,
      transfer_data: {
        destination: listing.professor.stripeAccountId!,
      },
    },
    success_url: `${process.env.NEXT_PUBLIC_URL}/marketplace/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/marketplace`,
    metadata: { listingId, userId },
  })

  return Response.json({ url: session.url })
}
```

---

## Phase 2: Core Features (Days 4-7)

### Day 4: Professor Onboarding UI

**Task 4.1: Create Onboarding Flow**
```
/professor/onboard
├── Step 1: Profile (name, bio, expertise)
├── Step 2: Stripe Connect
├── Step 3: First Pattern
└── Step 4: Dashboard
```

**Task 4.2: Professor Profile Form**
```typescript
// app/professor/onboard/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ProfessorOnboarding() {
  const [step, setStep] = useState(1)
  const router = useRouter()

  const handleProfileSubmit = async (data: FormData) => {
    await fetch("/api/professors/onboard", {
      method: "POST",
      body: JSON.stringify({
        displayName: data.get("displayName"),
        bio: data.get("bio"),
        expertise: data.get("expertise")?.toString().split(","),
      }),
    })
    setStep(2)
  }

  const handleStripeConnect = async () => {
    const res = await fetch("/api/professors/stripe/connect", {
      method: "POST",
    })
    const { url } = await res.json()
    window.location.href = url
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      {step === 1 && <ProfileForm onSubmit={handleProfileSubmit} />}
      {step === 2 && <StripeConnectStep onConnect={handleStripeConnect} />}
      {step === 3 && <CreateFirstPattern />}
    </div>
  )
}
```

### Day 5: Pattern Creation Workflow

**Task 5.1: Pattern Creation Form**
```typescript
// app/professor/patterns/new/page.tsx
const patternSchema = {
  title: string,
  description: string,
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
  techStack: string[],
  industries: string[],
  priceType: "FREE" | "PAID",
  price: number,
  repoUrl: string,
  demoUrl: string,
}
```

**Task 5.2: Pattern Preview**
- Live preview of listing card
- Estimated revenue calculator
- Publish/Draft toggle

### Day 6: Purchase Flow

**Task 6.1: Pattern Detail Page**
```
/marketplace/patterns/[id]
├── Pattern info (title, description, tech stack)
├── Professor profile card
├── Reviews section
├── Purchase button → Stripe Checkout
└── Related patterns
```

**Task 6.2: Post-Purchase Access**
```typescript
// After successful payment webhook:
// 1. Create Purchase record
// 2. Grant access to pattern
// 3. Send confirmation email
// 4. Update professor analytics
```

### Day 7: Review System

**Task 7.1: Review Form**
```typescript
// Only show if user has purchased
const canReview = purchases.some(p => p.listingId === listing.id)

// Submit review
await prisma.review.create({
  data: {
    userId,
    listingId,
    professorId: listing.professorId,
    rating,
    title,
    content,
  },
})

// Update listing average
await updateListingRating(listingId)
```

---

## Phase 3: Polish (Days 8-10)

### Day 8: Analytics Dashboards

**Professor Dashboard Enhancements:**
- Revenue by pattern chart
- Student geographic distribution
- Review sentiment analysis
- Conversion funnel (views → purchases)

**Platform Dashboard:**
- Total GMV
- Active professors
- Pattern performance
- Enterprise pipeline

### Day 9: Email Notifications

**Transactional Emails:**
```typescript
// Using Resend or SendGrid
const emails = {
  "purchase.complete": {
    to: "student",
    subject: "Your pattern is ready!",
    template: "purchase-complete",
  },
  "sale.notification": {
    to: "professor",
    subject: "You made a sale!",
    template: "sale-notification",
  },
  "review.received": {
    to: "professor",
    subject: "New review on your pattern",
    template: "review-received",
  },
  "payout.sent": {
    to: "professor",
    subject: "Your payout has been sent",
    template: "payout-sent",
  },
}
```

### Day 10: Seed Data & Testing

**Task 10.1: Create Seed Script**
```typescript
// prisma/seed.ts
const professors = [
  {
    displayName: "Alex Chen",
    bio: "10+ years building AI systems at scale",
    expertise: ["RAG", "LLM", "MLOps"],
    tier: "EXPERT",
    verified: true,
  },
  // ... 9 more professors
]

const patterns = [
  {
    title: "Production RAG Pipeline",
    difficulty: "ADVANCED",
    price: 49,
    techStack: ["Python", "LangChain", "Pinecone"],
  },
  // ... 19 more patterns
]
```

**Task 10.2: End-to-End Testing**
```bash
# Test flows:
# 1. Sign up → Browse → Purchase → Access pattern
# 2. Become professor → Create pattern → Get sale → Receive payout
# 3. Enterprise signup → Assign licenses → Track progress
```

---

## Phase 4: Launch (Days 11-14)

### Day 11: Beta Testing

**Beta Cohort:**
- 10 professors (hand-picked experts)
- 100 students (waitlist)
- 5 enterprise prospects

**Feedback Collection:**
- In-app feedback widget
- Weekly calls with professors
- NPS survey after first purchase

### Day 12: Performance & Security

**Performance Checklist:**
- [ ] Page load < 2s (Lighthouse)
- [ ] API response < 500ms
- [ ] Stripe webhook reliability
- [ ] CDN for static assets

**Security Checklist:**
- [ ] Input validation on all APIs
- [ ] SQL injection prevention (Prisma handles)
- [ ] XSS prevention (React handles)
- [ ] Rate limiting on APIs
- [ ] Stripe webhook signature verification

### Day 13: Deployment

**Vercel Deployment:**
```bash
# Environment variables
NEXT_PUBLIC_URL=https://ai-architect-academy.com
DATABASE_URL=postgresql://...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXTAUTH_SECRET=...
GITHUB_ID=...
GITHUB_SECRET=...
```

**DNS & SSL:**
- Configure custom domain
- SSL auto-provisioned by Vercel

### Day 14: Public Launch

**Launch Checklist:**
- [ ] ProductHunt submission
- [ ] Twitter/X announcement
- [ ] LinkedIn post
- [ ] Email to waitlist
- [ ] Discord community opening
- [ ] First 24h monitoring

---

## Success Metrics (30 Days Post-Launch)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Professors onboarded | 50 | Database count |
| Patterns listed | 100 | Database count |
| Purchases completed | 200 | Stripe dashboard |
| Revenue generated | $10k | Stripe dashboard |
| Enterprise leads | 10 | CRM |

---

## Technical Decisions

### Why Supabase for Database?
- Instant PostgreSQL provisioning
- Built-in auth (backup to NextAuth)
- Real-time subscriptions (future)
- Edge functions (future)
- Free tier for MVP

### Why Stripe Connect?
- Industry standard for marketplaces
- Handles tax/compliance
- Express onboarding (5 min)
- Automatic payouts
- 70/30 split built-in

### Why Next.js 14+?
- App Router for better DX
- Server Components for performance
- API Routes for backend
- Vercel deployment optimized
- React Server Components

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Stripe Connect delays | Start onboarding early, have manual payout fallback |
| Low professor supply | Seed with internal content, offer incentives |
| Payment disputes | Clear refund policy, pattern previews |
| Scale issues | Vercel auto-scaling, database connection pooling |

---

## Commands Reference

```bash
# Development
cd academy-dashboard
npm run dev

# Database
npx prisma studio
npx prisma migrate dev
npx prisma db seed

# Deployment
vercel --prod

# Stripe CLI (testing webhooks)
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## Files to Create/Modify

```
academy-dashboard/
├── .env.local                    # Environment variables
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # NEW
│   │   ├── professors/
│   │   │   └── stripe/
│   │   │       ├── connect/route.ts     # NEW
│   │   │       └── webhook/route.ts     # NEW
│   │   └── webhooks/
│   │       └── stripe/route.ts          # NEW
│   ├── auth/
│   │   └── signin/page.tsx              # NEW
│   ├── professor/
│   │   ├── onboard/page.tsx             # NEW
│   │   └── patterns/
│   │       └── new/page.tsx             # NEW
│   └── marketplace/
│       ├── patterns/[id]/page.tsx       # NEW
│       └── success/page.tsx             # NEW
├── middleware.ts                         # NEW
├── prisma/
│   └── seed.ts                          # NEW
└── lib/
    ├── stripe.ts                        # NEW
    └── email.ts                         # NEW
```

---

**Total Estimated Time:** 14 days to MVP launch
**Team Required:** 1-2 full-stack developers
**Budget:** ~$500/mo (Supabase Pro + Vercel Pro + Stripe fees)
