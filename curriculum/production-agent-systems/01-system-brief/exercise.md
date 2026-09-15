# Exercise: write the system brief

Stage `stage:system-brief` · produces `artifact:system-brief` · graded by `eval:system-brief-complete`

You write the brief for the one agent system you will carry through every stage of this path. If you already have that system, use it and redact. If you do not, use the composite scenario below; it is built so that every section of the brief has something to bite on.

## Scenario (composite)

This scenario is a composite. It does not describe a real company, a real employer, or a real customer.

A company of a few dozen people runs on shared drives, project channels and a handful of internal tools. When someone joins a project or changes role, they need access granted. Today one office manager does this by hand: reads the request, checks a spreadsheet of who owns what, asks the owner if unsure, grants the access, replies.

One week of the inbox, as it arrived:

- A designer asks to be added to the folder of a project they were assigned to that morning.
- A contractor asks for the shared finance folder, "just to read one invoice".
- A manager asks for a full set of accounts for a new starter whose first day is in two weeks.
- Someone asks to be added to a channel that, as it happens, is where the team leads discuss staffing.
- A developer asks for a login to the design tool.
- A team lead asks for admin on the ticketing tool "so I can fix the workflow myself".
- A person on leave asks a colleague to request folder access on their behalf; the colleague forwards it.
- Two people ask to be added to the same project channel on the same day.

Which of those are routine is yours to decide, and the out-of-scope section is where the decision is recorded. The scenario does not label them.

The office manager wants the routine requests out of their inbox. They do not want to find out from an audit that the assistant granted something it should not have; one grant of the wrong kind is an incident, not a statistic. Requests arrive through a form that writes the requester, the requested resource, the resource's owner from the ownership spreadsheet, and the time of submission into a request log before anyone reads them. The same log records who approved, when the grant was made, and when it was revoked; the assistant would write the approval and grant fields, and only the resource owner or the office manager can write `revoked_at`. Whether those pre-written fields are enough to fix a denominator, or whether the form needs another one, is a precondition you may name under In scope.

You are writing the brief for an access-request assistant. Nothing about its shape, model, or vendor is decided yet; the brief must not decide those either.

## Deliverable

Exactly one file: the system brief, `artifact:system-brief`, in markdown. One `#` title is allowed. The five required headings are `##`, and there are no other `##` headings:

- `## User and job`
- `## In scope`
- `## Explicitly out of scope`
- `## Success measure`
- `## Kill criterion`

Committed to a repository a stranger can open. That URL is the evidence you control, and it satisfies the stage's evidence rule on its own. It does not complete the stage: `advance.ts` also requires a recorded run of `eval:system-brief-complete` with both assertions passed, and nothing in this repository runs the checks, so that run is a reviewer's hand-applied result, produced by reading your brief against the [rubric](rubric.md). You cannot produce it for yourself. Ask for the review when the URL exists.

Only the two assertions, `has-out-of-scope` and `has-kill-criterion`, are recorded. Everything else on the checklist below is either the evidence rule or what a reviewer will tell you is still wrong; the tags say which.

## Constraints

- The user is a role, not a name. The job has a unit and a completion state. Test it against "for [user], [verb] [unit] until [state]".
- The out-of-scope section has at least two bullets. Each bullet names a request someone could actually make, and states what happens: refuses, or hands off, and to whom.
- The success measure is a value the request log can produce without asking anyone. Name the fields and the condition. The denominator is fixed by a field written before the assistant sees the request. If the measure is a proxy, say so.
- The kill criterion is a rate threshold the same log produces, with a window, a minimum sample and a backstop date; or a tripwire that fires on one occurrence; or a date. It names the consequence of firing, who can restart the project and who must agree, and the role or scheduled job that reads it, on what cadence, and where the result goes. The check keeps running after its first evaluation. For this assistant, at least one criterion should be a tripwire: name the grant that ends the project the first time it happens.
- The kill threshold sits on the failing side of the success target, with a gap. Equal is not allowed; the gap is where you fix things. The natural measures here (wrongful-grant rate, revocation-after-grant rate) are lower-is-better, so the kill threshold is above the target; the reopen-rate pair in the lesson's worked example (target under 10%, kill above 20%) is the same case.
- No employer name, no customer name, no colleague's name, no product or vendor name. Roles only. This applies to the composite too: do not invent a company name for it.
- No architecture. If the brief mentions a model, a framework, a database, or a hosting choice, cut it. That is stage 2's decision and writing it here is how a brief turns into a justification.
- One page. If it runs longer, you are designing rather than briefing.

## Time box

Ninety minutes, all in. A suggested split:

- 15 minutes: user and job, iterated until every slot in the form is filled.
- 15 minutes: in scope, as request types with the action that closes them. Mark the ones that cannot be undone.
- 25 minutes: out of scope. This is the section that takes longest when done honestly, because each bullet is a request you are choosing to refuse or a human process you are promising exists, and the scenario has not sorted them for you.
- 15 minutes: success measure and kill criterion, written against the request log's actual fields.
- 10 minutes: redaction pass and the two self-checks.
- 10 minutes: commit and record the evidence.

If you are past the box and the out-of-scope list is still empty, stop and submit the brief with the list as it stands. The out-of-scope check fails on it, and that is a finding about the project, not about you.

## Submission checklist

Before you submit, confirm each of these by looking at the file, not by remembering what you meant to write.

- [ ] The five `##` headings are present, verbatim, and there are no other `##` headings. At most one `#` title above them. (recorded: both assertions find their section by heading; a missing heading records fail)
- [ ] The user is a role. The job has a unit and a completion state. (reviewer note, not recorded)
- [ ] Under "Explicitly out of scope" there are at least two bullets. You counted them. (recorded: `has-out-of-scope`)
- [ ] Every out-of-scope bullet names a request and an action (refuses, or hands off to a named role). (reviewer note, not recorded)
- [ ] The success measure names a log, its fields, and a condition. Its denominator is set before the assistant sees the request. It does not measure adoption, satisfaction, or enthusiasm. (reviewer note, not recorded)
- [ ] Under "Kill criterion" there is a rate threshold with a window, a minimum sample and a backstop date, or a tripwire, or a date. You can point to it. Nothing under that heading says "see above". (recorded: `has-kill-criterion`)
- [ ] At least one criterion fires on a single occurrence. (reviewer note, not recorded)
- [ ] The kill criterion names what happens when it fires, who can restart and who must agree, and who or what reads it, on what cadence. (reviewer note, not recorded)
- [ ] The kill threshold is on the failing side of the success target, with a gap. (reviewer note, not recorded)
- [ ] You searched the file against your private deny-list of employer, customer, colleague, product and vendor names and found none. (redaction rule; not recorded, the reviewer is the only check)
- [ ] The brief contains no model, framework, database or hosting decision. (reviewer note, not recorded)
- [ ] The file is committed to a repository a logged-out visitor can open. You have the URL. (evidence rule)
- [ ] The evidence is dated; it will need to have been verified within 365 days when checked. (evidence rule)
- [ ] You have asked a reviewer for a recorded run of `eval:system-brief-complete`; the stage does not complete without one. (required by `advance.ts`, separate from the evidence rule)
