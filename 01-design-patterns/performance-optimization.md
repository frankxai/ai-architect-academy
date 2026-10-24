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

## Architecture & Tuning Guide

### Latency Budgets
Set strict budgets to prevent cascading delays in multi-step AI workflows.
- **Time to First Token (TTFT)**: Keep under 1s for streaming responses to maintain user engagement.
- **Embedding Generation**: Aim for <100ms P95 latency.
- **Vector Retrieval**: Target <50ms P95 latency for standard RAG pipelines.
- **Total P95 Latency**: Keep end-to-end response time under 2s for non-streaming workflows.

### Caching Strategies
- **Embedding Caching**: Cache exact match queries or commonly embedded chunks using Redis to bypass inference.
- **Retrieval Caching**: Store results for frequent semantic queries. Semantic caching (using a threshold distance to an existing cached embedding) avoids redundant database lookups.
- **Prompt/KV Caching**: Reuse KV states for common system prompts or long contexts (e.g. vLLM paged attention) to speed up TTFT.

### Batching & Scalability
- **Dynamic Batching**: Group incoming requests within a narrow time window (e.g. 10-50ms) to maximize GPU utilization without blowing up individual request latency.
- **Continuous Batching**: Eject completed sequences early and inject new ones instantly (vLLM style), drastically increasing inference throughput over static batching.

### Model Choice Tradeoffs
- **Premium vs. Distilled**: Use heavy models (GPT-4 class) for complex reasoning or extraction tasks. Default to distilled or specialized variants (e.g. Llama 8B, fine-tuned SLMs) for routine classification, summarization, or routing to save compute and cost.
- **Router Fallbacks**: Implement semantic routers to direct simple queries to fast, cheap models and escalate to premium models only when confidence is low or query complexity demands it.

### Vector Index Tuning (IVFFlat)
For vector databases like pgvector, IVFFlat provides a good balance of speed and recall if tuned properly:
- **`lists` Parameter**: Determines the number of clusters. A good rule of thumb is `rows / 1000` for up to 1M rows, or `sqrt(rows)` for >1M rows.
- **`probes` Parameter**: Controls how many clusters are searched during retrieval. Higher `probes` yield better recall but higher latency. Start with `probes = max(1, round(lists / 10))` and adjust based on latency budgets.
- **Build Index After Data Load**: Always create the IVFFlat index *after* inserting a representative dataset to ensure cluster centers are accurate.

### Cost Controls
- **Token Budgets & Prompt Truncation**: Strictly enforce maximum context lengths. Truncate long retrieval context to the top-K most relevant chunks to avoid unbounded token costs.
- **Rate Limits & Quotas**: Implement per-user and per-tenant rate limits to prevent abuse and noisy neighbor problems. Use tiered quotas.
- **Cost Anomaly Detection**: Tie billing APIs to alerting systems to detect runaway recursive agent loops or unexpected usage spikes instantly.

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