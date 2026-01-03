# Design Pattern Templates

This directory contains standardized templates for documenting design patterns and their implementation details. These templates ensure consistency across pattern documentation and provide comprehensive guidance for technical architects and implementation teams.

## Templates Overview

| Template | Purpose | When to Use |
|----------|---------|-------------|
| `design-pattern-template.md` | Complete pattern documentation | Creating new design patterns with full technical and business details |
| `target-architecture-template.md` | Customer-specific architecture design | Customizing patterns for specific customer implementations |
| `technical-architecture-template.md` | Detailed technical specifications | Documenting technical components and system architecture |
| `discovery-questions-template.md` | Customer requirements gathering | Conducting discovery sessions and requirements analysis |
| `bill-of-materials-template.md` | Resource and component listing | Identifying required services, tools, and components |

## Template Structure

Each template follows a consistent structure with:
- **Metadata section**: Pattern identification and versioning
- **Structured content blocks**: Organized by functional areas using XML-style tags
- **Placeholder guidance**: Bracketed placeholders with specific instructions
- **Business-focused sections**: Connecting technical implementation to business value

## Usage Guidelines

### For New Design Patterns
1. Start with `design-pattern-template.md` for comprehensive pattern documentation
2. Include all sections: solution overview, discovery questions, technical architecture, and implementation guidelines
3. Replace all bracketed placeholders with pattern-specific content

### For Customer Implementations
1. Use `target-architecture-template.md` for customer-specific architecture design
2. Conduct discovery using `discovery-questions-template.md`
3. Generate resource requirements using `bill-of-materials-template.md`

### For Technical Documentation
1. Use `technical-architecture-template.md` for detailed system specifications
2. Focus on component architecture, data flows, and operational requirements
3. Include security, performance, and integration details

## Template Features

- **Structured XML tags**: Enable easy parsing and content organization
- **Business alignment**: Connect technical solutions to business outcomes
- **Comprehensive coverage**: Include security, compliance, performance, and operational aspects
- **Scalable format**: Templates can be customized based on complexity and scope
- **Version control**: Built-in metadata for tracking template evolution

## Best Practices

- Replace **all** bracketed placeholders with specific content
- Maintain consistent terminology across related documents
- Include quantifiable metrics and success criteria
- Provide clear architecture diagrams using ASCII art or references
- Document integration points and dependencies thoroughly
- Consider both immediate and long-term business impacts