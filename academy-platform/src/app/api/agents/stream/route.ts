/**
 * Agent Streaming API Route
 *
 * Streams agent execution for real-time UI updates.
 */

import { NextRequest } from 'next/server';
import { getOrchestrator } from '@/lib/agents/claude-orchestrator';
import { AGENT_LIBRARY_MAP } from '@/lib/agents/agent-library';

export async function POST(request: NextRequest) {
  try {
    const { agentName, prompt, context } = await request.json();

    // Validation
    if (!agentName || !prompt) {
      return new Response(
        JSON.stringify({ error: 'agentName and prompt are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if agent exists
    if (!AGENT_LIBRARY_MAP.has(agentName)) {
      return new Response(
        JSON.stringify({
          error: `Agent "${agentName}" not found`,
          availableAgents: Array.from(AGENT_LIBRARY_MAP.keys())
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create ReadableStream for SSE
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const orchestrator = getOrchestrator(apiKey);

          // Stream agent execution
          for await (const event of orchestrator.streamAgentExecution(
            agentName,
            prompt,
            context
          )) {
            // Send SSE event
            const data = `data: ${JSON.stringify(event)}\n\n`;
            controller.enqueue(encoder.encode(data));
          }

          // Send completion event
          const completionEvent = `data: ${JSON.stringify({
            type: 'complete',
            data: { timestamp: new Date().toISOString() }
          })}\n\n`;
          controller.enqueue(encoder.encode(completionEvent));
          controller.close();

        } catch (error) {
          console.error('Streaming error:', error);
          const errorEvent = `data: ${JSON.stringify({
            type: 'error',
            data: {
              message: error instanceof Error ? error.message : 'Unknown error'
            }
          })}\n\n`;
          controller.enqueue(encoder.encode(errorEvent));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });

  } catch (error) {
    console.error('Stream initialization error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to initialize stream',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function GET() {
  return new Response(
    JSON.stringify({
      message: 'Agent streaming endpoint. Use POST to start streaming.',
      requiredFields: ['agentName', 'prompt'],
      optionalFields: ['context'],
      eventTypes: ['start', 'content', 'tool', 'end', 'complete', 'error'],
      example: {
        agentName: 'documentation-agent',
        prompt: 'Generate API documentation for a RAG system',
        context: { framework: 'FastAPI' }
      }
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
