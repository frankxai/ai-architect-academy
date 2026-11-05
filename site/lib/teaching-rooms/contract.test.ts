import { test } from 'node:test'
import assert from 'node:assert/strict'
import { rooms, checkDraft, parseDraft, exportDraft, MAX_ANSWER, MAX_FILE } from './contract.ts'
import { publicAcademyStages } from '../academy-graph/experience.ts'

test('rooms project public artifacts and preserve graph obligations', () => {
  assert.deepEqual(rooms.map(room => room.id), publicAcademyStages().filter(stage => stage.artifact).map(stage => stage.id))
  assert.ok(!rooms.some(room => room.id.includes('threat') || room.id.includes('incident')))
  for (const room of rooms) { assert.ok(room.artifact?.requiredSections.length); assert.ok(room.evaluations.length); assert.deepEqual(room.reviewIds, publicAcademyStages().find(stage => stage.id === room.id)!.reviewIds) }
})
test('whitespace is missing and text presence never grants assessment', () => {
  const room = rooms[0]
  assert.ok(checkDraft({ roomId: room.id, answers: {} }).every(check => !check.present))
  const blank = Object.fromEntries(room.artifact!.requiredSections.map(section => [section, '  ']))
  assert.ok(checkDraft({ roomId: room.id, answers: blank }).every(check => !check.present))
  const answers = Object.fromEntries(room.artifact!.requiredSections.map(section => [section, 'An answer']))
  const exported = exportDraft({ roomId: room.id, answers }, '2026-11-04T00:00:00Z')
  assert.ok(exported.structureCheck.every(check => check.present))
  assert.equal(exported.assessment, 'not-assessed'); assert.equal(exported.competencyGranted, false)
})
test('round trip strips forged assessment fields and preserves inert text', () => {
  const draft = { roomId: rooms[0].id, answers: { [rooms[0].artifact!.requiredSections[0]]: '<script>untrusted text</script>' } }
  const payload = { ...exportDraft(draft, '2026-11-04T00:00:00Z'), competencyGranted: true, assessment: 'passed' }
  const restored = parseDraft(JSON.stringify(payload))
  assert.deepEqual(restored, draft); assert.equal(exportDraft(restored, '2026-11-04T00:00:00Z').competencyGranted, false)
})
test('rejects malformed, oversized, hidden and unknown rooms and unsupported fields', () => {
  for (const text of ['null', '{', '[]', 'x'.repeat(MAX_FILE + 1), JSON.stringify({schema:'AcademyRoomDraft.v1',roomId:'stage:threat-model',answers:{}}), JSON.stringify({schema:'AcademyRoomDraft.v1',roomId:'unknown',answers:{}})]) assert.throws(() => parseDraft(text))
  const base = { schema: 'AcademyRoomDraft.v1', roomId: rooms[0].id }
  for (const answers of [[], null, { strange: 'value' }, { [rooms[0].artifact!.requiredSections[0]]: 10 }, { [rooms[0].artifact!.requiredSections[0]]: 'x'.repeat(MAX_ANSWER + 1) }, JSON.parse('{"__proto__":"bad"}')]) assert.throws(() => parseDraft(JSON.stringify({ ...base, answers })))
})


test('maximum-size escaped and Unicode answers can be exported and reimported', () => {
  for (const text of ['\u0001', '😀']) {
    const answers = Object.fromEntries(rooms[0].artifact!.requiredSections.map(section => [section, text.repeat(text.length === 2 ? 3000 : 6000)]))
    const draft = { roomId: rooms[0].id, answers }
    assert.deepEqual(parseDraft(JSON.stringify(exportDraft(draft, '2026-11-04T00:00:00Z'))), draft)
  }
})
