# OpenRouter Architect Toolkit (ORA) Strategy

_Date:_ 19 Sep 2025  
_Owner:_ AI Architect Academy Delivery Guild  
_References:_ AI-Architect-Academy-Spec.html:373, AI-Architect-Academy-Spec.html:659, MVP and Timeline.md:935

## 1. Problem & Opportunity
AI architects inside enterprises juggle multiple model providers, governance rules, and SDLC workflows. OpenRouter already aggregates premium and open-weight models, but architects lack:
- A consistent way to route requests with context, guardrails, and observability that map to the Academy's experience architecture (AI-Architect-Academy-Spec.html:373).
- IDE-native tooling that aligns coding workflows with governance, evaluation, and ingestion loops defined in the Comprehensive Task Matrix (AI-Architect-Academy-Spec.html:659).
- A turnkey launch checklist that bakes EU AI Act monitoring into daily dev motions (MVP and Timeline.md:935).

## 2. Market Gap Analysis
| Segment | Examples | Gaps for Architects |
| --- | --- | --- |
| Routing dashboards | OpenRouter Playground, Hyperbolic router UIs | No SDLC hooks, limited telemetry, no policy-as-code integration. |
| Prompt engineering IDEs | Continue, Zed AI, Cursor | Focus on coding copilots, not architecture workflows, lacks multi-model switchboard with governance metadata. |
| Enterprise AI gateways | Anyscale, Azure Front Door for AI | Proprietary, heavy ops lift, no OSS option tuned for architecture curriculum. |
| VS Code extensions | Continue, Codeium | Optimize developer productivity but ignore architecture documentation, risk controls, and cross-team collaboration.

Conclusion: the Academy can own an OSS Architect-first OpenRouter wrapper that becomes the default developer+architect tool because it stitches routing, governance, and eval loops in one package.

## 3. Value Proposition & Differentiators
- **Architect workflow fit:** Pre-wired to Academy blueprints (onboarding dashboards, realtime copilot, ingestion ops) so architects ship vertical slices fast.
- **Governance-native:** Templates for EU AI Act risk class, transparency logs, and oversight tasks automatically recorded.
- **Telemetry out-of-the-box:** Langfuse, Promptfoo, and cost ledger integrations align with Task Matrix expectations.
- **Open ecosystem:** OSS license (MIT or Apache 2.0) plus OpenAPI/TypeScript SDK invites community additions; wrappers for Vercel AI SDK, LangGraph.
- **Low friction adoption:** CLI + VS Code extension sharing the same config; zero-cost start using OpenRouter key with fallbacks to local models.

## 4. Target Personas & Use Cases
| Persona | Use Case | Outcome |
| --- | --- | --- |
| Builder Architect | Configure cross-provider routing, run evals before merge. | Reduce latency/cost 20%, maintain guardrails. |
| Governance Lead | Verify risk class, oversight plan, transparency artifacts per sprint. | Compliance documented without manual chase. |
| Content Curator | Trigger ingestion agent tests when new knowledgepoints arrive. | Content freshness maintained automatically. |
| Professor Mentor | Review learner projects with shared traces inside VS Code. | Faster feedback loops, consistent rubric.

## 5. Product Scope
### 5.1 Core OpenRouter Wrapper (ORA Core)
- TypeScript/Node package providing:
  - Model registry with metadata (tokens/sec, context window, cost, licensing).
  - Policy hooks (pre/post processors) for redaction, retention policies.
  - Observability adapters (Langfuse, OpenTelemetry, cost ledger).
  - Config-driven routing YAML (per environment, per journey slice).
- CLI commands (ora init, ora run, ora eval, ora audit).

### 5.2 VS Code Extension (ORA Studio)
- Surfacing ORA Core capabilities inside VS Code:
  - Model switcher, per-file policy hints, architecture checklist panel.
  - Inline eval runs (Promptfoo) and trace viewer.
  - EU AI Act checklist widget aligned with regulatory launch checklist.

### 5.3 Optional Web Dashboard
- Lightweight Next.js dashboard leveraging existing Academy components.
- Shared state across CLI and extension via .ora/config.yml.

## 6. Architecture Overview
1. **Client layers:** CLI, VS Code extension, optional dashboard.
2. **Core services:**
   - Routing engine (TypeScript) calling OpenRouter REST with pluggable middlewares.
   - Governance service writing to docs/ transparency logs and Langfuse.
   - Eval harness invoking Promptfoo scenarios, storing results in reports/.
3. **Data stores:** .ora/config.yml, logs/, Langfuse cloud/on-prem, optional SQLite for offline caching.
4. **Integration points:**
   - Vercel AI SDK (streaming), LangGraph flows, Academy ingestion agents.
   - Safety monitor hooking realtime copilot surfaces (AI-Architect-Academy-Spec.html:1601).

