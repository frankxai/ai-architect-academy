#!/usr/bin/env node
// Applies the two assertions of eval:threat-model-covers-tool-results to a threat-model
// markdown file.
//
//   node check-threat-model.mjs path/to/threat-model.md [--commit <hash>] [--matrix path/to/authority-matrix.json]
//
// Prints one line per assertion using the ids from
// site/lib/academy-graph/production-agent-systems.ts, then a JSON record in the shape
// advance.ts reads (passedAssertions / failedAssertions) with the commit the file was at.
// Exits 0 only when both assertions pass, 1 when one fails, 2 when the file is returned
// unscored (a required heading is missing or renamed) or cannot be read. Node 18 or
// later, no dependencies. Copy it into your own repository so the run is reproducible
// from there.
//
// What it checks is what the graph's check wording says and nothing more: the five
// required headings exist; the untrusted-inputs section names tool results or retrieved
// documents (generically, or by a tool name from --matrix); the accepted-risks section is
// non-empty and not a placeholder. It cannot tell a mechanism from a prompt line or a
// residual from a restated control. rubric.md's module bar is where a person judges
// those; what they find is a note beside this record and does not change it.
//
// The commit is taken from --commit when given, otherwise from `git rev-parse HEAD` in
// the file's directory. A record without a commit is not replayable; the script says so.

import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const EVAL_ID = 'eval:threat-model-covers-tool-results'
const ARTIFACT_ID = 'artifact:threat-model'

const REQUIRED_SECTIONS = ['trust boundaries', 'untrusted inputs', 'abuse cases', 'mitigations', 'accepted risks']

// Generic wording the graph's check accepts for tool-results-untrusted.
const GENERIC_SOURCE = [
  /\btool[- ](?:results?|outputs?|responses?|return values?)\b/i,
  /\b(?:api|vendor|service|upstream) (?:responses?|results?|response bod(?:y|ies)|payloads?)\b/i,
  /\bretriev(?:ed|al)\b/i,
  /\b(?:fetched|indexed) (?:documents?|chunks?|articles?|pages?|content|text)\b/i,
  /\bsearch results?\b/i,
  /\bknowledge[- ]base\b/i,
  /\bhelp[- ]cent(?:re|er)\b/i,
]

const PLACEHOLDER = /^(?:none|none at this time|no accepted risks|n\/a|na|nil|tbd|tba|todo|nothing|-|\.{3}|…)[.!]?$/i

