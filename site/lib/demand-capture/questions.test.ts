import { test } from 'node:test'
import assert from 'node:assert/strict'
import { rolesFor, ROLES, URGENCY, PRICE_BANDS, PAIN_PROMPT, ALTERNATIVE_PROMPT, PRICE_PROMPT } from './questions.ts'

test('exports constant values', () => {
  assert.ok(URGENCY.length > 0)
  assert.ok(PRICE_BANDS.length > 0)
  assert.ok(typeof PAIN_PROMPT === 'string')
  assert.ok(typeof ALTERNATIVE_PROMPT === 'string')
  assert.ok(typeof PRICE_PROMPT === 'string')
})

test('rolesFor returns product specific roles if available', () => {
  const roles = rolesFor('ai-architect-academy')
  assert.equal(roles, ROLES['ai-architect-academy'])
  assert.notEqual(roles, ROLES.default)
})

test('rolesFor returns default roles if product not found', () => {
  const roles = rolesFor('unknown-product')
  assert.equal(roles, ROLES.default)
})

test('rolesFor returns default roles if product is undefined', () => {
  const roles = rolesFor(undefined as any)
  assert.equal(roles, ROLES.default)
})
