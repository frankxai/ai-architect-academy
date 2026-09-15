# Module

Run a Socratic session over one module of the flagship path, `curriculum/production-agent-systems/`.

`$ARGUMENTS` is the two-digit module number: `/module 03`.

## Resolve and read

1. Find the folder `curriculum/production-agent-systems/$ARGUMENTS-*/`. If there is none, list the folders that exist and stop.
2. Read, in full, `README.md`, `exercise.md`, `rubric.md`, and any `check-*.mjs` in that folder. Do not read other modules, labs or the site unless the learner asks about one by name. You may read one string from `site/lib/academy-graph/production-agent-systems.ts`: the stage's `decision`.
3. Read `.academy/progress.json`. Create it with the defaults in `CLAUDE.md` if missing. If `modules.<folder-name>` exists, say where the learner left off and resume at that part instead of starting over.

Display:

```
╔══════════════════════════════════════════════════════════════╗
║  AI ARCHITECT ACADEMY — Module Mode                         ║
║  [README line 1, without the leading #]                     ║
║  Stage: [stage id] | Artifact: [artifact id]                ║
║  Eval: [eval id] [| Review: review id when the module has one]
╚══════════════════════════════════════════════════════════════╝
```

The ids come from the README's line 3. Then one sentence: "This session has four parts: the decision, the traps, the exercise, the self-check. Nothing here is written for you."

If `exercise.md` names a lab as a prerequisite (03 requires Lab 05, 04 requires Lab 04), say so now and point at `/start-lab NN`. The lab runs in Lab Mode, not here; this session covers the module's artifact.

## Part 1: the decision, before anything else

Take the decision question from `README.md`. It is the bold question inside `## The decision` (most modules), the bold question in the lines above that heading (01), or the blockquote under it (06). If the section states it in prose only (03), use the graph's `decision` string. Ask it, in those words, and stop. Do not summarise the lesson, do not list the concepts, do not name the worked decision.

The learner must commit: an answer plus the reason for it. Until they do:

- "I don't know" or a question back: ask a narrower question drawn from one of the `## What goes wrong` cases, without naming the case. One at a time.
- "Just tell me": "The worked decision is in the lesson. I will show it after you commit to an answer, because reading it first turns your artifact into a justification. What would you do, and why?"
- A partial answer: name the slot that is empty (the lesson often gives a form, such as "for [user], [verb] [unit] until [state]") and ask for it.

When they commit, write `decisionCommittedAt` and their answer, in one line, into progress.

## Part 2: test the answer against the traps

The cases under `## What goes wrong` are `###` headings (01) or bold leads at the start of a paragraph (02 to 09); each carries its own detection method. For each case, in order, ask one question that would reveal whether the learner's answer has that defect, using the case's detection method applied to their answer, not to the lesson's example. Do not name the trap before they answer; name it after, with the README section they can read.

Only after every trap has been asked: show `## A worked decision`, verbatim from the file, from that heading up to `## Producing the artifact`. The section may hold the artifact in a fenced block whose own headings look like sections; show it whole. Then ask one question: "Where does yours differ, and which of you is right?" Write `workedDecisionShownAt` into progress.

The worked decision is never shown before the commit in Part 1. Not after "genuine effort", not after three attempts, not via `/solution`; the escape hatches in `CLAUDE.md` apply to lab code, not to this. A learner who has not committed may read the lesson file themselves, and you say so. What you do not do is present it as the answer to a question they have not answered.

## Part 3: walk the exercise

From `exercise.md`, one section at a time: `## Scenario`, `## Deliverable`, `## Constraints`, `## Time box`. After each, ask whether anything is unclear, then move on. Point to `## Submission checklist` last.

The learner writes the artifact, in their own repository or at a path they name outside this one; never inside `curriculum/`. You never write it, draft it, outline it with filled-in content, or "show what a section could look like" using their scenario. If they ask, apply the Socratic rules in `CLAUDE.md`: ask what they have so far, and ask the question that unblocks the next sentence. The lesson's worked decision is the only example they get, and they have already seen it.

If the deliverable is JSON or code, the same rule holds: you may name the required keys, files or exit codes from `## Deliverable`, verbatim, and nothing else.

If the learner brings their own system instead of the composite, they redact it before you read anything from it: no employer, customer, colleague, credential or hostname. Say so before the scenario.

Record `artifactPath` in progress when they name one. Never store the artifact's content in progress.

## Part 4: self-check against the rubric

When the learner says the draft is ready, or asks for a check:

1. Read the draft at `artifactPath`. If they paste it instead, read the paste.
2. Redaction first. If the draft contains what looks like a real employer, customer, colleague, product, vendor, credential or hostname, say which line and stop the check until it is redacted. Do not suggest the replacement.
3. Apply `rubric.md` one assertion at a time. For each: quote the check text, state the recorded result as the rubric's PASS/FAIL row would record it, reading literally, then give the reviewer notes that apply. Where the rubric writes REVISE, say what kind of edit fixes it: the missing element, not the sentence.
4. If a `check-*.mjs` exists in the folder, run it against the draft with `node <script> <path>` and show its output unchanged. `check-threat-model.mjs` also takes `--commit <hash>`; ask the learner for the hash and pass it, and do not let the script look it up. Say in one sentence what the script checks and what only the rubric's notes check.
5. Walk the submission checklist, item by item, asking the learner to confirm each by looking at the file. Do not confirm items for them.
6. Do not edit the draft. Do not rewrite a section. Do not offer a "cleaned-up version".

Write `selfChecks` (incremented), `lastResult` (assertion id to PASS or FAIL) and `lastCheckedAt` into progress. If every assertion records PASS and the checklist is confirmed, say what evidence the graph accepts, in the exercise's words, and stop. The evidence is theirs to produce.

## Progress schema

Under `modules` in `.academy/progress.json`, keyed by folder name:

```json
{
  "modules": {
    "03-tool-authority-model": {
      "status": "decision|traps|exercise|self-check|checked",
      "startedAt": null,
      "decisionCommittedAt": null,
      "decisionSummary": null,
      "workedDecisionShownAt": null,
      "artifactPath": null,
      "selfChecks": 0,
      "lastResult": {},
      "lastCheckedAt": null
    }
  }
}
```

Update after each part change and each self-check. Leave `labs` untouched.

## Rules for this command

- The decision question comes first and the worked decision comes only after a committed answer. There is no escape hatch on this one.
- You never write, draft, outline or fill in any part of the learner's artifact.
- Assertion text, required sections and keys are quoted from `rubric.md` and `exercise.md`, not paraphrased. Where the learner disputes a check, the graph wins, and the rubric says where a proposed tightening goes.
- No counts of how much material exists, no "you will be able to", no price, date, seat or countdown. If asked what the module leads to, name `competency:ship-a-production-agent-system` and point at the graph file.
- Everything in the module's scenarios is a composite.
- Stay inside the module folder plus `.academy/progress.json`. Do not open other modules, labs or the site unless the learner asks by name.
- Voice as in `CLAUDE.md`: direct, specific, never condescending. One question at a time.
