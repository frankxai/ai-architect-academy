# Architecture decision

Stage 2 of Production agent systems. You leave this stage with `artifact:architecture-decision`, an architecture decision record (ADR) that passes `eval:adr-has-rejected-options` and survives `review:architecture-defence` by someone who is not you.

The stage is graded twice. The eval checks that the record has the right shape. The review is a person checking that the shape is not hollow. Most records that fail, fail the second one.

## The decision

The stage question, as the graph states it: **which shape, and which credible alternative are you rejecting and why?**

You cannot defer this because four later stages are priced by it.

- Stage 3, the tool and authority model, counts principals and revocation paths. `eval:authority-least-privilege` charges for writes: no principal may back more than one side-effecting tool (`no-shared-principal-for-writes`), and every principal needs a written revocation path (`revocation-documented`). That count is set by the tool list, not by the shape. A single model with three write tools owes the same three principals and three revocation paths as an orchestrator using the same tools. What the shape decides is which runtime can invoke which principal. A single model context can invoke all of them, so the gate that bounds a call has to sit outside the model. A worker or a pipeline step binds one. An orchestrator adds one entry of its own, the state store's credential.
- Stage 4, the eval harness, needs fixtures. For one call, a fixture is a prompt and an expected answer. For a model that loops over tools, it is a multi-turn trace with stubbed tool results. For an orchestrated system it is a trace with state at every hop and a path that can differ per run. Undecided shape means you write the harness twice.
- Stage 5, the threat model, lists untrusted inputs, and `eval:threat-model-covers-tool-results` requires tool results and retrieved documents on that list. The shape decides which untrusted text reaches a model holding which authority. Retrieval-first feeds the corpus straight into the model that answers. An orchestrator can keep the worker that reads untrusted text away from the worker that holds a credential. This is where retrieval-first and orchestrators differ most, and it is the stage the record most often forgets to price.
- Stage 6, the cost model, is per unit of work. Retrieval-first is an embedding call, a lookup and one generation. An orchestrator multiplies that by the number of hops and adds the state store.

If you build first and write the record afterwards, the record becomes a justification. The options section fills with alternatives you never weighed, and the reversal condition becomes whatever you already know the system is bad at. The eval cannot tell the difference. The reviewer can.

## What goes wrong

**Straw-man alternative.** The rejected option is one nobody would have picked: "we considered hard-coding every answer". The eval counts two entries and passes. The reviewer reads the first rubric line, "the rejected option is one a reasonable engineer would have chosen", and fails it. Detect it before submission: hand the options list to a colleague without the decision section and ask which they would pick. If they pick your choice instantly and cannot argue for the other, you have not listed a real alternative.

**Benefits-only consequences.** The section reads like a pitch: faster, cheaper, more maintainable. A decision with no downside was not a decision, and the reviewer has nothing to defend against. Detect it by counting sentences that name something you gave up. Zero is a fail.

**Unobservable reversal.** "We would revisit this if it stops working well." Nobody but the author can check that. Detect it by asking: could a stranger with read access to your telemetry tell me today whether this condition has fired? A second form of the same failure is a reversal condition copied from the brief's kill criterion. Crossing the kill criterion means stop building. A condition that only fires when the project is already dead never reverses anything.

**Shape chosen for interest.** Multi-agent orchestration adopted because it is the interesting design, not because the brief needs something one call cannot do. Every later stage pays: a state store credential at stage 3, path-varying fixtures at stage 4, a trust boundary per handoff at stage 5, multiplied cost at stage 6, a state store to break at stage 8. Detect it with the five questions in "When separate workers earn their place". An orchestrator that answers no to all five is decoration. The tell in a finished record is a handoff that carries a label or a string one call could have produced in the same breath, and no isolation, parallelism, duration or verification reason beside it.

**Written after the build.** The tell is the context section: it describes the system as it exists rather than the problem as it was. When the decision is smuggled into the context ("the system uses an orchestrator to coordinate..."), the options section has nothing left to decide.

## Concepts

### The shapes that change what later stages cost

Vendor diagrams make every architecture look like boxes and arrows. The shapes below are the ones that change what you owe at stages 3, 4, 5 and 6. They compose: retrieval with one tool, retrieval exposed as a tool inside a loop, a pipeline whose last step is a router. The record names the dominant shape and any composition, because the composition inherits both sets of commitments.

