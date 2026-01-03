/**
 * Agent Executor Component
 *
 * UI for executing single agents with prompt and context.
 */

'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface AgentExecutorProps {
  agents: Array<{
    name: string;
    provider: string;
    description: string;
    hasTools: boolean;
  }>;
}

interface ExecutionResult {
  success: boolean;
  result: {
    taskId: string;
    agentName: string;
    output: string;
    durationMs: number;
    metadata?: any;
    toolUses?: any[];
  };
}

export function AgentExecutor({ agents }: AgentExecutorProps) {
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [context, setContext] = useState<string>('{}');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExecute = async () => {
    if (!selectedAgent || !prompt) {
      setError('Please select an agent and enter a prompt');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const parsedContext = JSON.parse(context);

      const response = await fetch('/api/agents/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentName: selectedAgent,
          prompt,
          context: parsedContext
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to execute agent');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Agent Executor</h2>

        {/* Agent Selection */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Agent
            </label>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-800"
            >
              <option value="">Choose an agent...</option>
              {agents.map((agent) => (
                <option key={agent.name} value={agent.name}>
                  {agent.name} ({agent.provider})
                  {agent.hasTools && ' 🔧'}
                </option>
              ))}
            </select>
          </div>

          {/* Selected Agent Info */}
          {selectedAgent && (
            <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-md">
              <p className="text-sm">
                {agents.find((a) => a.name === selectedAgent)?.description}
              </p>
            </div>
          )}

          {/* Prompt Input */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your task or question for the agent..."
              className="w-full p-3 border rounded-md min-h-[120px] bg-white dark:bg-gray-800"
            />
          </div>

          {/* Context Input (JSON) */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Context (JSON)
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder='{"key": "value"}'
              className="w-full p-3 border rounded-md font-mono text-sm min-h-[80px] bg-white dark:bg-gray-800"
            />
          </div>

          {/* Execute Button */}
          <Button
            onClick={handleExecute}
            disabled={loading || !selectedAgent || !prompt}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Execute Agent
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="p-6 bg-red-50 dark:bg-red-900/20 border-red-200">
          <div className="flex items-start">
            <XCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-100">
                Execution Error
              </h3>
              <p className="text-sm text-red-800 dark:text-red-200 mt-1">
                {error}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Result Display */}
      {result && result.success && (
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="font-semibold text-lg">Execution Complete</h3>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Duration: {(result.result.durationMs / 1000).toFixed(2)}s
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Output:</h4>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                <pre className="text-sm whitespace-pre-wrap">
                  {result.result.output}
                </pre>
              </div>
            </div>

            {result.result.toolUses && result.result.toolUses.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">
                  Tools Used ({result.result.toolUses.length}):
                </h4>
                <div className="space-y-2">
                  {result.result.toolUses.map((tool, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md"
                    >
                      <p className="font-mono text-sm font-semibold">
                        {tool.name}
                      </p>
                      <pre className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                        {JSON.stringify(tool.input, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.result.metadata && (
              <details className="text-sm">
                <summary className="cursor-pointer font-medium">
                  Metadata
                </summary>
                <pre className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded text-xs">
                  {JSON.stringify(result.result.metadata, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
