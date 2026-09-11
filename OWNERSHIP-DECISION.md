# Ownership decision — ai-architect-academy

Status: decided for the two mechanical questions, **one ruling reserved for Frank**.
Evidence gathered 2026-09-02 by read-only `gh api` and local filesystem checks. No clone, no push.

## The three copies

| | `frankxai/ai-architect-academy` | `AI-Architect-Academy/ai-architect-academy` | `~/ai-architect-academy` |
|---|---|---|---|
| Exists | yes | yes | **no — verified absent 2026-09-02** |
| Visibility | public | private | — |
| Created | 2025-09-01 12:38:54Z | 2025-09-01 13:47:02Z (69 min later) | — |
| Last push | 2026-09-01 23:52:32Z | 2026-08-27 19:36:43Z | — |
| Last *content* commit | 2026-09-01 | **2025-09-17** (`Expand learning paths…`, PR #17) | — |
| Commits since | active | one licensing-only commit in 11 months | — |
| Contributors | frankxai (56), cursoragent (2) | frankxai (33) | — |
| Tracked files | **907** | 164 | — |
| Stars / forks | 2 | 1 | — |
| Default branch | main | main | — |
| License | FSL-1.1-ALv2 | FSL-1.1-ALv2 | — |
| Vercel link | `aiarchitectacademy` (`prj_EhWOyjmGYVOo8Z90tcmgGc1GP5rH`) | none | — |

## Decision

**Canonical: `frankxai/ai-architect-academy`.** It is public, active, 5.5× larger, holds the
labs, the instructor engine, and the only Vercel binding. The org repo forked away on
2025-09-17 and has received no content since — it is a snapshot, not a second line of
development. The manifest's `canonicalRepo` was already correct; this confirms it with evidence
rather than by assertion.

**`AI-Architect-Academy/ai-architect-academy`: archive** (GitHub archive, not delete — the org
namespace stays claimed and the history stays readable).

**`~/ai-architect-academy`: closed.** The path that `~/.claude/CLAUDE.md` says "should be moved
in" no longer exists. Nothing to move. That line in the global instructions and in
`WORKSPACE_MAP.md` is now stale and should be struck for this repo.

## Migration map — exactly 14 files

Tree diff of `main` against `main`. Personal is a strict superset except for these:

**Design patterns (8)** — `01-design-patterns/`: `autonomous-optimization.md`,
`conversational-commerce.md`, `language-understanding.md`, `multicloud-orchestration.md`,
`personalization.md`, `predictive-operations.md`, `rapid-innovation.md`, `synthetic-data.md`

**Templates (4)** — `04-templates/`: `bom-template.md`, `discovery-questions.md`,
`solution-doc.md`, `technical-architecture.md`

**Docs (2)** — `docs/agent-journeys.md`, `docs/seo-strategy.md`

Thirteen have no counterpart anywhere in the personal tree under any path.
`discovery-questions.md` has two same-named files elsewhere and needs a content diff, not a copy.

### The migration is not a straight copy — this is the Frank-only ruling

`bom-template`, `solution-doc`, `technical-architecture`, `discovery-questions` and
`multicloud-orchestration` are presales-shaped artifacts, and they sit in a **private** repo from
the Oracle period. The canonical repo is **public**. `site/scripts/sync-curriculum.mjs` already
strips `/oracle|oci|adk/i` from the published site for exactly this reason, but that filter runs on
titles and paths, not on file bodies, and it does not run on the repository itself.

**Frank must rule, per file, before anything moves:** does this originate from employer work, and
may it be published under FSL-1.1-ALv2? Default in the absence of a ruling is *do not migrate*.
The two `docs/` files and the eight pattern files carry the lowest risk and can move first; the
four `04-templates/` files are held pending that read.

## Licence implications

- Both repos are already FSL-1.1-ALv2 (org aligned 2026-08-27), so migration introduces no licence
  conflict in either direction.
- The org repo has never been public and has one contributor. Archiving it grants nothing to
  anyone and revokes nothing from anyone.
- `LICENSING.md` reserves **curriculum, prompts, datasets and product copy** all-rights. That is
  the correct boundary for the paid cohort: `site/lib/academy-graph/**` (the substrate) ships under
  FSL; the flagship path's teaching content and rubrics are reserved material and are not licensed
  by publishing this repository.
- Versions released before 2026-08-27 under MIT stay MIT. Relicensing forward does not reach back;
  do not claim it does.

## Consequences

- One repository is canonical, and the sentence "ownership is unresolved" leaves the manifest.
- `portfolio-manifest.v1.json` → `founderDecisionQueue[2]` narrows from "rule ownership" to "rule
  publishability of 4 template files".
- The `verdict: "merge"` on this surface is satisfied by archiving the org repo plus the 14-file
  migration, not by a repository merge.
