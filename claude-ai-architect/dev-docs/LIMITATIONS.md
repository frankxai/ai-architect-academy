# Claude Code Limitations & Workarounds

## Understanding Claude Code Constraints

This document captures known limitations of Claude Code and how this toolkit addresses them.

---

## 1. Context Window Management

### Limitation
Claude has a context window limit. Long conversations, verbose instructions, or large skill files can exceed this limit, causing:
- **Instruction amnesia**: Claude "forgets" earlier instructions
- **Truncation**: Parts of context get dropped
- **Degraded performance**: Quality decreases as context fills

### Our Mitigations
- **Concise CLAUDE.md**: Reduced from 371 → 108 lines (71% smaller)
- **Progressive disclosure**: Core info in CLAUDE.md, details in linked files
- **Skill activation rules**: Only load relevant skills via `.claude/settings/skill-rules.json`
- **500-line skill limit**: Prevents any single skill from bloating context
- **Resource files**: Move examples/templates to `resources/` subdirectories

### Best Practices
```
DO: Keep CLAUDE.md under 200 lines
DO: Use tables instead of verbose lists
DO: Link to detailed docs instead of inlining
DON'T: Put code examples directly in CLAUDE.md
DON'T: Repeat the same information in multiple places
```

---

## 2. Instruction Following

### Limitation
Claude may ignore instructions that:
- Are deeply nested in long documents
- Conflict with other instructions
- Seem irrelevant to the current task
- Are phrased as suggestions rather than requirements

### Our Mitigations
- **WHAT/WHY/HOW structure**: Clear, scannable organization
- **Tables for reference**: Quick lookup, not verbose prose
- **Skill-based activation**: Right instructions for right task
- **Dev persistence files**: Critical context in dedicated files

### Best Practices
```
DO: Put critical instructions at the top
DO: Use imperative language ("Always X" not "You might want to X")
DO: Test instructions with edge cases
DON'T: Bury important rules in long paragraphs
DON'T: Use soft language for hard requirements
```

---

## 3. Session Persistence

### Limitation
Claude Code doesn't persist state between sessions:
- Plans are forgotten
- Context is lost
- Task progress resets

### Our Mitigations
- **`dev-docs/PLAN.md`**: Persistent development plans
- **`dev-docs/CONTEXT.md`**: Project context that survives resets
- **`dev-docs/TASKS.md`**: Active task tracking
- **Git commits**: Progress is captured in version control

### Best Practices
```
DO: Update dev-docs/ at end of each session
DO: Use TodoWrite tool during sessions
DO: Commit frequently with descriptive messages
DON'T: Rely on Claude remembering previous sessions
DON'T: Store critical decisions only in conversation
```

---

## 4. Skill File Size

### Limitation
Large skill files (>500 lines):
- Consume excessive context
- May be partially ignored
- Slow down processing
- Reduce response quality

### Current Status
12 skills exceed 500 lines (see TASKS.md backlog). Functional but suboptimal.

### Our Mitigations
- **Planned splitting**: Move code examples to `resources/`
- **Progressive loading**: Resources loaded only when referenced
- **Cheatsheets**: Quick reference separate from detailed skills

### Best Practices
```
DO: Keep SKILL.md under 500 lines
DO: Use resources/ for code examples, configs, templates
DO: Reference examples by path, don't inline
DON'T: Include full API documentation in skills
DON'T: Duplicate content between skills
```

---

## 5. Hook Reliability

### Limitation
Claude Code hooks (UserPromptSubmit, PostToolUse):
- May not trigger consistently in all scenarios
- Can't guarantee execution order
- Have limited access to context
- May add latency

### Our Mitigations
- **Declarative rules**: `skill-rules.json` for consistent activation
- **Documentation**: `.claude/hooks/skill-activation.md` explains behavior
- **Fallback patterns**: Manual skill selection always available

### Best Practices
```
DO: Keep hooks simple and fast
DO: Document hook behavior
DO: Provide manual alternatives
DON'T: Put critical logic only in hooks
DON'T: Create complex hook chains
```

---

## 6. Multi-File Operations

### Limitation
Complex refactoring across many files can:
- Exceed tool call limits
- Lose track of changes
- Create inconsistent states

### Our Mitigations
- **TodoWrite tool**: Track multi-step operations
- **Incremental commits**: Save progress frequently
- **Parallel tool calls**: Use when operations are independent

### Best Practices
```
DO: Break large changes into phases
DO: Commit after each logical unit
DO: Use TodoWrite for tracking
DON'T: Attempt 20+ file changes in one request
DON'T: Skip intermediate commits
```

---

## 7. External API Dependencies

### Limitation
WebFetch and external API calls:
- May fail or timeout
- Have rate limits
- Can return stale data
- May be blocked by firewalls

### Our Mitigations
- **Cached knowledge base**: Key docs stored locally
- **Offline-first skills**: Core functionality without network
- **Fallback patterns**: Graceful degradation

### Best Practices
```
DO: Cache frequently used external data
DO: Provide offline alternatives
DO: Handle API failures gracefully
DON'T: Depend entirely on external APIs
DON'T: Assume network always available
```

---

## 8. Model Knowledge Cutoff

### Limitation
Claude's training has a knowledge cutoff (currently ~Jan 2025):
- May not know latest APIs
- Framework versions may be outdated
- Best practices may have evolved

### Our Mitigations
- **Context7 MCP**: Fetch latest documentation
- **Knowledge base updates**: Manually updated references
- **Version-aware skills**: Specify version compatibility

### Best Practices
```
DO: Verify against latest docs for critical code
DO: Use Context7 for current library info
DO: Update knowledge-base/ periodically
DON'T: Assume Claude knows latest releases
DON'T: Use deprecated APIs from memory
```

---

## Summary Checklist

When working with this toolkit:

- [ ] Keep CLAUDE.md concise (<200 lines)
- [ ] Use skills for specialized knowledge
- [ ] Update dev-docs/ at end of sessions
- [ ] Commit frequently
- [ ] Use TodoWrite for complex tasks
- [ ] Verify external API responses
- [ ] Check latest docs for version-sensitive code

---

*Last updated: 2026-01-05*
