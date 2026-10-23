import { ImageResponse } from 'next/og'

export const alt = 'AI Architect Academy — for the engineer who was just handed the AI work'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Colours from app/globals.css: --paper, --ink, --ink-3, --rule, --cobalt.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 96px',
          backgroundColor: '#f6f3ec',
          color: '#16171d',
        }}
      >
        <div style={{ display: 'flex', fontSize: 30, fontFamily: 'serif', color: '#16171d' }}>AI Architect Academy</div>
        <div style={{ display: 'flex', marginTop: 28, width: 120, height: 4, backgroundColor: '#1f3bd6' }} />
        <div
          style={{
            display: 'flex',
            marginTop: 44,
            fontSize: 68,
            lineHeight: 1.1,
            fontFamily: 'serif',
            letterSpacing: '-0.01em',
            maxWidth: 960,
          }}
        >
          For the engineer who was just handed the AI work.
        </div>
        <div style={{ display: 'flex', marginTop: 40, fontSize: 28, color: '#6b6e7a' }}>
          Judgement and sequence, taught by building. Waitlist open, no date yet.
        </div>
      </div>
    ),
    size,
  )
}
