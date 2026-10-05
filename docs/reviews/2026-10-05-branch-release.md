# Connected Academy release — 2026-10-05

Owner: Frank Riemer. Product acceptance: issue #35. Reviewed base:
`2887cc41b3b51e3f5c6aad2b1a5337d92e37c469`. The integration retains every
existing remote branch. Publication must bind the resulting remote commit/tree,
preview, and production deployment separately from local review commits.

The human and agent roads now share the canonical Academy graph. `/start`
introduces both; `/path` renders the nine decisions; `/architectures` selects
cloud boundaries; `/.well-known/academy.json` publishes the public agent contract.
The private artifact body remains hidden. The source register contains metadata
and original reasoning instructions, not ingested books or embeddings.

Claude #34 contributes full modules, instructor roles and labs. Corrections
reject fabricated evidence, undeclared principals, empty revocation paths,
invalid/future dates, duplicate graph/evidence records and unsupported portfolio
grants. Date-only assessments include the named calendar day; timestamps remain
exact. They validate submitted structures, not authenticated learning outcomes.

The licensed-resource adapter performs fresh tenant/product/resource/principal
and sponsor checks and private, bounded retrieval. It fails closed when services
are absent. It does not implement billing, identity or membership truth. Checkout
and licensed delivery remain inactive. See [the connected system contract](../ACADEMY-SYSTEM.md).

## All Academy branches

| Branch | Captured head | Decision |
| --- | --- | --- |
| `agent/claude/academy-depth` | `a95edbbff4f587d26906ade720f9e694b8597d3f` | Integrate #34 with graph/authority corrections |
| `agent/claude/sweep2-acceptance` | `c1a15ae1a341aa0b44b4239f9ea791b832d51c59` | Already superseded: acceptance file is byte-identical to main |
| `agent/codex/product-quality-adoption-20260915` | `179c455d948dc73cd7b5115bbcb4fc6281856cfe` | Integrate additive product acceptance contract |
| `agent/codex/editorial-contract-20260828` | `70d643b2dd4eeaa3e14e4f3ed4d7e5dd93ba9f35` | Preserve/rebase: content roots omit the current site and curriculum |
| `codex/update-ai-architect-curriculum` | `c56f4d2ff9c88dcf9a6d3fdff439fae1592080de` | Preserve: stale commercial claims and replaced workflow changes |
| `copilot/process-prs-and-update-tasks` | `2887cc41b3b51e3f5c6aad2b1a5337d92e37c469` | Identical to main |
| `feature/v3-monorepo-structure` | `e46a7e8a31c18ad2ef8528d725754cf47112cd78` | Preserve: ten commits patch-equivalent; remaining installer has incorrect license and unsupported stable claims |
| `preserve/2026-09-29-main` | `62f6b4b4460d2f075efba2df3c413ae6b16b2b38` | Preserve backup: only unique files are local Claude worktree gitlinks |

## Observed verification

Site types, 58 configured tests and Next.js 16.3.8 production build pass. Vercel's
build command now runs all three gates. The independent source/security review
ran the 11 manifest/access tests and recorded exact file hashes in
[its report](2026-10-05-independent-source-review.md).

Independent curriculum review reproduced eleven graph failures and seven
authority-checker failures before correction. Final graph tests: 30 pass;
authority checker: eight pass. Lab 04 starter: seven fail/one pass, reference:
eight pass. Lab 05 starter: eight fail/four pass, reference: twelve pass. ADR
checker: six pass. The curriculum's 95 relative links resolve. Fixtures do not
call models or cloud APIs. These overlapping test totals are not additive.

Older labs have material limits: Lab 01 has no reference and weak assertions;
Lab 02 has no reference or genuine timeout/retry injection; Lab 03 has no tests
directory or reference. Stages 03/05/06/09 lack substantive Review nodes.
No fixture establishes credential isolation, real revocation, enforced spend
stops, deployed durability or an authenticated certification issuer. Those
requirements remain before paid certification or validated-template claims.

## Interoperability and remaining work

The corrected `frankxai/skills` integration carries #9–#12 (128 local tests),
with permission, MCP auth, stop and eval corrections. Its packaging #7 is held
because declared skill paths and author schema are invalid. The canonical
`frankxai/ai-architect` integration carries guide #8 plus local MCP and deploy-lab
reliability fixes; its guide remains a working draft, not a finished edition.
The connection plugin prepares human/agent entry URLs and local MCP configuration;
it does not install, authenticate or grant private access.

Each repository owns its branch report and source license. The legacy SaaS
surface stays inactive. An actual membership provider, settled billing and
revocation/delegation receipts, reviewer capacity, a finished original paid pack,
and independently observed customer-tenant installs remain activation gates.
Railway marketplace publication and commission attribution also require their
own tested topology, support owner and program eligibility.

Rollback uses the preceding production deployment or a bounded revert. No DNS,
secret, paid cloud infrastructure or data migration is introduced by this release.
