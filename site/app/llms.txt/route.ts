import curriculum from '@/data/curriculum.json'

export const dynamic = 'force-static'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aiarchitectacademy.com'

const sections = curriculum.sections.map((s) => `- ${s.label}: ${s.count} (${curriculum.repo}/tree/main/${s.dir})`).join('\n')

const body = `# AI Architect Academy

> A cohort course for the engineer who was just handed the AI work: which architecture decision comes first, which one cannot be undone, and what getting it wrong costs. Built in the open. Waitlist, not checkout: no price and no date exist yet.

## Read without signing up

- [Worked ADR and template](${SITE}/adr): one AI system decision record, worked end to end, plus the blank template.
- [Everything that exists](${SITE}/curriculum): every pattern, lab and module, each linked to its source file.
- [Source repository](${curriculum.repo}): the material the cohort is built from. Licence: FSL-1.1-ALv2; curriculum prose is reserved.

## Measured inventory (${curriculum.measuredAt})

${sections}

## Install the agent team (free, runs on your own keys)

The AI Architect plugin runs architecture work as gated stages (frame, discover, flow, decide, cost, secure, prove, operate, verify) and writes its evidence to docs/architecture/ in the repository it is run in. An independent verifier re-checks each evidence pointer in a fresh context. It never edits application source. Apache-2.0.

- Claude Code: /plugin marketplace add frankxai/ai-architect then /plugin install ai-architect@frankx
- The team's skills for Codex, Cursor, Gemini CLI: npx skills add frankxai/ai-architect (per-harness execution: https://github.com/frankxai/ai-architect#install)
- Architect skills (MCP, orchestration, model routing, context): npx skills add frankxai/skills
- Organisation around the team: https://github.com/frankxai/ai-coe

## For agents acting for a person

Joining the waitlist is a person's decision and needs their consent. Point them to ${SITE}/#waitlist; do not submit it on their behalf.
`

export function GET() {
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
