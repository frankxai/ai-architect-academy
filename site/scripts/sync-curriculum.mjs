// Reads the public curriculum folders one level up and writes data/curriculum.json,
// so every count on the site is a measurement of the repo, never a typed number.
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const REPO = 'https://github.com/frankxai/ai-architect-academy/tree/main'

// The public site must not name any vendor's proprietary framework or cloud
// (owner-safety rule in the site brief). Repo files that do are left in the
// repository but are not listed or counted here.
const EXCLUDE = /oracle|\boci\b|\badk\b/i
const listed = (items) => items.filter((i) => !EXCLUDE.test(i.title) && !EXCLUDE.test(i.href))

const titleOf = (file, fallback) => {
  const h1 = readFileSync(file, 'utf8').match(/^#\s+(.+)$/m)
  return (h1 ? h1[1] : fallback).replace(/[*_`]/g, '').trim()
}

const mdFiles = (dir) =>
  readdirSync(join(root, dir))
    .filter((f) => f.endsWith('.md') && f.toLowerCase() !== 'readme.md')
    .sort()
    .map((f) => ({ title: titleOf(join(root, dir, f), f.replace(/\.md$/, '')), href: `${REPO}/${dir}/${f}` }))

const subdirs = (dir) =>
  readdirSync(join(root, dir))
    .filter((f) => statSync(join(root, dir, f)).isDirectory())
    .sort()
    .map((f) => ({ title: f, href: `${REPO}/${dir}/${f}` }))

const sections = [
  { id: 'patterns', label: 'Design patterns', dir: '01-design-patterns', items: mdFiles('01-design-patterns') },
  { id: 'labs', label: 'Hands-on labs', dir: 'labs', items: subdirs('labs') },
  { id: 'micro', label: 'Micro-modules', dir: '02-learning-paths/micro-modules', items: mdFiles('02-learning-paths/micro-modules') },
  { id: 'paths', label: 'Learning paths', dir: '02-learning-paths', items: mdFiles('02-learning-paths') },
  { id: 'governance', label: 'Governance', dir: '08-governance', items: mdFiles('08-governance') },
  { id: 'evaluation', label: 'Evaluation', dir: '07-evaluation', items: mdFiles('07-evaluation') },
  { id: 'workflows', label: 'Workflows', dir: '15-workflows', items: mdFiles('15-workflows') },
]

const out = {
  measuredAt: new Date().toISOString().slice(0, 10),
  repo: 'https://github.com/frankxai/ai-architect-academy',
  sections: sections.map((s) => ({ ...s, items: listed(s.items), count: listed(s.items).length })),
}
writeFileSync(join(root, 'site', 'data', 'curriculum.json'), JSON.stringify(out, null, 2) + '\n')
console.log(out.sections.map((s) => `${s.label}: ${s.count}`).join('\n'))
