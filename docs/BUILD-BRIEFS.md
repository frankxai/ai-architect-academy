# Build briefs — AI Architect Academy, team, CoE

Hand one brief to one agent. One brief = one branch `agent/<harness>/<scope>` = one PR. Each brief
names its repo, its done-when, and the human gates it must stop at. Written 2026-09-11 after the
domain was found redirecting to Starlight Intelligence Academy (another brand).

The system these briefs build, in one line per layer:

| Layer | Repo | Job | Price stance |
|---|---|---|---|
| Learn | `frankxai/ai-architect-academy` → aiarchitectacademy.com | judgement: which decision first, what it costs to be wrong | waitlist (UNGATED) |
| Do | `frankxai/ai-architect` (plugin, Apache-2.0) | the nine-stage gated team that runs the sequence in the user's repo | free, forever |
| Equip | `frankxai/skills` (MIT, skills.sh) | architect skills: MCP, orchestration, routing, context | free, forever |
| Govern | `frankxai/ai-coe` | the organisation around the team: intake, review, trust tiers, weekly loop | free reference; paid kit later |

Funnel: free plugin/skills/ADR (value with no form) → waitlist with three questions (price band,
role, reason) → cohort when 100 → CoE kit for teams that finished the cohort. Starlight
Intelligence Academy is a different brand; do not link between them.

Standing rules for every brief: read `AGENTS.md` and `CONTENT-CONTRACT.md` first; no number typed by
hand; no price, date, seat count or countdown while `products.graph.json` says UNGATED; no employer,
vendor or customer detail on any public surface; maker and checker are different models.

---

## B1 — Verify the cutover and retire the bridge

**Repo** `frankxai/ai-architect-academy` · **Starts after** Frank sets Vercel Root Directory to `site`
and connects the waitlist store.

Prompt:
> Verify aiarchitectacademy.com against every "Done when" line of issue #27. For apex and www: `curl -sI`
> must return 200 with an `x-vercel-id` header and no redirect; the body must contain the waitlist.
> POST a test signup only to a preview deployment, never production. Record the production deployment
> ID and Git SHA the domain binds to. Then open one PR that deletes `redirect-bridge/` and
> `.github/workflows/academy-domain-contract.yml`, updates `portfolio-manifest.v1.json` row
> `aiarchitectacademy` to `liveStatus: live` with the receipts, and closes #27, #28 and #29 with a
> link to the receipts. Do not touch DNS or Vercel settings.

Done when: receipts attached to #27, bridge removed, manifest row updated.

## B2 — Make the plugin repo point home

**Repo** `frankxai/ai-architect`

Prompt:
> The repository description reads "MOVED → oci-ai-architects/multi-cloud-ai-architect", which is
> false: this repo is the live plugin (v0.1.3) and the org repo is a January snapshot of a different
> project. Prepare, but do not run, `gh repo edit frankxai/ai-architect --description "…"
> --homepage https://www.frankx.ai/ai-architect` and put it in the PR body for Frank. In the README,
> add one line under the intro linking aiarchitectacademy.com as the place the judgement is taught.
> The README footer says "MIT" but LICENSE and LICENSING.md are Apache-2.0: fix the footer. Keep the
> Apache-2.0 / FSL split explicit.

Human gate: the description edit is a public change; Frank runs it.

## B3 — A worked run as the second gift

**Repo** `frankxai/ai-architect-academy` (site) + a new public sample repo only if Frank approves one.

Prompt:
> Run `/architect` end to end against a small public sample system (a RAG support bot is enough) in a
> throwaway repo. Keep every file it writes under `docs/architecture/`. Then publish that artifact set
> on the site at `/worked-run` as the second free gift: "this is what the team leaves in your repo".
> Every file shown is the unedited output plus a one-line annotation by a human reviewer. If a gate
> went red, show it red. Add a `Competency` node to `AcademyGraph.v1` only for what the run actually
> evidences.

Done when: `/worked-run` renders the real artifacts; `pnpm test` and `pnpm build` pass.

## B4 — Founder team kits in the CoE

**Repo** `frankxai/ai-coe`

Prompt:
> `templates/company-of-one`, `ai-agency`, `engineering-team`, `creator-business` and `university-lab`
> are READMEs. Turn exactly one — `company-of-one` — into an installable kit: the agent roster it runs
> (point at the plugin's team, do not copy it), which skills it installs, which of the six CoE loops it
> runs weekly and who approves each, and the trust tier of every tool. Prove it with one real weekly
> loop run recorded in the kit. Only after that is reviewed, repeat for the next template. Do not
> rebuild the hollow `skills/` or `apps/` directories that were removed in 2026-08.

Done when: one kit a founder can adopt in an afternoon, with a recorded run.

## B5 — The demand loop

**Repo** `starlight` (loop contract) · reads `packages/demand-capture/report.mjs`

Prompt:
> Design, with the loop-designer skill, a weekly loop that reads the `ai-architect-academy` waitlist
> signals, reports count, price-band distribution, roles and stated reasons, and proposes exactly one
> next build from them. Maker and verifier are different models. It never emails the list, never
> publishes a count below 100, and never schedules a cohort: at 100 it opens a decision for Frank.

Done when: the loop contract exists and one dry run against an empty store reports honestly.

## B6 — Content engine into the funnel

**Repo** `frankxai/frankx.ai-vercel-website`

Prompt:
> For each of the six decisions on aiarchitectacademy.com, draft one FrankX article that works one
> real decision in the open, ending with two links: the free ADR and the waitlist. Claims-audit every
> article before merge (numbers, benchmarks, customer stories must be sourced or cut). No vendor or
> employer detail. One article per PR.

Done when: first article merged after an independent claims audit.
