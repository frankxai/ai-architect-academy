// Renders a catalog screen as a code-drawn mockup: exact text from the
// specification, no generated imagery. Fixture data is labelled as such.
import type { Block, Screen } from '@/lib/studio/catalog'

function BlockView({ b }: { b: Block }) {
  switch (b.type) {
    case 'heading':
      return <p className="mock-heading">{b.text}</p>
    case 'input':
      return <div className="mock-input" role="presentation">{b.text}</div>
    case 'chips':
      return <div className="mock-chips">{b.items?.map(i => <span key={String(i)}>{String(i)}</span>)}</div>
    case 'status':
      return <p className={`mock-status mock-${b.tone ?? 'neutral'}`}>{b.text}</p>
    case 'answer':
      return (
        <div className="mock-answer">
          <p>{b.text}</p>
          {b.citations?.length ? <ol>{b.citations.map(c => <li key={c}>{c}</li>)}</ol> : null}
        </div>
      )
    case 'actions':
      return (
        <div className="mock-actions">
          {b.items?.map(i => typeof i === 'string' ? <span key={i}>{i}</span> : <span key={i.label} data-kind={i.kind}>{i.label}</span>)}
        </div>
      )
    case 'meta':
      return <p className="mock-meta">{b.text}</p>
    case 'list':
      return <ul className="mock-list">{b.items?.map(i => <li key={String(i)}>{String(i)}</li>)}</ul>
    case 'message':
      return <p className={`mock-msg ${b.from === 'user' ? 'is-user' : ''}`}>{b.text}</p>
    case 'table':
      return (
        <table className="mock-table">
          <thead><tr>{b.columns?.map(c => <th key={c}>{c}</th>)}</tr></thead>
          <tbody>{b.rows?.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
        </table>
      )
    case 'kpis':
      return (
        <div className="mock-kpis">
          {b.items?.map(i => typeof i === 'string' ? null : <div key={i.label}><span>{i.label}</span><b>{i.value}</b></div>)}
        </div>
      )
    case 'timeline':
      return <ol className="mock-timeline">{b.items?.map((i, n) => <li key={String(i)} data-last={n === (b.items?.length ?? 0) - 1 ? 'true' : undefined}>{String(i)}</li>)}</ol>
    default:
      return null
  }
}

export function ScreenMockup({ screen }: { screen: Screen }) {
  return (
    <figure className={`mock mock-${screen.device}`}>
      <div className="mock-frame" aria-hidden="true">
        {screen.device === 'desktop' ? <span className="mock-dots"><i /><i /><i /></span> : <span className="mock-notch" />}
      </div>
      <div className="mock-body">
        {screen.blocks.map((b, i) => <BlockView key={i} b={b} />)}
      </div>
      <figcaption>
        <span>{screen.title}</span>
        <span className="mono">{screen.device} · {screen.state}</span>
      </figcaption>
    </figure>
  )
}
