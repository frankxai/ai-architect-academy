import { test } from 'node:test'
import assert from 'node:assert/strict'
import { publicState } from './handler.ts'
import type { ProductConfig } from './handler.ts'

const mockProduct: ProductConfig = {
  id: 'test-product',
  stage: 'concept',
  waitlist: { enabled: true, publicCountThreshold: 100, foundingCohort: 50 }
}

test('publicState withholds publicCount if below threshold', () => {
  const state = publicState(mockProduct, 99)
  assert.equal(state.publicCount, null)
  assert.equal(state.count, 99)
})

test('publicState exposes publicCount if at threshold', () => {
  const state = publicState(mockProduct, 100)
  assert.equal(state.publicCount, 100)
})

test('publicState exposes publicCount if above threshold', () => {
  const state = publicState(mockProduct, 150)
  assert.equal(state.publicCount, 150)
})

test('publicState calculates foundingSeatsLeft correctly when below cohort limit', () => {
  const state = publicState(mockProduct, 30)
  assert.equal(state.foundingSeatsLeft, 20)
})

test('publicState calculates foundingSeatsLeft correctly when at cohort limit', () => {
  const state = publicState(mockProduct, 50)
  assert.equal(state.foundingSeatsLeft, 0)
})

test('publicState calculates foundingSeatsLeft correctly when above cohort limit', () => {
  const state = publicState(mockProduct, 70)
  assert.equal(state.foundingSeatsLeft, 0)
})
