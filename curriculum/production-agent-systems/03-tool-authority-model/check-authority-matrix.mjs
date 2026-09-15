#!/usr/bin/env node
// Applies the three assertions of eval:authority-least-privilege to a tool-authority-matrix.json.
//
//   node check-authority-matrix.mjs path/to/tool-authority-matrix.json
//
// Reads only the JSON file. Prints one line per assertion using the ids from
// site/lib/academy-graph/production-agent-systems.ts, then the lab's additions and the
// derived-field consistency as REVISE lines, then a JSON summary in the shape advance.ts
// records (passedAssertions / failedAssertions). Exits 0 only when every graph assertion
// passes; REVISE lines never change the exit code. Node 18 or later, no dependencies.
//
// Run it from this repository against the learner's committed file. It is deliberately not
// part of the lab, so nothing a learner edits can change what it reports.
//
// What it cannot do: it cannot tell two principal ids that pull the same key apart, cannot
// see whether a revocation path was exercised, cannot compare the file against the tool
// registry, and cannot find a credential name or a hostname. rubric.md says how a person
// judges those.

import { readFileSync } from 'node:fs'

const EVAL_ID = 'eval:authority-least-privilege'
const ARTIFACT_ID = 'artifact:tool-authority-matrix'

// artifact:tool-authority-matrix.requiredSections, with the JSON type each must hold.
const REQUIRED_SECTIONS = [
  ['tools', Array.isArray, 'an array'],
  ['principals', Array.isArray, 'an array'],
  ['sideEffecting', Array.isArray, 'an array'],
  ['revocationPath', (v) => v !== null && typeof v === 'object' && !Array.isArray(v), 'an object'],
]

const label = (tool, index) =>
  tool && typeof tool === 'object' && typeof tool.name === 'string' ? tool.name : `tools[${index}]`

const isRecord = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)

function sideEffectingFlagged(doc) {
  const problems = []
  doc.tools.forEach((tool, index) => {
    if (!isRecord(tool)) {
      problems.push(`tools[${index}] is not an object`)
      return
    }
    if (typeof tool.sideEffecting !== 'boolean') {
      problems.push(`${label(tool, index)}: sideEffecting is ${JSON.stringify(tool.sideEffecting)}; it must be JSON true or false`)
    }
  })
  return problems
}

function noSharedPrincipalForWrites(doc) {
  const problems = []
  const groups = new Map()
  doc.tools.forEach((tool, index) => {
    if (!isRecord(tool) || tool.sideEffecting !== true) return
    if (typeof tool.principal !== 'string' || tool.principal.trim() === '') {
      problems.push(`${label(tool, index)} is side-effecting and names no principal`)
      return
    }
    const members = groups.get(tool.principal) ?? []
    members.push(label(tool, index))
    groups.set(tool.principal, members)
  })
  for (const [principal, members] of groups) {
    if (members.length > 1) {
      problems.push(`principal "${principal}" backs ${members.length} side-effecting tools: ${members.join(', ')}`)
    }
  }
  return problems
}

function revocationDocumented(doc) {
  const problems = []
  doc.principals.forEach((principal, index) => {
    const id = isRecord(principal) && typeof principal.id === 'string' ? principal.id : `principals[${index}]`
    if (!isRecord(principal)) {
      problems.push(`principals[${index}] is not an object`)
      return
    }
    if (typeof principal.revocationPath !== 'string' || principal.revocationPath.trim() === '') {
      problems.push(`${id}: revocationPath is ${JSON.stringify(principal.revocationPath)}; it must be a non-empty string`)
    }
  })
  return problems
}

