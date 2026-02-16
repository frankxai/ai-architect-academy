#!/bin/bash
# AI Architect Academy — Cross-Platform Extension Installer
# Usage: ./install.sh [platform]
# Platforms: claude-code (default), cline, cursor, windsurf, all

set -e

# ─── Configuration ───────────────────────────────────────────────
ACADEMY_DIR="$(cd "$(dirname "$0")" && pwd)"
PLATFORM="${1:-claude-code}"
VERSION="1.0.0"

# Skill source repos
SKILL_REPOS=(
    "oci-ai-architects/claude-code-oci-ai-architect-skills"
    "oci-ai-architects/multi-cloud-ai-architect"
    "oci-ai-architects/cline-oci-ai-architect-skills"
    "oci-ai-architects/cline-oci-ai-engineer"
    "oci-ai-architects/oci-ai-architect"
)

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

# ─── Functions ───────────────────────────────────────────────────

banner() {
    echo ""
    echo -e "${CYAN}${BOLD}"
    echo "  ╔══════════════════════════════════════════════════════╗"
    echo "  ║           AI Architect Academy v${VERSION}              ║"
    echo "  ║        Extension Installer — Build with agents       ║"
    echo "  ╚══════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

log() { echo -e "  ${GREEN}[+]${NC} $1"; }
warn() { echo -e "  ${YELLOW}[!]${NC} $1"; }
err() { echo -e "  ${RED}[x]${NC} $1"; }

check_prerequisites() {
    log "Checking prerequisites..."

    if ! command -v git &> /dev/null; then
        err "git is required. Install it first."
        exit 1
    fi

    case "$PLATFORM" in
        claude-code)
            if command -v claude &> /dev/null; then
                log "Claude Code detected"
            else
                warn "Claude Code not found in PATH — install from https://docs.anthropic.com/en/docs/claude-code"
            fi
            ;;
        cline)
            if command -v code &> /dev/null; then
                log "VS Code detected (Cline runs here)"
            else
                warn "VS Code not found — Cline is a VS Code extension"
            fi
            ;;
        cursor)
            log "Cursor adapter selected"
            ;;
        windsurf)
            log "Windsurf adapter selected"
            ;;
        all)
            log "Installing for all platforms"
            ;;
        *)
            err "Unknown platform: $PLATFORM"
            echo "  Supported: claude-code, cline, cursor, windsurf, all"
            exit 1
            ;;
    esac
}

# ─── Platform Installers ─────────────────────────────────────────

install_claude_code() {
    log "Installing for Claude Code..."

    # CLAUDE.md is already in repo root — it's the instructor engine
    if [ ! -f "$ACADEMY_DIR/CLAUDE.md" ]; then
        err "CLAUDE.md not found — repo may be incomplete"
        return 1
    fi
    log "Instructor engine: CLAUDE.md (already in place)"

    # Ensure .claude directory structure
    mkdir -p "$ACADEMY_DIR/.claude/commands"
    mkdir -p "$ACADEMY_DIR/.claude/hooks"

    # Copy platform-specific commands if they exist
    if [ -d "$ACADEMY_DIR/platforms/claude-code/commands" ]; then
        cp -n "$ACADEMY_DIR/platforms/claude-code/commands/"*.md "$ACADEMY_DIR/.claude/commands/" 2>/dev/null || true
        log "Commands installed to .claude/commands/"
    fi

    # Install skill-rules.json if not present
    if [ ! -f "$ACADEMY_DIR/.claude/skill-rules.json" ] && [ -f "$ACADEMY_DIR/platforms/claude-code/skill-rules.json" ]; then
        cp "$ACADEMY_DIR/platforms/claude-code/skill-rules.json" "$ACADEMY_DIR/.claude/"
        log "Skill rules configured"
    fi

    # Create .academy directory for progress tracking
    mkdir -p "$ACADEMY_DIR/.academy"
    if [ ! -f "$ACADEMY_DIR/.academy/progress.json" ]; then
        cat > "$ACADEMY_DIR/.academy/progress.json" << 'PROGRESS'
{
  "version": "1.0.0",
  "student": {
    "started": null,
    "platform": "claude-code",
    "total_time_minutes": 0
  },
  "labs": {
    "01-rag-pipeline": { "status": "not_started", "score": null, "attempts": 0, "checkpoints": [] },
    "02-multi-agent-system": { "status": "not_started", "score": null, "attempts": 0, "checkpoints": [] },
    "03-mcp-server": { "status": "not_started", "score": null, "attempts": 0, "checkpoints": [] }
  },
  "skills": {
    "domains_explored": [],
    "skills_activated": 0,
    "commands_used": []
  },
  "certification": {
    "level": null,
    "labs_completed": 0,
    "avg_score": 0
  }
}
PROGRESS
        log "Progress tracker initialized"
    fi

    # Ensure progress.json is gitignored
    if ! grep -q ".academy/progress.json" "$ACADEMY_DIR/.gitignore" 2>/dev/null; then
        echo ".academy/progress.json" >> "$ACADEMY_DIR/.gitignore"
        log "Progress file added to .gitignore"
    fi

    log "Claude Code installation complete"
}

