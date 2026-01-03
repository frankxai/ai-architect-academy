# Agent System Deployment Guide

## 🚀 Deploy to Production

Complete guide for deploying the Agent Orchestration System to production on Vercel.

---

## ✅ Pre-Deployment Checklist

Before deploying, ensure you have:

- [x] Anthropic API key (`ANTHROPIC_API_KEY`)
- [x] GitHub token (optional, for OSS sync) (`GITHUB_TOKEN`)
- [x] Vercel account
- [x] GitHub repository
- [x] All code committed

---

## 📋 Step-by-Step Deployment

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
cd "/mnt/c/Users/Frank/AI Architect Academy/dashboard"
git init

# Add all files
git add .

# Commit with descriptive message
git commit -m "feat: Add complete agent orchestration system

- 8 specialized AI agents
- 5 pre-built workflows
- Full REST API
- React UI components
- GitHub OSS integration
- Complete documentation"

# Add remote and push
git remote add origin https://github.com/your-username/ai-architect-academy.git
git push -u origin main
```

### Step 2: Deploy to Vercel

#### Option A: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name? ai-architect-academy
# - Directory? ./dashboard
# - Override settings? No

# Deploy to production
vercel --prod
```

#### Option B: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `dashboard`
   - **Build Command:** `npm run build`
   - **Install Command:** `npm install`
5. Click "Deploy"

### Step 3: Configure Environment Variables

```bash
# Via Vercel CLI
vercel env add ANTHROPIC_API_KEY production
# Paste your key when prompted

# Optional: GitHub integration
vercel env add GITHUB_TOKEN production
vercel env add GITHUB_OWNER production
vercel env add GITHUB_REPO production

# Apply to all deployments
vercel env pull .env.local
```

#### Via Vercel Dashboard

1. Go to Project Settings
2. Navigate to "Environment Variables"
3. Add:
   - **ANTHROPIC_API_KEY** = `sk-ant-...`
   - **GITHUB_TOKEN** = `ghp_...` (optional)
   - **GITHUB_OWNER** = `your-org` (optional)
   - **GITHUB_REPO** = `patterns` (optional)
4. Select "Production", "Preview", "Development"
5. Click "Save"

### Step 4: Verify Deployment

```bash
# Visit your deployment
open https://your-project.vercel.app/agents

# Test API endpoints
curl https://your-project.vercel.app/api/agents/list

# Test agent execution
curl -X POST https://your-project.vercel.app/api/agents/execute \
  -H "Content-Type: application/json" \
  -d '{"agentName":"documentation-agent","prompt":"Test deployment"}'
```

---

## 🔧 Production Configuration

### Next.js Configuration

Ensure your `next.config.js` is optimized:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features
  experimental: {
    serverComponentsExternalPackages: ['@anthropic-ai/sdk']
  },

  // API route timeout (10 minutes for long workflows)
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    },
    responseLimit: '10mb'
  },

  // Environment variables
  env: {
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    GITHUB_OWNER: process.env.GITHUB_OWNER,
    GITHUB_REPO: process.env.GITHUB_REPO
  }
};

module.exports = nextConfig;
```

### Vercel Configuration

Create `vercel.json` in dashboard root:

```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "functions": {
    "src/app/api/agents/**/*.ts": {
      "maxDuration": 300
    }
  },
  "regions": ["iad1"],
  "env": {
    "ANTHROPIC_API_KEY": "@anthropic-api-key",
    "GITHUB_TOKEN": "@github-token"
  }
}
```

**Note:** Vercel Pro allows up to 300 seconds (5 minutes) for serverless functions. Hobby plan is limited to 10 seconds.

---

## 🔐 Security Best Practices

### 1. API Key Management

```bash
# NEVER commit API keys
echo ".env.local" >> .gitignore
echo ".env*.local" >> .gitignore

