# Pattern: Energy Market Trading & Optimization

## Business Value
- Optimize bids and dispatch, reduce imbalance costs, and improve profitability.

## Technical Architecture
- Time-series ingestion (prices, generation, demand) → forecasting models
- Optimization layer (linear/convex) with constraints and risk
- Scenario simulation with LLM-assisted narrative reports

## Discovery Questions
- Markets (day-ahead, intraday), assets, and constraints?
- Risk appetite and KPIs (P&L, imbalance, penalties)?
- Latency requirements and decision cadence?

## Bill of Materials
- TS DB, forecasting libs, optimizer, dashboards, audit logs

## Risks & Controls
- Forecast error → ensembles and recalibration; backtesting
- Compliance → market rules encoded; auditability
