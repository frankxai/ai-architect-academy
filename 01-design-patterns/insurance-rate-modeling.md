# Pattern: Insurance Rate Modeling

## Business Value
- Achieve profitable growth by aligning underwriting prices with granular risk signals while maintaining competitiveness within regulatory bounds.
- Accelerate rate filing cycles through reusable actuarial assets, automated documentation, and transparent justification of pricing changes.
- Enhance cross-functional trust by exposing clear explanations of model drivers, fairness metrics, and compliance attestations.

## Technical Architecture
1. **Data Foundation**: Consolidate policy, claims, exposure, and third-party datasets (credit, weather, telematics) into a governed warehouse and feature store.
2. **Model Development**: Train GLMs, gradient boosting, or hybrid models with monotonic constraints; use LLMs to extract structured features from unstructured submissions.
3. **Validation & Explainability**: Apply cross-validation, stress tests, SHAP values, and fairness assessments across protected classes and geographies.
4. **Deployment & Governance**: Register approved models, manage champion/challenger rollouts, and integrate with workflow systems for actuarial and regulatory approvals.
5. **Monitoring & Feedback**: Continuously track loss ratio, hit ratio, drift, and regulatory KPIs; feed performance back into retraining pipelines.

## Discovery Questions
- Which product lines and jurisdictions are in scope, and what specific regulatory filings (SERFF, PRA) govern them?
- What external data sources add underwriting lift, and what contracts or privacy constraints accompany them?
- How frequently must rates be refreshed, and what is the change management process for approvals and communication to distribution partners?
- What level of explainability is required for regulators, and how will narratives be generated for filings or producer communications?

## Bill of Materials
- Data platform (Snowflake, Databricks) with feature store (Feast/Tecton) and lineage tracking (OpenLineage).
- Model development stack: scikit-learn, XGBoost, LightGBM, GLM libraries, plus document intelligence (Azure Form Recognizer, LayoutLM) for submissions.
- Governance & monitoring suite: MLflow/SageMaker Model Registry, EvidentlyAI/Fiddler for drift and fairness, and SHAP/LOCI for interpretability.
- Workflow integration: Actuarial approval portals, document generation for filings (Docassemble), and secure audit log storage.

## Risks & Controls
- **Regulatory Non-Compliance**: Embed regulatory rules as constraints, log every rate change with justifications, and maintain audit-ready documentation.
- **Fairness & Bias Issues**: Run pre/post-deployment fairness audits, monitor residuals by protected class, and enforce governance review for material shifts.
- **Data Quality Failures**: Implement data SLAs, anomaly detection, and incident response playbooks to address upstream data outages.
- **Model Overfitting**: Use robust validation, stress scenarios (catastrophe, economic shocks), and cap price changes to avoid market disruption.