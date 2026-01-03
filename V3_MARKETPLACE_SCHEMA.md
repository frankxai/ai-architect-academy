# V3 Marketplace Schema Documentation

## Overview

V3 enhances the AI Architect Academy platform with complete marketplace and monetization capabilities. This evolution transforms the platform from a learning + factory system into a three-sided marketplace where students learn, professors sell, and enterprises hire.

## Schema Evolution

- **V1**: Pure learning platform (knowledge graph + certifications)
- **V2**: Hybrid academy + factory (deployable patterns + portfolios)
- **V3**: Full marketplace ecosystem (professors + enterprises + partnerships)

## New Models

### 1. ProfessorAccount

Content creators and instructors who build and sell patterns.

```prisma
model ProfessorAccount {
  id              String   @id @default(cuid())
  userId          String   @unique

  // Profile
  displayName     String
  bio             String?  @db.Text
  expertise       String[]
  website         String?
  github          String?
  linkedin        String?

  // Verification & tier
  verified        Boolean       @default(false)
  tier            ProfessorTier @default(COMMUNITY)

  // Payment (Stripe Connect)
  stripeAccountId String?  @unique
  payoutEnabled   Boolean  @default(false)

  // Analytics
  totalStudents   Int      @default(0)
  totalRevenue    Float    @default(0) // USD
  avgRating       Float?   // 1-5
  totalReviews    Int      @default(0)
  patternsCreated Int      @default(0)
  workshopsSold   Int      @default(0)
}
```

**Professor Tiers:**
- **COMMUNITY** (Free): Can contribute free patterns, build reputation
- **CREATOR** ($99/mo): Sell patterns, 70% revenue share
- **EXPERT** ($299/mo): Workshops, private sessions, priority support

### 2. PatternListing

Marketplace listings for deployable patterns.

```prisma
model PatternListing {
  id          String   @id @default(cuid())
  patternId   String   @unique  // One-to-one with DeployablePattern
  professorId String

  // Pricing
  priceType   PriceType @default(FREE)
  price       Float     @default(0)

  // Sales & ratings
  totalSales   Int    @default(0)
  totalRevenue Float  @default(0)
  avgRating    Float?
  reviewCount  Int    @default(0)

  // Discovery
  tags         String[]
  industries   String[]
  isPublished  Boolean @default(false)
  isFeatured   Boolean @default(false)
}
```

**Price Types:**
- **FREE**: Open source patterns (reputation building)
- **PAID**: One-time purchase ($19-$199)
- **SUBSCRIPTION**: Monthly access to pattern suite

### 3. Purchase

Transaction tracking with automatic revenue splits.

```prisma
model Purchase {
  id              String   @id @default(cuid())
  userId          String
  listingId       String

  // Transaction
  amount          Float    // Total
  platformFee     Float    // 30%
  professorPayout Float    // 70%

  // Payment
  stripePaymentId String?  @unique
  status          PurchaseStatus
  accessGranted   Boolean  @default(false)
}
```

**Revenue Split:**
- Platform: 30% (infrastructure, hosting, marketing)
- Professor: 70% (content creation, support)

### 4. Revenue

Monthly revenue tracking and payouts for professors.

```prisma
model Revenue {
  id              String   @id @default(cuid())
  professorId     String
  period          String   // "2024-01"

  // Amounts
  grossRevenue    Float    @default(0)  // Total sales
  platformFee     Float    @default(0)  // 30%
  netRevenue      Float    @default(0)  // 70%

  // Payout
  payoutStatus    PayoutStatus
  payoutDate      DateTime?
  stripePayoutId  String?
}
```

**Payout Schedule:**
- Calculated monthly
- Paid via Stripe Connect on day 1 of following month
- Minimum threshold: $50

### 5. Review

Ratings and reviews for patterns and professors.

```prisma
model Review {
  id          String   @id @default(cuid())
  userId      String
  listingId   String
  professorId String

  rating      Int      // 1-5
  title       String?
  content     String?  @db.Text
  isPublished Boolean  @default(true)
}
```

**Review Rules:**
- Must purchase to review
- One review per user per listing
- Professors can respond
- Moderation for abuse

### 6. EnterpriseAccount

B2B customers with team licenses and custom features.

```prisma
model EnterpriseAccount {
  id            String   @id @default(cuid())
  companyName   String
  industry      String
  size          EnterpriseSize

  // Account
  tier          EnterpriseTier
  status        AccountStatus

  // Billing
  stripeCustomerId String? @unique
  contractStart    DateTime?
  contractEnd      DateTime?
  annualValue      Float?

  // Usage
  activeSeats   Int  @default(0)
  maxSeats      Int  @default(10)
}
```

**Enterprise Tiers:**
- **TALENT_PIPELINE** ($5k/year): Hire certified architects
- **PRIVATE_ACADEMY** ($25k/year): Custom tracks, private patterns
- **TRAINING_PROGRAM** ($100k/year): Train existing team, dedicated support

### 7. EnterpriseLicense

Individual user seats within enterprise accounts.

```prisma
model EnterpriseLicense {
  id           String   @id @default(cuid())
  enterpriseId String
  userId       String   @unique

  role         EnterpriseRole
  isActive     Boolean  @default(true)
  assignedAt   DateTime @default(now())
  revokedAt    DateTime?
}
```

**Enterprise Roles:**
- **LEARNER**: Access assigned tracks
- **ADMIN**: Manage licenses, view analytics
- **MANAGER**: Curate content, assign tracks

### 8. Partnership

Strategic partnerships with cloud providers, AI companies, etc.

