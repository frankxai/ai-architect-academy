# AI Architect Academy - Interactive Diagrams

Interactive, draggable architecture diagrams built with React Flow.

## Features

- **Drag & Drop**: Rearrange nodes to explore architectures
- **Zoom & Pan**: Navigate complex diagrams
- **Minimap**: Overview of the full diagram
- **Custom Styled Nodes**: Brand-aligned color scheme
- **Multiple Diagrams**: RAG, Multi-Agent, MCP, and more

## Quick Start

```bash
cd interactive-diagrams
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view.

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AI-Architect-Academy/ai-architect-academy/tree/main/interactive-diagrams)

Or manually:

```bash
npm install -g vercel
vercel
```

## Diagrams Included

| Diagram | Description |
|---------|-------------|
| **Production RAG System** | Enterprise-grade retrieval augmented generation with ingestion, embedding, retrieval, and generation pipelines |
| **Multi-Agent Orchestration** | Supervisor pattern with specialist agents (research, analysis, writing, coding) |
| **MCP Architecture** | Model Context Protocol server architecture with hosts, clients, servers, and capabilities |

## Tech Stack

- **Framework**: Next.js 15
- **Diagrams**: React Flow (@xyflow/react)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (static export)

## Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Cyan | `#06b6d4` | Primary, innovation |
| Slate | `#334155` | Secondary, infrastructure |
| Purple | `#9333ea` | Accent, orchestration |
| Amber | `#f59e0b` | Tools, warnings |
| Emerald | `#22c55e` | Success, completion |

## Adding New Diagrams

1. Create a new file in `src/components/diagrams/`
2. Define nodes with positions and data
3. Define edges connecting nodes
4. Add to the diagrams array in `src/app/page.tsx`

Example node structure:

```tsx
{
  id: "unique-id",
  type: "custom",
  position: { x: 100, y: 100 },
  data: {
    label: "Node Label",
    icon: "🔧",
    variant: "primary", // primary | secondary | accent | muted | success | warning
    description: "Optional description"
  }
}
```

## License

MIT - Part of [AI Architect Academy](https://github.com/AI-Architect-Academy/ai-architect-academy)
