# Start Here — Spin Up Your AI Architect Command Center

You arrived because you want to ship real AI value, brief stakeholders with authority, and keep a living record of progress. This quickstart shows how to unlock momentum for yourself, your collaborators, and any Codex-style agents you invite into the workspace.

## Orientation Pulse (5 Minutes)
- **Scan the [Experience Hub](docs/experience.html).** Note the hero CTA, persona lanes, and cloning checklist.
- **Bookmark your launchpad.** Pick the program below that matches your mission and share the link with anyone joining you.
- **Prime your AI copilots.** Drop `README.md`, `START-HERE.md`, and `docs/sitemap.xml` into your agent context so it can act as concierge.

## 1. Choose Your Mission Profile

| Persona | Highlights | Run This Playlist |
| --- | --- | --- |
| **Launchpad — First 100 Hours** | Get oriented fast, ship two proof points, document the wins. | [100-Hour AI Architect plan](02-learning-paths/100-hour-ai-architect.md) + [RAG on Supabase](05-projects/rag-on-supabase.md) + [Langfuse evals](05-projects/evals-langfuse.md). |
| **Creator & Influencer Track** | Translate builds into content, workshops, and community activations. | [Beginner path](02-learning-paths/beginner.md), [Professional path](02-learning-paths/professional.md), plus [article outlines](09-articles/). |
| **Enterprise & AI CoE Leadership** | Align product, platform, governance, and enablement around one story. | [Bootcamp](02-learning-paths/bootcamp.md), [Governance toolkit](08-governance/), [Collaboration rituals](16-collaboration/). |
| **Advisors, Clients, Friends & Family** | Offer a guided tour, show proof, outline next steps. | [Experience page](docs/experience.html), [Projects catalog](docs/projects.html), [Templates](04-templates/). |

## 2. Map Your Architecture Playbook
- **Patterns:** Start with [Content Generation](01-design-patterns/content-generation.md), [Decision Support](01-design-patterns/decision-support.md), and [Model Lifecycle Management](01-design-patterns/model-lifecycle-management.md) to frame value and risks.
- **Concept decks:** Use `12-concepts/` for quick explainers on retrieval, evaluation, observability, and safety.
- **Platform choices:** Compare hyperscalers and vertical tools with the [Cloud blueprints](docs/clouds.html) and [Platform matrix](docs/platforms.html).

## 3. Build Signature Value Loops
- **Discovery → Pattern:** Interview stakeholders with the pattern discovery questions. Summarise the opportunity + risk as a one-page brief.
- **Data → Retrieval → Feedback:** Follow [RAG on Supabase](05-projects/rag-on-supabase.md), add reranking from the [Toolchains reference](06-toolchains/stack-reference.md), monitor citations and costs.
- **Agents & Automation:** Use [Agentic Code Swarms](agentic-swarms/README.md) to orchestrate multi-agent experiments, or the [Agentic SaaS Planner](05-projects/agentic-saas-planner.md) to storyboard a product.
- **Evaluation First:** Instrument with [metrics](07-evaluation/metrics.md), [promptfoo harnesses](05-projects/evals-langfuse.md), and [observability workflows](15-workflows/observability-playbook.md) before scaling access.

## 4. Instrument, Govern, and Operate
- **Guardrails:** Deploy [Privacy & GDPR](08-governance/privacy-gdpr.md), [Model Risk](08-governance/model-risk.md), and [Governance checklists](08-governance/checklists.md) as baseline controls.
- **Observability:** Track costs, latency, and regressions using [Langfuse traces](05-projects/evals-langfuse.md) and the [observability topic](docs/topics/observability.html).
- **Team rituals:** Document pairing habits with [Pairing workflows](15-workflows/pairing.md), [PR review guides](15-workflows/pr-review.md), and the [AI collaboration playbook](16-collaboration/working-with-ai.md).

## 5. Amplify and Share the Story
- Draft updates using [article outlines](09-articles/) and the [Brand Voice guide](BRAND-VOICE.md) to stay consistent across newsletters, talks, and executive briefings.
- Curate demos in the [Projects catalog](docs/projects.html) and capture screenshots using `node scripts/capture-screenshots.mjs`.
- Promote trusted resources via the [Resources hub](docs/resources.html) and [Topics quick wins](docs/topics/index.html).

## 6. Calibrate Your AI Agents
Give your Codex-style assistant the same map you use:
- **System prompt:** Emphasise the voice traits from [BRAND-VOICE.md](BRAND-VOICE.md)—clarity, expert warmth, action-ready.
- **Context pack:** Provide the [Experience hub](docs/experience.html), [Roadmap](00-roadmap/ROADMAP.md), and [search index](docs/data/search-index.json) for retrieval.
- **Actions:** Allow it to run `npm run build:index`, surface directory recommendations, and draft updates that cite relevant Markdown.

## Clone & Personalise the Repo
1. `git clone https://github.com/AI-Architect-Academy/ai-architect-academy.git`
2. `scripts/serve.sh` to explore the site locally at http://localhost:8080
3. Update or add SVGs/PNGs under `assets/` and `docs/assets/`
4. Run `npm install` once, then `npm run build:index` whenever you add new content so search stays sharp.
5. Tailor prompts, templates, and workflows inside `prompt-packs/` and `15-workflows/` for your team.

## Keep Exploring
- Tour the full [Experience guide](docs/experience.html) for persona-specific journeys and navigation tips.
- Dive into the [Sitemap](docs/sitemap.xml) or use [Search](docs/search.html) to surface patterns, projects, and governance assets instantly.
- Track platform progress and upcoming drops in the refreshed [Roadmap](00-roadmap/ROADMAP.md).
