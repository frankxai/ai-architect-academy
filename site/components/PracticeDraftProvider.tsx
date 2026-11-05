'use client'

import { createContext, useContext, useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import type { Draft } from '@/lib/teaching-rooms/contract'

type PracticeState = {
  drafts: Record<string, Draft>
  setDrafts: Dispatch<SetStateAction<Record<string, Draft>>>
  selectedRoom: string | undefined
  setSelectedRoom: Dispatch<SetStateAction<string | undefined>>
}
const PracticeContext = createContext<PracticeState | null>(null)

/** Root-layout memory survives Next.js navigation, including browser Back/Forward.
 * No durable browser storage or server-side learner data is created. */
export function PracticeDraftProvider({ children }: { children: React.ReactNode }) {
  const [drafts, setDrafts] = useState<Record<string, Draft>>({})
  const [selectedRoom, setSelectedRoom] = useState<string>()
  const dirty = Object.values(drafts).some(item => Object.values(item.answers).some(answer => answer.trim()))
  useEffect(() => {
    if (!dirty) return
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])
  return <PracticeContext.Provider value={{ drafts, setDrafts, selectedRoom, setSelectedRoom }}>{children}</PracticeContext.Provider>
}
export function usePracticeDrafts() {
  const state = useContext(PracticeContext)
  if (!state) throw new Error('Practice rooms require the draft provider.')
  return state
}
