# Publishing Engine Quality Assurance Team

## Agent Team Structure

This defines the agent team that ensures quality, accuracy, and freshness of all published content.

## Team Members

### 1. Fact-Checker Agent
**Role**: Verify all factual claims, dates, and version numbers

**Responsibilities**:
- Verify current year (2026) is used correctly
- Confirm framework versions via WebSearch before content creation
- Cross-reference claims with official documentation
- Flag outdated information

**Invocation**: Automatically runs before any content is published

**Tools**:
- WebSearch (for version verification)
- WebFetch (for documentation checking)
- Context7 MCP (for library docs)

### 2. Version Auditor Agent
**Role**: Ensure all code and dependencies use current versions

**Responsibilities**:
- Audit package.json files for outdated dependencies
- Verify code examples work with current framework versions
- Check for deprecated API patterns
- Update installation commands

**Weekly Task**: Full version audit across all content

**Current Versions to Enforce (January 2026)**:
```json
{
  "next": "^16.1.0",
  "react": "^19.0.0",
  "langgraph": "^1.0.5",
  "langchain": "^1.0.0",
  "@anthropic-ai/claude-agent-sdk": "latest"
}
```

### 3. Freshness Monitor Agent
**Role**: Track content age and schedule refreshes

**Responsibilities**:
- Monitor "last updated" timestamps
- Flag content older than 30 days for review
- Track framework releases that invalidate content
- Maintain content freshness score

**Daily Task**: Scan for stale content

### 4. Link Validator Agent
**Role**: Ensure all links are working and current

**Responsibilities**:
- Verify external links are not broken
- Check internal links point to existing pages
- Validate documentation URLs are current
- Update changed URLs

**Weekly Task**: Full link audit

## Quality Gates

### Pre-Publish Gate
Every piece of content must pass:

1. **Date Check**: 2026 references, not 2025
2. **Version Check**: All versions verified current
3. **Code Check**: Examples tested with current frameworks
4. **Link Check**: All URLs valid
5. **Freshness Check**: "Last updated" is today

### Automated Checks
```typescript
interface QualityCheck {
  dateAccuracy: boolean;      // Uses 2026, not 2025
  versionsVerified: boolean;  // WebSearch confirmed
  codeWorks: boolean;         // Tested with current versions
  linksValid: boolean;        // All URLs return 200
  freshness: boolean;         // Updated timestamp present
}
```

## Escalation Protocol

If quality check fails:
1. Block publish
2. Identify specific failures
3. Fix issues
4. Re-run checks
5. Only publish when all checks pass

## Integration with Daily Workflow

```
Morning Research
      ↓
Content Creation
      ↓
┌─────────────────────┐
│ QUALITY TEAM REVIEW │ ← All 4 agents run
├─────────────────────┤
│ □ Fact-Checker      │
│ □ Version Auditor   │
│ □ Freshness Monitor │
│ □ Link Validator    │
└─────────────────────┘
      ↓ (all pass)
Publication
      ↓
Git Push → Vercel Auto-Deploy
```

## Why This Matters

Without this team, errors like these slip through:
- Using "2025" when we're in 2026
- Referencing Next.js 15 when 16.1 is current
- LangGraph 0.x patterns when 1.0 is stable
- Outdated Claude API patterns

The quality team is the last line of defense before content goes live.
