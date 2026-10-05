# 09 · Public-safe portfolio proof

Stage `stage:portfolio-proof` · artifact `artifact:portfolio-proof` · eval `eval:portfolio-links-resolve`

## The decision

**What can you show publicly without leaking an employer or a customer?**

Eight stages of work now sit in a repository a handful of people can open. That is worth nothing to the stranger this path is written for: a hiring manager, a prospective client, a peer who wants to know whether you have done this before. They cannot open your repository or your dashboard, and they should not take your word for it.

The decision cannot be deferred because every other artifact was written under a different visibility rule. Your working copy of the brief holds the customer's name; the graph declares the brief public only with its `redactionRule` applied. The authority matrix names credentials because a matrix without them is useless. The deployment record's observability locator is internal by design. Each is correct for its audience and none is safe to hand to the public as-is.

It also cannot wait because redaction is subtractive. You can remove more later; you cannot un-publish a hostname a crawler indexed last week. The stage is graded by a machine because the failure is binary: either a logged-out stranger can open the evidence and find nothing that should not be there, or the page is a claim.

## What goes wrong

**Auth-walled evidence.** The links point at a private repository or a dashboard that requires a login. They resolve for you, because your browser carries a session, and for nobody else. This is the one case the eval exists to reject. Detection: fetch every link with `curl -sS -L -o /dev/null -w '%{http_code} %{url_effective}\n' <url>` from a shell with no cookies, or open it in a private window. That is a GET that follows redirects, which is what the eval does. A HEAD request, or a fetch that stops at the first redirect, reports a different response from the one a reader gets, so judge only the final GET response. Anything other than a final 2xx fails. A final 200 whose body is a sign-in page passes the check string, because the server forgot to send the redirect; the reviewer reads the body and returns it as a note, and the rubric proposes the check text that would fail it. Treat it as a failure yourself.

**Redaction leak through screenshots.** The text scan is clean. The embedded dashboard image shows a customer name in a tab title and an internal hostname in the URL bar. The scan reads rendered text, not pixels. Detection: before embedding any image, read its chrome, not just its chart. Tabs, URL bars, account switchers and breadcrumbs are where names live. If you embed one, state in the submission which chrome regions you removed, never what they showed, and read what remains against the terms file. If you cannot crop them out, replace the image with a table you typed.

**The page as a claim.** The page says what you can do rather than linking what you produced. It reads as a CV with a project section. Detection: for each sentence, ask whether a stranger could click something and confirm it. A paragraph with no link that could have been written by someone who did not do the work gets deleted or gets evidence. The rubric makes this a precondition: a page missing a required section, or missing a link for any of the six public-safe artifacts, fails before either assertion is run.

## Concepts

### Proof versus assertion

A portfolio page lists what a stranger can open, not what you say you did. An assertion costs nothing to make and nothing to fake, so a reader discounts it to zero. A link to an ADR that names a rejected option and the reason costs the author a decision they can be argued with, which is why the reader trusts it. The trade-off is that proof is smaller than assertion: you can claim anything, but you can only prove what you left evidence for.

### Which artifacts may be public

The graph decides. Every artifact in `site/lib/academy-graph/production-agent-systems.ts` carries a `publicSafe` flag. The portfolio projection needs two things: a `publicSafe` artifact and an evidence locator whose own visibility is `public`. A public-safe brief submitted as a private repository URL never appears in the portfolio, which is this stage in one sentence. The threat model and the incident report are `publicSafe: false` with a redaction rule of everything. They never appear on the page: not as a link, a quote, or a paraphrase that reveals the injected failure mode.

The competency, `competency:ship-a-production-agent-system`, requires every artifact in the graph, and `projectPortfolio` shows the public-safe subset of that list. So the page links all six public-safe artifacts: `artifact:system-brief`, `artifact:architecture-decision`, `artifact:tool-authority-matrix`, `artifact:eval-harness`, `artifact:cost-model`, `artifact:deployment-record`. Leaving one out turns that stage back into an assertion.

The page may say that the other two exist. "A threat model and an incident simulation report were produced and are cohort-only" leaks nothing and tells the reader the work was done. The incident report is the most interesting artifact in the set and you cannot show it.

