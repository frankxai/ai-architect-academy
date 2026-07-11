# AI Architect Academy Vercel release mapping

Recorded: 2026-07-11

## Canonical mapping

- Existing Vercel project: `aiarchitectacademy`
- Project ID: `prj_EhWOyjmGYVOo8Z90tcmgGc1GP5rH`
- Canonical GitHub repository: `frankxai/ai-architect-academy`
- GitHub repository ID: `1048431746`
- Production branch: `main`
- Vercel root directory: `redirect-bridge`

The same Vercel project was reconnected from the empty private
`frankxai/aiarchitectacademy` repository. A team-wide read-only inventory found no other Vercel
project connected to the canonical repository.

## Release boundary

PR #18 is the source of the consolidation bridge. Its preview must prove the exact bridge root,
permanent `/continue` redirect, noindex directives, security headers, desktop/mobile/reflow behavior,
and reduced-motion behavior before merge.

The protected pre-mapping production deployment remains
`dpl_8TecTe1qJu4ecmxTyT9PyWiVUasE` as the rollback reference. This release does not attach
`aiarchitectacademy.com` and does not change IONOS, DNS, nameservers, or TLS.

## Promotion contract

1. One native Git preview for the final PR head.
2. Local bridge, workflow, link, security, and build gates pass.
3. Ready-state reviews reach a terminal state with actionable findings repaired.
4. Squash merge to `main` creates one native production deployment on the existing project.
5. Verify the production Vercel URL while leaving the custom domain untouched.
