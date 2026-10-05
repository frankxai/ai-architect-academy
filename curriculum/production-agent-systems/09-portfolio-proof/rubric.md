# Rubric · `eval:portfolio-links-resolve`

Eval title, from the graph: **"The portfolio proves rather than asserts."**
Target: `artifact:portfolio-proof`. Pass threshold: `1`, meaning every assertion must pass; there is no partial credit.

This eval has no human review attached (`stage:portfolio-proof` lists `reviews: []`). A reviewer applying this rubric is running the checks a machine would run and recording the result. Apply it without the author present; if a verdict needs the author to explain something, the verdict is REVISE.

Recording follows the one rule in [`../01-system-brief/rubric.md`](../01-system-brief/rubric.md#revise-the-one-rule-for-every-rubric-on-this-path): the recorded result is the literal check, PASS or FAIL; REVISE is a note naming one edit and never changes the recorded result; a reviewer-layer finding gates only through the stage's Review node, or goes to the integrator as a proposed tightening. This stage has no Review node, so every REVISE row below is a note that travels with the recorded PASS. Where a row below reads an assertion's description more strictly than its check string, it says so; the reading decides the note, and the check string decides the record.

## Precondition: the page is the artifact

Before either assertion, check that what was submitted is `artifact:portfolio-proof` as the graph defines it. The eval's title is "proves rather than asserts"; both assertions below are true of a page that links nothing (`links-resolve` has no links to fail, `no-redacted-leakage` has no text to leak), and such a page is the assertion the title rejects. The graph fixes the artifact's `requiredSections` as `what it does`, `the decision you defend`, `evidence links`, matched and ordered under the one rule in [`../01-system-brief/rubric.md`](../01-system-brief/rubric.md#required-sections-the-one-rule-for-every-rubric-on-this-path), and `projectPortfolio` shows the public-safe subset of the competency's `requiredArtifacts`, which is the six artifacts below. A page missing any of them is not the artifact, whatever the assertions say.

| Verdict | Description |
|---|---|
| **Proceed** | All three required sections are present with those headings, in order. `evidence links` carries a locator for each of `artifact:system-brief`, `artifact:architecture-decision`, `artifact:tool-authority-matrix`, `artifact:eval-harness`, `artifact:cost-model`, `artifact:deployment-record`, each on a line with its graph id and a provenance tag (`identical` or `redacted: <fields>`). `the decision you defend` names a rejected option, why it lost, and what would reverse it. |
| **REVISE** | Sections and six locators are present, but a locator lacks its graph id or provenance tag, or `the decision you defend` defends only the chosen option and names no rejected one, or names it without a reversing condition. Proceed to the assertions and record the missing element as a note. |
| **FAIL** | A required section is missing or out of order, or `evidence links` lacks a locator for any of the six public-safe artifacts. Record both assertions as FAIL with the missing section or artifact named; do not run them. |

## Assertion `links-resolve`

> **description:** "Every evidence link resolves for a logged-out visitor."
> **check:** "HTTP GET each link without credentials; require 2xx."

Procedure: extract every URL on the page, from the `evidence links` section and from everywhere else, since a link in the decision section is evidence the moment a reader clicks it. Fetch each with a GET from an environment with no cookies, no stored sessions and no VPN into the author's network, following redirects. Every verdict below is decided on the final response: the status code and the body after the last redirect. Open the body of every final 200.

### Recorded result

| Result | What the reviewer sees |
|---|---|
| **PASS** | Every link on the page ends, after redirects, at a 2xx to a credential-free GET. |
| **FAIL** | Any link ends at a non-2xx to a credential-free GET (401, 403, 404, 5xx, or a connection failure). One failing link fails the assertion; the pass threshold is 1. |

Read literally, a sign-in page served with a 200 passes, and so does a "deployment paused" placeholder and a link to a mutable branch. The description ("resolves for a logged-out visitor") is what the eval is for, and the check string does not reach it. Record pass and write the notes.

### Reviewer notes

Two kinds of link, read differently:

- **Repository files** (the brief, the ADR, the matrix, the harness, the cost model, the deployment record, any CI run): the locator is immutable, a permalink carrying a commit hash or an equivalent that cannot move after grading. A mutable branch link is a note.
- **The deployment's live URL** from `artifact:deployment-record`: a running system has no permalink and is exempt from that requirement. Read it as `eval:deployment-reachable`'s notes do: a non-empty body that is the system's own response, not a platform placeholder.

- Every final 200 body is the artifact it claims to be. A sign-in page, an access-denied page, or a "deployment paused" placeholder served with a 2xx is the one case the eval exists to reject and the check string cannot see; return it as a REVISE note with the URL, and see the tightening below.
- A consent interstitial that clears with one click, or a repository landing page instead of the file, is a note naming the URL.

## Assertion `no-redacted-leakage`

> **description:** "Nothing on the redaction list of any source artifact appears."
> **check:** "Scan the rendered text against the union of redactionRule entries."

Procedure: build the union from the graph for the artifacts the page links. For the full public-safe set it is: `employer name`, `customer name`, `internal system names`, `credential names`, `endpoint hostnames`, `production fixture data`, `negotiated vendor rates`, `internal URLs`. Open each linked artifact and note the concrete strings each rule covers in this project (the actual names, hostnames, credential identifiers, rates). Put them in a terms file of your own, one per line, lower case, with the obvious variants (case changes, hyphen or underscore swaps, the hostname without its domain), normalised with `tr -d '\r'` and with blank lines removed, because an empty pattern matches every line. Confirm the file works against a canary copy of itself before trusting an empty result. Then scan:

- the rendered text, including link text, alt text and code spans;
- the page's markdown source, for `href` and `src` values that rendering hides;
- the mirror's file and directory names;
- the mirror's commit metadata and history, with the four commands below;
- the metadata of any image, PDF or office file in the mirror, read with a tool that prints every property.

Only the first channel is the check string's "rendered text"; the other four go past it because the description says nothing "appears", and a name in a link target, a commit email, a file name or a deleted draft has appeared to anyone who looks. The first channel decides the recorded result; the other four are reviewer notes, and the tightening at the end proposes making them the check. Then check redacted numbers: if two published fields recover a redacted value by arithmetic (the cost model's `tokensPerUnit` and `costPerUnit` giving the vendor rate), the value has been published.

**History procedure.** Clone the mirror. From its root, with your terms file outside it:

```
git rev-list --all | xargs git grep -I -i -F -f <terms>
git log --all --name-only --format= | sort -u | grep -i -F -f <terms>
git log --all --format='%an %ae %cn %ce' | sort -u
git log --all --format='%s%n%b' | grep -i -F -f <terms>
```

The first scans every blob at every commit; the second every path that ever existed; the third lists every author and committer, where an employer-domain address is the employer name; the fourth scans commit messages. The first, second and fourth must print nothing. A working-tree scan does not see deleted files, so a terms file or scan script that was committed and later removed is found only here.

**Operational test for a published interval.** Where the page states bounds on a redacted number rather than the number (a rate "between the two public tiers", a cost "under" one figure and "over" another), compute the interval the sentence implies for the redacted value. If its upper bound is less than twice its lower bound, treat the value as identified and record REVISE with the sentence quoted. If the page states no lower bound, or the interval is wider than that, the sentence stands.

The page's own `redactionRule` is empty. The union comes from what it links, not from the page node.

Two sentences are exempt from the "every sentence links" rule and are not leakage: the statement that the threat model and incident report exist and are cohort-only, and the competency id `competency:ship-a-production-agent-system` with its claim text quoted as written. Any wording beyond those, a paraphrase of the claim upward, or a sentence asserting the competency was granted without linking the grant record, is not exempt.

### Recorded result

| Result | What the reviewer sees |
|---|---|
| **PASS** | No string from the union, expanded to the concrete strings each entry stands for in this project, appears in the page's rendered text: body text, link text, alt text and code spans. |
| **FAIL** | A verbatim hit on any such string appears in the rendered text. |

Read literally, a hostname in an `href`, an employer-domain address in the mirror's commit metadata, a customer name in a directory name or a deleted draft, a vendor rate recoverable by dividing two published fields, and a paragraph describing the incident report all pass: none is in the rendered text. Record pass and write the notes.

### Reviewer notes

- No string from the expanded union appears in a link target or image source, a file or directory name, the mirror's commit metadata, file metadata, an image the reviewer can read, or anywhere in the mirror's history, including a committed terms file or a committed scan script carrying the terms, whether or not it was later deleted. Any hit is a note naming the string and where it appears.
- No redacted value is recoverable exactly by arithmetic from published fields, and no stated interval fails the factor-of-two test.
- The page describes no system, hostname or customer closely enough that a reader with the linked artifacts open could reconstruct the redacted string (a paraphrase of the internal system name, a hostname with the domain dropped, a "regional carrier headquartered in" sentence that identifies the customer).
- The threat model and incident report are not linked, not quoted, and not described beyond the exempt sentence (the injected failure mode, the abuse cases, the accepted risks, or a test presented as the guard the incident produced).
- Any embedded image comes with a statement of which chrome regions were removed, and the reviewer has read what remains and found no name, hostname or identifier.
- No evidence line claims an artifact passed a named eval unless its provenance tag is `identical`, or is `redacted:` naming only fields that eval does not assert on, and the line links a run a stranger can open.

A hit outside the rendered text is a disclosure whatever the record says, and the author treats it as one: the remediation under "The redaction list is in the mirror" below applies whether or not the assertion recorded PASS.

## Evidence the graph accepts

`stage:portfolio-proof` uses the standard evidence rule:

```
accepts: ['repo-url', 'eval-run']
minimumCount: 1
maxAgeDays: 365
```

Accepted: the URL of the public mirror repository containing the page, or a locator for a run of this eval. One is enough. Evidence older than 365 days at the time of checking is stale and must be re-submitted. A deploy URL on its own is not accepted for this stage; the page, not the deployment, is the artifact.

Evidence the rubric wants alongside the page, so the verdicts above can be reached without the author. Each scan comes as a pair, because an empty output on its own cannot be told from a scan that matches nothing:

- the credential-free fetch log: final status code and final URL per link;
- the redaction scan of the page's source, HTML and extracted text, as a pair: the canary run, whose hit count must equal the term count, and the page run, which must be empty;
- the author's tree scan: its failure against the canary directory and its pass line against the mirror root, with the number of files scanned and terms loaded, and a statement of what it did not read (binaries, files over its size cap, history);
- the four history commands' output: three empty, one author list.

The terms file and the scan script are not evidence; their presence anywhere in the mirror's history is a note under `no-redacted-leakage` and a disclosure the author remediates. A hash of the terms file is not evidence either: a reviewer cannot open the file, so the hash proves nothing to them. It serves only the author, who can use it to show later runs used the same file. Absence of the logs does not fail the eval, but it converts every verdict the reviewer cannot reproduce into REVISE.

## Three ways a submission looks right but fails

**The author's own browser said 200.** Every link opened for the author, because the author has a session with the git host and a cookie for the hosting provider. The reviewer's credential-free fetch gets a different final response: a private repository may answer with a not-found status rather than forbidden, and a protected preview deployment may answer 401 or serve a login page with a 200. Read the final status and body yourself rather than assuming either. The page was never public. Reviewer action: FAIL on `links-resolve` for any non-2xx; a login page with a 200 records PASS and is returned as a note, which is the gap the tightening below closes. What the author should have done: fetch from a shell that has never logged in, or a private window on another network, and read the final status codes rather than the rendered page.

**The text is clean and the picture is not.** The author built the redaction terms file, scanned the page, got no hits, and embedded a dashboard screenshot as proof the telemetry caught the incident. The scan reads text; the screenshot's tab title carries the customer name and its URL bar carries an internal hostname. Sometimes the screenshot also describes the injected failure, which is incident-report content and cohort-only. Reviewer action: the rendered text is clean, so `no-redacted-leakage` records PASS; the image is a note naming the name and the hostname, and a disclosure the author remediates regardless. What the author should have done: treat every image as unscanned until a person has read its chrome, or replace it with the one sentence that says the report exists.

**The redaction list is in the mirror.** The author committed `redaction-terms.txt` and the scan script so the reviewer could reproduce the scan. Both spell out every string the page was built to hide, so the mirror's first commit is a verbatim hit on the whole union, and it stays in the history after the files are deleted; the history commands above find it. Reviewer action: the rendered text is clean, so `no-redacted-leakage` records PASS; the history hit is a note, and a disclosure whatever the record says. What the author should have done depends on one fact the reviewer records: whether the mirror had been pushed. Before the first push, recreate the mirror with the two files in a private directory outside it and commit only the scan outputs. After a push, the strings are disclosed and recreating the mirror does not undo that: the author tells the owner of each affected name what was pushed and for how long, has anything that can be rotated rotated (credential names imply credentials), and then recreates the mirror. Either way the gating step was missed: every scan runs before the first push. This is reasoning about how public hosting works, not a fetched fact about a particular host; the verdict does not depend on it, the remediation does.

## Recording the verdict

Record the precondition result, then one line per assertion with its id, the recorded result, the reproducible evidence (the failing URL and final status, or the leaked string and where it appears, or the interval and its bounds), and any REVISE note. If the precondition proceeds and both assertions record PASS, the eval passes and the stage ends; notes go back to the author with the record. If the precondition fails or either assertion records FAIL, the eval fails; return the lines to the author and re-run in full on resubmission, since a fix to one link can change what the union contains.

## Proposed tightenings, for the integrator

The REVISE rows above are notes under the one rule. If any should gate, the change belongs in the graph's `check` string, not here:

- `links-resolve`: "HTTP GET each link without credentials, following redirects; require a final 2xx whose body is the linked artifact, not a sign-in, consent or placeholder page; require a permalink for every repository link".
- `no-redacted-leakage`: "scan the rendered text, link targets, image sources, file names, commit metadata and history of the mirror against the union of redactionRule entries expanded to the project's concrete strings; fail any redacted value recoverable by arithmetic or bounded within a factor of two".

Until the graph changes, record the literal result and write the notes.
