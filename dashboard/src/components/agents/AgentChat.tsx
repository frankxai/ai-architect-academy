/**
 * Agent Chat Component
 *
 * Simplified chat interface for agent interactions.
 */

'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Send, Sparkles, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface AgentChatProps {
  agents: Array<{
    name: string;
    provider: string;
    description: string;
  }>;
}

export function AgentChat({ agents }: AgentChatProps) {
  const [selectedAgent, setSelectedAgent] = useState('pattern-builder');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/agents/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          agentName: selectedAgent
        })
      });

      const text = await response.text();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: text
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, there was an error processing your request.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-slate-900 border-slate-800">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">Agent Chat</h2>
            <p className="text-sm text-slate-400">
              Chat with AI Architect agents
            </p>
          </div>
          <Sparkles className="w-6 h-6 text-cyan-500" />
        </div>

        {/* Agent Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-slate-300">
            Select Agent
          </label>
          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="w-full p-2 border border-slate-700 rounded-md bg-slate-800 text-white"
            disabled={isLoading}
          >
            {agents.map((agent) => (
              <option key={agent.name} value={agent.name}>
                {agent.name} ({agent.provider})
              </option>
            ))}
          </select>
          {selectedAgent && (
            <p className="text-xs text-slate-500 mt-2">
              {agents.find((a) => a.name === selectedAgent)?.description}
            </p>
          )}
        </div>

        {/* Chat Messages */}
        <div className="border border-slate-700 rounded-lg mb-4">
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <Bot className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-400">
                    Ask the agent anything!
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Powered by Claude SDK
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
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-slate-800 text-slate-200'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-medium text-cyan-400">
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
                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-slate-300">
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
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the agent anything..."
            className="flex-1 p-3 border border-slate-700 rounded-lg bg-slate-800 text-white placeholder-slate-500"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
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
      </Card>

      {/* Quick Examples */}
      <Card className="p-6 bg-slate-900 border-slate-800">
        <h3 className="font-semibold mb-4 text-white">Try These Examples</h3>
        <div className="space-y-2">
          {[
            'Build a production RAG system with Pinecone and LangChain',
            'Review this code for security vulnerabilities',
            'Generate API documentation for a FastAPI RAG endpoint',
            'Optimize this RAG system for cost efficiency'
          ].map((example, idx) => (
            <button
              key={idx}
              onClick={() => setInput(example)}
              className="w-full text-left p-3 bg-slate-800 rounded-lg text-sm text-slate-300 hover:bg-slate-700 transition-colors"
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
