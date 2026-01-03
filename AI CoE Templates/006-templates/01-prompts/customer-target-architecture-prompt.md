# Customer Target Architecture Prompt

**Use Case**: Generate a customer-specific architecture document that can be distributed as a deliverable

## Prompt Structure:
```
Using the target-architecture-template.md, create a comprehensive Target Architecture document for:

**Customer Context:**
- Customer Name: [Specific customer name]
- Industry: [Customer's industry]
- Current Challenge: [Primary business challenge they're facing]
- Strategic Initiative: [Business initiative driving this project]

**Pattern Application:**
- Base Pattern: [Design Pattern XX - Pattern Name]
- Specific Use Case: [How customer will use this pattern]
- Scale Requirements: [Volume/performance requirements]
- Integration Needs: [Systems that need to integrate]

**Business Requirements:**
- Success Metrics: [Quantifiable business outcomes]
- Timeline: [Project timeline and key milestones]
- Budget Considerations: [Budget range or constraints]
- Compliance/Security: [Regulatory or security requirements]

**Technical Environment:**
- Current Infrastructure: [Existing systems and platforms]
- Preferred Technologies: [Technology preferences or constraints]
- Data Characteristics: [Data types, volumes, sources]
- Performance Requirements: [SLA requirements, throughput needs]

Generate a complete, customer-ready Target Architecture document that:
1. Addresses their specific business context and challenges
2. Maps the design pattern to their environment
3. Provides clear business value proposition
4. Includes realistic implementation phases
5. Contains customer-specific architecture diagrams
6. Can be used as a formal project proposal or SOW input
```

## Example Usage Scenario

**Scenario**: Customer Proposal Development  
A sales engineer needs to create a technical proposal for a manufacturing customer implementing predictive maintenance using IoT data analytics.

**Application**: Use this prompt with manufacturing context, IoT data patterns, and predictive analytics focus to generate a customer-ready architecture proposal.