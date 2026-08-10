# AI Architect Academy release foundation receipt

Date: 2026-08-10

Repository: `frankxai/ai-architect-academy` (public template-study and consolidated learning-support repository)

Branch: `agent/codex/release-foundation-20260810`

## Outcome

The repository now has an evidence-led support-history contract covering all nine pull requests merged from 2025-09-04 through 2026-08-10. Each PR appears exactly once in one of six meaningful groups. Every group carries a limitation and uses status `merged`.

The release workflow accepts only annotated `vMAJOR.MINOR.PATCH` tags whose commits are reachable from `origin/main`. It creates a draft GitHub release and never publishes automatically.

## Routing decision

This repository does not receive a public changelog site. The merged consolidation bridge names `https://starlightintelligence.academy/` as the canonical Academy, marks the legacy surface `noindex`, and forbids a duplicate offer. Repository release notes remain a support and maintainer record.

Open PR #16 is not merged, has stale failing checks from 2025-09-18, and is intentionally excluded from the release ledger.

## Live production evidence

- Vercel project `aiarchitectacademy` is connected to `frankxai/ai-architect-academy` with `redirect-bridge` as its recorded root directory.
- Vercel reported production deployment `dpl_DatvXzKVQDfGCMAbGVJpMDEzQErG` for commit `8b216c9` as `READY` on 2026-08-10, with the apex, `www`, and project aliases attached.
- Direct HTTPS headers on 2026-08-10 returned HTTP 200 for both `https://aiarchitectacademy.com/` and `/continue`, with `X-Matched-Path: /` and an aged cached Next.js response. The repository contract requires 308 responses to Starlight Intelligence Academy.
- Subsequent Windows Schannel probes for `www` and the canonical destination were inconclusive because the local security provider failed during TLS initialization.

The READY deployment and alias inventory therefore do not prove the custom-domain route contract. The mismatch requires a human-approved Vercel/domain investigation and a fresh external route receipt.

## Safety and cost decisions

- Existing curriculum, labs, bridge HTML, redirects, headers, media policy, Vercel configuration, and deployment state are unchanged.
- No second indexed Academy, changelog page, weekly schedule, version, tag, GitHub release, merge, production deployment, DNS/domain/alias/TLS mutation, or external send was created.
- The lightweight release contract uses pinned actions, Node 24, no dependency install, run cancellation, and a five-minute cap.
- Portfolio discovery remains centralized in `frankx-domain-command`; quiet weeks produce no repository release.
- Machine preflight admitted one serial interactive workload and paused new swarms. No local build, browser, or additional parallel repo lane was started.

## Evidence gates

- [x] Ledger validator reports six records and nine unique PR receipts.
- [x] Node contract tests pass.
- [x] Redirect bridge tests pass.
- [x] Workflow YAML parses.
- [x] Patch hygiene, language scan, media guard, and staged security scan pass.
- [ ] Draft pull request release-contract checks are inspected remotely.

## Follow-up sequence

1. Review and merge this release foundation.
2. Investigate the Vercel alias/custom-domain mismatch under explicit human approval; do not change DNS or production routing speculatively.
3. After any approved correction, verify apex, `www`, `/continue`, query stripping, `Location`, cache, security, and `X-Robots-Tag` behavior from an external client.
4. Record the redacted route receipt and only then update the ledger's production proof state.
5. Define the initial semantic version against the declared support contract before creating an annotated tag and reviewing the generated draft release.
