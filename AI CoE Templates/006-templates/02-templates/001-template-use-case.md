---
title: "Strategic Use Cases Documentation Template"
type: "template"
category: "strategic-planning"
version: "2.0"
status: "active"
description: "Strategic XML template for documenting business-focused use cases with qualitative benefits and strategic value propositions"
tags:
  - "strategic-use-cases"
  - "business-value"
  - "qualitative-benefits"
  - "actors"
  - "workflows"
  - "business-rules"
  - "xml-format"
  - "executive-planning"
features:
  - "Strategic business-focused XML format"
  - "Primary and secondary actor definitions"
  - "Business workflow documentation"
  - "Alternative scenario handling"
  - "Operational business rules"
  - "Qualitative benefits and success indicators"
  - "Strategic value propositions"
  - "Implementation-agnostic design"
strategic_guidelines:
  focus:
    - "Business capabilities over technical specifications"
    - "Strategic value propositions over implementation details"
    - "Qualitative benefits over quantitative metrics"
    - "Operational workflows over technical requirements"
    - "Application of AI techology to drive innovation"
  avoid:
    - "Specific implementation timelines"
    - "Quantitative performance metrics (percentages, response times)"
    - "Technical requirements and specifications"
    - "Detailed deployment and rollout plans"
    - "ROI calculations or financial projections"
    - "Cost-benefit analysis with specific numbers"
  emphasize:
    - "Business value and strategic benefits"
    - "User experience and operational improvements"
    - "Qualitative success indicators"
    - "Flexible capability descriptions"
    - "Strategic value creation over financial metrics"
content_structure:
  strategic_elements:
    - "Business actors and stakeholders"
    - "Strategic objectives and outcomes"
    - "Operational workflows and processes"
    - "Business rules and constraints"
    - "Qualitative benefits and value"
  avoid_elements:
    - "Technical requirements sections"
    - "Implementation timeline specifications"
    - "Quantitative performance metrics"
    - "System architecture details"
    - "ROI calculations or financial models"
    - "Specific cost projections or savings estimates"
  notes_format:
    - "Strategic benefits: [qualitative value propositions]"
    - "Success indicators: [qualitative achievement measures]"
    - "Business outcomes: [strategic objectives]"
usage_guidelines:
  writing_style:
    - "Focus on business capabilities and value"
    - "Use qualitative descriptors (high, rapid, efficient, reliable)"
    - "Avoid specific numbers, percentages, or timelines"
    - "Emphasize operational improvements and strategic benefits"
  success_metrics:
    - "Replace '90% accuracy' with 'high accuracy'"
    - "Replace '<3 seconds' with 'rapid response'"
    - "Replace '6-month timeline' with 'phased approach'"
    - "Replace 'ROI of 250%' with 'significant strategic value'"
    - "Replace 'cost savings of $X' with 'operational cost optimization'"
    - "Replace 'payback period' with 'value realization timeline'"
  business_rules:
    - "Include only operational and business logic rules"
    - "Avoid implementation-specific constraints"
    - "Focus on governance and compliance requirements"
created: "2025-08-15"
updated: "2025-08-16"
author: "Template System"
template_structure:
  metadata:
    - "title and strategic context"
    - "version and ownership"
    - "business description"
  core_elements:
    - "business actors and stakeholders"
    - "strategic description (brief/detailed)"
    - "business preconditions"
    - "success/failure outcomes"
    - "operational workflows"
    - "alternative scenarios"
    - "business rules and constraints"
  strategic_outputs:
    - "qualitative benefits"
    - "success indicators"
    - "business value propositions"
usage_notes:
  - "Copy use_case block for multiple use cases"
  - "Use unique IDs for each use case (UC001, UC002, etc.)"
  - "Focus on strategic value over implementation details"
  - "Use qualitative language for benefits and success measures"
  - "Avoid quantitative metrics and specific timelines"
  - "Do not include ROI calculations or financial projections"
  - "Express value in terms of capabilities and outcomes, not dollars"
format: "xml"
---