**Single model with tools.** One model, one system prompt, a tool list, looping over tool calls until it answers. It commits you to: every principal in the matrix reachable from one model context, so the gate that bounds a call lives in the executor, never in the prompt (stage 3); multi-turn fixtures with stubbed tool results, because the model decides how many round trips to make (stage 4); every tool result is untrusted text entering the one model that holds all the authority (stage 5); one or more generations plus tool round trips per unit, with the count set by the model, not by you (stage 6). Its hidden commitment is that the prompt is the entire behaviour. Whoever can edit the prompt can change the product.

**Retrieval-first.** A corpus, an index, a retrieval step, then one generation grounded in what came back. It commits you to: a second system with its own freshness and access control, since the index is read authority over every document in it (stage 3); fixtures that pin a corpus snapshot, or they drift (stage 4); the corpus is an injection surface, so whoever can write to it can write into the model's context (stage 5); embedding plus lookup plus generation per unit (stage 6). Its hidden commitment is that correctness is bounded by the corpus, and a stale index regresses silently. The production form is in the [core components of the RAG production pattern](../../../01-design-patterns/rag-production-pattern.md#core-components); skip that file's deployment configuration, which is tied to one vendor. Retrieval can also be exposed as a tool the model calls as often as it needs. That is single model with tools whose tool happens to be the index, and it is the usual next notch when one retrieval round stops being enough.

