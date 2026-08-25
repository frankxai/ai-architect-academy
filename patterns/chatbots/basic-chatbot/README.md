# 🤖 Basic AI Chatbot - Deployable Pattern

## Overview

Build and deploy your first AI-powered chatbot in under 2 hours using Claude Code, complete with conversation memory, streaming responses, and production-ready deployment.

## What You'll Learn & Build

### Learning Outcomes:
- ✅ LLM API integration (OpenAI/Anthropic/OpenRouter)
- ✅ Conversation history management
- ✅ Streaming response handling
- ✅ System prompts and context design
- ✅ Rate limiting and error handling

### What You'll Deploy:
- ✅ Fully functional AI chatbot API
- ✅ Web interface (React/Next.js)
- ✅ Conversation persistence
- ✅ Production hosting (Vercel/Railway)

## 📊 Pattern Specs

| Aspect | Details |
|--------|---------|
| **Difficulty** | Beginner |
| **Time to Build** | 1.5 - 2 hours |
| **Time to Deploy** | 15 minutes |
| **Point Value** | 100 points |
| **Tech Stack** | Next.js 14, OpenAI API, Vercel |
| **Use Cases** | Customer support, Q&A, general assistance |

## 🏗️ Architecture

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       ▼
┌──────────────────────────┐
│   Next.js Frontend       │
│  (Chat Interface)        │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│   API Route              │
│  /api/chat               │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│   LLM Provider           │
│  (OpenAI/Anthropic)      │
└──────────────────────────┘
```

See architecture/ for detailed diagrams.

## 🚀 Quick Start (5 min)

### Option 1: Deploy with One Click
```bash
# Clone template
npx create-next-app my-ai-chatbot --use-npm -e https://github.com/ai-architect-academy/basic-chatbot-template

cd my-ai-chatbot

# Add your API key
echo "OPENAI_API_KEY=your-key-here" > .env.local

# Run locally
npm run dev

# Deploy to Vercel
vercel deploy
```

### Option 2: Build with Claude Code (Agent Workflow)
See [AGENT_WORKFLOW.md](./AGENT_WORKFLOW.md) for step-by-step agent-assisted development.

## 📚 Learning Guide

### 1. Core Concepts (15 min)

**LLM APIs & Chat Completions**
- Understanding the chat completion format
- System messages vs user messages
- Temperature and response parameters

**Conversation Memory**
- Storing message history
- Context window management
- Pruning old messages

**Streaming Responses**
- Server-Sent Events (SSE)
- Progressive UI updates
- Error handling in streams

### 2. Implementation Steps (1 hour)

Follow the detailed guide: IMPLEMENTATION.md

1. **Setup Project** (10 min)
2. **Build API Endpoint** (20 min)
3. **Create Chat Interface** (20 min)
4. **Add Conversation History** (10 min)

### 3. Testing & Validation (15 min)

**Test Checklist:**
- [ ] Single message works
- [ ] Multi-turn conversation maintains context
- [ ] Streaming displays progressively
- [ ] Error states handled gracefully
- [ ] Rate limiting works

### 4. Deployment (15 min)

Follow: deployment/DEPLOY.md

## 🏭 Build with AI Agents

### Claude Code Workflow

**Phase 1: Design (15 min)**
```
Prompt: "Help me design a production-ready AI chatbot API using Next.js 14.
Include: chat endpoint, streaming responses, conversation history, error handling.
Show me the file structure and API design."
```

**Phase 2: Implement Backend (20 min)**
```
Prompt: "Implement the /api/chat route with:
- OpenAI API integration
- Streaming responses using ReadableStream
- Conversation history from request body
- Error handling and rate limiting
- TypeScript types"
```

**Phase 3: Build Frontend (20 min)**
```
Prompt: "Create a chat interface component with:
- Message list with user/assistant bubbles
- Input field with send button
- Streaming message display
- Loading states
- Error handling
- Tailwind CSS styling"
```

**Phase 4: Deploy (10 min)**
```
Prompt: "Help me deploy this to Vercel.
Include: environment variable setup, build optimization, deployment command."
```

See full workflow: [AGENT_WORKFLOW.md](./AGENT_WORKFLOW.md)

## 🏥 Industry Variants

### Healthcare Chatbot (HIPAA-Compliant)
- PHI handling and encryption
- Audit logging
- Consent management
- See: industry-variants/healthcare/

### Financial Advisor Chatbot
- Regulatory disclaimers
- Risk warnings
- Session encryption
- See: industry-variants/finance/

### Customer Support Chatbot
- Ticketing integration
- Escalation workflows
- Analytics tracking
- See: industry-variants/support/

## 📦 What's Included

### Code Template
- ✅ Complete Next.js 14 app
- ✅ TypeScript configuration
- ✅ Tailwind CSS setup
- ✅ API route with streaming
- ✅ Chat UI component
- ✅ Conversation history management
- ✅ Error handling

### Documentation
- ✅ Architecture diagrams
- ✅ Implementation guide
- ✅ Agent workflows
- ✅ Deployment instructions
- ✅ Testing checklist

### Industry Adaptations
- ✅ Healthcare (HIPAA)
- ✅ Finance (regulatory)
- ✅ Customer support

## 🎯 Success Criteria

You've successfully completed this pattern when:

- ✅ **Deployed**: Live chatbot accessible via URL
- ✅ **Functional**: Multi-turn conversations work
- ✅ **Performant**: Responses stream in real-time
- ✅ **Robust**: Error handling works
- ✅ **Documented**: README and deployment notes complete

## 🏆 Rewards

**Points Earned:** 100 points
**Badges Unlocked:**
- 🤖 First Chatbot Builder
- 🚀 System Deployer
- 💬 Conversation Designer

**Portfolio Addition:**
- Showcase your deployed chatbot
- Share on GitHub
- Add to resume/LinkedIn

## 🔗 Resources

### Official Docs
- [OpenAI Chat Completions](https://platform.openai.com/docs/guides/chat-completions)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Vercel Deployment](https://vercel.com/docs)

### Community
- Share your chatbot in Discord
- Get code review from mentors
- Contribute improvements

## ⏭️ Next Steps

After completing this pattern, you're ready for:

1. **Advanced Chatbot** - Multi-modal, voice, complex workflows
2. **RAG System** - Add knowledge base integration
3. **Agent System** - Tool-using conversational agent

---

**Ready to build?** Start with the [AGENT_WORKFLOW.md](./AGENT_WORKFLOW.md) to build using Claude Code! 🚀
