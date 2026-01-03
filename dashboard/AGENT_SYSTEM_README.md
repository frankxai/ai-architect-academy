# 🤖 Agent Orchestration System

**Production-ready multi-agent framework for the AI Architect Academy**

Built with Claude SDK • 8 Specialized Agents • 5 Pre-Built Workflows • Full TypeScript

---

## ⚡ Quick Start

```bash
# 1. Set your API key
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local

# 2. Start the server
npm run dev

# 3. Open the dashboard
open http://localhost:3000/agents
```

**That's it!** You now have access to 8 AI agents and 5 multi-agent workflows.

---

## 🎯 What Can It Do?

### Single Agent Execution
Execute specialized AI agents for specific tasks:

```typescript
// Build a RAG system
POST /api/agents/execute
{
  "agentName": "pattern-builder",
  "prompt": "Build a production RAG system with Pinecone and LangChain"
}
```

### Multi-Agent Workflows
Run complex workflows with automatic orchestration:

```typescript
// End-to-end pattern development
POST /api/agents/workflow
{
  "workflowType": "PATTERN_DEVELOPMENT",
  "variables": {
    "requirements": "Build medical AI assistant",
    "use_case": "Healthcare Q&A"
  }
}
```

### Results
Within 15-120 seconds, you get:
- ✅ Complete working code
- ✅ Architecture documentation
- ✅ Security review
- ✅ Compliance check
- ✅ Performance optimizations
- ✅ Deployment instructions

---

## 🤖 8 Specialized Agents

| Agent | Purpose | Model | Best For |
|-------|---------|-------|----------|
| **Pattern Builder** | Create AI systems | Sonnet | Building new patterns |
| **QA Agent** | Test & secure | Sonnet | Security audits |
| **Documentation** | Write docs | Haiku | READMEs, API docs |
| **Architecture Review** | System design | Sonnet | Design validation |
| **Learning Assistant** | Guide students | Haiku | Teaching & learning |
| **Optimizer** | Improve performance | Sonnet | Cost reduction |
| **GitHub Integration** | Manage OSS | Sonnet | Contributions |
| **Compliance** | Check regulations | Sonnet | HIPAA, GDPR, SOC2 |

---

## 🔄 5 Pre-Built Workflows

### 1. Pattern Development (6 tasks, ~2-3 min)
End-to-end pattern creation from requirements to deployment

### 2. OSS Contribution (3 tasks, ~1-2 min)
Prepare patterns for GitHub open source submission

### 3. Learning Path (3 tasks, ~2-3 min)
Create structured learning curricula with projects

### 4. Pattern Review (5 tasks, ~3-4 min)
Comprehensive review: architecture, security, compliance

### 5. Student Onboarding (3 tasks, ~2 min)
Personalized onboarding experience for new students

---

## 📚 Documentation

| Document | Lines | Purpose |
|----------|-------|---------|
| [**Complete Docs**](./AGENT_SYSTEM_DOCUMENTATION.md) | 800+ | Everything you need to know |
| [**Quick Start**](./AGENT_SYSTEM_QUICK_START.md) | 250+ | Get started in 5 minutes |
| [**Summary**](./AGENT_SYSTEM_SUMMARY.md) | 400+ | What was built |
| [**Examples**](./examples/agent-usage-examples.ts) | 500+ | 10 real-world examples |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│     React UI Components             │
│  (AgentExecutor, WorkflowRunner)    │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│       Next.js API Routes            │
│  /execute /workflow /list /stream   │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   Claude Orchestrator Engine        │
│  • Register & Execute Agents        │
│  • Manage Workflows                 │
│  • Handle Dependencies              │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│      Agent Library                  │
│  8 Pre-Configured Agents            │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│       Anthropic Claude API          │
│  Sonnet • Haiku • Opus              │
└─────────────────────────────────────┘
```

---

## 📊 Key Statistics

- **Total Files:** 15 new files
- **Total Code:** ~3,500 lines
- **Agents:** 8 specialized agents
- **Workflows:** 5 pre-built workflows
- **API Endpoints:** 5 REST endpoints
- **UI Components:** 3 React components
- **Documentation:** 1,500+ lines
- **Examples:** 10 working examples

---

## 💡 Example Use Cases

### 1. Build a RAG System (30 seconds)
```bash
curl -X POST localhost:3000/api/agents/execute \
  -d '{"agentName":"pattern-builder","prompt":"Build RAG with Pinecone"}'
