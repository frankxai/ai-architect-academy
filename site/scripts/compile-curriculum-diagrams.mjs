import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const siteRoot = fileURLToPath(new URL('../', import.meta.url));
const repoRoot = path.resolve(siteRoot, '..');
const curriculumPath = path.join(siteRoot, 'data/curriculum.json');
const registryPath = path.join(siteRoot, 'data/diagrams-registry.json');
const curriculumSvgDir = path.join(siteRoot, 'public/images/diagrams/curriculum');
const patternsSvgDir = path.join(siteRoot, 'public/images/diagrams/patterns');

const FORBIDDEN_PUBLIC_TERMS = /\b(?:adk|amazon|anthropic|aws|azure|bedrock|claude|cloudflare|gemini|github|google|gpt(?:-?4o)?|langfuse|langgraph|linear|llama|openai|opencode|oracle|oci|pinecone|slack|vercel|vertex(?: ai)?|workers ai)\b/i;
const PUBLIC_TITLE_OVERRIDES = new Map([
  ['LangGraph Planner Loop', 'State Machine Planner Loop'],
  ['Slack Agent Collaboration Playbook', 'Agent Collaboration Playbook'],
  ['Gemini Reasoning & Debate Sprint', 'Reasoning & Debate Sprint'],
  ['Langfuse Telemetry Sprints', 'Telemetry Sprints'],
  ['Issue Triage with Linear/GitHub', 'Issue Triage Workflow'],
]);
const PUBLIC_TITLE_REPLACEMENTS = [
  [/\b(?:claude|gemini|gpt(?:-?4o)?|llama)\b/gi, 'Model'],
  [/\b(?:amazon|anthropic|aws|azure|cloudflare|github|google|linear|openai|opencode|oracle|oci|slack|vercel)\b/gi, 'Platform'],
  [/\b(?:adk|bedrock|langfuse|langgraph|pinecone|vertex(?: ai)?|workers ai)\b/gi, 'Service'],
];
const EMOJI_PATTERN = /\p{Extended_Pictographic}/u;

const PALETTE = {
  stage: '#0f1017',
  stageEnd: '#141826',
  panel: '#151824',
  card: '#1b2032',
  cardHighlight: '#1f2640',
  gateBg: '#231f2e',
  line: '#2d344d',
  cobalt: '#7c93ff',
  cobaltBright: '#a9b8ff',
  mint: '#5ee6cf',
  amber: '#ffc07a',
  ink: '#f2f1ec',
  inkSecondary: '#cbd5e1',
  inkMuted: '#9aa1b5',
};

const CONTRAST_PAIRS = [
  ['ink on card', PALETTE.ink, PALETTE.card],
  ['ink on cardHighlight', PALETTE.ink, PALETTE.cardHighlight],
  ['inkSecondary on card', PALETTE.inkSecondary, PALETTE.card],
  ['inkMuted on panel', PALETTE.inkMuted, PALETTE.panel],
  ['cobaltBright on card', PALETTE.cobaltBright, PALETTE.card],
  ['mint on card', PALETTE.mint, PALETTE.card],
  ['amber on gateBg', PALETTE.amber, PALETTE.gateBg],
];

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const num = Number.parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function relativeLuminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(fg, bg) {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  return Number(((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(2));
}

export function verifyContrast() {
  const pairs = {};
  for (const [name, fg, bg] of CONTRAST_PAIRS) {
    const ratio = contrastRatio(fg, bg);
    if (ratio < 4.5) {
      throw new Error(`WCAG AA contrast check failed for ${name}: ${ratio}:1 (< 4.5:1)`);
    }
    pairs[name] = ratio;
  }
  return pairs;
}

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function cleanTitle(raw) {
  return String(raw ?? '')
    .replace(/^Pattern:\s*/i, '')
    .replace(/^Micro-Module:\s*/i, '')
    .replace(/^Learning Path:\s*/i, '')
    .replace(/^Workflows:\s*/i, '')
    .trim();
}

function publicInventoryTitle(raw) {
  const cleaned = cleanTitle(raw);
  const explicitTitle = PUBLIC_TITLE_OVERRIDES.get(cleaned);
  if (explicitTitle) return explicitTitle;

  return PUBLIC_TITLE_REPLACEMENTS.reduce(
    (title, [pattern, replacement]) => title.replace(pattern, replacement),
    cleaned,
  ).replace(/\s+/g, ' ').trim();
}

function wrapLines(text, maxChars, maxLines = 2) {
  const words = String(text ?? '').trim().split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
      if (lines.length === maxLines - 1) break;
    }
  }
  if (current && lines.length < maxLines) {
    const usedCount = lines.join(' ').split(/\s+/).filter(Boolean).length + current.split(/\s+/).filter(Boolean).length;
    const rest = words.slice(usedCount);
    let tail = rest.length ? `${current} ${rest.join(' ')}` : current;
    if (tail.length > maxChars + 2) {
      tail = `${tail.slice(0, Math.max(8, maxChars - 1)).trimEnd()}…`;
    }
    lines.push(tail);
  }
  return lines;
}

