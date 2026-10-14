'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  useStore,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { ArchNode, type ArchFlowNode } from './ArchNode'
import type { Layer, Pattern, Realization, Role } from '@/lib/studio/catalog'

export type Lens = 'layers' | 'data'

export const DATA_CLASS_COLORS: Record<string, string> = {
  public: '#9aa3b5',
  internal: '#8AB4FF',
  confidential: '#FFC07A',
  personal: '#FF9FCB',
  tenant: '#5EE6CF',
  identity: '#B9A7FF',
  secret: '#FF8A8A',
  operational: '#8b90a0',
}

const NODE = { w: 252, h: 112 }
const nodeTypes = { architecture: ArchNode }

function sides(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  if (Math.abs(dx) >= Math.abs(dy)) return dx >= 0 ? ['r', 'l'] : ['l', 'r']
  return dy >= 0 ? ['b', 't'] : ['t', 'b']
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const q = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(q.matches)
    const on = () => setReduced(q.matches)
    q.addEventListener('change', on)
    return () => q.removeEventListener('change', on)
  }, [])
  return reduced
}

function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false)
  useEffect(() => setCoarse(window.matchMedia('(pointer: coarse)').matches), [])
  return coarse
}

type Props = {
  pattern: Pattern
  realization: Realization
  layers: Layer[]
  roles: Role[]
  icons: Record<string, { href: string }>
  lens: Lens
  activeFlows: Set<string> | null
  activeNodes: Set<string> | null
  selected: string | null
  onSelect: (id: string | null) => void
}