## 7. User Flows
1. **Setup Flow:**
   - Run `ora init` -> prompts for OpenRouter key, project name, governance requirements.
   - Generates config, sample prompts, Promptfoo suite, EU AI Act checklist stub.
   - Optionally installs VS Code extension and registers workspace.
2. **Authoring Flow (VS Code):**
   - Architect opens extension panel -> chooses journey slice (Onboarding Wizard, Realtime Copilot, etc.).
   - Selects model combination (GPT-4o, Claude 3.5) with fallback weighting.
   - Runs inline eval; results logged to Langfuse, summary displayed.
   - Governance tab updates transparency log and risk scoreboard.
3. **Launch Flow:**
   - ora audit compiles evaluation results, policy confirmations, EU AI Act checklist entries.
   - Generates dashboard summary + markdown for stakeholders.
4. **Continuous Update Flow:**
   - Scheduled job or manual ora sync refreshes model catalog (latency, cost changes).
   - Highlights impacted journeys for quick remediation.

## 8. Feature Specification
### MVP (6 weeks)
- ORA Core CLI with routing, config, eval runner.
- Model catalog seeded with top OpenRouter providers (OpenAI, Anthropic, Groq, Mistral, Llama 3.1).
- Governance scaffolding: EU AI Act template, logging to markdown.
- Langfuse/Promptfoo integration toggles.
- VS Code extension basics: command palette actions, status bar model indicator, eval panel.

### Stretch (Post-MVP)
- Realtime session planner for voice/video copilots.
- Multi-tenant config sharing for cohorts.
- Web dashboard with collaboration timeline.
- Auto-remediation suggestions (e.g., switch to Groq when latency spikes).

## 9. SDLC & Delivery Plan
| Sprint | Focus | Deliverables |
| --- | --- | --- |
| 0 (Week 0) | Planning & Design | Repo scaffolding, RFC review, UX wireframes, extension architecture doc. |
| 1 (Week 1) | ORA Core Routing | Config schema, OpenRouter client, basic CLI commands. |
| 2 (Week 2) | Governance Hooks | EU AI Act checklist automation, logging, policy middleware. |
| 3 (Week 3) | Eval Integrations | Promptfoo templates, Langfuse instrumentation, cost ledger. |
| 4 (Week 4) | VS Code Extension Foundations | Sidebar panel, command palette, config sync. |
| 5 (Week 5) | UX Polish & Testing | Unit/integration tests, telemetry verification, docs. |
| 6 (Week 6) | Launch Prep | OSS docs, community templates, beta testing with Academy cohort.

**SDLC Practices:**
- Follow process/pattern-delivery-sdlc.xml for gating; each sprint ends with demo + governance review.
- CI: GitHub Actions running lint, tests (`npm test` + VS Code extension tests via `vscode-test`).
- Release: semantic versioning, signed tags, automated changelog.

## 10. Go-To-Market & Community Plan
- **Beta cohort:** Academy builders + partner consultancies; gather weekly feedback via 16-collaboration workflows.
- **Content:** Publish tutorials in 02-learning-paths (e.g., Architect Routing Lab).
- **Distribution:** VS Code Marketplace, GitHub releases, integration with OpenRouter docs (co-marketing).
- **Incentives:** Hackathons, leaderboard inside Academy dashboard, badge for top contributors.

## 11. Success Metrics
- 5K VS Code installs within 3 months.
- 1K unique ORA CLI downloads and 50% weekly active.
- 90% of pilot projects producing EU AI Act checklist artifacts automatically.
- Latency/cost regression detection catches >=3 incidents per quarter.

## 12. Risk & Mitigation
| Risk | Mitigation |
| --- | --- |
| OpenRouter API changes | Versioned adapters, nightly schema tests. |
| Compliance updates | Governance templates stored separately, update via config sync. |
| VS Code marketplace competition | Highlight unique architecture workflows; partner with OpenRouter for homepage promotion. |
| Adoption friction | ORA Lite mode (no governance) plus quick-start videos. |

## 13. Effort & Team
- **VS Code Extension Difficulty:** Moderate (approx 3 engineer-weeks). Complexity stems from state management between CLI and extension, but leveraging vscode-languageclient and existing Academy component library keeps scope contained.
- **Team:**
  - Lead architect (routing & governance).
  - Frontend engineer (VS Code + dashboard).
  - DevRel/content strategist for tutorials.
  - Governance SME for template upkeep.

## 14. Next Steps
1. Approve scope and publish RFC for community comment.
2. Spin up ora monorepo (TurboRepo for CLI + extension) and seed with MIT license.
3. Schedule beta with Academy sprint teams; align deliverables with realtime copilot backlog (AI-Architect-Academy-Spec.html:1601).
4. Create GitHub project board linking to Task Matrix responsibilities for visibility.
