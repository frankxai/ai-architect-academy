# Education AI Learning Path

Build AI systems that transform learning through adaptive instruction, accessibility enhancement, and equitable educational access. This path connects enterprise AI architecture skills to improving educational outcomes at scale.

## Overview

Education AI has the potential to provide personalized learning experiences to billions of learners, bridge accessibility gaps, and democratize access to quality education. This learning path equips architects with the patterns, ethical frameworks, and deployment strategies needed to build production-grade educational AI systems that are effective, equitable, and empowering.

**Target Outcome:** Design and deploy AI systems that personalize learning, enhance accessibility, and improve educational outcomes while respecting learner agency and privacy.

## Prerequisites

- Foundational understanding of ML/AI concepts (NLP, recommendation systems)
- Experience with Python and web application development
- Familiarity with cloud infrastructure (OCI, AWS, or GCP)
- Basic understanding of learning science principles
- Completion of `02-learning-paths/beginner.md` recommended

## Duration

**8-10 weeks** at 12-15 hours/week, or **100 hours** intensive

---

## Module 1: Learning Science & EdTech Foundations (16h)

**North Star:** Understand how people learn and how technology can support effective instruction.

### Learning Objectives
- Apply learning science principles to AI system design
- Navigate educational data ecosystems and standards
- Implement FERPA/COPPA-compliant data architectures
- Design learner models that respect privacy and agency

### Topics Covered
| Day | Focus | Output |
|-----|-------|--------|
| 1 | Learning science foundations | Summary of key theories (constructivism, mastery learning, spaced repetition) |
| 2 | Educational data standards | Mapping of xAPI, LTI, QTI, and SCORM standards |
| 3 | Privacy in education | FERPA/COPPA compliance architecture document |
| 4 | Learner modeling | Knowledge tracing model design specification |

### Hands-On Project: Learning Analytics Platform
Build a privacy-respecting learning analytics system:
- Ingest xAPI learning records from LMS
- Build learner profiles with explicit consent mechanisms
- Implement data minimization and retention policies
- Create dashboards for learners, instructors, and administrators

### Key Resources
- `08-governance/privacy-gdpr.md`
- IMS Global Learning Consortium standards
- FERPA and COPPA regulations
- "How Learning Works" by Ambrose et al.

---

## Module 2: Adaptive Learning Systems (18h)

**North Star:** Build AI that personalizes learning paths and content.

### Learning Objectives
- Implement knowledge tracing and mastery models
- Design adaptive sequencing algorithms
- Build personalized content recommendation systems
- Create intelligent tutoring system architectures

### Topics Covered
| Day | Focus | Output |
|-----|-------|--------|
| 1 | Knowledge tracing | BKT and Deep Knowledge Tracing implementation |
| 2 | Mastery learning | Prerequisite graph and mastery threshold system |
| 3 | Adaptive sequencing | Multi-armed bandit for content selection |
| 4 | Content recommendation | Collaborative filtering for learning resources |
| 5 | Intelligent tutoring | Conversational tutor architecture |

### Hands-On Project: Adaptive Math Tutor
Build an intelligent tutoring system for mathematics:
- Model learner knowledge state using DKT
- Generate personalized problem sequences
- Provide adaptive hints based on error patterns
- Track progress toward mastery objectives

### Case Study: Duolingo
Analyze Duolingo's adaptive learning system:
- Spaced repetition with personalized intervals
- A/B testing infrastructure for learning experiments
- Gamification and engagement mechanics
- Accessibility features for diverse learners

### Tools & Frameworks
- **PyKT**: Knowledge tracing models
- **pyBKT**: Bayesian Knowledge Tracing
- **Surprise**: Recommendation algorithms
- **Rasa**: Conversational AI for tutoring
- **H5P**: Interactive content creation

---

## Module 3: Natural Language in Education (18h)

**North Star:** Apply NLP to enhance learning through language.

### Learning Objectives
- Build automated essay scoring systems
- Design AI writing assistants for learners
- Implement reading level analysis and simplification
- Create question generation and answering systems

### Topics Covered
| Day | Focus | Output |
|-----|-------|--------|
| 1 | Automated essay scoring | Rubric-based essay evaluation model |
| 2 | Writing assistance | Grammar, style, and argumentation feedback system |
| 3 | Reading level analysis | Flesch-Kincaid and ML-based complexity scoring |
| 4 | Text simplification | Adaptive text simplification pipeline |
| 5 | Question generation | Educational QA pair generation system |

