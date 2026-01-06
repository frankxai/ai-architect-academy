/**
 * Agent System Usage Examples
 *
 * Real-world examples demonstrating the agent orchestration system.
 */

import { getOrchestrator } from '../src/lib/agents/claude-orchestrator';
import { WORKFLOW_LIBRARY } from '../src/lib/agents/workflows';
import { createGitHubSync } from '../src/lib/github/oss-sync';

// ============================================================================
// Example 1: Build a RAG System
// ============================================================================

export async function example1_buildRagSystem() {
  const orchestrator = getOrchestrator();

  const result = await orchestrator.executeAgent(
    'pattern-builder',
    `Build a production-ready RAG system with the following specs:
    - Framework: LangChain
    - Vector DB: Pinecone
    - Embeddings: OpenAI ada-002
    - Requirements: Low latency (<500ms), high accuracy
    - Include error handling and monitoring
    `,
    {
      framework: 'langchain',
      vectorDB: 'pinecone',
      embeddings: 'openai-ada-002'
    }
  );

  if (result.success) {
    console.log('✅ RAG System Built Successfully!');
    console.log(result.output);
  } else {
    console.error('❌ Error:', result.error);
  }

  return result;
}

// ============================================================================
// Example 2: Review Code for Security
// ============================================================================

export async function example2_securityReview() {
  const orchestrator = getOrchestrator();

  const codeToReview = `
  async function handleUserQuery(query: string) {
    const embedding = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: query
    });

    const results = await pinecone.query({
      vector: embedding.data[0].embedding,
      topK: 5
    });

    const context = results.matches.map(m => m.metadata.text).join('\\n');

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Answer using this context: " + context },
        { role: "user", content: query }
      ]
    });

    return response.choices[0].message.content;
  }
  `;

  const result = await orchestrator.executeAgent(
    'qa-agent',
    `Review this RAG query handler for security vulnerabilities and best practices:

    ${codeToReview}

    Focus on:
    1. Input validation
    2. Prompt injection risks
    3. Error handling
    4. Rate limiting
    5. Cost optimization`,
    { code: codeToReview }
  );

  console.log('Security Review Results:');
  console.log(result.output);

  return result;
}

// ============================================================================
// Example 3: Execute Pattern Development Workflow
// ============================================================================

export async function example3_patternDevelopmentWorkflow() {
  const orchestrator = getOrchestrator();

  const workflow = {
    ...WORKFLOW_LIBRARY.PATTERN_DEVELOPMENT,
    tasks: WORKFLOW_LIBRARY.PATTERN_DEVELOPMENT.tasks.map(task => ({
      ...task,
      prompt: task.prompt
        .replace('{{requirements}}', 'Build a multi-modal AI system that can process text, images, and audio')
        .replace('{{use_case}}', 'Content moderation for social media platform'),
      context: {
        ...task.context,
        requirements: 'Multi-modal AI for content moderation',
        use_case: 'Social media platform'
      }
    }))
  };

  console.log('🚀 Starting Pattern Development Workflow...');
  console.log('This will take ~2-3 minutes...\n');

  const result = await orchestrator.executeWorkflow(workflow);

  if (result.success) {
    console.log('\n✅ Workflow Completed Successfully!\n');
    console.log(`Total Duration: ${(result.totalDurationMs / 1000).toFixed(2)}s`);
    console.log(`Tasks Completed: ${result.results.length}\n`);

    result.results.forEach((taskResult, idx) => {
      console.log(`\n--- Task ${idx + 1}: ${taskResult.agentName} ---`);
      console.log(`Duration: ${(taskResult.durationMs / 1000).toFixed(2)}s`);
      console.log(`Output Preview: ${taskResult.output.substring(0, 200)}...`);
    });
  } else {
    console.error('❌ Workflow Failed:', result.error);
  }

  return result;
}

// ============================================================================
// Example 4: OSS Contribution Workflow
// ============================================================================

export async function example4_ossContributionWorkflow() {
  const orchestrator = getOrchestrator();

  const patternCode = `
  // Production-ready RAG system implementation
  import { OpenAI } from 'openai';
  import { PineconeClient } from '@pinecone-database/pinecone';

  export class RAGSystem {
    private openai: OpenAI;
    private pinecone: PineconeClient;

    constructor(config: RAGConfig) {
      this.openai = new OpenAI({ apiKey: config.openaiKey });
      this.pinecone = new PineconeClient();
      await this.pinecone.init({
        apiKey: config.pineconeKey,
        environment: config.pineconeEnv
      });
    }

    async query(question: string): Promise<string> {
      // Implementation...
    }
  }
  `;

  const workflow = {
    ...WORKFLOW_LIBRARY.OSS_CONTRIBUTION,
    tasks: WORKFLOW_LIBRARY.OSS_CONTRIBUTION.tasks.map(task => ({
      ...task,
      prompt: task.prompt.replace('{{pattern_code}}', patternCode),
      context: { pattern_code: patternCode }
    }))
  };

  console.log('📦 Preparing Pattern for OSS Contribution...\n');

  const result = await orchestrator.executeWorkflow(workflow);

  if (result.success) {
    console.log('\n✅ Pattern Ready for OSS!\n');

    // Get the PR preparation from last task
    const prPrep = result.results[result.results.length - 1];
    console.log('PR Details:');
    console.log(prPrep.output);
  }

  return result;
}