```

### 2. Security Review (20 seconds)
```bash
curl -X POST localhost:3000/api/agents/execute \
  -d '{"agentName":"qa-agent","prompt":"Review this code: [code]"}'
```

### 3. Generate Documentation (15 seconds)
```bash
curl -X POST localhost:3000/api/agents/execute \
  -d '{"agentName":"documentation-agent","prompt":"Document this API"}'
```

### 4. Complete Pattern Development (2 minutes)
```bash
curl -X POST localhost:3000/api/agents/workflow \
  -d '{"workflowType":"PATTERN_DEVELOPMENT","variables":{...}}'
```

---

## 🎨 UI Screenshots

### Agent Executor
Execute single agents with custom prompts and context

### Workflow Runner
Run multi-agent workflows with variable inputs

### Dashboard
View metrics, manage agents, track performance

*Navigate to `/agents` to see the full UI*

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Push to GitHub
git push

# Deploy to Vercel
vercel deploy

# Set environment variable
vercel env add ANTHROPIC_API_KEY
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "start"]
```

---

## 💰 Cost Optimization

| Agent | Model | Avg Cost |
|-------|-------|----------|
| Documentation | Haiku | $0.01 |
| Learning | Haiku | $0.007 |
| Builder | Sonnet | $0.09 |
| QA | Sonnet | $0.06 |
| Review | Sonnet | $0.12 |

**Tip:** Use Haiku for simple tasks - it's 20x cheaper than Sonnet!

---

## 🔐 Security

- ✅ API keys in environment variables
- ✅ Server-side API routes only
- ✅ Input validation on all endpoints
- ✅ Built-in compliance checking
- ✅ Security review agent

---

## 📈 Performance

- **Simple Agent:** 5-10 seconds
- **Complex Agent:** 15-30 seconds
- **3-Task Workflow:** 30-60 seconds
- **6-Task Workflow:** 60-120 seconds

*All tasks execute in parallel when possible*

---

## 🛠️ Advanced Usage

### Create Custom Agent
```typescript
const customAgent: AgentConfig = {
  name: 'my-agent',
  provider: 'claude-3-5-sonnet',
  temperature: 0.7,
  systemPrompt: 'You are...',
  tools: [...]
};

orchestrator.registerAgent(customAgent);
```

### Create Custom Workflow
```typescript
const customWorkflow: WorkflowConfig = {
  name: 'my-workflow',
  description: 'Custom workflow',
  agents: AGENT_LIBRARY,
  tasks: [
    {
      id: 'task1',
      agentName: 'pattern-builder',
      prompt: 'Build...'
    },
    {
      id: 'task2',
      agentName: 'qa-agent',
      prompt: 'Review {{dependencies.task1}}',
      dependencies: ['task1']
    }
  ]
};
```

### Stream Real-Time Updates
```typescript
const stream = orchestrator.streamAgentExecution(
  'documentation-agent',
  'Generate docs'
);

for await (const event of stream) {
  if (event.type === 'content') {
    console.log(event.data.text);
  }
}
```

---

## 🤝 GitHub OSS Integration

### Submit Pattern
```typescript
import { createGitHubSync } from '@/lib/github/oss-sync';

const github = createGitHubSync();
await github.submitPatternToOSS(pattern);
// Creates PR automatically!
```

