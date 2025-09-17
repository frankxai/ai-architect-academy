# Start Here — Build Your AI Architect Command Center

You’re here because you want to ship real AI value, guide stakeholders with confidence, and make your work easy to share. This quick guide orients you to the full experience so you can get momentum within minutes.

## 1. Choose Your Mission Profile

### Launchpad — First 100 Hours
- Follow the [100-Hour AI Architect plan](02-learning-paths/100-hour-ai-architect.md) to sprint through foundations, shipping, and storytelling.
- Pair the plan with three anchor projects: [RAG on Supabase](05-projects/rag-on-supabase.md), [Langfuse evals](05-projects/evals-langfuse.md), and [Vector search benchmarks](05-projects/vector-search-pgvector.md).

### Creator & Influencer Track
- Use the [Beginner](02-learning-paths/beginner.md) and [Professional](02-learning-paths/professional.md) paths to pace long-form content, workshops, and community sessions.
- Pull examples and citations from the [Awesome collections](03-awesome/) and [Articles](09-articles/) folders.

### Enterprise & AI CoE Leadership
- Run the [Bootcamp](02-learning-paths/bootcamp.md) to align product, platform, risk, and ops teams.
- Combine architecture patterns (`01-design-patterns/`) with the [Governance toolkit](08-governance/) and [Collaboration playbooks](16-collaboration/) for executive visibility.

### Advisors, Clients, Friends & Family
- Share the [Experience page](docs/experience.html) when introducing the hub to new collaborators.
- Use `04-templates/` to spin up proposals, meeting notes, and recap reports fast.

## 2. Map Your Architecture Playbook
- Start with three core patterns: [Content Generation](01-design-patterns/content-generation.md), [Decision Support](01-design-patterns/decision-support.md), and [Model Lifecycle Management](01-design-patterns/model-lifecycle-management.md).
- Explore the [Concept decks](12-concepts/) for mental models (retrieval, evaluation, observability, safety) you can present to stakeholders.
- Browse [Platforms](docs/platforms.html) and [Cloud blueprints](docs/clouds.html) to match vendor capabilities with your constraints.

## 3. Build Value Loops
Focus on tight feedback loops that demonstrate value quickly:
- **Discovery → Pattern:** Interview stakeholders using the discovery questions in each pattern; summarise risks and value as a one-page brief.
- **Data → Retrieval → Feedback:** Follow [RAG on Supabase](05-projects/rag-on-supabase.md), add reranking from the [Toolchains reference](06-toolchains/stack-reference.md), and monitor citations.
- **Agents & Automation:** Use [Agentic Code Swarms](agentic-swarms/README.md) for multi-agent experiments, or the [Agentic SaaS Planner](05-projects/agentic-saas-planner.md) for product discovery.
- **Evaluation First:** Instrument with [metrics](07-evaluation/metrics.md), [promptfoo harnesses](05-projects/evals-langfuse.md), and [observability workflows](15-workflows/observability-playbook.md) before scaling access.

## 4. Instrument, Govern, and Operate
- Establish guardrails with [Privacy & GDPR](08-governance/privacy-gdpr.md), [Model Risk](08-governance/model-risk.md), and the [Governance checklists](08-governance/checklists.md).
- Monitor costs, latency, and regressions using [Langfuse traces](05-projects/evals-langfuse.md) plus the [Topics](docs/topics/index.html) deep dives on observability and guardrails.
- Document team rituals with [Pairing workflows](15-workflows/pairing.md), [PR review guides](15-workflows/pr-review.md), and the [AI collaboration playbook](16-collaboration/working-with-ai.md).

## 5. Amplify and Share the Story
- Draft updates using [article outlines](09-articles/) and the [Brand Voice guide](BRAND-VOICE.md) to stay consistent across newsletters, talks, and executive briefings.
- Curate demos with the [Projects catalog](docs/projects.html) and capture new screenshots using `node scripts/capture-screenshots.mjs`.
- Promote trusted resources to your community via the [Resources hub](docs/resources.html) and [Topics quick wins](docs/topics/index.html).

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
