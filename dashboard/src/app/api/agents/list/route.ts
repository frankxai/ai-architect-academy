/**
 * Agent Library API Route
 *
 * Lists all available agents with their configurations.
 */

import { NextRequest, NextResponse } from 'next/server';
import { AGENT_LIBRARY, getAgentsByProvider, listAgentsByCapability } from '@/lib/agents/agent-library';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const capability = searchParams.get('capability');
    const provider = searchParams.get('provider');

    let agents = AGENT_LIBRARY;

    // Filter by capability if provided
    if (capability) {
      agents = listAgentsByCapability(capability);
    }

    // Filter by provider if provided
    if (provider) {
      agents = getAgentsByProvider(provider);
    }

    // Format response
    const formattedAgents = agents.map(agent => ({
      name: agent.name,
      provider: agent.provider,
      hasTools: (agent.tools?.length || 0) > 0,
      toolCount: agent.tools?.length || 0,
      temperature: agent.temperature,
      maxTokens: agent.maxTokens,
      description: extractDescription(agent.systemPrompt)
    }));

    return NextResponse.json({
      agents: formattedAgents,
      totalCount: formattedAgents.length,
      filters: {
        capability: capability || 'none',
        provider: provider || 'none'
      },
      availableCapabilities: [
        'building',
        'quality',
        'documentation',
        'learning',
        'integration'
      ],
      availableProviders: [
        'claude-3-5-sonnet',
        'claude-3-5-haiku',
        'claude-3-opus'
      ]
    });

  } catch (error) {
    console.error('Agent list error:', error);
    return NextResponse.json(
      {
        error: 'Failed to list agents',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

function extractDescription(systemPrompt: string): string {
  // Extract first sentence or first line
  const lines = systemPrompt.split('\n').filter(line => line.trim());
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    // Remove "You are" prefix if present
    return firstLine.replace(/^You are\s+/i, '');
  }
  return 'No description available';
}