# Use Vercel secrets for sensitive values
vercel secrets add anthropic-api-key "sk-ant-..."
vercel secrets add github-token "ghp_..."
```

### 2. Rate Limiting

Add rate limiting to API routes:

```typescript
// src/app/api/agents/middleware.ts
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
});

export async function rateLimit(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'anonymous';
  const { success } = await ratelimit.limit(ip);
  return success;
}
```

### 3. CORS Configuration

```typescript
// src/app/api/agents/[...]/route.ts
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'https://your-domain.com',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
```

---

## 📊 Monitoring & Observability

### 1. Vercel Analytics

```bash
# Install Vercel Analytics
npm install @vercel/analytics

# Add to app layout
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 2. Error Tracking (Sentry)

```bash
# Install Sentry
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard@latest -i nextjs

# Configure DSN in .env.local
SENTRY_DSN=https://...@sentry.io/...
```

### 3. Custom Logging

```typescript
// lib/logger.ts
export function logAgentExecution(result: AgentResult) {
  console.log({
    timestamp: new Date().toISOString(),
    type: 'agent_execution',
    agentName: result.agentName,
    success: result.success,
    duration: result.durationMs,
    tokens: result.metadata?.usage
  });
}
```

---

## 💰 Cost Management

### 1. Set Budget Alerts

In Anthropic Console:
1. Go to Organization Settings
2. Set monthly budget limit
3. Configure email alerts at 50%, 80%, 100%

### 2. Track Usage

```typescript
// lib/usage-tracker.ts
export async function trackUsage(result: AgentResult) {
  const usage = result.metadata?.usage;

  if (usage) {
    // Store in database or analytics
    await db.usage.create({
      agentName: result.agentName,
      inputTokens: usage.input_tokens,
      outputTokens: usage.output_tokens,
      cost: calculateCost(usage),
      timestamp: new Date()
    });
  }
}

function calculateCost(usage: any) {
  // Claude 3.5 Sonnet pricing (as of Oct 2024)
  const inputCost = (usage.input_tokens / 1_000_000) * 3.00;
  const outputCost = (usage.output_tokens / 1_000_000) * 15.00;
  return inputCost + outputCost;
}
```

### 3. Cost Optimization

```typescript
// Smart model selection
function selectModel(complexity: 'simple' | 'complex'): AgentProvider {
  return complexity === 'simple'
    ? 'claude-3-5-haiku'    // 20x cheaper
    : 'claude-3-5-sonnet';  // More capable
}
```

---

## 🧪 Testing in Production

### 1. Smoke Tests

```bash
# Test API availability
curl https://your-app.vercel.app/api/agents/list

# Test agent execution
curl -X POST https://your-app.vercel.app/api/agents/execute \
  -H "Content-Type: application/json" \
  -d '{"agentName":"documentation-agent","prompt":"Test"}'

# Test workflow
curl -X POST https://your-app.vercel.app/api/agents/workflow \
  -H "Content-Type: application/json" \
  -d '{"workflowType":"OSS_CONTRIBUTION","variables":{...}}'
```

### 2. Load Testing

```bash
# Install k6
brew install k6

# Create load test
cat > load-test.js << 'EOF'
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 10, // 10 virtual users
  duration: '30s',
};

export default function() {
  let res = http.post('https://your-app.vercel.app/api/agents/execute',
    JSON.stringify({
      agentName: 'documentation-agent',
      prompt: 'Generate README'
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 30s': (r) => r.timings.duration < 30000,
  });
}
EOF

# Run load test
k6 run load-test.js
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci
        working-directory: ./dashboard

      - name: Run type check
        run: npm run type-check
        working-directory: ./dashboard

      - name: Build
        run: npm run build
        working-directory: ./dashboard
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./dashboard
```

---

## 📈 Scaling Considerations

### 1. Database (Optional)

For storing execution history:

