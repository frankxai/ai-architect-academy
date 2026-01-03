/**
 * Agent Dashboard Component
 *
 * Main dashboard for agent orchestration system.
 */

'use client';

import { useState, useEffect } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { AgentExecutor } from './AgentExecutor';
import { WorkflowRunner } from './WorkflowRunner';
import { AgentChat } from './AgentChat';
import { Activity, Zap, TrendingUp, MessageSquare } from 'lucide-react';

interface Agent {
  name: string;
  provider: string;
  description: string;
  hasTools: boolean;
  toolCount: number;
}

interface Workflow {
  type: string;
  name: string;
  description: string;
  taskCount: number;
  requiredVariables: string[];
}

interface Metrics {
  totalWorkflows: number;
  successRatePercentage: string;
  averageDurationSeconds: string;
  totalTasks: number;
}

export function AgentDashboard() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load agents
      const agentsRes = await fetch('/api/agents/list');
      const agentsData = await agentsRes.json();
      setAgents(agentsData.agents || []);

      // Load workflows
      const workflowsRes = await fetch('/api/agents/workflow');
      const workflowsData = await workflowsRes.json();
      setWorkflows(workflowsData.workflows || []);

      // Load metrics
      const metricsRes = await fetch('/api/agents/metrics');
      const metricsData = await metricsRes.json();
      setMetrics(metricsData.metrics || null);

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading agent system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Agent Orchestration System</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Execute specialized AI agents and multi-agent workflows
        </p>
      </div>

      {/* Metrics Cards */}
      {metrics && metrics.totalWorkflows > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-cyan-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Workflows
                </p>
                <p className="text-2xl font-bold">{metrics.totalWorkflows}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Success Rate
                </p>
                <p className="text-2xl font-bold">{metrics.successRatePercentage}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Avg Duration
                </p>
                <p className="text-2xl font-bold">{metrics.averageDurationSeconds}s</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-orange-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Tasks
                </p>
                <p className="text-2xl font-bold">{metrics.totalTasks}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('chat')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'chat'
                ? 'border-cyan-500 text-cyan-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Agent Chat
            <span className="ml-2 px-2 py-0.5 text-xs bg-cyan-500 text-white rounded-full">
              NEW
            </span>
          </button>
          <button
            onClick={() => setActiveTab('executor')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'executor'
                ? 'border-cyan-500 text-cyan-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Agent Executor
            <span className="ml-2 text-xs text-gray-400">
              ({agents.length} agents)
            </span>
          </button>
          <button
            onClick={() => setActiveTab('workflow')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'workflow'
                ? 'border-cyan-500 text-cyan-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Workflow Runner
            <span className="ml-2 text-xs text-gray-400">
              ({workflows.length} workflows)
            </span>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'chat' && <AgentChat agents={agents} />}
        {activeTab === 'executor' && <AgentExecutor agents={agents} />}
        {activeTab === 'workflow' && <WorkflowRunner workflows={workflows} />}
      </div>

      {/* Info Footer */}
      <Card className="p-4 bg-slate-50 dark:bg-slate-900">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-cyan-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium">Hybrid System Ready</h3>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <p>
                • <strong>Agent Chat:</strong> Real-time streaming with Vercel AI SDK + Claude SDK
              </p>
              <p>
                • <strong>Single Agents:</strong> Execute specialized tasks with individual agents
              </p>
              <p>
                • <strong>Workflows:</strong> Run complex multi-agent workflows with automatic dependency management
              </p>
              <p>
                • <strong>8 Specialized Agents:</strong> Pattern Builder, QA, Documentation, Architecture Review, Learning, Optimizer, GitHub, Compliance
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
