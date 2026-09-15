# Exercise · Public-safe portfolio proof

Produces `artifact:portfolio-proof`. Graded by `eval:portfolio-links-resolve`. No lab; the exercise is the stage.

## Scenario

*Composite. The company, the system and the people are invented for teaching. Substitute your own project from stages 1 to 8; the scenario only shows the shape of the problem. It does not continue the earlier exercises' composites; if you are using composites rather than your own system, carry your stage 1 brief forward and use this one only for shape.*

You built a ticket-triage agent for a regional freight carrier. Over the previous eight stages you produced a brief that names the carrier, an ADR that names the internal queue service the router hands off to, an authority matrix that lists credential names and the gateway hostname, a harness whose fixtures were scrubbed of production data, a threat model, a cost model priced at a public list rate because stage 6 forbids the contracted one in the file, a deployment record with a public live URL and an internal observability locator, and an incident report describing the failure you injected and how telemetry caught it.

A prospective client has asked what you have built. You have one page to answer with, and they will open it from a browser that has never logged into anything of yours.

## Deliverable

Exactly one artifact: `artifact:portfolio-proof`, a markdown page with the three required sections in this order:

1. `what it does`
2. `the decision you defend`
3. `evidence links`

Submit it as a file in a public repository, and submit that repository's URL as your evidence (the stage's evidence rule accepts `repo-url` or `eval-run`).

## Constraints

- Link every artifact the graph marks `publicSafe: true`, and only those: `artifact:system-brief`, `artifact:architecture-decision`, `artifact:tool-authority-matrix`, `artifact:eval-harness`, `artifact:cost-model`, `artifact:deployment-record`. All six; a missing one fails the rubric's precondition.
- Do not link, quote, paraphrase or describe the contents of `artifact:threat-model` or `artifact:incident-report`. You may state that they exist and are cohort-only.
- The stage-8 guard may exist in the mirror's harness as an ordinary assertion. Nothing on the page, in its commit message, its test name or its fixture connects it to the incident.
- Every URL on the page must return a 2xx to an HTTP GET with no credentials and no cookies, after redirects are followed, and the final body must be the artifact itself. Repository files use permalinks that include a commit hash. The deployment's live URL is the one exception: it is a running system, judged as `eval:deployment-reachable` judges it, a 2xx with a non-empty body from the system itself.
- Each evidence line carries a provenance tag: `identical` if the mirrored file is byte-for-byte the graded one, or `redacted:` with the names of the fields you changed. Say an artifact passed a named eval only if the fields that eval asserts on are unchanged in the mirror and the line links a run a stranger can open.
- Do not edit the cost model to hide a rate. If the graded file carries a contracted rate, re-price at a list rate, re-run the stage-6 eval, and mirror the re-graded file. `costPerUnit` stays a JSON number.
- Build the redaction list as the union of every linked artifact's `redactionRule`, expanded to the concrete strings those rules stand for in your project and their obvious variants. Nothing on that list may appear in the rendered text, link targets, image sources, alt text, image content, file or directory names, file metadata, the mirror's commit author and committer fields, or anywhere in the mirror's history.
- Keep the terms file and your scan script outside the mirror, in a private directory that is never committed. They hold every string you are hiding. Write the scan yourself; do not copy this repository's audit script, which carries this repository's own term list.
- No redacted value may be recoverable by arithmetic from fields you publish, and no sentence may state bounds on a redacted number whose upper bound is less than twice its lower bound.
- No screenshot unless the submission names which chrome regions were removed (tab bar, URL bar, account menu, breadcrumbs) and confirms a person read what remains against the terms file. Never describe what the removed regions showed.
- No claim the graph cannot back. Refer to the competency by id and claim text only. Do not use the words certified, accredited or qualified about yourself.
- The page's own `redactionRule` is empty. That does not exempt it from the union.
- Do not push your working repository's history to the public mirror. Start the mirror with a fresh history, and run every scan before its first push. A scan after the push reports a disclosure; it does not prevent one.

## Time box

Three hours, split roughly: one hour building the mirror and the redaction list, one hour writing, one hour running the checks and fixing what they find. If the checks take longer than the writing, that is normal for a first attempt and the time is well spent.

## Submission checklist

- [ ] The page has the three required sections, in order, with those headings.
- [ ] `evidence links` has one line for each of the six public-safe artifacts, each with its graph id, title, locator and provenance tag (`identical` or `redacted: <fields>`).
- [ ] The threat model and incident report are neither linked nor quoted; their existence is stated in one sentence at most. No sentence presents any test in the mirror as the guard the incident produced.
- [ ] `redaction-terms.txt` exists in a private directory outside the mirror: one line per term from the union, plus the concrete strings each term expands to in your project and their variants (lower case, hyphen and underscore swapped, hostname without domain), with line endings normalised and no blank lines. It is not in the mirror and never was.
- [ ] Output of a credential-free fetch of every URL on the page, following redirects, is committed alongside the page (final status code and final URL per link), and every code is 2xx.
- [ ] The redaction scan is committed as a pair: the canary run against a copy of the terms file, whose hit count equals the term count, and the run against the page's markdown source, HTML and extracted text, which is empty.
- [ ] Your own tree scan, kept outside the mirror, has been run against a canary directory (it failed) and against the mirror root (it passed). Its pass line with the files-scanned and terms-loaded counts, the canary failure, and a statement of what it does not read are committed alongside the page. The script itself is not.
- [ ] The four history commands from the rubric have been run on the mirror: the blob scan, the path scan and the commit-message scan printed nothing, and `git log --all --format='%an %ae %cn %ce' | sort -u` shows no employer-domain address and no string from the terms file. Their output is committed alongside the page.
- [ ] No file or directory name in the mirror is on the terms file, and every image, PDF or office file had every metadata property read and stripped before its first commit.
- [ ] No redacted value can be recovered by arithmetic from two published fields, and no stated interval on a redacted number is tighter than a factor of two.
- [ ] The mirror's history contains no commit that ever held a redacted string. If the mirror was never pushed, recreate it. If it was pushed, treat the strings as disclosed: tell the affected owner, rotate what can be rotated, then recreate.
- [ ] The `decision you defend` section names the rejected option, why it lost, and what would reverse the decision, and where the reason is redacted it is stated by relation rather than by number.
- [ ] Every sentence on the page makes a claim a stranger could check by clicking a link on the same page, with exactly two exceptions: the sentence stating the threat model and incident report exist and are cohort-only, and the competency id `competency:ship-a-production-agent-system` with its claim text quoted as written. No other sentence is unlinked.
