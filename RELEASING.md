# Releasing AI Architect Academy support history

`ai-architect-academy` is a template-study and consolidated learning-support repository. Its `redirect-bridge` is intended to move legacy visitors to Starlight Intelligence Academy; it must not become a second marketing funnel, indexed changelog, enrollment surface, or source of competing Academy claims.

## Meaningful-change rule

Create a release candidate only when a coherent curriculum, lab, learning-tool, consolidation, routing, trust, security, or repository-governance contract changes. Do not release quiet weeks, formatting-only edits, raw content refreshes without audience impact, or dependency churn that does not change supported behavior.

Portfolio discovery may run weekly through [`frankx-domain-command` PR #34](https://github.com/frankxai/frankx-domain-command/pull/34), but this repository adds no second schedule. Human review decides whether evidence warrants a release.

## Versioned support contract

Semantic Versioning requires a declared public API. For this repository, that contract includes:

- the Socratic instructor protocol, commands, labs, and learner-facing source structure;
- the redirect bridge's `/` and `/continue` routes, 308 response behavior, canonical destination, query handling, indexing directives, and security headers;
- the machine-readable support-history schema and its exact merged-PR coverage;
- the human authority boundary for domains, DNS, aliases, TLS, production promotion, and release publication.

Choose versions from changes to that contract:

- `PATCH`: compatible curriculum correction, evidence clarification, test improvement, or security hardening.
- `MINOR`: compatible lab, command, learning module, ledger field, or redirect capability.
- `MAJOR`: intentional incompatible change to learner commands, lab structure, route semantics, canonical destination, schemas, or authority boundaries.

Do not infer the initial version from package files, dates, commits, screenshots, or deployment IDs. Document the first-version rationale against the declared support contract before tagging.

## Release procedure

1. Update [`docs/releases/release-ledger.json`](docs/releases/release-ledger.json) and `CHANGELOG.md` with merged PR receipts, dated observations, and limitations.
2. Run `node .github/scripts/validate-release-ledger.mjs` and `node --test .github/scripts/release-ledger.test.mjs`.
3. Run `npm test --prefix redirect-bridge` when the bridge, canonical destination, headers, or route claims change.
4. Open or update a draft PR and let the lightweight `Release contract` and trusted `Media Guard` workflows pass.
5. For bridge or domain-affecting work, inspect one exact-head Vercel preview and verify desktop, mobile, keyboard, reflow, reduced motion, canonical metadata, noindex headers, and both redirect routes.
6. Merge through normal review. Do not tag an unmerged branch.
7. From reviewed `main`, create an annotated semantic-version tag: `git tag -a vX.Y.Z -m "AI Architect Academy vX.Y.Z"`.
8. Push the exact tag. The workflow verifies that it is annotated and reachable from `origin/main`, then creates a GitHub release as a draft.
9. Review generated notes, remove private or irrelevant material, state the consolidation and production limitations, and publish only with maintainer approval.
10. After an explicitly approved production or domain action, verify `aiarchitectacademy.com/`, `/continue`, and the `www` host against the exact 308, destination, query, cache, security, and indexing contract.

## Draft and cost controls

- Tag pushes never publish automatically.
- Generated notes use `.github/release.yml` categories and receive human review.
- Release validation installs no dependencies and is capped at five minutes.
- Superseded workflow runs are cancelled.
- No duplicate weekly schedule is added; portfolio radar owns discovery.
- Domain, DNS, alias, TLS, production, and public-release actions remain human-gated.

## Public changelog and SEO boundary

The legacy bridge remains `noindex` and points to `https://starlightintelligence.academy/`. Do not create structured editorial pages, duplicate Academy offers, or an indexed `/changelog` here. Customer-facing Academy progress belongs on the canonical Academy; repository release notes remain an operator and contributor record.

As of 2026-08-10, Vercel reported a READY production deployment for commit `8b216c9`, but direct HTTPS checks returned the legacy 200 Next.js page for both `/` and `/continue`. Treat that as an unresolved production-contract mismatch until an approved action is followed by a fresh route receipt.

## Primary-source basis

- [GitHub generated release notes](https://docs.github.com/en/repositories/releasing-projects-on-github/automatically-generated-release-notes) support categorized notes and require review of generated contents.
- [GitHub releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases) are tag-based records and support draft review before publication.
- [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html) requires a declared public API and immutable released contents.
