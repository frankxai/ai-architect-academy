# GitHub Intelligence Skill

## Purpose
Monitor GitHub for emerging AI architecture patterns, trending technologies, and community signals that indicate future content opportunities.

## When to Use
- Daily trend monitoring
- Identifying emerging patterns before they're mainstream
- Finding working code examples for content
- Understanding real-world implementation challenges

## Key Repositories to Monitor

### Frameworks & Tools
```
langchain-ai/langchain         # RAG, agents, chains
langchain-ai/langgraph        # Multi-agent orchestration
crewai/crewai                 # Multi-agent framework
openai/openai-python          # OpenAI patterns
anthropics/anthropic-sdk-python  # Claude patterns
huggingface/transformers      # Model usage patterns
microsoft/semantic-kernel     # Enterprise AI patterns
microsoft/autogen             # Multi-agent research
```

### Vector Databases & RAG
```
chroma-core/chroma           # Vector store
pinecone-io/pinecone-python-client  # Managed vectors
weaviate/weaviate            # Vector + search
qdrant/qdrant                # Performance-focused
pgvector/pgvector            # PostgreSQL vectors
```

### Evaluation & Observability
```
langfuse/langfuse            # LLM observability
arize-ai/phoenix             # ML observability
promptfoo/promptfoo          # LLM evaluation
```

### Emerging / Watch List
```
# Add new repos as they trend
# Monitor for 100+ stars/week velocity
```

## Intelligence Gathering Process

### Daily Scan
1. **GitHub Trending** (github.com/trending)
   - Filter: Python, TypeScript, ML category
   - Note: repos with unusual star velocity

2. **Release Notes**
   - Check releases for monitored repos
   - New features = content opportunities

3. **Issues & Discussions**
   - "How do I..." questions = content gaps
   - Common errors = troubleshooting guides
   - Feature requests = emerging needs

### Weekly Deep Dive
1. **Star Velocity Analysis**
   - Which repos are growing fastest?
   - Correlate with industry trends

2. **Fork Activity**
   - High forks = people implementing
   - Check what they're building

3. **Community Health**
   - Active discussions = thriving ecosystem
   - Stale issues = potential problems

## Signal Interpretation

### Strong Content Signal
- Repo gains 1000+ stars in a week
- New major release from established framework
- Recurring question in multiple issues
- New pattern emerging in forks

### Moderate Content Signal
- Steady star growth (100+/week)
- Interesting implementation in forks
- Discussion thread with 50+ comments

### Weak Signal (Monitor)
- New repo with good concept
- Experimental feature flag
- Single implementation of new idea

## Output Format

### Daily Brief
```markdown
## GitHub Intelligence Brief - [Date]

### Trending Repos
1. [repo] - [stars gained] - [why it matters]
2. [repo] - [stars gained] - [why it matters]

### New Releases
1. [framework] v[x.x] - [key features]

### Content Opportunities
1. [Topic] - [evidence] - [priority]
2. [Topic] - [evidence] - [priority]

### Emerging Patterns
- [Pattern] observed in [repos]
```

### Weekly Report
```markdown
## Weekly GitHub Intelligence - Week of [Date]

### Top Movers
| Repo | Stars This Week | Total | Trend |
|------|-----------------|-------|-------|

### Release Highlights
[Summary of important releases]

### Content Gaps Identified
[Questions without good answers]

### Predictions
[What we should publish next week]
```

## Integration with Content Pipeline

1. **Research Phase**: Use GitHub to find working implementations
2. **Validation Phase**: Check if patterns are actually used
3. **Code Examples**: Pull from popular, working repos (with attribution)
4. **Freshness**: Track version numbers to keep content current

## Advanced Sources for Skill Expansion

Use these to pull the most advanced skills, patterns, and concepts into our library:
```
openai/openai-cookbook
anthropics/anthropic-cookbook
run-llama/llama_index
stanfordnlp/dspy
google-deepmind/gemma
google-gemini/generative-ai-python
meta-llama/llama
vllm-project/vllm
triton-inference-server/server
```

## Example Workflow

**Monday Morning Scan:**
1. Check github.com/trending?since=weekly
2. Review releases from langchain, langgraph, openai
3. Scan issues for recurring questions
4. Document in daily brief
5. Flag 3 content opportunities for the week