const normalise = (text) =>
  text
    .toLowerCase()
    .replace(/[`*_~]/g, '')
    .replace(/[.:!?]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()

function headings(lines) {
  const out = []
  let inFence = false
  lines.forEach((line, index) => {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence
    if (inFence) return
    const match = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line)
    if (match) out.push({ index, level: match[1].length, text: normalise(match[2]) })
  })
  return out
}

// Level does not matter. Order is required by rubric.md but not tested here; the reviewer
// applies it by hand. A required heading that appears twice is scored on its first
// occurrence and reported.
function sections(lines) {
  const all = headings(lines)
  const found = new Map()
  const duplicated = []
  for (const name of REQUIRED_SECTIONS) {
    const hits = all.filter((h) => h.text === name)
    if (hits.length === 0) continue
    if (hits.length > 1) duplicated.push(name)
    const heading = hits[0]
    const next = all.find((h) => h.index > heading.index && h.level <= heading.level)
    const end = next ? next.index : lines.length
    found.set(name, lines.slice(heading.index + 1, end))
  }
  return { found, duplicated }
}

const sectionText = (sectionLines) =>
  sectionLines
    .join('\n')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim()

function loadMatrix(path) {
  if (!path) return null
  const raw = JSON.parse(readFileSync(path, 'utf8'))
  const tools = Array.isArray(raw.tools) ? raw.tools : []
  const named = tools.filter((t) => typeof t.name === 'string' && t.name.length)
  return {
    names: named.map((t) => t.name),
    readTools: named.filter((t) => t.sideEffecting !== true).map((t) => t.name),
    sideEffecting: named.filter((t) => t.sideEffecting === true).map((t) => t.name),
  }
}

const mentions = (text, name) => new RegExp(`(?<![\\w.])${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w])`).test(text)

function toolResultsUntrusted(found, matrix) {
  const text = sectionText(found.get('untrusted inputs'))
  const hits = []
  for (const pattern of GENERIC_SOURCE) {
    const match = pattern.exec(text)
    if (match) hits.push(`"${match[0]}"`)
  }
  if (matrix) for (const name of matrix.names) if (mentions(text, name)) hits.push(`tool ${name}`)
  if (hits.length === 0) {
    return {
      problems: ['the untrusted-inputs section names no tool result or retrieved document (looked for generic wording such as "tool results", "retrieved documents", "API response", and any --matrix tool name)'],
      notes: [],
    }
  }
  return { problems: [], notes: [`named: ${[...new Set(hits)].join(', ')}`] }
}

function acceptedRisksNamed(found) {
  const text = sectionText(found.get('accepted risks'))
  if (text === '') return { problems: ['the accepted-risks section is empty'], notes: [] }
  if (PLACEHOLDER.test(normalise(text))) return { problems: [`the accepted-risks section holds only "${text}"`], notes: [] }
  return { problems: [], notes: [] }
}

// Not part of the eval. Two of the module-bar items in rubric.md can be counted, so they
// are printed here to save the reviewer a search; the verdict on them is still a person's.
function moduleBarNotes(found, matrix) {
  if (!matrix) return ['module bar: pass --matrix <authority-matrix.json> to list read tools missing from untrusted inputs and sideEffecting tools missing from abuse cases']
  const untrusted = sectionText(found.get('untrusted inputs'))
  const abuse = sectionText(found.get('abuse cases'))
  const notes = []
  const missingUntrusted = matrix.readTools.filter((n) => !mentions(untrusted, n))
  const missingAbuse = matrix.sideEffecting.filter((n) => !mentions(abuse, n))
  if (missingUntrusted.length) notes.push(`module bar: read tools not named under untrusted inputs: ${missingUntrusted.join(', ')}`)
  if (missingAbuse.length) notes.push(`module bar: sideEffecting tools with no mention under abuse cases: ${missingAbuse.join(', ')}`)
  if (!notes.length) notes.push('module bar: every read tool is named under untrusted inputs and every sideEffecting tool under abuse cases')
  return notes
}

function commitFor(path, given) {
  if (given) return { commit: given, dirty: null, source: 'argument' }
  const cwd = dirname(resolve(path))
  try {
    const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
    const status = execFileSync('git', ['status', '--porcelain', '--', resolve(path)], { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
    return { commit, dirty: status.length > 0, source: 'git' }
  } catch {
    return { commit: null, dirty: null, source: 'none' }
  }
}

const args = process.argv.slice(2)
const flags = {}
const positional = []
for (let i = 0; i < args.length; i += 1) {
  if (args[i] === '--commit' || args[i] === '--matrix') {
    flags[args[i]] = args[i + 1]
    i += 1
  } else positional.push(args[i])
}
const path = positional[0]
const flag = (name) => flags[name]
if (!path) {
  console.error('usage: node check-threat-model.mjs path/to/threat-model.md [--commit <hash>] [--matrix path/to/authority-matrix.json]')
  process.exit(2)
}

let lines
try {
  lines = readFileSync(path, 'utf8').split(/\r?\n/)
} catch (error) {
  console.error(`cannot read ${path}: ${error.message}`)
  process.exit(2)
}

let matrix = null
try {
  matrix = loadMatrix(flag('--matrix'))
} catch (error) {
  console.error(`cannot read matrix: ${error.message}`)
  process.exit(2)
}

const { found, duplicated } = sections(lines)
const missing = REQUIRED_SECTIONS.filter((name) => !found.has(name))
const { commit, dirty, source } = commitFor(path, flag('--commit'))

if (missing.length) {
  console.log(`RETURNED  required headings missing or renamed: ${missing.join(', ')}`)
  console.log('headings are matched case-insensitively against the graph wording; level does not matter; this script does not test order, the reviewer does; the assertions are not scored until all five exist, and the reviewer then records both as failed by hand (rubric.md)')
  console.log(JSON.stringify({ evalId: EVAL_ID, artifact: ARTIFACT_ID, file: path, commit, returned: true, missingSections: missing, ranAt: new Date().toISOString() }, null, 2))
  process.exit(2)
}
if (duplicated.length) console.log(`note: heading appears more than once, first occurrence scored: ${duplicated.join(', ')}`)

const results = {
  'tool-results-untrusted': toolResultsUntrusted(found, matrix),
  'accepted-risks-named': acceptedRisksNamed(found),
}

const passedAssertions = []
const failedAssertions = []
for (const [id, { problems, notes }] of Object.entries(results)) {
  const ok = problems.length === 0
  ;(ok ? passedAssertions : failedAssertions).push(id)
  const detail = [...problems, ...notes].join('; ')
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${id}${detail ? ': ' + detail : ''}`)
}

for (const note of moduleBarNotes(found, matrix)) console.log(note)
if (!commit) console.log('note: no commit recorded; pass --commit <hash> or run inside the repository, otherwise this record cannot be replayed')
if (dirty) console.log('note: the file has uncommitted changes; the record names a commit that does not contain what was checked')

console.log(
  JSON.stringify(
    {
      evalId: EVAL_ID,
      artifact: ARTIFACT_ID,
      file: path,
      commit,
      commitSource: source,
      dirty,
      ranAt: new Date().toISOString(),
      passedAssertions,
      failedAssertions,
    },
    null,
    2,
  ),
)

process.exit(failedAssertions.length === 0 ? 0 : 1)
