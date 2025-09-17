# Brand Voice & Experience Playbook

## Purpose
Create a confident, generous, and precise hub for AI architects, founders, creators, and advisors. Every artifact should make it easy to take action, explain value to others, and showcase progress.

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

## Content Pillars
- **Design & Value Framing** — Patterns, concepts, discovery questions. Sources: `01-design-patterns/`, `12-concepts/`.
- **Build & Ship** — Projects, toolchains, agent workflows. Sources: `05-projects/`, `06-toolchains/`, `agentic-swarms/`.
- **Operate & Govern** — Evaluation metrics, guardrails, observability, workflows. Sources: `07-evaluation/`, `08-governance/`, `15-workflows/`.
- **Amplify & Share** — Articles, resources, collaboration guides. Sources: `09-articles/`, `10-resources/`, `16-collaboration/`.

## SEO & Discoverability Anchors
- Primary keywords: *AI architect playbook, AI architecture patterns, enterprise RAG guide, LLM evaluation workflows, AI governance checklist, agentic AI projects.*
- Supporting keywords: *AI observability, AI CoE bootcamp, prompt engineering templates, AI governance templates, RAG architecture blueprint.*
- Implementation tips:
  - Use keyword-rich headings in README, Start Here, and docs landing pages.
  - Link out to authoritative repos (LangChain, Langfuse, Hugging Face) with a clear “why it matters” statement.
  - Keep `docs/sitemap.xml` updated whenever new pages ship.
  - Regenerate the search index after each content pass: `npm run build:index`.

## Experience Design Checklist
- Navigation references the Experience hub, Start Here, Projects, Patterns, Platforms, Resources, Topics, and Collaborate.
- Each landing page opens with a hero statement, supporting copy, and two clear calls-to-action.
- Embed visuals from `assets/` or `docs/assets/` to break up long text. Prefer SVG for crisp scaling.
- Include a “Clone or Download” CTA on core pages to remind visitors there is a full repo behind the site.
- Cross-link adjacent modules (e.g., Patterns → Projects → Evaluations) within the first screenful.

## Editorial Workflow
1. Draft in Markdown inside the relevant directory.
2. Validate tone against this document before opening a PR.
3. Run `npm run build:index` to keep search current.
4. Update `docs/sitemap.xml` if you add new pages.
5. Capture refreshed screenshots with `npm run screenshots` when UI changes.

## Design System Notes
- **Colors:** Lean on cyan (#06b6d4) for calls-to-action, slate backgrounds for depth, and purple accents for experience highlights.
- **Typography:** Use Tailwind defaults (Inter-style sans-serif). Maintain generous line spacing for readability.
- **Components:** Card grids, callout boxes, and infographic-style SVGs. Keep padding consistent (1rem–1.5rem) and corners rounded.

## Success Signals
- New visitors can explain “what this is” within 30 seconds.
- Returning users know exactly where to go next (Start Here, Experience, or Projects).
- Contributors reference this playbook in PR descriptions to show alignment.
- Search queries such as “AI architect roadmap” and “LLM evaluation workflow” land on relevant sections of the site.
