// The graph defines the stages; the curriculum must supply a complete module for every one of them.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { projectProductionAgentSystems as project } from '../lib/academy-graph/production-agent-systems.ts'

const data = JSON.parse(readFileSync(new URL('../data/modules.json', import.meta.url), 'utf8'))

test('every graph stage has exactly one module, matched by ordinal', () => {
  const orders = data.modules.map((m) => m.order)
  assert.deepEqual(orders, project.stages.map((s) => s.ordinal))
})

test('every module has its lesson, exercise and rubric', () => {
  for (const m of data.modules) {
    for (const [kind, href] of Object.entries(m.files)) assert.ok(href, `${m.slug} is missing ${kind}`)
  }
})

test('module slugs are unique and ordered', () => {
  const slugs = data.modules.map((m) => m.slug)
  assert.equal(new Set(slugs).size, slugs.length)
  assert.deepEqual([...slugs].sort(), slugs)
})
