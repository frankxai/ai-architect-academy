/**
 * Pre-Built Agent Workflows
 *
 * Common multi-agent workflows for the AI Architect Academy platform.
 * These workflows orchestrate multiple agents to accomplish complex tasks.
 */

import { WorkflowConfig, AgentTask } from './claude-orchestrator';
import { AGENT_LIBRARY } from './agent-library';

// ============================================================================
// Pattern Development Workflow
// ============================================================================

export const PATTERN_DEVELOPMENT_WORKFLOW: WorkflowConfig = {
  name: 'pattern-development',
  description: 'End-to-end workflow for creating a new AI pattern from requirements to deployment',
  agents: AGENT_LIBRARY,
  tasks: [
    {
      id: 'analyze-requirements',
      agentName: 'architecture-reviewer',
      prompt: `Analyze the following pattern requirements and provide a technical architecture recommendation:

Requirements: {{requirements}}

Provide:
1. Recommended architecture approach
2. Key components needed
3. Technology stack suggestions
4. Potential challenges
5. Success criteria`,
      context: {}, // Will be populated at runtime
    },
    {
      id: 'build-pattern',
      agentName: 'pattern-builder',
      prompt: `Build a production-ready implementation based on the architecture recommendation:

Architecture: {{dependencies.analyze-requirements}}

Create:
1. Complete working code
2. Configuration files
3. Environment setup
4. Deployment scripts

Follow best practices for security, scalability, and maintainability.`,
      dependencies: ['analyze-requirements'],
    },
    {
      id: 'quality-review',
      agentName: 'qa-agent',
      prompt: `Conduct comprehensive quality assurance on the implemented pattern:

Pattern Code: {{dependencies.build-pattern}}

Test for:
1. Security vulnerabilities
2. Performance issues
3. Edge cases
4. Error handling
5. Production readiness

Provide a detailed QA report with severity ratings.`,
      dependencies: ['build-pattern'],
    },
    {
      id: 'compliance-check',
      agentName: 'compliance-checker',
      prompt: `Review the pattern for compliance with relevant regulations:

Pattern Code: {{dependencies.build-pattern}}
Intended Use: {{use_case}}

Check compliance with:
- GDPR/CCPA (if handling user data)
- HIPAA (if healthcare-related)
- SOC 2 (security controls)
- EU AI Act (AI-specific requirements)

Provide compliance status and required remediation steps.`,
      dependencies: ['build-pattern'],
    },
    {
      id: 'optimize-pattern',
      agentName: 'pattern-optimizer',
      prompt: `Optimize the pattern for production use:

Current Implementation: {{dependencies.build-pattern}}
QA Findings: {{dependencies.quality-review}}

Optimize for:
1. Performance (latency, throughput)
2. Cost (token usage, API calls)
3. Scalability (horizontal scaling)
4. Reliability (error handling, retries)

Provide optimized code and expected improvements.`,
      dependencies: ['build-pattern', 'quality-review'],
    },
    {
      id: 'generate-documentation',
      agentName: 'documentation-agent',
      prompt: `Create comprehensive documentation for the pattern:

Pattern Code: {{dependencies.optimize-pattern}}
Architecture: {{dependencies.analyze-requirements}}
QA Report: {{dependencies.quality-review}}
Compliance Status: {{dependencies.compliance-check}}

Generate:
1. README with Quick Start
2. Architecture guide
3. API documentation
4. Deployment guide
5. Troubleshooting section

Make it accessible for beginners while including advanced details.`,
      dependencies: ['optimize-pattern', 'quality-review', 'compliance-check'],
    },
  ],
};

// ============================================================================
// OSS Contribution Workflow
// ============================================================================

