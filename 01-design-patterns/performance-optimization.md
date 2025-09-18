# Pattern: AI Performance Optimisation

**Mission:** Maximise responsiveness and throughput while controlling cost and quality across AI workloads.

## High-Value Use Cases
| Use Case | Impact | KPIs |
| --- | --- | --- |
| Latency tuning for chat/RAG | Deliver snappy UX, reduce drop-offs. | P95 latency, abandonment rate. |
| Cost governance | Prevent runaway spend, increase ROI. | Cost per 1K tokens/request, budget variance. |
| Capacity planning | Ensure availability during peaks. | Utilisation, autoscale efficiency. |
| Model optimisation | Deploy smaller/faster models without losing quality. | Accuracy delta, compute savings. |

## Experience Blueprint
| Stage | Human | AI/Agents | Systems |
| --- | --- | --- | --- |
| Baseline Assessment | SRE gathers metrics, identifies hotspots. | Observability agent aggregates logs, traces, cost data. | Langfuse, Prometheus, FinOps dashboards. |
| Optimisation Strategy | Architects define targets, trade-offs. | Advisor agent recommends tactics (batching, caching, model tiers). | Knowledge base (playbooks, benchmarks). |
| Implementation | Engineers deploy optimisations, test. | Automation agent runs load tests, prompt regression, capacity tests. | CI/CD, load test harness. |
| Validation | QA validates latency, quality, cost. | Evaluation agent compares metrics vs baseline, surfaces regressions. | Promptfoo, metrics pipeline. |
| Continuous Monitoring | Ops monitors and iterates. | Feedback agent alerts on drift, triggers playbook. | Alerting, retrospectives.

## Technical Architecture Stack
1. **Observability:** Centralised metrics (Prometheus/Grafana), tracing (OpenTelemetry/Langfuse), logging (ELK).  
2. **Load & Regression Testing:** Tools like k6/Locust, Promptfoo, synthetic dataset generator.  
3. **Optimisation Toolkit:** Model quantisation (ONNX/TensorRT), caching (vLLM, Redis), batching/proxy.  
4. **Automation:** Blue/green, canary, shadow deployments, autoscaling policies (HPA/KEDA).  
5. **FinOps:** Cost tracking (Cloud cost APIs), budgets, alerts, forecasting.

## Data & Models
- Telemetry (latency, throughput, errors), cost reports, evaluation results.  
- Models: Distilled variants, quantised versions, retrieval caches.  
- Tools: Profilers, benchmarking suites, yet another instrumentation for GPU/CPU.

## Implementation Sprints
1. **Instrumentation** – Ensure metrics/traces/cost data captured for every service.  
2. **Baseline & Goals** – Document SLOs, budgets, top offenders.  
3. **Quick Wins** – Implement caching, batching, prompt tightening, inference fleet tuning.  
4. **Model Optimisation** – Quantise, distil, route to best model tiers.  
5. **Scalability** – Autoscaling policies, queue management, concurrency control.  
6. **Continuous Improvement** – Automate regression tests, budgets, retrospectives.

## Agent Build Instructions
- Gather metrics from Langfuse, Prometheus; run `scripts/check_secrets.py`.  
- Create runbooks for load testing, regression comparisons, cost analysis.  
- Provide scripts for model conversions (ONNX), caching configuration, deployment automation.  
- Document step-by-step actions for coding agents to tune environment: run load tests, apply optimisation, validate.  
- Deliver final pack: before/after metrics, cost report, guidelines for future teams.

## Evaluation & Observability
- Track P50/P95 latency, error rate, throughput, cost.  
- Evaluate output quality post optimisation (Promptfoo).  
- Monitor budgets, anomalies.  
- Schedule retros using `operations-cost-optimization` micro-module.

## Governance & Controls
- Apply procurement checklist when adopting new optimisation vendors.  
- Incident response for performance outages.  
- Human oversight for quality trade-offs.  
- Document approvals for SLO changes, align with governance library.

## Lab Insights (Sept 2025)
- **NVIDIA GTC 2025**: Adopt TensorRT-LLM paged attention + KV cache eviction for large context windows; benchmark using `trtexec` recipes.
- **Microsoft Azure FinOps**: Use cost anomaly detection and budget alerts tied to deployments; map outputs to governance dashboards.
- **Meta AI**: Evaluate open-weight Llama distillations for cost/performance trade-offs; add streaming router fallback when premium models saturate.

## Deliverables & Templates
- Performance dashboards, SLO/SLA document, cost playbook.  
- Optimisation runbook, automation scripts.  
- Evaluation reports (before/after).  
- Storytelling deck highlighting ROI improvements.