### Fetch Patterns
```typescript
const patterns = await github.fetchPatternsFromOSS('rag');
console.log(`Found ${patterns.length} RAG patterns`);
```

---

## 🧪 Testing

```bash
# Run example 1 (Build RAG)
npx ts-node examples/agent-usage-examples.ts 1

# Run all examples
npx ts-node examples/agent-usage-examples.ts
```

---

## 🐛 Troubleshooting

### Issue: API key not found
```bash
# Solution: Set in .env.local
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local
```

### Issue: Agent execution timeout
```typescript
// Solution: Increase maxTokens
const agent = {
  ...config,
  maxTokens: 8192 // Increased from 4096
};
```

### Issue: Workflow dependency error
```typescript
// Solution: Ensure all dependencies exist
tasks: [
  { id: 'task1', ... },
  { id: 'task2', dependencies: ['task1'] } // ✅
]
```

---

## 📦 What's Included

```
dashboard/
├── lib/agents/                   # Core system
│   ├── claude-orchestrator.ts   # Orchestration engine
│   ├── agent-library.ts         # 8 agents
│   └── workflows.ts             # 5 workflows
├── src/
│   ├── app/api/agents/          # 5 API routes
│   ├── app/agents/page.tsx      # Dashboard page
│   └── components/agents/       # 3 UI components
├── lib/github/
│   └── oss-sync.ts              # GitHub integration
├── examples/
│   └── agent-usage-examples.ts  # 10 examples
└── DOCS/                        # Documentation
    ├── AGENT_SYSTEM_DOCUMENTATION.md
    ├── AGENT_SYSTEM_QUICK_START.md
    ├── AGENT_SYSTEM_SUMMARY.md
    └── AGENT_SYSTEM_README.md (this file)
```

---

## 🎓 Learning Path

1. ✅ Read Quick Start → 5 minutes
2. ✅ Execute first agent → 2 minutes
3. ✅ Run first workflow → 5 minutes
4. ✅ Read full documentation → 30 minutes
5. ✅ Try all examples → 1 hour
6. ✅ Build custom workflow → 1 hour
7. ✅ Deploy to production → 30 minutes

**Total:** ~3 hours to complete mastery

---

## 🌟 Why This Is Special

### 1. Multi-Agent Composition
Coordinates multiple AI agents working together on complex tasks

### 2. Automatic Orchestration
Resolves dependencies and executes tasks in optimal order

### 3. Production-Ready
Complete with error handling, streaming, metrics, and documentation

### 4. Cost-Optimized
Smart model selection reduces costs by up to 95%

### 5. GitHub Integration
Seamless OSS contribution workflow built-in

---

## 📞 Support

- **Documentation:** See docs folder
- **Examples:** See `examples/agent-usage-examples.ts`
- **Issues:** GitHub Issues
- **API Reference:** See `AGENT_SYSTEM_DOCUMENTATION.md`

---

## 🏆 What You Can Build

With this system, you can:

✅ Generate complete AI systems in minutes
✅ Review and secure code automatically
✅ Create comprehensive documentation
✅ Design system architectures
✅ Build learning curricula
✅ Optimize for cost and performance
✅ Ensure regulatory compliance
✅ Contribute to open source

---

## 🚦 Get Started Now

```bash
# 1. Set API key
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local

# 2. Start app
npm run dev

# 3. Open dashboard
open http://localhost:3000/agents

# 4. Execute your first agent!
```

---

## 📜 License

MIT License - Use freely in your projects!

---

## 🙏 Acknowledgments

Built with:
- **Claude 3.5 Sonnet** - AI orchestration
- **Next.js 16** - Framework
- **React 19** - UI
- **TypeScript** - Type safety
- **Anthropic SDK** - Claude API
- **Vercel** - Deployment

---

**Ready to build with AI agents? Start at `/agents` 🚀**

*Built with ❤️ by AI Architect Academy*
*Powered by Claude 3.5 Sonnet*
