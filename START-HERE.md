# Start Here — Build Your AI Architect Command Center

You’re here because you want to ship real AI value, guide stakeholders with confidence, and make your work simple to share. This guide orients you across the repo, the live site, and the dashboard so you can get momentum within minutes.

## 1. Choose Your Mission Profile

### Launchpad — First 100 Hours
- Follow the [100-Hour AI Architect Plan](02-learning-paths/100-hour-ai-architect.md) to sprint through retrieval, agents, governance, and storytelling.
- Pair the plan with three anchor projects: [RAG on Supabase](05-projects/rag-on-supabase.md), [Langfuse eval harness](05-projects/evals-langfuse.md), and [Vector search benchmarks](05-projects/vector-search-pgvector.md).

### Creator & Influencer Track
- Use the [Beginner](02-learning-paths/beginner.md) and [Professional](02-learning-paths/professional.md) paths to pace long-form content, workshops, and community sessions.
- Pull examples and citations from [Awesome collections](03-awesome/) and [Articles](09-articles/) to fuel newsletters, talks, and threads.

### Enterprise & AI CoE Leadership
- Run the [Bootcamp](02-learning-paths/bootcamp.md) to align product, platform, risk, and ops teams.
- Combine architecture patterns (`01-design-patterns/`) with the [Governance toolkit](08-governance/) and [Collaboration playbooks](16-collaboration/) for executive visibility.

### Advisors, Clients, Friends & Family
- Share the [Experience guide](docs/experience.html) when introducing the hub to new collaborators.
- Use `04-templates/` to spin up proposals, meeting notes, and recap reports fast.

## 2. Map Your Architecture Playbook
- Start with three core patterns: [Content Generation](01-design-patterns/content-generation.md), [Decision Support](01-design-patterns/decision-support.md), and [Model Lifecycle Management](01-design-patterns/model-lifecycle-management.md).
- Explore the [Concept decks](12-concepts/) for mental models (retrieval, evaluation, observability, safety) you can present to stakeholders.
- Browse [Platforms](docs/platforms.html) and [Cloud blueprints](docs/clouds.html) to match vendor capabilities with your constraints.

## 3. Run Value Loops Fast
- **Discovery + Pattern:** Interview stakeholders using each pattern’s discovery questions; summarise value, architecture, and risks in a one-page brief.
- **Data + Retrieval + Feedback:** Follow [RAG on Supabase](05-projects/rag-on-supabase.md), add reranking from the [Stack reference](06-toolchains/stack-reference.md), and monitor citations + eval metrics.
- **Agents & Automation:** Try [Agentic Code Swarms](agentic-swarms/README.md) for multi-agent experiments and the [Agentic SaaS Planner](05-projects/agentic-saas-planner.md) for product discovery.
- **Evaluation First:** Instrument with [metrics](07-evaluation/metrics.md), [promptfoo harnesses](05-projects/evals-langfuse.md), and the [Retrospective with AI workflow](15-workflows/retrospective-with-ai.md) before you scale access.

## 4. Instrument, Govern, and Operate
- Establish guardrails with [Privacy & GDPR](08-governance/privacy-gdpr.md), [Model Risk](08-governance/model-risk.md), and the [Governance checklists](08-governance/checklists.md).
- Monitor costs, latency, and regressions using [Langfuse traces](05-projects/evals-langfuse.md) plus the Topics deep dives on [observability](docs/topics/observability.html) and [guardrails](docs/topics/guardrails.html).
- Document team rituals with [AI Pair Programming](15-workflows/ai-pair-programming.md), [PR Review with Agents](15-workflows/pr-review-with-agents.md), [AI Briefing](15-workflows/ai-briefing.md), and the [Escalation Guide](16-collaboration/escalation-guide.md).

## 5. Launch the Dashboard & Agents
- Boot the [AI Architect Dashboard](dashboard/README.md) to orchestrate projects with the Vercel AI SDK, React Flow diagrams, and Langfuse-ready observability.
- Connect coding assistants, OpenRouter, or local models by following [`dashboard/AGENT.md`](dashboard/AGENT.md).
- Sync outputs back into the repo: store architecture briefs, eval logs, and visuals alongside the patterns and workflows they support.

## 6. Amplify and Share the Story
- Draft updates using [article outlines](09-articles/) and the [Brand Voice guide](BRAND-VOICE.md) to stay consistent across newsletters, talks, and executive briefings.
- Curate demos with the [Projects catalog](docs/projects.html) and capture new screenshots using `node scripts/capture-screenshots.mjs`.
- Promote trusted resources to your community via the [Resources hub](docs/resources.html) and [Topics quick wins](docs/topics/index.html).

## Clone & Personalise the Repo
1. `git clone https://github.com/frankxai/ai-architect-academy.git`
2. `scripts/serve.sh` → http://localhost:8080 for the live site
3. Update or add SVGs/PNGs under `assets/` and `docs/assets/`
4. Run `npm install` once, then `npm run build:index` whenever you add new content so search stays sharp.
5. Tailor prompts, templates, and workflows inside `prompt-packs/` and `15-workflows/` for your team.

## Keep Exploring
- Tour the full [Experience guide](docs/experience.html) for persona-specific journeys and navigation tips.
- Dive into the [Sitemap](docs/sitemap.xml) or use [Search](docs/search.html) to surface patterns, projects, and governance assets instantly.
- Track platform progress and upcoming drops in the refreshed [Roadmap](00-roadmap/ROADMAP.md).
- Need a quick refresher? Print the [AI Architect poster](assets/ai-architect-education-poster.png) and pin it in your workspace.
