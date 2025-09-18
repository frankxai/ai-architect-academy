# Pattern: Content Generation Platform

**Mission:** Deliver personalised, compliant content at speed while keeping humans-in-the-loop and insights flowing back into the campaign brain.

## High-Value Use Cases
| Use Case | Impact | Example KPI |
| --- | --- | --- |
| Multichannel campaign factory | Launch product campaigns across web, email, social within hours. | Time-to-publish < 6h; variant lift >15%. |
| Personalised nurture flows | Tailor messaging by persona, intent, or lifecycle stage. | Pipeline influence per segment. |
| Thought-leadership ghostwriting | Arm executives/SMEs with research-backed narratives. | Content acceptance >90%; engagement >25%. |
| Localisation & compliance rewrites | Translate while enforcing disclosures and policy rules. | Zero compliance violations; review SLA <24h. |

## Experience Blueprint
| Stage | Human Actions | AI/Agent Responsibilities | Systems |
| --- | --- | --- | --- |
| Brief Intake | Marketing lead captures campaign brief, goals, audiences. | Brief parser extracts entities, tone, mandatory messaging. | Notion/Asana intake ? Orchestrator queue. |
| Research & Retrieval | Strategist curates references, product updates. | Hybrid retrieval agent pulls knowledge base snippets with citations. | Vector store (pgvector) + policy DB. |
| Draft & Variant Generation | Editor reviews outlines, selects formats (blog, email, spot). | Generation agents create structured drafts, CTA variants, CTA tests. | LLM runtime + prompt registry. |
| Compliance & Review | Legal/compliance review high-risk assets; brand lead approves. | Guardrails run toxicity, claims, IP, accessibility checks; agent summarises diffs. | Policy engine, Langfuse dashboards. |
| Publish & Amplify | Ops schedules posts, emails; loops feedback. | Distribution agent pushes to CMS, ESP, social via APIs; analytics agent logs metrics. | Contentful/Webflow, Braze, Hootsuite, analytics warehouse. |

## Technical Architecture Stack
1. **Workflow & State:** Temporal/Camunda orchestrating tasks, retries, human approvals.  
2. **Knowledge Layer:** Postgres + pgvector / Weaviate storing brand voice, product catalogues, legal policies, prior wins.  
3. **Generation Layer:** Prompt router selecting GPT-5 Omni, Claude 3.5, distilled models; style adapters and retrieval augmentation.  
4. **Guardrails & QA:** Policy engine (Open Policy Agent), redaction services, SEO and accessibility scoring, fact-check agent using retrieval+evaluation.  
5. **Publishing & Analytics:** Connectors to CMS, email, social; engagement stream into Snowflake/BigQuery; Mode/Looker dashboards.  
6. **Observability:** Langfuse traces, Promptfoo regression suite, cost ledger, audit trail storage.

## Data & Models
- Brand voice dataset (approved copy, tone matrices), product knowledge base, campaign performance warehouse.
- Foundation models: GPT-5 Omni for long form, Claude 3.5 Sonnet for analysis, smaller instruct models for ad copy (Llama 3.1, Mixtral).
- Evaluators: Prompthub/Promptfoo graders for tone & factuality, custom cheap classifiers for compliance keywords.

## Implementation Sprints (Agentic Prototyping)
1. **Sprint 0 ? Setup** – Set orchestration repo, connect intake form, seed knowledge base. Run `scripts/check_secrets.py`.  
2. **Sprint 1 ? Retrieval Brain** – Implement ingestion pipelines, embed, store metadata. Validate with `domain-rag` queries.  
3. **Sprint 2 ? Draft Agents** – Build prompt templates, variant generators, add cite/trace logging. Use `05-projects/eval-automation` for regression.  
4. **Sprint 3 ? Review Console** – Ship reviewer UI (diffs, policy status), integrate guardrails + human override logging.  
5. **Sprint 4 ? Distribution & Analytics** – Wire CMS/social/email connectors; stream metrics into analytics dataset, update prompts with feedback loop.  
6. **Sprint 5 ? Scale & Governance** – Automate budgeting, run incident drills, finalise SOPs (see `08-governance/incident-response-checklist.md`).

## Agent Build Instructions
1. Clone repo, open `01-design-patterns/content-generation.md` + `AI CoE Templates/002-pattern-library/.../content` for detailed BOM/architecture.  
2. Scaffold project from `05-projects/creator-evals` + `eval-automation`.  
3. Generate prompts using `prompts/creator/` template; enforce metadata schema defined in templates.  
4. Auto-generate architecture diagram using `scripts/capture-screenshots.mjs` (set storyboard).  
5. Implement regression tests via Promptfoo YAML; ensure offline fallback replaced with live runs once keys set.  
6. Produce delivery bundle: pattern summary, architecture, runbook, evaluation report, retro log.

## Evaluation & Observability
- Promptfoo suite covering tone, factuality, CTA strength.  
- Langfuse telemetry: latency, cost, guardrail hits, review cycles.  
- Weekly retro referencing `creator-analytics-feedback-loop` outputs.

## Governance & Controls
- Map policy requirements using `08-governance/AI-procurement-checklist.md`.  
- Enforce reviewer SLA from `human-review-checklist.md`.  
- Incident procedures per `incident-response-checklist.md`.

## Lab Insights (Sept 2025)
- **OpenAI (GPT-5 Omni multimodal)**: Combine streaming text+vision outputs with structured grounding JSON. Support canvas editing and webhook callbacks so reviewers can accept edits from a live preview.
- **Microsoft Responsible AI**: Apply content safety filters and metadata watermarks for synthetic media; log sign-offs in governance artifacts.
- **Anthropic Constitutional AI**: Re-run constitutional prompts during regression suites; feed violations into `08-governance/human-review-checklist.md` processes.

## Deliverables & Templates
- **Pattern Brief Deck:** adapt from `AI CoE Templates/006-templates`.  
- **BOM & Architecture:** reuse technical architecture docs in `AI CoE Templates/002-pattern-library/.../content-generation` (import sections as needed).  
- **Runbooks:** `15-workflows/retrospective-with-ai.md`, `creator-studio-launch-guide` for storytelling.  
- **Evaluation Package:** JSON/HTML reports, analytics dataset snapshot, reviewer audit log.