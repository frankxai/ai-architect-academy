# Supabase Setup Guide

Complete guide to migrate the AI Architect Academy from Prisma/PostgreSQL to Supabase.

---

## 🎯 Why Supabase?

- **PostgreSQL** - Same database we're using (Prisma compatible)
- **Built-in Auth** - GitHub, Google, email/password out of the box
- **Realtime** - Live updates for collaborative features
- **Storage** - File uploads for pattern templates, avatars
- **Edge Functions** - Serverless compute for AI agents
- **Row Level Security** - Fine-grained access control
- **Free tier** - 500MB database, 2GB storage, 2GB bandwidth

---

## 📋 Step-by-Step Setup

### 1. Create Supabase Project

```bash
# Go to https://supabase.com
# Click "New Project"
# Name: ai-architect-academy
# Database Password: [Generate strong password]
# Region: US East (or closest to users)
# Plan: Free (upgrade later)
```

**Save these values:**
- `SUPABASE_URL` (e.g., https://abcdefgh.supabase.co)
- `SUPABASE_ANON_KEY` (public key)
- `SUPABASE_SERVICE_ROLE_KEY` (secret key)
- `DATABASE_URL` (PostgreSQL connection string)

---

### 2. Update Environment Variables

Create `.env.local` in `academy-dashboard/`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database (for Prisma)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.your-project.supabase.co:5432/postgres

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=[generate with: openssl rand -base64 32]

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

### 3. Run Prisma Migrations

```bash
cd academy-dashboard

# Generate Prisma client
npx prisma generate

# Push schema to Supabase
npx prisma db push

# Seed database
npx prisma db seed
```

---

### 4. Set Up Supabase Client

Create `academy-dashboard/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For server-side (API routes)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
```

---

### 5. Configure Authentication

In Supabase Dashboard → Authentication → Providers:

**Enable Providers:**
- [x] Email (for email/password)
- [x] GitHub (for social login)
- [x] Google (for social login)

**GitHub OAuth Setup:**
1. Go to GitHub → Settings → Developer Settings → OAuth Apps
2. New OAuth App:
   - Name: AI Architect Academy
   - Homepage: http://localhost:3000
   - Callback: https://your-project.supabase.co/auth/v1/callback
3. Copy Client ID and Client Secret to Supabase

**Google OAuth Setup:**
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Create OAuth Client ID (Web application)
3. Authorized redirect URIs: https://your-project.supabase.co/auth/v1/callback
4. Copy Client ID and Client Secret to Supabase

---

### 6. Set Up Row Level Security (RLS)

In Supabase Dashboard → SQL Editor:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE learner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE professor_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pattern_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployable_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE pattern_deployments ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid()::text = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid()::text = id);

-- Anyone can view published patterns
CREATE POLICY "Anyone can view published patterns"
  ON pattern_listings FOR SELECT
  USING (is_published = true);

-- Professors can manage their own patterns
CREATE POLICY "Professors can manage own patterns"
  ON pattern_listings FOR ALL
  USING (
    professor_id IN (
      SELECT id FROM professor_accounts
      WHERE user_id = auth.uid()::text
    )
  );

-- Users can view their own purchases
CREATE POLICY "Users can view own purchases"
  ON purchases FOR SELECT
  USING (user_id = auth.uid()::text);

-- Users can view their own deployments
CREATE POLICY "Users can manage own deployments"
  ON pattern_deployments FOR ALL
  USING (user_id = auth.uid()::text);

-- Public portfolios are viewable by anyone
CREATE POLICY "Public portfolios viewable"
  ON portfolios FOR SELECT
  USING (is_public = true);
```

---

### 7. Set Up Storage Buckets

In Supabase Dashboard → Storage:

**Create Buckets:**

1. **pattern-templates** (private)
   - Store pattern code templates
   - Only professors can upload
   - Students download after purchase

2. **user-avatars** (public)
   - Profile pictures
   - Anyone can view
   - Users can upload their own

3. **pattern-screenshots** (public)
   - Pattern demo images
   - Professors upload
   - Anyone can view

**RLS Policies for Storage:**

```sql
-- pattern-templates: Professors can upload
CREATE POLICY "Professors can upload templates"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'pattern-templates' AND
    auth.uid()::text IN (
      SELECT user_id FROM professor_accounts
    )
  );