The guard it produced is a different matter. The guard is an assertion in the harness, and the harness is public-safe, so the assertion may sit in the mirror as an ordinary test. What may not exist is the thread back to stage 8: no sentence on the page presenting it as the guard the incident produced, no commit message that names the injected failure, no test name or fixture that describes it. The mirror has a fresh history, so the stage-8 guard commit does not exist there anyway; a link to it resolves only in your private repository and fails `links-resolve`. The rule: the guard is public as a test and private as a story.

### Provenance of the mirrored copy

The mirror holds copies, and a copy that was edited after grading is not the file the eval ran against. A skeptical reader who opens a redacted brief and reads "passed its review" is being asked to trust that the redaction changed nothing that mattered. Say what changed instead.

For each artifact you mirror, decide one of two things and record it on the evidence line: `identical`, meaning the mirrored file is byte-for-byte the graded one (compare with `sha256sum` on both), or `redacted:` followed by the names of the fields or sections you changed and the rule each change served. The brief, the ADR and the matrix will usually be `redacted:` copies, because their working versions hold the customer, the internal system names and the credential names. The harness, the cost model and the deployment record should be `identical` or close to it, and the reason is in how the earlier stages were written:

- `artifact:eval-harness` had its fixtures scrubbed of production data at stage 4. The file set can be mirrored as-is. What cannot be mirrored is the private repository's history, which is where `fixtures-versioned-apart` was checked. So the mirror carries the harness, its seeded regression and a CI workflow that runs it, and the page links the public CI run on the mirror commit: a stranger can see the seeded regression exit non-zero. The grading run in your private repository is not linked and not claimed.
- `artifact:cost-model` carries no negotiated rate if stage 6 was done as written: rates are a public list rate with its URL or a placeholder labelled as one, and `costPerUnit` is a number recomputable from them. Dividing the published fields recovers the list rate, which is public. Mirror the file unchanged.
- `artifact:deployment-record` has one redacted field, the observability locator. The two fields `eval:deployment-reachable` asserts on, the live URL and the rollback command, stay byte-identical.

The rule for the page's wording follows from the tag. You may write that an artifact passed a named eval only when the fields that eval asserts on are unchanged in the mirror and the page links a run a stranger can open. For a `redacted:` copy whose redacted fields are the ones an eval reads, the page says what the mirror shows and nothing about the grading.

### The redaction union

The page's own redaction rule is empty because it inherits the rules of everything it links. Collect the `redactionRule` of every linked artifact and take the union. For the public-safe set that is: employer name, customer name, internal system names, credential names, endpoint hostnames, production fixture data, negotiated vendor rates, internal URLs.

Names and rates are easy to spot. System names and hostnames hide inside sentences that read as prose. Shapes to search for:

- hyphenated tokens with an environment suffix: `-prod`, `-staging`, `-eu1`
- internal domain suffixes: `.internal`, `.corp`, `.local`, `.svc`
- private address ranges and bare ports: `10.`, `172.16.`, `192.168.`, `:8443`
- upper-case tokens shaped like environment variables: anything ending `_KEY`, `_TOKEN`, `_SECRET`
- proper nouns that are not products you can buy: an internal service has a name, and the name is the leak
- prefixed identifiers: `INC-`, `CR-`, a customer account number

"The router hands ticket updates to the dispatch service over its prod endpoint" has leaked twice if "dispatch service" is the internal name and "prod endpoint" resolves to a hostname in the matrix you just linked. Describe by role instead: "the router hands updates to a second service that owns the ticket record."

### Channels the text scan does not read

The eval's check string says "rendered text", and that is what the record reads. Its description says "nothing ... appears", and the rubric has the reviewer read the description too and return what they find as notes. Four channels carry names past a rendered-text scan, and a hit in any of them is a disclosure whatever the record says:

