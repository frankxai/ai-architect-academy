# Brand Voice & Experience Playbook

## Purpose
Create a confident, generous, and precise hub for AI architects, founders, creators, and advisors. Every artifact should make it easy to take action, explain value to others, and showcase progress. Assume humans and AI agents are co-reading every page.

## Core Personas
| Persona | What They Need | Key Assets |
| --- | --- | --- |
| **AI Architect / Tech Lead** | Patterns, evals, toolchains, ops rituals | `01-design-patterns/`, `05-projects/`, `07-evaluation/`, `15-workflows/` |
| **Executive & AI CoE Leader** | Narrative, governance, roadmap, enablement | `00-roadmap/`, `08-governance/`, `docs/experience.html`, `16-collaboration/` |
| **Creator / Influencer** | Story hooks, curated references, templates | `02-learning-paths/`, `03-awesome/`, `09-articles/`, `prompt-packs/` |
| **Friends, Family, High-Value Clients** | A clear welcome, proof of momentum, next steps | `README.md`, `START-HERE.md`, `docs/experience.html`, `docs/projects.html` |

## Voice Principles
1. **Clarity first.** Use direct, active language. Remove filler and hype. Every paragraph answers “why it matters.”
2. **Expert warmth.** Sound like the trusted architect who has been in the trenches and genuinely wants others to win.
3. **Action-ready.** Close with a verb. Point to a file, command, or template people can use immediately.
4. **Truthful momentum.** Celebrate what exists, note what is in-flight, and never over-claim.
5. **Agent-inclusive.** Write headings and CTAs so AI copilots can guide humans accurately.

## Message Architecture
| Layer | Description | Prompts & Examples |
| --- | --- | --- |
| **Core Promise** | “This is your command center to design, ship, and share AI systems responsibly.” | “Lead the conversations, ship the systems, and operate responsibly.” |
| **Supporting Pillars** | Pattern-first design, evaluation-first operations, brand storytelling, collaborative rituals. | “Pattern → Project → Evaluation → Story is our cadence.” |
| **Proof Points** | Patterns, projects, governance, resources, collaboration assets, roadmap transparency. | “Start with Content Generation, Decision Support, and Model Lifecycle Management.” |
| **Call-to-Action** | Clone, explore, brief teammates, publish updates. | “Run `npm run build:index` after every content pass.” |

## Story Arcs to Reuse
- **Launch the hub.** “Share the Experience page, point to persona tracks, then invite collaborators into projects and workflows.”
- **Ship a loop.** “Pick a pattern, run a project, instrument evaluation, publish the story, and feed insights back.”
- **Govern with confidence.** “Baseline privacy and model risk, wire observability, use collaboration rituals to keep humans in the loop.”
- **Teach with generosity.** “Explain the concept, reference the repo asset, then offer a next action.”

## SEO & Discoverability Anchors
- **Primary keywords:** *AI architect playbook, AI architecture patterns, enterprise RAG guide, LLM evaluation workflows, AI governance checklist, agentic AI projects.*
- **Supporting keywords:** *AI observability, AI CoE bootcamp, prompt engineering templates, AI governance templates, RAG architecture blueprint.*
- **Implementation checklist:**
  - Use keyword-rich headings in README, Start Here, Experience, and docs landing pages.
  - Link out to authoritative repos (LangChain, Langfuse, Hugging Face) with a clear “why it matters.”
  - Keep `docs/sitemap.xml` updated whenever new pages ship.
  - Regenerate the search index after each content pass: `npm run build:index`.

## Experience Design Checklist
- Navigation references the Experience hub, Start Here, Projects, Patterns, Platforms, Resources, Topics, and Collaborate.
- Each landing page opens with a hero statement, supporting copy, and two clear calls-to-action.
- Embed visuals from `assets/` or `docs/assets/` to break up long text. Prefer SVG for crisp scaling.
- Include a “Clone or Download” CTA on core pages to remind visitors there is a full repo behind the site.
- Cross-link adjacent modules (Patterns → Projects → Evaluations) within the first screenful.
- Provide at least one instruction for AI agents (search index, sitemap, command) when relevant.

## Editorial Workflow
1. Draft in Markdown inside the relevant directory.
2. Validate tone against this document before opening a PR.
3. Run `npm run build:index` to keep search current.
4. Update `docs/sitemap.xml` if you add new pages.
5. Capture refreshed screenshots with `npm run screenshots` when UI changes.
6. Note roadmap impacts in `00-roadmap/ROADMAP.md` so stakeholders see progress.

## Design System Notes
- **Colors:** Lean on cyan (#06b6d4) for calls-to-action, slate backgrounds for depth, and purple accents for experience highlights.
- **Typography:** Use Tailwind defaults (Inter-style sans-serif). Maintain generous line spacing for readability.
- **Components:** Card grids, callout boxes, infographic-style SVGs. Keep padding consistent (1rem–1.5rem) and corners rounded.
- **Iconography:** Prefer simple line or duotone icons that convey motion, insight, or collaboration.

## Success Signals
- New visitors can explain “what this is” within 30 seconds.
- Returning users know exactly where to go next (Start Here, Experience, or Projects).
- Contributors reference this playbook in PR descriptions to show alignment.
- Search queries such as “AI architect roadmap” and “LLM evaluation workflow” land on relevant sections of the site.
- Internal or external AI agents can answer “where do I find X?” by scanning README, Start Here, and the sitemap.

## Voice Guardrails (Do / Avoid)
| Do | Avoid |
| --- | --- |
| Use verbs like *ship, frame, align, amplify.* | Generic hype ("revolutionary", "game-changing") without proof. |
| Cite specific folders or commands. | Vague references like “check the repo” with no link. |
| Reference personas directly (“Architects, creators, leaders”). | Writing as if only engineers are reading. |
| Mention active loops and next actions. | Ending sections without a suggested next move. |
