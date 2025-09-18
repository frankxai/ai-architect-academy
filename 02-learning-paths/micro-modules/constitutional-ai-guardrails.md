# Constitutional AI Guardrail Lab

**Category:** Governance & Safety  
**Duration:** 45 minutes  
**Outcome:** Implement Anthropic-style constitutional prompts and red-team workflows to strengthen governance controls.

## Why it matters
- Constitutional guardrails offer transparent, repeatable safety policies without heavy classifier tuning.
- Continuous red-teaming exposes policy regressions early.

## Prerequisites
- Access to an LLM capable of constitutional prompting (Claude 3.5, GPT-5 Omni, or Azure Safety APIs).
- Governance checklist (`08-governance/human-review-checklist.md`).

## Step-by-step
1. **Define constitution:** Select principles covering tone, safety, compliance (reference Anthropic prompts).
2. **Wire guardrail prompts:** Add constitution instructions to system prompts or moderation layer.
3. **Automate red-team suite:** Schedule nightly red-team runs using constitutional critique prompts; capture violations.
4. **Route violations:** Open governance tickets referencing the policy clause, assign human reviewers.
5. **Document evidence:** Store guardrail transcripts, reviewer decisions, mitigation steps in governance workspace.
6. **Iterate:** Adjust constitution rules based on reviewer feedback and incident learnings.

## Deliverables
- Constitution definition file (YAML/Markdown) with principles and citations.
- Red-team script or evaluation configuration (Promptfoo, custom harness).
- Governance log entry summarising review outcomes and mitigation.

## References
- Anthropic Constitutional AI guide (Sept 2025 update).
- Governance & Compliance Automation pattern (`01-design-patterns/governance-compliance.md`).
- `08-governance/incident-response-checklist.md` for escalation.