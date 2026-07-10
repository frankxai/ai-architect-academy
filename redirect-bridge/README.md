# AI Architect Academy consolidation bridge

## Outcome contract

- Audience: visitors arriving through the legacy `aiarchitectacademy.com` address.
- Surface: one-screen transition page plus an explicit permanent continuation route.
- First read: this address is consolidating into the canonical Starlight Intelligence Academy.
- Primary action: continue to `https://starlightintelligence.academy/`.
- Evidence: the canonical destination is named and linked directly; no separate product, enrollment,
  outcome, pricing, or capacity claim is made.
- Failure modes: duplicate academy positioning, a nonexistent `/architect` route, silent forwarding,
  invented proof, auto-playing media, decorative motion, or indexable duplicate content.
- Acceptance gate: exact canonical/redirect/robots/security tests, desktop and mobile inspection,
  keyboard/focus inspection, 200% reflow, reduced-motion inspection, and one Vercel preview.

## Scene brief

The bridge is a restrained Starlight transition surface, not a new funnel. The dominant scene is a
single editorial relocation message set against a quiet operational grid. Typography and negative
space carry the hierarchy. The only primary control continues to the canonical Academy. There is no
auto-forward timer, motion runtime, third-party media, tracking, form, or second offer.

## Asset decision

Tier C system-authored interface. The exact destination, canonical metadata, status, and accessible
control are the artifact; decorative media would dilute trust and is intentionally excluded.

## Release boundary

This directory is deployable independently as a static Vercel project root. The one manual release
to the previously empty `aiarchitectacademy` project unexpectedly received Vercel's `production`
target even though the command did not include `--prod`; no custom domain was attached. Domain,
DNS/TLS, rollback, merge, and Git project integration actions remain human-gated.

## Local verification

```powershell
npm test
```
