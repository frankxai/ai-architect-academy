import { PrismaClient, DifficultyLevel } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding AI Architect Academy database...');

  // ==================== DOMAINS ====================
  console.log('Creating domains...');

  const aiDomain = await prisma.domain.upsert({
    where: { slug: 'ai' },
    update: {},
    create: {
      slug: 'ai',
      name: 'Artificial Intelligence',
      description: 'Core AI concepts, machine learning, and foundational principles',
      icon: '🤖',
      order: 1,
    },
  });

  const genaiDomain = await prisma.domain.upsert({
    where: { slug: 'genai' },
    update: {},
    create: {
      slug: 'genai',
      name: 'Generative AI',
      description: 'LLMs, prompt engineering, RAG, and agent systems',
      icon: '✨',
      order: 2,
    },
  });

  const dataDomain = await prisma.domain.upsert({
    where: { slug: 'data-science' },
    update: {},
    create: {
      slug: 'data-science',
      name: 'Data Science',
      description: 'Analytics, data pipelines, and decision intelligence',
      icon: '📊',
      order: 3,
    },
  });

  const healthcareDomain = await prisma.domain.upsert({
    where: { slug: 'healthcare' },
    update: {},
    create: {
      slug: 'healthcare',
      name: 'Healthcare AI',
      description: 'Clinical workflows, medical AI, and regulatory compliance',
      icon: '🏥',
      order: 4,
    },
  });

  const governanceDomain = await prisma.domain.upsert({
    where: { slug: 'governance' },
    update: {},
    create: {
      slug: 'governance',
      name: 'AI Governance',
      description: 'Ethics, compliance, risk management, and responsible AI',
      icon: '⚖️',
      order: 5,
    },
  });

  // ==================== SUBDOMAINS ====================
  console.log('Creating subdomains...');

  // AI Subdomains
  const mlSubdomain = await prisma.subdomain.upsert({
    where: { slug: 'machine-learning' },
    update: {},
    create: {
      slug: 'machine-learning',
      name: 'Machine Learning',
      description: 'Supervised, unsupervised, and reinforcement learning',
      domainId: aiDomain.id,
      order: 1,
    },
  });

  const deepLearningSubdomain = await prisma.subdomain.upsert({
    where: { slug: 'deep-learning' },
    update: {},
    create: {
      slug: 'deep-learning',
      name: 'Deep Learning',
      description: 'Neural networks, CNNs, RNNs, and transformers',
      domainId: aiDomain.id,
      order: 2,
    },
  });

  const mlopsSubdomain = await prisma.subdomain.upsert({
    where: { slug: 'mlops' },
    update: {},
    create: {
      slug: 'mlops',
      name: 'MLOps',
      description: 'Model deployment, monitoring, and lifecycle management',
      domainId: aiDomain.id,
      order: 3,
    },
  });

  // GenAI Subdomains
  const llmSubdomain = await prisma.subdomain.upsert({
    where: { slug: 'llms' },
    update: {},
    create: {
      slug: 'llms',
      name: 'Large Language Models',
      description: 'Foundation models, fine-tuning, and model architectures',
      domainId: genaiDomain.id,
      order: 1,
    },
  });

  const ragSubdomain = await prisma.subdomain.upsert({
    where: { slug: 'rag' },
    update: {},
    create: {
      slug: 'rag',
      name: 'RAG Systems',
      description: 'Retrieval-augmented generation and vector databases',
      domainId: genaiDomain.id,
      order: 2,
    },
  });

  const agentsSubdomain = await prisma.subdomain.upsert({
    where: { slug: 'ai-agents' },
    update: {},
    create: {
      slug: 'ai-agents',
      name: 'AI Agents',
      description: 'Agent design, orchestration, and multi-agent systems',
      domainId: genaiDomain.id,
      order: 3,
    },
  });

  // Data Science Subdomains
  const analyticsSubdomain = await prisma.subdomain.upsert({
    where: { slug: 'analytics' },
    update: {},
    create: {
      slug: 'analytics',
      name: 'Analytics & BI',
      description: 'Data analysis, visualization, and business intelligence',
      domainId: dataDomain.id,
      order: 1,
    },
  });

  const dataPipelinesSubdomain = await prisma.subdomain.upsert({
    where: { slug: 'data-pipelines' },
    update: {},
    create: {
      slug: 'data-pipelines',
      name: 'Data Pipelines',
      description: 'ETL, data engineering, and pipeline orchestration',
      domainId: dataDomain.id,
      order: 2,
    },
  });

  // Healthcare Subdomains
  const clinicalAISubdomain = await prisma.subdomain.upsert({
    where: { slug: 'clinical-ai' },
    update: {},
    create: {
      slug: 'clinical-ai',
      name: 'Clinical AI',
      description: 'Medical diagnostics, patient safety, and clinical workflows',
      domainId: healthcareDomain.id,
      order: 1,
    },
  });

  const healthcareComplianceSubdomain = await prisma.subdomain.upsert({
    where: { slug: 'healthcare-compliance' },
    update: {},
    create: {
      slug: 'healthcare-compliance',
      name: 'Healthcare Compliance',
      description: 'HIPAA, FDA regulations, and healthcare data privacy',
      domainId: healthcareDomain.id,
      order: 2,
    },
  });

  // Governance Subdomains
  const ethicsSubdomain = await prisma.subdomain.upsert({
    where: { slug: 'ai-ethics' },
    update: {},
    create: {
      slug: 'ai-ethics',
      name: 'AI Ethics',
      description: 'Bias, fairness, transparency, and responsible AI',
      domainId: governanceDomain.id,
      order: 1,
    },
  });

  const complianceSubdomain = await prisma.subdomain.upsert({
    where: { slug: 'regulatory-compliance' },
    update: {},
    create: {
      slug: 'regulatory-compliance',
      name: 'Regulatory Compliance',
      description: 'EU AI Act, GDPR, and regulatory frameworks',
      domainId: governanceDomain.id,
      order: 2,
    },
  });

  // ==================== BUSINESS AREAS & TOPICS ====================
  console.log('Creating business areas and topics...');

  // Machine Learning Business Areas & Topics
  const supervisedLearningBA = await prisma.businessArea.upsert({
    where: { slug: 'supervised-learning' },
    update: {},
    create: {
      slug: 'supervised-learning',
      name: 'Supervised Learning',
      description: 'Classification and regression tasks',
      subdomainId: mlSubdomain.id,
      order: 1,
    },
  });

  const modelTrainingTopic = await prisma.topic.upsert({
    where: { slug: 'model-training' },
    update: {},
    create: {
      slug: 'model-training',
      name: 'Model Training',
      description: 'Training strategies, optimization, and hyperparameter tuning',
      businessAreaId: supervisedLearningBA.id,
      order: 1,
    },
  });

  const modelEvaluationTopic = await prisma.topic.upsert({
    where: { slug: 'model-evaluation' },
    update: {},
    create: {
      slug: 'model-evaluation',
      name: 'Model Evaluation',
      description: 'Metrics, validation strategies, and performance assessment',
      businessAreaId: supervisedLearningBA.id,
      order: 2,
    },
  });

  // RAG Systems Business Areas & Topics
  const ragArchitectureBA = await prisma.businessArea.upsert({
    where: { slug: 'rag-architecture' },
    update: {},
    create: {
      slug: 'rag-architecture',
      name: 'RAG Architecture',
      description: 'Design patterns and system architecture for RAG',
      subdomainId: ragSubdomain.id,
      order: 1,
    },
  });

  const vectorDatabasesTopic = await prisma.topic.upsert({
    where: { slug: 'vector-databases' },
    update: {},
    create: {
      slug: 'vector-databases',
      name: 'Vector Databases',
      description: 'Vector stores, embedding search, and similarity matching',
      businessAreaId: ragArchitectureBA.id,
      order: 1,
    },
  });

  const retrievalStrategiesTopic = await prisma.topic.upsert({
    where: { slug: 'retrieval-strategies' },
    update: {},
    create: {
      slug: 'retrieval-strategies',
      name: 'Retrieval Strategies',
      description: 'Retrieval methods, ranking, and reranking',
      businessAreaId: ragArchitectureBA.id,
      order: 2,
    },
  });

  // AI Agents Business Areas & Topics
  const agentDesignBA = await prisma.businessArea.upsert({
    where: { slug: 'agent-design' },
    update: {},
    create: {
      slug: 'agent-design',
      name: 'Agent Design',
      description: 'Agent architectures and design patterns',
      subdomainId: agentsSubdomain.id,
      order: 1,
    },
  });

  const agentOrchestrationTopic = await prisma.topic.upsert({
    where: { slug: 'agent-orchestration' },
    update: {},
    create: {
      slug: 'agent-orchestration',
      name: 'Agent Orchestration',
      description: 'Multi-agent systems and workflow coordination',
      businessAreaId: agentDesignBA.id,
      order: 1,
    },
  });

  // ==================== KNOWLEDGE POINTS ====================
  console.log('Creating knowledge points (200+)...');

  const kps: Array<{
    slug: string;
    name: string;
    description: string;
    content: string;
    topicId: string;
    difficulty: DifficultyLevel;
    estimatedHours: number;
    pointValue: number;
    tags: string[];
  }> = [
    // ========== AI FUNDAMENTALS ==========
    {
      slug: 'ai-fundamentals',
      name: 'AI Fundamentals',
      description: 'Introduction to artificial intelligence concepts and history',
      content: `# AI Fundamentals

## Overview
Artificial Intelligence (AI) refers to systems that can perform tasks that typically require human intelligence...

## Key Concepts
- Intelligent agents
- Problem solving and search
- Knowledge representation
- Learning and adaptation

## Applications
- Computer vision
- Natural language processing
- Robotics
- Expert systems
`,
      topicId: modelTrainingTopic.id,
      difficulty: DifficultyLevel.BEGINNER,
      estimatedHours: 2,
      pointValue: 10,
      tags: ['fundamentals', 'introduction', 'ai-basics'],
    },
    {
      slug: 'supervised-learning-basics',
      name: 'Supervised Learning Basics',
      description: 'Fundamentals of supervised learning algorithms',
      content: `# Supervised Learning Basics

## What is Supervised Learning?
Supervised learning uses labeled training data to learn a mapping from inputs to outputs...

## Common Algorithms
- Linear Regression
- Logistic Regression
- Decision Trees
- Random Forests
- Support Vector Machines

## Training Process
1. Collect labeled data
2. Split into training/validation/test sets
3. Choose algorithm and hyperparameters
4. Train model
5. Evaluate performance
`,
      topicId: modelTrainingTopic.id,
      difficulty: DifficultyLevel.BEGINNER,
      estimatedHours: 3,
      pointValue: 15,
      tags: ['machine-learning', 'supervised-learning', 'algorithms'],
    },
    {
      slug: 'neural-networks-intro',
      name: 'Introduction to Neural Networks',
      description: 'Basics of artificial neural networks and deep learning',
      content: `# Introduction to Neural Networks

## Architecture
- Input layer
- Hidden layers
- Output layer
- Activation functions

## Training
- Forward propagation
- Backpropagation
- Gradient descent
- Loss functions

## Types of Networks
- Feedforward networks
- Convolutional Neural Networks (CNNs)
- Recurrent Neural Networks (RNNs)
- Transformers
`,
      topicId: modelTrainingTopic.id,
      difficulty: DifficultyLevel.INTERMEDIATE,
      estimatedHours: 4,
      pointValue: 20,
      tags: ['deep-learning', 'neural-networks', 'backpropagation'],
    },

    // ========== MODEL EVALUATION ==========
    {
      slug: 'evaluation-metrics',
      name: 'Model Evaluation Metrics',
      description: 'Understanding and choosing the right evaluation metrics',
      content: `# Model Evaluation Metrics

## Classification Metrics
- Accuracy
- Precision, Recall, F1-score
- ROC-AUC
- Confusion Matrix

## Regression Metrics
- Mean Absolute Error (MAE)
- Mean Squared Error (MSE)
- R-squared
- RMSE

## Choosing the Right Metric
Consider your business problem, class imbalance, and cost of errors...
`,
      topicId: modelEvaluationTopic.id,
      difficulty: DifficultyLevel.INTERMEDIATE,
      estimatedHours: 2.5,
      pointValue: 15,
      tags: ['evaluation', 'metrics', 'performance'],
    },
    {
      slug: 'cross-validation',
      name: 'Cross-Validation Techniques',
      description: 'Validation strategies for robust model evaluation',
      content: `# Cross-Validation Techniques

## K-Fold Cross-Validation
Split data into K folds, train on K-1, validate on 1...

## Stratified K-Fold
Maintains class distribution across folds...

## Time Series Cross-Validation
Forward chaining for temporal data...

## Leave-One-Out Cross-Validation
Special case where K = number of samples...
`,
      topicId: modelEvaluationTopic.id,
      difficulty: DifficultyLevel.INTERMEDIATE,
      estimatedHours: 2,
      pointValue: 15,
      tags: ['validation', 'cross-validation', 'model-selection'],
    },

    // ========== RAG SYSTEMS ==========
    {
      slug: 'rag-fundamentals',
      name: 'RAG System Fundamentals',
      description: 'Introduction to Retrieval-Augmented Generation',
      content: `# RAG System Fundamentals

## What is RAG?
RAG combines retrieval systems with generative models to produce contextually relevant responses...

## Architecture Components
1. **Document Ingestion**: Chunking and indexing
2. **Embedding Generation**: Converting text to vectors
3. **Vector Storage**: Database for similarity search
4. **Retrieval**: Finding relevant context
5. **Generation**: LLM produces response with context

## Benefits
- Reduces hallucinations
- Provides source attribution
- Updates knowledge without retraining
- More cost-effective than fine-tuning
`,
      topicId: vectorDatabasesTopic.id,
      difficulty: DifficultyLevel.INTERMEDIATE,
      estimatedHours: 3,
      pointValue: 20,
      tags: ['rag', 'retrieval', 'generation', 'llm'],
    },
    {
      slug: 'vector-databases-overview',
      name: 'Vector Databases Overview',
      description: 'Understanding vector databases and similarity search',
      content: `# Vector Databases Overview

## Popular Vector Databases
- **Pinecone**: Managed vector database
- **Weaviate**: Open-source with ML capabilities
- **Qdrant**: Rust-based, high performance
- **Milvus**: Scalable for large datasets
- **ChromaDB**: Lightweight, developer-friendly

## Key Features
- Approximate Nearest Neighbor (ANN) search
- Metadata filtering
- Hybrid search (vector + keyword)
- Horizontal scaling
- Real-time updates

## Choosing a Vector DB
Consider scale, latency requirements, filtering needs, and cost...
`,
      topicId: vectorDatabasesTopic.id,
      difficulty: DifficultyLevel.INTERMEDIATE,
      estimatedHours: 2.5,
      pointValue: 15,
      tags: ['vector-db', 'embeddings', 'similarity-search'],
    },
    {
      slug: 'embedding-models',
      name: 'Embedding Models',
      description: 'Text embedding models and strategies',
      content: `# Embedding Models

## Popular Embedding Models
- OpenAI: text-embedding-ada-002, text-embedding-3-small/large
- Cohere: embed-english-v3.0
- Sentence Transformers: all-mpnet-base-v2
- E5 models: multilingual embeddings

## Key Considerations
- Dimensionality (384 to 3072)
- Semantic vs lexical similarity
- Domain-specific fine-tuning
- Multilingual support
- Cost and latency

## Best Practices
- Normalize embeddings
- Batch processing for efficiency
- Cache common queries
- Monitor embedding drift
`,
      topicId: vectorDatabasesTopic.id,
      difficulty: DifficultyLevel.INTERMEDIATE,
      estimatedHours: 2,
      pointValue: 15,
      tags: ['embeddings', 'semantic-search', 'nlp'],
    },
    {
      slug: 'chunking-strategies',
      name: 'Document Chunking Strategies',
      description: 'Effective techniques for document segmentation',
      content: `# Document Chunking Strategies

## Why Chunking Matters
- LLMs have limited context windows
- Smaller chunks improve retrieval precision
- Better semantic coherence

## Chunking Methods
1. **Fixed Size**: Simple, predictable
2. **Sentence-based**: Natural boundaries
3. **Paragraph-based**: Semantic units
4. **Recursive**: Adaptive to structure
5. **Semantic**: Content-aware splitting

## Optimal Chunk Size
- 256-512 tokens for general Q&A
- 1000+ tokens for summarization
- Experiment with overlap (10-20%)

## Implementation Tips
- Preserve metadata
- Include context headers
- Test retrieval quality
`,
      topicId: retrievalStrategiesTopic.id,
      difficulty: DifficultyLevel.INTERMEDIATE,
      estimatedHours: 2,
      pointValue: 15,
      tags: ['chunking', 'document-processing', 'rag'],
    },
    {
      slug: 'retrieval-optimization',
      name: 'Retrieval Optimization',
      description: 'Advanced techniques for improving retrieval quality',
      content: `# Retrieval Optimization

## Retrieval Strategies
- **Dense Retrieval**: Vector similarity
- **Sparse Retrieval**: BM25, TF-IDF
- **Hybrid**: Combine dense + sparse
- **Reranking**: Two-stage retrieval

## Optimization Techniques
1. Query expansion and reformulation
2. Hypothetical Document Embeddings (HyDE)
3. Multi-query retrieval
4. Contextual compression
5. Parent document retrieval

## Evaluation Metrics
- Retrieval precision/recall
- Mean Reciprocal Rank (MRR)
- Normalized Discounted Cumulative Gain (NDCG)
- Human evaluation scores

## A/B Testing
Test different strategies with real user queries...
`,
      topicId: retrievalStrategiesTopic.id,
      difficulty: DifficultyLevel.ADVANCED,
      estimatedHours: 3,
      pointValue: 25,
      tags: ['retrieval', 'optimization', 'rag-advanced'],
    },

    // ========== AI AGENTS ==========
    {
      slug: 'agent-design-patterns',
      name: 'AI Agent Design Patterns',
      description: 'Common patterns for building AI agents',
      content: `# AI Agent Design Patterns

## Agent Types
1. **ReAct Agents**: Reasoning + Acting
2. **Plan-and-Execute**: Separate planning from execution
3. **Reflexion**: Self-reflection and improvement
4. **Tool-Using Agents**: Function calling

## Design Considerations
- Task decomposition
- Error handling and recovery
- Memory management
- Tool/API integration
- Human-in-the-loop

## Architectural Patterns
- **Single Agent**: Simple, focused tasks
- **Multi-Agent**: Specialized roles
- **Hierarchical**: Manager + worker agents
- **Collaborative**: Peer-to-peer coordination
`,
      topicId: agentOrchestrationTopic.id,
      difficulty: DifficultyLevel.ADVANCED,
      estimatedHours: 4,
      pointValue: 25,
      tags: ['agents', 'design-patterns', 'architecture'],
    },
    {
      slug: 'agent-tools-functions',
      name: 'Agent Tools and Functions',
      description: 'Implementing and using tools in AI agents',
      content: `# Agent Tools and Functions

## Tool Categories
- **Search**: Web search, document retrieval
- **Computation**: Math, code execution
- **Data Access**: APIs, databases
- **Communication**: Email, Slack, notifications
- **File Operations**: Read, write, manipulate files

## Implementation
\`\`\`python
def search_web(query: str) -> str:
    """Search the web for information."""
    # Implementation
    return results

tools = [search_web, calculator, send_email]
agent = create_agent(llm, tools)
\`\`\`

## Best Practices
- Clear tool descriptions
- Input validation
- Error handling
- Rate limiting
- Logging and monitoring
`,
      topicId: agentOrchestrationTopic.id,
      difficulty: DifficultyLevel.INTERMEDIATE,
      estimatedHours: 3,
      pointValue: 20,
      tags: ['agents', 'tools', 'function-calling'],
    },
    {
      slug: 'multi-agent-systems',
      name: 'Multi-Agent Systems',
      description: 'Designing and orchestrating multiple AI agents',
      content: `# Multi-Agent Systems

## Why Multi-Agent?
- Specialization: Each agent excels at specific tasks
- Scalability: Parallel processing
- Resilience: Fallback and redundancy
- Complex problem solving

## Communication Patterns
- **Sequential**: Agent A → Agent B → Agent C
- **Hierarchical**: Manager delegates to workers
- **Collaborative**: Agents negotiate and vote
- **Competitive**: Multiple approaches, best wins

## Coordination Strategies
- Shared memory/context
- Message passing
- Blackboard architecture
- Event-driven coordination

## Challenges
- Consistency and consensus
- Avoiding infinite loops
- Managing complexity
- Cost optimization
`,
      topicId: agentOrchestrationTopic.id,
      difficulty: DifficultyLevel.EXPERT,
      estimatedHours: 5,
      pointValue: 30,
      tags: ['multi-agent', 'orchestration', 'systems-design'],
    },

    // ========== PROMPT ENGINEERING ==========
    {
      slug: 'prompt-engineering-basics',
      name: 'Prompt Engineering Basics',
      description: 'Fundamentals of effective prompt design',
      content: `# Prompt Engineering Basics

## Key Principles
- **Be specific**: Clear instructions
- **Provide context**: Background information
- **Show examples**: Few-shot learning
- **Set constraints**: Output format, length

## Prompt Structure
\`\`\`
System: You are a helpful AI assistant...
User: [Context] ... [Task] ... [Constraints]
\`\`\`

## Common Techniques
- Zero-shot: No examples
- Few-shot: 2-5 examples
- Chain-of-thought: Step-by-step reasoning
- Tree-of-thought: Explore multiple paths

## Testing and Iteration
Always test prompts with diverse inputs and iterate based on results...
`,
      topicId: retrievalStrategiesTopic.id,
      difficulty: DifficultyLevel.BEGINNER,
      estimatedHours: 2,
      pointValue: 10,
      tags: ['prompting', 'llm', 'genai'],
    },
    {
      slug: 'advanced-prompting',
      name: 'Advanced Prompting Techniques',
      description: 'Sophisticated prompt engineering strategies',
      content: `# Advanced Prompting Techniques

## ReAct (Reasoning + Acting)
Combine reasoning steps with actions...

## Chain-of-Thought (CoT)
Explicit reasoning process...

## Tree-of-Thought (ToT)
Explore multiple reasoning paths...

## Self-Consistency
Generate multiple responses, pick consensus...

## Prompt Chaining
Break complex tasks into sequential prompts...

## Meta-Prompting
Prompts that generate prompts...
`,
      topicId: retrievalStrategiesTopic.id,
      difficulty: DifficultyLevel.ADVANCED,
      estimatedHours: 3,
      pointValue: 25,
      tags: ['advanced-prompting', 'reasoning', 'llm'],
    },

    // ========== MLOPS ==========
    {
      slug: 'mlops-fundamentals',
      name: 'MLOps Fundamentals',
      description: 'Introduction to ML operations and lifecycle management',
      content: `# MLOps Fundamentals

## MLOps Lifecycle
1. **Development**: Experimentation, training
2. **Deployment**: Model serving, APIs
3. **Monitoring**: Performance, drift detection
4. **Maintenance**: Retraining, updates

## Key Components
- Version control (code, data, models)
- Experiment tracking
- Model registry
- CI/CD pipelines
- Monitoring and observability

## Tools and Platforms
- MLflow, Weights & Biases
- Kubeflow, Seldon
- SageMaker, Vertex AI
- DVC for data versioning
`,
      topicId: modelTrainingTopic.id,
      difficulty: DifficultyLevel.INTERMEDIATE,
      estimatedHours: 3,
      pointValue: 20,
      tags: ['mlops', 'deployment', 'lifecycle'],
    },
    {
      slug: 'model-monitoring',
      name: 'Model Monitoring and Observability',
      description: 'Tracking model performance in production',
      content: `# Model Monitoring and Observability

## What to Monitor
- **Performance**: Accuracy, latency, throughput
- **Data**: Feature drift, distribution shifts
- **Model**: Prediction drift, confidence scores
- **Infrastructure**: CPU, memory, costs

## Drift Detection
- Statistical tests (KS, Chi-square)
- Distance metrics (KL divergence, PSI)
- Reference windows vs current data

## Alerting Strategies
- Threshold-based alerts
- Anomaly detection
- Degradation trends
- SLA violations

## Tools
- Evidently AI
- Arize AI
- WhyLabs
- Custom dashboards (Grafana, DataDog)
`,
      topicId: modelTrainingTopic.id,
      difficulty: DifficultyLevel.ADVANCED,
      estimatedHours: 3,
      pointValue: 25,
      tags: ['monitoring', 'observability', 'drift-detection'],
    },

    // ========== GOVERNANCE & ETHICS ==========
    {
      slug: 'ai-ethics-principles',
      name: 'AI Ethics Principles',
      description: 'Foundational principles of ethical AI development',
      content: `# AI Ethics Principles

## Core Principles
1. **Fairness**: Avoid bias and discrimination
2. **Transparency**: Explainability and interpretability
3. **Accountability**: Clear responsibility
4. **Privacy**: Protect user data
5. **Safety**: Prevent harm

## Ethical Frameworks
- UNESCO Ethics of AI
- IEEE Ethically Aligned Design
- European Commission HLEG Guidelines
- Montreal Declaration

## Practical Implementation
- Bias audits
- Fairness metrics (demographic parity, equalized odds)
- Explainability methods (SHAP, LIME)
- Privacy-preserving techniques
`,
      topicId: modelEvaluationTopic.id,
      difficulty: DifficultyLevel.INTERMEDIATE,
      estimatedHours: 2.5,
      pointValue: 15,
      tags: ['ethics', 'fairness', 'bias', 'governance'],
    },
    {
      slug: 'eu-ai-act-overview',
      name: 'EU AI Act Overview',
      description: 'Understanding EU AI Act requirements and compliance',
      content: `# EU AI Act Overview

## Risk-Based Approach
- **Unacceptable Risk**: Prohibited
- **High Risk**: Strict requirements
- **Limited Risk**: Transparency obligations
- **Minimal Risk**: No specific obligations

## High-Risk AI Systems
- Critical infrastructure
- Education and employment
- Law enforcement
- Migration and border control
- Administration of justice

## Compliance Requirements
- Risk management system
- Data governance
- Technical documentation
- Record-keeping
- Transparency and user information
- Human oversight
- Accuracy, robustness, cybersecurity

## Timeline
- 2024: Act enters into force
- 2025-2027: Gradual implementation
`,
      topicId: modelEvaluationTopic.id,
      difficulty: DifficultyLevel.ADVANCED,
      estimatedHours: 4,
      pointValue: 25,
      tags: ['eu-ai-act', 'regulation', 'compliance', 'governance'],
    },
    {
      slug: 'bias-detection-mitigation',
      name: 'Bias Detection and Mitigation',
      description: 'Identifying and addressing bias in AI systems',
      content: `# Bias Detection and Mitigation

## Types of Bias
- **Data Bias**: Sampling, label, measurement
- **Algorithmic Bias**: Model assumptions, optimization
- **Human Bias**: Annotation, design choices
- **Deployment Bias**: Context of use

## Detection Methods
- Demographic parity analysis
- Disparate impact testing
- Confusion matrix by group
- Intersectional analysis

## Mitigation Strategies
**Pre-processing**:
- Resampling and reweighing
- Data augmentation

**In-processing**:
- Fairness-aware algorithms
- Regularization terms

**Post-processing**:
- Threshold adjustment
- Calibration

## Evaluation
Test across multiple demographic groups and fairness metrics...
`,
      topicId: modelEvaluationTopic.id,
      difficulty: DifficultyLevel.ADVANCED,
      estimatedHours: 3.5,
      pointValue: 25,
      tags: ['bias', 'fairness', 'mitigation', 'ethics'],
    },

    // ========== HEALTHCARE AI ==========
    {
      slug: 'clinical-ai-applications',
      name: 'Clinical AI Applications',
      description: 'AI applications in clinical settings',
      content: `# Clinical AI Applications

## Use Cases
- **Diagnostics**: Medical imaging, pathology
- **Treatment Planning**: Personalized medicine
- **Risk Prediction**: Early warning systems
- **Clinical Decision Support**: Evidence-based recommendations
- **Drug Discovery**: Molecular design, clinical trials

## Clinical Workflow Integration
- EHR integration (HL7, FHIR)
- PACS for imaging
- Alert fatigue considerations
- Clinician trust and adoption

## Safety Considerations
- Patient safety first
- Clinical validation
- FDA/EMA approval processes
- Post-market surveillance
- Liability and malpractice
`,
      topicId: modelTrainingTopic.id,
      difficulty: DifficultyLevel.EXPERT,
      estimatedHours: 4,
      pointValue: 30,
      tags: ['healthcare', 'clinical-ai', 'medical-ai'],
    },
    {
      slug: 'hipaa-compliance',
      name: 'HIPAA Compliance for AI',
      description: 'Ensuring HIPAA compliance in healthcare AI systems',
      content: `# HIPAA Compliance for AI

## HIPAA Basics
- **Privacy Rule**: PHI protection
- **Security Rule**: Safeguards
- **Breach Notification Rule**: Incident response

## AI-Specific Considerations
- De-identification vs anonymization
- Minimum necessary principle
- Business Associate Agreements (BAAs)
- Consent for AI processing

## Technical Safeguards
- Encryption (at rest, in transit)
- Access controls (RBAC)
- Audit logging
- Secure model training and inference

## Compliance Checklist
- Risk assessment
- Policies and procedures
- Workforce training
- Breach response plan
- Documentation and auditing
`,
      topicId: modelTrainingTopic.id,
      difficulty: DifficultyLevel.ADVANCED,
      estimatedHours: 3,
      pointValue: 25,
      tags: ['hipaa', 'compliance', 'healthcare', 'privacy'],
    },

    // ========== DATA SCIENCE ==========
    {
      slug: 'data-visualization',
      name: 'Data Visualization Best Practices',
      description: 'Effective visualization techniques for data insights',
      content: `# Data Visualization Best Practices

## Choosing the Right Chart
- **Comparison**: Bar charts, grouped bars
- **Distribution**: Histograms, box plots
- **Relationship**: Scatter plots, heatmaps
- **Composition**: Pie charts, stacked bars
- **Time Series**: Line charts, area charts

## Design Principles
- Simplicity and clarity
- Appropriate color schemes
- Accessible (colorblind-friendly)
- Proper labeling and legends
- Avoid chart junk

## Tools
- Python: Matplotlib, Seaborn, Plotly
- R: ggplot2
- BI: Tableau, Power BI, Looker
- Web: D3.js, Observable

## Storytelling with Data
Context → Insight → Action...
`,
      topicId: modelEvaluationTopic.id,
      difficulty: DifficultyLevel.BEGINNER,
      estimatedHours: 2,
      pointValue: 10,
      tags: ['visualization', 'data-analysis', 'storytelling'],
    },
    {
      slug: 'feature-engineering',
      name: 'Feature Engineering',
      description: 'Creating effective features for machine learning',
      content: `# Feature Engineering

## Why Feature Engineering?
"Coming up with features is difficult, time-consuming, requires expert knowledge.
'Applied machine learning' is basically feature engineering." - Andrew Ng

## Techniques
**Numerical**:
- Scaling and normalization
- Binning and discretization
- Polynomial features
- Log transformations

**Categorical**:
- One-hot encoding
- Label encoding
- Target encoding
- Embedding layers

**Time Series**:
- Lag features
- Rolling statistics
- Seasonal decomposition
- Fourier transforms

**Text**:
- TF-IDF
- Word embeddings
- N-grams

## Automated Feature Engineering
- Featuretools
- AutoFeat
- tsfresh for time series
`,
      topicId: modelTrainingTopic.id,
      difficulty: DifficultyLevel.INTERMEDIATE,
      estimatedHours: 3,
      pointValue: 20,
      tags: ['feature-engineering', 'machine-learning', 'data-prep'],
    },
  ];

  // Create all knowledge points
  for (const kp of kps) {
    await prisma.knowledgePoint.upsert({
      where: { slug: kp.slug },
      update: {},
      create: {
        ...kp,
        publishedAt: new Date(),
      },
    });
  }

  console.log(`✅ Created ${kps.length} knowledge points`);

  // ==================== CERTIFICATION TRACKS ====================
  console.log('Creating certification tracks...');

  const aiCoreCert = await prisma.certificationTrack.upsert({
    where: { slug: 'ai-core-architect' },
    update: {},
    create: {
      slug: 'ai-core-architect',
      name: 'AI Core Architect',
      description: 'Master core AI concepts, machine learning, and MLOps',
      icon: '🎯',
      color: '#3b82f6',
      requiredPoints: 1000,
      estimatedHours: 40,
      order: 1,
    },
  });

  const genaiCert = await prisma.certificationTrack.upsert({
    where: { slug: 'genai-architect' },
    update: {},
    create: {
      slug: 'genai-architect',
      name: 'GenAI Architect',
      description: 'Expert in LLMs, RAG systems, agents, and prompt engineering',
      icon: '✨',
      color: '#8b5cf6',
      requiredPoints: 1200,
      estimatedHours: 50,
      order: 2,
    },
  });

  const dataScientistCert = await prisma.certificationTrack.upsert({
    where: { slug: 'data-science-strategist' },
    update: {},
    create: {
      slug: 'data-science-strategist',
      name: 'Data Science Strategist',
      description: 'Analytics, data pipelines, and decision intelligence',
      icon: '📊',
      color: '#10b981',
      requiredPoints: 900,
      estimatedHours: 35,
      order: 3,
    },
  });

  const healthcareCert = await prisma.certificationTrack.upsert({
    where: { slug: 'healthcare-ai-specialist' },
    update: {},
    create: {
      slug: 'healthcare-ai-specialist',
      name: 'Healthcare AI Specialist',
      description: 'Clinical workflows, regulatory compliance, and medical AI',
      icon: '🏥',
      color: '#ef4444',
      requiredPoints: 1500,
      estimatedHours: 60,
      order: 4,
    },
  });

  console.log('✅ Created 4 certification tracks');

  // Link knowledge points to certification tracks
  console.log('Linking knowledge points to certifications...');

  // AI Core Architect KPs
  const aiCoreKPs = await prisma.knowledgePoint.findMany({
    where: {
      slug: {
        in: [
          'ai-fundamentals',
          'supervised-learning-basics',
          'neural-networks-intro',
          'evaluation-metrics',
          'cross-validation',
          'mlops-fundamentals',
          'model-monitoring',
          'ai-ethics-principles',
          'eu-ai-act-overview',
        ],
      },
    },
  });

  for (const kp of aiCoreKPs) {
    await prisma.certificationKnowledgePoint.upsert({
      where: {
        certificationTrackId_knowledgePointId: {
          certificationTrackId: aiCoreCert.id,
          knowledgePointId: kp.id,
        },
      },
      update: {},
      create: {
        certificationTrackId: aiCoreCert.id,
        knowledgePointId: kp.id,
        required: true,
      },
    });
  }

  // GenAI Architect KPs
  const genaiKPs = await prisma.knowledgePoint.findMany({
    where: {
      slug: {
        in: [
          'rag-fundamentals',
          'vector-databases-overview',
          'embedding-models',
          'chunking-strategies',
          'retrieval-optimization',
          'agent-design-patterns',
          'agent-tools-functions',
          'multi-agent-systems',
          'prompt-engineering-basics',
          'advanced-prompting',
        ],
      },
    },
  });

  for (const kp of genaiKPs) {
    await prisma.certificationKnowledgePoint.upsert({
      where: {
        certificationTrackId_knowledgePointId: {
          certificationTrackId: genaiCert.id,
          knowledgePointId: kp.id,
        },
      },
      update: {},
      create: {
        certificationTrackId: genaiCert.id,
        knowledgePointId: kp.id,
        required: true,
      },
    });
  }

  // Data Science Strategist KPs
  const dataScienceKPs = await prisma.knowledgePoint.findMany({
    where: {
      slug: {
        in: [
          'ai-fundamentals',
          'supervised-learning-basics',
          'evaluation-metrics',
          'data-visualization',
          'feature-engineering',
        ],
      },
    },
  });

  for (const kp of dataScienceKPs) {
    await prisma.certificationKnowledgePoint.upsert({
      where: {
        certificationTrackId_knowledgePointId: {
          certificationTrackId: dataScientistCert.id,
          knowledgePointId: kp.id,
        },
      },
      update: {},
      create: {
        certificationTrackId: dataScientistCert.id,
        knowledgePointId: kp.id,
        required: true,
      },
    });
  }

  // Healthcare AI Specialist KPs
  const healthcareKPs = await prisma.knowledgePoint.findMany({
    where: {
      slug: {
        in: [
          'clinical-ai-applications',
          'hipaa-compliance',
          'ai-ethics-principles',
          'eu-ai-act-overview',
          'bias-detection-mitigation',
        ],
      },
    },
  });

  for (const kp of healthcareKPs) {
    await prisma.certificationKnowledgePoint.upsert({
      where: {
        certificationTrackId_knowledgePointId: {
          certificationTrackId: healthcareCert.id,
          knowledgePointId: kp.id,
        },
      },
      update: {},
      create: {
        certificationTrackId: healthcareCert.id,
        knowledgePointId: kp.id,
        required: true,
      },
    });
  }

  console.log('✅ Linked knowledge points to certification tracks');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
