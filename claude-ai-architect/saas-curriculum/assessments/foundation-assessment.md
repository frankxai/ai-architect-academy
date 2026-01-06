# AI Architect Foundation Assessment

> Assessment for AI Architect Associate certification

## Instructions

- Complete all sections
- Minimum passing score: 80%
- Open book - you may reference materials
- Practical exercises must be submitted

---

## Section 1: Knowledge Check (40 points)

### Q1. AI Architect Command Center (10 points)

**1.1** What are the four main components of the Command Center? (4 points)
```
a) _____________
b) _____________
c) _____________
d) _____________
```

**1.2** How do skills auto-activate in the Command Center? (3 points)
```
Answer: _______________________________________________
```

**1.3** Name three slash commands and their purposes. (3 points)
```
a) /_______ : _______________________
b) /_______ : _______________________
c) /_______ : _______________________
```

### Q2. OCI GenAI (15 points)

**2.1** Compare On-Demand vs Dedicated AI Clusters. (6 points)

| Feature | On-Demand | DAC |
|---------|-----------|-----|
| Cost Model | | |
| Performance | | |
| Fine-Tuning | | |

**2.2** What is the recommended DAC size for 500K requests/month with <3s latency? (3 points)
```
Answer: _______ units
Reasoning: _______________________________________________
```

**2.3** List the four components of OCI GenAI Agents for RAG. (4 points)
```
a) _____________
b) _____________
c) _____________
d) _____________
```

**2.4** When should you fine-tune vs use RAG? (2 points)
```
Fine-tune when: _______________________________________________
RAG when: _______________________________________________
```

### Q3. Architecture Patterns (15 points)

**3.1** Draw or describe a basic RAG architecture. (5 points)
```
[User Query] → [______] → [______] → [______] → [Response]
```

**3.2** What factors determine model selection? (5 points)
```
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________
4. _______________________________________________
5. _______________________________________________
```

**3.3** Name three security considerations for AI systems. (5 points)
```
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________
```

---

## Section 2: Practical Exercise (60 points)

### Exercise A: Architecture Design (30 points)

**Scenario**: A retail company wants an AI solution for:
- Product recommendations based on customer history
- Chatbot for customer support
- Inventory demand forecasting

**Requirements**:
- Monthly budget: $25,000
- Response time: <2 seconds
- Data residency: US only
- Integration with existing Oracle ERP

**Tasks**:

1. **Design Architecture** (15 points)
   - Use `/design-solution` or manual design
   - Include all components
   - Consider security and compliance

2. **Create D2 Diagram** (10 points)
   - Professional diagram of your solution
   - Include data flows
   - Show integration points

3. **Cost Estimate** (5 points)
   - Break down monthly costs
   - Justify sizing decisions

**Submission Format**:
```
submission/
├── architecture.md     # Written design
├── diagram.d2          # D2 source
├── diagram.svg         # Rendered diagram
└── cost-estimate.md    # Cost breakdown
```

### Exercise B: RAG Implementation (30 points)

**Scenario**: Build a knowledge base for the customer support chatbot.

**Tasks**:

1. **Design Knowledge Base** (10 points)
   - Define data sources
   - Choose chunking strategy
   - Plan embedding approach

2. **Write Terraform** (15 points)
   - Create OCI GenAI resources
   - Configure knowledge base
   - Set up agent endpoint

3. **Test Plan** (5 points)
   - Define test scenarios
   - Quality metrics
   - Evaluation approach

**Submission Format**:
```
submission/
├── knowledge-base-design.md
├── terraform/
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
└── test-plan.md
```

---

## Grading Rubric

### Knowledge Check (40 points)
- 10 points: Complete and accurate
- 7 points: Mostly accurate with minor errors
- 5 points: Partially correct
- 0 points: Incorrect or blank

### Architecture Design (30 points)
- 30 points: Professional quality, all requirements met
- 24 points: Good design with minor gaps
- 18 points: Basic design, missing some requirements
- 12 points: Incomplete design
- 0 points: Not submitted

### RAG Implementation (30 points)
- 30 points: Working implementation, well-documented
- 24 points: Working implementation, some documentation gaps
- 18 points: Partial implementation
- 12 points: Incomplete
- 0 points: Not submitted

---

## Submission

1. Complete all sections
2. Create ZIP file: `foundation-assessment-{name}.zip`
3. Submit via Academy portal
4. Allow 5 business days for grading

---

## Certification

Upon passing (80%+):
- Receive AI Architect Associate badge
- Access to Professional track
- Listed in Academy directory

---

*Good luck! You've got this.*
