# Pattern: Genomic Sequence Intelligence

**Mission:** Accelerate genomic analysis for surveillance and clinical care with secure pipelines, transparent reporting, and collaborative workflows.

## High-Value Use Cases
| Use Case | Impact | KPIs |
| --- | --- | --- |
| Variant detection for clinical decisions | Faster diagnosis, targeted therapies. | Turnaround <12h, variant confidence scores, clinician adoption. |
| Public health surveillance | Detect emerging strains, track spread. | Time-to-alert, coverage % population, lineage classification accuracy. |
| Research collaboration | Share de-identified datasets with partners. | Data requests served, reproducibility, compliance events. |
| Pharmacogenomics reporting | Tailor drug regimens to patient profiles. | Prescription adjustments, adverse event reduction. |

## Experience Blueprint
| Stage | Human | AI/Agents | Systems |
| --- | --- | --- | --- |
| Intake & QC | Lab tech uploads sequences, metadata, consent. | QC agent checks read quality, contamination, schema. | LIMS, secure object storage. |
| Pipeline Execution | Bioinformatician monitors progress, adjusts parameters. | Workflow agent orchestrates alignment, variant calling, annotation (Nextflow/Snakemake). | HPC/Cloud compute. |
| Knowledge Integration | Clinician reviews annotations, guidelines. | Retrieval agent links variants to ClinVar, drug labels, institutional knowledge. | Knowledge graph, vector store. |
| Reporting & Review | Clinical team signs off, public health shares insights. | Narrative agent drafts reports with risk levels, recommended actions, cites evidence. | Reporting UI, Langfuse trace. |
| Feedback & Learning | Outcomes tracked, pipelines tuned. | Analytics agent aggregates metrics, flags drifts, schedules revalidation. | Data warehouse, evaluation suite. |

## Technical Architecture Stack
1. **Workflow Orchestration:** Nextflow/Cromwell orchestrating containerised tasks; integrated with Temporal for metadata + approvals.  
2. **Secure Data Plane:** Encrypted storage (S3+KMS), data lake with PHI/PII separation, audit logs.  
3. **Analysis Engines:** Alignment (BWA-MEM), variant calling (GATK), annotation (VEP, ClinVar), lineage assignment.  
4. **Knowledge Hub:** Knowledge graph + vector search for publications, guidelines, drug interactions.  
5. **Reporting & Collaboration:** Clinical dashboard, API for EHR integration, PDF/HL7 exports.  
6. **Observability & Compliance:** Langfuse, pipeline telemetry, Promptfoo evaluation (factual summaries, disclaimers), retention policies.

## Data & Models
- Sequence files (FASTQ/BAM/VCF), patient metadata (de-identified), drug response datasets, public databases (ClinVar, GISAID).  
- Models: Domain-specific LLMs for summarisation, variant prioritisation algorithms, statistical QC.  
- Tools: Pydantic validation, consent ledger, privacy-preserving transformations.

## Implementation Sprints
1. **Infrastructure Setup** – Provision secure storage, networking, secret management.  
2. **Pipeline Baseline** – Implement alignment + variant calling; verify accuracy vs reference set.  
3. **Annotation & Knowledge Graph** – Integrate medical knowledge sources, build retrieval pipeline.  
4. **Reporting Layer** – Generate clinician-friendly narratives, integrate with EHR, run review workflow.  
5. **Compliance & Audits** – Map policies, run tabletop incident response, configure retention.  
6. **Continuous Validation** – Automate evaluations, drift detection, reproduction checks.

## Agent Build Instructions
- Reference templates under `AI CoE Templates/002-pattern-library/.../genomics`.  
- Use `05-projects/domain-rag-healthcare` as base for retrieval/evaluation.  
- Automate pipeline scaffolding with `scripts/check_secrets.py` + `run_evals.py`.  
- Generate architecture doc + runbook, include PHI handling guidelines, incident plan, reproducibility statement.  
- Produce UI mockups using CoE templates; ensure review/approval flows captured.  
- Deliver dataset sample (synthetic), evaluation report, compliance mapping.

## Evaluation & Observability
- Pipeline accuracy vs reference (precision/recall), QC metrics.  
- Narrative factuality, citation coverage (Promptfoo).  
- Langfuse metrics: latency, cost, guardrail hits.  
- Weekly review with clinicians to capture overrides, feedback.

## Governance & Controls
- Procurement of external datasets via `AI-procurement-checklist`.  
- Incident response emphasising PHI, data breaches (`incident-response-checklist`).  
- Human review for all clinical recommendations (`human-review-checklist`).  
- Align with governance library (audit, retention).  
- Document data ethics and consent tracing.

## Deliverables & Templates
- Technical runbook, compliance binder, architecture diagrams from CoE templates.  
- Evaluation dataset + reports, reviewer audit log.  
- Storytelling artefacts for exec boards (metrics, impact narrative).  
- Reproducibility package (pipeline version, container manifests, dataset hash).