install_cline() {
    log "Installing for Cline..."

    # Create Cline config directories
    mkdir -p "$ACADEMY_DIR/.clinerules"
    mkdir -p "$ACADEMY_DIR/.cline/skills"

    # Generate .clinerules from CLAUDE.md instructor engine
    if [ -f "$ACADEMY_DIR/platforms/cline/rules.md" ]; then
        cp "$ACADEMY_DIR/platforms/cline/rules.md" "$ACADEMY_DIR/.clinerules/academy-instructor.md"
    else
        # Generate from CLAUDE.md
        cat > "$ACADEMY_DIR/.clinerules/academy-instructor.md" << 'CLINERULES'
# AI Architect Academy — Instructor Rules (Cline)

## Role
You are a Socratic AI architecture instructor. You teach by asking questions, not giving answers.

## Teaching Protocol
1. When a student opens a lab, read the README first
2. Ask what they notice about the code before giving guidance
3. Use incremental hints — direction first, then narrowing, then near-answer
4. Never reveal the solution unless explicitly asked and they've attempted it

## Labs Available
- Lab 01: Fix the Broken RAG Pipeline (labs/01-rag-pipeline/)
- Lab 02: Build a Multi-Agent System (labs/02-multi-agent-system/)
- Lab 03: Build Your Own MCP Server (labs/03-mcp-server/)

## Skills
80+ architecture skills auto-activate based on context. See skills/ directory.

## Progress
Track student progress in .academy/progress.json
CLINERULES
    fi
    log "Cline rules installed"

    # Copy skills to Cline format
    if [ -d "$ACADEMY_DIR/skills" ]; then
        for skill_dir in "$ACADEMY_DIR/skills"/*; do
            if [ -d "$skill_dir" ]; then
                skill_name=$(basename "$skill_dir")
                if [ -f "$skill_dir/SKILL.md" ]; then
                    cp "$skill_dir/SKILL.md" "$ACADEMY_DIR/.cline/skills/${skill_name}.md"
                fi
            fi
        done
        log "Skills copied to .cline/skills/"
    fi

    # Also create .roo/rules/ for RooCode compatibility
    mkdir -p "$ACADEMY_DIR/.roo/rules"
    if [ -f "$ACADEMY_DIR/.clinerules/academy-instructor.md" ]; then
        cp "$ACADEMY_DIR/.clinerules/academy-instructor.md" "$ACADEMY_DIR/.roo/rules/"
    fi
    log "RooCode compatibility layer added"

    # Create progress tracker
    mkdir -p "$ACADEMY_DIR/.academy"
    if [ ! -f "$ACADEMY_DIR/.academy/progress.json" ]; then
        install_claude_code  # Reuse progress init
    fi

    log "Cline installation complete"
}

install_cursor() {
    log "Installing for Cursor..."

    # Generate .cursorrules
    if [ -f "$ACADEMY_DIR/platforms/cursor/.cursorrules" ]; then
        cp "$ACADEMY_DIR/platforms/cursor/.cursorrules" "$ACADEMY_DIR/.cursorrules"
    else
        cat > "$ACADEMY_DIR/.cursorrules" << 'CURSORRULES'
# AI Architect Academy — Cursor Rules

You are a Socratic AI architecture instructor in the AI Architect Academy.

## Teaching Approach
- Ask questions before giving answers
- Guide students through labs with incremental hints
- Review code like a senior architect: correctness, architecture, understanding
- Auto-activate relevant skills based on what the student is working on

## Labs
- Lab 01: Fix the Broken RAG Pipeline (labs/01-rag-pipeline/) — 3 bugs to find
- Lab 02: Build a Multi-Agent System (labs/02-multi-agent-system/) — implement Coordinator
- Lab 03: Build Your Own MCP Server (labs/03-mcp-server/) — 4 TODOs to implement

## Skills Library
80+ skills in skills/ directory auto-activate by context:
- RAG & Knowledge: chunking, retrieval, vector DBs
- Agent Frameworks: Claude SDK, Oracle ADK, LangGraph
- Multi-Cloud: OCI, AWS, Azure, GCP patterns
- Enterprise: security, compliance, cost optimization

## Progress Tracking
Student progress stored in .academy/progress.json
CURSORRULES
    fi
    log "Cursor rules installed"

    # Create progress tracker
    mkdir -p "$ACADEMY_DIR/.academy"

    log "Cursor installation complete"
}

install_windsurf() {
    log "Installing for Windsurf..."

    # Generate .windsurfrules
    if [ -f "$ACADEMY_DIR/platforms/windsurf/.windsurfrules" ]; then
        cp "$ACADEMY_DIR/platforms/windsurf/.windsurfrules" "$ACADEMY_DIR/.windsurfrules"
    else
        cat > "$ACADEMY_DIR/.windsurfrules" << 'WINDSURFRULES'
# AI Architect Academy — Windsurf Rules

You are a Socratic AI architecture instructor in the AI Architect Academy.

## Teaching Approach
- Ask questions before giving answers
- Guide students through labs with incremental hints
- Review code like a senior architect: correctness, architecture, understanding
- Auto-activate relevant skills based on what the student is working on

## Labs
- Lab 01: Fix the Broken RAG Pipeline (labs/01-rag-pipeline/) — 3 bugs to find
- Lab 02: Build a Multi-Agent System (labs/02-multi-agent-system/) — implement Coordinator
- Lab 03: Build Your Own MCP Server (labs/03-mcp-server/) — 4 TODOs to implement

## Skills Library
80+ skills in skills/ directory auto-activate by context.

## Progress Tracking
Student progress stored in .academy/progress.json
WINDSURFRULES
    fi
    log "Windsurf rules installed"

    # Create progress tracker
    mkdir -p "$ACADEMY_DIR/.academy"

    log "Windsurf installation complete"
}

install_skills() {
    log "Setting up skill packs..."

    # Create skill directories
    mkdir -p "$ACADEMY_DIR/skills/core"
    mkdir -p "$ACADEMY_DIR/skills/oci"
    mkdir -p "$ACADEMY_DIR/skills/multi-cloud"
    mkdir -p "$ACADEMY_DIR/skills/enterprise"

    # Check if claude-ai-architect submodule exists (it has 22+ skills)
    if [ -d "$ACADEMY_DIR/claude-ai-architect/skills" ]; then
        log "Found claude-ai-architect skills (22+ skills)"

        # Symlink or copy skills into organized structure
        for skill_dir in "$ACADEMY_DIR/claude-ai-architect/skills"/*/; do
            if [ -d "$skill_dir" ]; then
                skill_name=$(basename "$skill_dir")
                case "$skill_name" in
                    oci-*|oracle-*|genai-*)
                        ln -sfn "../../claude-ai-architect/skills/$skill_name" "$ACADEMY_DIR/skills/oci/$skill_name" 2>/dev/null || true
                        ;;
                    aws-*|azure-*|multi-cloud-*)
                        ln -sfn "../../claude-ai-architect/skills/$skill_name" "$ACADEMY_DIR/skills/multi-cloud/$skill_name" 2>/dev/null || true
                        ;;
                    ai-security-*|enterprise-*)
                        ln -sfn "../../claude-ai-architect/skills/$skill_name" "$ACADEMY_DIR/skills/enterprise/$skill_name" 2>/dev/null || true
                        ;;
                    *)
                        ln -sfn "../../claude-ai-architect/skills/$skill_name" "$ACADEMY_DIR/skills/core/$skill_name" 2>/dev/null || true
                        ;;
                esac
            fi
        done
        log "Skills organized into core/oci/multi-cloud/enterprise"
    else
        warn "claude-ai-architect not found — run 'git submodule update --init' for full skill pack"
    fi

    # Create skill index
    local skill_count=0
    for dir in "$ACADEMY_DIR/skills"/*/*; do
        [ -d "$dir" ] && ((skill_count++))
    done
    log "Skill packs ready: $skill_count skills indexed"
}

setup_dashboard() {
    log "Setting up progress dashboard..."

    mkdir -p "$ACADEMY_DIR/dashboard"

    # Create dashboard opener script
    cat > "$ACADEMY_DIR/dashboard/open.sh" << 'DASHOPEN'
#!/bin/bash
# Open the AI Architect Academy progress dashboard
DASHBOARD_DIR="$(cd "$(dirname "$0")" && pwd)"
PORT="${1:-3721}"

echo "Starting AI Architect Academy Dashboard on http://localhost:$PORT"

# Use Python's built-in HTTP server
if command -v python3 &> /dev/null; then
    cd "$DASHBOARD_DIR"
    python3 -m http.server "$PORT" &
    DASH_PID=$!
    echo "Dashboard running (PID: $DASH_PID)"

    # Try to open in browser
    if command -v xdg-open &> /dev/null; then
        xdg-open "http://localhost:$PORT" 2>/dev/null
    elif command -v open &> /dev/null; then
        open "http://localhost:$PORT"
    elif command -v wslview &> /dev/null; then
        wslview "http://localhost:$PORT"
    else
        echo "Open http://localhost:$PORT in your browser"
    fi

    echo "Press Ctrl+C to stop"
    wait $DASH_PID
elif command -v npx &> /dev/null; then
    cd "$DASHBOARD_DIR"
    npx serve -p "$PORT" .
else
    echo "Requires python3 or npx. Install one and try again."
    exit 1
fi
DASHOPEN
    chmod +x "$ACADEMY_DIR/dashboard/open.sh"
    log "Dashboard server script created"
}

# ─── Main ────────────────────────────────────────────────────────

banner
check_prerequisites

echo ""
echo -e "  ${BOLD}Platform:${NC} $PLATFORM"
echo -e "  ${BOLD}Academy:${NC} $ACADEMY_DIR"
echo ""

# Install platform adapter(s)
case "$PLATFORM" in
    claude-code)
        install_claude_code
        ;;
    cline)
        install_cline
        ;;
    cursor)
        install_cursor
        ;;
    windsurf)
        install_windsurf
        ;;
    all)
        install_claude_code
        install_cline
        install_cursor
        install_windsurf
        ;;
esac

# Install shared components
install_skills
setup_dashboard

echo ""
echo -e "  ${GREEN}${BOLD}Installation complete!${NC}"
echo ""
echo -e "  ${BOLD}Next steps:${NC}"

case "$PLATFORM" in
    claude-code)
        echo "    1. Run: claude"
        echo "    2. Type: /academy"
        ;;
    cline)
        echo "    1. Open this directory in VS Code"
        echo "    2. Cline will read .clinerules automatically"
        echo "    3. Ask: 'Start lab 01'"
        ;;
    cursor)
        echo "    1. Open this directory in Cursor"
        echo "    2. Cursor reads .cursorrules automatically"
        echo "    3. Ask: 'Start lab 01'"
        ;;
    windsurf)
        echo "    1. Open this directory in Windsurf"
        echo "    2. Windsurf reads .windsurfrules automatically"
        echo "    3. Ask: 'Start lab 01'"
        ;;
    all)
        echo "    Open this directory in any supported coding agent"
        ;;
esac

echo ""
echo -e "  ${CYAN}Dashboard:${NC} ./dashboard/open.sh"
echo -e "  ${CYAN}Premium:${NC}   https://aiarchitectacademy.com"
echo ""
