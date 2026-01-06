/**
 * Workflow Execution API Route
 *
 * Executes a pre-built multi-agent workflow.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOrchestrator } from '@/lib/agents/claude-orchestrator';
import { WORKFLOW_LIBRARY, WorkflowType, getWorkflow } from '@/lib/agents/workflows';

export async function POST(request: NextRequest) {
  try {
    const { workflowType, variables } = await request.json();

    // Validation
    if (!workflowType) {
      return NextResponse.json(
        { error: 'workflowType is required' },
        { status: 400 }
      );
    }

    // Check if workflow exists
    if (!(workflowType in WORKFLOW_LIBRARY)) {
      return NextResponse.json(
        {
          error: `Workflow "${workflowType}" not found`,
          availableWorkflows: Object.keys(WORKFLOW_LIBRARY)
        },
        { status: 404 }
      );
    }

    // Get API key from environment
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Get workflow configuration
    const workflow = getWorkflow(workflowType as WorkflowType);

    // Inject variables into task prompts
    const processedWorkflow = {
      ...workflow,
      tasks: workflow.tasks.map(task => ({
        ...task,
        prompt: injectVariables(task.prompt, variables || {}),
        context: { ...task.context, ...variables }
      }))
    };

    // Execute workflow
    const orchestrator = getOrchestrator(apiKey);
    const result = await orchestrator.executeWorkflow(processedWorkflow);

    return NextResponse.json({
      success: result.success,
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Workflow execution error:', error);
    return NextResponse.json(
      {
        error: 'Failed to execute workflow',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const workflows = Object.entries(WORKFLOW_LIBRARY).map(([key, workflow]) => ({
    type: key,
    name: workflow.name,
    description: workflow.description,
    taskCount: workflow.tasks.length,
    requiredVariables: extractRequiredVariables(workflow)
  }));

  return NextResponse.json({
    workflows,
    totalCount: workflows.length
  });
}

// ============================================================================
// Helper Functions
// ============================================================================

function injectVariables(template: string, variables: Record<string, any>): string {
  let result = template;

  // Replace {{variable}} patterns
  Object.entries(variables).forEach(([key, value]) => {
    const pattern = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(pattern, String(value));
  });

  return result;
}

function extractRequiredVariables(workflow: any): string[] {
  const variables = new Set<string>();

  workflow.tasks.forEach((task: any) => {
    const matches = task.prompt.match(/\{\{([^}]+)\}\}/g);
    if (matches) {
      matches.forEach((match: string) => {
        const varName = match.replace(/\{\{|\}\}/g, '');
        // Only include top-level variables, not dependencies
        if (!varName.startsWith('dependencies.')) {
          variables.add(varName);
        }
      });
    }
  });

  return Array.from(variables);
}
