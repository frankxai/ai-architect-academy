# Vercel Deployment Guide

Complete checklist to deploy AI Architect Academy to production on Vercel.

---

## 🎯 Pre-Deployment Checklist

### 1. Code Ready
- [x] All pages built and tested locally
- [x] API routes functional
- [x] Database schema finalized
- [x] Environment variables documented
- [ ] Remove console.logs from production code
- [ ] Add error boundaries
- [ ] Implement loading states

### 2. Database Ready
- [ ] Supabase project created
- [ ] Prisma migrations run
- [ ] Seed data populated
- [ ] RLS policies configured
- [ ] Backups enabled

### 3. External Services
- [ ] Stripe account created
- [ ] Stripe products configured
- [ ] Stripe Connect enabled
- [ ] GitHub OAuth app created
- [ ] Google OAuth app created

---

## 🚀 Vercel Deployment Steps

### Step 1: Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### Step 2: Connect GitHub Repository

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository: `AI-Architect-Academy`
4. Select root directory or: `academy-platform/`

### Step 3: Configure Build Settings

**Framework Preset:** Next.js

**Build Command:**
```bash
cd academy-platform && npm run build
```

**Output Directory:**
```
academy-platform/.next
```

**Install Command:**
```bash
cd academy-platform && npm install
```

**Root Directory:** `academy-platform` (or leave blank if deploying from root)

---

## 🧭 Marketing + Media Publishing Site (Publishing Engine)

Deploy the public knowledge hub separately so it can scale content and SEO without impacting the SaaS app.

### Vercel Configuration (Publishing Engine)
**Root Directory:** `publishing-engine`

**Build Command:**
```bash
cd publishing-engine && npm run build
```

**Output Directory:**
```
publishing-engine/.next
```

**Install Command:**
```bash
cd publishing-engine && npm install
```

### Step 4: Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

**Add all variables from `.env.local`:**

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Database
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.your-project.supabase.co:5432/postgres

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# NextAuth
NEXTAUTH_URL=https://aiarchitectacademy.com
NEXTAUTH_SECRET=[generate new for production]

# Site
NEXT_PUBLIC_SITE_URL=https://aiarchitectacademy.com
```

**Important:**
- ✅ Use **Production** environment for all
- ✅ Generate new `NEXTAUTH_SECRET` for production
- ✅ Use Stripe **Live** keys (not test)
- ✅ Update `NEXTAUTH_URL` to production domain

### Step 5: Custom Domain

In Vercel Dashboard → Settings → Domains:

**Add Domain:**
- Primary: `aiarchitectacademy.com`
- Redirect: `www.aiarchitectacademy.com` → `aiarchitectacademy.com`

**DNS Configuration:**
```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

**Wait for DNS propagation (5-30 minutes)**

### Step 6: Deploy

Click **Deploy** button in Vercel.

**Watch build logs for errors.**

---

## 🔧 Post-Deployment Configuration

### 1. Update OAuth Redirect URLs

**GitHub OAuth:**
- Go to GitHub → Settings → Developer Settings → OAuth Apps
- Update callback URL:
  ```
  https://your-project.supabase.co/auth/v1/callback
  ```

**Google OAuth:**
- Go to Google Cloud Console → Credentials
- Add authorized redirect URI:
  ```
  https://your-project.supabase.co/auth/v1/callback
  ```

**Supabase Site URL:**
- Go to Supabase → Authentication → URL Configuration
- Site URL: `https://aiarchitectacademy.com`
- Redirect URLs: `https://aiarchitectacademy.com/**`

### 2. Configure Stripe Webhooks

**Create Webhook Endpoint:**
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://aiarchitectacademy.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy webhook signing secret
5. Add to Vercel env vars: `STRIPE_WEBHOOK_SECRET=whsec_...`

**Webhook Handler** (already created at `app/api/webhooks/stripe/route.ts`):

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Handle successful checkout
      break;
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Handle successful payment
      break;
    // ... other events
  }

  return NextResponse.json({ received: true });
}
```

### 3. Set Up Monitoring

**Vercel Analytics:**
- Enable in Vercel Dashboard → Analytics
- Free tier: 2,500 events/month

**Sentry (Error Tracking):**

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

Add to `sentry.client.config.ts`:
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

**Vercel Logs:**
- View real-time logs in Vercel Dashboard → Deployments → [Latest] → Runtime Logs

### 4. Set Up Edge Config (Optional)

For feature flags and A/B testing:

```bash
# In Vercel Dashboard
1. Create Edge Config
2. Add config items (feature flags)
3. Connect to project
```

**Example usage:**
```typescript
import { get } from '@vercel/edge-config';

export async function GET() {
  const isFeatureEnabled = await get('new_marketplace_ui');
  return Response.json({ enabled: isFeatureEnabled });
}
```

---

## 📊 Performance Optimization

### 1. Enable Image Optimization

In `next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-project.supabase.co'], // Supabase storage
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
```

### 2. Enable Caching

**API Routes:**
```typescript
export const revalidate = 60; // Revalidate every 60 seconds

export async function GET() {
  const data = await fetchData();
  return Response.json(data);
}
```

**Static Pages:**
```typescript
export const revalidate = 3600; // 1 hour

export default async function Page() {
  const data = await fetchStaticData();
  return <div>{data}</div>;
}
```

### 3. Bundle Analysis

```bash
npm install @next/bundle-analyzer

# In next.config.mjs
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);

