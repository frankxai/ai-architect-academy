# From customer experience to operating architecture

## One specification, several audiences

Begin with the accepted customer result, the owner, baseline, failure cost and constraint envelope. Construct a service blueprint across Human, AI and System columns. Describe the person's screens, decisions and recovery before choosing a model. Give every component, action and relationship an immutable ID.

The solution specification joins customer outcomes, screens, workflows, data classifications, components, provider alternatives, evaluation requirements and operational evidence. It references the existing `architecture.json`; it never replaces that lifecycle gate authority. A renderer is a projection. It cannot raise maturity, approve deployment or invent test evidence.

Generate these views from the same reviewed specification:

| View | Format | Acceptance |
|---|---|---|
| Customer portal | HTML/React, accessible mobile sequence | Person can identify the next decision, result, source and recovery |
| System structure | C4/Structurizr or deterministic SVG | Components, deployment boundaries and ownership match source |
| Editable topology | diagrams.net, React Flow JSON | Shared IDs appear in each export; round-trip editing needs separate integration tests |
| Data flow | typed edge registry, SVG/Mermaid | Classification, encryption and trust crossing are explicit |
| Event and team behavior | sequence/activity diagrams | Actor, authority, retry and timeout match workflow |
| API contract | OpenAPI for synchronous APIs; AsyncAPI for events | Contract tests prove requests, errors and version behavior |
| Infrastructure | reviewed Terraform/provider config | Plan, least privilege, recovery and teardown evidence |
| Editorial explanation | book chapter, reference entry, lab | Claim provenance and implementation state remain visible |
| Concept story | generated art, storyboard, character sheet | Marked conceptual; exact labels/icons composed from verified source |

These are format-selection rules. The current compiler supplies a bounded subset; it does not generate IaC, OpenAPI or AsyncAPI contracts.

## Maturity and sophistication

| Maturity | Required evidence | Permitted claim |
|---|---|---|
| concept | bounded brief, assumptions, alternatives | Proposed architecture |
| visualized | readable exact diagram and interaction states | Visual specification |
| local-tested | clean run, failures, export, exact artifact digest | Tested locally in declared conditions |
| provider-tested | actual provider deployment/model run, permissions and recovery | Verified on named provider and configuration |
| production-verified | accepted domain/revision, real journey, telemetry, owner and rollback | Operating system within declared SLO |

Maturity belongs to each artifact or workload. A local portal can show a concept-stage GCP architecture without conferring its own tested status on that architecture. Receipts must refer to the right object and source digest. A diagram cannot assert its own success.

Sophistication is independent: A0 deterministic, A1 grounded assistance, A2 tool workflow, A3 bounded agent, A4 coordinated agents. Choose the least sophisticated form that passes the accepted-result evaluation. A4 requires evidence that coordination improves quality or economics over A2/A3 and a tested shared budget, deduplication and disagreement path.

## Two economic ledgers

Customer ledger: useful accepted results, adoption, cycle time, correction burden, cost per accepted result and realized benefit. Provider ledger: billable usage by service, account, region and workload, net of credits and excluded resold/API costs. Preserve sponsorship and referral arrangements as explicit relationship records.

Illustrative calculation: 1,000 eligible tasks/month, 60% adoption, 80% accepted results, 12 minutes saved/result, EUR 60/hour value gives EUR 5,760 gross capacity value. At EUR 1,200 model/hosting/review/support cost, net capacity value is EUR 4,560. These are assumptions, not revenue or measured customer ROI. Include every attempt and failed run in cost; do not use provider invoice growth as a customer-success proxy.

Customer selection uses hard constraints first: purpose, data rights, residency, latency, reliability, operating owner and budget. Among feasible candidates compare performance, accepted-result cost, time to value and exit cost. Only then explain the provider's consumption opportunity. A vendor incentive never raises a losing customer architecture's score.

## Agent delivery contract

Use one orchestrator with bounded specialist tasks: experience, provider research, implementation, economics, security/evaluation, and independent acceptance. These are responsibilities; create separate agents only when needed for expertise, isolation or independent review. All share one root mandate and budget. A reviewer may reject or request correction but cannot silently expand authority.

Read current official documentation for every dated API/model/region/price choice. Record requested URL, resolved URL, retrieval date, scoped claim, source revision where available, review deadline and applicability. Fail a release gate when an indispensable claim expires. Do not rewrite all content because a marketing page changed; compute the dependency set affected by the source.

Run the loop: inspect canonical project and instructions; frame value; specify experience; select alternatives; implement inside approved scope; run positive and adverse cases; obtain independent review; export; promote through the authorized runtime; observe; turn defects into regressions. Each transition requires evidence on the exact revision.

## Company and industry portals

One private project authority holds briefs, source licenses, customer evidence and decisions. Public industry pages publish approved abstractions and redacted cases. Connect to official industry portals, standards bodies, research institutions and provider architecture centers with source records. Do not ingest entire portals without checking rights, rate limits and data use.

Use case backlog candidates: support triage, invoice exception handling, technical knowledge retrieval, product research synthesis, field-service guidance and media approval. Rank them from measured task volume, verified pain, adoption, recoverability and net benefit. Until baseline data exists these are hypotheses; no universal highest-ROI ranking is defensible.

## Maintenance and publishing

Git owns the reviewed specification and source. Wiki/HTML/PDF are projections. An open wiki needs edit history, attribution, source freshness and release boundaries; publishing a page is not promotion of its code. Maintainers compile each edition from an immutable source revision, run checks, disclose model/harness involvement, record editor identities and issue corrections by affected claim/artifact IDs.

No recurring monitor is active merely because this method describes one. A real monitor requires an installed scheduler, owner, scoped sources, cadence, budget, deduplication and stop route. First maintain the bounded reference package; add automatic source-drift detection after the dependency graph and review process are proven.
