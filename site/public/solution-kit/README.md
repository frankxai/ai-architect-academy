# Customer solution kit

Working reference, prepared 11 October 2026. This is a portable, synthetic R&D portal and diagram compiler. It does not implement the depicted AI workloads, authentication, persistent jobs, or customer tenancy.

Run from the repository root:

```bash
node solution-kit/compile.mjs solution-kit/example.json /tmp/architect-portal
node --test solution-kit/compile.test.mjs
python3 -m http.server 8080 --directory /tmp/architect-portal
```

Open `index.html` directly for offline use, or serve it on localhost. The compiled directory includes a Vercel static configuration and a Railway Docker configuration for **this public demonstration portal only**. Neither deploys the depicted model/data services. Do not put client documents, secrets, private architecture or customer identity in this public export.

The compiler emits HTML, SVG, Mermaid, diagrams.net XML, React Flow JSON, the solution specification and an evidence manifest. Component and relationship IDs travel with each topology export; Mermaid IDs are retained as comments and renderer IDs receive a safe prefix. The JSON specification remains the complete authority. These views do not promise lossless round-trip editing. React Flow JSON uses built-in default nodes; importing it into a React Flow application is an integration task, not a supplied hosted editor. Compilation rejects future source checks, expired source reviews and economics outside the portal's input bounds; refresh sources before rebuilding an expired snapshot.

The SVG embeds official Google Cloud **legacy console** icons acquired from the current official icon library. They are not the newer core-product icon set. Product trademarks and icon rights remain with Google; they are excluded from the repository's Apache grant. No provider logo or icon implies partnership. Non-Google nodes use text badges. See `icon-registry.json` for sources and hashes.

Read [the method](method.md), [the encyclopedia](encyclopedia.md), [partners and inventions](ecosystem.md), and [visual recipes](visual-recipes.md), [the execution sequence](execution-plan.md), and [the source register](sources.json). The specification deliberately keeps maturity, sophistication, and evidence strength separate.

The existing nine-stage architect lifecycle retains its write scope. This compiler is invoked explicitly by a maintainer outside that lifecycle; it does not grant stage agents application writes, cloud credentials or deployment rights. The updated experience-blueprint skill prepares specifications inside `docs/architecture/`.

Highest environment: locally executed compiler and synthetic browser demonstration. Provider deployment, live model evaluation, customer adoption and commercial readiness are separate evidence lanes.