# Run analysis
ANALYZE=true npm run build
```

### 4. Lighthouse Scores

**Target Metrics:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

**Run Lighthouse:**
```bash
npm install -g lighthouse
lighthouse https://aiarchitectacademy.com --view
```

---

## 🔐 Security Hardening

### 1. Content Security Policy

In `next.config.mjs`:

```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};
```

### 2. Rate Limiting

**Install Upstash Redis:**
```bash
npm install @upstash/redis @upstash/ratelimit
```

**Create rate limiter** (`lib/rate-limit.ts`):
```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
});
```

**Use in API routes:**
```typescript
import { ratelimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const ip = req.ip ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  // Process request
}
```

### 3. Authentication Middleware

Create `middleware.ts` in root:

```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect professor routes
  if (req.nextUrl.pathname.startsWith('/professor') && !session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/professor/:path*', '/api/professors/:path*'],
};
```

---

## 📈 SEO Configuration

### 1. Add Metadata

In `app/layout.tsx`:

```typescript
export const metadata = {
  title: 'AI Architect Academy | Learn by Building AI Systems',
  description: 'Deploy real AI systems, earn certifications, showcase your portfolio. Learn with Claude Code, Codex, and other AI agents.',
  keywords: ['AI', 'Machine Learning', 'AI Architecture', 'RAG', 'AI Agents', 'Certifications'],
  authors: [{ name: 'AI Architect Academy' }],
  openGraph: {
    title: 'AI Architect Academy',
    description: 'Learn by Building AI Systems',
    url: 'https://aiarchitectacademy.com',
    siteName: 'AI Architect Academy',
    images: [
      {
        url: 'https://aiarchitectacademy.com/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Architect Academy',
    description: 'Learn by Building AI Systems',
    images: ['https://aiarchitectacademy.com/og-image.png'],
  },
};
```

### 2. Add Sitemap

Create `app/sitemap.ts`:

```typescript
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://aiarchitectacademy.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://aiarchitectacademy.com/marketplace',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://aiarchitectacademy.com/professor',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];
}
```

### 3. Add Robots.txt

Create `app/robots.ts`:

```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/professor/settings'],
    },
    sitemap: 'https://aiarchitectacademy.com/sitemap.xml',
  };
}
```

---

## 🚨 Pre-Launch Testing

### 1. Functionality Tests
- [ ] User signup (GitHub, Google, Email)
- [ ] User login
- [ ] Professor onboarding
- [ ] Pattern listing creation
- [ ] Pattern purchase (free)
- [ ] Pattern purchase (paid)
- [ ] Stripe checkout flow
- [ ] File upload (avatars, screenshots)
- [ ] Email notifications
- [ ] Password reset

### 2. Performance Tests
- [ ] Lighthouse score 90+
- [ ] Page load < 3s
- [ ] API response < 500ms
- [ ] Image optimization working
- [ ] Caching headers correct

### 3. Security Tests
- [ ] RLS policies enforced
- [ ] HTTPS only
- [ ] CSP headers set
- [ ] Rate limiting working
- [ ] Auth middleware protecting routes
- [ ] SQL injection prevented (Prisma ORM)
- [ ] XSS prevented (React escaping)

### 4. SEO Tests
- [ ] Meta tags present
- [ ] OG images loading
- [ ] Sitemap accessible
- [ ] Robots.txt working
- [ ] Schema markup (optional)

---

## 📱 Progressive Web App (Optional)

Add PWA support:

```bash
npm install next-pwa
```

In `next.config.mjs`:

```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA(nextConfig);
```

Create `public/manifest.json`:

```json
{
  "name": "AI Architect Academy",
  "short_name": "AI Academy",
  "description": "Learn by Building AI Systems",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 🎉 Launch Day Checklist

### Morning Of
- [ ] Final smoke test on production
- [ ] Monitor Vercel logs
- [ ] Monitor Supabase logs
- [ ] Monitor Stripe dashboard
- [ ] Check DNS propagation
- [ ] Test from multiple devices/browsers

### Launch
- [ ] Tweet announcement
- [ ] Post on ProductHunt
- [ ] Email beta users
- [ ] Post in relevant communities (Reddit, HN)
- [ ] Update LinkedIn
- [ ] Announce in Discord/Slack communities

### Post-Launch (First 24h)
- [ ] Monitor error logs (Sentry)
- [ ] Watch analytics (user signups)
- [ ] Respond to feedback
- [ ] Fix critical bugs ASAP
- [ ] Thank early adopters

---

## 📊 Success Metrics (Week 1)

**Target Metrics:**
- 100 signups
- 10 professor accounts
- 5 pattern purchases
- 20 systems deployed
- 0 critical bugs
- 95+ Lighthouse score

---

## 🔄 Continuous Deployment

**Automatic Deployments:**
- Push to `main` branch → Production deploy
- Push to `staging` branch → Preview deploy
- Pull request → Preview deploy

**Deployment Protection:**
- Enable "Production Protection" in Vercel
- Require approval for main branch deploys (optional)

---

## 📞 Support Contacts

**Vercel Support:**
- Dashboard: https://vercel.com/support
- Docs: https://vercel.com/docs

**Supabase Support:**
- Dashboard: https://supabase.com/dashboard/support
- Discord: https://discord.supabase.com

**Stripe Support:**
- Dashboard: https://dashboard.stripe.com/support

---

## 🎯 Post-Launch Roadmap

### Week 1
- Monitor and fix bugs
- Improve onboarding flow
- Add more patterns
- Collect user feedback

### Week 2-4
- Implement A/B tests
- Optimize conversion funnel
- Add email marketing
- Build community features

### Month 2-3
- Enterprise features
- Advanced analytics
- Mobile app (PWA)
- Internationalization

---

**Ready to ship.** 🚀

**SaaS platform meets OSS foundation.**
**Million agents + million humans.**
**Learning meets building.**

**Let's deploy tomorrow and change AI education forever.**
