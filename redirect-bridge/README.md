# AI Architect Academy consolidation bridge

## Runtime contract

- Audience: visitors arriving through a legacy AI Architect Academy address.
- Active routes: `/` and `/continue` return one-hop HTTP 308 redirects to the exact configured
  Academy destination without forwarding query parameters.
- Indexing: content and error responses remain `noindex, follow, noarchive`; `robots.txt` allows
  crawlers to observe that directive. Redirect responses carry no indexable document.
- Trust boundary: the bridge contains no separate enrollment, pricing, certification, capacity, or
  outcome claim.
- Fallback artifact: `index.html` is the inspected transition-page fallback. The current root
  redirect bypasses it; it must not be described as the live root experience.

## Authority boundary

The checked-in bridge records the last reviewed routing contract. It does not decide whether AI
Architect Academy remains independent, which public domain is canonical, or whether the bridge
should continue to exist. Those are portfolio decisions tracked in GitHub issue #27.

Do not infer public health from a READY deployment or from a working `vercel.app` alias. DNS, apex
and `www` bindings, TLS, deployment protection, the canonical destination, production promotion,
and rollback remain human-gated.

## Failure modes

- a redirect destination that differs between apex, `www`, and `/continue`;
- query strings leaking into the destination;
- a protected or unreachable public origin presented as launched;
- an indexable duplicate Academy surface;
- a READY Vercel deployment reported as proof of public-domain health;
- a code change that silently makes the strategic domain decision.

## Local contract verification

The static suite validates canonical metadata, redirects, query handling, robots, security headers,
accessibility safeguards, and the public-smoke verifier itself.

```sh
npm test
```

After the responsible human ratifies and applies a domain decision, run the public verifier once for
the apex and once for `www`. Both arguments are mandatory so the repository cannot silently choose
the source or destination.

```sh
npm run smoke -- \
  --origin https://legacy.example/ \
  --destination https://academy.example/
```

The command fails closed on authentication, non-HTTPS origins, wrong status codes, redirect chains,
query leakage, missing transport security, missing security/noindex headers on content responses, an
incorrect `robots.txt`, or a missing 404. Vercel evaluates redirect rules before response-header
rules, so a redirect is checked for HSTS and exact routing rather than document-only headers. The
JSON output is the route receipt; Vercel deployment metadata must separately prove the deployment ID
and Git SHA bound to the approved public alias.

## Scene brief

The fallback is a restrained transition surface, not a funnel. Typography and negative space carry
the hierarchy. There is no auto-forward timer, motion runtime, third-party media, tracking, form, or
second offer.

## Asset decision

Tier C system-authored interface. Decorative media would dilute the routing signal and is
intentionally excluded.
