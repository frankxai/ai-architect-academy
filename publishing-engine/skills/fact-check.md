# Fact-Check & Version Verification Skill

## Purpose
Ensure all content is factually accurate, uses correct current dates, and references the latest versions of all frameworks and tools. This skill MUST be invoked before any content is published.

## CRITICAL: Date and Version Verification

### Current Date Context
- **Today**: January 6, 2026
- **Always verify**: Use WebSearch to confirm current versions before publishing

### Current Versions (January 2026)

| Technology | Current Version | Verify At |
|------------|-----------------|-----------|
| Next.js | 16.1 | nextjs.org/blog |
| React | 19.x | react.dev |
| LangGraph | 1.0.5 | pypi.org/project/langgraph |
| LangChain | 1.0.x | pypi.org/project/langchain |
| Claude Agent SDK | Latest | github.com/anthropics/claude-agent-sdk-python |
| OpenAI SDK | Latest | pypi.org/project/openai |

### Verification Process

**BEFORE creating any content:**

1. **Check the date**
   - Current year is 2026
   - Never reference 2025 as current
   - Use WebSearch if uncertain

2. **Verify framework versions**
   ```
   WebSearch: "[framework] latest version January 2026"
   ```

3. **Cross-reference official sources**
   - Official documentation
   - GitHub releases page
   - Package registries (npm, PyPI)

4. **Update version references**
   - package.json dependencies
   - Code examples
   - Installation commands

## Common Errors to Catch

### Date Errors
- [ ] Using 2025 instead of 2026
- [ ] Referencing "next year" incorrectly
- [ ] Outdated "last updated" timestamps

### Version Errors
- [ ] Next.js 15.x instead of 16.x
- [ ] LangGraph 0.x instead of 1.x
- [ ] Outdated package.json versions
- [ ] Old API patterns that changed

### Content Errors
- [ ] Deprecated methods or patterns
- [ ] Changed configuration formats
- [ ] Renamed packages or modules
- [ ] Removed features

## Verification Checklist

Before publishing ANY content:

```markdown
## Fact-Check Verification

- [ ] Current year (2026) used correctly
- [ ] All framework versions verified via WebSearch
- [ ] package.json uses current versions
- [ ] Code examples tested with current versions
- [ ] No deprecated patterns used
- [ ] "Last updated" date is today's date
- [ ] External links verified as working
```

## When to Re-verify

- **Daily**: Check for new releases of major frameworks
- **Weekly**: Full version audit of all content
- **On publish**: Every piece of content before going live

## Integration with Publishing Workflow

This skill is a MANDATORY gate in the daily workflow:

```
Research → Draft → FACT-CHECK → Optimize → Publish
                       ↓
              Must pass all checks
              before proceeding
```

## Example Verification

**Before writing about LangGraph:**

1. Search: "LangGraph latest version January 2026"
2. Confirm: 1.0.5 is current
3. Check: langchain-ai/langgraph releases
4. Update: Any code examples to use 1.0 patterns
5. Note: 0.x patterns deprecated until Dec 2026

**Before writing Next.js content:**

1. Search: "Next.js latest version January 2026"
2. Confirm: 16.1 is current
3. Check: Turbopack now default
4. Update: Use "use cache" not old caching patterns
5. Note: React Compiler stable in 16.x
