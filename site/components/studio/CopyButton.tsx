'use client'

import { useState } from 'react'

const MESSAGE = { idle: '', busy: 'Copying…', done: 'Copied', failed: 'Copy failed: use the download link' } as const

// Copies text, or the body of a same-origin file, to the clipboard. The fetch is
// handed to ClipboardItem as a promise so Safari keeps the click's user gesture.
export function CopyButton({ text, href, label = 'Copy', context }: { text?: string; href?: string; label?: string; context?: string }) {
  const [state, setState] = useState<keyof typeof MESSAGE>('idle')
  async function copy() {
    if (state === 'busy') return
    setState('busy')
    try {
      if (text !== undefined) {
        await navigator.clipboard.writeText(text)
      } else if (href) {
        const body = fetch(href).then(r => {
          if (!r.ok) throw new Error(`${r.status}`)
          return r.text()
        })
        if (typeof ClipboardItem !== 'undefined' && navigator.clipboard.write) {
          await navigator.clipboard.write([new ClipboardItem({ 'text/plain': body.then(t => new Blob([t], { type: 'text/plain' })) })])
        } else {
          await navigator.clipboard.writeText(await body)
        }
      }
      setState('done')
    } catch {
      setState('failed')
    }
    window.setTimeout(() => setState('idle'), 2400)
  }
  return (
    <>
      <button type="button" className="studio-copy" onClick={copy}>
        {state === 'idle' ? label : MESSAGE[state]}
        {context ? <span className="sr-only">: {context}</span> : null}
      </button>
      <span className="sr-only" aria-live="polite">{MESSAGE[state]}</span>
    </>
  )
}
