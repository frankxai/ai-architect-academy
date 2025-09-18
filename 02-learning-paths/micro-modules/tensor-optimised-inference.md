# Tensor-Optimised Inference Playbook

**Category:** Operations & Infra  
**Duration:** 50 minutes  
**Outcome:** Apply NVIDIA TensorRT-LLM and FinOps practices to reduce latency and cost for GPT-5 Omni and multimodal workloads.

## Why it matters
- Paginated KV cache and batching unlock lower latency and higher throughput.
- FinOps dashboards avoid runaway inference spending at scale.

## Prerequisites
- Access to GPU inference environment (NVIDIA H100/L40 or cloud equivalent).
- Familiarity with the [AI Performance Optimisation](../../01-design-patterns/performance-optimization.md) pattern.

## Step-by-step
1. **Profile baseline:** Capture latency, cost, and throughput for current workload using Langfuse + Prometheus.
2. **Apply TensorRT-LLM:** Convert GPT-5 Omni weights or use pre-optimised engines; enable paged attention and continuous batching.
3. **Configure runtime:** Tune batch size, timeout, and memory pool; implement dynamic batching via Triton or custom router.
4. **Cost telemetry:** Integrate cloud cost metrics or custom accounting; set budget alerts and anomaly detection.
5. **Regression tests:** Run Promptfoo suite and offline evals to ensure quality parity post-optimisation.
6. **Document runbook:** Update performance playbook with new parameters, rollback plan, and guardrail thresholds.

## Deliverables
- Optimisation configuration (TensorRT-LLM config, router settings).
- Before/after metrics report (latency, throughput, cost).
- Updated performance runbook and cost dashboard snapshot.

## References
- NVIDIA GTC 2025 TensorRT-LLM sessions.
- Azure FinOps playbooks for AI workloads (Sept 2025).
- AI Performance Optimisation pattern (`01-design-patterns/performance-optimization.md`).