```prisma
model Partnership {
  id           String   @id @default(cuid())
  partnerName  String
  partnerType  PartnerType

  // Deal structure
  dealType     DealType
  revenueShare Float?   // percentage
  annualValue  Float?

  status       PartnershipStatus
  contractStart DateTime?
  contractEnd   DateTime?

  // Tracking
  notes        String?  @db.Text
  metrics      Json?
}
```

**Partner Types:**
- **CLOUD_PROVIDER**: AWS, Azure, GCP (deployment credits)
- **AI_COMPANY**: OpenAI, Anthropic (API credits, co-marketing)
- **CONSULTING_FIRM**: McKinsey, Deloitte (talent pipeline)
- **TECHNOLOGY_VENDOR**: LangChain, Pinecone (integrations)
- **EDUCATION**: Universities, bootcamps (curriculum)

**Deal Types:**
- **REFERRAL**: Partners send customers (10% commission)
- **INTEGRATION**: Technical partnership (free tier access)
- **CO_MARKETING**: Joint campaigns (50/50 split)
- **RESELLER**: Partners sell platform (20% margin)
- **WHITE_LABEL**: Rebrand content (custom pricing)

## Updated Models

### DeployablePattern (Enhanced)

Added marketplace listing relation:

```prisma
model DeployablePattern {
  // ... existing fields ...

  listing     PatternListing?   // V3: Marketplace listing
}
```

### User (Enhanced)

Added marketplace relations:

```prisma
model User {
  // V1 relations
  profile           LearnerProfile?
  progress          LearnerProgress[]

  // V2 Factory relations
  journeyEnrollments JourneyEnrollment[]
  deployments        PatternDeployment[]
  portfolio          Portfolio?

  // V3 Marketplace relations
  professorAccount  ProfessorAccount?
  purchases         Purchase[]
  reviews           Review[]
  enterpriseLicense EnterpriseLicense?
}
```

## Revenue Model

### Student Subscriptions

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | 50+ free patterns, community support |
| **Pro** | $29/mo | All free patterns, 20% marketplace discount |
| **Architect** | $99/mo | Everything + workshops, certification fast-track |

### Marketplace Revenue

```
Pattern Sale: $49
├── Platform Fee (30%): $14.70
└── Professor Payout (70%): $34.30
```

**Annual Projections:**
- 10,000 students × $29/mo × 30% paid = $1,044,000/year
- 500 pattern sales/mo × $49 avg × 30% = $88,200/year
- 50 enterprises × $25k/year = $1,250,000/year
- **Total: $2.38M ARR**

### Professor Economics

**Community Professor (Free tier):**
- Publish free patterns
- Build reputation score
- Earn badges and recognition
- Path to Creator tier

**Creator Professor ($99/mo):**
- Sell patterns (70% split)
- Average: $2,500/mo from 5 pattern sales × $49 × 70%
- ROI: 25x subscription cost

**Expert Professor ($299/mo):**
- Pattern sales + workshops ($199 each)
- Private coaching ($500/session)
- Average: $8,000/mo
- ROI: 27x subscription cost

## Implementation Phases

### Phase 1: Professor Program (Week 1-2)
- [ ] Create professor onboarding flow
- [ ] Stripe Connect integration
- [ ] Pattern listing UI
- [ ] Basic analytics dashboard

### Phase 2: Marketplace (Week 3-4)
- [ ] Pattern browse/search
- [ ] Purchase flow
- [ ] Access control
- [ ] Review system

### Phase 3: Enterprise (Week 5-6)
- [ ] Enterprise signup flow
- [ ] License management
- [ ] Team analytics
- [ ] Custom contract support

### Phase 4: Partnerships (Week 7-8)
- [ ] Partnership portal
- [ ] Referral tracking
- [ ] Co-marketing tools
- [ ] Revenue sharing automation

## Key Queries

### Top Earning Professors
```typescript
const topProfessors = await prisma.professorAccount.findMany({
  orderBy: { totalRevenue: 'desc' },
  take: 10,
  include: {
    listings: {
      where: { isPublished: true },
      include: { pattern: true }
    }
  }
})
```

### Trending Patterns
```typescript
const trending = await prisma.patternListing.findMany({
  where: {
    isPublished: true,
    publishedAt: { gte: thirtyDaysAgo }
  },
  orderBy: [
    { totalSales: 'desc' },
    { avgRating: 'desc' }
  ],
  take: 20
})
```

### Enterprise Analytics
```typescript
const enterpriseHealth = await prisma.enterpriseAccount.findMany({
  where: { status: 'ACTIVE' },
  include: {
    licenses: {
      where: { isActive: true },
      include: {
        user: {
          include: {
            journeyEnrollments: true,
            deployments: true
          }
        }
      }
    }
  }
})
```

## Next Steps

1. **Stripe Integration**
   - Set up Stripe Connect for professor payouts
   - Implement payment webhooks
   - Test revenue splitting

2. **Professor Portal**
   - Pattern creation workflow
   - Revenue dashboard
   - Student analytics

3. **Marketplace UI**
   - Browse/search patterns
   - Purchase flow
   - Review system

4. **Enterprise Dashboard**
   - License management
   - Team progress tracking
   - Custom reporting

5. **Partnership Portal**
   - Referral tracking
   - Co-marketing assets
   - Revenue reports

## Success Metrics

**6-Month Targets:**
- 100 active professors
- 500 paid patterns listed
- $50k monthly marketplace GMV
- 20 enterprise customers
- 5 strategic partnerships

**12-Month Targets:**
- 500 active professors
- 2,000 paid patterns
- $250k monthly marketplace GMV
- 100 enterprise customers
- $10M ARR

---

**Schema Version:** V3.0.0
**Last Updated:** 2025-10-03
**Models Added:** 8
**Total Models:** 32
**Total Lines:** 935
