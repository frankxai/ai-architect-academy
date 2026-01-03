# Agent Orchestration System Documentation

## 🎯 Overview

The Agent Orchestration System is a production-ready multi-agent framework built on Claude SDK that enables complex AI workflows through specialized agent composition and intelligent task orchestration.

**Key Features:**
- ✅ 8 specialized AI agents with distinct capabilities
- ✅ 5 pre-built multi-agent workflows
- ✅ Automatic dependency management
- ✅ Streaming execution for real-time UI updates
- ✅ GitHub OSS integration for pattern syncing
- ✅ Comprehensive REST API
- ✅ Beautiful React UI components
- ✅ Full TypeScript type safety

---

## 📁 Architecture

```
dashboard/
├── lib/
│   ├── agents/
│   │   ├── claude-orchestrator.ts    # Core orchestration engine
│   │   ├── agent-library.ts          # Pre-configured agents
│   │   └── workflows.ts               # Pre-built workflows
│   └── github/
│       └── oss-sync.ts                # GitHub integration
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── agents/
│   │   │       ├── execute/route.ts   # Single agent execution
│   │   │       ├── workflow/route.ts  # Workflow execution
│   │   │       ├── list/route.ts      # Agent listing
│   │   │       ├── stream/route.ts    # Streaming execution
│   │   │       └── metrics/route.ts   # Performance metrics
│   │   └── agents/
│   │       └── page.tsx               # Agent dashboard page
│   └── components/
│       └── agents/
│           ├── AgentExecutor.tsx      # Single agent UI
│           ├── WorkflowRunner.tsx     # Workflow execution UI
│           └── AgentDashboard.tsx     # Main dashboard
```

---

## 🤖 Available Agents

### 1. Pattern Builder (`pattern-builder`)
- **Model:** Claude 3.5 Sonnet
- **Purpose:** Build production-ready AI patterns (RAG, agents, pipelines)
- **Tools:** Code Generation, Pattern Analysis
- **Best For:** Creating new AI systems from requirements

### 2. Quality Assurance (`qa-agent`)
- **Model:** Claude 3.5 Sonnet
- **Purpose:** Comprehensive testing, security review, validation
- **Tools:** Evaluation, Pattern Analysis
- **Best For:** Testing, security audits, edge case discovery

### 3. Documentation (`documentation-agent`)
- **Model:** Claude 3.5 Haiku (fast & cost-effective)
- **Purpose:** Generate technical documentation, tutorials, guides
- **Tools:** Documentation Generator
- **Best For:** READMEs, API docs, learning materials

### 4. Architecture Reviewer (`architecture-reviewer`)
- **Model:** Claude 3.5 Sonnet
- **Purpose:** Senior-level architecture reviews
- **Tools:** Pattern Analysis, Evaluation
- **Best For:** System design validation, scalability assessment

### 5. Learning Assistant (`learning-assistant`)
- **Model:** Claude 3.5 Haiku
- **Purpose:** Guide students through learning journeys
- **Best For:** Personalized learning, concept explanations

### 6. Pattern Optimizer (`pattern-optimizer`)
- **Model:** Claude 3.5 Sonnet
- **Purpose:** Optimize for performance, cost, quality
- **Tools:** Pattern Analysis, Code Generation
- **Best For:** Performance tuning, cost reduction

### 7. GitHub Integration (`github-integration`)
- **Model:** Claude 3.5 Sonnet
- **Purpose:** Manage OSS contributions and PRs
- **Best For:** OSS pattern submissions, community management

### 8. Compliance Checker (`compliance-checker`)
- **Model:** Claude 3.5 Sonnet (low temperature for accuracy)
- **Purpose:** Verify regulatory compliance
- **Covers:** HIPAA, SOC2, GDPR, CCPA, EU AI Act
- **Best For:** Healthcare, finance, enterprise deployments

---

## 🔄 Pre-Built Workflows

### 1. Pattern Development Workflow
**Tasks:** 6 sequential/parallel tasks
**Duration:** ~2-3 minutes
**Purpose:** End-to-end pattern creation from requirements to deployment

**Flow:**
```
analyze-requirements (Architecture Reviewer)
         ↓
build-pattern (Pattern Builder)
         ↓
    ┌────┴────┐
quality-review  compliance-check
    └────┬────┘
         ↓
optimize-pattern (Pattern Optimizer)
         ↓
generate-documentation (Documentation Agent)
```

**Required Variables:**
- `requirements`: Pattern requirements description
- `use_case`: Intended use case