-- user-avatars: Users can upload their own
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'user-avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- pattern-screenshots: Public read
CREATE POLICY "Public can view screenshots"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'pattern-screenshots');
```

---

### 8. Set Up Realtime

Enable realtime for collaborative features:

```sql
-- Enable realtime for specific tables
ALTER PUBLICATION supabase_realtime ADD TABLE pattern_deployments;
ALTER PUBLICATION supabase_realtime ADD TABLE activities;
ALTER PUBLICATION supabase_realtime ADD TABLE purchases;
```

**Use in React components:**

```typescript
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function RealtimeDeployments({ userId }: { userId: string }) {
  const [deployments, setDeployments] = useState([]);

  useEffect(() => {
    // Subscribe to changes
    const channel = supabase
      .channel('deployments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pattern_deployments',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Deployment updated:', payload);
          // Update state
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return <div>{/* Render deployments */}</div>;
}
```

---

### 9. Set Up Edge Functions (Optional)

For AI agent orchestration:

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Create edge function
supabase functions new orchestrate-agents

# Deploy
supabase functions deploy orchestrate-agents
```

**Example Edge Function** (`supabase/functions/orchestrate-agents/index.ts`):

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const { patternId, userId, workflow } = await req.json();

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // Orchestrate multi-agent workflow
  const results = [];

  for (const step of workflow.steps) {
    const result = await executeAgentStep(step);
    results.push(result);

    // Update progress in database
    await supabase.from('agent_executions').insert({
      pattern_id: patternId,
      user_id: userId,
      step: step.agent,
      result,
    });
  }

  return new Response(JSON.stringify({ success: true, results }), {
    headers: { 'Content-Type': 'application/json' },
  });
});

async function executeAgentStep(step: any) {
  // Call Claude Code, Codex, etc.
  // Return result
}
```

---

### 10. Install Supabase Packages

```bash
cd academy-dashboard

npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

---

### 11. Update API Routes for Supabase Auth

**Example:** `app/api/professors/onboard/route.ts`

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  // Get authenticated user
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await req.json();

  // Create professor account
  const professor = await prisma.professorAccount.create({
    data: {
      userId,
      displayName: body.displayName,
      bio: body.bio,
      expertise: body.expertise,
    },
  });

  return NextResponse.json({ success: true, professor });
}
```

---

### 12. Create Auth Components

**Login Component** (`app/components/auth/LoginButton.tsx`):

```typescript
'use client';

import { supabase } from '@/lib/supabase';

export function LoginButton() {
  async function signInWithGitHub() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) console.error('Error:', error);
  }

  return (
    <button
      onClick={signInWithGitHub}
      className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
    >
      Sign in with GitHub
    </button>
  );
}
```

**Auth Callback Route** (`app/auth/callback/route.ts`):

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(requestUrl.origin);
}
```

---

### 13. Database Backups

In Supabase Dashboard → Settings → Database:

- **Enable Point-in-Time Recovery** (paid plans)
- **Schedule Daily Backups** (automatic on all plans)
- **Download Backup** (manual export when needed)

---

### 14. Monitoring & Logs

In Supabase Dashboard → Logs:

- **API Logs** - See all API requests
- **Database Logs** - Query performance
- **Auth Logs** - Login attempts
- **Realtime Logs** - Subscription activity

---

## 🚀 Migration Checklist

- [ ] Create Supabase project
- [ ] Copy DATABASE_URL to .env.local
- [ ] Run `npx prisma db push`
- [ ] Run `npx prisma db seed`
- [ ] Enable authentication providers (GitHub, Google)
- [ ] Set up Row Level Security policies
- [ ] Create storage buckets
- [ ] Configure RLS for storage
- [ ] Install Supabase client packages
- [ ] Update API routes with Supabase auth
- [ ] Create login/signup components
- [ ] Test auth flow end-to-end
- [ ] Enable realtime (optional)
- [ ] Deploy edge functions (optional)
- [ ] Configure backups
- [ ] Monitor logs

---

## 📊 Supabase Dashboard

**Key Features to Configure:**

1. **Database** - View tables, run SQL
2. **Authentication** - Manage users, configure providers
3. **Storage** - Upload files, manage buckets
4. **API Docs** - Auto-generated REST/GraphQL docs
5. **Logs** - Monitor activity
6. **Settings** - Billing, team, API keys

---

## 🔐 Security Best Practices

1. **Use RLS** - Every table should have policies
2. **Service Role Key** - Only use server-side, never expose
3. **Anon Key** - Safe to use client-side
4. **HTTPS Only** - Enforce in production
5. **Rate Limiting** - Configure in Supabase settings
6. **Environment Variables** - Never commit to git

---

## 💰 Pricing (Post-Free Tier)

**Pro Plan ($25/mo):**
- 8GB database
- 100GB storage
- 250GB bandwidth
- Point-in-Time Recovery
- Daily backups (7 days)

**Team Plan ($599/mo):**
- Dedicated resources
- SOC2 compliance
- Priority support
- Custom contracts

**Start with Free, upgrade when needed.**

---

## 📞 Next Steps After Setup

1. Test auth flow (GitHub login)
2. Create sample user
3. Create sample professor account
4. Create sample pattern listing
5. Test purchase flow
6. Verify RLS policies work
7. Test file upload to storage
8. Deploy to Vercel (connected to Supabase)

---

**Supabase gives us:**
- ✅ PostgreSQL (Prisma compatible)
- ✅ Auth (GitHub/Google)
- ✅ Storage (patterns, avatars)
- ✅ Realtime (live updates)
- ✅ Edge Functions (AI orchestration)
- ✅ Free tier (great for MVP)

**Perfect foundation for AI Architect Academy SaaS.** 🚀
