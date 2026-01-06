# Daily Publishing Workflow Skill

## Purpose
Execute the complete daily publishing cycle: research, identify opportunities, create content, optimize, and publish.

## Invocation
```
/publish-daily
```

## Morning Routine (Research Phase)

### Step 1: GitHub Intelligence Scan (15 min)
```
1. Open github.com/trending (Python, TypeScript)
2. Check releases from:
   - langchain-ai/langchain
   - langchain-ai/langgraph
   - openai/openai-python
   - anthropic/anthropic-sdk-python
3. Scan issues for recurring questions
4. Note any repos with unusual star velocity
```

**Output**: `daily-brief-[date].md` in `/research/` folder

### Step 2: ArXiv & Research Scan (10 min)
```
1. Check arxiv.org for cs.AI, cs.LG new submissions
2. Note papers with practical applications
3. Flag emerging concepts
```

### Step 3: Community Pulse (15 min)
```
1. Reddit: r/MachineLearning, r/LocalLLaMA top posts
2. Twitter/X: Key AI accounts
3. Discord: LangChain, Anthropic communities
4. Note questions being asked
```

### Step 4: Competitive Gap Analysis (10 min)
```
1. Check competitor new content
2. Identify what they're missing
3. Find questions without good answers
```

## Midday Routine (Creation Phase)

### Step 5: Prioritize Today's Content (10 min)
```
1. Review predicted-queries.json
2. Cross-reference with morning research
3. Select 1-2 pieces to create/update
4. Determine content type for each
```

**Priority Criteria**:
- High volume + Low quality existing answers
- Emerging topic + No canonical content yet
- Our content that needs refresh

### Step 6: Research & Draft (60-90 min per piece)
```
1. Deep research using research-synthesis skill
2. Gather working code examples
3. Draft using appropriate template
4. Include all required sections
```

### Step 7: Human Experience Pass (15 min per piece)
```
1. Add a short takeaway or summary box
2. Ensure examples and visuals are clear
3. Check narrative flow for human readers
```

### Step 8: AI Optimization Pass (15 min per piece)
```
1. First paragraph check - does it directly answer?
2. Heading structure - semantic and parseable?
3. Definitions - quotable?
4. JSON-LD - complete?
5. Internal links - connected to related content?
```

### Step 9: Quality Review (10 min per piece)
```
1. Code examples - do they run?
2. Links - do they work?
3. Freshness - dates updated?
4. Voice - matches FrankX brand?
```

## Evening Routine (Optimization Phase)

### Step 10: Publish & Configure (10 min)
```
1. Save final content to appropriate folder
2. Update content-index.json
3. Regenerate sitemap
4. Deploy to production
```

### Step 11: Performance Setup (5 min)
```
1. Add to monitoring dashboard
2. Set up citation tracking
3. Configure alerts
```

### Step 12: Tomorrow Planning (10 min)
```
1. Update predicted-queries.json priorities
2. Note any new signals discovered
3. Schedule tomorrow's focus areas
```

## Weekly Additions

### Monday: Performance Review
```
- Which content got cited?
- Traffic patterns
- Identify top/underperformers
- Plan refreshes
```

### Wednesday: Competitive Deep Dive
```
- Full competitor content audit
- Identify strategic gaps
- Plan differentiated content
```

### Friday: Strategy Session
```
- Review week's output
- Update prediction model
- Plan next week's priorities
- Long-term roadmap check
```

## Content Production Targets

### Daily Targets
- 1 new piece of content (concept, guide, or compare)
- OR 2-3 content refreshes
- 1 daily research brief

### Weekly Targets
- 5 new pieces of content
- 3-5 content refreshes
- 1 weekly intelligence report
- Update predicted-queries.json

### Monthly Targets
- 20+ new pieces
- All priority queries addressed
- Comprehensive coverage review
- Prediction model refinement

## Quality Checkpoints

### Before Publishing
- [ ] First paragraph answers the query directly
- [ ] All code examples tested and working
- [ ] JSON-LD structured data complete
- [ ] Internal links to related content
- [ ] External links to authoritative sources
- [ ] Last updated timestamp present
- [ ] Keywords naturally integrated
- [ ] Meets FrankX voice guidelines
- [ ] Human summary or takeaway box included

### After Publishing
- [ ] Page renders correctly
- [ ] Sitemap updated
- [ ] Added to content index
- [ ] Monitoring configured

## Tools Used

1. **WebSearch** - Research queries
2. **WebFetch** - Documentation and papers
3. **Read/Write** - Content creation
4. **Bash** - Git operations, deployment
5. **Context7 MCP** - Library documentation

## Example Daily Log

```markdown
# Publishing Engine Daily Log - 2026-01-06

## Morning Research
- GitHub: LangGraph 0.2.1 released (new interrupt feature)
- ArXiv: Paper on agentic RAG self-correction
- Reddit: Multiple questions about Claude Code vs Cursor
- Gap: No good guide on LangGraph interrupts

## Content Created
1. "What is Agentic RAG?" (concept)
   - Status: Published
   - URL: /concepts/agentic-rag/
   - Priority: 95 → resolved

2. "LangGraph Human-in-the-Loop Guide" (guide)
   - Status: Draft complete, review tomorrow
   - URL: /guides/langgraph-human-in-loop/
   - Priority: New from today's signal

## Content Refreshed
- Updated vector database comparison with 2025 pricing

## Tomorrow's Priorities
1. Complete LangGraph guide review
2. Start "MCP Protocol" concept
3. Research Claude Code comparison request

## Notes
- CrewAI 2.0 rumored for next week - prepare content
- Need to add more enterprise patterns content
```

## Success Metrics

Track daily:
- Content pieces published
- Content pieces refreshed
- Queries addressed from priority list
- New signals identified

Track weekly:
- AI agent citations
- Traffic from AI-referred sources
- Content freshness score
- Coverage expansion
