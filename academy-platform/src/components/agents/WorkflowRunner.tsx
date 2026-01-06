/**
 * Workflow Runner Component
 *
 * UI for executing pre-built multi-agent workflows.
 */

'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Workflow {
  type: string;
  name: string;
  description: string;
  taskCount: number;
  requiredVariables: string[];
}

interface WorkflowRunnerProps {
  workflows: Workflow[];
}

interface WorkflowResult {
  success: boolean;
  result: {
    workflowName: string;
    results: Array<{
      taskId: string;
      agentName: string;
      success: boolean;
      output: string;
      durationMs: number;
    }>;
    totalDurationMs: number;
    startTime: string;
    endTime: string;
  };
}

export function WorkflowRunner({ workflows }: WorkflowRunnerProps) {
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WorkflowResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleWorkflowSelect = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setResult(null);
    setError(null);

    // Initialize variables
    const initialVars: Record<string, string> = {};
    workflow.requiredVariables.forEach((varName) => {
      initialVars[varName] = '';
    });
    setVariables(initialVars);
  };

  const handleExecute = async () => {
    if (!selectedWorkflow) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/agents/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflowType: selectedWorkflow.type,
          variables
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to execute workflow');
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
        <h2 className="text-2xl font-bold mb-4">Workflow Runner</h2>

        {/* Workflow Selection */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workflows.map((workflow) => (
              <button
                key={workflow.type}
                onClick={() => handleWorkflowSelect(workflow)}
                className={`p-4 border rounded-lg text-left transition-all ${
                  selectedWorkflow?.type === workflow.type
                    ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20'
                    : 'border-gray-200 hover:border-cyan-300'
                }`}
              >
                <h3 className="font-semibold mb-1">{workflow.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {workflow.description}
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <span className="mr-3">{workflow.taskCount} tasks</span>
                  {workflow.requiredVariables.length > 0 && (
                    <span>{workflow.requiredVariables.length} variables</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Variable Inputs */}
          {selectedWorkflow && selectedWorkflow.requiredVariables.length > 0 && (
            <div className="space-y-3 pt-4">
              <h3 className="font-medium">Required Variables</h3>
              {selectedWorkflow.requiredVariables.map((varName) => (
                <div key={varName}>
                  <label className="block text-sm font-medium mb-1">
                    {varName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </label>
                  <input
                    type="text"
                    value={variables[varName] || ''}
                    onChange={(e) =>
                      setVariables({ ...variables, [varName]: e.target.value })
                    }
                    placeholder={`Enter ${varName}...`}
                    className="w-full p-2 border rounded-md bg-white dark:bg-gray-800"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Execute Button */}
          {selectedWorkflow && (
            <Button
              onClick={handleExecute}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Executing Workflow...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Execute Workflow
                </>
              )}
            </Button>
          )}
        </div>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="p-6 bg-red-50 dark:bg-red-900/20 border-red-200">
          <div className="flex items-start">
            <XCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-100">
                Workflow Error
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="font-semibold text-lg">Workflow Complete</h3>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              {(result.result.totalDurationMs / 1000).toFixed(2)}s
            </div>
          </div>

          <div className="space-y-4">
            {result.result.results.map((taskResult, idx) => (
              <div
                key={taskResult.taskId}
                className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500 text-white text-xs font-bold mr-2">
                      {idx + 1}
                    </span>
                    <span className="font-medium">{taskResult.agentName}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {(taskResult.durationMs / 1000).toFixed(2)}s
                  </span>
                </div>

                <div className="pl-8">
                  {taskResult.success ? (
                    <div className="text-sm">
                      <details>
                        <summary className="cursor-pointer font-medium text-cyan-600 dark:text-cyan-400">
                          View Output
                        </summary>
                        <pre className="mt-2 p-3 bg-white dark:bg-gray-900 rounded text-xs whitespace-pre-wrap">
                          {taskResult.output}
                        </pre>
                      </details>
                    </div>
                  ) : (
                    <p className="text-sm text-red-600">Task failed</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
            <p className="text-sm font-medium text-green-900 dark:text-green-100">
              ✓ All tasks completed successfully
            </p>
            <p className="text-xs text-green-700 dark:text-green-300 mt-1">
              Workflow: {result.result.workflowName}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
