# AI Architect Academy - Experience Plan, Landing Page, and Costing

## Scope and intent
This document reviews the current approach and education material found in this repo, then proposes a full Academy experience for AI Architects, including platform journey, curriculum, feature set, landing page enhancement, ADK selection, and build/run cost estimates with pricing and segment assumptions.

## Current approach (repo review)
Observed assets in this repo:
- Strong technical backbone: workflows, templates, prompts, and skills for OCI GenAI, multi-cloud, RAG, and architecture design.
- Operational focus: security, FinOps, and deployment guidance are present.
- Tooling foundation: MCP servers, D2 templates, Terraform modules, SDK examples.

Gaps vs. an Academy experience:
- No structured learning paths or curriculum map.
- No onboarding, competency assessment, or certification progression.
- No learner experience design (cohort flow, labs, capstone, mentor feedback).
- No productized packaging (tiers, pricing, or value progression).
- No marketing surface (landing page narrative, outcomes, social proof).

## Experience vision (top experience for AI Architects)
Position the Academy as a career-grade platform that produces architect-level outcomes: design multi-cloud AI systems, deploy agentic apps, and operate them securely at scale.

Experience principles:
- Outcome-first: every module yields a production artifact (diagram, Terraform, eval report, playbook).
- Proof of competence: assessments, capstones, and credentialing.
- Multi-cloud but OCI-forward: emphasize OCI DAC advantages while keeping portability.
- Agentic-native: all learning is performed with agents, not just about agents.
- Cost-aware: built-in FinOps during design and ops.

## Full platform journey (end-to-end)
1) Discover and qualify
- Skill self-assessment (15 min): architecture, cloud, security, LLM basics.
- Role fit: Solution Architect, AI Platform Architect, AI Product Architect.

2) Onboard and personalize
- Adaptive pathway selection: Foundation, Enterprise, or Expert.
- Portfolio baseline: ingest existing designs to personalize curriculum.

3) Learn-by-building
- Weekly labs: deploy, evaluate, and document.
- Studio reviews: peer + mentor critique on architecture and governance.

4) Validate and certify
- Proctored scenario exam and capstone defense.
- Badge stack: RAG, Agent Orchestration, Security, FinOps, Multi-Cloud.

5) Operate in the real world
- Reference library access, templates, and accelerator playbooks.
- Continuous updates for model/provider changes.

## Proposed curriculum map
Foundation Track (2-3 weeks)
- AI systems fundamentals for architects
- LLM APIs, token economics, and latency tradeoffs
- RAG basics and knowledge architecture
- Security baseline and OWASP LLM Top 10
Artifacts: Architecture brief, RAG POC, security checklist

Enterprise Track (4-6 weeks)
- Multi-cloud AI gateway patterns
- Agent orchestration (routing, handoffs, evals)
- Data governance, lineage, and policy control
- Production observability and incident readiness
Artifacts: AI gateway D2, agent workflow, ops playbook

Expert Track (4-6 weeks)
- Dedicated AI Clusters (OCI DAC) and GPU sizing
- Retrieval + tool orchestration at scale
- Cost optimization and model routing strategy
- Enterprise deployment (Terraform + CI/CD)
Artifacts: Terraform deployment, eval suite, cost model

Capstone (2 weeks)
- Build an end-to-end system for a real enterprise scenario
- Deliverables: D2 diagram, security review, Terraform, eval report, TCO model

## Product feature set (platform)
Core features
- Guided labs with runnable environments (OCI + multi-cloud)
- Agent-assisted copilots for architecture and code reviews
- D2 diagramming and Terraform generation
- Evaluation suite for prompt/tool quality
- Mentored studio reviews and office hours

Advanced features
- AI gateway configuration wizard
- Model routing and cost optimizer
- Compliance toolkit (policies, audit, lineage)
- Skills graph and competency dashboard

## Agent stack recommendation (ADK strategy)
Goal: maximize capability, portability, and enterprise trust.

Recommended approach: multi-provider agent layer with a unified gateway.
- Use OpenAI Agents SDK for rapid builder tooling, evaluations, and multi-agent routing.
- Use Claude SDK for computer-use workflows, research, and tool-rich automation.
- Use Oracle ADK for OCI-native deployments and enterprise security requirements.
- Front all providers with a neutral AI Gateway for routing, policy, and observability.

