# Climate AI Learning Path

Build AI systems that address climate change through carbon modeling, emissions optimization, and climate prediction. This path connects enterprise AI architecture skills to real-world environmental impact.

## Overview

Climate AI represents one of the most impactful applications of artificial intelligence, with potential to accelerate decarbonization, optimize resource usage, and improve climate modeling accuracy. This learning path equips architects with the patterns, tools, and deployment strategies needed to build production-grade climate intelligence systems.

**Target Outcome:** Design and deploy AI systems that measure, predict, and optimize climate-related outcomes at enterprise scale.

## Prerequisites

- Foundational understanding of ML/AI concepts (embeddings, model inference)
- Experience with Python and data processing pipelines
- Familiarity with cloud infrastructure (OCI, AWS, or GCP)
- Basic knowledge of time-series analysis
- Completion of `02-learning-paths/beginner.md` recommended

## Duration

**8-10 weeks** at 12-15 hours/week, or **100 hours** intensive

---

## Module 1: Climate Data Foundations (16h)

**North Star:** Understand climate data ecosystems and build reliable data pipelines.

### Learning Objectives
- Navigate climate data sources (satellites, sensors, models)
- Build ingestion pipelines for heterogeneous environmental data
- Apply quality assurance and gap-filling techniques
- Design schemas for multi-resolution spatiotemporal data

### Topics Covered
| Day | Focus | Output |
|-----|-------|--------|
| 1 | Climate data landscape | Annotated map of data sources (ERA5, CMIP6, Sentinel, NOAA) |
| 2 | Satellite data processing | Notebook processing Sentinel-2 imagery for land use classification |
| 3 | Sensor network integration | IoT data pipeline architecture document |
| 4 | Data quality & imputation | QA framework with anomaly detection for missing values |

### Hands-On Project: Climate Data Lake
Build a multi-source climate data lake on OCI Object Storage:
- Ingest ERA5 reanalysis data via API
- Process Sentinel satellite imagery
- Integrate local weather station feeds
- Implement data versioning and lineage tracking

### Key Resources
- `01-design-patterns/data-pipeline-pattern.md`
- ERA5 Climate Data Store API documentation
- Copernicus Climate Data Store tutorials

---

## Module 2: Carbon Accounting & Emissions Modeling (18h)

**North Star:** Build accurate carbon measurement and attribution systems.

### Learning Objectives
- Implement GHG Protocol Scope 1/2/3 calculation engines
- Design carbon footprint APIs for enterprise integration
- Apply emission factors and activity-based modeling
- Build uncertainty quantification into carbon estimates

### Topics Covered
| Day | Focus | Output |
|-----|-------|--------|
| 1 | GHG Protocol deep dive | Emissions calculation engine design doc |
| 2 | Scope 1 & 2 automation | API service for direct emissions calculation |
| 3 | Scope 3 supply chain | Graph-based supply chain emissions model |
| 4 | Life cycle assessment | LCA pipeline for product carbon footprinting |
| 5 | Uncertainty & verification | Monte Carlo simulation for carbon estimates |

### Hands-On Project: Enterprise Carbon Intelligence Platform
Build a carbon accounting system that:
- Ingests utility bills, fleet data, procurement records
- Calculates emissions across all scopes
- Generates audit-ready reports (GRI, CDP, TCFD aligned)
- Provides real-time carbon intensity dashboards

### Case Study: Microsoft Carbon Negative
Analyze Microsoft's journey to carbon negative by 2030:
- Internal carbon fee implementation
- Supplier engagement scoring
- Carbon removal portfolio strategy
- Lessons for enterprise carbon AI systems

### Tools & Frameworks
- **OpenGHG**: Open-source greenhouse gas data framework
- **Climatiq API**: Emission factor database
- **CarbonTracker**: Real-time carbon intensity data
- **Oracle Fusion SCM**: Supply chain emissions integration

---

## Module 3: Climate Prediction & Forecasting (18h)

**North Star:** Deploy ML models for weather and climate prediction.

### Learning Objectives
- Understand numerical weather prediction (NWP) foundations
- Implement ML-enhanced forecasting pipelines
- Design ensemble prediction systems
- Build extreme weather early warning systems