<?xml version="1.0" encoding="UTF-8"?>
<use_cases>
    <metadata>
        <title>Strategic Use Cases Documentation</title>
        <version>2.0</version>
        <date>2025-08-16</date>
        <author></author>
        <description>Strategic template for documenting business-focused use cases with qualitative benefits and value propositions</description>
    </metadata>

    <use_case id="UC001">
        <title>Use Case Title</title>
        <priority>High|Medium|Low</priority>
        <status>Draft|In Review|Approved|Implemented</status>
        
        <actors>
            <primary_actor>Primary user or system</primary_actor>
            <secondary_actors>
                <actor>Secondary actor 1</actor>
                <actor>Secondary actor 2</actor>
            </secondary_actors>
        </actors>
        
        <description>
            <brief>Strategic one-line description focusing on business value and capabilities</brief>
            <detailed>Detailed description emphasizing business outcomes, operational improvements, and strategic value without implementation specifics</detailed>
        </description>
        
        <preconditions>
            <condition>Business condition that must be established (avoid technical implementation details)</condition>
        </preconditions>
        
        <postconditions>
            <success>Strategic business outcome achieved (focus on value delivered)</success>
            <failure>Fallback state and alternative approaches (avoid technical failure modes)</failure>
        </postconditions>
        
        <main_flow>
            <step number="1">Business actor initiates process or strategic action</step>
            <step number="2">System provides business capability or operational support</step>
            <step number="3">Continue workflow focusing on business value delivery</step>
        </main_flow>
        
        <alternative_flows>
            <alternative_flow id="AF001">
                <title>Alternative business scenario title</title>
                <trigger>Business condition that triggers this alternative approach</trigger>
                <steps>
                    <step number="1">Alternative business action focusing on value delivery</step>
                    <step number="2">Continued alternative workflow maintaining strategic objectives</step>
                </steps>
            </alternative_flow>
        </alternative_flows>
        
        <exception_flows>
            <exception_flow id="EF001">
                <title>Business exception scenario title</title>
                <trigger>Business condition requiring alternative approach</trigger>
                <steps>
                    <step number="1">Business continuity action maintaining strategic value</step>
                    <step number="2">Recovery workflow preserving business objectives</step>
                </steps>
            </exception_flow>
        </exception_flows>
        
        <business_rules>
            <rule id="BR001">Operational business rule that applies to this use case</rule>
        </business_rules>
        
        <notes>
            <note>Strategic benefits: [Describe qualitative business value and capabilities]</note>
            <note>Success indicators: [Describe qualitative achievement measures without specific metrics]</note>
            <note>Business outcomes: [Describe strategic objectives and operational improvements]</note>
        </notes>

    </use_case>

    <!-- 
    STRATEGIC USE CASE GUIDELINES:
    
    1. FOCUS ON BUSINESS VALUE:
       - Emphasize capabilities over specifications
       - Describe outcomes over implementations
       - Use qualitative language over quantitative metrics
    
    2. AVOID IMPLEMENTATION DETAILS:
       - No specific timelines or deadlines
       - No technical performance metrics (%, seconds, etc.)
       - No deployment or rollout specifications
       - No detailed technical requirements
       - No ROI calculations or percentage returns
       - No specific cost figures or financial projections
    
    3. USE QUALITATIVE LANGUAGE:
       - "high accuracy" instead of "95% accuracy"
       - "rapid response" instead of "<3 seconds"
       - "significant improvement" instead of "50% reduction"
       - "enhanced capabilities" instead of specific technical features
       - "strong business value" instead of "200% ROI"
       - "cost optimization" instead of "$1M savings"
       - "investment efficiency" instead of "3-year payback"
    
    4. STRUCTURE NOTES FOR STRATEGIC VALUE:
       - Strategic benefits: Business value and capabilities delivered
       - Success indicators: Qualitative measures of achievement
       - Business outcomes: Strategic objectives and operational improvements
    
    Add more use cases by copying the use_case block above and following these guidelines.
    -->
    
</use_cases>