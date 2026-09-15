# Rubric · eval:threat-model-covers-tool-results

Target: `artifact:threat-model`. Source of truth: `site/lib/academy-graph/production-agent-systems.ts`. This rubric restates the graph so a reviewer can apply it without the author present; where the two differ, the graph wins.

The graph's title for this eval: **"Tool output is treated as untrusted"**. Its `passThreshold` is `1`, which the graph's types define as the fraction of assertions that must pass. Both assertions must hold.

## How the eval is run

`check-threat-model.mjs` in this directory applies both assertions as the graph's check wording states them and prints the result in the shape `site/lib/academy-graph/advance.ts` reads: `passedAssertions` and `failedAssertions` under the eval id, with the commit the file was at. Run it against the committed file:

```
node check-threat-model.mjs path/to/threat-model.md --matrix path/to/authority-matrix.json
```

`--matrix` is optional for the assertions and required for the module bar below: it lets the script count which read tools are missing from untrusted inputs and which side-effecting tools have no abuse-case row. The script reads the commit from the repository it runs in; pass `--commit <hash>` when running outside one. A record with no commit is not replayable and the script says so.

The script grades exactly the check wording and nothing more. It cannot tell a mechanism from a prompt line, a residual from a restated control, or a named owner from a placeholder. Those are the module bar, applied by a person. Where no script run is available, apply the two assertions by hand using the PASS and FAIL lines below, and write the same record: eval id, artifact id, commit, date, who applied it, which assertion ids passed and which failed.

## One interpretation rule, both assertions

Each assertion is graded on its **check** wording, the mechanical sentence, not on its description. The description says what the check is for; the check says what passes. This is the same rule for both assertions, and it is what the script does. Consequences, stated plainly:

- Generic wording under untrusted inputs ("tool results", "API responses") passes `tool-results-untrusted`.
- A non-empty accepted-risks section that is really a restated mitigation passes `accepted-risks-named`.

Both are weak threat models, and both are caught, but by the module bar, not the eval. The eval has two verdicts per assertion, PASS and FAIL. There is no REVISE on an assertion.

## Recording the result

