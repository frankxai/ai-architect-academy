/**
 * Agent Metrics API Route
 *
 * Returns workflow execution metrics and analytics.
 */

import { NextResponse } from 'next/server';
import { getOrchestrator } from '@/lib/agents/claude-orchestrator';

export async function GET() {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 500 }
      );
    }

    const orchestrator = getOrchestrator(apiKey);
    const metrics = orchestrator.exportWorkflowMetrics();
    const workflows = orchestrator.listWorkflows();

    return NextResponse.json({
      metrics: {
        ...metrics,
        successRatePercentage: (metrics.successRate * 100).toFixed(2) + '%',
        averageDurationSeconds: (metrics.averageDuration / 1000).toFixed(2),
        averageTasksPerWorkflow: metrics.totalWorkflows > 0
          ? (metrics.totalTasks / metrics.totalWorkflows).toFixed(2)
          : 0
      },
      activeWorkflows: workflows,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Metrics error:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve metrics',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
