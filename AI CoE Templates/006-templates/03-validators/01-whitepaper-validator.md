{
  "meta": {
    "title": "Whitepaper Quality Assessment",
    "version": "1.0",
    "generated": "2025-08-18",
    "notes": "Scores: 0=missing,1=weak,2=adequate,3=strong. Add notes per item when scoring."
  },
  "checklist": {
    "instructions": "Score each item 0-3 and add optional notes. Sum scores per category and compute category average.",
    "categories": [
      {
        "id": "narrative",
        "title": "Narrative & Message",
        "items": [
          { "id": "purpose_clarity", "text": "Purpose clearly stated and repeated" },
          { "id": "exec_summary", "text": "Executive summary captures key conclusions and calls to action" },
          { "id": "story_arc", "text": "Logical story arc: problem → analysis → solution → actions" },
          { "id": "audience_alignment", "text": "Consistent framing for target audience (C-suite, architects, BU leads)" },
          { "id": "prioritization", "text": "Clear, prioritized recommendations (who does what, when)" }
        ]
      },
      {
        "id": "structure",
        "title": "Structure & Organization",
        "items": [
          { "id": "toc_fidelity", "text": "Table of contents maps to reader goals" },
          { "id": "flow", "text": "Sections flow and transition smoothly" },
          { "id": "scannability", "text": "Headings/sections are scan-friendly (short, descriptive)" },
          { "id": "appendices_useful", "text": "Appendices contain tools/templates referenced in the main text" }
        ]
      },
      {
        "id": "completeness",
        "title": "Content Completeness",
        "items": [
          { "id": "toc_coverage", "text": "All promised topics in TOC are present and sufficiently developed" },
          { "id": "use_cases", "text": "Use cases are specific, measurable, and prioritized" },
          { "id": "roadmap", "text": "Implementation roadmap includes timelines, milestones, owners" },
          { "id": "assumptions", "text": "Dependencies, constraints, and assumptions are explicit" },
          { "id": "risks", "text": "Risks and mitigation strategies are covered" }
        ]
      },
      {
        "id": "accuracy",
        "title": "Accuracy & Evidence",
        "items": [
          { "id": "citations", "text": "Claims supported by citations, data, or examples" },
          { "id": "source_quality", "text": "Sources current and credible" },
          { "id": "figures_tables", "text": "Figures/tables match described data and are labeled" },
          { "id": "technical_feasibility", "text": "Technical recommendations are feasible given described constraints" }
        ]
      },
      {
        "id": "style",
        "title": "Style & Readability",
        "items": [
          { "id": "tone", "text": "Tone matches audience (strategic, not overly technical for execs)" },
          { "id": "conciseness", "text": "Language is concise; jargon is defined or reduced" },
          { "id": "localisation", "text": "Local/contextual considerations (e.g., cultural or regional) are respectful and clear" },
          { "id": "proofing", "text": "Spelling/grammar and formatting are clean" }
        ]
      },
      {
        "id": "governance",
        "title": "Governance, Ethics & Compliance",
        "items": [
          { "id": "decision_rights", "text": "Governance model clearly defines decision rights and reporting lines" },
          { "id": "ethical_ai", "text": "Ethical AI principles are practical and actionable" },
          { "id": "regulatory", "text": "Regulatory/compliance implications are identified (data privacy, residency)" },
          { "id": "kpis", "text": "Performance tracking and KPIs are defined" }
        ]
      },
      {
        "id": "technical",
        "title": "Technical Architecture & Operations",
        "items": [
          { "id": "data_arch", "text": "Data architecture (lake/warehouse/lakehouse) is specified with trade-offs" },
          { "id": "mdm_lineage", "text": "MDM, data lineage and quality are described" },
          { "id": "mlops", "text": "MLOps, model lifecycle, monitoring and drift detection practices are described" },
          { "id": "security", "text": "Security/privacy and edge/offline considerations are addressed" },
          { "id": "integration", "text": "Integration/api patterns and legacy strategies are practical" }
        ]
      },
      {
        "id": "deliverables",
        "title": "Deliverables & Usability",
        "items": [
          { "id": "templates", "text": "Templates, assessment tools, and artifacts are usable (checklist, RACI, roadmap)" },
          { "id": "90day", "text": "There is a clear 'next steps / 90-day plan'" },
          { "id": "contacts", "text": "Contact/ownership and governance for follow-up are provided" }
        ]
      }
    ]
  },
  "mindmap": {
    "title": "Whitepaper Quality Assessment",
    "root": {
      "id": "root",
      "title": "Whitepaper Quality Assessment",
      "children": [
        {
          "id": "narrative_node",
          "title": "Narrative & Message",
          "children": [
            { "id": "purpose_clarity_node", "title": "Purpose clarity" },
            { "id": "exec_summary_node", "title": "Executive summary quality" },
            { "id": "story_arc_node", "title": "Story arc: problem→solution→action" },
            { "id": "audience_node", "title": "Audience alignment" },
            { "id": "calls_node", "title": "Prioritization & calls to action" }
          ]
        },
        {
          "id": "structure_node",
          "title": "Structure & Organization",
          "children": [
            { "id": "toc_node", "title": "TOC fidelity" },
            { "id": "flow_node", "title": "Flow & transitions" },
            { "id": "scannability_node", "title": "Section scannability" },
            { "id": "appendices_node", "title": "Appendix usefulness" }
          ]
        },
        {
          "id": "content_node",
          "title": "Content Completeness",
          "children": [
            { "id": "coverage_node", "title": "TOC coverage" },
            { "id": "usecases_node", "title": "Use cases (specifics, ROI, owners)" },
            { "id": "roadmap_node", "title": "Roadmap (90/180/365 days)" },
            { "id": "assumptions_node", "title": "Assumptions & constraints" },
            { "id": "risks_node", "title": "Risks & mitigations" }
          ]
        },
        {
          "id": "evidence_node",
          "title": "Evidence & Accuracy",
          "children": [
            { "id": "citations_node", "title": "Citations & data sources" },
            { "id": "currency_node", "title": "Currency & credibility" },
            { "id": "figures_node", "title": "Figures & table integrity" },
            { "id": "feasibility_node", "title": "Technical feasibility checks" }
          ]
        },
        {
          "id": "style_node",
          "title": "Style & Readability",
          "children": [
            { "id": "tone_node", "title": "Tone appropriateness" },
            { "id": "concise_node", "title": "Conciseness & jargon handling" },
            { "id": "local_node", "title": "Localization / cultural fit" },
            { "id": "proof_node", "title": "Proofreading & formatting" }
          ]
        },
        {
          "id": "governance_node",
          "title": "Governance, Ethics, Compliance",
          "children": [
            { "id": "board_node", "title": "Board/executive oversight" },
            { "id": "operating_node", "title": "Operating model & RACI" },
            { "id": "ethical_node", "title": "Ethical AI (practical steps)" },
            { "id": "regulatory_node", "title": "Regulatory mapping" },
            { "id": "kpi_node", "title": "KPIs & reporting cadence" }
          ]
        },
        {
          "id": "tech_node",
          "title": "Technical Architecture & Ops",
          "children": [
            { "id": "data_node", "title": "Data platform design" },
            { "id": "mdm_node", "title": "MDM & lineage" },
            { "id": "mlops_node", "title": "MLOps & model governance" },
            { "id": "security_node", "title": "Security & privacy" },
            { "id": "integration_node", "title": "Integration & API strategy" },
            { "id": "edge_node", "title": "Edge/offline capabilities" }
          ]
        },
        {
          "id": "deliver_node",
          "title": "Deliverables & Implementation",
          "children": [
            { "id": "tools_node", "title": "Tools & templates" },
            { "id": "pilot_node", "title": "Pilot selection & prioritization" },
            { "id": "costs_node", "title": "Costs & resource estimates (high-level)" },
            { "id": "success_node", "title": "Success criteria & metrics" }
          ]
        },
        {
          "id": "gaps_node",
          "title": "Gaps & Improvements",
          "children": [
            { "id": "missing_evidence", "title": "Missing evidence items" },
            { "id": "ambiguous_responsibilities", "title": "Ambiguous responsibilities" },
            { "id": "unrealistic_timelines", "title": "Unrealistic timelines" },
            { "id": "legal_ethics", "title": "Unaddressed legal/ethical issues" }
          ]
        }
      ]
    }
  },
  "scoring_rubric": {
    "scale": { "0": "missing", "1": "weak", "2": "adequate", "3": "strong" },
    "category_thresholds": {
      "green": 2.4,
      "yellow": 1.5,
      "red": 0
    },
    "interpretation": {
      "green": "minor edits only",
      "yellow": "moderate revisions required",
      "red": "rewrite sections and clarify owners/roadmap"
    }
  },
  "remediation_suggestions": {
    "low_narrative": "Rewrite purpose and executive summary; add a 1-page 'why now' and prioritized 3-step action list.",
    "low_evidence": "Add citations, up-to-date data and labelled figures; attach raw data or appendix references.",
    "low_roadmap": "Add a 90/180/365 day roadmap with owners and milestone acceptance criteria.",
    "low_governance": "Add RACI, committee charters, and decision escalation paths.",
    "low_technical": "Add architecture diagrams, assumptions, MLOps checklist, and security threat model."
  },
  "output_formats": [
    { "name": "JSON", "usage": "This file (importable into tools or scripts)" },
    { "name": "Mindmap JSON", "usage": "The `mindmap.root` node can be converted to formats for Freemind/XMind/diagram tools" },
    { "name": "CSV", "usage": "Checklist items can be flattened into rows: category,item_id,text" }
  ]
}