### Hands-On Project: AI Writing Coach
Build an intelligent writing feedback system:
- Analyze essays for structure, coherence, and argumentation
- Provide formative feedback aligned to rubrics
- Suggest improvements without doing the work
- Support revision tracking and growth measurement

### Case Study: Turnitin Feedback Studio
Examine Turnitin's AI-powered feedback tools:
- Similarity detection and academic integrity
- Grammar and writing quality feedback
- Integration with LMS gradebooks
- Controversy around AI detection in education

### Tools & Frameworks
- **BERT/GPT variants**: Language understanding
- **LanguageTool**: Grammar checking
- **Textstat**: Readability metrics
- **Hugging Face Transformers**: Fine-tuned models
- **OpenAI API**: Writing assistance (with guardrails)

---

## Module 4: Accessibility & Inclusive Design (16h)

**North Star:** Build AI that makes education accessible to all learners.

### Learning Objectives
- Implement AI-powered accessibility features
- Design for neurodivergent learners
- Build multimodal learning experiences
- Create assistive technologies using AI

### Topics Covered
| Day | Focus | Output |
|-----|-------|--------|
| 1 | Accessibility foundations | WCAG 2.1 compliance audit framework |
| 2 | Visual accessibility | Alt-text generation and screen reader optimization |
| 3 | Audio accessibility | Speech-to-text and caption generation |
| 4 | Cognitive accessibility | Attention support and executive function tools |

### Hands-On Project: Universal Learning Platform
Build an accessible learning experience:
- Auto-generate alt-text for educational images
- Create real-time captions for video content
- Implement text-to-speech with pronunciation control
- Design adjustable complexity and pacing controls

### Case Study: Microsoft Immersive Reader
Analyze Microsoft's accessibility toolkit:
- Text decoding support for dyslexia
- Grammar tools and picture dictionary
- Translation and transliteration
- Cross-platform integration patterns

### Tools & Frameworks
- **Azure Cognitive Services**: Speech, vision, language
- **Google Cloud Speech-to-Text**: Transcription
- **Whisper**: Open-source speech recognition
- **NVDA/JAWS**: Screen reader testing
- **axe-core**: Accessibility testing automation

---

## Module 5: Assessment & Evaluation AI (16h)

**North Star:** Build fair and effective AI-powered assessment systems.

### Learning Objectives
- Design AI-enhanced formative assessment
- Implement automated grading with human oversight
- Build proctoring alternatives that respect privacy
- Create competency-based assessment frameworks

### Topics Covered
| Day | Focus | Output |
|-----|-------|--------|
| 1 | Formative assessment | Real-time understanding detection system |
| 2 | Automated grading | Multi-rater calibration for AI scoring |
| 3 | Academic integrity | Non-invasive integrity assurance approaches |
| 4 | Competency assessment | Skills-based portfolio evaluation system |

### Hands-On Project: Competency Assessment Engine
Build a skills-based assessment platform:
- Define competency frameworks with observable indicators
- Collect evidence from diverse artifact types
- Apply ML for preliminary assessment suggestions
- Support human review and calibration workflows

### Case Study: EdX Adaptive Assessment
Examine edX's computer adaptive testing:
- Item Response Theory implementation
- Question bank calibration
- Score reporting and certification
- Fairness auditing across demographics

### Tools & Frameworks
- **CAT algorithms**: Computerized adaptive testing
- **PyTorch/TensorFlow**: Custom scoring models
- **Gradescope**: AI-assisted grading
- **Canvas/Blackboard APIs**: LMS integration
- **Open Badges**: Credential verification

---

## Module 6: AI Literacy & Ethical EdTech (16h)

**North Star:** Build educational AI that empowers rather than replaces human agency.

### Learning Objectives
- Design AI literacy curricula for learners
- Implement explainable AI for educational contexts
- Build governance frameworks for EdTech AI
- Address equity and bias in educational AI

### Topics Covered
| Day | Focus | Output |
|-----|-------|--------|
| 1 | AI literacy frameworks | Age-appropriate AI education curriculum |
| 2 | Explainable recommendations | Transparency features for adaptive systems |
| 3 | Governance frameworks | EdTech AI ethics policy template |
| 4 | Equity auditing | Demographic fairness evaluation pipeline |

### Hands-On Project: Ethical AI Dashboard
Build a governance and transparency system:
- Visualize how AI recommendations are made
- Track demographic equity in learning outcomes
- Implement learner control over AI features
- Create audit trails for institutional review

