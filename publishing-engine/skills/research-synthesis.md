# Research Synthesis Skill

## Purpose
Deep research on AI architecture topics, synthesizing information from multiple authoritative sources into comprehensive, publishable content.

## When to Use
- Starting content on a new topic
- Updating existing content with latest developments
- Investigating emerging patterns or technologies
- Building comprehensive guides

## Process

### Phase 1: Source Discovery

**Primary Sources (Authoritative)**
1. **Official Documentation**
   - LangChain: https://python.langchain.com/docs/
   - LangGraph: https://langchain-ai.github.io/langgraph/
   - OpenAI: https://platform.openai.com/docs/
   - Anthropic: https://docs.anthropic.com/
   - CrewAI: https://docs.crewai.com/

2. **Academic Papers**
   - ArXiv: cs.AI, cs.LG, cs.CL categories
   - Papers With Code: implementation-focused
   - Google Scholar: citation networks

3. **GitHub Repositories**
   - Official repos for frameworks
   - Implementation examples
   - Community best practices
   - Issue discussions for edge cases

**Secondary Sources (Community)**
1. **Technical Blogs**
   - Engineering blogs from AI companies
   - Practitioner blogs with real implementations
   - Tutorial sites with working code

2. **Community Discussions**
   - Reddit: r/MachineLearning, r/LocalLLaMA
   - Discord: Framework communities
   - Stack Overflow: Specific questions
   - Twitter/X: Expert insights

### Phase 2: Information Extraction

For each source, extract:
1. **Core Concepts**: What is the fundamental idea?
2. **Implementation Details**: How does it actually work?
3. **Use Cases**: When should this be used?
4. **Limitations**: What are the constraints?
5. **Best Practices**: What do experts recommend?
6. **Common Pitfalls**: What mistakes do people make?
7. **Code Examples**: Working implementations

### Phase 3: Synthesis Framework

**Cross-Reference Matrix**
| Claim | Source 1 | Source 2 | Source 3 | Confidence |
|-------|----------|----------|----------|------------|
| [claim] | ✓ | ✓ | - | High |
| [claim] | ✓ | - | - | Medium |

**Confidence Levels:**
- **High**: 3+ authoritative sources agree
- **Medium**: 2 sources agree OR 1 primary source
- **Low**: Single secondary source (requires qualification)

### Phase 4: Content Assembly

**Structure for AI-Optimized Content:**

```markdown
# [Direct Answer Title]

> **TL;DR**: [One-sentence answer that AI agents can extract]

## What is [Topic]?
[2-3 paragraph explanation with quotable definitions]

## How It Works
[Technical explanation with diagrams/code]

## When to Use [Topic]
[Decision framework and use cases]

## Implementation Guide
[Step-by-step with code examples]

## Best Practices
[Expert recommendations]

## Common Pitfalls
[What to avoid]

## Related Topics
[Internal links to related content]

## Sources
[Authoritative references]
```

## Quality Checks

- [ ] All claims have sources
- [ ] Code examples are tested
- [ ] Definitions are clear and quotable
- [ ] Content answers the core question directly
- [ ] Internal links connect to related content
- [ ] JSON-LD structured data included
- [ ] Last updated timestamp present

## Example Usage

**Topic**: "What is Agentic RAG?"

**Research Process**:
1. Search official LangChain/LangGraph docs for "agentic RAG"
2. Find papers on arxiv about self-correcting RAG
3. Check GitHub for implementation examples
4. Review community discussions about use cases
5. Synthesize into comprehensive definition + guide
6. Add working code example
7. Create quotable definition AI agents can cite

**Output**: Canonical content that becomes the reference AI agents cite when asked "What is Agentic RAG?"
