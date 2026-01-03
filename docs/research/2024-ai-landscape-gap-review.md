# AI Landscape Gap Review - 19 Sep 2025

## Repo Status Snapshot
- git status shows main aligned with frank/main; local work adds refreshed spec collateral (AI-Architect-Academy-Spec.html, MVP and Timeline.md) and the updated delivery agent brief (AGENT.md).
- Live specification anchors remain the source for surfaces and backlog: see AI-Architect-Academy-Spec.html:373 for the Experience Architecture and AI-Architect-Academy-Spec.html:659 for the Comprehensive Task Matrix.
- The MVP launch cadence in MVP and Timeline.md:486 continues to drive ingestion and freshness loops.

## Where Specs + Roadmap Already Point Us
- AI-Architect-Academy-Spec.html:464 keeps the personalization engine at the center of the learner journey.
- 02-learning-paths/micro-modules/README.md:24 highlights current reasoning coverage (Gemini debate sprint) but leaves room for o1-class model playbooks.
- 06-toolchains/stack-reference.md:1 keeps the core stack concise, signalling where to extend infrastructure guidance.
- 01-design-patterns/performance-optimization.md:25 captures optimisation levers we can evolve for next-gen hardware.

## Emerging Focus Areas (Global Releases Through Oct 2024)
| Trend | Market Update | Gap Inside Academy | Recommended Action |
| --- | --- | --- | --- |
| Real-time multimodal agents | OpenAI GPT-4o and the Realtime API made low-latency voice and video copilots mainstream (May 2024). | No streaming or voice-first flows in Experience Architecture (AI-Architect-Academy-Spec.html:373), and no micro-module for realtime orchestration. | Add a "Realtime Copilot" slice in the spec (voice onboarding plus coach widgets) and author a micro-module covering WebRTC, session memory, and safety budgets for live calls. |
| Advanced reasoning models | OpenAI o1-preview and Anthropic Claude 3.5 introduced high-cost reasoning tokens (Aug 2024). | Curriculum mentions Gemini debate (02-learning-paths/micro-modules/README.md:24) but lacks evaluation guidance for o1-class models and decision-cost trade-offs. | Extend the Task Matrix with reasoning evaluation ownership (AI-Architect-Academy-Spec.html:659) and ship a micro-module on reasoning token budgeting, verification, and human handoff design. |
| Open-weight frontier serving | Meta Llama 3.1 405B and Groq LPU inference shifted open-weight viability (Jul 2024). | Stack reference (06-toolchains/stack-reference.md:1) only states "OpenAI with OSS fallback"; optimisation pattern (01-design-patterns/performance-optimization.md:25) lacks Groq/Blackwell runbooks. | Publish an infrastructure addendum covering vLLM and Groq routing, and add cost/performance labs benchmarking 8B vs 405B models for architect personas. |
| Generative video and simulation | OpenAI Sora, Luma Dream Machine, and Kling 1.5 matured production video (Feb-Aug 2024). | Creator tracks focus on text/image; spec hero flows omit video storyboards. | Introduce a Creator pathway update with simulation and video deliverables plus guardrail guidance for synthetic media compliance in 08-governance. |
| Regulatory acceleration | EU AI Act enforcement timeline locked (Jul 2024) and U.S. NIST AI RMF 1.1 alongside AISI playbooks landed. | Governance guidance references the EU AI Act but lacks implementation timeline or mapping to MVP artefacts. | Add an EU AI Act readiness checklist tied to each MVP sprint and a dashboard hook for conformity assessments in MVP and Timeline.md:486. |

## Immediate Next Actions for the Community
1. Draft issues or PRs for each focus area so contributors can pick them up (tag with the spec line references above).
2. Prioritise the realtime copilot module for the next sprint so we can demo it against the existing onboarding flow.
3. Schedule a governance working session to integrate EU AI Act checkpoints into the launch checklist.