function renderMultiline(lines, x, startY, lineHeight, attrs = '') {
  return lines
    .map((line, idx) => `<text x="${x}" y="${startY + idx * lineHeight}" ${attrs}>${esc(line)}</text>`)
    .join('\n    ');
}

function svgShell({ width, height, title, desc, body }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(title)}">
  <title>${esc(title)}</title>
  <desc>${esc(desc)}</desc>
  <defs>
    <linearGradient id="stage-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${PALETTE.stage}" />
      <stop offset="60%" stop-color="#121522" />
      <stop offset="100%" stop-color="${PALETTE.stageEnd}" />
    </linearGradient>
    <linearGradient id="cobalt-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${PALETTE.cobalt}" stop-opacity="0.78" />
      <stop offset="100%" stop-color="${PALETTE.mint}" stop-opacity="0.52" />
    </linearGradient>
    <radialGradient id="cobalt-glow" cx="18%" cy="12%" r="55%">
      <stop offset="0%" stop-color="#1f3bd6" stop-opacity="0.24" />
      <stop offset="100%" stop-color="#1f3bd6" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="mint-glow" cx="88%" cy="86%" r="50%">
      <stop offset="0%" stop-color="#5ee6cf" stop-opacity="0.12" />
      <stop offset="100%" stop-color="#5ee6cf" stop-opacity="0" />
    </radialGradient>
    <pattern id="academy-grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1" fill="#2d344d" fill-opacity="0.55" />
    </pattern>
    <marker id="arrow-cobalt" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="${PALETTE.cobaltBright}" />
    </marker>
    <marker id="arrow-mint" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="${PALETTE.mint}" />
    </marker>
    <marker id="arrow-amber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="${PALETTE.amber}" />
    </marker>
  </defs>
  <style>
    text { font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    .serif { font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; }
    .mono { font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace; }
  </style>
  <rect width="${width}" height="${height}" rx="18" fill="url(#stage-grad)" />
  <rect width="${width}" height="${height}" rx="18" fill="url(#academy-grid)" />
  <rect width="${width}" height="${height}" rx="18" fill="url(#cobalt-glow)" />
  <rect width="${width}" height="${height}" rx="18" fill="url(#mint-glow)" />
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="17" fill="none" stroke="${PALETTE.line}" stroke-width="1.5" />
  ${body}
</svg>
`;
}

function headerBar({ eyebrow, title, subtitle, badge }) {
  return `
  <g>
    <rect x="40" y="34" width="8" height="8" rx="4" fill="${PALETTE.mint}" />
    <text x="58" y="42" class="mono" font-size="11.5" fill="${PALETTE.cobaltBright}" letter-spacing="0.9">${esc(eyebrow)}</text>
    <rect x="920" y="24" width="240" height="28" rx="14" fill="${PALETTE.panel}" stroke="${PALETTE.line}" />
    <text x="1040" y="42" text-anchor="middle" class="mono" font-size="11.5" fill="${PALETTE.mint}">${esc(badge)}</text>
    <text x="40" y="78" class="serif" font-size="28" font-weight="600" fill="${PALETTE.ink}">${esc(title)}</text>
    <text x="40" y="103" font-size="13.8" fill="${PALETTE.inkSecondary}">${esc(subtitle)}</text>
    <line x1="40" y1="120" x2="1160" y2="120" stroke="${PALETTE.line}" stroke-width="1" />
  </g>`;
}

function buildCurriculumSectionSvg(curriculum, section) {
  const width = 1200;
  const cols = section.items.length <= 6 ? 2 : 3;
  const rows = Math.ceil(section.items.length / cols);
  const cardHeight = 58;
  const rowGap = 12;
  const gridStartY = 166;
  const gridHeight = rows * cardHeight + Math.max(0, rows - 1) * rowGap;
  const height = Math.max(500, gridStartY + gridHeight + 92);
  const inventoryNote = `<text x="40" y="146" class="mono" font-size="11.5" fill="${PALETTE.inkMuted}">Card numbers are inventory identifiers, not a learning sequence.</text>`;

  const colGap = 16;
  const colWidth = Math.floor((1120 - (cols - 1) * colGap) / cols);
  const maxChars = cols === 2 ? 54 : 34;

  const itemCards = section.items.map((item, idx) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const x = 40 + col * (colWidth + colGap);
    const y = gridStartY + row * (cardHeight + rowGap);
    const num = String(idx + 1).padStart(2, '0');
    const lines = wrapLines(publicInventoryTitle(item.title), maxChars, 2);
    const textY = lines.length === 1 ? y + 34 : y + 26;
    return `<g>
      <rect x="${x}" y="${y}" width="${colWidth}" height="${cardHeight}" rx="10" fill="${PALETTE.card}" stroke="${PALETTE.line}" />
      <rect x="${x + 12}" y="${y + 15}" width="34" height="28" rx="7" fill="${PALETTE.panel}" />
      <text x="${x + 29}" y="${y + 34}" text-anchor="middle" class="mono" font-size="11.5" fill="${PALETTE.cobaltBright}">${num}</text>
      ${renderMultiline(lines, x + 58, textY, 16, `font-size="12.6" font-weight="550" fill="${PALETTE.ink}"`)}
    </g>`;
  }).join('\n  ');

  const footerY = height - 62;
  const footer = `
  <g>
    <rect x="40" y="${footerY}" width="1120" height="40" rx="10" fill="${PALETTE.panel}" stroke="${PALETTE.line}" />
    <text x="58" y="${footerY + 25}" class="mono" font-size="11.5" fill="${PALETTE.inkMuted}">Source directory: ${esc(section.dir)} · Measured from repository on ${esc(curriculum.measuredAt)}</text>
  </g>`;

  return {
    width,
    height,
    svg: svgShell({
      width,
      height,
      title: `${section.label} curriculum section inventory`,
      desc: `Curriculum section inventory for ${section.label} (${section.dir}) listing ${section.count} public repository items measured on ${curriculum.measuredAt}.`,
      body: [
        headerBar({
          eyebrow: `AI Architect Academy · ${section.dir}`,
          title: `${section.label} inventory`,
          subtitle: 'Every card maps directly to a public file or lab directory in the repository',
          badge: `${section.count} repository ${section.count === 1 ? 'item' : 'items'}`,
        }),
        inventoryNote,
        itemCards,
        footer,
      ].join('\n'),
    }),
  };
}

function buildPatternMatrixSvg({ eyebrow, title, subtitle, badge, columns, footerTitle, footerBody }) {
  const width = 1200;
  const height = 680;
  const count = columns.length;
  const gap = 18;
  const colWidth = Math.floor((1120 - (count - 1) * gap) / count);

  const renderedCols = columns.map((col, idx) => {
    const x = 40 + idx * (colWidth + gap);
    const arrow = idx < count - 1
      ? `<line x1="${x + colWidth}" y1="334" x2="${x + colWidth + gap - 2}" y2="334" stroke="${PALETTE.cobaltBright}" stroke-width="1.8" marker-end="url(#arrow-cobalt)" />`
      : '';
    const maxChars = Math.max(22, Math.floor((colWidth - 44) / 6.8));
    return `<g>
      <rect x="${x}" y="150" width="${colWidth}" height="376" rx="15" fill="${PALETTE.cardHighlight}" stroke="url(#cobalt-stroke)" stroke-width="1.4" />
      <rect x="${x + 16}" y="168" width="${Math.min(colWidth - 32, 148)}" height="24" rx="12" fill="${PALETTE.panel}" />
      <text x="${x + 28}" y="184" class="mono" font-size="11" fill="${col.accent}">${esc(col.kicker)}</text>
      <text x="${x + 16}" y="218" font-size="16.5" font-weight="620" fill="${PALETTE.ink}">${esc(col.heading)}</text>
      <line x1="${x + 16}" y1="234" x2="${x + colWidth - 16}" y2="234" stroke="${PALETTE.line}" />
      ${col.nodes.map((node, nIdx) => {
        const boxY = 250 + nIdx * 66;
        return `<rect x="${x + 16}" y="${boxY}" width="${colWidth - 32}" height="54" rx="9" fill="${PALETTE.card}" stroke="${PALETTE.line}" />
        <text x="${x + 28}" y="${boxY + 22}" font-size="13" font-weight="600" fill="${PALETTE.ink}">${esc(node.name)}</text>
        ${renderMultiline(wrapLines(node.detail, maxChars, 1), x + 28, boxY + 41, 14, `font-size="11.5" fill="${PALETTE.inkSecondary}"`)}`;
      }).join('\n      ')}
      ${arrow}
    </g>`;
  }).join('\n  ');

  const footer = `
  <g>
    <rect x="40" y="548" width="1120" height="92" rx="14" fill="${PALETTE.gateBg}" stroke="${PALETTE.amber}" stroke-opacity="0.52" />
    <text x="62" y="578" class="mono" font-size="11.5" fill="${PALETTE.amber}">${esc(footerTitle)}</text>
    ${renderMultiline(wrapLines(footerBody, 118, 2), 62, 602, 19, `font-size="13.2" fill="${PALETTE.ink}"`)}
  </g>`;

  return svgShell({
    width,
    height,
    title,
    desc: `${title}: ${subtitle}`,
    body: [
      headerBar({ eyebrow, title, subtitle, badge }),
      renderedCols,
      footer,
    ].join('\n'),
  });
}

const PATTERN_BLUEPRINTS = [
  {
    id: 'ai-gateway',
    title: 'Multi-cloud AI gateway pattern',
    sourceDoc: '01-design-patterns/ai-gateway-pattern.md',
    d2Source: 'diagrams/d2/ai-gateway.d2',
    summary: 'Unified ingress for authentication, rate limits, semantic caching, provider routing, and fallback.',
    build: () => buildPatternMatrixSvg({
      eyebrow: 'Design pattern · 01-design-patterns/ai-gateway-pattern.md',
      title: 'Multi-cloud AI gateway architecture',
      subtitle: 'Single policy and observability plane across frontier and open-weight model providers',
      badge: 'Ingress + routing',
      columns: [
        {
          kicker: '01 · Ingress',
          heading: 'Client surfaces',
          accent: PALETTE.cobaltBright,
          nodes: [
            { name: 'Web applications', detail: 'Streaming UI & server actions' },
            { name: 'Mobile & desktop', detail: 'Typed SDK & session tokens' },
            { name: 'CLI & batch jobs', detail: 'Service-to-service API keys' },
            { name: 'Agent harnesses', detail: 'Tool-calling loops' },
          ],
        },
        {
          kicker: '02 · Policy',
          heading: 'Gateway controls',
          accent: PALETTE.mint,
          nodes: [
            { name: 'Auth & tenant quotas', detail: 'JWT verification & rate limits' },
            { name: 'Semantic & exact cache', detail: 'Latency & token reduction' },
            { name: 'Policy router', detail: 'Task, cost, and region rules' },
            { name: 'Circuit-breaker fallback', detail: 'Health checks & retries' },
          ],
        },
        {
          kicker: '03 · Providers',
          heading: 'Model endpoints',
          accent: PALETTE.cobaltBright,
          nodes: [
            { name: 'Frontier text endpoint', detail: 'General-purpose model families' },
            { name: 'Reasoning endpoint', detail: 'Long-context reasoning models' },
            { name: 'Multimodal endpoint', detail: 'Text, image, and audio inputs' },
            { name: 'Open-weight endpoint', detail: 'Managed low-latency inference' },
          ],
        },
        {
          kicker: '04 · Telemetry',
          heading: 'Observability',
          accent: PALETTE.amber,
          nodes: [
            { name: 'Distributed traces', detail: 'OpenTelemetry span correlation' },
            { name: 'Cost attribution', detail: 'Per-tenant token ledger' },
            { name: 'PII & prompt guard', detail: 'Redaction before upstream call' },
            { name: 'SLO alerting', detail: 'Error-rate & latency budgets' },
          ],
        },
      ],
      footerTitle: 'Architectural boundary',
      footerBody: 'Applications never embed provider-specific credentials; routing, budget enforcement, fallback, and audit logging happen once at the gateway.',
    }),
  },
  {
    id: 'mcp-architecture',
    title: 'Model Context Protocol (MCP) architecture',
    sourceDoc: 'labs/03-mcp-server',
    d2Source: 'diagrams/d2/mcp-architecture.d2',
    summary: 'JSON-RPC 2.0 host-client-server topology exposing typed tools, readable resources, and reusable prompts.',
    build: () => buildPatternMatrixSvg({
      eyebrow: 'Protocol blueprint · labs/03-mcp-server',
      title: 'Model Context Protocol (MCP) server architecture',
      subtitle: 'Standardized JSON-RPC 2.0 boundary between AI hosts, protocol clients, and scoped capability servers',
      badge: 'JSON-RPC 2.0',
      columns: [
        {
          kicker: '01 · Host',
          heading: 'MCP host apps',
          accent: PALETTE.cobaltBright,
          nodes: [
            { name: 'Desktop assistants', detail: 'User-supervised chat workspace' },
            { name: 'IDE & CLI agents', detail: 'Repository coding harnesses' },
            { name: 'Custom web apps', detail: 'Domain workflow interfaces' },
            { name: 'Consent manager', detail: 'Approves server connections' },
          ],
        },
        {
          kicker: '02 · Client',
          heading: 'Protocol layer',
          accent: PALETTE.mint,
          nodes: [
            { name: 'Capability handshake', detail: 'Version & schema negotiation' },
            { name: 'stdio transport', detail: 'Local subprocess isolation' },
            { name: 'Streamable HTTP / SSE', detail: 'Authenticated remote servers' },
            { name: 'JSON-RPC 2.0 framing', detail: 'Typed requests, errors, & cancel' },
          ],
        },
        {
          kicker: '03 · Servers',
          heading: 'Capability primitives',
          accent: PALETTE.cobaltBright,
          nodes: [
            { name: 'Tools', detail: 'Schema-validated actions' },
            { name: 'Resources', detail: 'URI-addressed read-only context' },
            { name: 'Prompts', detail: 'Parameterized workflow templates' },
            { name: 'Least-privilege auth', detail: 'Scoped tokens per backend' },
          ],
        },
        {
          kicker: '04 · Backends',
          heading: 'External systems',
          accent: PALETTE.amber,
          nodes: [
            { name: 'Git & filesystems', detail: 'Allowlisted workspace paths' },
            { name: 'Relational & vector DBs', detail: 'Parameterized read/write queries' },
            { name: 'REST & GraphQL APIs', detail: 'Rate-limited service adapters' },
            { name: 'Audit & error logs', detail: 'Per-call latency & status trace' },
          ],
        },
      ],
      footerTitle: 'Security boundary',
      footerBody: 'Tool annotations describe behavior but never replace server-side authentication, path allowlists, and explicit human approval for write scopes.',
    }),
  },
  {
    id: 'multi-agent-orchestration',
    title: 'Multi-agent supervisor orchestration',
    sourceDoc: '01-design-patterns/multi-agent-orchestration-pattern.md',
    d2Source: 'diagrams/d2/multi-agent-orchestration.d2',
    summary: 'Supervisor task decomposition across specialized workers sharing scoped MCP tools and synchronized state.',
    build: () => buildPatternMatrixSvg({
      eyebrow: 'Design pattern · 01-design-patterns/multi-agent-orchestration-pattern.md',
      title: 'Supervisor multi-agent orchestration',
      subtitle: 'Coordinator routing, isolated specialist scopes, shared memory sync, and verified handoffs',
      badge: 'Supervisor topology',
      columns: [
        {
          kicker: '01 · Supervisor',
          heading: 'Control plane',
          accent: PALETTE.cobaltBright,
          nodes: [
            { name: 'Task decomposition', detail: 'Splits separable deliverables' },
            { name: 'Role router', detail: 'Assigns least-privilege worker' },
            { name: 'State coordinator', detail: 'Tracks progress & budgets' },
            { name: 'Handoff gate', detail: 'Validates schema before merge' },
          ],
        },
        {
          kicker: '02 · Specialists',
          heading: 'Bounded workers',
          accent: PALETTE.mint,
          nodes: [
            { name: 'Research agent', detail: 'Web & corpus evidence gathering' },
            { name: 'Analysis agent', detail: 'Structured data & metric checks' },
            { name: 'Coding agent', detail: 'Implementation & unit tests' },
            { name: 'Writing & review agent', detail: 'Documentation & critique' },
          ],
        },
        {
          kicker: '03 · Shared',
          heading: 'Tools & models',
          accent: PALETTE.cobaltBright,
          nodes: [
            { name: 'MCP server mesh', detail: 'Source control, DB, files, & search' },
            { name: 'Tiered model pool', detail: 'Fast scouts + deep reasoners' },
            { name: 'Sandbox runner', detail: 'Isolated code & test execution' },
            { name: 'Token budget meter', detail: 'Per-worker ceiling enforcement' },
          ],
        },
        {
          kicker: '04 · Memory',
          heading: 'State & artifacts',
          accent: PALETTE.amber,
          nodes: [
            { name: 'Conversation context', detail: 'Scoped summary per handoff' },
            { name: 'Artifact store', detail: 'Versioned files & diffs' },
            { name: 'Verification receipt', detail: 'Independent check verdict' },
            { name: 'Operator response', detail: 'Traceable final deliverable' },
          ],
        },
      ],
      footerTitle: 'Coordination rule',
      footerBody: 'Spawn multiple agents only when outputs are separable or require independent verification; keep one writer per file or git branch.',
    }),
  },
  {
    id: 'rag-production',
    title: 'Production RAG pipeline architecture',
    sourceDoc: '01-design-patterns/rag-production-pattern.md',
    d2Source: 'diagrams/d2/rag-production.d2',
    summary: 'End-to-end ingestion, hybrid indexing, cross-encoder reranking, cited generation, and continuous evaluation.',
    build: () => buildPatternMatrixSvg({
      eyebrow: 'Design pattern · 01-design-patterns/rag-production-pattern.md',
      title: 'Production retrieval-augmented generation (RAG)',
      subtitle: 'Semantic chunking, hybrid vector + lexical search, cross-encoder reranking, and citation telemetry',
      badge: 'Grounded retrieval',
      columns: [
        {
          kicker: '01 · Ingestion',
          heading: 'Document pipeline',
          accent: PALETTE.cobaltBright,
          nodes: [
            { name: 'Source connectors', detail: 'Markdown, PDF, & docs with ACLs' },
            { name: 'Semantic chunker', detail: 'Structure-aware token windows' },
            { name: 'Metadata enrichment', detail: 'Source URI, timestamp, & tenant' },
            { name: 'Embedding & cache', detail: 'Idempotent vector generation' },
          ],
        },
        {
          kicker: '02 · Retrieval',
          heading: 'Hybrid index & rank',
          accent: PALETTE.mint,
          nodes: [
            { name: 'HNSW vector store', detail: 'Managed or self-hosted ANN index' },
            { name: 'BM25 lexical search', detail: 'Exact identifiers & error codes' },
            { name: 'ACL pre-filtering', detail: 'Enforces tenant visibility' },
            { name: 'Cross-encoder rerank', detail: 'Precision top-k selection' },
          ],
        },
        {
          kicker: '03 · Synthesis',
          heading: 'Cited generation',
          accent: PALETTE.cobaltBright,
          nodes: [
            { name: 'Context assembly', detail: 'Numbered source passages' },
            { name: 'Grounded prompt', detail: 'Abstain when evidence is absent' },
            { name: 'LLM synthesis', detail: 'Inline citation locators' },
            { name: 'Guardrail check', detail: 'Citation-to-passage verification' },
          ],
        },
        {
          kicker: '04 · Quality',
          heading: 'Observability & evals',
          accent: PALETTE.amber,
          nodes: [
            { name: 'Retrieval traces', detail: 'Chunk scores & latency breakdown' },
            { name: 'Faithfulness eval', detail: 'Detects unsupported statements' },
            { name: 'Recall@k benchmark', detail: 'Golden query regression suite' },
            { name: 'Freshness monitor', detail: 'Re-indexes updated documents' },
          ],
        },
      ],
      footerTitle: 'Production readiness gate',
      footerBody: 'Measure retrieval recall, reranker precision, and citation faithfulness separately so indexing regressions are never misdiagnosed as model drift.',
    }),
  },
];

function assertSafeContent(label, text) {
  const forbiddenMatch = String(text).match(FORBIDDEN_PUBLIC_TERMS);
  if (forbiddenMatch) {
    throw new Error(`Forbidden vendor term "${forbiddenMatch[0]}" found in ${label}`);
  }
  if (EMOJI_PATTERN.test(text)) {
    throw new Error(`Emoji character found in ${label}; keep SVG text deterministic across OS fonts.`);
  }
}

export async function compileDiagrams({ checkOnly = false } = {}) {
  const contrastPairs = verifyContrast();
  const minContrast = Math.min(...Object.values(contrastPairs));
  const curriculum = JSON.parse(await readFile(curriculumPath, 'utf8'));

  if (!checkOnly) {
    await mkdir(curriculumSvgDir, { recursive: true });
    await mkdir(patternsSvgDir, { recursive: true });
  }

  const curriculumEntries = [];
  for (const section of curriculum.sections) {
    const { width, height, svg } = buildCurriculumSectionSvg(curriculum, section);
    assertSafeContent(`curriculum/${section.id}.svg`, svg);
    const relPath = `public/images/diagrams/curriculum/${section.id}.svg`;
    const fullPath = path.join(siteRoot, relPath);
    const bytes = Buffer.from(svg, 'utf8');
    const sha256 = createHash('sha256').update(bytes).digest('hex');

    if (checkOnly) {
      const current = await readFile(fullPath, 'utf8');
      if (current !== svg) {
        throw new Error(`${relPath} is out of date. Run node site/scripts/compile-curriculum-diagrams.mjs.`);
      }
    } else {
      await writeFile(fullPath, svg, 'utf8');
    }

    curriculumEntries.push({
      id: section.id,
      label: section.label,
      dir: section.dir,
      itemCount: section.count,
      src: `/images/diagrams/curriculum/${section.id}.svg`,
      file: `site/${relPath}`,
      width,
      height,
      bytes: bytes.length,
      sha256,
      repoHref: `${curriculum.repo}/tree/main/${section.dir}`,
    });
  }

  const patternEntries = [];
  for (const bp of PATTERN_BLUEPRINTS) {
    assertSafeContent(
      `patterns/${bp.id} metadata`,
      [bp.id, bp.title, bp.summary, bp.sourceDoc, bp.d2Source ?? ''].join('\n'),
    );
    const svg = bp.build();
    assertSafeContent(`patterns/${bp.id}.svg`, svg);
    const relPath = `public/images/diagrams/patterns/${bp.id}.svg`;
    const fullPath = path.join(siteRoot, relPath);
    const bytes = Buffer.from(svg, 'utf8');
    const sha256 = createHash('sha256').update(bytes).digest('hex');

    if (checkOnly) {
      const current = await readFile(fullPath, 'utf8');
      if (current !== svg) {
        throw new Error(`${relPath} is out of date. Run node site/scripts/compile-curriculum-diagrams.mjs.`);
      }
    } else {
      await writeFile(fullPath, svg, 'utf8');
    }

    patternEntries.push({
      id: bp.id,
      title: bp.title,
      summary: bp.summary,
      sourceDoc: bp.sourceDoc,
      ...(bp.d2Source ? { d2Source: bp.d2Source } : {}),
      src: `/images/diagrams/patterns/${bp.id}.svg`,
      file: `site/${relPath}`,
      width: 1200,
      height: 680,
      bytes: bytes.length,
      sha256,
      repoHref: `${curriculum.repo}/tree/main/${bp.sourceDoc}`,
    });
  }

  const observatoryFile = path.join(siteRoot, 'public/images/living-world/observatory-discovery.jpg');
  const observatoryBytes = await readFile(observatoryFile);
  const observatorySha256 = createHash('sha256').update(observatoryBytes).digest('hex');

  const registry = {
    schema: 'academy.diagrams_registry.v1',
    measuredAt: curriculum.measuredAt,
    compiler: 'site/scripts/compile-curriculum-diagrams.mjs',
    wcagAaMinContrast: minContrast,
    contrastPairs,
    livingWorld: {
      id: 'observatory-discovery',
      src: '/images/living-world/observatory-discovery.jpg',
      file: 'site/public/images/living-world/observatory-discovery.jpg',
      provenance: 'site/public/images/living-world/observatory-discovery.vis.provenance.json',
      width: 1672,
      height: 941,
      bytes: observatoryBytes.length,
      sha256: observatorySha256,
      alt: 'Concept artwork of a cloud-hooded terminal companion looking through a brass telescope on a night observatory terrace with two small companions',
      source: 'founder-approved living-world visual series 2026-11-11',
      edition: 'editorial',
    },
    curriculumRoadmaps: curriculumEntries,
    patterns: patternEntries,
  };

  const serialized = `${JSON.stringify(registry, null, 2)}\n`;
  assertSafeContent('diagrams-registry.json', serialized.replaceAll(curriculum.repo, 'repository'));

  if (checkOnly) {
    const existing = await readFile(registryPath, 'utf8');
    if (existing !== serialized) {
      throw new Error('site/data/diagrams-registry.json is out of date. Run node site/scripts/compile-curriculum-diagrams.mjs.');
    }
  } else {
    await writeFile(registryPath, serialized, 'utf8');
  }

  return registry;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const checkOnly = process.argv.includes('--check');
  const registry = await compileDiagrams({ checkOnly });
  console.log(
    `${checkOnly ? 'Verified' : 'Compiled'} ${registry.curriculumRoadmaps.length} curriculum section inventories and ${registry.patterns.length} architecture blueprints (min WCAG contrast ${registry.wcagAaMinContrast}:1).`,
  );
}
