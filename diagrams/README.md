# AI Architect Academy - Diagrams as Code

Beautiful, version-controlled architecture diagrams using D2 and Python Diagrams.

## Quick Start

### D2 Diagrams

```bash
# Install D2
brew install d2  # macOS
# or: curl -fsSL https://d2lang.com/install.sh | sh  # Linux

# Render a diagram
d2 d2/rag-production.d2 ../assets/diagrams/rag-production.svg --theme 200

# With watch mode (live preview)
d2 --watch d2/rag-production.d2 ../assets/diagrams/rag-production.svg
```

### Python Diagrams

```bash
# Install dependencies
pip install diagrams
brew install graphviz  # or apt install graphviz

# Generate diagram
cd python
python multi_cloud_gateway.py
# Outputs: multi_cloud_ai_gateway.png
```

## Directory Structure

```
diagrams/
├── d2/                          # D2 diagram source files
│   ├── rag-production.d2        # Production RAG architecture
│   └── multi-agent-orchestration.d2  # Multi-agent patterns
├── python/                      # Python Diagrams source files
│   └── multi_cloud_gateway.py   # Multi-cloud AI gateway
└── README.md                    # This file
```

## Available Diagrams

### D2 Diagrams

| Diagram | Description | Render Command |
|---------|-------------|----------------|
| `rag-production.d2` | Production RAG system with ingestion, embedding, retrieval, and generation | `d2 d2/rag-production.d2 out.svg --theme 200` |
| `multi-agent-orchestration.d2` | Supervisor pattern with specialist agents | `d2 d2/multi-agent-orchestration.d2 out.svg --theme 200` |

### Python Diagrams

| Diagram | Description | Run Command |
|---------|-------------|-------------|
| `multi_cloud_gateway.py` | Multi-cloud AI gateway with AWS, Azure, GCP | `python python/multi_cloud_gateway.py` |

## D2 Themes

D2 includes beautiful built-in themes:

| Theme ID | Name | Best For |
|----------|------|----------|
| 0 | Default | General use |
| 1 | Neutral grey | Documentation |
| 3 | Flagship Terrastruct | Corporate |
| 100 | Cool classics | Professional |
| 200 | Mixed berry blue | **Recommended** |
| 300 | Grape soda | Creative |
| 301 | Aubergine | Dark mode |

```bash
# Try different themes
d2 diagram.d2 output.svg --theme 200  # Mixed berry blue
d2 diagram.d2 output.svg --theme 301  # Dark mode
```

## Brand Colors

All diagrams use the AI Architect Academy brand palette:

| Color | Hex | Usage |
|-------|-----|-------|
| Cyan | `#06b6d4` | Primary, innovation |
| Slate | `#334155` | Secondary, infrastructure |
| Purple | `#9333ea` | Accent, orchestration |
| White | `#ffffff` | Background |

## Creating New Diagrams

### D2 Template

```d2
# Title
title: |md
  # Your Diagram Title
| {
  near: top-center
  shape: text
  style.font-size: 28
}

# Define styles
classes: {
  primary: {
    style.fill: "#06b6d4"
    style.font-color: "#ffffff"
  }
  secondary: {
    style.fill: "#334155"
    style.font-color: "#ffffff"
  }
}

# Components
component1: Label {
  class: primary
}

component2: Label {
  class: secondary
}

# Connections
component1 -> component2: "Label"
```

### Python Diagrams Template

```python
from diagrams import Diagram, Cluster, Edge
from diagrams.aws.ml import Sagemaker
# Import more as needed

with Diagram("Title", show=False, direction="LR"):
    with Cluster("Group"):
        node = Sagemaker("Label")
    # Add more components
```

## Rendering for GitHub

Since GitHub doesn't render D2 natively, pre-render to SVG:

```bash
# Render all D2 diagrams
for f in d2/*.d2; do
  d2 "$f" "../assets/diagrams/$(basename ${f%.d2}).svg" --theme 200
done

# Then reference in markdown
# ![RAG Architecture](assets/diagrams/rag-production.svg)
```

## CI/CD Auto-Rendering

See `.github/workflows/render-diagrams.yml` for automated rendering on push.

## Resources

- [D2 Documentation](https://d2lang.com/tour/intro/)
- [D2 Icons](https://icons.terrastruct.com/)
- [Python Diagrams Docs](https://diagrams.mingrammer.com/)
- [AWS Architecture Icons](https://aws.amazon.com/architecture/icons/)
- [Azure Icons](https://learn.microsoft.com/en-us/azure/architecture/icons/)
- [GCP Icons](https://cloud.google.com/icons)

---

*Diagrams as Code = Version Control + Collaboration + Automation*