// ============================================================================
// Example 5: Submit Pattern to GitHub
// ============================================================================

export async function example5_submitToGitHub() {
  const github = createGitHubSync({
    owner: 'ai-architect-academy',
    repo: 'patterns',
    token: process.env.GITHUB_TOKEN
  });

  const pattern = {
    id: 'rag-customer-support',
    name: 'Customer Support RAG System',
    type: 'rag',
    description: 'Production-ready RAG system for customer support with automatic ticket routing',
    code: `
    // Complete implementation here...
    export class CustomerSupportRAG {
      // ...
    }
    `,
    documentation: `
    # Customer Support RAG System

    Production-ready RAG implementation for customer support teams.

    ## Features
    - Semantic search over documentation
    - Automatic ticket routing
    - Multi-language support
    - Real-time updates

    ## Quick Start
    \`\`\`typescript
    const rag = new CustomerSupportRAG(config);
    const answer = await rag.query("How do I reset my password?");
    \`\`\`
    `,
    metadata: {
      features: [
        'Semantic search',
        'Automatic routing',
        'Multi-language',
        'Real-time updates'
      ],
      author: 'AI Architect Academy',
      license: 'MIT',
      version: '1.0.0'
    }
  };

  console.log('🚀 Submitting pattern to GitHub...\n');

  const result = await github.submitPatternToOSS(pattern);

  if (result.success) {
    console.log('✅ Pattern submitted successfully!');
    console.log(`PR URL: ${result.prUrl}`);
  } else {
    console.error('❌ Submission failed:', result.error);
  }

  return result;
}

// ============================================================================
// Example 6: Fetch Patterns from OSS
// ============================================================================

export async function example6_fetchFromGitHub() {
  const github = createGitHubSync({
    owner: 'ai-architect-academy',
    repo: 'patterns'
  });

  console.log('📥 Fetching RAG patterns from OSS...\n');

  const ragPatterns = await github.fetchPatternsFromOSS('rag');

  console.log(`Found ${ragPatterns.length} RAG patterns:\n`);

  ragPatterns.forEach((pattern, idx) => {
    console.log(`${idx + 1}. ${pattern.name}`);
    console.log(`   Type: ${pattern.type}`);
    console.log(`   Description: ${pattern.description}`);
    console.log('');
  });

  return ragPatterns;
}

// ============================================================================
// Example 7: Learning Path Creation
// ============================================================================

export async function example7_createLearningPath() {
  const orchestrator = getOrchestrator();

  const workflow = {
    ...WORKFLOW_LIBRARY.LEARNING_PATH,
    tasks: WORKFLOW_LIBRARY.LEARNING_PATH.tasks.map(task => {
      let updatedPrompt = task.prompt
        .replace('{{topic}}', 'RAG Systems')
        .replace('{{audience_level}}', 'intermediate')
        .replace('{{duration_weeks}}', '8');

      return {
        ...task,
        prompt: updatedPrompt,
        context: {
          ...task.context,
          topic: 'RAG Systems',
          audience_level: 'intermediate',
          duration_weeks: 8
        }
      };
    })
  };

  console.log('📚 Creating Learning Path for RAG Systems...\n');

  const result = await orchestrator.executeWorkflow(workflow);

  if (result.success) {
    console.log('\n✅ Learning Path Created!\n');

    result.results.forEach((taskResult, idx) => {
      console.log(`\n--- ${taskResult.agentName} Output ---`);
      console.log(taskResult.output.substring(0, 300) + '...\n');
    });
  }

  return result;
}

// ============================================================================
// Example 8: Streaming Execution
// ============================================================================

export async function example8_streamingExecution() {
  const orchestrator = getOrchestrator();

  console.log('🌊 Starting streaming execution...\n');

  const stream = orchestrator.streamAgentExecution(
    'documentation-agent',
    'Generate comprehensive API documentation for a FastAPI RAG system with endpoints for querying, indexing, and health checks'
  );

  for await (const event of stream) {
    if (event.type === 'start') {
      console.log('▶️  Agent started');
    } else if (event.type === 'content') {
      process.stdout.write(event.data.text); // Stream text in real-time
    } else if (event.type === 'end') {
      console.log('\n\n✅ Agent completed');
    }
  }
}

