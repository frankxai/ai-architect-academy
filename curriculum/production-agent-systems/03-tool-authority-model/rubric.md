# Rubric · `eval:authority-least-privilege`

Title in the graph: "Authority is bounded per tool". Target: `artifact:tool-authority-matrix`. Pass threshold: 1, which means every assertion must pass; there is no partial credit and no weighting between them.

The rubric has two layers, and the reviewer keeps them apart.

- **PASS and FAIL rows** quote the graph's assertions and the artifact's `requiredSections`, and nothing else. A file that satisfies every PASS row passes the eval as the graph defines it, which is the eval whose recorded result `advance.ts` reads. No FAIL row adds a condition the graph does not state.
- **REVISE rows** are the reviewer's. They exist because a well-formed file can pass the mechanical checks while describing no real authority model: a tool left out, one credential under two names, a revocation path nobody ran, a summary field that contradicts the rows it summarises. A reviewer who finds one sends the file back with the item named rather than waving it through.

Recording follows the one rule in [`../01-system-brief/rubric.md`](../01-system-brief/rubric.md#revise-the-one-rule-for-every-rubric-on-this-path): the recorded result is the literal check, PASS or FAIL; REVISE is a note naming one edit and never changes the recorded result; a reviewer-layer finding gates only through the stage's Review node, or goes to the integrator as a proposed tightening. `stage:tool-authority-model` has `reviews: []`, so every REVISE row below is a note: `advanceCapability` in `site/lib/academy-graph/advance.ts` reads the latest recorded run's `passedAssertions` and `failedAssertions` against the pass threshold and nothing else, and a file returned as REVISE with a passing run recorded still advances. What REVISE does is name what the reviewer sends back and what a cohort treats as not done. Making any of it gate would take a Review node or a tighter check string on the graph; the integrator owns that decision, and the rows that should gate are listed under "Proposed tightenings, for the integrator" at the end.

`check-authority-matrix.mjs` in this directory applies the PASS and FAIL rows to a JSON file and prints the lab's additions and the derived-field consistency as REVISE lines. Lab 05's `tests/test_matrix.py` asserts the graph's checks plus two of its own against the lab's own registry; those additions are listed under the criterion they extend, labelled as the lab's, so a reviewer knows which failures are the graph's and which are the lab's.

To apply this rubric the reviewer needs three things open: the submitted `tool-authority-matrix.json` at the commit named in the evidence, the repository it lives in (the file or module where the agent registers its tools), and the checker. The author does not need to be present.

## Required sections

`artifact:tool-authority-matrix` declares `requiredSections: ['tools', 'principals', 'sideEffecting', 'revocationPath']`. The one rule in [`../01-system-brief/rubric.md`](../01-system-brief/rubric.md#required-sections-the-one-rule-for-every-rubric-on-this-path) applies: for a JSON artifact each entry is a top-level key matched exactly, holding the type the module names (`tools` and `principals` are arrays of objects, `sideEffecting` is an array of names, `revocationPath` is an object keyed by principal id), and a missing entry records every assertion as FAIL. Key order in a JSON object carries no meaning, so the rule's order clause has nothing to test here.

| Verdict | What the reviewer sees |
|---|---|
| PASS | All four keys are present at the top level with the right JSON type. |
| FAIL | Any key is missing or has the wrong type. Every assertion below is recorded as failed with the key named; the checker does the same and prints which key. |

## Criteria

### `side-effecting-flagged`

Graph wording: "Every tool declares whether it is side-effecting."
Check: "Each entry in tools[] has a boolean sideEffecting."

| Verdict | What the reviewer sees |
|---|---|
| PASS | Every object in `tools[]` has a `sideEffecting` key whose value is JSON `true` or `false`. No entry is missing the key, `null`, a string, or a number. |
| REVISE | Every value is a boolean, but at least one `false` sits on a tool whose `authority` token is anything other than a read verb (`write`, `send`, `spend`, `delete`, or a domain token such as `refund`, `reply`, `close`), or on a read the matrix or the registry describes as metered, or whose name plainly mutates something (`update_`, `send_`, `sync_`, `approve_`). The check passes; the declaration is wrong. Return with the tool named. |
| FAIL | Any `tools[]` entry lacks `sideEffecting`, or its value is not a boolean. `"true"`, `null`, `1`, and an absent key all fail. |

### `no-shared-principal-for-writes`

Graph wording: "No single principal backs more than one side-effecting tool."
Check: "Group side-effecting tools by principal; assert every group size is 1."

| Verdict | What the reviewer sees |
|---|---|
| PASS | Take every tool with `sideEffecting: true`, group by `principal`; every group has exactly one member. The number of side-effecting tools equals the number of distinct principals behind them. A matrix with no side-effecting tools passes this check as the graph states it; see the lab's addition and the REVISE row. |
| REVISE | Groups are all size one, but one of the following holds. (a) Two principal ids resolve to one credential: their revocation paths pull the same key, grant, role, or token, however differently the two paths are worded. Each principal must name a distinct credential mechanism, and the reviewer reads the paths for the mechanism, not the id for the name. (b) A read tool shares a principal with a side-effecting tool; the check passes because the read is not counted, but the write credential also does reads, which widens what a leak exposes. (c) No tool is flagged side-effecting in a system whose brief has the agent write, send, spend, or delete; the matrix has not been filled in. Return with the pair or the gap named. |
| FAIL | Any principal appears on two or more side-effecting tools. |

Lab 05 `tests/test_matrix.py` additionally asserts: the list of side-effecting tools is non-empty. The checker prints case (c) as a REVISE line.

### `revocation-documented`

Graph wording: "Each principal has a revocation path."
Check: "Each principal has a non-empty revocationPath string."

| Verdict | What the reviewer sees |
|---|---|
| PASS | Every object in `principals[]` has a `revocationPath` that is a string with non-whitespace content. |
| REVISE | Every string is non-empty, but at least one of the following holds. (a) A path names a person or a team to contact instead of a mechanism to run. (b) No path states what degrades when it is exercised. (c) A path carries no pointer to evidence that it was exercised: a log line, a test, or a runbook entry that a reviewer can open at the repository URL and that shows the tool failing with an authentication error while the others kept working. "Revoke key at issuer; degrades: tool stops" with nothing behind it is a hypothesis, and the exercise requires each path to have been run once. (d) A principal whose credential is minted per run states only the half that stops minting and not the lifetime that must be waited out. Return with the principal named. |
| FAIL | Any principal has a missing, empty, or whitespace-only `revocationPath`. |

Lab 05 `tests/test_matrix.py` additionally asserts: every `principal` value used in `tools[]` appears as a key in the top-level `revocationPath` map. The graph's check reads `principals[]` only, so a tool naming a principal with no map entry is a REVISE here; the checker prints it.

## Reviewer rows outside the graph

None of these is a graph assertion. Each is a REVISE, never a FAIL. The first needs only the file and the checker prints it; the rest need the repository open.

| Check | REVISE when | What to name |
|---|---|---|
| Derived fields agree with the rows | The top-level `sideEffecting` list is not exactly the set of `name` values whose `tools[]` entry has `sideEffecting: true`; or the top-level `revocationPath` map does not have exactly the ids in `principals[]` with the same strings; or a tool names a principal absent from `principals[]`. The lesson tells readers they may trust the derived fields, so a file where they disagree with the rows is a file whose summary lies. | Each name or id on one side and not the other. |
| Matrix matches the registry | The set of `name` values in `tools[]` is not equal to the set of tools the agent registers in the repository (the registry module, the tool server's manifest, or the config the executor loads). A side-effecting tool the system holds and the matrix omits is the most common form; a tool the matrix lists and the system no longer has is the other. | Each tool present on one side and absent on the other. |
| Principals are distinct credentials | Any two principals whose revocation paths act on the same underlying credential, regardless of wording (see `no-shared-principal-for-writes`, REVISE case a). | The pair. |
| Revocation was exercised | Any principal whose path has no evidence pointer, or whose pointer does not open, or whose evidence shows a gate denial rather than a tool execution error. Revoking a credential produces an authentication failure from the tool, not a denial from the gate; evidence of the wrong kind means the path was not run. | The principal. |
| Argument and body binding for the exfiltration pairing | The registry shows an untrusted read, a sensitive read, and an outbound send in one system, and the repository lacks either of two things: a test or fixture asserting that the send's recipient comes from a trusted record rather than from model output, and a bound on what the body can carry (the sensitive read scoped to the run's own party, a templated body the executor fills, or a recorded human approval that shows the rendered message) with a fixture asserting that no other party's data reaches an outbound body. A recipient binding alone is returned: when the untrusted author is also the bound recipient, the body is the channel. The matrix cannot express any of this; the reviewer asks the repository. | The three tools that form the pairing, and which of the two bounds is missing. |

## Evidence

The stage's evidence rule accepts `repo-url` or `eval-run`, requires one locator, and rejects anything older than 365 days.

- A `repo-url` is a link to the committed `tool-authority-matrix.json` in the repository that also holds the agent's tool registry or tool configuration. A link to a gist, or to a repository containing the file alone, does not let the reviewer apply the registry row and is returned. The reviewer opens the file at that URL, runs the checker against it, applies the criteria, then opens the registry and applies the rows outside the graph. Not to a copy pasted into a message.
- An `eval-run` is the recorded output of `check-authority-matrix.mjs` against the committed file, together with the commit hash the file was at and the URL of the repository. The run is:

  ```
  node curriculum/production-agent-systems/03-tool-authority-model/check-authority-matrix.mjs path/to/tool-authority-matrix.json
  ```

  The checker reads only the JSON file and lives in this repository, not the learner's, so nothing the learner edits changes what it reports about the file. The reviewer does not trust the recorded output either: they open the file at the named commit and re-run the checker. A record without the commit hash, or whose output does not match the re-run, is returned. Every graph assertion prints PASS and no REVISE line appears.

Lab 05's `tests/test_matrix.py` is not an evidence mechanism for the learner's own file. It imports `authority_matrix()` from the lab's `tools.py`, and that function is the learner's to edit, so a run of those tests proves the lab was completed and nothing about the submitted matrix. The checker exists so that the same assertions can be applied to a file the learner cannot reach through code.

One locator is enough. A reviewer who is handed both should still open the file, because the run proves the mechanical checks and the file is what the REVISE rows are read against.

The artifact is public-safe with redaction rule `['credential names', 'endpoint hostnames']`. A file that contains either is returned for redaction before any criterion is scored, since it cannot be published as evidence in that state. The checker cannot see this; the reviewer reads for it.

## Three ways a submission looks right but fails

**A tool exported with `sideEffecting: null`.** The matrix is usually generated from a registry where the field is optional, exactly as lab 05's `tools.py` starts out. Two tools are declared with `None` because "they're obviously writes, the code knows". The file has the right keys, the right number of tools, the right principals, and it fails `side-effecting-flagged` on the first entry the check reads. Open the file and look at every value; do not trust the generator.

**Principals added, tool rows not updated.** The author creates three well-named principals with good revocation paths, adds them to `principals[]` and to the `revocationPath` map, and forgets that every `tools[]` entry still says `"principal": "svc-admin"`. The file looks like a split. Grouping the side-effecting tools by their actual `principal` value yields one group of size three, and `no-shared-principal-for-writes` fails. Where the old shared principal was also removed from `principals[]`, the tools now name a principal that has no revocation entry; the graph's check does not see it, because it reads `principals[]` only, and the checker's REVISE lines do. Count from `tools[]`, never from `principals[]`.

**One tool short.** The matrix lists four tools; the registry registers five. The fifth is the export tool somebody added for a report and nobody removed. Every graph check passes, because the checks read the file and the file is internally consistent. The registry row is the only thing that finds it, and it is the reason the repository URL must include the registry.

## Proposed tightenings, for the integrator

Each REVISE row above is a note under the one rule. If any should gate, the change belongs in the graph's `check` string or in a Review node on the stage, not here:

- `no-shared-principal-for-writes`: "group side-effecting tools by principal; assert every group size is 1, and assert that no two principals' revocation paths act on the same credential".
- `revocation-documented`: "each principal has a non-empty revocationPath naming a mechanism, a degradation, and a locator to a run that exercised it".
- A third assertion, `matrix-matches-registry`: "the set of tool names in tools[] equals the set the agent registers at the submitted commit".

Until the graph changes, record the literal result and write the notes.