// Not graph assertions. The first two are lab 05's test_matrix.py additions; the rest check
// that the derived fields agree with tools[] and principals[], which a reader is told to trust.
function reviewerLines(doc) {
  const lines = []
  const tools = doc.tools.filter(isRecord)
  const flagged = doc.tools
    .map((t, i) => (isRecord(t) && t.sideEffecting === true ? label(t, i) : null))
    .filter((n) => n !== null)
  const used = new Set(tools.map((t) => t.principal).filter((p) => typeof p === 'string'))
  const declared = new Set(doc.principals.filter(isRecord).map((p) => p.id).filter((p) => typeof p === 'string'))
  const mapped = new Set(Object.keys(doc.revocationPath))

  if (flagged.length === 0) {
    lines.push('lab 05 addition: no tool is flagged side-effecting; a matrix for an agent that writes, sends, spends or deletes has not been filled in')
  }
  const unmapped = [...used].filter((p) => !mapped.has(p))
  if (unmapped.length) {
    lines.push(`lab 05 addition: tools name principals absent from the revocationPath map: ${unmapped.join(', ')}`)
  }
  const undeclared = [...used].filter((p) => !declared.has(p))
  if (undeclared.length) {
    lines.push(`consistency: tools name principals absent from principals[]: ${undeclared.join(', ')}`)
  }
  const listed = new Set(doc.sideEffecting.filter((n) => typeof n === 'string'))
  const missingFromList = flagged.filter((n) => !listed.has(n))
  const extraInList = [...listed].filter((n) => !flagged.includes(n))
  if (missingFromList.length) {
    lines.push(`consistency: tools flagged sideEffecting: true but absent from the sideEffecting list: ${missingFromList.join(', ')}`)
  }
  if (extraInList.length) {
    lines.push(`consistency: sideEffecting list names tools not flagged true in tools[]: ${extraInList.join(', ')}`)
  }
  const mapMissing = [...declared].filter((id) => !mapped.has(id))
  const mapExtra = [...mapped].filter((id) => !declared.has(id))
  if (mapMissing.length) {
    lines.push(`consistency: principals[] ids absent from the revocationPath map: ${mapMissing.join(', ')}`)
  }
  if (mapExtra.length) {
    lines.push(`consistency: revocationPath map has ids absent from principals[]: ${mapExtra.join(', ')}`)
  }
  for (const principal of doc.principals.filter(isRecord)) {
    if (mapped.has(principal.id) && doc.revocationPath[principal.id] !== principal.revocationPath) {
      lines.push(`consistency: revocationPath map entry for "${principal.id}" differs from principals[]`)
    }
  }
  return lines
}

const path = process.argv[2]
if (!path) {
  console.error('usage: node check-authority-matrix.mjs path/to/tool-authority-matrix.json')
  process.exit(2)
}

let doc
try {
  doc = JSON.parse(readFileSync(path, 'utf8'))
} catch (error) {
  console.error(`cannot parse ${path} as JSON: ${error.message}`)
  process.exit(2)
}

const sectionProblems = []
if (!isRecord(doc)) {
  sectionProblems.push('the file is not a JSON object')
} else {
  for (const [key, ok, expected] of REQUIRED_SECTIONS) {
    if (!(key in doc)) sectionProblems.push(`required section "${key}" is missing`)
    else if (!ok(doc[key])) sectionProblems.push(`required section "${key}" is present but is not ${expected}`)
  }
}

const assertions = [
  ['side-effecting-flagged', sideEffectingFlagged],
  ['no-shared-principal-for-writes', noSharedPrincipalForWrites],
  ['revocation-documented', revocationDocumented],
]
const passedAssertions = []
const failedAssertions = []

if (sectionProblems.length) {
  console.log(`${ARTIFACT_ID}.requiredSections not met; every assertion fails:`)
  for (const p of sectionProblems) console.log(`     ${p}`)
  for (const [id] of assertions) {
    failedAssertions.push(id)
    console.log(`FAIL ${id}`)
  }
} else {
  for (const [id, run] of assertions) {
    const problems = run(doc)
    if (problems.length === 0) {
      passedAssertions.push(id)
      console.log(`PASS ${id}`)
    } else {
      failedAssertions.push(id)
      console.log(`FAIL ${id}`)
      for (const p of problems) console.log(`     ${p}`)
    }
  }
  for (const line of reviewerLines(doc)) console.log(`REVISE ${line}`)
}

console.log(
  JSON.stringify(
    {
      evalId: EVAL_ID,
      artifact: ARTIFACT_ID,
      ranAt: new Date().toISOString().slice(0, 10),
      passedAssertions,
      failedAssertions,
    },
    null,
    2,
  ),
)
console.log(
  'Not checked here: whether two principals are one credential, whether any revocation path was exercised, whether tools[] matches the registry, whether the send arguments and body are bound, and whether a credential name or hostname appears. Apply rubric.md for those.',
)

process.exit(failedAssertions.length === 0 ? 0 : 1)
