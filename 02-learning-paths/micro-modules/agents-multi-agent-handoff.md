# Multi-Agent Handoff Lab

**Category:** Agentic Patterns  
**Duration:** 55 minutes  
**Outcome:** Prototype a two-agent workflow (researcher + reviewer) with explicit handoffs, audit trails, and human-in-the-loop checkpoints.

## Why it matters
- 2025 enterprise deployments favour collaborative agents with controlled autonomy.
- Clear handoffs reduce hallucinations and improve compliance.

## Prerequisites
- Completion of [LangGraph Planner Loop](agents-langgraph-planner.md) module.
- Access to a shared datastore (Redis, Supabase) for passing artefacts.
- Slack/Teams webhook or email integration for human approvals (optional but recommended).

## Step-by-step
1. **Define roles:** Researcher agent gathers evidence; Reviewer agent validates, adds citations, and triggers approvals.
2. **Model selection:** Use Claude 3.5 Sonnet for research (long context) and GPT-4.1 mini for reviewer (speed). Configure via OpenRouter if centralised billing needed.
3. **Artefact contract:** Create JSON schema (problem, evidence[], risks[], draft_response) stored in shared_state.
4. **Human gate:** Add a webhook step that posts reviewer output to Slack with Approve/Reject buttons (use Slack Workflow Builder or n8n).
5. **Logging:** Persist each handoff with Langfuse spans labelled handoff_researcher and handoff_reviewer. Attach metadata (latency, token cost, approved? yes/no).
6. **Post-mortem:** If rejection occurs, run [Retrospective with AI](../../15-workflows/retrospective-with-ai.md) to capture lessons and update prompts.

## Deliverables
- LangGraph agent definitions + orchestration script.
- Screenshot or recording of the Slack/Teams approval flow.
- Updated governance log noting review cadence and escalation path.

## References
- Slack Workflow Builder AI approvals (May 2025 release).
- OpenAI Function Calling best practices (June 2025 update).
- 16-collaboration/agentic-teams.md for collaboration patterns.
