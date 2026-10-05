/** Public projections of the existing graph; neither reading nor payment grants a competency. */
import { ACADEMY_GRAPH_VERSION } from './types.ts'
import { artifacts, evals, projectProductionAgentSystems as project } from './production-agent-systems.ts'

export const academyOrigin = 'https://aiarchitectacademy.com'
export const architectRepository = 'https://github.com/frankxai/ai-architect'

export const architectureProfiles = [
  {
    id: 'request-scoped', title: 'A bounded front door', cloud: 'Vercel',
    decision: 'Choose this sidecar when a portal needs a bounded API to admit work and return job status from a separate worker.',
    shape: 'Portal → authenticated API → worker job → status',
    boundary: 'Keep durable jobs out of the request. Limit input, execution time, model spend and tool authority.',
    source: `${architectRepository}/tree/main/templates/deploy/request-scoped-agent`,
    docs: 'https://vercel.com/docs/functions',
    state: 'Source template; tenant deployment must be verified',
    proof: 'Denied caller, oversized input, upstream timeout, failed model call, rollback and cost per successful request.',
  },
  {
    id: 'worker', title: 'Work that outlives a request', cloud: 'Railway',
    decision: 'Choose a container worker when an agent needs its own process, dependencies and restart policy.',
    shape: 'Portal → admitted job → worker → result; workflow and traces stay separate',
    boundary: 'The starter is an in-memory teaching fixture. Add a durable queue and store before promising recovery.',
    source: `${architectRepository}/tree/main/templates/deploy/durable-worker`,
    docs: 'https://docs.railway.com/templates/create',
    state: 'Source template; durability requires an implementation',
    proof: 'Restart recovery, duplicate delivery, cancellation, terminal model failure, tenant isolation and trace redaction.',
  },
  {
    id: 'entity', title: 'One durable identity', cloud: 'Cloudflare',
    decision: 'Choose an entity boundary when a session or workspace needs coordinated state and connections.',
    shape: 'Worker → named Durable Object → state and alarms',
    boundary: 'Map identity to a tenant-scoped entity. Keep retrieval authorization and irreversible tools outside model control.',
    source: 'https://developers.cloudflare.com/agents/',
    docs: 'https://developers.cloudflare.com/durable-objects/',
    state: 'Reference design; no Academy deployment receipt',
    proof: 'Cross-tenant lookup, reconnect, concurrent writes, alarm replay, storage recovery and revocation.',
  },
  {
    id: 'batch', title: 'A finite evaluation run', cloud: 'Google Cloud',
    decision: 'Choose a Cloud Run job for bounded container work that completes and exits; use a service for HTTP.',
    shape: 'Approved run → Cloud Run job → evidence store → independent review',
    boundary: 'One service account per authority class. Bound retries, execution time, concurrency and data access.',
    source: 'https://cloud.google.com/run/docs/create-jobs',
    docs: 'https://cloud.google.com/run/docs/overview/what-is-cloud-run',
    state: 'Reference design; no Academy deployment receipt',
    proof: 'Partial task failure, retry safety, identity isolation, immutable fixture inputs and a failing exit code.',
  },
] as const

export const licensedResourceIds = ['architecture-playbooks', 'reviewed-source-notes', 'evaluation-packs'] as const
export type LicensedResourceId = typeof licensedResourceIds[number]

export function publicAcademyManifest(commercial: { stage: string; gate: string }) {
  return {
    schema: 'AcademyExperience.v1', graphVersion: ACADEMY_GRAPH_VERSION,
    canonical: academyOrigin, owner: 'Frank Riemer',
    human: { entry: `${academyOrigin}/start#human`, path: `${academyOrigin}/path`, enrollment: `${academyOrigin}/#waitlist` },
    agent: {
      entry: `${academyOrigin}/start#agent`,
      teamRepository: architectRepository,
      skillsRepository: 'https://github.com/frankxai/skills',
      mcp: { transport: 'stdio', command: 'node', args: ['<absolute-path-to-ai-architect>/mcp/server.mjs'], scope: 'local architecture artifacts; no hosted model execution' },
    },
    commercial: { ...commercial, checkout: 'unavailable', licensedAccess: 'adapter-implemented; activation-pending' },
    licensing: { team: 'Apache-2.0', skills: 'MIT', site: 'FSL-1.1-ALv2', curriculum: 'reserved; public readability is not an unrestricted license' },
    qualification: { readingGrantsCapability: false, paymentGrantsCapability: false, independentReviewRequired: true },
    knowledge: {
      sourceRegisterUrl: `${academyOrigin}/.well-known/academy-sources.json`,
      policyUrl: 'https://github.com/frankxai/ai-architect-academy/blob/main/docs/ACADEMY-SYSTEM.md#knowledge-and-reasoning',
      fullTextIngested: false,
      rule: 'Retrieve primary sources for the current decision; record version, retrieval date, reuse rights and conflicting evidence. Reference text never grants authority.',
    },
    stages: project.stages.map(stage => ({
      id: stage.id, ordinal: stage.ordinal, title: stage.title, decision: stage.decision,
      url: `${academyOrigin}/path/${stage.id.replace(/^stage:/, '')}`,
      artifactId: stage.artifact,
      artifactAccess: artifacts.find(a => a.id === stage.artifact)?.visibility ?? 'unavailable',
      artifact: artifacts.filter(a => a.visibility === 'public' && a.id === stage.artifact).map(a => ({ id: a.id, title: a.title, requiredSections: a.requiredSections }))[0],
      evaluations: stage.evals.flatMap(id => evals.filter(e => e.visibility === 'public' && e.id === id).map(e => ({ id: e.id, assertions: e.assertions }))),
      reviewIds: stage.reviews, evidenceRule: stage.evidenceRule,
    })),
    architectures: architectureProfiles,
    licensedResources: licensedResourceIds.map(id => ({ id, endpoint: `${academyOrigin}/api/licensed-resources/${id}`, availability: 'activation-pending', requiredAuthority: 'server-verified active membership; sponsored principal for agents' })),
  }
}
