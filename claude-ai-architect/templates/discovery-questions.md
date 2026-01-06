# AI Architecture Discovery Questions

Use these questions during client engagements to gather requirements for AI solution design.

---

## 1. Business Context

### Problem Definition
- [ ] What business problem are you trying to solve?
- [ ] What is the expected business impact (revenue, cost savings, efficiency)?
- [ ] Who are the primary users of this solution?
- [ ] What does success look like? How will you measure it?

### Stakeholders
- [ ] Who is the executive sponsor?
- [ ] Who are the technical decision makers?
- [ ] Which teams will use/maintain this solution?
- [ ] Are there any competing priorities or initiatives?

### Timeline & Budget
- [ ] What is the target go-live date?
- [ ] Is there a hard deadline (regulatory, business event)?
- [ ] What is the allocated budget range?
- [ ] Are there existing contracts or credits with cloud providers?

---

## 2. Current State

### Existing Infrastructure
- [ ] Which cloud providers do you currently use?
- [ ] What is your primary cloud for production workloads?
- [ ] Any existing AI/ML infrastructure or platforms?
- [ ] Current CI/CD and DevOps tooling?

### Data Landscape
- [ ] Where does the relevant data currently reside?
- [ ] What is the data volume (GB/TB)?
- [ ] How frequently is data updated?
- [ ] What formats (structured, unstructured, documents)?

### Team Capabilities
- [ ] Do you have in-house ML/AI expertise?
- [ ] Experience with specific frameworks (TensorFlow, PyTorch)?
- [ ] Familiarity with cloud AI services?
- [ ] DevOps/MLOps maturity level?

---

## 3. AI/ML Requirements

### Use Case Details
- [ ] What type of AI task? (Generation, Classification, Extraction, etc.)
- [ ] Is this real-time or batch processing?
- [ ] Expected request volume (per second, per day)?
- [ ] Latency requirements (acceptable response time)?

### Model Requirements
- [ ] Need for custom/fine-tuned models vs. pre-trained?
- [ ] Specific model capabilities required? (Reasoning, code, multilingual)
- [ ] Any model preferences or restrictions? (Open source vs. proprietary)
- [ ] Need for model versioning/A-B testing?

### RAG / Knowledge Base (if applicable)
- [ ] What documents/data should the AI reference?
- [ ] How many documents? Total size?
- [ ] How often is this content updated?
- [ ] Need for multi-language support?
- [ ] Citation/source attribution required?

---

## 4. Technical Requirements

### Integration
- [ ] What systems need to integrate with the AI solution?
- [ ] API format preferences (REST, GraphQL)?
- [ ] Authentication requirements (OAuth, API keys, SSO)?
- [ ] Need for webhooks or event-driven architecture?

### Performance
- [ ] Expected concurrent users?
- [ ] Peak vs. average load patterns?
- [ ] Acceptable latency (P50, P95, P99)?
- [ ] Availability requirements (SLA)?

### Scalability
- [ ] Expected growth over 1-3 years?
- [ ] Need for auto-scaling?
- [ ] Multi-region deployment required?
- [ ] Disaster recovery requirements?

---

## 5. Security & Compliance

### Regulatory Requirements
- [ ] Which regulations apply? (GDPR, HIPAA, SOC 2, PCI-DSS, SOX)
- [ ] Data residency requirements?
- [ ] Industry-specific compliance needs?
- [ ] Audit requirements?

### Data Security
- [ ] Data classification levels present?
- [ ] PII or sensitive data involved?
- [ ] Encryption requirements (at rest, in transit)?
- [ ] Key management preferences?

### Access Control
- [ ] User authentication method?
- [ ] Role-based access control needs?
- [ ] Audit logging requirements?
- [ ] Data access governance?

### AI-Specific Security
- [ ] Concerns about prompt injection?
- [ ] Need for content moderation?
- [ ] Output filtering requirements?
- [ ] Model access logging?

---

## 6. Operations

### Monitoring
- [ ] Existing monitoring tools (Datadog, Grafana, etc.)?
- [ ] Key metrics to track?
- [ ] Alerting requirements?
- [ ] Dashboard needs?

### Support
- [ ] Expected support model (24/7, business hours)?
- [ ] Incident response requirements?
- [ ] Who handles L1/L2/L3 support?
- [ ] SLA requirements?

### Maintenance
- [ ] Model retraining frequency?
- [ ] Knowledge base update process?
- [ ] Change management process?
- [ ] Deployment windows?

---

## 7. Cost Considerations

### Budget Structure
- [ ] CapEx vs. OpEx preferences?
- [ ] Monthly budget ceiling?
- [ ] Cost allocation/chargeback model?
- [ ] Reserved capacity vs. on-demand preference?

### Optimization Priorities
- [ ] Priority: Cost vs. Performance vs. Features?
- [ ] Acceptable trade-offs?
- [ ] Long-term commitment flexibility?

---

## 8. Future Considerations

### Roadmap
- [ ] Planned future use cases?
- [ ] Expected evolution of requirements?
- [ ] Multi-modal needs (text, image, audio)?
- [ ] Agent/automation aspirations?

### Vendor Strategy
- [ ] Single-vendor or best-of-breed preference?
- [ ] Multi-cloud strategy?
- [ ] Open source vs. managed service preference?
- [ ] Build vs. buy philosophy?

---

## Discovery Session Template

### Session 1: Business & Strategy (1 hour)
- Business context questions
- Stakeholder mapping
- Success criteria definition

### Session 2: Technical Deep Dive (2 hours)
- Current state assessment
- AI/ML requirements
- Technical requirements
- Integration mapping

### Session 3: Security & Operations (1 hour)
- Compliance requirements
- Security controls
- Operational model

### Session 4: Architecture Review (2 hours)
- Present proposed architecture
- Gather feedback
- Refine requirements
- Agree on next steps

---

## Quick Qualification Questions

Use these 5 questions for initial qualification:

1. **What problem are you solving?**
   _Understand the use case and business value_

2. **What data do you have?**
   _Determine if data is available and suitable_

3. **What's your timeline and budget?**
   _Assess feasibility and scope_

4. **What are your compliance requirements?**
   _Identify constraints early_

5. **Who will use and maintain this?**
   _Understand operational model_

---

## Red Flags to Watch For

| Red Flag | Risk | Mitigation |
|----------|------|------------|
| No clear success metrics | Scope creep, failed project | Define KPIs before design |
| "We need AI" without use case | Solution looking for problem | Workshop to identify real needs |
| Unrealistic timeline | Quality issues, team burnout | Reset expectations, phase approach |
| No data governance | Compliance risk | Address before implementation |
| No operational plan | Failed adoption | Include ops in design phase |
| Undefined budget | Stalled project | Get budget range commitment |

---

## Post-Discovery Deliverables

After discovery sessions, deliver:

1. **Discovery Summary**
   - Key findings
   - Requirements matrix
   - Risk register

2. **Proposed Architecture**
   - High-level design
   - Component selection rationale
   - D2/diagram visualization

3. **Cost Estimate**
   - Monthly run rate
   - Implementation costs
   - TCO projection

4. **Implementation Plan**
   - Phased approach
   - Resource requirements
   - Timeline with milestones

5. **Next Steps**
   - Decision points
   - Open questions
   - Action items with owners
