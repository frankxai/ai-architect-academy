# Pattern: Geographic Intelligence Platform

**Mission:** Deliver spatial insights for planning, routing, and asset management with rich analytics and natural language interfaces.

## High-Value Use Cases
| Use Case | Impact | KPIs |
| --- | --- | --- |
| Network planning | Optimise site selection for retail, towers, infrastructure. | Time-to-site shortlist <2 weeks, demand coverage gains. |
| Field operations & routing | Reduce travel, improve SLA compliance for crews. | Route efficiency +10%, SLA adherence. |
| Risk & compliance mapping | Visualise environmental, regulatory, safety overlays. | Incident reduction, compliance audit success. |
| Market expansion intelligence | Identify white spaces, competitor encroachment. | Pipeline value per geography, conversion rate. |

## Experience Blueprint
| Stage | Human | AI/Agents | Systems |
| --- | --- | --- | --- |
| Data Intake | GIS analyst curates layers, licensing metadata. | Data agent normalises projections, tags usage constraints, QC. | Spatial data lake, metadata catalog. |
| Exploration | Planner queries scenarios, overlays filters. | NL-to-SQL agent translates questions to geospatial queries, produces map cards. | PostGIS/BigQuery GIS, vector tiles. |
| Modelling & Prediction | Data scientist runs demand forecasting, risk scoring. | ML agent trains/serves models, provides feature importances. | ML platform + spatial feature store. |
| Decision Packaging | Team assembles proposal, routing plan, risk brief. | Narrative agent summarises findings, generates decks/maps, ensures licensing compliance. | Storytelling templates, Langfuse logs. |
| Execution & Monitoring | Ops executes plan, monitors KPIs. | Feedback agent tracks outcomes, updates dashboards, triggers retraining. | BI, telemetry ingestion. |

## Technical Architecture Stack
1. **Spatial Data Platform:** Data lake with raster/vector support, ETL pipelines, licensing metadata (DataHub).  
2. **Query & Analytics Layer:** PostGIS/BigQuery GIS, tile server (Tegola/Mapbox), caching.  
3. **ML & Forecasting:** Feature store (Feast), ML pipelines for demand/risk models, evaluation harness.  
4. **Interaction Layer:** LLM interface grounded in schema, map rendering, heatmaps, scenario templates.  
5. **Governance & Observability:** Access controls, licensing policy enforcement, audit trails, Langfuse + Promptfoo for NL query validation.

## Data & Models
- Satellite imagery, Lidar, IoT sensors, demographic datasets, licensing terms.  
- Models: Demand forecasting, risk classification, route optimisation, segmentation.  
- Tools: GDAL, Rasterio, Mapbox, Deck.gl, LLM for NL query translation.

## Implementation Sprints
1. **Spatial Data Foundation** – Stand up data lake, ingestion workflows, licensing metadata store.  
2. **Query APIs** – Build NL interface + prebuilt dashboards.  
3. **Predictive Models** – Train demand/risk models, integrate with pipeline.  
4. **Decision Workflows** – Create templated outputs (maps, briefs), integrate with approvals.  
5. **Operationalisation** – Monitoring, cost control, incident response for data issues.  
6. **Expansion** – Add partner datasets, supply chain integration.

## Agent Build Instructions
- Pull architecture/BOM from CoE templates under GIS pattern.  
- Clone baseline project (if available) or scaffold using repo structure: data ingestors, query API, UI.  
- Compose multi-agent system: retrieval (metadata), NL interpreter, map rendering, reporting.  
- Generate artefacts: architecture doc, data catalog, sample maps, evaluation report.  
- Provide agent tasks for coding assistant: ingest script, query API, map UI, evaluation tests.

## Evaluation & Observability
- Query accuracy vs baseline SQL queries, map load times, caching efficiency.  
- Model accuracy (MAE, ROC), route savings.  
- Licensing compliance logs, data usage tracking.  
- Langfuse traces, cost dashboard, incident metrics.

## Governance & Controls
- Licensing guardrails via `AI-procurement-checklist`.  
- Incident management with `incident-response-checklist` (data breaches, map outages).  
- Human oversight for critical planning approvals per `human-review-checklist`.  
- Document retention + audit mapping in governance library.

## Deliverables & Templates
- Spatial architecture blueprint, BOM from CoE templates.  
- Governance binder (licensing, policy).  
- Evaluation package (query regression tests, model metrics).  
- Decision stories (map deck, narrative).  
- Runbook for agent tasks (ingest, map refresh, incident response).