'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { usePracticeDrafts } from './PracticeDraftProvider'
import { rooms, roomById, checkDraft, exportDraft, parseDraft, MAX_ANSWER, MAX_FILE } from '@/lib/teaching-rooms/contract'

export function TeachingRoom() {
  const { drafts, setDrafts, selectedRoom, setSelectedRoom: setRoomId } = usePracticeDrafts()
  const roomId = selectedRoom ?? rooms[0].id
  const [checked, setChecked] = useState(false)
  const [notice, setNotice] = useState('')
  const input = useRef<HTMLInputElement>(null)
  const room = roomById(roomId)!
  const draft = drafts[roomId] ?? { roomId, answers: {} }
  const checks = checkDraft(draft)
  const missing = checks.find(check => !check.present)

  function choose(id: string) { setRoomId(id); setChecked(false); setNotice('') }
  function download() {
    try {
    const payload = JSON.stringify(exportDraft(draft, new Date().toISOString()), null, 2)
    const url = URL.createObjectURL(new Blob([payload], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url; link.download = `academy-${roomId.replace('stage:', '')}-draft.json`; link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setNotice('Draft exported. Keep the file to resume on another device or share it with your reviewer.')
    } catch { setNotice('The draft could not be exported. Keep this tab open and copy your answers before leaving.') }
  }
  async function restore(file: File | undefined) {
    if (!file) return
    try {
      if (file.size > MAX_FILE) throw new Error('This file is too large. Choose an Academy draft export.')
      const loaded = parseDraft(await file.text())
      // Preserve an existing attempt rather than silently overwriting it.
      if (Object.values(drafts[loaded.roomId]?.answers ?? {}).some(answer => answer.trim())) throw new Error('This room already has work. Export it and open a fresh tab before importing another attempt.')
      setDrafts(previous => ({ ...previous, [loaded.roomId]: loaded }))
      setRoomId(loaded.roomId); setChecked(false); setNotice('Draft restored. Structure and assessment will be checked again.')
    } catch (error) { setNotice(error instanceof Error ? error.message : 'The draft could not be opened.') }
    if (input.current) input.current.value = ''
  }

  return <article className="rooms-experience">
    <header className="rooms-heading">
      <div><p className="room-kicker">The architecture practice studio</p><h1>Build the decision.<br /><em>Defend the evidence.</em></h1>
        <p className="room-intro">Choose a challenge. Work through the artifact. Leave with something another architect can review.</p></div>
      <div className="room-availability"><span className="room-dot" />Local practice is available<p>Hosted AI teachers and Slack rooms are planned.</p><Link className="link" href="/#waitlist">Request hosted access →</Link></div>
    </header>

    <div className="room-shell">
      <aside className="room-directory"><p className="room-kicker">Your practice rooms</p>
        <nav aria-label="Practice rooms">{rooms.map(item => <button key={item.id} type="button" aria-current={item.id === roomId ? 'page' : undefined} onClick={() => choose(item.id)}>
          <span className="room-number">{String(item.ordinal).padStart(2, '0')}</span><span>{item.title}<small>{drafts[item.id] && Object.values(drafts[item.id].answers).some(Boolean) ? 'Draft in this tab' : 'Open challenge'}</small></span><span aria-hidden="true">↗</span>
        </button>)}</nav>
        <p className="room-note">Your text stays in this tab. Export before closing or refreshing. No background model calls.</p>
        <input ref={input} className="sr-only" type="file" accept="application/json,.json" aria-label="Import an Academy draft" onChange={event => void restore(event.target.files?.[0])} />
        <button type="button" className="btn btn-quiet" onClick={() => input.current?.click()}>Resume from a file</button>
      </aside>

      <section className="room-workspace" aria-labelledby="room-title">
        <div className="room-titlebar"><div><p className="room-kicker">Architecture challenge</p><h2 id="room-title">{room.title}</h2></div><span className="room-status">Unassessed draft</span></div>
        <p className="room-decision">{room.decision}</p>
        <div className="room-teacher"><span className="room-avatar" aria-hidden="true">a.</span><div><strong>{room.teacher}</strong><small>Guided prompts · runs locally</small>
          <p>{checked ? missing ? `Your draft still needs “${missing.section}”. What concrete evidence would make that section defensible?` : 'Every section has text. Now challenge the assumptions and run the lesson’s evaluations. An independent reviewer still needs to assess the artifact.' : 'Start with your own system. Make each section specific enough that a reviewer can disagree with it. Use the lesson when you need the underlying method.'}</p>
          <Link className="link" target="_blank" rel="noopener noreferrer" href={new URL(room.url).pathname}>Open the lesson and evaluation rubric (new tab) →</Link></div></div>
        <form onSubmit={event => { event.preventDefault(); setChecked(true); setNotice('Structure checked locally. No semantic assessment or competency was granted.') }}>
          <fieldset><legend className="room-kicker">Your artifact · {room.artifact?.title}</legend>
            {room.artifact?.requiredSections.map((section, index) => <label className="room-field" key={`${roomId}:${section}`} htmlFor={`room-answer-${index}`}><span>{section}</span><textarea id={`room-answer-${index}`} maxLength={MAX_ANSWER} rows={3} value={draft.answers[section] ?? ''} onChange={event => { const text = event.target.value; setDrafts(previous => ({ ...previous, [roomId]: { roomId, answers: { ...draft.answers, [section]: text } } })); setChecked(false) }} placeholder="Write your decision and the evidence behind it." /></label>)}
          </fieldset>
          <div className="room-actions"><button className="btn btn-primary" type="submit">Check structure</button><button className="btn btn-quiet" type="button" onClick={download}>Export draft</button></div>
        </form>
        <div className="room-feedback" role="status" aria-live="polite">{notice}{checked && <ul>{checks.map(check => <li key={check.section}>{check.present ? 'Present' : 'Missing'} · {check.section}</li>)}</ul>}</div>
      </section>
    </div>
    <section className="room-next"><div><p className="room-kicker">The next boundary</p><h2>A teacher that follows<br />the work across surfaces.</h2></div><div><p>The planned hosted experience connects a personal teacher, challenge history and a dedicated Slack room. The web artifact stays the shared reference for questions, revisions and review.</p><p>Today, these prompts check structure only. Use the existing local agent team for deeper assistance and bring the exported draft to a separate reviewer.</p><Link className="link" href="/start#agent">Equip your own agent →</Link></div></section>
  </article>
}