### Case Study: Khan Academy + GPT-4
Analyze Khan Academy's Khanmigo implementation:
- Tutoring with guardrails (no direct answers)
- Socratic questioning prompts
- Teacher oversight and control
- Privacy considerations for minors

### Tools & Frameworks
- **AI Fairness 360**: Bias detection
- **SHAP/LIME**: Model explanations
- **DataCards**: Dataset documentation
- **Model Cards**: Model documentation
- **ISTE AI Standards**: Educational AI competencies

---

## Capstone Project Options

### Option A: Adaptive Learning Platform
Build a complete adaptive learning system for a subject area:
- Knowledge modeling with prerequisite graphs
- Personalized content sequencing
- Mastery-based progression
- Instructor dashboard for intervention

**Deliverables:**
- Working adaptive learning application
- Learning efficacy evaluation design
- Privacy and consent documentation
- Equity audit report

### Option B: Accessible Education Suite
Design an accessibility-first educational experience:
- Multimodal content delivery (text, audio, visual)
- AI-powered accommodations engine
- Universal Design for Learning implementation
- Learner preference profiles

**Deliverables:**
- Accessible learning platform
- WCAG 2.1 AA compliance certification
- User research with diverse learners
- Scalability and cost analysis

### Option C: AI Teaching Assistant
Build an AI system that supports human teachers:
- Automated formative assessment
- Personalized feedback generation
- Early warning system for struggling learners
- Curriculum gap analysis

**Deliverables:**
- Teaching assistant AI application
- Integration with major LMS platforms
- Teacher workflow study
- Student outcome measurement plan

---

## Ethical Considerations Framework

### Learner Agency
- AI should enhance, not replace, human judgment
- Learners should understand how AI affects their experience
- Opt-out mechanisms for AI-driven features
- Avoidance of manipulative design patterns

### Equity & Access
- Audit for demographic disparities in outcomes
- Design for low-bandwidth and offline scenarios
- Support for multilingual learners
- Consideration of socioeconomic contexts

### Privacy & Data Minimization
- Collect only data necessary for learning
- Clear data retention and deletion policies
- Age-appropriate consent mechanisms
- Protection of vulnerable populations (minors)

### Transparency & Accountability
- Explainable AI recommendations
- Human oversight for high-stakes decisions
- Regular algorithmic audits
- Clear liability and governance structures

---

## Assessment Criteria

### Technical Excellence
- System handles diverse learner needs
- Architecture scales to institutional requirements
- Accessibility standards met or exceeded
- Security and privacy controls implemented

### Educational Impact
- Clear connection to learning outcomes
- Evidence-based pedagogical approaches
- Support for instructor effectiveness
- Consideration of learner wellbeing

### Enterprise Readiness
- Integration with LMS and SIS systems
- Compliance with FERPA/COPPA requirements
- Governance and oversight frameworks
- Sustainable business model analysis

---

## Tools & Platforms Summary

| Category | Tools |
|----------|-------|
| **Data** | xAPI, LTI, Caliper, Learning Locker |
| **Adaptive** | PyKT, pyBKT, Recommendation engines |
| **NLP** | BERT, GPT, LanguageTool, Textstat |
| **Accessibility** | Azure Cognitive Services, Whisper, axe-core |
| **Assessment** | CAT libraries, Gradescope, Open Badges |
| **Cloud** | OCI, AWS Educate, Google for Education |
| **LMS** | Canvas API, Moodle, Blackboard |

---

## Career Pathways

Completing this path prepares you for:
- **EdTech Startups**: Technical co-founder or lead architect
- **Higher Education**: Learning technology director
- **K-12 Districts**: Chief Technology Officer or AI lead
- **Publishers**: AI product architect for adaptive content
- **Research**: Learning engineering and AI in education

---

## Next Steps

1. Complete the self-assessment in `02-learning-paths/self-assessment.md`
2. Join the Education AI community channel
3. Select your capstone project focus
4. Connect with learning science experts through the Academy network
5. Explore related paths: `health-ai.md`, `economic-ai.md`

---

## References

- ISTE Standards for Students and Educators
- UNESCO AI and Education guidance
- FERPA (20 U.S.C. 1232g; 34 CFR Part 99)
- COPPA (15 U.S.C. 6501-6506)
- "How Learning Works" - Ambrose et al.
- "Design for How People Learn" - Julie Dirksen
- IMS Global Learning Consortium standards
