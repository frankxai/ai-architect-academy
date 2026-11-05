import { publicAcademyStages } from '../academy-graph/experience.ts'

/** Rooms are views of AcademyGraph, never a competing curriculum or grant path. */
export const rooms = publicAcademyStages().filter(stage => stage.artifact).map(stage => ({
  ...stage,
  channel: `academy-${stage.id.replace(/^stage:/, '')}`,
  teacher: `${stage.title} tutor`,
  availability: 'local-practice' as const,
}))
export type Room = typeof rooms[number]
export type Draft = { roomId: string; answers: Record<string, string> }
export const MAX_ANSWER = 6000
export const MAX_FILE = 512000
export const roomById = (id: string) => rooms.find(room => room.id === id)

export function checkDraft(draft: Draft) {
  const room = roomById(draft.roomId)
  if (!room?.artifact) throw new Error('Unknown or unavailable room.')
  const sections = room.artifact.requiredSections
  return sections.map(section => ({ section, present: Boolean(draft.answers[section]?.trim()) }))
}

/** Strict import: no credentials, HTML, executable payloads or claimed assessment fields are consumed. */
export function parseDraft(text: string): Draft {
  if (new TextEncoder().encode(text).byteLength > MAX_FILE) throw new Error('This file is too large. Choose an Academy draft export.')
  const value = JSON.parse(text)
  if (!value || value.schema !== 'AcademyRoomDraft.v1' || typeof value.roomId !== 'string') throw new Error('Choose an Academy room draft file.')
  const room = roomById(value.roomId)
  if (!room?.artifact || !value.answers || typeof value.answers !== 'object' || Array.isArray(value.answers)) throw new Error('Room or answers are unavailable.')
  const sections = room.artifact.requiredSections
  const answers: Record<string, string> = {}
  for (const key of Object.keys(value.answers)) {
    if (!sections.includes(key) || typeof value.answers[key] !== 'string' || value.answers[key].length > MAX_ANSWER) throw new Error('The draft contains an unsupported field or an answer that is too long.')
    answers[key] = value.answers[key]
  }
  return { roomId: room.id, answers }
}

export function exportDraft(draft: Draft, exportedAt: string) {
  // Revalidate at the export boundary; never carry imported verdicts forward.
  const clean = parseDraft(JSON.stringify({ schema: 'AcademyRoomDraft.v1', ...draft }))
  const room = roomById(clean.roomId)!
  return {
    schema: 'AcademyRoomDraft.v1', ...clean, exportedAt,
    artifactId: room.artifactId,
    structureCheck: checkDraft(clean),
    assessment: 'not-assessed', competencyGranted: false,
    source: 'AcademyGraph.v1', requiredReviewIds: room.reviewIds,
  }
}