Recording follows the one rule in [`../01-system-brief/rubric.md`](../01-system-brief/rubric.md#revise-the-one-rule-for-every-rubric-on-this-path): the recorded result is the literal check, PASS or FAIL; REVISE is a note naming one edit and never changes the recorded result; a reviewer-layer finding gates only through the stage's Review node, or goes to the integrator as a proposed tightening. Applied here:

- **PASS** on an assertion: the id goes in `passedAssertions`.
- **FAIL** on an assertion: the id goes in `failedAssertions`, and the eval does not pass.
- **REVISE** exists only on the module bar. It is a note to the author that travels with the record; it is never written into the record as a passed or failed assertion, and it does not delay the record. The script is run, or the hand record written, against the committed file whatever the bar found.

This stage has no companion review in the graph (`reviews: []` on `stage:threat-model`), so the module bar is the only place a person reads the document, and nothing on the graph makes it gate. A cohort may treat an open module-bar item as not done; the graph does not. The items that ought to gate are listed under "Proposed tightenings, for the integrator" at the end.

## Shape requirement: the five sections (not part of the eval)

`artifact:threat-model` declares `requiredSections`: `trust boundaries`, `untrusted inputs`, `abuse cases`, `mitigations`, `accepted risks`. Matching, order and the consequence of a missing section follow the one rule in [`../01-system-brief/rubric.md`](../01-system-brief/rubric.md#required-sections-the-one-rule-for-every-rubric-on-this-path): normalised equality, any heading level, the graph's order, and a missing or out-of-order section records both assertions as FAIL with the section named. It is not an assertion of the eval; `untrusted inputs` and `accepted risks` are the two headings the assertions read, so their absence makes those assertions unevaluable, which is why the FAIL is recorded rather than the file being set aside.

`check-threat-model.mjs` tests presence and spelling but not order: on a missing or renamed heading it exits 2 and prints no verdicts. In that case, and when the five are present but out of the graph's order, the reviewer writes the record by hand in the script's shape with both assertions failed and the heading named.

- **Complete** — All five headings present, spelled as the graph names them, in the graph's order. Heading level does not matter; wording and order do.
- **FAIL, both assertions** — A heading is renamed in a way the rule would miss ("Threats" for abuse cases, "Residual risk" for accepted risks), a section is absent, or a section is out of order. Record both assertions as failed with the graph's wording in the detail.

## Assertion `tool-results-untrusted`

Graph wording — description: **"Tool and retrieval output appears in the untrusted-inputs list."** Check: **"The untrusted-inputs section names tool results or retrieved documents."**

- **PASS** — Under the untrusted-inputs heading, tool results or retrieved documents are named. Naming a specific tool or source from the author's `artifact:tool-authority-matrix` (`read_ticket`, `search_kb`, `get_order`) passes. Generic wording ("tool results", "API responses", "retrieved documents") also satisfies the check as written and passes; the module bar returns it as a note until the tools are named.
- **FAIL** — The untrusted-inputs section lists only user input, or only user input and operator configuration, and no tool result or retrieved document appears anywhere under that heading. Mentions elsewhere in the document do not count; the check is scoped to the section.

## Assertion `accepted-risks-named`

Graph wording — description: **"At least one risk is explicitly accepted rather than silently ignored."** Check: **"The accepted-risks section is non-empty."**

- **PASS** — Under the accepted-risks heading there is content that is not a placeholder. Whether that content is a risk with a reason, an owner and a reopen condition is not part of this assertion; an entry that is a restated mitigation or lacks an owner passes here and is REVISE on the module bar, as a note.
- **FAIL** — The section is empty, absent, or holds only a placeholder: "none", "none at this time", "n/a", "TBD", a lone dash. A threat model with no accepted risks has hidden them, not eliminated them.

## Module bar (applied by a person; reviewer notes)

The two assertions are the eval. A submission can pass both and still be the template threat model the module warns about, because nothing in the graph grades the exercise constraints. Apply these after the assertions. Each is a REVISE trigger: a note to the author naming the item, written beside the record and changing nothing in it (see "Recording the result").

Before applying the bar, open the author's stage-3 `artifact:tool-authority-matrix` at its evidence locator and keep it beside the threat model; three of the seven items read the matrix. If the locator does not open for you, the stage-3 evidence is the problem, and this stage waits on it. Pass the same file to the script's `--matrix` so the first two items below are counted for you.

- A read tool in the matrix that is missing from untrusted inputs, or named only generically ("tool results" with no tool named). Zero matrix tool names anywhere in the file is this item at its widest: the file is a template.
- A `sideEffecting: true` tool in the author's matrix with no abuse-case row.
- A mitigation whose only enforcement is a prompt line.
- A mitigation that credits the authority gate with stopping injection inside a granted run. The gate checks authority membership; it does not see where the call came from. A different mechanism can (the module's intent binding); the gate is not it.
- No disclosure row: no abuse case names a read tool and the output channel that carries its data out.
- An accepted risk that is a mitigation in disguise ("replies could be wrong; a human reviews them"), or has no reason, no owner, or no reopen condition.
- An abuse case that neither links to a mitigation with its residual stated nor appears under accepted risks; or an accepted risk that names no source row.

## Evidence the graph accepts

`stage:threat-model` uses the standard evidence rule: `accepts: ['repo-url', 'eval-run']`, `minimumCount: 1`, `maxAgeDays: 365`.

- `eval-run` — the script's JSON output for the committed file, with the commit hash it names, kept next to the record or pasted into the submission. That is what the graph's types call a recorded, reproducible eval execution: anyone can check out the commit and run the same command. Preferred, because the artifact is cohort-visible and the record does not require exposing the document. A hand-applied record in the same shape (eval id, artifact id, commit, date, verdict per assertion, who applied it) counts only when the person who applied it is not the author. The author running the script on their own file is fine, because the script is the judge; the author grading their own file by hand is a self-issued verdict, which is what `reviewer-attestation` is for, and this stage does not accept that kind.
- `repo-url` — the graph defines this as a commit or file a third party can open. For a `publicSafe: false` artifact that means a locator the reviewer can open without contacting the author, not a public one. A private repository the reviewer has no access to does not satisfy the rule; a link that requires messaging the author is not evidence.
- Evidence older than 365 days is stale and does not count.

The artifact's redaction rule is "everything: threat models are cohort-visible only". A reviewer who finds the threat model linked from a public page, or quoted on the portfolio, should flag it regardless of how the assertions score. That is a visibility violation, not an eval result. At stage 9, `no-redacted-leakage`'s literal check scans the rendered portfolio for the redaction rules' category labels, and this artifact's label is a sentence; the stage 9 rubric has a reviewer expand the labels into concrete strings and fails any description of the threat model's contents. Do not rely on either: search the portfolio and any public page the learner submits for the abuse-case and accepted-risk text now.

## Two ways a submission looks right but fails

**1. The boundary is described but not listed.** The trust-boundaries section has a careful paragraph on why tool results are dangerous, the abuse cases reference injected tickets, and the untrusted-inputs section still reads "user input, operator configuration". The author understood the lesson and wrote it in the wrong section. `tool-results-untrusted` scopes its check to the untrusted-inputs heading and fails. Fix: name the tools and sources under the heading the eval reads.

**2. The template passes the eval and stops at the bar.** Untrusted inputs says "user input, tool results". Accepted risks says "DDoS, handled by the cloud provider". Both assertions pass on the check wording and are recorded as passed; the module bar finds zero tool names from the matrix, no abuse-case row for any side-effecting tool, and an accepted risk with no source row, and returns all three as notes. Fix: derive the abuse cases from the matrix as the module describes, and write the accepted risks as residuals of named mitigations.

## Proposed tightenings, for the integrator

The module bar is where a person catches what the check text lets through. If any of it should gate, the change belongs in the graph's `check` string or in a Review node on `stage:threat-model`, not here:

- `tool-results-untrusted`: "the untrusted-inputs section names every tool with a return value and every retrieval source by the name in `artifact:tool-authority-matrix`".
- `accepted-risks-named`: "the accepted-risks section holds at least one entry with a source row, a reason, an owner and a reopen condition".
- A Review node, `review:threat-model-mechanisms`, with the bar's mitigation items as its rubric lines: no mitigation is a prompt line; the gate is not credited with stopping injection inside a grant; every abuse case links to a mitigation with its residual or to an accepted risk.

Until the graph changes, record the literal result and write the notes.