- **Link targets and image sources.** An internal URL behind innocuous link text renders as the link text. Scan the markdown source, where `href` and `src` values are visible, not only the rendered page.
- **Commit metadata.** The mirror's history is fresh, but its author and committer fields are whatever your git config held when you made it, and that is often an employer-domain address. Run `git log --all --format='%an %ae %cn %ce' | sort -u` on the mirror before the first push. If the domain is the employer, the employer name is in the history.
- **File metadata.** Images, PDFs and office documents carry properties that are not in their visible content: author, producer, organisation, revision history, camera and location fields. Open the properties of every such file and read every field before its first commit; strip what you find, or do not commit the file.
- **Paths.** A directory called `<customer>-fixtures/` is a verbatim hit that no content scan finds. Scan file and directory names against the terms file as well as their contents.

### Redacting a value the reader can compute

Names leak by paraphrase; numbers leak by arithmetic. Treat a redacted value as leaked whenever two published fields recover it. The cost model is the case to check: it must carry `tokensPerUnit` and `costPerUnit`, and its redaction rule is "negotiated vendor rates". If `costPerUnit` was computed at your contracted rate, the reader divides and has the number you agreed not to disclose.

The fix is not on the mirror. Stage 6 requires the rates in the file to be a public list rate with its URL or a labelled placeholder, and `eval:cost-model-has-ceiling` requires `costPerUnit` to be a JSON number that recomputes from them; the stage-6 rubric returns any other rate as a note and proposes the check text that would fail it. Turning `costPerUnit` into a ceiling string, or `tokensPerUnit` into a range, would make a file that fails the eval it is supposed to have passed. So if your graded cost model carries a contracted rate, go back: re-price at the list rate, recompute, re-run the stage-6 eval, and mirror the re-graded file unchanged. The `ceiling` and `runawayGuard` fields stay exact in every case; they are your decisions, not the vendor's terms.

The same arithmetic applies wherever the page states bounds. A sentence in the decision section that says the contracted rate sits "between the two public tiers" has published an interval; if that interval is narrow, it has published the rate. The rubric has an operational test for this.

### The three sections

The artifact's `requiredSections` are fixed: `what it does`, `the decision you defend`, `evidence links`.

*What it does* is the brief stripped to its public-safe core: the user, the job, the scope boundary. Keep the kill criterion; it is the sentence that proves you thought about failure.

*The decision you defend* is usually the ADR's rejected option and why. Defending the chosen option is easy and every page does it. Defending the rejection is what the stage-2 reviewer pushed on, and what an experienced reader will push on too. Describe the option you did not take fairly, then why it lost, then what would reverse the decision. When the reason it lost is itself redacted, defend by relation, not by number: "uneconomic at our contracted rate; the decision reverses if the vendor's list price falls below our per-ticket ceiling" states the mechanism, names a public reference point and a figure that is yours, and leaves the contracted rate unstated. What you may not do is publish two ends of the comparison that let the reader compute the middle.

*Evidence links* is a list: one line per artifact with its graph id, title, locator and provenance tag (`identical` or `redacted: <fields>`). No commentary; the list is for the checker.

### Links that resolve logged out

Private repositories fail. Dashboards behind a login fail. Preview deployments behind a host's access protection fail. Deployments a free tier idled fail on the day the reviewer checks, which is not the day you checked.

The reliable shape is a public mirror: a second, public repository containing only the public-safe artifacts, with a history that starts at the mirror. Do not push the working repository's history; it contains every draft that once held the customer name. Copy the files, review each against the union, commit, and link each repository file at a permalink with the commit hash so the evidence cannot drift under the reviewer. The deployment's live URL is the one link that is not a permalink and cannot be: it is a running system, already public by the stage-7 eval, and the rubric judges it the way stage 7 does, a final 2xx with a non-empty body from the system itself. Its observability locator stays off the page. The trade-off is maintenance: a mirror drifts unless you re-sync it, and every re-sync is a second chance to leak. Sync rarely, scan every time.

### Voice

Plain and specific, no claim the graph cannot back. The role node states the boundary: "This is not a certification, an accreditation, or a statement about employability. It records that specific artifacts passed specific evals." You may say that `artifact:eval-harness` passed `eval:harness-fails-on-regression` only under the provenance rule above: the asserted fields are unchanged in the mirror and the linked run opens for a stranger. You may not say you are "certified in production agent systems", because nothing in the graph issues certificates.

