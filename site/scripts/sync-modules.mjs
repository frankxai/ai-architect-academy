// Scans curriculum/production-agent-systems/ and writes data/modules.json, so the /path pages link
// to module files that exist and never retype a title or a lab reference.
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const site = join(dirname(fileURLToPath(import.meta.url)), '..')
const root = join(site, '..')
const PATH_DIR = 'curriculum/production-agent-systems'
const REPO = 'https://github.com/frankxai/ai-architect-academy/blob/main'
const FILES = ['README.md', 'exercise.md', 'rubric.md']

const dir = join(root, PATH_DIR)
if (!existsSync(dir)) throw new Error(`${PATH_DIR} does not exist`)

const modules = readdirSync(dir)
  .filter((name) => /^\d{2}-[a-z0-9-]+$/.test(name) && statSync(join(dir, name)).isDirectory())
  .sort()
  .map((slug) => {
    const read = (f) => (existsSync(join(dir, slug, f)) ? readFileSync(join(dir, slug, f), 'utf8') : null)
    const readme = read('README.md')
    // Authors number their H1s differently ("01 · Brief", "07 — Deployment"); the order already lives in the slug.
    const title = readme
      ?.match(/^#\s+(.+)$/m)?.[1]
      .replace(/[*_`]/g, '')
      .replace(/^(stage\s+)?\d{1,2}\s*[·—:.-]\s*/i, '')
      .trim()
    if (!title) throw new Error(`${slug}: README.md is missing or has no H1`)
    const labs = [...new Set(FILES.flatMap((f) => [...(read(f) ?? '').matchAll(/labs\/(\d{2}-[a-z0-9-]+)/g)].map((m) => m[1])))]
      .filter((lab) => existsSync(join(root, 'labs', lab)))
      .sort()
    return {
      order: Number(slug.slice(0, 2)),
      slug,
      title,
      files: Object.fromEntries(FILES.map((f) => [f.replace('.md', ''), read(f) ? `${REPO}/${PATH_DIR}/${slug}/${f}` : null])),
      labs: labs.map((lab) => ({ slug: lab, href: `https://github.com/frankxai/ai-architect-academy/tree/main/labs/${lab}` })),
    }
  })

const out = { measuredAt: new Date().toISOString().slice(0, 10), path: PATH_DIR, modules }
writeFileSync(join(site, 'data', 'modules.json'), JSON.stringify(out, null, 2) + '\n')
for (const m of modules) {
  const missing = Object.entries(m.files).filter(([, href]) => !href).map(([k]) => k)
  console.log(`${m.slug}: ${m.title}${missing.length ? ` · MISSING ${missing.join(', ')}` : ''}${m.labs.length ? ` · labs ${m.labs.map((l) => l.slug).join(', ')}` : ''}`)
}