### 2. OSS Contribution Workflow
**Tasks:** 3 sequential tasks
**Duration:** ~1-2 minutes
**Purpose:** Prepare patterns for GitHub OSS submission

**Flow:**
```
validate-pattern (QA Agent)
         ↓
generate-readme (Documentation Agent)
         ↓
prepare-pr (GitHub Integration)
```

**Required Variables:**
- `pattern_code`: The pattern to contribute

### 3. Learning Path Creation
**Tasks:** 3 sequential tasks
**Duration:** ~2-3 minutes
**Purpose:** Create structured learning curricula

**Flow:**
```
design-curriculum (Learning Assistant)
         ↓
create-modules (Documentation Agent)
         ↓
build-projects (Pattern Builder)
```

**Required Variables:**
- `topic`: Learning topic
- `audience_level`: beginner/intermediate/advanced
- `duration_weeks`: Number of weeks

### 4. Pattern Review Workflow
**Tasks:** 5 tasks (3 parallel, 2 sequential)
**Duration:** ~3-4 minutes
**Purpose:** Comprehensive pattern review

**Flow:**
```
architecture-review
security-review         (All parallel)
compliance-review
         ↓
optimization-recommendations
         ↓
consolidate-review
```

**Required Variables:**
- `pattern_code`: Pattern to review
- `pattern_type`: Type of pattern
- `use_case`: Use case description
- `industry`: Target industry

### 5. Student Onboarding Workflow
**Tasks:** 3 sequential tasks
**Duration:** ~2 minutes
**Purpose:** Personalized student onboarding

**Flow:**
```
assess-background (Learning Assistant)
         ↓
curate-resources (Documentation Agent)
         ↓
create-first-project (Pattern Builder)
```

**Required Variables:**
- `current_role`: Student's current role
- `experience_level`: Experience level
- `goals`: Learning goals
- `hours_per_week`: Available study time
- `learning_style`: Preferred learning style

---

## 🚀 Quick Start

### 1. Environment Setup

```bash
# Set your Anthropic API key
export ANTHROPIC_API_KEY="sk-ant-..."

# Optional: GitHub integration
export GITHUB_TOKEN="ghp_..."
export GITHUB_OWNER="your-org"
export GITHUB_REPO="patterns"
```

### 2. Using Single Agents (API)

```typescript
// Execute a single agent
const response = await fetch('/api/agents/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    agentName: 'pattern-builder',
    prompt: 'Build a production-ready RAG system with Pinecone and LangChain',
    context: {
      framework: 'langchain',
      requirements: ['low latency', 'high accuracy']
    }
  })
});

const result = await response.json();
console.log(result.result.output);
```

### 3. Using Workflows (API)

```typescript
// Execute a workflow
const response = await fetch('/api/agents/workflow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    workflowType: 'PATTERN_DEVELOPMENT',
    variables: {
      requirements: 'Build a RAG system for medical knowledge',
      use_case: 'Healthcare Q&A assistant'
    }
  })
});

const result = await response.json();
result.result.results.forEach((taskResult, idx) => {
  console.log(`Task ${idx + 1}: ${taskResult.agentName}`);
  console.log(taskResult.output);
});
```

### 4. Using React Components

```tsx
import { AgentDashboard } from '@/components/agents/AgentDashboard';

export default function Page() {
  return <AgentDashboard />;
}
```

Navigate to `/agents` to access the full UI.

---

## 📡 API Reference

### POST `/api/agents/execute`
Execute a single agent.

**Request:**
```json
{
  "agentName": "pattern-builder",
  "prompt": "Build a RAG system...",
  "context": { "optional": "context" }
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "taskId": "pattern-builder-1234567890",
    "agentName": "pattern-builder",
    "success": true,
    "output": "Generated pattern code...",
    "durationMs": 15430,
    "toolUses": [...],
    "metadata": {...}
  }
}
```

### POST `/api/agents/workflow`
Execute a multi-agent workflow.

**Request:**
```json
{
  "workflowType": "PATTERN_DEVELOPMENT",
  "variables": {
    "requirements": "...",
    "use_case": "..."
  }
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "workflowName": "pattern-development",
    "results": [
      {
        "taskId": "analyze-requirements",
        "agentName": "architecture-reviewer",
        "output": "...",
        "durationMs": 12000
      },
      ...
    ],
    "totalDurationMs": 145000
  }
}
```

### GET `/api/agents/list`
List all available agents.

**Query Parameters:**
- `capability`: Filter by capability (building, quality, documentation, learning, integration)
- `provider`: Filter by model provider

