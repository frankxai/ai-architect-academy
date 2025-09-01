# Pattern: Geographic Information Systems (GIS) Intelligence

## Business Value
- Optimize network planning, routing, and asset management with spatial insights.

## Technical Architecture
- Spatial data ingestion (satellite, maps, sensors) → vector tiles/DB
- Spatial queries + ML models; LLM for natural language spatial queries
- Visualization and decision support dashboards

## Discovery Questions
- Spatial sources and licensing? Update cadence?
- Accuracy and resolution required for decisions?
- Integration with existing GIS tools?

## Bill of Materials
- Spatial DB (PostGIS), tile server, ML libs, visualization

## Risks & Controls
- Licensing and privacy → data governance
- Accuracy → QA pipelines and error bounds
