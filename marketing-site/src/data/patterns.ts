export interface Pattern {
  slug: string;
  name: string;
  category: 'retrieval' | 'agents' | 'infrastructure' | 'governance';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  description: string;
  problem: string;
  solution: string;
  components: { name: string; purpose: string; technology: string }[];
  useCases: string[];
  antiPatterns: string[];
  relatedPatterns: string[];
  keywords: string[];
}

export const patternCategories = {
  retrieval: { name: 'Retrieval & RAG', color: 'from-cyan-500 to-blue-600' },
  agents: { name: 'Agents & Orchestration', color: 'from-purple-500 to-pink-600' },
  infrastructure: { name: 'Infrastructure', color: 'from-amber-500 to-orange-600' },
  governance: { name: 'Governance & Security', color: 'from-green-500 to-emerald-600' },
};

export const patterns: Pattern[] = [
  {
    slug: 'rag-production',
    name: 'RAG Production Pattern',
    category: 'retrieval',
    difficulty: 'intermediate',
    description: 'Production-ready RAG with semantic chunking, hybrid search, and reranking',
    problem: 'Basic RAG implementations suffer from poor retrieval quality, hallucinations, and inability to scale. Naive chunking loses context, keyword search misses semantic matches, and retrieved context often lacks relevance.',
    solution: 'Implement a multi-stage retrieval pipeline with semantic chunking that preserves context, hybrid search combining vector similarity with BM25 keyword matching, cross-encoder reranking for precision, and context compression to maximize relevance within token limits.',
    components: [
      { name: 'Document Ingestion', purpose: 'Parse, chunk, and embed documents', technology: 'LangChain, Unstructured' },
      { name: 'Vector Store', purpose: 'Store and retrieve embeddings', technology: 'Pinecone, pgvector, Weaviate' },
      { name: 'Hybrid Search', purpose: 'Combine vector + keyword search', technology: 'Reciprocal Rank Fusion' },
      { name: 'Reranker', purpose: 'Re-score results for precision', technology: 'Cohere Rerank, BGE Reranker' },
      { name: 'Context Builder', purpose: 'Compress and format context', technology: 'LLMLingua, custom compression' },
      { name: 'Generator', purpose: 'Generate grounded responses', technology: 'GPT-4, Claude, Llama' },
    ],
    useCases: [
      'Enterprise knowledge bases',
      'Customer support chatbots',
      'Document Q&A systems',
      'Research assistants',
    ],
    antiPatterns: [
      'Fixed-size chunking without overlap',
      'Vector-only search without BM25',
      'Skipping reranking for speed',
      'Returning too many chunks without compression',
    ],
    relatedPatterns: ['ai-gateway', 'llm-ops', 'multi-agent-orchestration'],
    keywords: ['rag architecture', 'production rag', 'hybrid search', 'semantic chunking', 'reranking'],
  },
  {
    slug: 'multi-agent-orchestration',
    name: 'Multi-Agent Orchestration Pattern',
    category: 'agents',
    difficulty: 'advanced',
    description: 'Coordinate specialized AI agents with supervisor patterns and state management',
    problem: 'Single monolithic agents struggle with complex tasks requiring diverse expertise. They lack specialization, have difficulty maintaining coherent long-running tasks, and cannot effectively delegate or collaborate.',
    solution: 'Implement a supervisor-worker architecture where a central supervisor agent decomposes tasks, routes to specialized worker agents, manages shared state, handles errors gracefully, and aggregates results into coherent outputs.',
    components: [
      { name: 'Supervisor Agent', purpose: 'Coordinate and route tasks', technology: 'LangGraph, CrewAI' },
      { name: 'Worker Agents', purpose: 'Execute specialized tasks', technology: 'Custom agents, function calling' },
      { name: 'State Manager', purpose: 'Maintain conversation/task state', technology: 'Redis, PostgreSQL' },
      { name: 'Handoff Protocol', purpose: 'Transfer context between agents', technology: 'Structured messages' },
      { name: 'Error Recovery', purpose: 'Handle failures gracefully', technology: 'Checkpoint/retry logic' },
      { name: 'Observability', purpose: 'Track agent performance', technology: 'Langfuse, LangSmith' },
    ],
    useCases: [
      'Complex research tasks',
      'Multi-step business processes',
      'Code generation pipelines',
      'Customer service escalation',
    ],
    antiPatterns: [
      'Too many agent handoffs',
      'Unclear agent responsibilities',
      'Missing state persistence',
      'No timeout or error handling',
    ],
    relatedPatterns: ['rag-production', 'ai-gateway', 'llm-ops'],
    keywords: ['multi-agent', 'agent orchestration', 'supervisor pattern', 'langgraph', 'agent coordination'],
  },
  {
    slug: 'ai-gateway',
    name: 'AI Gateway Pattern',
    category: 'infrastructure',
    difficulty: 'advanced',
    description: 'Centralized gateway for multi-provider AI with routing, rate limiting, and cost tracking',
    problem: 'Organizations using multiple AI providers face fragmented access patterns, inconsistent authentication, uncontrolled costs, missing audit trails, and difficulty implementing cross-cutting concerns like rate limiting and caching.',
    solution: 'Deploy a centralized AI Gateway that provides unified authentication, intelligent routing across providers based on cost/latency/quality, rate limiting, cost tracking per tenant, response caching, and comprehensive audit logging.',
    components: [
      { name: 'Auth Layer', purpose: 'Authenticate and authorize requests', technology: 'API keys, OAuth, JWT' },
      { name: 'Router', purpose: 'Route to optimal provider', technology: 'Cost/latency/quality routing' },
      { name: 'Rate Limiter', purpose: 'Control request rates', technology: 'Redis, token bucket' },
      { name: 'Cost Tracker', purpose: 'Track usage and costs', technology: 'PostgreSQL, analytics' },
      { name: 'Cache', purpose: 'Cache repeated requests', technology: 'Redis, semantic cache' },
      { name: 'Guardrails', purpose: 'Safety and compliance', technology: 'PII detection, content filters' },
    ],
    useCases: [
      'Enterprise AI platforms',
      'Multi-tenant SaaS',
      'Cost-controlled deployments',
      'Compliance-heavy industries',
    ],
    antiPatterns: [
      'Direct provider access bypassing gateway',
      'Missing cost tracking',
      'No request logging',
      'Single provider dependency',
    ],
    relatedPatterns: ['rag-production', 'multi-agent-orchestration', 'llm-ops'],
    keywords: ['ai gateway', 'llm gateway', 'ai proxy', 'multi-provider ai', 'ai cost management'],
  },
  {
    slug: 'llm-ops',
    name: 'LLMOps Pattern',
    category: 'governance',
    difficulty: 'advanced',
    description: 'End-to-end lifecycle management for LLM applications',
    problem: 'LLM applications lack the operational maturity of traditional software. Teams struggle with prompt versioning, model evaluation, production monitoring, cost control, and governance without established patterns.',
    solution: 'Implement LLMOps practices covering the full lifecycle: prompt versioning and A/B testing, automated evaluation pipelines, production monitoring with quality metrics, fine-tuning workflows, and governance with audit trails.',
    components: [
      { name: 'Prompt Registry', purpose: 'Version and manage prompts', technology: 'Langfuse, custom registry' },
      { name: 'Eval Pipeline', purpose: 'Automated testing', technology: 'Promptfoo, custom harness' },
      { name: 'Monitoring', purpose: 'Track quality metrics', technology: 'Langfuse, custom dashboards' },
      { name: 'Fine-Tuning', purpose: 'Improve model performance', technology: 'OpenAI, HuggingFace' },
      { name: 'Governance', purpose: 'Policy enforcement', technology: 'Audit logs, access controls' },
      { name: 'Cost Analytics', purpose: 'Track and optimize costs', technology: 'Usage tracking, alerts' },
    ],
    useCases: [
      'Production LLM apps',
      'Continuous improvement',
      'Compliance requirements',
      'Team collaboration',
    ],
    antiPatterns: [
      'Hardcoded prompts in code',
      'No evaluation before deployment',
      'Missing production monitoring',
      'Manual prompt updates',
    ],
    relatedPatterns: ['ai-gateway', 'rag-production', 'multi-agent-orchestration'],
    keywords: ['llmops', 'llm operations', 'prompt management', 'ai evaluation', 'llm monitoring'],
  },
  {
    slug: 'semantic-cache',
    name: 'Semantic Cache Pattern',
    category: 'retrieval',
    difficulty: 'intermediate',
    description: 'Cache LLM responses based on semantic similarity for cost reduction',
    problem: 'Identical or semantically similar queries repeatedly hit expensive LLM APIs, increasing costs and latency. Traditional exact-match caching misses opportunities when queries are semantically equivalent but textually different.',
    solution: 'Implement a semantic cache that embeds incoming queries, searches for semantically similar cached responses, and returns cached results when similarity exceeds a threshold, dramatically reducing API costs for repetitive workloads.',
    components: [
      { name: 'Query Embedder', purpose: 'Convert queries to vectors', technology: 'OpenAI Embeddings, BGE' },
      { name: 'Vector Index', purpose: 'Fast similarity search', technology: 'Faiss, pgvector, Redis' },
      { name: 'Cache Store', purpose: 'Store query-response pairs', technology: 'Redis, PostgreSQL' },
      { name: 'Similarity Threshold', purpose: 'Control cache hit sensitivity', technology: 'Configurable threshold' },
      { name: 'TTL Manager', purpose: 'Expire stale entries', technology: 'Time-based expiration' },
    ],
    useCases: [
      'High-volume chatbots',
      'FAQ systems',
      'Repetitive queries',
      'Cost optimization',
    ],
    antiPatterns: [
      'Too low similarity threshold',
      'No TTL causing stale responses',
      'Caching non-deterministic queries',
      'Missing cache invalidation',
    ],
    relatedPatterns: ['rag-production', 'ai-gateway'],
    keywords: ['semantic cache', 'llm cache', 'ai caching', 'cost optimization ai'],
  },
  {
    slug: 'guardrails',
    name: 'AI Guardrails Pattern',
    category: 'governance',
    difficulty: 'intermediate',
    description: 'Safety layers for input validation, output filtering, and content moderation',
    problem: 'LLM applications are vulnerable to prompt injection, can generate harmful content, may leak PII, and lack safety controls for production deployment in regulated environments.',
    solution: 'Implement multi-layer guardrails including input validation for prompt injection, PII detection and redaction, output content filtering, topic restrictions, and safety classifiers to ensure compliant and safe AI interactions.',
    components: [
      { name: 'Input Validator', purpose: 'Detect prompt injection', technology: 'Custom classifier, rules' },
      { name: 'PII Detector', purpose: 'Find and redact PII', technology: 'Presidio, custom NER' },
      { name: 'Output Filter', purpose: 'Block harmful content', technology: 'Content classifier' },
      { name: 'Topic Restrictor', purpose: 'Keep on-topic', technology: 'Zero-shot classifier' },
      { name: 'Safety Classifier', purpose: 'Rate response safety', technology: 'LlamaGuard, custom' },
    ],
    useCases: [
      'Customer-facing chatbots',
      'Healthcare applications',
      'Financial services',
      'Children\'s products',
    ],
    antiPatterns: [
      'Guardrails only on output',
      'Missing PII handling',
      'Overly restrictive blocking',
      'No logging of violations',
    ],
    relatedPatterns: ['ai-gateway', 'llm-ops'],
    keywords: ['ai guardrails', 'llm safety', 'prompt injection', 'content moderation', 'pii detection'],
  },
  {
    slug: 'agentic-rag',
    name: 'Agentic RAG Pattern',
    category: 'retrieval',
    difficulty: 'advanced',
    description: 'RAG with autonomous query planning, multi-step retrieval, and self-correction',
    problem: 'Static RAG pipelines struggle with complex queries requiring decomposition, multi-hop reasoning, or iterative refinement. They cannot adaptively retrieve based on intermediate results or self-correct retrieval failures.',
    solution: 'Combine RAG with agentic capabilities: an agent analyzes the query, plans retrieval strategy, executes multi-step retrieval with reasoning, evaluates results, and iteratively refines until sufficient information is gathered.',
    components: [
      { name: 'Query Analyzer', purpose: 'Decompose complex queries', technology: 'LLM-based planning' },
      { name: 'Retrieval Planner', purpose: 'Plan retrieval steps', technology: 'Chain-of-thought' },
      { name: 'Multi-Retriever', purpose: 'Access multiple sources', technology: 'Hybrid retrievers' },
      { name: 'Result Evaluator', purpose: 'Assess retrieval quality', technology: 'LLM-as-judge' },
      { name: 'Self-Corrector', purpose: 'Retry with refined queries', technology: 'Iterative refinement' },
    ],
    useCases: [
      'Complex research queries',
      'Multi-source analysis',
      'Expert Q&A systems',
      'Investigation tools',
    ],
    antiPatterns: [
      'Unlimited retrieval loops',
      'No quality threshold',
      'Single retrieval strategy',
      'Missing iteration limits',
    ],
    relatedPatterns: ['rag-production', 'multi-agent-orchestration'],
    keywords: ['agentic rag', 'self-correcting rag', 'multi-hop rag', 'autonomous retrieval'],
  },
  {
    slug: 'evaluation-harness',
    name: 'Evaluation Harness Pattern',
    category: 'governance',
    difficulty: 'intermediate',
    description: 'Automated testing framework for LLM applications with multiple eval types',
    problem: 'LLM applications lack reliable testing. Manual evaluation doesn\'t scale, regression detection is difficult, and teams cannot confidently deploy changes without knowing the quality impact.',
    solution: 'Build an evaluation harness with diverse test types: golden datasets for regression, LLM-as-judge for quality, semantic similarity checks, structured output validation, and CI integration for automated gates.',
    components: [
      { name: 'Test Suite', purpose: 'Curated test cases', technology: 'JSON/YAML datasets' },
      { name: 'Evaluators', purpose: 'Compute eval metrics', technology: 'Promptfoo, custom' },
      { name: 'LLM Judge', purpose: 'Quality assessment', technology: 'GPT-4, Claude as judge' },
      { name: 'CI Pipeline', purpose: 'Automated test runs', technology: 'GitHub Actions, Jenkins' },
      { name: 'Dashboard', purpose: 'Visualize results', technology: 'Langfuse, custom' },
    ],
    useCases: [
      'CI/CD for LLMs',
      'Regression testing',
      'Model comparison',
      'Quality gates',
    ],
    antiPatterns: [
      'Only using exact match',
      'No human baseline',
      'Testing in production only',
      'Missing edge cases',
    ],
    relatedPatterns: ['llm-ops', 'guardrails'],
    keywords: ['llm evaluation', 'ai testing', 'eval harness', 'promptfoo', 'llm quality'],
  },
];

export function getPatternBySlug(slug: string): Pattern | undefined {
  return patterns.find((p) => p.slug === slug);
}

export function getPatternsByCategory(category: Pattern['category']): Pattern[] {
  return patterns.filter((p) => p.category === category);
}

export function getAllPatternSlugs(): string[] {
  return patterns.map((p) => p.slug);
}
