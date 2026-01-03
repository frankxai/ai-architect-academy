import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import Anthropic from '@anthropic-ai/sdk';

// Initialize AI clients
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

const claude = process.env.ANTHROPIC_API_KEY ? new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
}) : null;

// Architecture patterns knowledge base
const architecturePatterns = {
  rag: {
    name: 'Retrieval-Augmented Generation',
    useCase: 'When you need to ground LLM responses in specific knowledge',
    components: ['Vector DB', 'Embeddings', 'Chunking Strategy', 'Reranking'],
    considerations: ['Latency', 'Accuracy', 'Cost', 'Scalability']
  },
  agent: {
    name: 'Autonomous Agent System',
    useCase: 'Complex multi-step reasoning and tool usage',
    components: ['LLM', 'Tool Registry', 'Memory Store', 'Orchestration Layer'],
    considerations: ['Error handling', 'Cost control', 'Observability']
  },
  pipeline: {
    name: 'ML Pipeline Architecture',
    useCase: 'Data processing and model training workflows',
    components: ['Data Lake', 'Feature Store', 'Model Registry', 'Serving Layer'],
    considerations: ['Data drift', 'Model versioning', 'A/B testing']
  }
};

export async function POST(request: NextRequest) {
  try {
    const { message, context = {} } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Construct the system prompt
    const systemPrompt = `You are an expert AI Architecture Assistant. You help architects design, 
    optimize, and implement AI systems. You have deep knowledge of:
    - Design patterns: RAG, Agents, Pipelines, Fine-tuning
    - Cost optimization strategies
    - Scalability best practices
    - Security and compliance
    - Popular frameworks and tools
    
    Provide actionable, specific advice. Include code examples when relevant.
    Consider trade-offs and provide multiple options when appropriate.`;

    // Enhance the user message with context
    const enhancedMessage = `${message}\n\nContext: ${JSON.stringify(context)}`;

    let response = '';

    // Try Claude first if available
    if (claude && process.env.ANTHROPIC_API_KEY) {
      try {
        const claudeResponse = await claude.messages.create({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1500,
          messages: [
            { role: 'user', content: enhancedMessage }
          ],
          system: systemPrompt
        });
        
        response = claudeResponse.content[0].type === 'text' 
          ? claudeResponse.content[0].text 
          : 'Unable to generate response';
      } catch (claudeError) {
        console.error('Claude API error:', claudeError);
        // Fallback to OpenAI
      }
    }

    // Fallback to OpenAI
    if (!response && openai && process.env.OPENAI_API_KEY) {
      try {
        const openaiResponse = await openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: enhancedMessage }
          ],
          max_tokens: 1500,
          temperature: 0.7
        });
        
        response = openaiResponse.choices[0]?.message?.content || 'Unable to generate response';
      } catch (openaiError) {
        console.error('OpenAI API error:', openaiError);
      }
    }

    // If no AI service available, provide pattern-based response
    if (!response) {
      response = generatePatternBasedResponse(message);
    }

    // Extract recommendations
    const recommendations = extractRecommendations(message, response);

    return NextResponse.json({
      response,
      recommendations,
      patterns: identifyRelevantPatterns(message),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Assistant error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

function generatePatternBasedResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('rag') || lowerMessage.includes('retrieval')) {
    return `For a RAG system, consider:
    
1. **Vector Database**: Pinecone, Weaviate, or Qdrant for production; Chroma for development
2. **Embedding Model**: OpenAI ada-002 or open-source alternatives like BGE/E5
3. **Chunking Strategy**: Aim for 200-500 tokens with 10-20% overlap
4. **Reranking**: Use Cohere or cross-encoder models to improve relevance
5. **Cost Optimization**: Cache embeddings, batch queries, use hybrid search

Would you like specific implementation details for any component?`;
  }
  
  if (lowerMessage.includes('agent') || lowerMessage.includes('autonomous')) {
    return `For an Agent system, I recommend:
    
1. **Framework**: LangChain or AutoGen for complex workflows
2. **Memory**: Redis for short-term, PostgreSQL with pgvector for long-term
3. **Tools**: Start with essential APIs, add progressively
4. **Safety**: Implement approval steps for critical actions
5. **Monitoring**: Use LangSmith or Helicone for observability

What specific agent capabilities are you looking to implement?`;
  }
  
  return `I can help you architect AI systems. Consider:
  
1. **Define Requirements**: What problem are you solving?
2. **Choose Pattern**: RAG, Agents, Fine-tuning, or hybrid?
3. **Select Stack**: Based on scale, budget, and team expertise
4. **Plan Implementation**: MVP first, then iterate
5. **Monitor & Optimize**: Track costs, latency, and accuracy

What specific aspect would you like to explore?`;
}

function extractRecommendations(message: string, response: string): string[] {
  const recommendations = [];
  
  // Extract numbered points from response
  const matches = response.match(/\d+\.\s+\*\*([^*]+)\*\*/g);
  if (matches) {
    recommendations.push(...matches.map(m => m.replace(/\d+\.\s+\*\*|\*\*/g, '').trim()));
  }
  
  return recommendations.slice(0, 5);
}

function identifyRelevantPatterns(message: string): any[] {
  const lowerMessage = message.toLowerCase();
  const relevant: any[] = [];
  
  Object.entries(architecturePatterns).forEach(([key, pattern]) => {
    if (lowerMessage.includes(key) || 
        pattern.name.toLowerCase().split(' ').some(word => lowerMessage.includes(word))) {
      relevant.push(pattern);
    }
  });
  
  return relevant;
}