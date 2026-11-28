export const dynamic = 'force-static'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aiarchitectacademy.com'

const AGENTS_MD = `# AI Architect Academy — Agent Surface Guide (AX)

> Site: **AI Architect Academy** (\`${SITE}\`)
> Scope: Open curriculum, worked Architecture Decision Records (ADRs), teaching rooms, and studio patterns for engineers building production AI systems. Waitlist-first: no checkout, price, or cohort date yet.

## Canonical discovery endpoints

- [\`/llms.txt\`](${SITE}/llms.txt) — Structured curriculum stages, repository inventory, and agent team install commands.
- [\`/.well-known/academy.json\`](${SITE}/.well-known/academy.json) — Graph-derived stages, evaluation assertions, and commercial availability manifest.
- [\`/.well-known/agent.json\`](${SITE}/.well-known/agent.json) — Structured discovery descriptor (\`starlight.agent.v1\`).

## Public human & agent surfaces

- [\`/start\`](${SITE}/start) — Choose human or agent entry into the curriculum and artifact contracts.
- [\`/adr\`](${SITE}/adr) — Worked AI system Architecture Decision Record and reusable blank template.
- [\`/worked-run\`](${SITE}/worked-run) — Labelled fixture trace of one agent-team run, failed gates, and verifier receipt.
- [\`/curriculum\`](${SITE}/curriculum) — Patterns, labs, and modules linked directly to source files.
- [\`/library\`](${SITE}/library) — Architecture encyclopedia and synthetic reference exports.
- [\`/studio\`](${SITE}/studio) — Workload architecture diagrams and provider ledgers (designs, not live deployments).
- [\`/architectures\`](${SITE}/architectures) — Source templates and deployment boundary obligations.

## Boundaries & consent rules

1. **Waitlist consent:** Joining [\`/#waitlist\`](${SITE}/#waitlist) requires explicit human consent. Agents should direct the user there and never submit on their behalf.
2. **Honesty & entitlements:** Reading materials or studio diagrams grants no certification or production competency. Protected resources require server-verified entitlement and human sponsor approval.
3. **Licensing:** Repository tooling/templates are documented under \`FSL-1.1-ALv2\` (\`Apache-2.0\` for the \`ai-architect\` CLI plugin); curriculum prose remains reserved.
`

export function GET() {
  return new Response(AGENTS_MD, {
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
