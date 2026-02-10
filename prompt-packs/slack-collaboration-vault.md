# Prompt Vault: Slack Agent Collaboration

Reusable prompts for working with the AI Architect bot across Slack channels, Canvas, and Lists. Tag each prompt when you paste it into channel bookmarks: `#persona-<role>`, `#artefact-<type>`, `#stage-<discover|define|build|review|ship>`.

---

## 1. Kickoff & Context Loading
- **Persona-aligned kickoff**
  ```
  <@AI-Architect> Act as a Builder coach. Review the pinned Canvas "Build Brief" and restate the problem, target persona, KPIs, and constraints. Confirm the artefacts you will deliver and propose the first 3 actions we should take.
  ```
- **Scope guardrails**
  ```
  <@AI-Architect> Before we start, list the governance packs relevant to this effort (compliance, privacy, incident response). Ask me to confirm which ones to apply and wait for approval.
  ```

## 2. Conversation Flow Design
- **Thread framing**
  ```
  <@AI-Architect> We are creating a conversation flow for the #onboarding channel. Suggest a step-by-step sequence of human → agent turns, highlight approval gates, and recommend Canvas or List handoffs for each stage.
  ```
- **Multi-channel handoff**
  ```
  <@AI-Architect> Draft a `/handoff` message that transfers this work from #ideation to #delivery, referencing the Canvas section "Decisions" and the List "Launch Checklist". Include owner expectations and next check-in time.
  ```

## 3. Canvas Operations
- **Canvas refresh**
  ```
  <@AI-Architect> Update the Canvas "Copilot Build Brief" with a new section titled "Latest Decisions" summarising the last 5 messages in this thread. Keep bullets crisp and link back to evidence where possible.
  ```
- **Insight extraction**
  ```
  <@AI-Architect> Scan the Canvas and produce a risks/opportunities table (3 each) with suggested mitigations. Post the table back into the thread.
  ```

## 4. Slack Lists Automation
- **List generation**
  ```
  <@AI-Architect> Convert the action items from this thread into a Slack List named "Launch Checklist" with fields Owner, Due Date (72h from now unless specified), Agent Assist (Y/N), and Evidence Link. Confirm assignments with mentions.
  ```
- **List monitoring**
  ```
  <@AI-Architect> Watch the list "Launch Checklist". Send reminders 24h before due dates and escalate to #ai-leads if any item is overdue by more than 12h.
  ```

## 5. Iteration & QA
- **Prompt refinement**
  ```
  <@AI-Architect> Evaluate the last spec draft against the Canvas constraints. Provide 3 improvement recommendations and ask me clarifying questions before updating the document.
  ```
- **Evaluation request**
  ```
  <@AI-Architect> Run the "Creator QA" evaluation pack on the latest artefact. Summarise pass/fail, call out top risk, and suggest the next corrective action.
  ```

## 6. Retrospectives & Learning
- **Retro capture**
  ```
  <@AI-Architect> Facilitate a quick retro. Ask for Wins, Risks, and Prompt Tweaks. Compile the responses into a Canvas retro section and post highlights in-thread.
  ```
- **Vault update helper**
  ```
  <@AI-Architect> Generate a prompt vault entry summarising the kickoff, iteration, and QA prompts we used today. Include scenario tags (e.g., #launch, #creator) and any guardrails applied.
  ```

---

### Usage tips
- Bookmark the prompts inside Slack for one-click reuse.
- Create List templates for recurring workflows (`/list clone`).
- Pair with the [Slack Agent Collaboration Playbook](../02-learning-paths/micro-modules/collaboration-slack-agent-workflows.md) for the full enablement session.
- Encourage team members to append variants that worked in specific regions, industries, or compliance regimes.