### Topics Covered
| Day | Focus | Output |
|-----|-------|--------|
| 1 | NWP fundamentals | Architecture comparison: physics-based vs ML models |
| 2 | Short-term forecasting | 72-hour weather prediction service |
| 3 | Seasonal prediction | ML model for seasonal precipitation forecasting |
| 4 | Extreme event detection | Anomaly detection pipeline for heat waves/floods |
| 5 | Ensemble methods | Multi-model ensemble system with uncertainty bands |

### Hands-On Project: Regional Climate Forecast Service
Deploy a production forecasting system:
- Ingest NWP model outputs (GFS, ECMWF)
- Train bias-correction models on local observations
- Generate probabilistic forecasts with confidence intervals
- Serve predictions via REST API with caching

### Case Study: Google DeepMind GraphCast
Analyze GraphCast's architecture and performance:
- Graph neural network approach to global weather
- 0.25-degree resolution, 10-day forecasts
- 90% accuracy improvement over traditional NWP
- Deployment considerations for enterprise use

### Tools & Frameworks
- **WeatherBench 2**: ML weather prediction benchmark
- **Pangeo**: Big data geoscience ecosystem
- **XCast**: Seasonal forecasting toolkit
- **ClimateLearn**: Climate ML model zoo

---

## Module 4: Energy & Grid Optimization (16h)

**North Star:** Build AI systems for renewable energy and grid management.

### Learning Objectives
- Forecast renewable energy generation
- Optimize energy storage and demand response
- Design virtual power plant controllers
- Implement carbon-aware computing strategies

### Topics Covered
| Day | Focus | Output |
|-----|-------|--------|
| 1 | Solar/wind forecasting | Irradiance prediction model with weather integration |
| 2 | Demand forecasting | Load prediction with holiday/weather features |
| 3 | Storage optimization | Battery dispatch optimization algorithm |
| 4 | Carbon-aware scheduling | Compute workload scheduler based on grid carbon intensity |

### Hands-On Project: Smart Grid AI Controller
Build an intelligent grid management system:
- Forecast solar generation 24-48 hours ahead
- Predict demand curves by building/zone
- Optimize battery charge/discharge schedules
- Minimize carbon intensity of electricity consumption

### Case Study: Tesla Autobidder
Examine Tesla's energy trading AI:
- Real-time energy market participation
- Battery degradation-aware optimization
- Grid services (frequency regulation, peak shaving)
- Multi-site portfolio optimization

### Tools & Frameworks
- **pvlib**: Solar energy modeling
- **GridStatus**: US grid data API
- **Electricity Maps API**: Real-time carbon intensity
- **CVXPY**: Convex optimization for energy scheduling

---

## Module 5: Nature-Based Solutions & Land Use (16h)

**North Star:** Apply AI to forestry, agriculture, and ecosystem monitoring.

### Learning Objectives
- Detect deforestation and land use change
- Model carbon sequestration in forests/soils
- Optimize regenerative agriculture practices
- Build biodiversity monitoring systems

### Topics Covered
| Day | Focus | Output |
|-----|-------|--------|
| 1 | Remote sensing for land use | Change detection model for forest cover |
| 2 | Carbon stock estimation | Biomass estimation pipeline from satellite + LiDAR |
| 3 | Precision agriculture | Crop yield prediction with multi-spectral imagery |
| 4 | Biodiversity AI | Species identification and habitat monitoring system |

### Hands-On Project: Forest Carbon Monitoring Platform
Build a nature-based carbon monitoring system:
- Process Sentinel-2 imagery for forest extent mapping
- Estimate above-ground biomass using allometric equations
- Detect deforestation alerts within 24 hours
- Calculate carbon stock changes and sequestration rates

### Case Study: Pachama
Analyze Pachama's forest carbon credit verification:
- Satellite-based monitoring at scale
- ML models for biomass estimation
- Integration with carbon credit registries
- Lessons for MRV (Measurement, Reporting, Verification)

### Tools & Frameworks
- **Google Earth Engine**: Planetary-scale analysis
- **Rasterio/GDAL**: Geospatial data processing
- **TorchGeo**: Geospatial deep learning
- **Wildlife Insights**: Camera trap AI platform

---

## Module 6: Climate Risk & Adaptation (16h)

**North Star:** Build systems for climate risk assessment and resilience planning.

### Learning Objectives
- Assess physical climate risks (flood, fire, heat)
- Model transition risks for decarbonization scenarios
- Design climate-aware financial systems
- Build adaptation recommendation engines

