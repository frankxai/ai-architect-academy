/**
 * Agent Execution API Route
 *
 * Executes a single agent with the provided prompt and context.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOrchestrator } from '@/lib/agents/claude-orchestrator';
import { AGENT_LIBRARY_MAP } from '@/lib/agents/agent-library';

export async function POST(request: NextRequest) {
  try {
    const { agentName, prompt, context } = await request.json();

    // Validation
    if (!agentName || !prompt) {
      return NextResponse.json(
        { error: 'agentName and prompt are required' },
        { status: 400 }
      );
    }

    // Check if agent exists
    if (!AGENT_LIBRARY_MAP.has(agentName)) {
      return NextResponse.json(
        {
          error: `Agent "${agentName}" not found`,
          availableAgents: Array.from(AGENT_LIBRARY_MAP.keys())
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

    // Execute agent
    const orchestrator = getOrchestrator(apiKey);
    const result = await orchestrator.executeAgent(agentName, prompt, context);

    return NextResponse.json({
      success: result.success,
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Agent execution error:', error);
    return NextResponse.json(
      {
        error: 'Failed to execute agent',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Agent execution endpoint. Use POST to execute an agent.',
    requiredFields: ['agentName', 'prompt'],
    optionalFields: ['context'],
    example: {
      agentName: 'pattern-builder',
      prompt: 'Build a production-ready RAG system with Pinecone',
      context: {
        framework: 'langchain',
        requirements: ['low latency', 'high accuracy']
      }
    }
  });
}