// ============================================================================
// Example 9: Custom Workflow
// ============================================================================

export async function example9_customWorkflow() {
  const orchestrator = getOrchestrator();

  const customWorkflow = {
    name: 'quick-review',
    description: 'Quick pattern review and optimization',
    agents: require('../src/lib/agents/agent-library').AGENT_LIBRARY,
    tasks: [
      {
        id: 'review',
        agentName: 'qa-agent',
        prompt: 'Quick security and quality review of this pattern: {{pattern_code}}',
        context: {}
      },
      {
        id: 'optimize',
        agentName: 'pattern-optimizer',
        prompt: 'Optimize based on review: {{dependencies.review}}',
        dependencies: ['review']
      }
    ]
  };

  // Inject pattern code
  const processedWorkflow = {
    ...customWorkflow,
    tasks: customWorkflow.tasks.map(task => ({
      ...task,
      context: {
        pattern_code: 'async function query() { /* code */ }'
      }
    }))
  };

  console.log('⚡ Running custom quick review workflow...\n');

  const result = await orchestrator.executeWorkflow(processedWorkflow);

  if (result.success) {
    console.log('✅ Custom workflow completed!');
    console.log(`Duration: ${(result.totalDurationMs / 1000).toFixed(2)}s`);
  }

  return result;
}

// ============================================================================
// Example 10: Batch Agent Execution
// ============================================================================

export async function example10_batchExecution() {
  const orchestrator = getOrchestrator();

  const patterns = [
    'Build a RAG system with Pinecone',
    'Build a multi-agent orchestration system',
    'Build an LLM evaluation framework'
  ];

  console.log(`🔄 Executing ${patterns.length} agents in parallel...\n`);

  const results = await Promise.all(
    patterns.map(prompt =>
      orchestrator.executeAgent('pattern-builder', prompt)
    )
  );

  const successful = results.filter(r => r.success).length;

  console.log(`\n✅ Completed: ${successful}/${patterns.length}`);
  console.log(`Total time: ${Math.max(...results.map(r => r.durationMs)) / 1000}s (parallel)`);

  return results;
}

// ============================================================================
// Run All Examples
// ============================================================================

export async function runAllExamples() {
  console.log('🚀 Running All Agent System Examples\n');
  console.log('=' .repeat(60) + '\n');

  const examples = [
    { name: 'Build RAG System', fn: example1_buildRagSystem },
    { name: 'Security Review', fn: example2_securityReview },
    { name: 'Pattern Development Workflow', fn: example3_patternDevelopmentWorkflow },
    { name: 'OSS Contribution Workflow', fn: example4_ossContributionWorkflow },
    { name: 'Submit to GitHub', fn: example5_submitToGitHub },
    { name: 'Fetch from GitHub', fn: example6_fetchFromGitHub },
    { name: 'Create Learning Path', fn: example7_createLearningPath },
    { name: 'Streaming Execution', fn: example8_streamingExecution },
    { name: 'Custom Workflow', fn: example9_customWorkflow },
    { name: 'Batch Execution', fn: example10_batchExecution },
  ];

  for (const [idx, example] of examples.entries()) {
    console.log(`\n📌 Example ${idx + 1}: ${example.name}`);
    console.log('-'.repeat(60));

    try {
      await example.fn();
      console.log(`\n✅ Example ${idx + 1} completed successfully`);
    } catch (error) {
      console.error(`\n❌ Example ${idx + 1} failed:`, error);
    }

    console.log('\n' + '='.repeat(60));

    // Pause between examples to avoid rate limiting
    if (idx < examples.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('\n🎉 All examples completed!\n');
}

// ============================================================================
// Export all examples
// ============================================================================

export const examples = {
  1: example1_buildRagSystem,
  2: example2_securityReview,
  3: example3_patternDevelopmentWorkflow,
  4: example4_ossContributionWorkflow,
  5: example5_submitToGitHub,
  6: example6_fetchFromGitHub,
  7: example7_createLearningPath,
  8: example8_streamingExecution,
  9: example9_customWorkflow,
  10: example10_batchExecution,
};

// Run specific example: npm run examples 3
if (require.main === module) {
  const exampleNum = parseInt(process.argv[2] || '1');

  if (examples[exampleNum as keyof typeof examples]) {
    console.log(`Running Example ${exampleNum}...\n`);
    examples[exampleNum as keyof typeof examples]()
      .then(() => process.exit(0))
      .catch((error) => {
        console.error('Error:', error);
        process.exit(1);
      });
  } else {
    console.log('Usage: npm run examples [1-10]');
    console.log('\nAvailable examples:');
    Object.keys(examples).forEach(num => {
      const exampleFn = examples[Number(num) as keyof typeof examples];
      console.log(`  ${num}. ${exampleFn?.name || 'Unknown'}`);
    });
  }
}