### Topics Covered
| Day | Focus | Output |
|-----|-------|--------|
| 1 | Physical risk modeling | Flood risk assessment pipeline |
| 2 | Transition risk scenarios | Decarbonization pathway model |
| 3 | TCFD reporting automation | Climate disclosure generation system |
| 4 | Adaptation planning | Location-specific adaptation recommendation engine |

### Hands-On Project: Enterprise Climate Risk Platform
Build a TCFD-aligned risk assessment system:
- Aggregate physical hazard data by location
- Project climate scenarios (RCP 2.6, 4.5, 8.5)
- Calculate financial impact under each scenario
- Generate board-ready climate risk reports

### Case Study: Jupiter Intelligence
Examine Jupiter's climate analytics platform:
- High-resolution hazard modeling
- Asset-level risk scoring
- Integration with insurance and finance
- API design for enterprise consumption

### Tools & Frameworks
- **OS-Climate**: Open-source climate risk tools
- **Aqueduct**: WRI water risk atlas
- **CLIMADA**: Climate risk modeling
- **NGFS Scenarios**: Central bank climate scenarios

---

## Capstone Project Options

### Option A: Carbon-Neutral Operations AI
Build an end-to-end system for achieving carbon neutrality:
- Comprehensive Scope 1/2/3 emissions tracking
- AI-powered reduction opportunity identification
- Carbon offset portfolio optimization
- Progress tracking dashboards with projections

**Deliverables:**
- Production-ready carbon management platform
- Integration with ERP/procurement systems
- Automated CDP/TCFD reporting
- ROI analysis and business case

### Option B: Climate Adaptation Intelligence
Design a climate resilience platform for a city or region:
- Multi-hazard risk assessment (flood, heat, fire, drought)
- Vulnerable population identification
- Adaptation intervention ranking
- Early warning system integration

**Deliverables:**
- Risk assessment dashboard with scenario modeling
- Prioritized adaptation investment recommendations
- Community alert system prototype
- Governance framework for climate decisions

### Option C: Renewable Energy Forecasting Service
Build a commercial-grade renewable energy forecasting platform:
- Multi-site solar and wind prediction
- Grid integration and curtailment optimization
- Energy trading signal generation
- Performance monitoring and model retraining

**Deliverables:**
- Forecasting API with SLA guarantees
- Accuracy benchmarks against industry standards
- Business model for utility customers
- Observability and model drift detection

---

## Assessment Criteria

### Technical Excellence
- Model accuracy meets or exceeds industry benchmarks
- Systems handle real-world data quality issues
- Architecture scales to enterprise requirements
- Observability and monitoring implemented

### Climate Impact
- Clear connection to emissions reduction or adaptation
- Quantified impact potential (tCO2e avoided, lives protected)
- Alignment with Paris Agreement pathways
- Consideration of environmental justice

### Enterprise Readiness
- TCFD/CDP/GRI reporting alignment
- Integration patterns for enterprise systems
- Governance and audit trails
- Cost-effectiveness analysis

---

## Tools & Platforms Summary

| Category | Tools |
|----------|-------|
| **Data** | ERA5, CMIP6, Sentinel Hub, NOAA APIs |
| **Processing** | Pangeo, Xarray, Dask, Apache Beam |
| **ML/AI** | PyTorch, TensorFlow, WeatherBench, ClimateLearn |
| **Geospatial** | Google Earth Engine, Rasterio, GeoPandas |
| **Carbon** | Climatiq, OpenGHG, CarbonTracker |
| **Cloud** | OCI Data Science, AWS SageMaker, GCP Vertex AI |
| **Reporting** | OS-Climate, TCFD generators |

---

## Career Pathways

Completing this path prepares you for:
- **Climate Tech Startups**: Technical co-founder or lead architect
- **Enterprise Sustainability**: AI lead for corporate climate programs
- **Financial Services**: Climate risk modeling and ESG analytics
- **Government/NGO**: Climate policy and adaptation planning
- **Research**: Applied climate AI research roles

---

## Next Steps

1. Complete the self-assessment in `02-learning-paths/self-assessment.md`
2. Join the Climate AI community channel
3. Select your capstone project focus
4. Connect with industry mentors through the Academy network
5. Explore related paths: `health-ai.md`, `economic-ai.md`

---

## References

- IPCC AR6 Reports (2021-2023)
- IEA Net Zero by 2050 Roadmap
- TCFD Recommendations and Guidance
- GHG Protocol Corporate Standard
- Science Based Targets initiative
