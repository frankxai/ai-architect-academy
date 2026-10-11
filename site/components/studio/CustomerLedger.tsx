'use client'

import { useMemo, useState } from 'react'
import { euro, ledger, type Economics } from '@/lib/studio/catalog'

type Field = { key: keyof Omit<Economics, 'computed' | 'currency' | 'basis'>; label: string; min: number; max: number; step: number; format: (v: number) => string }

const FIELDS: Field[] = [
  { key: 'tasks', label: 'Eligible tasks per month', min: 10, max: 200000, step: 10, format: v => new Intl.NumberFormat('en-IE').format(v) },
  { key: 'adoption', label: 'Share attempted with the system', min: 0.05, max: 1, step: 0.05, format: v => `${Math.round(v * 100)} in 100` },
  { key: 'acceptance', label: 'Attempts accepted without rework', min: 0.05, max: 1, step: 0.05, format: v => `${Math.round(v * 100)} in 100` },
  { key: 'minutes_saved', label: 'Minutes saved per accepted result', min: 1, max: 480, step: 1, format: v => `${v}\u00a0min` },
  { key: 'hourly_value', label: 'Value of an hour of that work', min: 10, max: 300, step: 5, format: v => euro(v) },
  { key: 'run_cost_per_task', label: 'Run cost per attempt', min: 0, max: 5, step: 0.01, format: v => euro(v) },
  { key: 'fixed_monthly', label: 'Fixed monthly cost (hosting, review, support)', min: 0, max: 50000, step: 100, format: v => euro(v) },
]

export function CustomerLedger({ economics, metric }: { economics: Economics; metric: { name: string; definition: string } }) {
  const initial = Object.fromEntries(FIELDS.map(f => [f.key, economics[f.key]])) as Record<Field['key'], number>
  const [values, setValues] = useState(initial)
  const out = useMemo(() => ledger(values), [values])
  const max = Math.max(out.monthly_value, out.monthly_cost, 1)
  const changed = FIELDS.some(f => values[f.key] !== initial[f.key])

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_1.2fr]">
      <div>
        <p className="eyebrow">Customer ledger / assumptions you can move</p>
        <h2 id="ledger-heading" className="mt-3 text-3xl">Cost per accepted result.</h2>
        <p className="mt-4 text-sm" style={{ color: 'var(--ink-2)' }}>Every attempt is charged, so failed runs count. Value comes only from accepted results. {economics.basis}</p>
        <p className="mt-4 text-sm" style={{ color: 'var(--ink-3)' }}>Primary metric: <strong style={{ color: 'var(--ink)' }}>{metric.name}</strong>. {metric.definition}</p>
        <dl className="studio-ledger mt-6">
          <div><dt>Monthly value</dt><dd>{euro(out.monthly_value)}</dd></div>
          <div><dt>Monthly cost</dt><dd>{euro(out.monthly_cost)}</dd></div>
          <div><dt>Net</dt><dd style={{ color: out.net < 0 ? '#9b2c1f' : '#1d6b44' }}>{euro(out.net)}</dd></div>
          <div><dt>Cost per accepted result</dt><dd>{euro(out.cost_per_accepted)}</dd></div>
        </dl>
        <div className="mt-5 space-y-2" aria-hidden="true">
          <div className="studio-ledger-bar"><span style={{ width: `${(out.monthly_value / max) * 100}%`, background: '#1f3bd6' }} /><em>value</em></div>
          <div className="studio-ledger-bar"><span style={{ width: `${(out.monthly_cost / max) * 100}%`, background: '#6b6e7a' }} /><em>cost</em></div>
        </div>
        <button type="button" className="btn btn-quiet mt-6" aria-disabled={!changed} onClick={() => { if (changed) setValues(initial) }}>
          Reset to the catalog assumptions
        </button>
      </div>
      <div className="space-y-5">
        {FIELDS.map(f => (
          <label key={f.key} className="block text-sm">
            <span className="flex justify-between gap-4"><span>{f.label}</span><span className="mono">{f.format(values[f.key])}</span></span>
            <input
              type="range"
              className="studio-range mt-1 w-full"
              min={f.min}
              max={f.max}
              step={f.step}
              value={values[f.key]}
              aria-valuetext={f.format(values[f.key])}
              onChange={e => setValues(v => ({ ...v, [f.key]: Number(e.target.value) }))}
            />
          </label>
        ))}
      </div>
    </div>
  )
}
