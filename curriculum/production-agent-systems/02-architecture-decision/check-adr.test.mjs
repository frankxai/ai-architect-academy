// Runs check-adr.mjs against the fixtures next to it and against the worked
// decision in README.md. `node --test check-adr.test.mjs` from this directory.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const checker = join(here, 'check-adr.mjs')

function run(path) {
  const result = spawnSync(process.execPath, [checker, path], { encoding: 'utf8' })
  const summary = JSON.parse(result.stdout.slice(result.stdout.indexOf('{')))
  return { code: result.status, stdout: result.stdout, ...summary }
}

test('one option with two nested sub-bullets fails two-options-minimum', () => {
  const r = run(join(here, 'fixtures', 'one-option.md'))
  assert.equal(r.code, 1)
  assert.deepEqual(r.failedAssertions, ['two-options-minimum'])
  assert.match(r.stdout, /has 1 top-level entry/)
})

test('a negated verb ("was not rejected") is not a rejection', () => {
  const r = run(join(here, 'fixtures', 'negated-rejection.md'))
  assert.equal(r.code, 1)
  assert.deepEqual(r.failedAssertions, ['two-options-minimum'])
  assert.match(r.stdout, /no entry is rejected/)
})

test('bold-labelled paragraphs are entries and "dropped" is a rejection', () => {
  const r = run(join(here, 'fixtures', 'paragraph-options.md'))
  assert.equal(r.code, 0)
  assert.deepEqual(r.passedAssertions, ['two-options-minimum', 'reversal-condition'])
})

test('two numbered options with nested sub-bullets count as two entries', () => {
  const r = run(join(here, 'fixtures', 'nested-sub-bullets.md'))
  assert.equal(r.code, 0)
  assert.deepEqual(r.passedAssertions, ['two-options-minimum', 'reversal-condition'])
})

test('sections out of order and a placeholder reversal fail both assertions', () => {
  const r = run(join(here, 'fixtures', 'out-of-order.md'))
  assert.equal(r.code, 1)
  assert.deepEqual(r.failedAssertions, ['two-options-minimum', 'reversal-condition'])
  assert.match(r.stdout, /out of order: what would reverse this/)
})

test('the worked decision in README.md passes both assertions', () => {
  const readme = readFileSync(join(here, 'README.md'), 'utf8')
  const fence = /```markdown\n([\s\S]*?)\n```/.exec(readme)
  assert.ok(fence, 'README.md holds the worked decision in a ```markdown fence')
  const dir = mkdtempSync(join(tmpdir(), 'adr-'))
  const path = join(dir, 'worked-decision.md')
  writeFileSync(path, fence[1])
  const r = run(path)
  assert.equal(r.code, 0, r.stdout)
  assert.deepEqual(r.passedAssertions, ['two-options-minimum', 'reversal-condition'])
})