export const OSS_CONTRIBUTION_WORKFLOW: WorkflowConfig = {
  name: 'oss-contribution',
  description: 'Workflow for contributing a pattern to the GitHub OSS repository',
  agents: AGENT_LIBRARY,
  tasks: [
    {
      id: 'validate-pattern',
      agentName: 'qa-agent',
      prompt: `Validate this pattern meets OSS contribution standards:

Pattern: {{pattern_code}}

Validate:
1. Code quality
2. Documentation completeness
3. Test coverage
4. License compatibility (MIT)
5. Community guidelines compliance

Provide validation report with pass/fail for each criterion.`,
    },
    {
      id: 'generate-readme',
      agentName: 'documentation-agent',
      prompt: `Generate an OSS-friendly README for this pattern:

Pattern: {{pattern_code}}
Validation: {{dependencies.validate-pattern}}

Include:
1. Project title and description
2. Features and benefits
3. Quick start (30 seconds)
4. Installation instructions
5. Usage examples
6. API reference
7. Contributing guidelines
8. License (MIT)
9. Acknowledgments

Follow best OSS practices and markdown formatting.`,
      dependencies: ['validate-pattern'],
    },
    {
      id: 'prepare-pr',
      agentName: 'github-integration',
      prompt: `Prepare a GitHub Pull Request for this contribution:

Pattern: {{pattern_code}}
README: {{dependencies.generate-readme}}
Validation: {{dependencies.validate-pattern}}

Create:
1. PR title (descriptive, follows conventions)
2. PR description (what, why, how)
3. Checklist for reviewers
4. Related issues/patterns
5. Testing evidence
6. Screenshots/demos (if applicable)

Format according to repository PR template.`,
      dependencies: ['generate-readme', 'validate-pattern'],
    },
  ],
};

// ============================================================================
// Learning Path Creation Workflow
// ============================================================================

export const LEARNING_PATH_WORKFLOW: WorkflowConfig = {
  name: 'learning-path-creation',
  description: 'Create a structured learning path for a specific AI topic',
  agents: AGENT_LIBRARY,
  tasks: [
    {
      id: 'design-curriculum',
      agentName: 'learning-assistant',
      prompt: `Design a learning curriculum for: {{topic}}

Target Audience: {{audience_level}}
Duration: {{duration_weeks}} weeks

Create:
1. Learning objectives
2. Module breakdown (week-by-week)
3. Prerequisites
4. Key concepts per module
5. Hands-on projects
6. Assessment criteria

Follow progressive complexity: foundational → intermediate → advanced.`,
    },
    {
      id: 'create-modules',
      agentName: 'documentation-agent',
      prompt: `Create detailed module content for the learning path:

Curriculum: {{dependencies.design-curriculum}}

For each module, generate:
1. Module overview
2. Lesson plans
3. Code examples
4. Exercises
5. Quizzes
6. Project specifications
7. Resources and references

Make content engaging, practical, and portfolio-building focused.`,
      dependencies: ['design-curriculum'],
    },
    {
      id: 'build-projects',
      agentName: 'pattern-builder',
      prompt: `Build the hands-on projects for this learning path:

Curriculum: {{dependencies.design-curriculum}}
Modules: {{dependencies.create-modules}}

For each project:
1. Starter code/template
2. Step-by-step implementation guide
3. Solution with explanations
4. Extension challenges
5. Deployment instructions

Ensure projects are progressively complex and portfolio-worthy.`,
      dependencies: ['design-curriculum', 'create-modules'],
    },
  ],
};

// ============================================================================
// Pattern Review Workflow
// ============================================================================

export const PATTERN_REVIEW_WORKFLOW: WorkflowConfig = {
  name: 'pattern-review',
  description: 'Comprehensive review of an existing pattern',
  agents: AGENT_LIBRARY,
  tasks: [
    {
      id: 'architecture-review',
      agentName: 'architecture-reviewer',
      prompt: `Conduct an architecture review of this pattern:

Pattern: {{pattern_code}}
Pattern Type: {{pattern_type}}

Review:
1. System design quality
2. Component selection
3. Scalability approach
4. Integration patterns
5. Operations strategy

Provide executive summary, strengths, issues (with severity), and recommendations.`,
    },
    {
      id: 'security-review',
      agentName: 'qa-agent',
      prompt: `Perform security and quality review:

Pattern: {{pattern_code}}

Focus on:
1. Security vulnerabilities
2. Input validation
3. Authentication/authorization
4. Data handling
5. API security
6. Prompt injection risks

Rate each finding by severity (critical/high/medium/low) and provide fixes.`,
    },
    {
      id: 'compliance-review',
      agentName: 'compliance-checker',
      prompt: `Check regulatory compliance:

Pattern: {{pattern_code}}
Use Case: {{use_case}}
Target Industry: {{industry}}

Assess compliance with:
- GDPR/CCPA (privacy)
- HIPAA (if healthcare)
- SOC 2 (security)
- EU AI Act
- Industry-specific regulations

Provide compliance matrix with pass/fail/n-a and remediation steps.`,
    },
    {
      id: 'optimization-recommendations',
      agentName: 'pattern-optimizer',
      prompt: `Analyze and recommend optimizations:

Pattern: {{pattern_code}}
Architecture Review: {{dependencies.architecture-review}}
Security Review: {{dependencies.security-review}}

Optimize for:
1. Performance (specific metrics)
2. Cost (estimated savings)
3. Reliability (failure scenarios)
4. Maintainability (code quality)

Provide prioritized recommendations with effort vs. impact analysis.`,
      dependencies: ['architecture-review', 'security-review'],
    },
    {
      id: 'consolidate-review',
      agentName: 'documentation-agent',
      prompt: `Create a consolidated review report:

Architecture Review: {{dependencies.architecture-review}}
Security Review: {{dependencies.security-review}}
Compliance Review: {{dependencies.compliance-review}}
Optimization Recommendations: {{dependencies.optimization-recommendations}}

Generate:
1. Executive Summary (2-3 paragraphs)
2. Overall Rating (A/B/C/D/F)
3. Critical Issues (must fix)
4. Recommended Improvements (should fix)
5. Nice-to-Haves (could fix)
6. Action Plan (prioritized)

Format as a professional review document with clear sections.`,
      dependencies: [
        'architecture-review',
        'security-review',
        'compliance-review',
        'optimization-recommendations',
      ],
    },
  ],
};