Two sentences are allowed on the page without a link, and only these two: the statement that the threat model and incident report exist and are cohort-only, and the competency id `competency:ship-a-production-agent-system` with its claim text quoted as written. The second is a quotation of the graph, labelled as one; it is not a claim that the competency was granted, and the page does not say it was unless the grant record is itself linked. Every other sentence either points at something a stranger can open or gets cut. `BRAND-VOICE.md` has the house rules.

### Running both checks yourself

Both assertions can be run before submission, and every one of them runs before the first push. A push is a publication; a scan that runs after it is a report on a disclosure, not a prevention.

**Links.** Fetch every URL on the page, not only those in the evidence list, without cookies and require a final 2xx. `curl -sS -L -o /dev/null -w '%{http_code} %{url_effective}\n' <url>` from a shell that has never logged in, or a private window on another network. Record the final status and final URL per link. Open the body of every 200 to be sure it is the artifact and not a consent or sign-in interstitial.

**The terms file.** One term per line, lower case, with the variants you want caught: hyphens swapped for underscores, each hostname also without its domain. Two hygiene rules. The first is from the [GNU grep manual](https://www.gnu.org/software/grep/manual/grep.html): `-f` obtains patterns from the file "one per line", and "an empty pattern causes grep to find a match on each line", so a blank line in the terms file matches everything and hides the real hits in noise. The second is reasoning about line endings, not a rule the manual states: a file saved with Windows line endings leaves a `\r` at the end of every pattern, and a pattern ending in `\r` matches only lines that end the same way, which on the page you are scanning is usually none. Normalise before every run: `tr -d '\r' < terms.raw | grep -v '^$' > redaction-terms.txt`.

**Redaction, with a positive control.** A scan that prints nothing is indistinguishable from a scan that cannot match, so run it twice. First against a canary: a file in the private directory that contains every term once, one per line, made with `cp redaction-terms.txt canary.txt`. `grep -c -i -F -f redaction-terms.txt canary.txt` must print the term count (`wc -l < redaction-terms.txt`); if it prints less, the terms file is broken and the empty run that follows is meaningless. Then `grep -i -F -f redaction-terms.txt <file>` against three views of the page, because each misses what the others catch: the markdown source shows `href` and `src` values that rendering hides; the HTML shows alt text and title attributes; the extracted text is what the eval's check string names and what a reader sees. Record both runs: the canary count and the empty page run. `-F` matches fixed strings, so a term containing `.` or `-` is matched literally and needs no escaping.

**The tree scan.** Write your own, around forty lines in whatever language you use. It walks the mirror from its root, skips `.git`, and for every file checks the path against the terms and then, if the file is text, every line as a lower-cased fixed-string match against every term. Any hit is a failure that names the path and line. It prints the number of files scanned and the number of terms loaded, and exits non-zero on a hit. Run it against the canary directory first and require the failure; then against the mirror root and require the pass. State on the pass line what it did not read: binary files, files over whatever size cap you set, and history. Those get their own passes below. Keep the script and the terms file in the private directory, never in the mirror; the script's pass line, its scanned and term counts, and the canary failure are what you commit. Do not adapt this repository's own audit script; it carries this repository's term list, which is not yours to copy.

**History.** The working tree is not the repository. Deleted files, earlier drafts and commit messages live in `.git`, and the tree scan does not read them. From inside the mirror, with the terms file outside it:

```
git rev-list --all | xargs git grep -I -i -F -f ../private/redaction-terms.txt
git log --all --name-only --format= | sort -u | grep -i -F -f ../private/redaction-terms.txt
git log --all --format='%an %ae %cn %ce' | sort -u
git log --all --format='%s%n%b' | grep -i -F -f ../private/redaction-terms.txt
```

The first searches every blob at every commit for the terms; the second searches every path that ever existed; the third lists every author and committer, where an employer-domain address is the employer name; the fourth searches commit messages. The first, second and fourth must print nothing and the third must show only addresses you chose. Binary files are skipped by `-I`, so any image, PDF or office file gets a separate metadata read, with a tool that prints every property (`exiftool` is one).

## A worked decision

*This scenario is a composite. The company, the system and the people are invented for teaching.*

A learner built a ticket-triage agent for a regional freight carrier: inbound support emails are classified, routed to a queue, and routine ones get a drafted reply for a human to approve. The ADR rejected a single agent holding every tool in favour of a router plus bounded workers, because the single-agent shape made the authority matrix unbounded. The deployment is live at a public URL; the observability locator is an internal dashboard.

The first draft had four problems, and it had already been pushed to the public host when the learner ran the first scan.

It linked the working repository, which was private. The learner had been logged in so long the padlock had stopped registering.

The "what it does" section said the agent "routes escalations to the dispatch-core queue over the carrier's prod gateway." `dispatch-core` is the internal system name on the ADR's redaction list; "prod gateway" paraphrased `gw-prod-eu1.internal` from the authority matrix. The learner had grepped for the hostname only. The reviewer's union includes both, and `dispatch-core` is a verbatim hit.

It embedded a screenshot of the dashboard detecting the stage-8 injected failure. The caption was careful. The tab title read "Incidents · <carrier name> · prod".

Its first commit held `redaction-terms.txt` and the learner's tree-scan script, both added so a reviewer could reproduce the scan. The mirror's history now contained every string the page was built to hide, and the tree scan, run against the mirror, failed on the terms file it had just loaded.

Because the draft was public, deleting it would remove the link and not the disclosure. The learner treated every string in the terms file as disclosed: told the customer's engineering owner what had been pushed and for how long, had the two named credentials rotated, since a credential's name is the first half of a lookup, and only then deleted the repository. Then they rebuilt the mirror in a private directory and ran every scan before the new first push. The terms file and the scan script stayed in the private directory beside the mirror. They copied in the public-safe artifacts, scanning each against the terms file, replacing `dispatch-core` with "the queue service" and the hostname with "the carrier's gateway (hostname redacted)", and tagged each evidence line: the brief, ADR and matrix `redacted:` with the field names, the harness and cost model `identical`, the deployment record `redacted: observability locator`. They replaced the screenshot with one sentence: the threat model and incident report exist and are cohort-only. The guard from stage 8 went into the mirror's harness as a test named for what it checks, with a commit message to match and no mention of the incident that prompted it. They rewrote the decision section around the rejected single-agent shape and what would reverse the choice: a tool set small enough that one principal could hold it under least privilege. The cost model went in unchanged, because stage 6 had priced it at the vendor's list rate with the URL beside it. The evidence list became one line per artifact with a graph id, a permalink and a tag, plus the live URL. `curl` returned a final 200 for every link from a shell with no cookies; the canary run counted every term and the page run printed nothing on the source, the HTML and the extracted text; the history scan printed nothing; `git log` on the mirror showed one author at a personal address; the tree scan, run from the private directory against the mirror root, passed. The page was shorter than the draft and said less. It was the first version a stranger could check.

## Producing the artifact

1. List the six public-safe artifacts from the graph; all six get a link. The threat model and incident report are not on the list.
2. Build the redaction union in a private directory outside the mirror: the `redactionRule` of every listed artifact in one terms file, one term per line, plus the concrete strings each term stands for in your project (the actual customer name, hostnames, credential names) and their variants (lower case, hyphen and underscore swapped, hostname without domain). Normalise line endings and remove blank lines. This file never enters the mirror.
3. Make the canary: a copy of the terms file. Every scan below runs against it first and must hit every term.
4. Create the mirror repository locally with a fresh history and do not push it yet. Check `git config user.email` first; if it is an employer address, set a personal one for the mirror. Copy in only the listed artifacts, scanning each against the terms file, including its file name and any metadata, before its first commit. Record for each whether it is byte-identical to the graded file or which fields you redacted.
5. If the graded cost model carries a contracted rate, stop and go back to stage 6: re-price at a list rate, re-run its eval, and mirror the re-graded file. Do not edit the mirrored copy.
6. Write `what it does` from the brief: user, job, scope boundary, kill criterion. Remove every name.
7. Write `the decision you defend` from the ADR: the rejected option, why it lost, what would reverse it. Where the reason is redacted, defend by relation to a public reference point.
8. Write `evidence links`: one line per artifact with graph id, title, permalink and provenance tag. The deployment's live URL goes here; the observability locator does not.
9. State that the threat model and incident report exist and are cohort-only. Link nothing, quote nothing, describe nothing. If the stage-8 guard is in the mirror's harness, nothing on the page or in the mirror's history ties it to the incident.
10. Check every redacted number against the fields and bounds you publish. If two published fields recover it, or a stated interval is tight, fix the sentence.
11. Fetch every URL on the page without credentials, following redirects, and record the final status code and final URL. Fix anything that is not a 2xx or whose body is an interstitial or a sign-in page.
12. Scan the page's markdown source, its HTML and its extracted text against the terms file, canary first. Fix every hit, including inside link targets, image sources, link text and alt text.
13. Run your tree scan against the canary directory (must fail) and the mirror root (must pass). Run the four history commands. Read the metadata of every non-text file.
14. Commit alongside the page: the fetch log, the canary count and the empty page scan, the tree scan's pass line with its counts and the canary failure, the empty history scans and the author list. Commit neither the script nor the terms file.
15. Only now push. Commit the page to the mirror as `artifact:portfolio-proof` and submit the mirror's URL as your `repo-url` evidence.

## Check yourself

1. The deployment record's `observability locator` is an internal URL and therefore redacted, but the stage-7 eval already proved the deployment is reachable. What from the deployment record belongs on the page, and how do you show that observability exists without showing where it is?
2. The stage-8 guard is an assertion in the harness, and the harness is public-safe. What is allowed to appear in the mirror, and what in the assertion's commit message, test name or fixture would turn an ordinary test into a description of the incident report?
3. A hosting provider serves your live URL with a 200 and a consent banner that hides the content until clicked. The eval's check is a 2xx. Does this pass, and would you leave it that way?
4. Your ADR's rejected option lost partly because of a negotiated vendor rate that made it uneconomic. The rate is on the cost model's redaction list, and the cost model you link publishes `tokensPerUnit` and a numeric `costPerUnit`. What must be true of the rates in that file for the mirror copy to be safe, and how do you defend the rejection on the page without stating the number or an interval that contains it?
5. The rubric's precondition requires all six public-safe links. Suppose it did not, and you dropped the authority matrix: "credential names" and "endpoint hostnames" would leave the union. Would the page then be allowed to contain a hostname? What does the answer say about the difference between the eval's letter and its purpose?
6. A screenshot of the harness failing on a regression would make the page more convincing. What has to be true of it for it to be safe, and how would you produce one you could prove is safe?
7. The role node says the record is "not a certification, an accreditation, or a statement about employability." Write the one sentence you would put on the page to describe what completing this path means, using only ids and claim text from the graph, and say why that sentence is one of the two allowed without a link.
8. Your first scan printed nothing. Name two ways that output is consistent with a page full of hits, and the one run that distinguishes them.

## Go deeper

- [`CONTENT-CONTRACT.md`](../../../CONTENT-CONTRACT.md): visibility is declared on the node, never decided at render time; the graph, not your judgement, decides what is public-safe.
- [`BRAND-VOICE.md`](../../../BRAND-VOICE.md): clarity first, truthful momentum, close with a verb.
- [`06-cost-model/README.md`](../06-cost-model/README.md): why the cost model carries list rates and a numeric `costPerUnit`, which is what makes it mirrorable unchanged.
- [`04-eval-harness/rubric.md`](../04-eval-harness/rubric.md): the stage-4 principle that a check must be shown able to fail, which is why every scan here has a canary.
- [`08-governance/privacy-gdpr.md`](../../../08-governance/privacy-gdpr.md): the headings a data-protection review of your page would use.
- [`02-learning-paths/micro-modules/storytelling-exec-brief.md`](../../../02-learning-paths/micro-modules/storytelling-exec-brief.md): writing for a reader who decides in a minute, which is also your portfolio reader.
- `site/lib/academy-graph/production-agent-systems.ts`: the `publicSafe` flags, the `redactionRule` entries, the competency's `requiredArtifacts`, and the eval this module is graded by.
