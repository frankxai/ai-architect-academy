# Active Tasks

Track current work items. Persists across context resets.

## In Progress

- None currently

## Queued

- [ ] Split 8 remaining oversized skills (see Backlog)
- [ ] Add more D2 templates

## Completed (Recent)

- [x] **Vendor-neutral overhaul + Knowledge automation** (2026-01-06)
  - Fixed GPT version to 5.2 (was incorrectly 5.1)
  - Made repo vendor-neutral with best-of-breed recommendations
  - Added Vercel AI SDK 6, OpenRouter, Railway to recommended stack
  - Created `/update-knowledge` command for automated version updates
  - Created `skills/knowledge-updater` skill (23rd skill)
  - Overhauled VERSION-TRACKING.md with comprehensive tech coverage
- [x] **Version tracking overhaul** (2026-01-06)
  - Updated all 22 skills to v1.1.0 with proper metadata
  - Added `last_updated` and `external_version` to all skills
  - Created `dev-docs/VERSION-TRACKING.md` for centralized version management
  - Updated CLAUDE.md model selection (Claude Opus 4.5, Sonnet 4.5, GPT-5.2)
  - Updated CONTEXT.md with recent changes
- [x] **Best practices evolution** (2026-01-05)
  - Restructured CLAUDE.md (371→108 lines, WHAT/WHY/HOW format)
  - Created 5 slash commands in .claude/commands/
  - Created skill-rules.json with 14 activation rules
  - Added LIMITATIONS.md documenting Claude Code constraints
  - Updated all dev-docs persistence files
- [x] Added Full Enterprise Package (8 new skills)
- [x] Created skill-rules.json for auto-activation
- [x] Set up dev-docs persistence structure
- [x] Created .claude infrastructure

## Blocked

- None

## Backlog

- [ ] **Split remaining large skills (>500 lines)** - 8 skills remaining:
  - huggingface-trainer (617), enterprise-ai-patterns (590)
  - finops-ai (582), rag-expert (561), multi-cloud-ai-architect (561)
  - architecture-diagramming (558), mcp-2025-patterns (543), agentic-orchestration (538)
  - *(Completed: claude-sdk, kubernetes-ai, terraform-iac, ai-security-expert)*
- [ ] Add more D2 diagram templates
- [ ] Create Terraform modules for all clouds
- [ ] Add integration tests for skills

---
*Update after each work session*
