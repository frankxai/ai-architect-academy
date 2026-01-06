# MCP Servers Guide for AI Architects

## Official Oracle MCP Servers (Recommended)

Oracle provides **20 official MCP servers** at [github.com/oracle/mcp](https://github.com/oracle/mcp). Use these for production workloads.

### Available Oracle MCP Servers

| Server | Purpose |
|--------|---------|
| `oci-compute-mcp-server` | Compute instance management |
| `oci-networking-mcp-server` | VCN, subnets, security lists |
| `oci-object-storage-mcp-server` | Object storage operations |
| `oci-database-mcp-server` | Database management |
| `oci-identity-mcp-server` | IAM, policies, compartments |
| `oci-monitoring-mcp-server` | Metrics and alarms |
| `oci-logging-mcp-server` | Log management |
| `oci-cloud-guard-mcp-server` | Security monitoring |
| `oci-pricing-mcp-server` | Pricing and cost info |
| `oci-usage-mcp-server` | Usage and cost reports |
| `oci-registry-mcp-server` | Container registry |
| `oci-faaas-mcp-server` | Functions (serverless) |
| `oci-network-load-balancer-mcp-server` | Load balancer management |
| `oci-resource-search-mcp-server` | Resource discovery |
| `oci-migration-mcp-server` | Migration tools |
| `oci-compute-instance-agent-mcp-server` | Instance agent operations |
| `oci-api-mcp-server` | Generic OCI API access |
| `mysql-mcp-server` | MySQL HeatWave |
| `dbtools-mcp-server` | Database tools |
| `oracle-db-doc-mcp-server` | Database documentation |

### Installation

```bash
# Clone Oracle's official MCP repository
git clone https://github.com/oracle/mcp.git
cd mcp

# Install uv package manager (if not installed)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Build all servers
make build

# Or run individual server
uvx --from src/oci-compute-mcp-server oci-compute-mcp-server
```

### Configuration

Add to `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "oci-compute": {
      "command": "uvx",
      "args": ["--from", "git+https://github.com/oracle/mcp#subdirectory=src/oci-compute-mcp-server", "oci-compute-mcp-server"]
    },
    "oci-database": {
      "command": "uvx",
      "args": ["--from", "git+https://github.com/oracle/mcp#subdirectory=src/oci-database-mcp-server", "oci-database-mcp-server"]
    },
    "oci-networking": {
      "command": "uvx",
      "args": ["--from", "git+https://github.com/oracle/mcp#subdirectory=src/oci-networking-mcp-server", "oci-networking-mcp-server"]
    },
    "oci-object-storage": {
      "command": "uvx",
      "args": ["--from", "git+https://github.com/oracle/mcp#subdirectory=src/oci-object-storage-mcp-server", "oci-object-storage-mcp-server"]
    },
    "oci-identity": {
      "command": "uvx",
      "args": ["--from", "git+https://github.com/oracle/mcp#subdirectory=src/oci-identity-mcp-server", "oci-identity-mcp-server"]
    },
    "oci-monitoring": {
      "command": "uvx",
      "args": ["--from", "git+https://github.com/oracle/mcp#subdirectory=src/oci-monitoring-mcp-server", "oci-monitoring-mcp-server"]
    }
  }
}
```

---

## Community OCI MCP Server

The [karthiksuku/oci-mcp](https://github.com/karthiksuku/oci-mcp) provides a consolidated OCI server:

### Features
- List/inspect Compute instances
- Instance actions (START, STOP, RESET)
- Autonomous Databases listing
- Object Storage buckets
- Security assessments
- Cost summaries (experimental)

### Installation

```bash
git clone https://github.com/karthiksuku/oci-mcp.git
cd oci-mcp
chmod +x install.sh
./install.sh
```

### Configuration

```json
{
  "mcpServers": {
    "oci": {
      "command": "python",
      "args": ["/path/to/oci-mcp/oci_mcp_server.py"],
      "env": {
        "OCI_CONFIG_FILE": "~/.oci/config"
      }
    }
  }
}
```

---

## Other Essential MCP Servers

### GitHub (Official Anthropic)
```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
    }
  }
}
```

### Filesystem (Official Anthropic)
```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/projects"]
  }
}
```

### PostgreSQL (Official Anthropic)
```json
{
  "postgres": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-postgres"],
    "env": {
      "DATABASE_URL": "${POSTGRES_URL}"
    }
  }
}
```

### Notion
```json
{
  "notion": {
    "command": "npx",
    "args": ["-y", "@notionhq/notion-mcp-server"],
    "env": {
      "OPENAPI_MCP_HEADERS": "{\"Authorization\": \"Bearer ${NOTION_TOKEN}\"}"
    }
  }
}
```

---

## Oracle Database MCP (SQLcl)

Oracle has integrated MCP directly into SQLcl for database access:

### Blog Posts
- [Introducing MCP Server for Oracle Database](https://blogs.oracle.com/database/introducing-mcp-server-for-oracle-database)
- [Oracle Autonomous AI Database MCP Server](https://blogs.oracle.com/machinelearning/announcing-the-oracle-autonomous-ai-database-mcp-server)

### Installation
```bash
# SQLcl includes MCP support
# Download from oracle.com/sqlcl
```

---

## Recommended AI Architect Stack

### Core OCI Operations
```json
{
  "mcpServers": {
    "oci-compute": { "...": "compute management" },
    "oci-networking": { "...": "network operations" },
    "oci-database": { "...": "database management" },
    "oci-object-storage": { "...": "storage operations" },
    "oci-identity": { "...": "IAM and policies" },
    "oci-monitoring": { "...": "metrics and alerts" },
    "oci-pricing": { "...": "cost estimation" }
  }
}
```

### Development & Docs
```json
{
  "mcpServers": {
    "github": { "...": "repo management" },
    "filesystem": { "...": "local file access" },
    "notion": { "...": "documentation" }
  }
}
```

---

## Custom MCP Servers in This Repo

This repository includes example custom MCP servers in `mcp-servers/`:

- `oci-infrastructure/` - Example OCI operations (use official Oracle servers instead)
- `terraform-ops/` - Terraform plan/state operations

These are provided as learning examples. For production, use:
- Oracle's official OCI MCP servers
- Community-maintained Terraform MCP servers

---

## Quick Start

```bash
# 1. Install official OCI MCP servers
git clone https://github.com/oracle/mcp.git ~/oracle-mcp

# 2. Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# 3. Configure OCI CLI
oci setup config

# 4. Add to Claude settings (see configuration above)

# 5. Test with Claude
claude --mcp-debug
```

---

## Resources

### Official
- [Oracle MCP Repository](https://github.com/oracle/mcp) - 20 official servers
- [Anthropic MCP Servers](https://github.com/modelcontextprotocol/servers) - Core servers
- [MCP Protocol Spec](https://modelcontextprotocol.io/) - Protocol documentation

### Community
- [oci-mcp](https://github.com/karthiksuku/oci-mcp) - Consolidated OCI server
- [awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) - Curated list

### Oracle Blogs
- [Getting Started with MCP](https://blogs.oracle.com/ateam/post/getting-started-with-model-context-protocol-concepts-and-code-part-1)
- [Hosting MCP Servers on OCI Data Science](https://blogs.oracle.com/ai-and-datascience/hosting-mcp-servers-on-oci-data-science)
- [OCI Identity Domain MCP Server](https://www.ateam-oracle.com/oci-identity-domain-mcp-server)
