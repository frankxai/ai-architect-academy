import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { compileDiagrams } from './compile-curriculum-diagrams.mjs'

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const REPO = path.resolve(SITE, '..')
const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex')
const FORBIDDEN_PUBLIC_TERMS = /\b(?:adk|amazon|anthropic|aws|azure|bedrock|claude|cloudflare|gemini|github|google|gpt(?:-?4o)?|langfuse|langgraph|linear|llama|openai|opencode|oracle|oci|pinecone|slack|vercel|vertex(?: ai)?|workers ai)\b/i

test('curriculum diagram compiler check mode passes with WCAG AA contrast and exact section parity', async () => {
  const registry = await compileDiagrams({ checkOnly: true })
  const curriculum = JSON.parse(fs.readFileSync(path.join(SITE, 'data/curriculum.json'), 'utf8'))

  assert.equal(registry.schema, 'academy.diagrams_registry.v1')
  assert.ok(registry.wcagAaMinContrast >= 4.5, `expected WCAG AA >= 4.5, got ${registry.wcagAaMinContrast}`)
  assert.equal(registry.curriculumRoadmaps.length, curriculum.sections.length)
  assert.deepEqual(
    registry.curriculumRoadmaps.map((entry) => entry.id),
    curriculum.sections.map((section) => section.id),
  )

  for (const entry of registry.curriculumRoadmaps) {
    const svg = fs.readFileSync(path.join(REPO, entry.file), 'utf8')
    assert.match(svg, /inventory identifiers, not a learning sequence/i, entry.file)
    assert.doesNotMatch(svg, /Phase 0\d|curriculum roadmap/i, entry.file)
  }

  const expectedPatterns = [
    'ai-gateway',
    'mcp-architecture',
    'multi-agent-orchestration',
    'rag-production',
  ]
  assert.deepEqual(
    registry.patterns.map((pattern) => pattern.id),
    expectedPatterns,
  )

})

test('every compiled SVG and living-world observatory plate matches recorded SHA-256 and provenance', () => {
  const registry = JSON.parse(fs.readFileSync(path.join(SITE, 'data/diagrams-registry.json'), 'utf8'))

  for (const entry of [...registry.curriculumRoadmaps, ...registry.patterns]) {
    const bytes = fs.readFileSync(path.join(REPO, entry.file))
    assert.equal(sha256(bytes), entry.sha256, entry.file)
    assert.ok(bytes.length < 512 * 1024, `${entry.file} exceeds 512 KiB SVG limit`)
    const text = bytes.toString('utf8')
    assert.doesNotMatch(text, FORBIDDEN_PUBLIC_TERMS, `${entry.file} leaked vendor term`)
  }

  const plateBytes = fs.readFileSync(path.join(REPO, registry.livingWorld.file))
  assert.equal(sha256(plateBytes), registry.livingWorld.sha256)
  assert.ok(plateBytes.length < 1024 * 1024, 'observatory plate exceeds 1 MiB JPG limit')

  const provenance = JSON.parse(fs.readFileSync(path.join(REPO, registry.livingWorld.provenance), 'utf8'))
  assert.equal(provenance.asset.sha256, registry.livingWorld.sha256)
  assert.equal(provenance.edition, 'editorial')
  assert.equal(provenance.source, 'founder-approved living-world visual series 2026-11-11')
  assert.ok(provenance.alt.length > 20)
})

test('explorer component and curriculum page obey CONTENT-CONTRACT.md count and safety rules', () => {
  const curriculum = JSON.parse(fs.readFileSync(path.join(SITE, 'data/curriculum.json'), 'utf8'))
  const registry = JSON.parse(fs.readFileSync(path.join(SITE, 'data/diagrams-registry.json'), 'utf8'))
  const totalItems = curriculum.sections.reduce((acc, s) => acc + s.count, 0)
  const dynamicCounts = new Set([
    totalItems,
    curriculum.sections.length,
    registry.patterns.length,
    ...curriculum.sections.map((s) => s.count),
  ])

  for (const rel of ['components/CurriculumVisualExplorer.tsx', 'app/curriculum/page.tsx']) {
    const src = fs.readFileSync(path.join(SITE, rel), 'utf8')
    assert.doesNotMatch(src, FORBIDDEN_PUBLIC_TERMS, `${rel} contains forbidden vendor string`)
    assert.doesNotMatch(src, /you will (?:learn|be able to)/i, `${rel} contains unbacked capability claim`)
    for (const count of dynamicCounts) {
      assert.ok(!new RegExp(`>[^<{]*\\b${count}\\b[^<{]*<`).test(src), `literal count ${count} typed in ${rel}`)
    }
  }

  const explorer = fs.readFileSync(path.join(SITE, 'components/CurriculumVisualExplorer.tsx'), 'utf8')
  const zoomMinimums = [...explorer.matchAll(/minWidth: '([\d.]+)rem'/g)].map((match) => Number(match[1]))
  assert.deepEqual(zoomMinimums, [44, 61.6, 79.2])
  assert.ok(zoomMinimums.every((width, index) => index === 0 || width > zoomMinimums[index - 1]))
  assert.match(explorer, /minWidth: activeZoom\.minWidth/)
})

test('markdown guides embed valid relative links to compiled SVGs and public files', () => {
  for (const guideRel of ['01-design-patterns/README.md', '02-learning-paths/README.md']) {
    const guidePath = path.join(REPO, guideRel)
    const guideDir = path.dirname(guidePath)
    const content = fs.readFileSync(guidePath, 'utf8')
    assert.doesNotMatch(content, FORBIDDEN_PUBLIC_TERMS, `${guideRel} contains forbidden vendor string`)

    const links = [...content.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)].map((m) => m[1])
    assert.ok(links.some((href) => href.endsWith('.svg')), `${guideRel} must embed compiled SVG diagrams`)
    for (const href of links) {
      if (/^https?:\/\//.test(href)) continue
      const resolved = path.resolve(guideDir, href)
      assert.ok(fs.existsSync(resolved), `broken relative target ${href} in ${guideRel}`)
    }
  }
})