function Canvas(props: Props) {
  const { pattern, realization, layers, roles, icons, lens, activeFlows, activeNodes, selected, onSelect } = props
  const reduced = usePrefersReducedMotion()
  const coarse = useCoarsePointer()
  // On touch, dragging scrolls the page until the reader asks to explore the canvas.
  const [explore, setExplore] = useState(false)
  const { fitView } = useReactFlow()

  const layerColor = useMemo(() => Object.fromEntries(layers.map(l => [l.id, l.color])), [layers])
  const glyphs = useMemo(() => Object.fromEntries(roles.map(r => [r.id, r.glyph])), [roles])
  const byId = useMemo(() => new Map(pattern.components.map(c => [c.id, c])), [pattern])

  const nodes: ArchFlowNode[] = useMemo(
    () =>
      pattern.components.map(c => {
        const binding = realization.bindings[c.id]
        const color = lens === 'data' ? DATA_CLASS_COLORS[c.data_class] ?? '#9aa3b5' : layerColor[c.layer]
        return {
          id: c.id,
          type: 'architecture',
          position: { x: c.x, y: c.y },
          width: NODE.w,
          height: NODE.h,
          selected: selected === c.id,
          ariaLabel: `${c.label}: ${binding ? binding.name : c.role === 'user' ? 'person' : 'external system'}; ${c.data_class} data${binding && realization.caution.includes(binding.id) ? '; confirm this name before customer use' : ''}`,
          data: {
            label: c.label,
            service: binding ? binding.name : c.role === 'user' ? 'Person' : 'External system',
            dataClass: c.data_class,
            glyph: glyphs[c.role],
            color,
            icon: binding?.icon ? icons[binding.icon]?.href ?? null : null,
            caution: Boolean(binding && realization.caution.includes(binding.id)),
            state: activeNodes ? (activeNodes.has(c.id) ? 'active' : 'dim') : 'idle',
            external: !binding,
          },
        }
      }),
    [pattern, realization, lens, layerColor, glyphs, icons, activeNodes, selected],
  )

  const edges: Edge[] = useMemo(
    () =>
      pattern.flows.map(f => {
        const a = byId.get(f.from)!
        const b = byId.get(f.to)!
        const [s, t] = sides(a, b)
        const active = activeFlows?.has(f.id) ?? false
        const dim = activeFlows !== null && !active
        const color = active
          ? lens === 'data'
            ? DATA_CLASS_COLORS[f.data_class] ?? '#f2f1ec'
            : layerColor[a.layer]
          : '#6f7690'
        return {
          id: f.id,
          source: f.from,
          target: f.to,
          sourceHandle: `s-${s}`,
          targetHandle: `t-${t}`,
          type: 'smoothstep',
          // Active edges sit above the nodes so a label on a short hop is never hidden.
          zIndex: active ? 1000 : 0,
          animated: active && !reduced && f.kind !== 'telemetry',
          label: active ? f.label : undefined,
          labelStyle: { fill: '#f2f1ec', fontSize: 11, fontWeight: 500 },
          labelBgStyle: { fill: '#0f1017', fillOpacity: 0.92 },
          labelBgPadding: [6, 3] as [number, number],
          labelBgBorderRadius: 4,
          markerEnd: { type: MarkerType.ArrowClosed, color, width: 16, height: 16 },
          style: {
            stroke: color,
            strokeWidth: active ? 2.2 : 1.3,
            strokeDasharray: f.kind === 'control' ? '6 5' : f.kind === 'telemetry' ? '1 5' : undefined,
            strokeLinecap: 'round',
            opacity: dim ? 0.18 : 1,
          },
          ariaLabel: `${a.label} to ${byId.get(f.to)!.label}: ${f.label} (${f.kind}, ${f.data_class})`,
        }
      }),
    [pattern, byId, activeFlows, lens, layerColor, reduced],
  )

  // The camera follows the request: frame the components of the active journey
  // step, or the whole design when nothing is playing. Instant under reduced motion.
  // A narrow canvas cannot hold a whole step legibly, so it holds a readable zoom
  // centred on the step instead; the narration and inspector carry the rest.
  const focus = activeNodes && activeNodes.size > 0 ? [...activeNodes].sort().join(',') : ''
  const narrow = useStore(s => s.width > 0 && s.width < 640)
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const duration = reduced ? 0 : 450
      if (focus) fitView({ nodes: focus.split(',').map(n => ({ id: n })), padding: 0.3, maxZoom: 1.1, minZoom: narrow ? 0.7 : undefined, duration })
      else fitView({ padding: 0.12, duration })
    })
    return () => cancelAnimationFrame(id)
  }, [pattern.id, realization.provider, focus, narrow, fitView, reduced])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      colorMode="dark"
      fitView
      fitViewOptions={{ padding: 0.12 }}
      minZoom={0.25}
      maxZoom={1.75}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable
      nodesFocusable
      edgesFocusable={false}
      panOnDrag={!coarse || explore}
      zoomOnPinch={!coarse || explore}
      zoomOnScroll={false}
      panOnScroll={false}
      preventScrolling={!coarse || explore}
      onNodeClick={(_, node) => onSelect(node.id)}
      onPaneClick={() => onSelect(null)}
      // Nodes are controlled, so keyboard selection (Enter or Space on a focused node) arrives here.
      onNodesChange={changes => { for (const c of changes) if (c.type === 'select' && c.selected) onSelect(c.id) }}
      proOptions={{ hideAttribution: false }}
      ariaLabelConfig={{ 'node.a11yDescription.default': 'Press Enter to inspect this component.' }}
    >
      <Background variant={BackgroundVariant.Dots} gap={26} size={1} color="#2a2f42" />
      <Controls showInteractive={false} position="top-right" aria-label="Canvas zoom controls" />
      {coarse ? (
        <Panel position="top-left">
          <button type="button" className="studio-explore" aria-pressed={explore} onClick={() => setExplore(e => !e)}>
            {explore ? 'Done exploring' : 'Pan and zoom'}
          </button>
        </Panel>
      ) : null}
    </ReactFlow>
  )
}

export function ArchitectureCanvas(props: Props) {
  return (
    <ReactFlowProvider>
      <Canvas {...props} />
    </ReactFlowProvider>
  )
}