// ============================================================================
// Student Onboarding Workflow
// ============================================================================

export const STUDENT_ONBOARDING_WORKFLOW: WorkflowConfig = {
  name: 'student-onboarding',
  description: 'Personalized onboarding experience for new students',
  agents: AGENT_LIBRARY,
  tasks: [
    {
      id: 'assess-background',
      agentName: 'learning-assistant',
      prompt: `Assess the student's background and create a personalized learning plan:

Student Profile:
- Current Role: {{current_role}}
- Experience Level: {{experience_level}}
- Goals: {{goals}}
- Available Time: {{hours_per_week}} hours/week
- Preferred Learning Style: {{learning_style}}

Create:
1. Skill assessment
2. Recommended starting point
3. Personalized learning path
4. Weekly study plan
5. Milestone goals (30/60/90 days)

Be encouraging and realistic about timelines.`,
    },
    {
      id: 'curate-resources',
      agentName: 'documentation-agent',
      prompt: `Curate personalized learning resources:

Student Assessment: {{dependencies.assess-background}}

Provide:
1. Recommended patterns to start with
2. Prerequisite materials (if needed)
3. Community resources
4. Video tutorials
5. Practice projects
6. Study groups/mentors

Organize by priority and sequence.`,
      dependencies: ['assess-background'],
    },
    {
      id: 'create-first-project',
      agentName: 'pattern-builder',
      prompt: `Create a personalized first project:

Student Profile: {{dependencies.assess-background}}
Resources: {{dependencies.curate-resources}}

Build:
1. Simple but meaningful AI project
2. Step-by-step tutorial
3. Starter template
4. Expected outcomes
5. Deployment guide
6. What's next suggestions

Ensure it's achievable, portfolio-worthy, and builds confidence.`,
      dependencies: ['assess-background', 'curate-resources'],
    },
  ],
};

// ============================================================================
// AGI Research Workflow
// ============================================================================