Decision rationale
- OpenAI AgentKit: best for orchestration primitives, evaluation suite, and UI builders.
- Claude SDK: best for autonomous tasks and operations inside controlled environments.
- Oracle ADK: required for OCI-centric customers and regulated enterprise workloads.

Execution model
- Primary runtime: OpenAI Agents SDK for training labs and evaluation.
- Enterprise runtime: Oracle ADK for OCI deployment labs and production paths.
- Power-user tooling: Claude SDK for advanced automation and CI/CD bots.

## Landing page enhancement (structure + copy)
Below is a replacement structure and copy blocks for a landing page.

Hero
- Headline: Build enterprise-grade AI architecture, not just demos.
- Subhead: The AI Architect Academy turns senior engineers into AI system architects through production labs, agent tooling, and multi-cloud deployments.
- Primary CTA: Start the Architect Path
- Secondary CTA: View Curriculum

Proof ribbon
- Outcomes: 12 production artifacts, 4 certifications, 1 capstone defense
- Credibility: Multi-cloud patterns, OCI DAC, enterprise security

Section: What you will build
- AI Gateway + routing policy
- Agent workflow with handoffs
- Retrieval architecture with evals
- Terraform deployment for OCI DAC

Section: How the Academy works
- Assess -> Personalize -> Build -> Validate -> Certify -> Operate

Section: Curriculum snapshot
- Foundation (2-3 weeks)
- Enterprise (4-6 weeks)
- Expert (4-6 weeks)
- Capstone (2 weeks)

Section: Why architects choose this
- Production artifacts, not just videos
- Multi-cloud design with OCI strength
- Cost and security embedded from day one

Section: Pricing and cohorts
- Starter (self-paced)
- Pro (labs + evals + feedback)
- Enterprise (mentors + OCI deployment + compliance)

FAQ
- What skill level is required?
- How much time per week?
- Can I use AWS/Azure alongside OCI?

Footer
- Join the next cohort

## Experience flow inside the platform
Home
- Path progress, tasks, upcoming reviews, cost and security status

Workspace
- Lab instructions, terminals, agent chat, D2 canvas, Terraform editor

Review
- Automated checks (security + cost + eval metrics)
- Mentor feedback and badge gating

Portfolio
- All artifacts, shareable links, exportable architectures

## Build estimate (time and effort)
Assumptions: 2-week sprints, 1 PM, 1 Architect, 2 Engineers, 1 Designer, 1 Content Lead.

Phase 0 - Discovery (2 weeks)
- Define personas, outcomes, and success metrics
- Audit current assets and map to curriculum

Phase 1 - MVP (6-8 weeks)
- Onboarding + Foundation track
- Basic labs, artifacts, and assessments
- Simple landing page and pricing

Phase 2 - Full Experience (8-12 weeks)
- Enterprise + Expert tracks
- Agent-powered labs and eval suite
- OCI deployment labs and multi-cloud patterns
- Certification flow and cohort ops

## Run-rate (monthly) cost estimate
Assumptions for 1,000 active learners/month:
- 40% Foundation, 40% Enterprise, 20% Expert
- Average 30 lab runs per learner
- Models: GPT-4o mini for standard tasks, Claude Sonnet for complex, OCI for deployment labs

Estimated monthly costs (rough order of magnitude)
- LLM usage: $12k-$35k
- Infra and labs (cloud compute, storage, CI): $8k-$20k
- Staff support (mentors + ops): $25k-$60k
- Total: $45k-$115k

Notes:
- Costs compress significantly with caching, batching, and model routing.
- Enterprise tiers can subsidize the base tiers.

## Pricing and willingness to pay (by segment)
Individuals
- Starter: $199-$399/mo (self-paced, no mentor)
- Pro: $699-$1,299/mo (labs, evals, feedback)

Teams / SMB
- Team: $8k-$20k/yr per seat (shared labs, org dashboards)

Enterprise
- Enterprise: $50k-$250k/yr (cohort + OCI deployment + compliance)

Feature willingness mapping
- Labs and templates: paid by all tiers
- Mentors and reviews: Pro/Enterprise
- OCI DAC deployments and compliance: Enterprise
- Multi-cloud governance and FinOps: Enterprise

## Open questions to finalize
- Who is the primary buyer (individual, team lead, or enterprise)?
- Target cohort size and mentor availability?
- Preferred cloud for labs (OCI-only vs. multi-cloud)?
- Expected monthly active learners in year 1?

