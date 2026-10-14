'use client'

import { memo } from 'react'
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'
import { Glyph } from './Glyph'

export type ArchNodeData = {
  label: string
  service: string
  dataClass: string
  glyph: string
  color: string
  icon: string | null
  caution: boolean
  state: 'idle' | 'active' | 'dim'
  external: boolean
}

export type ArchFlowNode = Node<ArchNodeData, 'architecture'>

const SIDES = [
  ['l', Position.Left],
  ['r', Position.Right],
  ['t', Position.Top],
  ['b', Position.Bottom],
] as const

function ArchNodeView({ data, selected }: NodeProps<ArchFlowNode>) {
  return (
    <div
      className="arch-node"
      data-state={data.state}
      data-selected={selected ? 'true' : undefined}
      style={{ '--node-color': data.color } as React.CSSProperties}
    >
      {SIDES.map(([id, pos]) => (
        <Handle key={`s-${id}`} id={`s-${id}`} type="source" position={pos} isConnectable={false} className="arch-handle" />
      ))}
      {SIDES.map(([id, pos]) => (
        <Handle key={`t-${id}`} id={`t-${id}`} type="target" position={pos} isConnectable={false} className="arch-handle" />
      ))}
      <div className="arch-node-icon">
        {data.icon ? (
          // Official Google Cloud console icon, copied only after a hash match.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.icon} alt="" width={30} height={30} />
        ) : (
          <Glyph d={data.glyph} color={data.color} size={24} />
        )}
      </div>
      <div className="arch-node-text">
        <span className="arch-node-label">{data.label}</span>
        <span className="arch-node-service" translate="no">{data.service}</span>
      </div>
      <div className="arch-node-meta">
        <span>{data.dataClass}</span>
        {data.caution ? <span className="arch-node-caution" title="Beta or inferred name: confirm before customer use">confirm</span> : null}
      </div>
    </div>
  )
}

export const ArchNode = memo(ArchNodeView)
