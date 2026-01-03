# AI Architect Academy Delivery Agent

This agent orchestrates the build-out of the AI Architect Academy MVP as described in `AI-Architect-Academy-Spec.html` and `MVP and Timeline.md`. Execute with precision, ship-ready documentation, and continuous validation.

## 1. Mission Control
- Launch adaptive, gamified knowledge platform for 1,000 learners within one-week MVP window.
- Maintain alignment with product pillars, technical architecture, and SDLC sprints defined in the specification HTML.
- Keep stakeholders informed through concise daily status notes.

## 2. Key Assets
- **Product & Delivery Blueprint**: `AI-Architect-Academy-Spec.html` (master reference for flows, pages, APIs, and tasks).
- **Roadmap & Timeline**: `MVP and Timeline.md` (7-day launch plan, success criteria).
- **Knowledge Libraries**: `01-design-patterns/`, `02-learning-paths/`, `08-governance/`, `AI CoE Templates/`.
- **Process Accelerators**: `process/`, `dashboard/`, `scripts/`.

## 3. Operating Principles
1. **Traceability**: Every task must reference the relevant section in the HTML spec or roadmap.
2. **Incremental Delivery**: Commit in vertical slices (onboarding flow, playlist engine, gamification layer, ingestion ops).
3. **Quality Gates**: Lint, unit test, integration test, and UX acceptance criteria enforced before merge.
4. **Feedback Loops**: Capture learner, content curator, and professor signals; feed into backlog daily.

## 4. Core Workflow
1. **Plan**
   - Review sprint scope (see SDLC timeline inside HTML spec).
   - Break down feature epics into executable stories stored in `process/backlog/*.md`.
   - Align daily stand-up goals with `Comprehensive Task Matrix` in the spec.
2. **Build**
   - Implement Next.js surfaces per `Experience Architecture & Page Inventory`.
   - Expose APIs matching `API Specification` (payload contracts, auth rules).
   - Configure data schemas and migrations outlined in `Data Model Snapshot`.
3. **Integrate**
   - Wire personalization engine to LLM provider with evaluation harness.
   - Connect gamification service to points, streaks, and leaderboard UI.
   - Set up agent ingestion pipeline and approval console.
4. **Validate**
   - Author Playwright flows for onboarding, playlist management, and retention challenge.
   - Run load testing scripts (k6/Gatling) for 1,000 concurrent learners.
   - Verify observability dashboards, alerts, and retention analytics.
5. **Launch & Iterate**
   - Execute launch checklist from roadmap.
   - Collect pilot cohort feedback and update backlog.
   - Document retrospectives; adjust future sprints and professor program prep.

## 5. Task Breakdown
Follow this baseline allocation and adapt as priorities shift:
- **Product/UX**
  - User stories, Figma flows, gamification rulebook, certification matrix.
- **Engineering**
  - Next.js scaffolding, API routes, edge functions, CI/CD, tests.
  - Database schema and seeding for domains, knowledgepoints, progress, certifications.
- **Data & Content**
  - Hierarchy curation, agent crawler prompts, retention question bank.
  - Approval workflow definitions and SLAs for content freshness.
- **Ops & Enablement**
  - Vercel project setup, secrets, monitoring, cron schedules.
  - Support playbooks, pilot communications, NFT credential prototype coordination.

## 6. Coordination Rituals
- **Daily Sync**: 15-minute stand-up covering progress, blockers, next deliverables.
- **Mid-Sprint Review**: Validate user journeys end-to-end; adjust backlog.
- **Launch Readiness**: Checklist dry run 48 hours before go-live.
- **Post-Launch**: 24-hour performance review, learner feedback digest, and action log.

## 7. Definition of Done
A story is complete when:
- Functionality matches spec acceptance criteria and passes automated tests.
- UX reviewed and approved by product/design lead.
- Documentation updated (README, runbook, or knowledgepoint notes).
- Observability hooks emit expected metrics; alerts configured.
- Stakeholder update posted with demo link or screenshots.

## 8. Tooling & Commands
```
# Install dependencies
npm install

# Run dev server
npm run dev

# Lint & format
npm run lint
npm run format

# Tests
npm run test
npm run test:e2e

# Database
npx prisma migrate dev
npx prisma db seed

# Load testing (example)
node scripts/k6-launch.js
```

## 9. Escalation & Governance
- Apply governance checklists from `08-governance/` for compliance-sensitive tracks (Healthcare, Finance).
- Log content ingestion decisions and NFT credential triggers in `dashboard/ops-log.md`.
- Escalate critical incidents via `16-collaboration/escalation-guide.md` with timestamps and owner assignments.

Stay aligned with the spec; no untracked scope. Iterate quickly, maintain quality, and ship the MVP on schedule.
