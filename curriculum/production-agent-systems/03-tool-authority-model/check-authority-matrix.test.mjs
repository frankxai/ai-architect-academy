// Structural authority must bind tool rows to real declarations; an omitted
// principal cannot make the revocation requirement vacuously true.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const checker = new URL('./check-authority-matrix.mjs', import.meta.url)
const matrix = () => ({
  tools: [
    { name: 'read_ticket', authority: 'read', sideEffecting: false, principal: 'reader' },
    { name: 'issue_refund', authority: 'refund', sideEffecting: true, principal: 'refund-issuer' },
  ],
  principals: [
    { id: 'reader', revocationPath: 'Revoke the read role; the next read fails.' },
    { id: 'refund-issuer', revocationPath: 'Revoke the refund token; the next refund fails.' },
  ],
  sideEffecting: ['issue_refund'],
  revocationPath: {
    reader: 'Revoke the read role; the next read fails.',
    'refund-issuer': 'Revoke the refund token; the next refund fails.',
  },
})

function run(doc) {
  const dir = mkdtempSync(join(tmpdir(), 'authority-matrix-'))
  try {
    const path = join(dir, 'matrix.json')
    writeFileSync(path, JSON.stringify(doc))
    const result = spawnSync(process.execPath, [checker.pathname, path], { encoding: 'utf8' })
    const start = result.stdout.indexOf('{\n  "evalId"')
    const end = result.stdout.indexOf('\n}\n', start) + 2
    return { code: result.status, stdout: result.stdout, ...JSON.parse(result.stdout.slice(start, end)) }
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

test('a resolved authority matrix passes every graph assertion', () => {
  const r = run(matrix())
  assert.equal(r.code, 0, r.stdout)
  assert.deepEqual(r.failedAssertions, [])
})

test('a used principal absent from declarations cannot pass through empty arrays', () => {
  const doc = matrix()
  doc.principals = []
  doc.revocationPath = {}
  const r = run(doc)
  assert.equal(r.code, 1, r.stdout)
  assert.ok(r.failedAssertions.includes('revocation-documented'))
})

test('read tools also require a declared principal and revocation path', () => {
  const doc = matrix()
  doc.tools[0].principal = 'unlisted-reader'
  const r = run(doc)
  assert.equal(r.code, 1, r.stdout)
  assert.ok(r.failedAssertions.includes('revocation-documented'))
})

test('a principal declaration without its map entry fails', () => {
  const doc = matrix()
  delete doc.revocationPath['refund-issuer']
  const r = run(doc)
  assert.equal(r.code, 1, r.stdout)
  assert.ok(r.failedAssertions.includes('revocation-documented'))
})

test('revocation map entries must be non-empty strings', () => {
  for (const value of [null, true, 23, {}, '', '   ']) {
    const doc = matrix()
    doc.revocationPath['refund-issuer'] = value
    const r = run(doc)
    assert.equal(r.code, 1, r.stdout)
    assert.ok(r.failedAssertions.includes('revocation-documented'))
  }
})

test('a different path in the declaration and the map fails', () => {
  const doc = matrix()
  doc.revocationPath['refund-issuer'] = 'Disable some unrelated token.'
  const r = run(doc)
  assert.equal(r.code, 1, r.stdout)
  assert.ok(r.failedAssertions.includes('revocation-documented'))
})

test('duplicate or empty principal ids cannot hide an unresolved declaration', () => {
  for (const principal of [matrix().principals[0], { id: '', revocationPath: 'Revoke the key.' }]) {
    const doc = matrix()
    doc.principals.push(principal)
    const r = run(doc)
    assert.equal(r.code, 1, r.stdout)
    assert.ok(r.failedAssertions.includes('revocation-documented'))
  }
})

test('a revocation map entry outside declared principals fails', () => {
  const doc = matrix()
  doc.revocationPath['unlisted'] = 'Revoke some key.'
  const r = run(doc)
  assert.equal(r.code, 1, r.stdout)
  assert.ok(r.failedAssertions.includes('revocation-documented'))
})
