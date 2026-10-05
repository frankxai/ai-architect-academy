#!/usr/bin/env node
// Applies the two assertions of eval:adr-has-rejected-options to an ADR markdown file.
//
//   node check-adr.mjs path/to/adr.md
//
// Prints one line per assertion using the ids from
// site/lib/academy-graph/production-agent-systems.ts, then a JSON summary in the
// shape advance.ts records (passedAssertions / failedAssertions). Exits 0 only when
// both pass. Node 18 or later, no dependencies. Copy it into your own repository so
// the run is reproducible from there. `node --test check-adr.test.mjs` runs it
// against the fixtures next to it.
//
// What it checks is shape: the five required headings in order, at least two
// top-level entries under options considered with a rejection verb followed by a
// reason, and a non-empty reversal section. It cannot tell a straw man from a
// credible option or an observable condition from a vague one. rubric.md says how
// a person judges those, and review:architecture-defence is where they are caught.
// Where the script and a person applying rubric.md disagree on shape, the person's
// reading wins; the script's verb list and entry markers are finite.

import { readFileSync } from 'node:fs'

const REQUIRED_SECTIONS = [
  'context',
  'options considered',
  'decision',
  'consequences',
  'what would reverse this',
]

const REJECTION_VERBS =
  /\b(?:reject(?:ed|s|ing)?|not chosen|not selected|rul(?:ed|ing) out|discard(?:ed|ing)?|declin(?:ed|e|ing)|set aside|dropped|chose\b[^.\n]{1,80}?\bover)\b/gi
const NEGATED_BEFORE = /(?:\bnot|\bnever|n't)\s+$/i
const PLACEHOLDER = /^(?:todo|tbd|tba|n\/a|none|\.{3}|…|-)$/i
const MIN_WORDS_AFTER_VERB = 8

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

function sections(lines) {
  const all = headings(lines)
  const found = new Map()
  let cursor = 0
  for (const name of REQUIRED_SECTIONS) {
    const position = all.findIndex((h, i) => i >= cursor && h.text === name)
    if (position === -1) continue
    const heading = all[position]
    const next = all.find((h, i) => i > position && h.level <= heading.level)
    const end = next ? next.index : lines.length
    found.set(name, lines.slice(heading.index + 1, end))
    cursor = position + 1
  }
  const outOfOrder = REQUIRED_SECTIONS.filter(
    (name) => !found.has(name) && all.some((h) => h.text === name),
  )
  return { found, outOfOrder }
}

// An entry is a top-level item: a sub-heading, or, where the section has none, a
// numbered item, bullet or bold-labelled paragraph at the shallowest indentation.
// The kind of the first top-level marker sets the list; a marker of the same kind
// at the same depth starts the next entry, and everything else, including nested
// bullets under an option, belongs to the entry above it.
const MARKERS = [
  { kind: 'heading', re: /^(#{1,6})\s+\S/ },
  { kind: 'numbered', re: /^(\s*)\d+[.)]\s+\S/ },
  { kind: 'bullet', re: /^(\s*)[-*+]\s+\S/ },
  { kind: 'label', re: /^(\s*)(?:\*\*|__)[^*_\s][^\n]*?(?:\*\*|__)/ },
]

function markerOf(line) {
  for (const { kind, re } of MARKERS) {
    const match = re.exec(line)
    if (match) return { kind, depth: match[1].length }
  }
  return null
}

function entries(sectionLines) {
  const marked = []
  let inFence = false
  for (const line of sectionLines) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence
    if (inFence) continue
    marked.push({ line, marker: markerOf(line) })
  }
  const markers = marked.filter((m) => m.marker)
  if (markers.length === 0) return []

  const headingMarkers = markers.filter((m) => m.marker.kind === 'heading')
  let top
  if (headingMarkers.length) {
    top = { kind: 'heading', depth: Math.min(...headingMarkers.map((m) => m.marker.depth)) }
  } else {
    const depth = Math.min(...markers.map((m) => m.marker.depth))
    top = { kind: markers.find((m) => m.marker.depth === depth).marker.kind, depth }
  }

  const list = []
  for (const { line, marker } of marked) {
    const starts = marker && marker.kind === top.kind && marker.depth === top.depth
    if (starts) list.push(line)
    else if (list.length && line.trim() !== '') list[list.length - 1] += ' ' + line
  }
  return list
}

function rejectionWordCounts(text) {
  const counts = []
  for (const match of text.matchAll(REJECTION_VERBS)) {
    if (NEGATED_BEFORE.test(text.slice(0, match.index))) continue
    const after = text.slice(match.index + match[0].length)
    counts.push((after.match(/[a-z]+/gi) ?? []).length)
  }
  return counts
}

function twoOptionsMinimum(found) {
  const section = found.get('options considered')
  if (!section) return ['"options considered" heading is missing or out of order']
  const problems = []
  const items = entries(section)
  if (items.length < 2) {
    problems.push(
      `options considered has ${items.length} top-level entr${items.length === 1 ? 'y' : 'ies'}; need at least 2 (sub-headings, numbered items, bullets or bold-labelled paragraphs at the shallowest depth; nested bullets belong to the option above them)`,
    )
  }
  const rejections = items.flatMap(rejectionWordCounts)
  if (rejections.length === 0) {
    problems.push(
      'no entry is rejected (looked for: rejected, rejecting, not chosen, not selected, ruled out, discarded, declined, set aside, dropped, chose X over Y; a verb preceded by "not" or "never" does not count)',
    )
  } else if (Math.max(...rejections) < MIN_WORDS_AFTER_VERB) {
    problems.push(
      `an entry is rejected but fewer than ${MIN_WORDS_AFTER_VERB} words follow the rejection; state the reason in the entry`,
    )
  }
  return problems
}

function reversalCondition(found) {
  const section = found.get('what would reverse this')
  if (!section) return ['"what would reverse this" heading is missing or out of order']
  const text = section
    .join('\n')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim()
  if (text === '' || PLACEHOLDER.test(text)) return ['the section is empty or holds only a placeholder']
  return []
}

const path = process.argv[2]
if (!path) {
  console.error('usage: node check-adr.mjs path/to/adr.md')
  process.exit(2)
}

let lines
try {
  lines = readFileSync(path, 'utf8').split(/\r?\n/)
} catch (error) {
  console.error(`cannot read ${path}: ${error.message}`)
  process.exit(2)
}

const { found, outOfOrder } = sections(lines)
const missing = REQUIRED_SECTIONS.filter((name) => !found.has(name) && !outOfOrder.includes(name))
if (missing.length || outOfOrder.length) {
  if (missing.length) console.log(`required sections missing: ${missing.join(', ')}`)
  if (outOfOrder.length) console.log(`required sections present but out of order: ${outOfOrder.join(', ')}`)
  console.log('headings are matched case-insensitively against the graph text; extra headings are allowed')
}

const results = {
  'two-options-minimum': twoOptionsMinimum(found),
  'reversal-condition': reversalCondition(found),
}

const passedAssertions = []
const failedAssertions = []
for (const [id, problems] of Object.entries(results)) {
  const ok = problems.length === 0 && missing.length === 0 && outOfOrder.length === 0
  ;(ok ? passedAssertions : failedAssertions).push(id)
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${id}${problems.length ? ': ' + problems.join('; ') : ''}`)
}

console.log(
  JSON.stringify(
    {
      evalId: 'eval:adr-has-rejected-options',
      artifact: 'artifact:architecture-decision',
      ranAt: new Date().toISOString(),
      passedAssertions,
      failedAssertions,
    },
    null,
    2,
  ),
)

process.exit(failedAssertions.length === 0 ? 0 : 1)
