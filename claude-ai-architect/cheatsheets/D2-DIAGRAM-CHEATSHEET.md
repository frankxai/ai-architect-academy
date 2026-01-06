# D2 Diagram Language Cheatsheet

## Installation

```bash
# macOS
brew install d2

# Linux
curl -fsSL https://d2lang.com/install.sh | sh

# Windows (PowerShell)
iwr -useb https://d2lang.com/install.ps1 | iex
```

## Generate Diagram

```bash
# Basic SVG output
d2 input.d2 output.svg

# With TALA layout (best for architecture)
d2 --layout=tala input.d2 output.svg

# PNG output
d2 input.d2 output.png

# Watch mode (auto-refresh)
d2 --watch input.d2 output.svg

# Dark theme
d2 --theme=200 input.d2 output.svg
```

## Basic Syntax

### Shapes
```d2
# Rectangle (default)
server: Server

# Cylinder (database)
db: Database { shape: cylinder }

# Hexagon
lb: Load Balancer { shape: hexagon }

# Person
user: User { shape: person }

# Cloud
cloud: Cloud Provider { shape: cloud }

# Queue
queue: Message Queue { shape: queue }

# Package
pkg: Package { shape: package }

# Oval
process: Process { shape: oval }
```

### Connections
```d2
# Simple arrow
a -> b

# Bidirectional
a <-> b

# Labeled connection
a -> b: HTTPS

# No arrow (line)
a -- b

# Dotted line
a -> b: { style.stroke-dash: 5 }
```

### Containers (Groups)
```d2
aws: AWS {
  ec2: EC2 Instance
  rds: RDS Database
  s3: S3 Bucket

  ec2 -> rds
  ec2 -> s3
}

oci: OCI {
  compute: Compute
  genai: GenAI DAC
}

aws -> oci: VPN
```

### Styling
```d2
# Fill color
server.style.fill: "#4A90D9"

# Border color
server.style.stroke: "#2E5C8A"

# Text color
server.style.font-color: white

# Border width
server.style.stroke-width: 2

# Rounded corners
server.style.border-radius: 8

# Shadow
server.style.shadow: true
```

### Color Palette (OCI-like)
```d2
# Oracle Red
oracle.style.fill: "#FF0000"

# OCI Orange
genai.style.fill: "#FF6B00"

# Blue (Compute)
compute.style.fill: "#4A90D9"

# Green (Network)
network.style.fill: "#3AA76D"

# Purple (Database)
database.style.fill: "#9B59B6"

# Gray (Storage)
storage.style.fill: "#95A5A6"
```

## Common Architecture Patterns

### Three-Tier Architecture
```d2
direction: down

web: Web Tier {
  style.fill: "#E8F5E9"

  lb: Load Balancer { shape: hexagon }
  web1: Web Server 1
  web2: Web Server 2

  lb -> web1
  lb -> web2
}

app: App Tier {
  style.fill: "#E3F2FD"

  api1: API Server 1
  api2: API Server 2
}

data: Data Tier {
  style.fill: "#FFF3E0"

  db: Database { shape: cylinder }
  cache: Redis { shape: cylinder }
}

web -> app
app -> data
```

### AI/ML Pipeline
```d2
direction: right

ingestion: Data Ingestion {
  source: Data Source
  etl: ETL Process
  source -> etl
}

processing: Processing {
  train: Training { shape: hexagon }
  eval: Evaluation
  train -> eval
}

serving: Serving {
  model: Model { shape: cylinder }
  api: Inference API
  model -> api
}

ingestion -> processing: Batch
processing -> serving: Deploy
```

### Multi-Cloud
```d2
oci: Oracle Cloud {
  style.fill: "#FFF3E0"

  genai: GenAI DAC {
    style.fill: "#FF6B00"
    style.font-color: white
  }
  compute: Compute
}

azure: Azure {
  style.fill: "#E3F2FD"

  openai: Azure OpenAI
  storage: Blob Storage { shape: cylinder }
}

gateway: AI Gateway {
  shape: hexagon
  style.fill: "#4A90D9"
  style.font-color: white
}

users: Users { shape: person }

users -> gateway
gateway -> oci.genai: 70%
gateway -> azure.openai: 30%
```

## Layout Options

```bash
# TALA (best for architecture)
d2 --layout=tala diagram.d2

# dagre (hierarchical)
d2 --layout=dagre diagram.d2

# ELK (Eclipse Layout Kernel)
d2 --layout=elk diagram.d2
```

## Direction

```d2
# Top to bottom (default)
direction: down

# Left to right
direction: right

# Bottom to top
direction: up

# Right to left
direction: left
```

## Labels & Icons

```d2
# Multi-line label
server: |md
  # Server
  - 4 vCPU
  - 16GB RAM
|

# Icon (requires icon pack)
server: Server {
  icon: https://icons.terrastruct.com/aws/Compute/Amazon-EC2.svg
}
```

## Sequence Diagrams

```d2
shape: sequence_diagram

user: User
api: API
db: Database

user -> api: Request
api -> db: Query
db -> api: Results
api -> user: Response
```

## Grid Layout

```d2
grid-rows: 2
grid-columns: 3

cell1: Cell 1
cell2: Cell 2
cell3: Cell 3
cell4: Cell 4
cell5: Cell 5
cell6: Cell 6
```

## Comments

```d2
# This is a comment

server: Server  # Inline comment

"""
Multi-line
comment block
"""
```

## Complete Example: OCI GenAI RAG

```d2
title: OCI GenAI RAG Architecture {
  shape: text
  near: top-center
  style.font-size: 24
}

direction: down

# User Layer
users: Users { shape: person }

# Gateway Layer
gateway: API Gateway {
  style.fill: "#4A90D9"
  style.font-color: white

  auth: Auth
  rate: Rate Limit
  cache: Cache
}

# AI Layer
ai: AI Processing {
  style.fill: "#FFF3E0"

  agent: GenAI Agent {
    style.fill: "#FF6B00"
    style.font-color: white
  }

  kb1: Knowledge Base 1 { shape: cylinder }
  kb2: Knowledge Base 2 { shape: cylinder }

  agent -> kb1: RAG
  agent -> kb2: RAG
}

# Data Layer
data: Data Sources {
  style.fill: "#E8F5E9"

  docs: Object Storage { shape: cylinder }
  db: Database { shape: cylinder }
}

# Connections
users -> gateway: HTTPS
gateway -> ai: Route
ai -> data: Retrieve
```

## Themes

```bash
# List themes
d2 --help  # See theme numbers

# Popular themes
d2 --theme=0 input.d2    # Default
d2 --theme=1 input.d2    # Neutral Grey
d2 --theme=100 input.d2  # Colorblind Clear
d2 --theme=200 input.d2  # Dark Mauve
d2 --theme=300 input.d2  # Terminal
```

## Useful Links

- [D2 Documentation](https://d2lang.com/tour/intro)
- [D2 Playground](https://play.d2lang.com/)
- [D2 Icons](https://icons.terrastruct.com/)
- [D2 GitHub](https://github.com/terrastruct/d2)
