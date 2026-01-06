export interface LearningPath {
  slug: string;
  name: string;
  category: 'foundation' | 'advanced' | 'specialization' | 'world-problems';
  duration: string;
  hours: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  description: string;
  longDescription: string;
  prerequisites: string[];
  outcomes: string[];
  modules: { name: string; hours: number; topics: string[] }[];
  certificate: string;
  relatedPaths: string[];
  keywords: string[];
}

export const pathCategories = {
  foundation: { name: 'Foundation', color: 'from-cyan-500 to-blue-600' },
  advanced: { name: 'Advanced', color: 'from-purple-500 to-pink-600' },
  specialization: { name: 'Specialization', color: 'from-amber-500 to-orange-600' },
  'world-problems': { name: 'World Problems', color: 'from-green-500 to-emerald-600' },
};

export const paths: LearningPath[] = [
  {
    slug: '100-hour-ai-architect',
    name: '100-Hour AI Architect',
    category: 'foundation',
    duration: '4 weeks',
    hours: 100,
    difficulty: 'intermediate',
    description: 'Comprehensive AI architecture training from foundations to deployment',
    longDescription: 'The flagship learning path that takes you from AI fundamentals to production-ready architect. Master retrieval systems, agent development, governance, and storytelling to lead enterprise AI initiatives.',
    prerequisites: ['Basic Python', 'API concepts', 'Git fundamentals'],
    outcomes: [
      'Design production RAG systems',
      'Build multi-agent workflows',
      'Implement AI governance',
      'Create compelling narratives',
    ],
    modules: [
      {
        name: 'Retrieval Foundations',
        hours: 25,
        topics: ['Tokenization', 'Embeddings', 'Chunking strategies', 'Vector databases', 'Hybrid search'],
      },
      {
        name: 'Agents & Tooling',
        hours: 25,
        topics: ['Function calling', 'LangGraph', 'Langfuse observability', 'Multi-agent patterns'],
      },
      {
        name: 'Governance & Performance',
        hours: 25,
        topics: ['Privacy', 'Risk management', 'Cost optimization', 'Safety validation'],
      },
      {
        name: 'Specialization',
        hours: 25,
        topics: ['Industry research', 'Domain prototype', 'Portfolio', 'Executive narrative'],
      },
    ],
    certificate: 'AI Architect Associate',
    relatedPaths: ['bootcamp', 'professional', 'agi-research'],
    keywords: ['ai architect course', 'ai architecture training', '100 hour ai', 'enterprise ai learning'],
  },
  {
    slug: 'beginner',
    name: 'Beginner Path',
    category: 'foundation',
    duration: '4 weeks',
    hours: 24,
    difficulty: 'beginner',
    description: 'Start your AI architecture journey with fundamentals',
    longDescription: 'Perfect for developers new to AI. Build a solid foundation in LLM concepts, safe prompting, retrieval basics, and introductory agent development with hands-on projects.',
    prerequisites: ['Basic programming', 'Command line familiarity'],
    outcomes: [
      'Understand LLM fundamentals',
      'Build basic retrieval systems',
      'Create simple agents',
      'Implement basic evaluations',
    ],
    modules: [
      {
        name: 'LLM Fundamentals',
        hours: 6,
        topics: ['How LLMs work', 'Prompting basics', 'Safe prompting', 'API usage'],
      },
      {
        name: 'Retrieval Basics',
        hours: 6,
        topics: ['Embeddings intro', 'pgvector setup', 'Simple RAG', 'Query optimization'],
      },
      {
        name: 'Intro to Agents',
        hours: 6,
        topics: ['Agent concepts', 'Tool calling', 'Basic orchestration', 'Error handling'],
      },
      {
        name: 'Evaluation Basics',
        hours: 6,
        topics: ['Why evaluate', 'Basic metrics', 'Observability intro', 'Langfuse setup'],
      },
    ],
    certificate: 'AI Architecture Foundations',
    relatedPaths: ['100-hour-ai-architect', 'professional'],
    keywords: ['learn ai architecture', 'ai beginner course', 'llm fundamentals', 'ai for developers'],
  },
  {
    slug: 'bootcamp',
    name: 'Bootcamp Path',
    category: 'advanced',
    duration: '3 weeks',
    hours: 105,
    difficulty: 'advanced',
    description: 'Intensive AI CoE leader training for enterprise transformation',
    longDescription: 'For AI CoE leaders driving enterprise transformation. This intensive bootcamp covers vision alignment, architecture patterns, operations, and launch narratives to lead successful AI initiatives.',
    prerequisites: ['5+ years engineering experience', 'Leadership role', 'Enterprise context'],
    outcomes: [
      'Lead AI transformation initiatives',
      'Design enterprise AI architecture',
      'Establish governance frameworks',
      'Drive organizational adoption',
    ],
    modules: [
      {
        name: 'Vision & Patterns',
        hours: 35,
        topics: ['Discovery workshops', 'Narrative development', 'Roadmap creation', 'Stakeholder alignment'],
      },
      {
        name: 'Architecture & Integration',
        hours: 35,
        topics: ['Reference implementations', 'Governance frameworks', 'Compliance', 'Integration patterns'],
      },
      {
        name: 'Industry & Launch',
        hours: 35,
        topics: ['GTM briefs', 'Demo development', '90-day plans', 'Success metrics'],
      },
    ],
    certificate: 'AI CoE Leader',
    relatedPaths: ['100-hour-ai-architect', 'professional'],
    keywords: ['ai bootcamp', 'ai coe training', 'enterprise ai leader', 'ai transformation'],
  },
  {
    slug: 'professional',
    name: 'Professional Path',
    category: 'advanced',
    duration: '8 weeks',
    hours: 80,
    difficulty: 'advanced',
    description: 'Advanced practitioner training for production AI systems',
    longDescription: 'For experienced developers ready to build production AI systems. Deep dive into advanced RAG, complex agents, MLOps, and enterprise patterns with real-world projects.',
    prerequisites: ['Completed Beginner Path or equivalent', '2+ years development experience'],
    outcomes: [
      'Build production RAG systems',
      'Implement complex agent architectures',
      'Deploy with MLOps best practices',
      'Design enterprise AI patterns',
    ],
    modules: [
      {
        name: 'Advanced RAG',
        hours: 20,
        topics: ['Semantic chunking', 'Hybrid search', 'Reranking', 'Context compression'],
      },
      {
        name: 'Complex Agents',
        hours: 20,
        topics: ['Multi-agent systems', 'Supervisor patterns', 'State management', 'Error recovery'],
      },
      {
        name: 'MLOps & Production',
        hours: 20,
        topics: ['CI/CD for AI', 'Monitoring', 'A/B testing', 'Cost optimization'],
      },
      {
        name: 'Enterprise Patterns',
        hours: 20,
        topics: ['AI Gateway', 'Guardrails', 'Governance', 'Security'],
      },
    ],
    certificate: 'AI Architecture Professional',
    relatedPaths: ['bootcamp', 'agi-research'],
    keywords: ['advanced ai course', 'production ai', 'mlops training', 'enterprise ai patterns'],
  },
  {
    slug: 'agi-research',
    name: 'AGI Research Track',
    category: 'specialization',
    duration: '10 weeks',
    hours: 80,
    difficulty: 'expert',
    description: 'Cutting-edge AGI research including alignment, safety, and world models',
    longDescription: 'For researchers and advanced practitioners interested in AGI development. Explore alignment research, safety frameworks, multi-agent emergent intelligence, world models, and self-improvement systems.',
    prerequisites: ['Strong ML background', 'Completed Professional Path', 'Research interest'],
    outcomes: [
      'Understand AGI architectures',
      'Implement alignment techniques',
      'Design safety frameworks',
      'Build world models',
    ],
    modules: [
      {
        name: 'Foundations of AGI',
        hours: 12,
        topics: ['AGI definitions', 'Current state', 'Key research areas', 'Capability assessment'],
      },
      {
        name: 'Alignment & Safety',
        hours: 15,
        topics: ['Constitutional AI', 'RLHF', 'Interpretability', 'Value alignment'],
      },
      {
        name: 'Multi-Agent Architectures',
        hours: 15,
        topics: ['Emergent intelligence', 'Swarm patterns', 'Coordination', 'Competition'],
      },
      {
        name: 'World Models & Reasoning',
        hours: 15,
        topics: ['Predictive processing', 'Causal reasoning', 'Planning', 'Abstraction'],
      },
      {
        name: 'Self-Improvement Systems',
        hours: 12,
        topics: ['Meta-learning', 'Safe recursion', 'Capability boundaries', 'Human oversight'],
      },
      {
        name: 'AGI Evaluation',
        hours: 11,
        topics: ['Benchmarks', 'Progress metrics', 'Safety testing', 'Deployment criteria'],
      },
    ],
    certificate: 'AGI Research Specialist',
    relatedPaths: ['professional', 'climate-ai', 'health-ai'],
    keywords: ['agi course', 'ai alignment', 'ai safety training', 'agi research'],
  },
  {
    slug: 'climate-ai',
    name: 'Climate AI Track',
    category: 'world-problems',
    duration: '10 weeks',
    hours: 100,
    difficulty: 'advanced',
    description: 'Apply AI to climate challenges: carbon modeling, prediction, and optimization',
    longDescription: 'Build AI systems to address climate change. Learn carbon optimization, climate prediction models, energy grid optimization, and nature-based solution systems with real-world impact.',
    prerequisites: ['Basic ML knowledge', 'Interest in climate science'],
    outcomes: [
      'Build carbon optimization systems',
      'Implement climate prediction models',
      'Design energy grid AI',
      'Create nature-based solution tools',
    ],
    modules: [
      {
        name: 'Climate Data Foundations',
        hours: 25,
        topics: ['Climate datasets', 'Carbon accounting', 'Emissions tracking', 'Data pipelines'],
      },
      {
        name: 'Prediction Models',
        hours: 25,
        topics: ['Weather prediction', 'GraphCast patterns', 'Climate projections', 'Uncertainty quantification'],
      },
      {
        name: 'Energy Optimization',
        hours: 25,
        topics: ['Grid optimization', 'Renewable integration', 'Demand forecasting', 'Storage optimization'],
      },
      {
        name: 'Nature-Based Solutions',
        hours: 25,
        topics: ['Ecosystem monitoring', 'Reforestation AI', 'Carbon sequestration', 'Biodiversity'],
      },
    ],
    certificate: 'Climate AI Specialist',
    relatedPaths: ['health-ai', 'economic-ai', 'agi-research'],
    keywords: ['climate ai', 'carbon ai', 'sustainability ai', 'environmental ai'],
  },
  {
    slug: 'health-ai',
    name: 'Health AI Track',
    category: 'world-problems',
    duration: '12 weeks',
    hours: 120,
    difficulty: 'advanced',
    description: 'Accelerate drug discovery, diagnostics, and personalized medicine',
    longDescription: 'Build AI systems for healthcare transformation. Learn medical imaging, drug discovery pipelines, clinical decision support, and personalized medicine with regulatory compliance.',
    prerequisites: ['Basic ML knowledge', 'Healthcare interest', 'Ethics awareness'],
    outcomes: [
      'Build medical imaging AI',
      'Implement drug discovery pipelines',
      'Design clinical decision systems',
      'Navigate healthcare regulations',
    ],
    modules: [
      {
        name: 'Medical Imaging',
        hours: 30,
        topics: ['Radiology AI', 'Pathology', 'Diagnostic models', 'FDA compliance'],
      },
      {
        name: 'Drug Discovery',
        hours: 30,
        topics: ['Molecular modeling', 'Target identification', 'Clinical trials', 'Insilico patterns'],
      },
      {
        name: 'Clinical Decision Support',
        hours: 30,
        topics: ['EHR integration', 'Risk prediction', 'Treatment recommendations', 'HIPAA'],
      },
      {
        name: 'Personalized Medicine',
        hours: 30,
        topics: ['Genomics AI', 'Biomarkers', 'Treatment optimization', 'Patient outcomes'],
      },
    ],
    certificate: 'Health AI Specialist',
    relatedPaths: ['climate-ai', 'education-ai', 'agi-research'],
    keywords: ['health ai', 'medical ai', 'drug discovery ai', 'clinical ai'],
  },
  {
    slug: 'education-ai',
    name: 'Education AI Track',
    category: 'world-problems',
    duration: '10 weeks',
    hours: 100,
    difficulty: 'intermediate',
    description: 'Create adaptive tutoring, accessibility tools, and AI literacy curricula',
    longDescription: 'Transform education with AI. Build adaptive tutoring systems, accessibility tools, and AI literacy programs following learning science principles and inclusive design.',
    prerequisites: ['Basic ML knowledge', 'Interest in education'],
    outcomes: [
      'Build adaptive tutoring systems',
      'Design accessibility tools',
      'Create AI literacy curricula',
      'Implement learning analytics',
    ],
    modules: [
      {
        name: 'Learning Science',
        hours: 25,
        topics: ['Cognitive science', 'Pedagogy', 'Learning models', 'Assessment'],
      },
      {
        name: 'Adaptive Learning',
        hours: 25,
        topics: ['Personalization', 'Duolingo patterns', 'Knowledge tracing', 'Recommendations'],
      },
      {
        name: 'Accessibility',
        hours: 25,
        topics: ['Inclusive design', 'Assistive AI', 'Multimodal learning', 'Universal access'],
      },
      {
        name: 'AI Literacy',
        hours: 25,
        topics: ['Curriculum design', 'Ethical AI education', 'Critical thinking', 'Teacher tools'],
      },
    ],
    certificate: 'Education AI Specialist',
    relatedPaths: ['health-ai', 'economic-ai'],
    keywords: ['education ai', 'adaptive learning', 'tutoring ai', 'edtech ai'],
  },
  {
    slug: 'economic-ai',
    name: 'Economic AI Track',
    category: 'world-problems',
    duration: '10 weeks',
    hours: 100,
    difficulty: 'advanced',
    description: 'Build systems for financial inclusion, supply chains, and labor markets',
    longDescription: 'Apply AI to economic challenges. Build financial inclusion systems, supply chain optimization, and labor market intelligence tools to create more equitable economic outcomes.',
    prerequisites: ['Basic ML knowledge', 'Economics interest'],
    outcomes: [
      'Build financial inclusion AI',
      'Design supply chain optimization',
      'Create labor market tools',
      'Implement fair lending models',
    ],
    modules: [
      {
        name: 'Financial Inclusion',
        hours: 25,
        topics: ['Alternative credit scoring', 'Microfinance AI', 'Fraud detection', 'Fair lending'],
      },
      {
        name: 'Supply Chain',
        hours: 25,
        topics: ['Demand forecasting', 'Logistics optimization', 'Risk management', 'Sustainability'],
      },
      {
        name: 'Labor Markets',
        hours: 25,
        topics: ['Skills matching', 'Workforce planning', 'Fair hiring', 'Automation impact'],
      },
      {
        name: 'Economic Policy',
        hours: 25,
        topics: ['Policy simulation', 'Impact assessment', 'Inequality metrics', 'Public goods'],
      },
    ],
    certificate: 'Economic AI Specialist',
    relatedPaths: ['climate-ai', 'health-ai'],
    keywords: ['economic ai', 'financial ai', 'supply chain ai', 'fintech ai'],
  },
];

export function getPathBySlug(slug: string): LearningPath | undefined {
  return paths.find((p) => p.slug === slug);
}

export function getPathsByCategory(category: LearningPath['category']): LearningPath[] {
  return paths.filter((p) => p.category === category);
}

export function getAllPathSlugs(): string[] {
  return paths.map((p) => p.slug);
}
