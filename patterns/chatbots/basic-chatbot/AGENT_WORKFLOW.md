# 🤖 Building Your AI Chatbot with Claude Code - Agent Workflow

## Overview

This guide shows you how to build a production-ready AI chatbot using **Claude Code** (or any AI coding agent). You'll learn by doing, with the AI agent as your pair programmer.

**Total Time: 1.5 hours**
**Skill Level: Beginner**
**Prerequisites: Basic JavaScript/React knowledge**

---

## 🎯 What We're Building

A complete AI chatbot system with:
- ✅ Next.js 14 API backend
- ✅ Streaming chat responses
- ✅ Conversation memory
- ✅ Beautiful chat UI
- ✅ Error handling
- ✅ Production deployment

---

## 🚀 Phase 1: Project Setup (10 min)

### Step 1.1: Initialize Project

**Prompt to Claude Code:**
```
I want to build an AI chatbot using Next.js 14, TypeScript, and Tailwind CSS.
Create the project structure with:
- App router (not pages router)
- TypeScript configuration
- Tailwind CSS setup
- Environment variable template

Generate the initial files and folder structure.
```

**Expected Output:**
- `package.json` with dependencies
- `tsconfig.json`
- `tailwind.config.ts`
- `app/layout.tsx`
- `app/page.tsx`
- `.env.example`

### Step 1.2: Install Dependencies

**Prompt:**
```
Add these dependencies to package.json:
- openai (or @anthropic-ai/sdk if using Claude)
- ai (Vercel AI SDK) for streaming
- zod for validation

Show me the updated package.json.
```

**Then run:**
```bash
npm install
```

---

## 🔧 Phase 2: Backend - Chat API (30 min)

### Step 2.1: Create Chat API Route

**Prompt to Claude Code:**
```
Create an API route at /api/chat that:

1. Accepts POST requests with this body:
   - messages: array of {role: 'user'|'assistant', content: string}
   - model: string (default: 'gpt-3.5-turbo')

2. Calls OpenAI Chat Completions API
3. Returns streaming responses
4. Handles errors gracefully
5. Includes rate limiting headers

Use TypeScript and include proper types.
File location: app/api/chat/route.ts
```

**What Claude Code Will Generate:**
```typescript
// app/api/chat/route.ts
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages,
      stream: true,
    }),
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}
```

### Step 2.2: Add System Prompt Support

**Prompt:**
```
Update the /api/chat route to support a system prompt.
Add it at the beginning of the messages array.
Default system prompt: "You are a helpful AI assistant."
Allow custom system prompts from the request body.
```

### Step 2.3: Add Conversation History Management

**Prompt:**
```
Add logic to the API route to:
1. Limit conversation history to last 10 messages (to fit context window)
2. Always include the system message
3. Return the trimmed message count in response headers

Show the updated route.ts file.
```

---

## 🎨 Phase 3: Frontend - Chat UI (40 min)

### Step 3.1: Create Chat Component

**Prompt to Claude Code:**
```
Create a chat component at app/components/Chat.tsx with:

1. State management for messages
2. Text input field at the bottom
3. Message list with auto-scroll
4. Different styling for user vs assistant messages
5. Loading indicator during AI response
6. Send button

Use Tailwind CSS for styling. Make it modern and clean.
Include TypeScript types.
```

**Expected Component Structure:**
```tsx
'use client'
import { useState } from 'react'
import { useChat } from 'ai/react'

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()

  return (
    <div className="flex flex-col h-screen">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div key={message.id} className={/* user/assistant styling */}>
            {message.content}
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t p-4">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="w-full px-4 py-2 border rounded-lg"
        />
      </form>
    </div>
  )
}
```

### Step 3.2: Add Streaming Response Animation

**Prompt:**
```
Update the Chat component to show streaming responses character by character.
Add a typing indicator when the AI is generating a response.
Use a subtle animation for new characters appearing.
```

### Step 3.3: Add Error Handling UI

**Prompt:**
```
Add error handling to the Chat component:
1. Show error message if API fails
2. Add retry button
3. Display rate limit warnings
4. Show connection status

Use toast notifications or inline error messages.
```

### Step 3.4: Improve Message Display