**Response:**
```json
{
  "agents": [
    {
      "name": "pattern-builder",
      "provider": "claude-3-5-sonnet",
      "hasTools": true,
      "toolCount": 2,
      "description": "Expert AI architect specializing in building production-ready AI patterns"
    },
    ...
  ],
  "totalCount": 8
}
```

### GET `/api/agents/workflow`
List all available workflows.

**Response:**
```json
{
  "workflows": [
    {
      "type": "PATTERN_DEVELOPMENT",
      "name": "pattern-development",
      "description": "End-to-end workflow for creating a new AI pattern",
      "taskCount": 6,
      "requiredVariables": ["requirements", "use_case"]
    },
    ...
  ],
  "totalCount": 5
}
```

### POST `/api/agents/stream`
Stream agent execution for real-time updates.

**Request:** Same as `/execute`

**Response:** Server-Sent Events (SSE)
```
data: {"type":"start","data":{"agentName":"pattern-builder"}}

data: {"type":"content","data":{"text":"Building pattern..."}}

data: {"type":"end","data":{...}}

data: {"type":"complete","data":{"timestamp":"..."}}
```

### GET `/api/agents/metrics`
Get workflow execution metrics.

**Response:**
```json
{
  "metrics": {
    "totalWorkflows": 42,
    "successRatePercentage": "95.24%",
    "averageDurationSeconds": "87.50",
    "totalTasks": 198,
    "averageTasksPerWorkflow": "4.71"
  },
  "activeWorkflows": ["pattern-development", "oss-contribution"],
  "timestamp": "2025-10-24T..."
}
```

---

## 🔧 Programmatic Usage

### Direct Orchestrator Usage

```typescript
import { getOrchestrator } from '@/lib/agents/claude-orchestrator';
import { PATTERN_DEVELOPMENT_WORKFLOW } from '@/lib/agents/workflows';

// Get orchestrator instance
const orchestrator = getOrchestrator(process.env.ANTHROPIC_API_KEY);

// Execute workflow
const result = await orchestrator.executeWorkflow({
  ...PATTERN_DEVELOPMENT_WORKFLOW,
  tasks: PATTERN_DEVELOPMENT_WORKFLOW.tasks.map(task => ({
    ...task,
    context: {
      requirements: 'Build a RAG system...',
      use_case: 'Healthcare Q&A'
    }
  }))
});

console.log(result.success);
result.results.forEach(r => console.log(r.output));
```

### Custom Workflow Creation

```typescript
import { WorkflowConfig } from '@/lib/agents/claude-orchestrator';
import { AGENT_LIBRARY } from '@/lib/agents/agent-library';

const customWorkflow: WorkflowConfig = {
  name: 'custom-review',
  description: 'Custom pattern review workflow',
  agents: AGENT_LIBRARY,
  tasks: [
    {
      id: 'review',
      agentName: 'qa-agent',
      prompt: 'Review this pattern: {{pattern_code}}',
      context: {}
    },
    {
      id: 'document',
      agentName: 'documentation-agent',
      prompt: 'Document findings: {{dependencies.review}}',
      dependencies: ['review']
    }
  ]
};

const result = await orchestrator.executeWorkflow(customWorkflow);
```

---

## 🔗 GitHub OSS Integration

### Submit Pattern to OSS

```typescript
import { createGitHubSync } from '@/lib/github/oss-sync';

const github = createGitHubSync({
  owner: 'ai-architect-academy',
  repo: 'patterns',
  token: process.env.GITHUB_TOKEN
});

const result = await github.submitPatternToOSS({
  id: 'rag-medical',
  name: 'Medical RAG System',
  type: 'rag',
  description: 'Production RAG for healthcare',
  code: '...',
  documentation: '...',
  metadata: {
    features: ['HIPAA compliant', 'Low latency'],
    author: 'AI Architect Academy'
  }
});

console.log(result.prUrl); // PR URL in GitHub
```

### Fetch Patterns from OSS

```typescript
// Fetch all patterns
const allPatterns = await github.fetchPatternsFromOSS();

// Fetch specific type
const ragPatterns = await github.fetchPatternsFromOSS('rag');

console.log(`Found ${ragPatterns.length} RAG patterns`);
```

---

## 📊 Performance Metrics

### Typical Execution Times

| Operation | Duration | Model |
|-----------|----------|-------|
| Single Agent (Simple) | 5-10s | Haiku |
| Single Agent (Complex) | 15-30s | Sonnet |
| Workflow (3 tasks) | 30-60s | Mixed |
| Workflow (6 tasks) | 60-120s | Mixed |