```bash
# Use Vercel Postgres
npm install @vercel/postgres

# Create tables
CREATE TABLE agent_executions (
  id SERIAL PRIMARY KEY,
  agent_name VARCHAR(50),
  success BOOLEAN,
  duration_ms INTEGER,
  tokens_used INTEGER,
  cost_usd DECIMAL(10,6),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Caching

```typescript
// Use Vercel KV for caching
import { kv } from '@vercel/kv';

export async function cacheAgentResult(key: string, result: AgentResult) {
  await kv.set(`agent:${key}`, result, { ex: 3600 }); // 1 hour
}

export async function getCachedResult(key: string): Promise<AgentResult | null> {
  return await kv.get(`agent:${key}`);
}
```

### 3. Queue System

For long-running workflows:

```bash
# Use Vercel Queue (coming soon) or Inngest
npm install inngest

# Create workflow queue
import { Inngest } from 'inngest';

const inngest = new Inngest({ name: 'Agent System' });

export const workflowQueue = inngest.createFunction(
  { name: 'Execute Workflow' },
  { event: 'workflow/execute' },
  async ({ event, step }) => {
    // Execute workflow in background
  }
);
```

---

## 🐛 Troubleshooting Production

### Issue: Timeout Errors

**Cause:** Workflow exceeds 10-second Vercel limit (Hobby plan)

**Solution:**
1. Upgrade to Vercel Pro (300-second limit)
2. Or use background jobs with Inngest/Vercel Queue

### Issue: API Key Not Found

**Cause:** Environment variable not set correctly

**Solution:**
```bash
# Check environment variables
vercel env ls

# Add if missing
vercel env add ANTHROPIC_API_KEY production
```

### Issue: CORS Errors

**Cause:** Cross-origin requests blocked

**Solution:**
```typescript
// Add CORS headers to all API routes
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    }
  });
}
```

---

## 📊 Production Metrics

### Key Metrics to Track

1. **Agent Execution Success Rate**
   - Target: >95%
   - Alert if <90%

2. **Average Response Time**
   - Target: <30s for single agents
   - Target: <120s for workflows

3. **API Costs**
   - Track daily spend
   - Alert if >$X per day

4. **Error Rate**
   - Target: <5%
   - Alert if >10%

### Dashboard

Use Vercel Analytics or create custom dashboard:

```typescript
// pages/api/admin/metrics.ts
export async function GET() {
  const metrics = await db.query(`
    SELECT
      COUNT(*) as total_executions,
      AVG(duration_ms) as avg_duration,
      SUM(CASE WHEN success THEN 1 ELSE 0 END) * 100.0 / COUNT(*) as success_rate,
      SUM(cost_usd) as total_cost
    FROM agent_executions
    WHERE created_at > NOW() - INTERVAL '24 hours'
  `);

  return Response.json(metrics);
}
```

---

## ✅ Post-Deployment Checklist

After deployment, verify:

- [ ] All API endpoints are accessible
- [ ] Agent execution works correctly
- [ ] Workflows complete successfully
- [ ] UI loads without errors
- [ ] Environment variables are set
- [ ] Monitoring is configured
- [ ] Error tracking is active
- [ ] Cost tracking is enabled
- [ ] Documentation is accessible
- [ ] GitHub integration works (if configured)

---

## 🎓 Next Steps After Deployment

1. ✅ Monitor for first 24 hours
2. ✅ Run smoke tests daily
3. ✅ Review cost metrics weekly
4. ✅ Update documentation as needed
5. ✅ Gather user feedback
6. ✅ Iterate and improve

---

## 📞 Support

If you encounter issues:

1. Check Vercel deployment logs
2. Review API route logs
3. Check Anthropic API status
4. Consult documentation
5. Open GitHub issue

---

## 🎉 Congratulations!

Your Agent Orchestration System is now live in production! 🚀

**Next:** Start using it at `https://your-app.vercel.app/agents`

---

**Deployed with Vercel • Powered by Claude 3.5 Sonnet**
