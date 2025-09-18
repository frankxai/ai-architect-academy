# 100-Hour AI Architect Plan

Time-boxed to four sprints (~25 hours each) with optional orientation prep. Every week pairs context, guided study, and a tangible artifact.

## Orientation (Week 0, 4h)
- **Setup:** Clone the repo, skim `START-HERE.md`, bookmark the live site, and sync your AI tools.
- **Baseline:** Document current strengths + gaps using `02-learning-paths/self-assessment.md` (create if not already started).
- **Intent:** Capture a one-page learning goal brief; agree with mentor/manager if you have one.

## Week 1 — Retrieval Foundations (26h)
**North star:** Stand up trustworthy retrieval and answer flows.

| Day | Focus | Hands-on Output | Key References |
| --- | --- | --- | --- |
| 1 | Tokenization, embeddings, vector math | Notebook comparing embedding models on sample corpus | `12-concepts/embeddings.md`, `05-projects/vector-search-pgvector.md` |
| 2 | Chunking + hybrid search patterns | Chunk strategy doc with rationale and scoring table | `01-design-patterns/rag-pattern.md`, `07-evaluation/rag-metrics.md` |
| 3 | Build search service (pgvector/Qdrant) | Running index + search API with tests | `06-toolchains/stack-reference.md` |
| 4 | RAG baseline with citations | CLI or notebook app answering top 5 domain questions | `05-projects/rag-on-supabase.md` |
| 5 | Retro + storytelling | 2-page architecture note + loom-style walk-through | `BRAND-VOICE.md`, `09-articles/templates/case-study.md` |

**Assessment checklist**
- Query latency < 1.5s for top 20 questions in sample set.
- Demo recorded and linked in `15-workflows/retrospective-with-ai.md`.
- Risks & next bets logged in your project README.

## Week 2 — Agents, Tooling, and Evaluations (25h)
**North star:** Chain tools together with observability you trust.

| Day | Focus | Hands-on Output | Key References |
| --- | --- | --- | --- |
| 1 | Function calling + tool design | Agent spec describing tasks, tools, guardrails | `01-design-patterns/agent-blueprint.md`, `agentic-swarms/README.md` |
| 2 | LangGraph / orchestration lab | Flow diagram + simulated run traces | `06-toolchains/agentic-swarms-stack.md` |
| 3 | Observability setup (Langfuse, metrics) | Project instrumented with traces + dashboards | `07-evaluation/metrics.md`, `05-projects/evals-langfuse.md` |
| 4 | Eval harness + CI | Promptfoo suite covering faithfulness, toxicity, regression tests | `07-evaluation/eval-harness.md`, `scripts/build-search-index.mjs` |
| 5 | Stakeholder review | Video briefing + doc summarizing metrics, limits, decisions | `15-workflows/ai-briefing.md`, `BRAND-VOICE.md` |

**Assessment checklist**
- At least one automated eval in CI with pass/fail gate.
- Trace screenshot or link captured in project notes.
- Tool catalog + failure modes documented.

## Week 3 — Governance, Cost, and Performance (24h)
**North star:** Ship responsibly and efficiently.

| Day | Focus | Hands-on Output | Key References |
| --- | --- | --- | --- |
| 1 | Privacy & DPIA foundations | DPIA template populated for your project | `08-governance/privacy-gdpr.md`, `08-governance/templates/dpia.md` |
| 2 | Risk + policy guardrails | Guardrail matrix + incident response playbook | `08-governance/model-risk.md`, `16-collaboration/escalation-guide.md` |
| 3 | Cost + latency optimization | Benchmark report comparing caching strategies | `05-projects/vector-search-pgvector.md`, `06-toolchains/cost-controls.md` |
| 4 | Safety validation | Red teaming session recap + mitigations list | `07-evaluation/red-teaming.md`, `15-workflows/risk-review.md` |
| 5 | Governance review | Updated architecture doc w/ SLOs, spend forecast, policy owners | `00-roadmap/ROADMAP.md`, `START-HERE.md` |

**Assessment checklist**
- Signed-off guardrail plan with owner + review cadence.
- End-to-end latency documented pre/post optimization.
- Risk register updated with severity + mitigation status.

## Week 4 — Specialisation and Portfolio (25h)
**North star:** Translate the platform into your context and tell the story.

| Day | Focus | Hands-on Output | Key References |
| --- | --- | --- | --- |
| 1 | Industry research + pattern selection | 1-page landscape brief (problem, stakeholders, data) | `01-design-patterns/industry/`, `11-hyperscalers/` |
| 2 | Domain-tailored prototype | Layer industry data into RAG/agent workflow | `05-projects/` domain-specific guides |
| 3 | Package insights | Portfolio case page + screenshots (see `assets/screenshots/`) | `03-awesome/portfolio-examples.md`, `scripts/capture-screenshots.mjs` |
| 4 | Executive narrative | Slide deck or memo following `BRAND-VOICE.md` guardrails | `09-articles/templates/keynote.md` |
| 5 | Final presentation + retro | Recorded presentation + retro doc with future roadmap | `15-workflows/postmortem.md`, `16-collaboration/working-with-ai.md` |

**Final deliverables**
- Production-ready RAG or agent system with observability and guardrails.
- Eval results + governance pack (DPIA, policy matrix, risk log).
- Story assets: architecture diagram, executive memo, 2-minute demo video.
- Portfolio entry published or queued for publication.

## Sustain & Teach Forward
- Schedule monthly refresh loops: run evals, revisit guardrails, update index.
- Host an internal lunch-and-learn using the poster `assets/ai-architect-education-poster.png` as hook.
- Contribute improvements back via issues or PRs; capture lessons in `09-articles/`.
