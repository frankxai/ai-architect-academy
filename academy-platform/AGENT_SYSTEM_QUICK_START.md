# Agent System Quick Start

## ⚡ 5-Minute Setup

### Step 1: Set API Key
```bash
# Create .env.local file
echo "ANTHROPIC_API_KEY=sk-ant-your-key-here" > .env.local
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Access Dashboard
Open `http://localhost:3000/agents`

---

## 🎯 First Agent Execution

### Using the UI (Easiest)

1. Navigate to `/agents`
2. Select "Agent Executor" tab
3. Choose **"pattern-builder"** from dropdown
4. Enter prompt:
   ```
   Build a production-ready RAG system using Pinecone and LangChain
   ```
5. Click "Execute Agent"
6. Wait 15-30 seconds
7. View complete implementation in results!

### Using the API

```bash
curl -X POST http://localhost:3000/api/agents/execute \
  -H "Content-Type: application/json" \
  -d '{
    "agentName": "pattern-builder",
    "prompt": "Build a production-ready RAG system using Pinecone and LangChain",
    "context": {
      "requirements": ["low latency", "high accuracy"]
    }
  }'
```

---

## 🔄 First Workflow Execution

### Using the UI

1. Navigate to `/agents`
2. Select "Workflow Runner" tab
3. Click **"Pattern Development"** card
4. Fill in variables:
   - **requirements:** `Build a RAG system for customer support`
   - **use_case:** `Answer customer questions using company documentation`
5. Click "Execute Workflow"
6. Watch 6 agents work together! (~2-3 minutes)

### Using the API

```bash
curl -X POST http://localhost:3000/api/agents/workflow \
  -H "Content-Type: application/json" \
  -d '{
    "workflowType": "PATTERN_DEVELOPMENT",
    "variables": {
      "requirements": "Build a RAG system for customer support",
      "use_case": "Answer customer questions using company docs"
    }
  }'
```

---

## 📊 Common Use Cases

### 1. Build a New AI Pattern
**Agent:** `pattern-builder`
**Prompt:**
```
Build a multi-agent system for code review that:
- Analyzes code quality
- Checks for security issues
- Suggests improvements
- Uses Claude 3.5 Sonnet
```

### 2. Review Existing Code
**Agent:** `qa-agent`
**Prompt:**
```
Review this RAG implementation for security vulnerabilities:
[paste code here]
```

### 3. Generate Documentation
**Agent:** `documentation-agent`
**Prompt:**
```
Create comprehensive API documentation for this FastAPI RAG system:
[paste code here]
```

### 4. Get Architecture Advice
**Agent:** `architecture-reviewer`
**Prompt:**
```
Review this AI system architecture and suggest improvements:
- Using OpenAI embeddings
- Pinecone vector DB
- LangChain for orchestration
- FastAPI backend
- React frontend
```

### 5. Optimize for Cost
**Agent:** `pattern-optimizer`
**Prompt:**
```
Optimize this RAG system for cost reduction:
[paste implementation]

Current costs: $500/month
Target: <$200/month
```

---

## 🎓 Learning Path

### Beginner
1. ✅ Execute single agent (Pattern Builder)
2. ✅ View results and understand output
3. ✅ Try different agents (QA, Documentation)

### Intermediate
4. ✅ Run pre-built workflow (Pattern Development)
5. ✅ Customize workflow variables
6. ✅ Use API endpoints programmatically

### Advanced
7. ✅ Create custom workflows
8. ✅ Build custom agents
9. ✅ Integrate with GitHub OSS
10. ✅ Deploy to production

---

## 📋 Cheat Sheet

### List All Agents
```bash
curl http://localhost:3000/api/agents/list
```

### List All Workflows
```bash
curl http://localhost:3000/api/agents/workflow
```

### Get Metrics
```bash
curl http://localhost:3000/api/agents/metrics
```

### Execute with Context
```typescript
await fetch('/api/agents/execute', {
  method: 'POST',
  body: JSON.stringify({
    agentName: 'pattern-builder',
    prompt: 'Build RAG system',
    context: {
      framework: 'langchain',
      vectorDB: 'pinecone',
      embeddings: 'openai-ada-002'
    }
  })
});
```

---

## 🚨 Common Mistakes

### ❌ Wrong Agent Selection
**Mistake:** Using Sonnet for simple documentation
**Fix:** Use `documentation-agent` (Haiku) - 20x cheaper!

### ❌ Missing Context
**Mistake:**
```json
{
  "prompt": "Build it"
}
```
**Fix:**
```json
{
  "prompt": "Build a RAG system",
  "context": {
    "requirements": ["low latency", "high accuracy"],
    "framework": "langchain"
  }
}
```

### ❌ Not Checking Success
**Mistake:**
```typescript
const result = await response.json();
console.log(result.result.output); // May crash!
```
**Fix:**
```typescript
const result = await response.json();
if (result.success) {
  console.log(result.result.output);
} else {
  console.error(result.error);
}
```

---

## 💡 Pro Tips

1. **Use Workflows for Complex Tasks**
   - Don't chain agents manually
   - Let workflows handle dependencies

2. **Leverage Agent Specialization**
   - Pattern Builder → Creation
   - QA Agent → Testing/Security
   - Optimizer → Performance

3. **Provide Rich Context**
   - Include relevant info in `context` parameter
   - Better context = better results

4. **Monitor Metrics**
   - Check `/api/agents/metrics` regularly
   - Track costs and duration

5. **Stream for Long Operations**
   - Use `/api/agents/stream` for real-time updates
   - Better UX for workflows >30s

---

## 🎯 Next Steps

1. ✅ **Execute Your First Agent** (5 minutes)
2. ✅ **Run a Workflow** (5 minutes)
3. ✅ **Read Full Documentation** (`AGENT_SYSTEM_DOCUMENTATION.md`)
4. ✅ **Build Custom Workflow** (30 minutes)
5. ✅ **Deploy to Production** (use Vercel)

---

## 📚 Resources

- **Full Documentation:** `AGENT_SYSTEM_DOCUMENTATION.md`
- **API Reference:** See "API Reference" section in docs
- **Example Code:** `examples/` directory (coming soon)
- **Video Tutorial:** [Link] (coming soon)

---

**Ready to build? Start at `/agents` 🚀**