export const AGI_RESEARCH_WORKFLOW: WorkflowConfig = {
  name: 'agi-research',
  description: 'Comprehensive AGI research workflow for analyzing architectures, evaluating alignment, and assessing safety',
  agents: AGENT_LIBRARY,
  tasks: [
    {
      id: 'analyze-architecture',
      agentName: 'agi-researcher',
      prompt: `Conduct a comprehensive analysis of the following AGI architecture or research topic:

Research Focus: {{research_topic}}
Architecture Type: {{architecture_type}}
Scale Parameters: {{scale_parameters}}

Analyze:
1. Architecture design and scaling properties
2. Emergent capability predictions
3. Theoretical foundations and assumptions
4. Comparison with state-of-the-art approaches
5. Key open research questions

Provide:
- Technical assessment with confidence levels
- Capability trajectory predictions
- Potential breakthroughs and limitations
- Research recommendations

Cite relevant papers and maintain scientific rigor.`,
      context: {},
    },
    {
      id: 'evaluate-alignment',
      agentName: 'alignment-checker',
      prompt: `Evaluate the alignment properties of the AGI architecture:

Architecture Analysis: {{dependencies.analyze-architecture}}
Deployment Context: {{deployment_context}}

Evaluate against:
1. Constitutional AI principles
2. RLHF effectiveness
3. Scalable oversight mechanisms
4. Value learning robustness

Assess risks:
- Deceptive alignment potential
- Goal drift under scaling
- Mesa-optimization risks
- Reward hacking vulnerabilities

Provide alignment rating (SAFE/CONCERNING/DANGEROUS/UNKNOWN) with detailed justification.`,
      dependencies: ['analyze-architecture'],
    },
    {
      id: 'build-world-model',
      agentName: 'world-model-builder',
      prompt: `Construct a world model for understanding the AGI system's impact:

Architecture Analysis: {{dependencies.analyze-architecture}}
Alignment Evaluation: {{dependencies.evaluate-alignment}}
Target Domain: {{target_domain}}

Build:
1. Domain ontology covering key entities and relationships
2. Causal model of system-world interactions
3. Impact trajectory predictions
4. Uncertainty quantification

Focus on:
- Societal implications
- Economic effects
- Safety considerations
- Governance requirements

Output a structured world model with actionable insights.`,
      dependencies: ['analyze-architecture', 'evaluate-alignment'],
    },
    {
      id: 'safety-audit',
      agentName: 'safety-auditor',
      prompt: `Conduct a comprehensive safety audit of the AGI research:

Architecture Analysis: {{dependencies.analyze-architecture}}
Alignment Evaluation: {{dependencies.evaluate-alignment}}
World Model: {{dependencies.build-world-model}}
Compliance Requirements: {{compliance_standards}}

Audit Scope:
1. Capability control mechanisms
2. Goal specification correctness
3. Robustness under distribution shift
4. Corrigibility and shutdown behavior
5. Governance and oversight adequacy

Deliverables:
- Executive summary with overall risk rating
- Detailed findings by category
- Prioritized remediation recommendations
- Compliance gap analysis
- Continuous monitoring plan

Apply conservative safety assessments and err on the side of caution.`,
      dependencies: ['analyze-architecture', 'evaluate-alignment', 'build-world-model'],
    },
  ],
};

// ============================================================================
// World Problem Solving Workflow
// ============================================================================

