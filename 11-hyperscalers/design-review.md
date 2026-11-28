# Which decision would you change?

An architect’s brief earns its place when somebody can act on it. Start with a decision about one workflow. Add a cloud service only when the evidence changes that decision. This workshop can be completed on paper with the fictional inputs below. It uses no account, keys, paid API or deployment.

## First attempt · five minutes

A parts distributor wants faster replies to technical enquiries. Three approved catalogue records are available.

| Record | Approved information |
| --- | --- |
| A, revision 4 | Part A is rated for dry indoor use up to 100°C. |
| B, revision 2 | Part B is rated for dry indoor use up to 130°C when fitted with housing H. |
| C, revision 1 | This part is withdrawn. A technical reviewer must handle replacement questions. |

A customer asks which part can operate at 120°C indoors. The request says nothing about the housing or moisture. Write the answer you would allow an operator to send, cite a record and name the person who owns the release decision. Keep this first attempt. A diagram, a model and a cloud choice can wait.

## Choose one constraint · ten minutes

Select one provider the workload owner already uses. Open its review card and apply its reviewer’s test. Sellers should add the buyer question that would change the proposal; architects should draw the trust and data boundaries; operators should run the failure case. A student can play any role, then ask a peer to check the result.

| Provider exercise | Evidence to attach |
| --- | --- |
| [AWS · tool authority](aws/README.md#review-the-scope-of-a-tool-call) | One blocked action and the approval needed to release it |
| [Azure · model routing](azure/README.md#test-the-case-for-routing) | A fair comparison, including the cost of human corrections |
| [Google Cloud · component choice](gcp/README.md#remove-a-component-and-rerun-the-case) | A smaller design and what happens when its source is stale |
| [OCI · inference location](oci/README.md#trace-where-the-data-is-processed) | Processing location, proof required and fallback when it is unknown |

## Conduct the comparison · fifteen minutes

Draw two paths with the same owner and source records. First, a human reads the current catalogue and uses a checklist. Second, retrieval returns the cited record and an assistant drafts an answer for human release. Mark where data, credentials, approval and cost cross a boundary. Specify where to return on a timeout or an absent source.

Set the pass rule *before* reviewing either path. For this exercise require zero unsupported operating recommendations and record every escalation. Freeze cases for a dry 80°C request, a dry 120°C request confirmed with housing H, the original ambiguous request and an inquiry about C. Record source version, expected disposition, actual decision, reviewer minutes and cost evidence or “unknown” for each option. A real pilot needs a workload-specific sample and a separately held-out case.

**Worked answer.** At 120°C, A is outside its rating. B requires both dry conditions and housing H. Ask the customer to confirm both. An assistant that names B without the qualifications fails the critical rule. The current checklist remains a credible first choice while the team measures how often lookup causes delay. Revisit drafting only when observed search time and sufficient approved examples justify a comparison.

**Economics check.** Suppose ten accepted cases require 40 total human minutes with the checklist and 33 minutes with the assisted path. At an illustrative €60/hour, with €2 total model/tool cost across every assisted attempt, the costs per accepted case are €4.00 and €3.50. The seven minutes saved covers only €7 of labor across the whole sample. Add support, fixed costs and failed runs before estimating a production return. If a critical error reaches release, the exercise fails regardless of unit cost. These numbers are teaching inputs.

## Make the decision portable

Copy the following into an issue, a local Markdown file or your own notebook. Keep the exercise private unless you choose to share. The operator and reviewer should be able to reopen it independently of any particular AI assistant.

```markdown
# Architecture decision
Owner and decision date:
Source, revision and allowed use:
First answer before assistance:
Options and existing baseline:
Selected provider principle, official URL and date checked:
Proposed boundary and fallback:
Test case, expected result and actual result:
Critical stop condition:
Full cost per accepted case; measurements still needed:
Recommendation, rejected alternative and evidence that could reverse it:
Who reviews, who operates and next review date:
Assistance used and revision after critique:
```

**Transfer case.** A venue operator asks an assistant to suggest an available room. One published room is undergoing maintenance; the booking system is authoritative. Produce a fresh decision without looking at the worked answer. Explain whether a retrieval failure and a booking action should have the same authority.

**Review.** Mark each of the following as demonstrated, needs revision or unobserved: source and uncertainty; simpler baseline; permission and processing boundary; observed failure against a stated rule; ownership and reversal condition. Return the first concrete correction. An independent reviewer should be able to explain why the chosen design might change.

## Keep the cards current

Technical provider notes were checked on 26 November 2026. When a cited guide changes a model name, lifecycle stage, permitted region, pricing assumption or runtime behavior, reopen the relevant card in a pull request. Preserve the old decision and add the date, upstream link, changed recommendation and affected test. Review before the next taught edition; a recent retrieval date alone supplies no new evidence. A framework reference documents alignment with a named principle. Deployment status, compliance and vendor credentials each need their own evidence.

The [Academy source register](../site/data/knowledge-sources.json) supplies the review dates and maps each source to its decision stage. From the repository root, run `node site/scripts/check-source-review.mjs` to list due reviews across the register. To check one reading, append its ID, for example `azure-foundry-model-router`. Exit 0 means no selected review is due, 1 means a source needs review, and 2 means invalid input. A passing date check says nothing about an upstream change since the last reading.
