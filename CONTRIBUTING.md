# Contributing to AI Architect Academy

Thank you for your interest in contributing to the AI Architect Academy! This project aims to transform Claude Code into a comprehensive AI architecture learning environment.

## Ways to Contribute

### 1. Add New Skills

Skills are the heart of the academy. Each skill teaches a specific capability.

**Location:** `claude-ai-architect/skills/` or propose for global skills

**Skill Template:**
```markdown
---
name: skill-name
description: Brief description of what this skill teaches
version: 1.0.0
---

# Skill Name

## Purpose
What problem does this skill solve?

## When to Use
When should someone activate this skill?

## Core Concepts
Key ideas and patterns with code examples.

## Code Examples
Working, runnable code that demonstrates the concept.

## Best Practices
Do's and don'ts.

## Decision Framework
When to use this vs alternatives.

## Resources
Links to official docs and further reading.
```

### 2. Build Projects

Projects are hands-on coding challenges that reinforce skills.

**Location:** `05-projects/`

**Project Template:**
```markdown
# Project: [Name]

## Overview
- **Difficulty:** Beginner/Intermediate/Advanced/Expert
- **Time:** Estimated hours
- **Skills Used:** List of skills

## What You'll Build
Description of the end result.

## Prerequisites
What the learner should know first.

## Step-by-Step Guide
1. Step with code
2. Step with code
3. ...

## Testing Your Solution
How to verify it works.

## Extensions
Ideas for going further.
```

### 3. Improve Learning Paths

Learning paths guide learners through a structured curriculum.

**Location:** `02-learning-paths/`

**Considerations:**
- Clear progression from simple to complex
- Estimated time for each module
- Prerequisites clearly stated
- Projects that reinforce each section

### 4. Add Design Patterns

Production-ready architecture patterns for enterprise AI.

**Location:** `01-design-patterns/`

**Pattern Template:**
```markdown
# Pattern: [Name]

## Problem
What challenge does this solve?

## Solution
High-level description.

## Architecture Diagram
```
[ASCII or Mermaid diagram]
```

## When to Use
Scenarios where this pattern fits.

## Implementation
Code with explanations.

## Trade-offs
Pros and cons.

## Related Patterns
Links to related patterns.
```

### 5. Enhance Documentation

- Fix typos and unclear explanations
- Add more code examples
- Improve diagrams
- Update outdated information

---

## Contribution Guidelines

### Code Standards

- **TypeScript first** for all new code
- **ES6+** patterns, async/await
- **Strict types**, avoid `any`
- **Clear naming**, DRY, single responsibility

### Commit Messages

Use conventional commits:
```
feat: add new LangGraph skill
fix: correct typo in RAG expert skill
docs: improve MCP architecture examples
refactor: simplify multi-agent patterns
```

### Pull Request Process

1. **Fork** the repository
2. **Create a branch** with a descriptive name
   ```bash
   git checkout -b feat/add-crewai-skill
   ```
3. **Make changes** following our standards
4. **Test** your changes work with Claude Code
5. **Commit** with conventional commit messages
6. **Push** and create a Pull Request
7. **Describe** what you added and why

### What Makes a Good Contribution

- **Runnable code** - Every example should work
- **Clear explanations** - Explain the "why" not just the "what"
- **Production-ready** - Patterns should be usable in real systems
- **Well-tested** - Include test commands or verification steps
- **Properly attributed** - Credit sources and inspirations

---

## Getting Started

### Setup

```bash
# Clone the repo
git clone https://github.com/frankxai/ai-architect-academy.git
cd ai-architect-academy

# Start Claude Code
claude

# See available commands
/academy
```

### Testing Your Changes

```bash
# Test a skill loads correctly
/skill-name

# Test a project works
/project project-name

# Test a learning path
/learn path-name
```

---

## Community

- **Discussions:** [GitHub Discussions](https://github.com/frankxai/ai-architect-academy/discussions)
- **Issues:** [GitHub Issues](https://github.com/frankxai/ai-architect-academy/issues)

### Issue Templates

**Bug Report:**
- What happened?
- What did you expect?
- Steps to reproduce
- Environment (OS, Claude Code version)

**Feature Request:**
- What problem would this solve?
- Proposed solution
- Alternatives considered

**Skill Request:**
- What skill is needed?
- What would it teach?
- Example use cases

---

## Recognition

Contributors are recognized in:
- The repository's contributor list
- Release notes for significant contributions
- Special thanks in relevant skill/pattern files

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make the AI Architect Academy the best resource for learning AI architecture!

*Coding Agents First*