export const WORLD_PROBLEM_WORKFLOW: WorkflowConfig = {
  name: 'world-problem-solving',
  description: 'Multi-agent workflow for analyzing and solving complex real-world challenges using AI systems',
  agents: AGENT_LIBRARY,
  tasks: [
    {
      id: 'model-problem-domain',
      agentName: 'world-model-builder',
      prompt: `Construct a comprehensive world model for the following global challenge:

Problem Domain: {{problem_domain}}
Geographic Scope: {{geographic_scope}}
Time Horizon: {{time_horizon}}
Key Stakeholders: {{stakeholders}}

Build:
1. Domain ontology
   - Key entities (actors, resources, systems)
   - Relationships and dependencies
   - Constraints (physical, economic, political)

2. Causal model
   - Root causes and contributing factors
   - Intervention points
   - Feedback loops and dynamics

3. Current state assessment
   - Quantitative metrics
   - Qualitative indicators
   - Historical trends

4. Uncertainty analysis
   - Known unknowns
   - Model limitations
   - Confidence levels

Output a structured, actionable world model.`,
      context: {},
    },
    {
      id: 'research-solutions',
      agentName: 'agi-researcher',
      prompt: `Research AI-augmented solutions for the world problem:

World Model: {{dependencies.model-problem-domain}}
Solution Constraints: {{solution_constraints}}
Available Resources: {{available_resources}}

Research:
1. State-of-the-art AI approaches applicable to this domain
2. Successful case studies and prior interventions
3. Novel solution architectures combining multiple approaches
4. Scaling considerations and resource requirements

For each proposed solution:
- Technical feasibility assessment
- Expected impact (quantified where possible)
- Implementation complexity
- Time to impact
- Risk factors

Provide 3-5 ranked solution approaches with detailed analysis.`,
      dependencies: ['model-problem-domain'],
    },
    {
      id: 'alignment-review',
      agentName: 'alignment-checker',
      prompt: `Evaluate alignment and ethical considerations for proposed solutions:

World Model: {{dependencies.model-problem-domain}}
Proposed Solutions: {{dependencies.research-solutions}}
Ethical Framework: {{ethical_framework}}

Evaluate each solution for:
1. Value alignment with stakeholder interests
2. Fairness and equity implications
3. Unintended consequences and side effects
4. Long-term sustainability
5. Human autonomy and oversight preservation

Risk Assessment:
- Dual-use potential
- Power concentration risks
- Vulnerable population impacts
- Reversibility of interventions

Provide ethical rating for each solution with recommendations for alignment improvements.`,
      dependencies: ['model-problem-domain', 'research-solutions'],
    },
    {
      id: 'safety-assessment',
      agentName: 'safety-auditor',
      prompt: `Conduct safety assessment for implementing AI solutions to the world problem:

World Model: {{dependencies.model-problem-domain}}
Proposed Solutions: {{dependencies.research-solutions}}
Alignment Review: {{dependencies.alignment-review}}
Regulatory Context: {{regulatory_context}}

Assess:
1. Deployment safety
   - Failure modes and recovery procedures
   - Monitoring and alerting requirements
   - Human oversight mechanisms

2. Security considerations
   - Adversarial attack vectors
   - Data integrity and privacy
   - System resilience

3. Governance requirements
   - Regulatory compliance
   - Accountability structures
   - Audit and transparency

4. Scaling risks
   - Emergent behaviors at scale
   - Resource consumption trajectory
   - Dependency chains

Provide:
- Safety rating for each solution
- Required safeguards before deployment
- Monitoring and evaluation framework
- Incident response protocol`,
      dependencies: ['model-problem-domain', 'research-solutions', 'alignment-review'],
    },
    {
      id: 'synthesize-implementation-plan',
      agentName: 'documentation-agent',
      prompt: `Synthesize a comprehensive implementation plan for solving the world problem:

World Model: {{dependencies.model-problem-domain}}
Solutions Research: {{dependencies.research-solutions}}
Alignment Review: {{dependencies.alignment-review}}
Safety Assessment: {{dependencies.safety-assessment}}

Create:
1. Executive Summary
   - Problem statement
   - Recommended solution
   - Expected impact
   - Key risks and mitigations

2. Implementation Roadmap
   - Phase 1: Pilot (3-6 months)
   - Phase 2: Scale (6-18 months)
   - Phase 3: Sustain (18+ months)

3. Resource Requirements
   - Technical infrastructure
   - Human capital
   - Financial investment
   - Partnerships needed

4. Success Metrics
   - Leading indicators
   - Lagging indicators
   - Evaluation methodology

5. Risk Management
   - Risk register
   - Mitigation strategies
   - Contingency plans

6. Governance Framework
   - Decision-making structure
   - Stakeholder engagement
   - Accountability mechanisms

Format as a professional implementation document suitable for executive and technical audiences.`,
      dependencies: [
        'model-problem-domain',
        'research-solutions',
        'alignment-review',
        'safety-assessment',
      ],
    },
  ],
};

// ============================================================================
// Workflow Library Export
// ============================================================================

export const WORKFLOW_LIBRARY = {
  PATTERN_DEVELOPMENT: PATTERN_DEVELOPMENT_WORKFLOW,
  OSS_CONTRIBUTION: OSS_CONTRIBUTION_WORKFLOW,
  LEARNING_PATH: LEARNING_PATH_WORKFLOW,
  PATTERN_REVIEW: PATTERN_REVIEW_WORKFLOW,
  STUDENT_ONBOARDING: STUDENT_ONBOARDING_WORKFLOW,
  // AGI Research Workflows
  AGI_RESEARCH: AGI_RESEARCH_WORKFLOW,
  WORLD_PROBLEM: WORLD_PROBLEM_WORKFLOW,
};

export type WorkflowType = keyof typeof WORKFLOW_LIBRARY;

export function getWorkflow(type: WorkflowType): WorkflowConfig {
  return WORKFLOW_LIBRARY[type];
}

export function listWorkflows(): WorkflowType[] {
  return Object.keys(WORKFLOW_LIBRARY) as WorkflowType[];
}

export function getWorkflowByName(name: string): WorkflowConfig | undefined {
  const entry = Object.entries(WORKFLOW_LIBRARY).find(
    ([_, workflow]) => workflow.name === name
  );
  return entry ? entry[1] : undefined;
}
