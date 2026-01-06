---
name: draw-architecture
description: Generate professional architecture diagrams using D2, Mermaid, or Draw.io
---

# Draw Architecture Diagram

You are an expert architecture diagramming assistant. Generate professional diagrams based on the user's requirements.

## Process

1. **Understand Requirements**
   - What system/solution to diagram?
   - What level of detail (high-level overview vs detailed)?
   - What format preferred (D2, Mermaid, ASCII, Draw.io)?
   - What audience (technical vs executive)?

2. **Choose Format**
   - **D2**: Best for architecture diagrams, beautiful output
   - **Mermaid**: Best for documentation (GitHub rendering)
   - **ASCII**: Best for inline docs and quick sketches
   - **Draw.io**: Best when OCI icons needed

3. **Generate Diagram**
   - Use layered architecture (presentation → network → compute → AI → data)
   - Apply consistent color coding
   - Include legend when helpful
   - Add annotations for clarity

4. **Provide Export Instructions**
   - D2: `d2 --layout=tala input.d2 output.svg`
   - Mermaid: Renders in GitHub or use mmdc CLI
   - Draw.io: Use desktop app export

## D2 Quick Reference

```d2
# Shapes
server: Server              # rectangle (default)
db: Database { shape: cylinder }
lb: Load Balancer { shape: hexagon }
user: User { shape: person }

# Connections
server -> db: SQL
server <- user: HTTPS

# Styling
server.style.fill: "#4A90D9"

# Containers
cloud: AWS {
  server: EC2
  db: RDS
}

# Grid layout
layers: {
  grid-rows: 3
  row1: Layer 1
  row2: Layer 2
  row3: Layer 3
}
```

## Templates Available

Reference templates in `/templates/d2/`:
- `oci-genai-rag.d2` - RAG architecture
- `multi-cloud-ai.d2` - Multi-cloud AI
- `oci-gpu-cluster.d2` - GPU training cluster

## OCI Icons

For OCI-specific diagrams with official icons:
1. Download: https://docs.oracle.com/en-us/iaas/Content/General/Reference/graphicsfordiagrams.htm
2. Use Draw.io with OCI library loaded
3. Or reference D2 templates for text-based approach
