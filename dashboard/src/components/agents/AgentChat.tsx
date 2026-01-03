/**
 * Agent Chat Component
 *
 * Hybrid approach using BOTH:
 * - Claude SDK (backend via /api/agents/chat)
 * - Vercel AI SDK (useChat hook for streaming UI)
 */

'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Send, Sparkles, Loader2 } from 'lucide-react';

interface AgentChatProps {
  agents: Array<{
    name: string;
    provider: string;
    description: string;
  }>;
}

export function AgentChat({ agents }: AgentChatProps) {
  const [selectedAgent, setSelectedAgent] = useState('pattern-builder');

  // Vercel AI SDK - handles streaming automatically!
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/agents/chat',
    body: {
      agentName: selectedAgent
    }
  });

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">Agent Chat</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real-time streaming with Vercel AI SDK
            </p>
          </div>
          <Sparkles className="w-6 h-6 text-cyan-500" />
        </div>

        {/* Agent Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Select Agent
          </label>
          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="w-full p-2 border rounded-md bg-white dark:bg-gray-800"
            disabled={isLoading}
          >
            {agents.map((agent) => (
              <option key={agent.name} value={agent.name}>
                {agent.name} ({agent.provider})
              </option>
            ))}
          </select>
          {selectedAgent && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              {agents.find((a) => a.name === selectedAgent)?.description}
            </p>
          )}
        </div>

        {/* Chat Messages */}
        <div className="border rounded-lg mb-4">
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <Bot className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Ask the agent anything!
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Powered by Claude SDK + Vercel AI SDK
                  </p>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-cyan-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-4 h-4" />
                      <span className="text-xs font-medium">
                        {selectedAgent}
                      </span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Agent is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask the agent anything..."
            className="flex-1 p-3 border rounded-lg bg-white dark:bg-gray-800"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-cyan-500 to-blue-500"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send
              </>
            )}
          </Button>
        </form>

        {/* Info */}
        <div className="mt-4 p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-md">
          <p className="text-xs text-cyan-900 dark:text-cyan-100">
            <strong>Hybrid System:</strong> Claude SDK orchestrates agents on backend,
            Vercel AI SDK streams responses to UI in real-time.
          </p>
        </div>
      </Card>

      {/* Quick Examples */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Try These Examples</h3>
        <div className="space-y-2">
          {[
            'Build a production RAG system with Pinecone and LangChain',
            'Review this code for security vulnerabilities: async function query() { ... }',
            'Generate API documentation for a FastAPI RAG endpoint',
            'Optimize this RAG system for cost: currently spending $500/month'
          ].map((example, idx) => (
            <button
              key={idx}
              onClick={() => {
                handleInputChange({
                  target: { value: example }
                } as any);
              }}
              className="w-full text-left p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              disabled={isLoading}
            >
              💡 {example}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