**Prompt:**
```
Enhance the message display:
1. Add markdown support for AI responses (code blocks, lists, etc.)
2. Add copy button for code blocks
3. Add timestamp to each message
4. Make user messages right-aligned, AI messages left-aligned
5. Add avatar icons

Show the updated Chat component.
```

---

## 🔒 Phase 4: Polish & Security (20 min)

### Step 4.1: Add Input Validation

**Prompt to Claude Code:**
```
Add input validation to the chat:
1. Max message length (1000 characters)
2. Rate limiting (max 10 messages per minute)
3. Prevent empty messages
4. Sanitize user input

Update both the API route and the Chat component.
```

### Step 4.2: Add Environment Variable Validation

**Prompt:**
```
Create a config file that validates environment variables at startup:
1. OPENAI_API_KEY is required
2. Show helpful error if missing
3. Validate API key format

File: lib/config.ts
```

### Step 4.3: Add Loading States

**Prompt:**
```
Improve the UX with better loading states:
1. Skeleton loader for initial messages
2. Pulsing indicator while AI is typing
3. Smooth transitions when messages appear
4. Disabled input while loading

Update the Chat component with these enhancements.
```

---

## 🚀 Phase 5: Deployment (15 min)

### Step 5.1: Prepare for Production

**Prompt to Claude Code:**
```
Prepare the app for production deployment on Vercel:
1. Create vercel.json config file
2. Add build optimization
3. Set up environment variables
4. Add .gitignore for secrets

Show all the files I need.
```

### Step 5.2: Deploy to Vercel

**Run Commands:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variable
vercel env add OPENAI_API_KEY

# Deploy to production
vercel --prod
```

**Or use Vercel Dashboard:**
1. Push code to GitHub
2. Import project in Vercel
3. Add `OPENAI_API_KEY` environment variable
4. Deploy

### Step 5.3: Test Production Deployment

**Prompt:**
```
Create a testing checklist for the deployed chatbot.
Include:
- Functionality tests
- Performance checks
- Error scenario tests
- Security validations

Generate a markdown checklist I can use.
```

---

## ✅ Completion Checklist

You've completed the pattern when:

- [ ] Project runs locally without errors
- [ ] Chat conversation works with multiple messages
- [ ] Streaming responses display correctly
- [ ] Error handling works (test by disconnecting API)
- [ ] UI is responsive and polished
- [ ] Deployed to production and accessible via URL
- [ ] Environment variables secured
- [ ] README.md documents your deployment

---

## 🎓 Key Learnings

**Technical Skills Gained:**
- ✅ Next.js 14 App Router API routes
- ✅ OpenAI API integration
- ✅ Streaming responses with Server-Sent Events
- ✅ React state management with `useChat` hook
- ✅ Tailwind CSS for modern UI
- ✅ TypeScript for type safety
- ✅ Production deployment on Vercel

**AI Agent Collaboration Skills:**
- ✅ Breaking down complex tasks into prompts
- ✅ Iterating on generated code
- ✅ Debugging with AI assistance
- ✅ Asking for enhancements and optimizations

---

## 🔗 Agent Prompts Summary

**Quick Reference for Building:**

1. **Setup**: "Initialize Next.js 14 project with TypeScript and Tailwind"
2. **API**: "Create /api/chat route with OpenAI streaming"
3. **UI**: "Build chat component with message list and input"
4. **Polish**: "Add markdown support and error handling"
5. **Deploy**: "Prepare for Vercel deployment"

---

## 🎁 Bonus: Advanced Features

Want to go further? Try these prompts:

**Add Voice Input:**
```
Add voice input to the chat using Web Speech API.
Include a microphone button that transcribes speech to text.
```

**Add Chat History:**
```
Add chat history persistence using localStorage.
Show previous conversations in a sidebar.
Allow users to start new conversations.
```

**Add Multi-Model Support:**
```
Allow users to switch between GPT-3.5, GPT-4, and Claude models.
Add a model selector dropdown in the UI.
```

---

## 🏆 Achievement Unlocked!

**🤖 First AI Chatbot Builder**

You've successfully built and deployed an AI chatbot using agent-assisted development!

**Next Steps:**
1. Share your deployment URL in the community
2. Add it to your portfolio
3. Move on to the next pattern: Advanced Chatbot or RAG System

---

**Questions?** Ask in the Discord or submit a GitHub issue.
**Improvements?** Submit a PR with your enhancements!

**Happy Building! 🚀**
