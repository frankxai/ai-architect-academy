/**
 * Hybrid Agent Chat API
 *
 * Uses BOTH:
 * - Claude SDK (backend) - Agent orchestration, tool use
 * - Streaming Response - Real-time UI updates
 */

import { getOrchestrator } from '@/lib/agents/claude-orchestrator';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { messages, agentName = 'pattern-builder' } = await req.json();

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'user') {
      return new Response('Invalid message format', { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response('ANTHROPIC_API_KEY not configured', { status: 500 });
    }

    // Get orchestrator (Claude SDK)
    const orchestrator = getOrchestrator(apiKey);

    // Create a readable stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Stream agent execution using Claude SDK
          const agentStream = orchestrator.streamAgentExecution(
            agentName,
            lastMessage.content
          );

          // Forward events
          for await (const event of agentStream) {
            if (event.type === 'content') {
              controller.enqueue(encoder.encode(event.data.text));
            } else if (event.type === 'tool') {
              const toolInfo = `\n\n🔧 Using tool: ${event.data.name}\n`;
              controller.enqueue(encoder.encode(toolInfo));
            } else if (event.type === 'end') {
              const metadata = event.data;
              if (metadata.usage) {
                const usageInfo = `\n\n📊 Tokens: ${metadata.usage.input_tokens} in, ${metadata.usage.output_tokens} out\n`;
                controller.enqueue(encoder.encode(usageInfo));
              }
            }
          }

          controller.close();
        } catch (error) {
          const errorMsg = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
          controller.enqueue(encoder.encode(errorMsg));
          controller.close();
        }
      }
    });

    // Return streaming response with proper headers for AI SDK
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });

  } catch (error) {
    console.error('Agent chat error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process chat',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
