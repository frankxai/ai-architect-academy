# Pattern: Genomic Sequence Processing & Public Health

## Business Value
- Accelerate genomic analyses for surveillance and research while ensuring privacy.

## Technical Architecture
- Pipelines for sequence alignment, variant calling, annotation
- Secure compute and storage; de-identification; access controls
- LLM-assisted report generation with strict grounding

## Discovery Questions
- Data volumes and turnaround time?
- Privacy and regulatory requirements (HIPAA/GDPR)?
- Collaboration and data sharing needs?

## Bill of Materials
- HPC/Cloud compute, genomics toolchain, secure storage, audit logs

## Risks & Controls
- Privacy breach → de-identification, access policies
- Reproducibility → versioned pipelines and datasets
