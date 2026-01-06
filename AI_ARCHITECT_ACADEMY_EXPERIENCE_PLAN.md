# AI Architect Academy - Experience Review and Build Plan

## Purpose
Create a top-tier experience for AI Architects by reviewing the current approach and education assets, then defining a full platform experience, landing page enhancements, ADK choice, and build/run cost estimates.

## 1) Review: Current Approach
Source references: `CURRENT_STATE.md`, `AI-Architect-Academy-Spec.html`, `02-learning-paths/`

### What exists today (strengths)
- Open-source, practical resources: patterns, templates, workflows, and reference projects.
- Structured learning paths with real artifacts (Beginner, 100-Hour, Professional).
- Clear AI Architect-first positioning and governance content.
- Draft experience architecture, page inventory, and technical architecture in the spec.

### What is missing for a “top” experience
- No live platform: accounts, progress tracking, certifications, and feedback loops do not exist yet.
- No personalized onboarding or adaptive playlists connected to a learner profile.
- No productized assessment and mastery validation (quizzes, retention pulses, evals).
- Limited in-platform community, mentor, or enterprise enablement experiences.
- Landing page is strong visually but does not yet present a specific learner journey, proofs, or clear conversion funnel.

## 2) Review: Current Education
Source references: `02-learning-paths/100-hour-ai-architect.md`, `02-learning-paths/beginner.md`, `02-learning-paths/professional.md`

### What the education does well
- Clear time-boxed curricula with weekly outcomes and hands-on artifacts.
- Strong bias toward real deliverables (benchmarks, evals, governance docs).
- Explicit references to internal patterns, projects, and templates.

### Education gaps to address
- No standardized assessments mapped to a skills framework.
- No skill-level diagnostics or personalization from day one.
- No capstone system with grading, rubrics, or portfolio validation.
- No cohort or guided implementation layer for teams/enterprises.

## 3) Target Experience: The AI Architect Journey
Goal: Create a premium, adaptive experience spanning onboarding, learning, building, and professional outcomes.

### Stage 1: Discover and Decide
- Outcome: Clear positioning, proof of outcomes, and a decisive CTA.
- Surfaces: Landing page, pricing, sample journey.
- Proof: case studies, portfolio examples, certification outcomes, employer demand.

### Stage 2: Onboarding and Diagnostic
- Outcome: Personalized path and weekly plan.
- Key steps: persona + industry selection, goal mapping, diagnostic quiz, time budget.
- Output: personalized knowledge journey with first week playlist.

### Stage 3: Guided Build Experience
- Outcome: Real systems delivered with evals and governance.
- Features: step-by-step build scripts, agent copilots, evaluation harness, portfolio capture.

### Stage 4: Certification and Proof
- Outcome: validated skill level and artifacts.
- Features: checkpoints, retention pulses, project rubric, certification issuance.

### Stage 5: Community and Career
- Outcome: employer discovery and peer learning.
- Features: cohort discussion, portfolio showcase, marketplace opportunities.

## 4) Full Platform Experience (Blueprint)
Alignment: `AI-Architect-Academy-Spec.html` page inventory with added depth.

### Core surfaces
- Marketing landing
- Onboarding wizard + diagnostic
- Realtime copilot coach
- Knowledge journey dashboard
- Knowledgepoint detail pages
- Retention pulses and assessments
- Leaderboard, certification center, portfolio pages
- Professor and admin console

### Experience additions
- Capstone projects with rubrics and peer review
- Org dashboards for cohort progress and skill gaps
- Employer-facing talent pipeline view
- AI-powered “gap-to-goal” recommendations

## 5) Landing Page Enhancements (Content and Structure)
Goal: Convert visitors by showing a concrete outcome in 5 minutes.

### Recommended structure
1) Hero: "Design, deploy, and prove AI systems in weeks"
2) Immediate proof: outcomes, stats, and 30-second walkthrough
3) 3-step journey: Diagnose -> Build -> Certify
4) Audience panels: Individual, Team Lead, Enterprise
5) Sample playlist and capstone preview
6) Testimonials or outcomes (case studies)
7) Final CTA + waitlist/early access

### Suggested hero copy (draft)
- Headline: "Become the AI Architect your organization relies on"
- Subhead: "Adaptive pathways, real systems, and verified skill proof for AI leaders."
- CTAs: "Start your diagnostic" and "See a sample journey"

## 6) ADK Choice: OpenAI vs Claude vs Hybrid
Recommendation: Hybrid provider strategy with a unified orchestration layer.

### Why hybrid
- OpenAI: strong real-time streaming, tool calling, and multi-modal experience.
- Claude: strong long-context reasoning and high-quality planning.
- Smaller models: low-cost routing for classification and summarization.

### Best combined experience
- Use a provider-agnostic orchestration layer (LiteLLM or equivalent).
- Route tasks by model strengths:
  - Onboarding and diagnostic: Claude for deep reasoning.
  - Realtime coaching: OpenAI for low-latency streaming.
  - Summaries and tagging: small model for cost control.

## 7) Build Plan (Phases)
Time estimates are for a small dedicated team (2 engineers + 1 designer/PM).

### Phase 1: Foundation (4-6 weeks)
- Landing page narrative refresh
- Onboarding wizard + diagnostic
- Knowledge journey dashboard (static data)
- Account system and progress tracking
- Initial content ingestion pipeline

### Phase 2: Adaptive Learning (6-8 weeks)
- Playlist personalization with LLM + rules
- Retention pulses and assessment engine
- Portfolio and certification center
- Professor console MVP

### Phase 3: Enterprise and Marketplace (6-10 weeks)
- Team dashboards and skill gap analytics
- Cohort and mentorship tools
- Marketplace, hiring pipeline, and enterprise billing
- Advanced analytics and governance reporting

## 8) Cost Estimates
These are directional estimates; actual costs depend on traffic, model choice, and usage.

### Build effort (labor)
- Phase 1: 4-6 weeks (approx. 240-360 hours)
- Phase 2: 6-8 weeks (approx. 360-480 hours)
- Phase 3: 6-10 weeks (approx. 360-600 hours)

### Monthly run costs (example assumptions)
Assumptions: 1,000 MAU, 250 WAU, 50 DAU, 25k tokens per active user/day.

- LLM usage: $300 to $2,500 (depends on model mix and token usage)
- Hosting (Vercel + CDN): $100 to $500
- Database (Supabase/Postgres): $100 to $400
- Vector DB: $100 to $500
- Observability (Langfuse/PostHog): $50 to $300
- Misc (email, logging, storage): $50 to $200

Estimated monthly range: $700 to $4,400

## 9) Willingness to Pay (By Segment)

### Individuals (career builders)
- Will pay for: guided pathways, certification, portfolio validation, real system templates.
- Pricing target: $29 to $99 per month or $299 to $999 per certification bundle.

### Team leads and managers
- Will pay for: cohort dashboards, skill gap visibility, shared templates, internal enablement.
- Pricing target: $199 to $999 per team per month.

### Enterprises
- Will pay for: compliance-ready curricula, custom tracks, analytics, and hiring pipeline.
- Pricing target: $10k to $200k per year depending on seats and services.

### Professors/creators
- Will pay for: monetization tools, audience distribution, and revenue share.
- Pricing target: $99 to $299 per month plus revenue share.

## 10) Next Steps
1) Approve the platform blueprint and phase plan.
2) Decide on hybrid provider strategy and pricing model.
3) Prioritize Phase 1 features and begin implementation tasks.