**Router plus specialists.** A classifier chooses one of several narrow prompts or models. It commits you to: the same principals as any shape with these tools, but each specialist's runtime binds only its own, so a misroute reaches one specialist's authority rather than all of it (stage 3); fixtures that assert the routing decision as well as the answer, because misroutes are a new failure class (stage 4); untrusted text reaches only the specialist it was routed to, and a misroute is also a way for it to reach the wrong one (stage 5); a classifier call plus one specialist per unit (stage 6). The gateway under this shape is the [model router in the AI gateway pattern](../../../01-design-patterns/ai-gateway-pattern.md#2-model-router); skip that file's deployment and monitoring sections, which are tied to one vendor.

**Fixed pipeline.** A deterministic chain of calls in an order the code decides: clean, map, look up, compose. No planning, no dynamic dispatch. It commits you to: each step binding only the principal its own tool needs, with a matrix you can write in advance because the steps are known (stage 3); fixtures per step plus one end-to-end trace of the same length every run (stage 4); each step's output is untrusted input to the next, but no text can re-route the chain (stage 5); a fixed number of calls per unit, the easiest shape to cost (stage 6). Its hidden commitment is that the order is code, so a brief that needs a different order for some inputs turns the pipeline into a router or an orchestrator. It is often the most credible alternative to an orchestrator, and the shape many "orchestrators" turn out to be. Lab 02 (`labs/02-multi-agent-system/`) builds this shape: a coordinator that runs a fixed researcher, analyst, writer sequence with timeouts and one retry, not a planner.

**Orchestrator with worker agents.** A coordinator plans, dispatches to workers, and merges what comes back through explicit handoffs. It commits you to: each worker binding only its own principal, plus the state store's credential and revocation path as an entry of its own (stage 3); multi-step trace fixtures where the path can differ per run (stage 4); a trust boundary at every handoff, which is the cost and also the main reason to choose it, because the worker that reads untrusted text can be kept away from the credential when the handoff payload is a schema checked in code rather than prose (stage 5); cost that multiplies by hops and retries (stage 6). Its hidden commitment is a state store whose failure modes are now yours. The handoff contract you count against is section 4, "Agent Handoff Protocol", of `01-design-patterns/multi-agent-orchestration-pattern.md`. Read it with one correction: its `HandoffContext` forwards shared state, conversation history, intermediate results and the workflow state to every target agent, and retries three times. A handoff built that way carries everything and isolates nothing. For privilege separation you strip it to a typed payload, and you count state-carrying handoffs against what the payload needs, not against the fields the reference passes. The deployment and infrastructure sections around it are vendor-specific and not part of this stage.

### When separate workers earn their place

Five questions. Each is a reason a pipeline or an orchestrator beats a single call, and each is a cost you accept if you answer yes.

1. **State transfer.** Count the handoffs where the receiving worker gets something it could not have retrieved or computed itself from the original input. Zero removes this justification. It does not, on its own, reject the shape.
2. **Privilege separation.** Does one worker read untrusted content (web pages, tickets, documents) while another holds a credential that can act? Keeping them apart means the text that could carry an injection never reaches the model that could obey it, on one condition: the handoff between them is a payload validated in code against a schema that cannot carry an instruction. Typed fields, ids, enums, allow-listed values, checked by code and not by a model. A free-text summary from the reader moves the injection to the worker with the credential; it blocks nothing. The record names the schema. The handoff carries no extra state; it carries less authority, and that is the point.
3. **Parallel context.** Do parts of the work need independent context windows, because they would crowd each other out or because they must not see each other's input?
4. **Duration.** Do steps run long or asynchronously, so that one call cannot hold the whole job open?
5. **Independent verification.** Must a checker not share the generator's context, so it cannot be talked into agreeing with what it is checking?

A record that rejects an orchestrator has to rule out all five, not the first. A record that chooses one has to name which question it answers yes to, because that is the cost the reviewer will ask you to defend. What separates the last two shapes from the first three is not "how complex is the task" but whether one of those five is true of the brief. If none is, you are choosing among single model with tools, retrieval-first and router plus specialists.

### Picking the credible alternative

The rejected option has to be one a reasonable engineer on your team would choose with the same brief. The test: if a senior colleague read the rejected option, would they say "yes, I would have started there"? If they would laugh, it is a straw man.

The credible alternative is usually the shape one notch simpler or one notch more elaborate than your choice. If you chose retrieval-first, the notch below is single model with tools (why is the corpus needed?) and the notch above is a fixed pipeline that looks something up in code and conditions the retrieval on it (why is one unconditioned retrieval enough?), then retrieval exposed as a tool in a loop (why must the model decide what to look up?), or router plus specialists (why not split by intent?). If you chose an orchestrator, the notch below is a fixed pipeline: the same steps, order decided by code. Reject with a reason that names what the brief needs and the alternative cannot give. "The team already built it" is a sunk cost, not a reason from the brief.

### Consequences as costs you accept

Write the consequences section as a list of things you are paying for, in these four currencies.

- Latency: the extra steps in the request path, in the order a user waits for them.
- Token spend: what one unit of work costs in calls, before stage 6 puts a number on it.
- Operational surface: each additional system that can be down, stale, or misconfigured. An index, a state store, a classifier, a queue.
- Who can now change behaviour by editing a prompt. This is the one people forget. A retrieval-first system hands behaviour to whoever curates the corpus. An orchestrator hands it to whoever edits any worker prompt. Name the role, and note whether that role goes through code review.

Where a currency creates an untrusted input, say so in the same entry: a corpus anyone on a team can edit, a tool that returns third-party text, a worker that reads what a customer pasted. That list is carried forward to stage 5, where the eval will look for it.

Benefits can appear, but the section fails review if a benefit is all it contains.

### The reversal condition

Name the metric, the cost line, or the incident class that would make you switch shapes, and make it checkable without you in the room.

A reversal condition is not the kill criterion. The kill criterion from stage 1 says when to stop building. The reversal condition says when to change shape while there is still a project, so it fires earlier than the kill ceiling, or on a different signal that points at the shape rather than the product: not "too many escalations" but "too many escalations of the kind this shape cannot answer". Name the shape you would move to, and check it is the next notch, not the most elaborate one. If you cannot name it, the condition is a complaint, not a decision.

Good forms: "the share of escalations the reviewing human tagged 'needed account state and documentation together', from the transcript log, exceeds one in five for two consecutive weeks"; "cost per resolved conversation on the cost model's dashboard exceeds the ceiling set at stage 6"; "an incident in the class 'answer contradicted current documentation' recurs after the index freshness fix".

Bad forms: "if quality drops"; "if users complain"; "if it becomes too slow"; the brief's kill criterion word for word. The first three need the author to define the term at review time, which is exactly what the review forbids. The last one fires when there is nothing left to re-shape.

### Cost of reversal

Some shape changes are a two-way door, some are one-way, and the record should say which this is. Moving from retrieval-first to retrieval as a tool keeps the index, the corpus snapshot fixtures and the read principal; it changes the prompt and the fixture format. Moving from a single model to an orchestrator throws away the fixtures, rebinds each principal to a worker, and adds a state store nobody has operated yet.

Say what you are building now that keeps the switch cheap. The usual candidates: a stable interface between retrieval and generation, so retrieval can later become a tool without rewriting the prompt; a trace of every call with inputs and outputs, which is stage 4's fixture source today and would seed multi-step fixtures if you ever needed them; the account lookup behind the same authority boundary whichever shape sits in front of it, whether code or a model calls it. Then say what a switch would still cost. A record that names the reversal signal but not the reversal cost has told the reviewer when you would move, not whether you could.

### The independent review

`review:architecture-defence` is applied by `role:independent-reviewer`, a peer who already holds the competency. The graph marks it `requiresIndependentReviewer: true`, and `site/lib/academy-graph/advance.ts` refuses a review where the reviewer is the author with the code `review-not-independent`. There is no override.

The reviewer reads three lines. Is the rejected option one a reasonable engineer would have chosen? Does the consequences section name a cost, not only benefits? Is the reversal condition observable without asking the author?

Prepare with `15-workflows/peer-review.md`: share the record in advance, frame the scope, let the reviewer probe assumptions. Show the options section before the decision if you want the straw-man check to be honest.

## A worked decision

This scenario is a composite. No real product, team or company is described. The record below is the artifact, headings and all. `check-adr.test.mjs` extracts it from this file and runs `check-adr.mjs` on it, and both assertions pass; copy its format and yours will too.

```markdown
## Context

From the stage 1 brief. A support assistant for a software product. Its job is to answer customer questions about product behaviour and about the customer's own account state. The account is known from the session before the customer types anything. Out of scope: refunds, plan changes, anything that writes. The kill criterion in the brief is a ceiling on the share of conversations escalated to a human.

## Options considered

1. Single model with tools: one prompt, one read-only account lookup tool, product knowledge carried in the prompt. Credible because it is the simplest thing that runs. Rejected because the product documentation changes every release, the model cannot know it, and the entire behaviour would live in a prompt that the documentation team cannot edit and the engineering team does not have time to keep current.
2. Orchestrator with workers: a triage worker labels the question, a documentation worker retrieves passages, an account worker calls the lookup, a composer writes the answer. Credible because the brief's two sources, documentation and account state, look separable, and a worker per source could bind its own read principal. Rejected after the five questions. State transfer: zero handoffs carry anything a single grounded call could not hold; the triage label is a routing decision one call makes implicitly, the passages are what a retrieval step returns, the account state is a lookup keyed on the session. Privilege separation: no; both sources are read-only and nothing in scope can act, so keeping the documentation reader away from the account lookup protects nothing that stage 3 charges for. Parallel context: no; one question fits one window. Duration: no; every step returns in under a second. Verification: no; nothing writes, so there is no action for a checker to block. The shape would have added the state store's credential at stage 3, path-varying fixtures at stage 4 and a hop multiplier at stage 6 for no answer a single grounded call cannot give.
3. Retrieval-first: index the product documentation, retrieve on each question, one generation with the account state fetched in code ahead of the call. Chosen.

## Decision

Retrieval-first. The account lookup runs in code before the model is called, keyed on the session's account id, and its result enters the context beside the retrieved passages. The dominant shape is retrieval-first; there is no tool the model calls, so there is no loop and the generation count is fixed at one.

## Consequences

- Latency: an account lookup and a retrieval step ahead of every generation.
- Token spend: an embedding call and one generation per unit, with a longer context that carries the passages and the account fields. No model-initiated tool call, so no second generation to use a result.
- Operational surface: an index rebuilt on each documentation release; a stale index is now the most likely regression.
- Who changes behaviour: the documentation team, by editing the corpus, without a code review. Accepted, and the corpus gets its own snapshot in the stage 4 fixtures so a documentation edit that breaks an answer fails the harness.
- Untrusted inputs carried to stage 5: every retrieved passage, and therefore every corpus edit, reaches the model's context without review, and the account record's free-text fields enter the same context; the model that reads both holds read authority only, which is why the record accepts it.
- What keeps a switch cheap: retrieval sits behind one function with a fixed contract, so a later step can pass it an account-conditioned query or expose it as a tool without touching the prompt; the account lookup sits behind the same authority boundary whichever shape sits in front of it; and every call logs account fields, query, passages and answer, which is the stage 4 fixture source and would seed multi-step traces if a later shape needed them. A switch to a pipeline or a loop is a two-way door; a switch to an orchestrator is not, because the fixtures and the per-worker binding would be rebuilt.

## What would reverse this

From the transcript log, where the reviewing human tags each escalation with a reason: the share tagged "needed account state and documentation together" exceeds one in five escalations for two consecutive weeks. That signal means one retrieval round whose query never sees the account state cannot combine the two sources. The next notch is a fixed pipeline: look up the account in code, build the retrieval query from what came back (plan tier, product version), then generate. The notch after that is retrieval exposed as a tool in a multi-turn loop, needed only if the lookup keys turn out to depend on the question text. It is not the orchestrator, which the options section already showed carries no state a pipeline or a loop could not hold. This condition is separate from the brief's kill ceiling on total escalations: if that ceiling is crossed, the project stops and no shape change is considered. A reviewer can read both numbers without asking what "working well" means.
```

## Producing the artifact

1. Open your stage 1 brief. Copy the user, the job, the out-of-scope list and the kill criterion into a **Context** section. Describe the problem, not a system. If a shape name appears here, delete it.
2. Under **Options considered**, list at least two of the shapes above as full options. For each rejected one, write one sentence on why a reasonable engineer would pick it and one on why you did not, referencing the brief. Where an option composes two shapes, name the dominant one.
3. If any option is a fixed pipeline or an orchestrator, write its answers to the five questions into the entry, with the count of state-carrying handoffs first.
4. Under **Decision**, name the shape in one sentence.
5. Under **Consequences**, write at least one entry in each currency: latency, token spend, operational surface, and who can now change behaviour by editing a prompt or a corpus. Name the untrusted inputs each one creates, and what you are building now to keep a switch cheap.
6. Under **What would reverse this**, name a metric, cost line or incident class, where it is read from, the condition, and the shape you would move to. Check that a stranger with telemetry access could evaluate it today, and that it fires before the kill criterion.
7. Redact internal system names; the artifact is public-safe and that is its redaction rule.
8. Commit the record and run `check-adr.mjs` in this directory against it: `node check-adr.mjs path/to/adr.md`. It applies the two assertions of `eval:adr-has-rejected-options` as the graph states them and prints the result in the shape `advance.ts` records. Each option has to be a top-level entry; sub-bullets under one option are not options. It cannot see a straw man or an unobservable condition; `rubric.md` says how a person applies those, and the review is where they are caught. `node --test check-adr.test.mjs` shows what the checker passes and fails on, including the record above.
9. Request `review:architecture-defence` from an independent reviewer using the peer-review ritual. The grant path refuses a self-review.
10. Submit evidence: a `repo-url` a third party can open, or an `eval-run` recording the checker's output for the committed file. That is `artifact:architecture-decision`.

## Check yourself

1. Your team built the lab 02 coordinator and wants to reuse it. Which of the five questions does your brief answer yes to, and which shape is that coordinator, once you read what it does rather than what it is called?
2. A brief has the agent read any web page a customer links to, then check that customer's own account record. The record proposes a reader worker with no credential and an account worker that never sees the page text, joined by a handoff carrying a fixed-schema summary. The state-carrying handoff count is zero. Is the orchestrator wrong? Which question decides, and what does stage 5 charge if you collapse it into one model?
3. For the shape you chose, who can change behaviour without a code review? Is that role named in your consequences section, and is it also on your untrusted-inputs list?
4. Rewrite "we would reconsider if answer quality drops" as a condition a reviewer can check from telemetry alone. What log or metric did you assume exists?
5. Your reversal condition is the brief's kill criterion word for word. What happens on the day it fires, and why is that not a shape change?
6. Your rejected option is one your senior colleague would not have picked either. Is the record wrong, or is the brief simpler than you thought? What changes in each case?
7. Retrieval-first pins correctness to the corpus. What does that commit you to in the stage 4 fixtures, and what regression would you miss without it?
8. Router plus specialists and single model with tools can cost the same number of calls per unit. Why might their stage 6 cost models still differ?
9. Your context section says "the system uses a coordinator to dispatch workers". What has gone wrong, and which failure mode is it?

## Go deeper

- [Multi-agent orchestration pattern, section 4 "Agent Handoff Protocol"](../../../01-design-patterns/multi-agent-orchestration-pattern.md#4-agent-handoff-protocol): the handoff contract you count against. Its reference contract forwards full conversation history and shared state to every target agent by default and retries three times; for privilege separation you strip it down to a typed payload, and you count state-carrying handoffs against what the payload needs, not against the fields the reference passes. The deployment, infrastructure and pricing material around it is tied to one vendor's services; skip it for this stage.
- [RAG production pattern, "Core Components"](../../../01-design-patterns/rag-production-pattern.md#core-components): retrieval-first in production form. Skip the vendor-specific sections: deployment configuration and the infrastructure setup under it.
- [AI gateway pattern, section 2 "Model Router"](../../../01-design-patterns/ai-gateway-pattern.md#2-model-router): the routing layer under router plus specialists. Skip the vendor-specific sections: deployment configuration and the monitoring integration.
- [Peer review ritual](../../../15-workflows/peer-review.md): the loop for the independent review.
- [Lab 02: multi-agent system](../../../labs/02-multi-agent-system/): build the fixed-pipeline coordinator, then decide whether your brief needs one.
- [check-adr.mjs](./check-adr.mjs), [check-adr.test.mjs](./check-adr.test.mjs) with its [fixtures](./fixtures/), [exercise.md](./exercise.md) and [rubric.md](./rubric.md) for this module.
