import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

const read = (rel) => fs.readFileSync(new URL(`../../${rel}`, import.meta.url), 'utf8')

test('/agents.md route exposes canonical AI Architect Academy discovery links and consent rules', () => {
  const source = read('app/agents.md/route.ts')
  assert.match(source, /text\/markdown; charset=utf-8/)
  assert.match(source, /\/llms\.txt/)
  assert.match(source, /\/\.well-known\/academy\.json/)
  assert.match(source, /\/\.well-known\/agent\.json/)
  assert.match(source, /\/adr/)
  assert.match(source, /\/curriculum/)
  assert.match(source, /#waitlist/)
})

test('public/.well-known/agent.json satisfies starlight.agent.v1 discovery contract', () => {
  const doc = JSON.parse(read('public/.well-known/agent.json'))
  assert.equal(doc.schema, 'starlight.agent.v1')
  assert.equal(doc.canonical, 'https://aiarchitectacademy.com')
  assert.equal(doc.discovery.agentsMd, 'https://aiarchitectacademy.com/agents.md')
  assert.equal(doc.discovery.llmsTxt, 'https://aiarchitectacademy.com/llms.txt')
  assert.equal(doc.discovery.academyManifest, 'https://aiarchitectacademy.com/.well-known/academy.json')
  assert.ok(doc.disclosures.some((d) => d.includes('Waitlist-first')))
})
