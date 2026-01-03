# Bill of Materials Generation Prompt

**Use Case**: Create detailed resource requirements for pricing and project planning

## Prompt Structure:
```
Using the bill-of-materials-template.md, create a comprehensive BOM for:

**Project Scope:**
- Pattern Implementation: [Design Pattern XX - Pattern Name]
- Customer Requirements: [Specific customer needs and scale]
- Implementation Phases: [Phased approach or full implementation]
- Timeline: [Project duration and key milestones]

**Technical Specifications:**
- Data Volume: [Expected data volumes and growth]
- User Load: [Concurrent users, transaction volumes]
- Performance Requirements: [SLAs, response times]
- Availability Requirements: [Uptime requirements, DR needs]

**Integration Requirements:**
- Source Systems: [Systems providing data]
- Target Systems: [Systems consuming data/services]
- External Connections: [Third-party integrations]
- Security Requirements: [Compliance, encryption, access control]

**Operational Context:**
- Environment Needs: [Dev/Test/Prod requirements]
- Support Model: [24x7, business hours, self-service]
- Backup Requirements: [RPO/RTO requirements]
- Monitoring Needs: [Operational visibility requirements]

Generate a detailed Bill of Materials that:
1. Lists all required OCI services with sizing
2. Includes third-party components and licensing
3. Specifies development and operational tools
4. Provides integration complexity assessment
5. Can be used for accurate cost estimation
6. Supports procurement and project planning decisions
```

## Example Usage Scenario

**Scenario**: Project Scoping and Estimation  
A solutions engineer needs to provide accurate resource estimates for a cloud migration and modernization project.

**Application**: Use this prompt with migration scope, modernization requirements, and operational transformation context to generate comprehensive resource requirements.