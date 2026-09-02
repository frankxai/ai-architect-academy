# Content contract — one source, generated views

Binding on every harness that edits this repository. Adopted 2026-09-02.

The repository has 907 tracked files, a README, an `AGENTS.md`, a `CLAUDE.md`, and roughly thirty
top-level strategy markdown files that each describe the academy slightly differently
(`PLATFORM_VISION.md`, `V2_GENIUS_HYBRID.md`, `V3_MARKETPLACE_LAUNCH.md`, `UNIFIED_OFFERING.md`,
`STATUS_AND_STRATEGY.md`, and more). That is how a catalog becomes unsellable: nobody, including the
author, can say what the product is without reading thirty files and picking.

This contract fixes which file wins, for each kind of claim.

## The four sources

| Claim | Single source | Generated views | Generator |
|---|---|---|---|
| **Structure** — what a learner does, in what order, and what proves it | `site/lib/academy-graph/production-agent-systems.ts` (`AcademyGraph.v1`) | the flagship path page, stage pages, the portfolio projection | imported directly; typed, no copy |
| **Inventory** — how much material exists | the repository's own directories | `site/data/curriculum.json` | `site/scripts/sync-curriculum.mjs` |
| **Teaching prose** — patterns, labs, governance | the markdown file at the path a graph node names in `provenance.source` / `repoPath` | links out from the site | none; linked, never duplicated |
| **Commercial state** — stage, gate, price band | `starlight/graph/products.graph.json`, row `ai-architect-academy` | the waitlist copy | read at build time |

Nothing else is a source. Everything else is either a view or is stale.

## Rules

1. **No number is typed by hand.** Counts come from `sync-curriculum.mjs`, which measures
   directories. If a count cannot be produced by a command, it does not appear on a public surface.
2. **No prose is duplicated between a markdown file and the site.** The site links to the file. A
   pattern that needs to be readable on the site gets a node whose `provenance.source` names the
   file — the site renders the link, not a second copy that will drift.
3. **A capability claim requires a graph path.** No public surface may say a learner "will be able
   to X" unless X is a `Competency` node whose `requiredArtifacts`, `requiredEvals` and
   `requiredReviews` are non-empty. `advanceCapability` is the only grant path and it has no
   override.
4. **Visibility is declared on the node, not decided at render time.** `projectPortfolio` filters on
   `publicSafe` and evidence `visibility`. A renderer must never reach past it.
5. **Every node names an owner and a `measuredAt`.** A node whose `measuredAt` is older than its
   source file has drifted and must be re-derived before it is published.
6. **Strategy markdown is not a source.** The ~30 top-level `V2_*`, `V3_*`, `PLATFORM_*`, `STATUS_*`
   files are historical. They may be read for intent. They may not be quoted onto a public surface,
   and no build step may read them.

## Consequence for the strategy files

They should be moved to `archive/` in a single commit, keeping history, so that the repository root
stops presenting eight competing product definitions to the next agent that opens it. That is a
subtraction with no product risk and it is the highest-leverage next commit in this repo — but it
touches files no one else in this run owns, so it is queued rather than done here.

Until that happens, the rule stands: if a claim is not in one of the four sources above, it is not
a claim about the product.

## What breaks this contract

- Adding a curriculum count to a React component as a literal.
- Adding a "you will learn" bullet with no `Competency` behind it.
- Writing a launch date, seat count, or price anywhere while the products row is `UNGATED`.
- A second graph file. `AcademyGraph.v1` is versioned; extend the schema, do not fork it.