### Cost Estimates (per execution)

| Agent | Model | Avg Tokens | Est. Cost |
|-------|-------|------------|-----------|
| Pattern Builder | Sonnet | ~3000 | $0.09 |
| QA Agent | Sonnet | ~2000 | $0.06 |
| Documentation | Haiku | ~2000 | $0.01 |
| Architecture Review | Sonnet | ~4000 | $0.12 |
| Learning Assistant | Haiku | ~1500 | $0.007 |

**Note:** Costs based on Claude 3.5 pricing as of October 2024.

---

## 🎨 UI Components

### AgentExecutor
Single agent execution interface with:
- Agent selection dropdown
- Prompt input textarea
- JSON context editor
- Real-time result display
- Tool usage visualization

### WorkflowRunner
Multi-agent workflow interface with:
- Workflow cards for selection
- Dynamic variable inputs
- Task progress tracking
- Sequential result display
- Timing metrics

### AgentDashboard
Complete dashboard with:
- Metrics cards (total workflows, success rate, avg duration)
- Tabbed interface (Executor / Runner)
- Agent and workflow listings
- System status information

---

## 🛠️ Advanced Usage

### Streaming Execution

```typescript
// Client-side streaming
const eventSource = new EventSource('/api/agents/stream');

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === 'content') {
    console.log(data.data.text); // Stream content
  } else if (data.type === 'complete') {
    eventSource.close();
  }
};
```

### Custom Agent Creation

```typescript
import { AgentConfig } from '@/lib/agents/claude-orchestrator';

const customAgent: AgentConfig = {
  name: 'security-auditor',
  provider: 'claude-3-5-sonnet',
  temperature: 0.2,
  maxTokens: 4096,
  systemPrompt: `You are a security expert...`,
  tools: [
    {
      name: 'scan_vulnerabilities',
      description: 'Scan code for security vulnerabilities',
      input_schema: {
        type: 'object',
        properties: {
          code: { type: 'string' },
          severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] }
        },
        required: ['code']
      }
    }
  ]
};

orchestrator.registerAgent(customAgent);
```

---

## 🧪 Testing

### Unit Tests Example

```typescript
import { getOrchestrator } from '@/lib/agents/claude-orchestrator';

describe('Agent Orchestrator', () => {
  it('should execute single agent', async () => {
    const orchestrator = getOrchestrator();
    const result = await orchestrator.executeAgent(
      'documentation-agent',
      'Generate README for RAG system'
    );

    expect(result.success).toBe(true);
    expect(result.output).toContain('README');
  });
});
```

---

## 🐛 Troubleshooting

### Common Issues

**Issue:** `ANTHROPIC_API_KEY not configured`
**Solution:** Set environment variable in `.env.local`:
```bash
ANTHROPIC_API_KEY=sk-ant-...
```

**Issue:** Agent execution timeout
**Solution:** Increase `maxTokens` or simplify prompt. Sonnet typically completes in <30s.

**Issue:** Workflow dependency error
**Solution:** Ensure all task IDs referenced in `dependencies` array exist.

**Issue:** GitHub sync fails
**Solution:** Verify `GITHUB_TOKEN` has `repo` scope permissions.

---

## 📚 Best Practices

### 1. Agent Selection
- **Haiku:** Simple tasks, documentation, learning assistance
- **Sonnet:** Complex reasoning, code generation, reviews
- **Opus:** Reserved for most complex multi-step reasoning

### 2. Prompt Engineering
- Be specific about desired output format
- Provide relevant context in `context` parameter
- Use workflows for multi-step tasks

### 3. Cost Optimization
- Use Haiku for simple tasks (20x cheaper than Sonnet)
- Cache agent instances
- Batch similar requests

### 4. Error Handling
- Always check `result.success` before using output
- Implement retry logic for transient failures
- Log `result.metadata` for debugging

---

## 🚀 Next Steps

1. **Try the Dashboard:** Navigate to `/agents` in your browser
2. **Execute Your First Agent:** Use Pattern Builder to create a RAG system
3. **Run a Workflow:** Try Pattern Development workflow
4. **Submit to OSS:** Use OSS Contribution workflow
5. **Customize:** Create your own agents and workflows

---

## 📝 License

MIT License - Feel free to use in your projects!

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Test your changes
4. Submit a PR with clear description

---

## 📞 Support

- **Documentation:** This file
- **Issues:** GitHub Issues
- **Community:** AI Architect Academy Discord

---

**Built with ❤️ by the AI Architect Academy team using Claude 3.5 Sonnet**
