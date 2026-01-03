---
title: "Strategic Product Requirements Documentation Template"
type: "template"
category: "strategic-product-planning"
version: "3.0"
status: "active"
description: "Strategic PRD template focused on business value, user outcomes, and qualitative product capabilities with minimalistic design standards"
tags:
- "strategic-prd"
- "product-strategy"
- "business-value"
- "user-outcomes"
- "qualitative-benefits"
- "minimalistic-design"
- "light-theme-only"
- "business-capabilities"
- "executive-planning"
features:
- "Business-focused product specifications"
- "Strategic value proposition framework"
- "User outcome-driven requirements"
- "Qualitative success indicators"
- "Minimalistic design enforcement (light theme only)"
- "Accessibility-first approach (WCAG 2.1)"
- "Responsive design principles"
- "Component-based design system"
strategic_guidelines:
focus:
- "Business capabilities and user value over technical specifications"
- "Strategic product vision over implementation details"
- "Qualitative user outcomes over quantitative metrics"
- "Business workflows and user journeys over technical requirements"
avoid:
- "Specific implementation timelines and milestones"
- "Quantitative performance metrics (load times, response rates)"
- "Technical architecture and infrastructure details"
- "Detailed development specifications"
emphasize:
- "Strategic business value and competitive advantages"
- "User experience improvements and outcomes"
- "Qualitative success indicators and benefits"
- "Flexible capability descriptions and vision"
content_structure:
strategic_elements:
- "Business vision and strategic objectives"
- "User personas and outcome goals"
- "Capability requirements and business rules"
- "User journey workflows and experiences"
- "Qualitative value propositions"
avoid_elements:
- "Technical implementation sections"
- "Development timeline specifications"
- "Quantitative performance requirements"
- "Infrastructure and deployment details"
design_philosophy:
- "Minimalistic and clean interface design"
- "Light theme enforcement (no dark mode)"
- "User-centric and accessible design"
- "Business-focused functionality over visual complexity"
usage_guidelines:
writing_style:
- "Focus on business capabilities and user value"
- "Use qualitative descriptors instead of metrics"
- "Emphasize strategic benefits and outcomes"
- "Describe user experiences and business workflows"
design_approach:
- "Prioritize functionality over visual decoration"
- "Ensure accessibility and usability"
- "Maintain consistency with light theme standards"
- "Support business objectives through design"
business_focus:
value_propositions:
- "Strategic competitive advantages"
- "User experience improvements"
- "Operational efficiency gains"
- "Business capability enhancements"
success_indicators:
- "Qualitative user satisfaction measures"
- "Business outcome achievements"
- "Strategic objective progress"
- "Competitive positioning improvements"
design_constraints:
theme: "light-only"
philosophy: "minimalistic-business-focused"
accessibility: "WCAG-2.1-AA"
user_experience: "business-value-driven"
created: "2025-01-16"
updated: "2025-01-16"
author: "Strategic Product Team"
format: "xml"
---

# Comprehensive PRD Template

This template includes all sections needed for defining mockups and UI/UX specifications.

## Template Usage Notes

⚠️ **IMPORTANT**: Sections marked with `readonly="true"` contain non-editable template defaults for minimalistic design standards and light theme enforcement. These establish consistent design principles across all projects.

**Key Template Features:**
- **Light Theme Only**: No dark mode support - all interfaces must use light backgrounds
- **Minimalistic Design**: Clean, functional design without decorative elements
- **Consistent Standards**: Pre-defined colors, typography, and spacing systems

**Editable sections**: Replace placeholder text `[like this]` with project-specific content.
**Non-editable sections**: Marked with ⚠️ warnings - use as-is for consistency and light theme enforcement.

```xml
<PRD>
<!-- CORE PROJECT INFORMATION -->
<Overview>
[Project description, scope, and high-level objectives]
</Overview>

<Goals>
<Goal>[Specific measurable goal 1]</Goal>
<Goal>[Specific measurable goal 2]</Goal>
</Goals>

<SuccessMetrics>
<Metric name="[MetricName]" description="[Description]" target="[Target value]"/>
</SuccessMetrics>

<Stakeholders>
<Stakeholder role="[Role]" name="[Name]" contact="[Contact info]"/>
</Stakeholders>

<!-- USER RESEARCH & PERSONAS -->
<UserPersonas>
<Persona id="[ID]" name="[Persona Name]">
<Demographics>[Age, role, experience level, etc.]</Demographics>
<Goal>[Primary goal when using the system]</Goal>
<PainPoint>[Current challenges and frustrations]</PainPoint>
<TechComfort>[Technology comfort level]</TechComfort>
<DeviceUsage>[Primary devices used - desktop, mobile, tablet]</DeviceUsage>
<ContextOfUse>[When, where, and how they use the system]</ContextOfUse>
</Persona>
</UserPersonas>

<!-- USER JOURNEY MAPPING -->
<UserJourneys>
<Journey persona="[Persona ID]" usecase="[Use Case ID]">
<Stage name="[Stage Name]" description="[What user is doing]">
<Actions>[Specific actions taken]</Actions>
<Touchpoints>[Systems, interfaces, or people involved]</Touchpoints>
<Emotions>[User emotions - frustrated, confident, confused]</Emotions>
<PainPoints>[Specific problems encountered]</PainPoints>
<Opportunities>[Improvement opportunities]</Opportunities>
</Stage>
</Journey>
</UserJourneys>

<!-- FUNCTIONAL REQUIREMENTS -->
<UseCases>
<UseCase id="[UC-ID]" name="[Use Case Name]">
<Description>[Detailed description]</Description>
<PrimaryActor>[Main user type]</PrimaryActor>
<Preconditions>[What must be true before starting]</Preconditions>
<Steps>
<Step>[Detailed step description]</Step>
</Steps>
<Postconditions>[End state after completion]</Postconditions>
<AlternativeFlows>[Error handling, edge cases]</AlternativeFlows>
</UseCase>
</UseCases>

<!-- UI/UX DESIGN SPECIFICATIONS -->
<DesignSystem>
<!-- ⚠️ TEMPLATE DEFAULTS - DO NOT EDIT: Minimalistic Design Standards -->
<DesignPhilosophy readonly="true">
<CorePrinciples>
<Principle name="Minimalism">Content-first approach with purposeful white space</Principle>
<Principle name="Clarity">Clear visual hierarchy and intuitive navigation</Principle>
<Principle name="Functionality">Every element serves a specific user need</Principle>
</CorePrinciples>
<DesignValues>
<Value>Simplicity over complexity</Value>
<Value>White space as a design element</Value>
<Value>Essential functionality only</Value>
<Value>No decorative elements unless functional</Value>
</DesignValues>
<!-- ⚠️ TEMPLATE DEFAULTS - DO NOT EDIT: Light Theme Enforcement -->
<ThemeEnforcement readonly="true">
<RequiredTheme>Light theme only - no dark mode support or toggle</RequiredTheme>
<BackgroundStrategy>Always light backgrounds (#FFFFFF, #F9FAFB) for optimal readability</BackgroundStrategy>
<TextStrategy>Dark text on light backgrounds for maximum contrast and accessibility</TextStrategy>
<UserPreferences>System dark mode preferences must be ignored - light theme enforced</UserPreferences>
<ThemeRationale>Consistent visual experience across all users and devices</ThemeRationale>
</ThemeEnforcement>
</DesignPhilosophy>

<BrandIdentity>
<Logo>[Logo specifications and usage guidelines]</Logo>
<!-- ⚠️ TEMPLATE DEFAULTS - DO NOT EDIT: Light Theme Color Palette -->
<ColorPalette readonly="true">
<!-- Light Theme Backgrounds - NEVER USE DARK COLORS -->
<Color name="Background-Primary" hex="#FFFFFF" usage="Main content areas, cards, modals" description="Pure white primary background" contrast="AAA"/>
<Color name="Background-Secondary" hex="#F9FAFB" usage="Page backgrounds, subtle areas" description="Light gray secondary background" contrast="AAA"/>
<Color name="Background-Tertiary" hex="#F3F4F6" usage="Disabled states, placeholders" description="Slightly darker light background" contrast="AA"/>

<!-- Light Theme Text Colors - ALWAYS DARK ON LIGHT -->
<Color name="Text-Primary" hex="#111827" usage="Headlines, primary content" description="High contrast dark text" contrast="AAA"/>
<Color name="Text-Secondary" hex="#4B5563" usage="Supporting text, descriptions" description="Medium contrast dark text" contrast="AA"/>
<Color name="Text-Tertiary" hex="#6B7280" usage="Captions, metadata" description="Lower contrast dark text" contrast="AA"/>

<!-- Interactive Colors -->
<Color name="Primary" hex="#2563EB" usage="Primary actions, links" description="Single dominant color" contrast="AA"/>
<Color name="Primary-Hover" hex="#1D4ED8" usage="Primary actions hover state" description="Darker primary for interactions" contrast="AA"/>

<!-- Utility Colors -->
<Color name="Border" hex="#E5E7EB" usage="Borders, dividers, outlines" description="Subtle light borders" contrast="AA"/>
<Color name="Error" hex="#DC2626" usage="Error states only" description="Error indication on light background" contrast="AA"/>
<Color name="Success" hex="#059669" usage="Success states only" description="Success indication on light background" contrast="AA"/>
<Color name="Warning" hex="#D97706" usage="Warning states only" description="Warning indication on light background" contrast="AA"/>

<!-- Theme Enforcement Rules -->
<ThemeRules readonly="true">
<Rule>All backgrounds must be light colors (#FFFFFF, #F9FAFB, #F3F4F6)</Rule>
<Rule>All text must be dark colors for contrast on light backgrounds</Rule>
<Rule>No dark theme variables or CSS custom properties allowed</Rule>
<Rule>Contrast ratios tested specifically for light theme combinations</Rule>
</ThemeRules>
</ColorPalette>
<!-- ⚠️ TEMPLATE DEFAULTS - DO NOT EDIT: Clean Typography System -->
<Typography readonly="true">
<FontFamily primary="Inter" fallback="system-ui, -apple-system, sans-serif"/>
<FontSizes>
<Size name="H1" pixels="32" usage="Page titles only" weight="600" lineHeight="1.2"/>
<Size name="H2" pixels="24" usage="Section headers" weight="600" lineHeight="1.3"/>
<Size name="H3" pixels="20" usage="Subsection headers" weight="600" lineHeight="1.4"/>
<Size name="Body" pixels="16" usage="All body text" weight="400" lineHeight="1.5"/>
<Size name="Small" pixels="14" usage="Supporting text only" weight="400" lineHeight="1.5"/>
<Size name="Caption" pixels="12" usage="Labels, metadata" weight="400" lineHeight="1.4"/>
</FontSizes>
<TypographyPrinciples>
<Principle>Maximum 2 font weights (400, 600)</Principle>
<Principle>Consistent line heights for readability</Principle>
<Principle>No decorative fonts or excessive styling</Principle>
</TypographyPrinciples>
</Typography>
</BrandIdentity>

<!-- ⚠️ TEMPLATE DEFAULTS - DO NOT EDIT: Minimalistic Spacing System -->
<SpacingSystem readonly="true">
<BaseUnit>8px</BaseUnit>
<ScaleRatio>1.5</ScaleRatio>
<Spacing>
<Space size="xs">8px</Space>
<Space size="sm">16px</Space>
<Space size="md">24px</Space>
<Space size="lg">40px</Space>
<Space size="xl">64px</Space>
<Space size="2xl">96px</Space>
</Spacing>
<WhiteSpacePrinciples>
<Principle>Generous padding around all content blocks</Principle>
<Principle>Minimum 40px between major sections</Principle>
<Principle>White space equals content importance</Principle>
<Principle>Consistent vertical rhythm using base unit</Principle>
</WhiteSpacePrinciples>
</SpacingSystem>

<!-- ⚠️ TEMPLATE DEFAULTS - DO NOT EDIT: Light Theme Component Standards -->
<ComponentLibrary readonly="true">
<Component name="Button">
<Description>Clean, purpose-driven action triggers with light theme enforcement</Description>
<States>Default, hover, focus, disabled</States>
<Variants>Primary (filled), Secondary (outline), Text-only</Variants>
<LightThemeSpecification>
<Primary background="#2563EB" text="#FFFFFF" border="none"/>
<Secondary background="#FFFFFF" text="#2563EB" border="#2563EB"/>
<TextOnly background="transparent" text="#2563EB" border="none"/>
<Disabled background="#F3F4F6" text="#9CA3AF" border="#E5E7EB"/>
</LightThemeSpecification>
<MinimalistPrinciples>
<Principle>No shadows, gradients, or decorative elements</Principle>
<Principle>Light backgrounds only - white or light gray</Principle>
<Principle>Dark text for readability on light backgrounds</Principle>
<Principle>Consistent padding: 12px horizontal, 8px vertical</Principle>
</MinimalistPrinciples>
</Component>

<Component name="Card">
<Description>Clean content containers with light theme backgrounds</Description>
<States>Default, hover (if interactive)</States>
<Variants>Basic (white background, light border)</Variants>
<LightThemeSpecification>
<Background>#FFFFFF</Background>
<Border>#E5E7EB</Border>
<TextPrimary>#111827</TextPrimary>
<TextSecondary>#4B5563</TextSecondary>
</LightThemeSpecification>
<MinimalistPrinciples>
<Principle>Always white (#FFFFFF) background</Principle>
<Principle>Light gray (#E5E7EB) borders only</Principle>
<Principle>Dark text colors for contrast</Principle>
<Principle>Generous internal padding (24px)</Principle>
</MinimalistPrinciples>
</Component>

<Component name="Input">
<Description>Clean form inputs with light theme styling</Description>
<States>Default, focus, error, disabled</States>
<Variants>Text, Search, Select</Variants>
<LightThemeSpecification>
<Background>#FFFFFF</Background>
<Border>#E5E7EB</Border>
<FocusBorder>#2563EB</FocusBorder>
<Text>#111827</Text>
<Placeholder>#6B7280</Placeholder>
<ErrorBorder>#DC2626</ErrorBorder>
</LightThemeSpecification>
<MinimalistPrinciples>
<Principle>White background for all input fields</Principle>
<Principle>Clear dark labels above inputs</Principle>
<Principle>Light gray borders with colored focus states</Principle>
<Principle>No dark mode or theme switching support</Principle>
</MinimalistPrinciples>
</Component>

<!-- ⚠️ TEMPLATE DEFAULTS - DO NOT EDIT: Light Theme Implementation Rules -->
<LightThemeImplementation readonly="true">
<CSSVariables>
<!-- Enforce light theme CSS custom properties -->
<Variable name="--bg-primary" value="#FFFFFF" description="Primary background - always white"/>
<Variable name="--bg-secondary" value="#F9FAFB" description="Secondary background - light gray"/>
<Variable name="--text-primary" value="#111827" description="Primary text - dark"/>
<Variable name="--text-secondary" value="#4B5563" description="Secondary text - medium gray"/>
<Variable name="--border-color" value="#E5E7EB" description="Border color - light gray"/>
<Variable name="--primary-color" value="#2563EB" description="Primary action color"/>
</CSSVariables>
<ImplementationRules>
<Rule>All components must use light theme CSS variables</Rule>
<Rule>No @media (prefers-color-scheme: dark) queries allowed</Rule>
<Rule>No dark mode classes or data attributes</Rule>
<Rule>System theme preferences must be ignored</Rule>
<Rule>All backgrounds must inherit from --bg-primary or --bg-secondary</Rule>
</ImplementationRules>
</LightThemeImplementation>

<!-- ⚠️ TEMPLATE DEFAULTS - DO NOT EDIT: Icon System Requirements -->
<IconSystem readonly="true">
<RequiredIconLibrary>Lucide Icons - https://lucide.dev/</RequiredIconLibrary>
<IconSpecifications>
<IconSource>Lucide icon library exclusively - no custom icons or other libraries</IconSource>
<IconSizing>16px, 20px, 24px standard sizes aligned with typography scale</IconSizing>
<IconColors>Must use CSS variables: var(--text-primary), var(--text-secondary), var(--primary-color)</IconColors>
<IconUsage>Functional icons only - search, navigation, status indicators, actions</IconUsage>
<IconAccessibility>All icons must have proper ARIA labels or be decorative only</IconAccessibility>
</IconSpecifications>
<LucideImplementation>
<CDNRequirement>Use Lucide CDN or npm package - https://unpkg.com/lucide@latest/dist/umd/lucide.js</CDNRequirement>
<StylingMethod>Apply colors using CSS custom properties for theme consistency</StylingMethod>
<ResponsiveRules>Icons scale appropriately across breakpoints (16px mobile, 20px desktop)</ResponsiveRules>
<NoCustomIcons>No custom SVGs, icon fonts, or other icon libraries permitted</NoCustomIcons>
</LucideImplementation>
<MinimalistIconPrinciples>
<Principle>Essential icons only - no decorative or redundant icons</Principle>
<Principle>Consistent stroke width (2px) across all icons</Principle>
<Principle>Light theme compatible - icons work on white backgrounds</Principle>
<Principle>Maximum 1-2 icon colors per interface to maintain simplicity</Principle>
</MinimalistIconPrinciples>
<StandardIcons>
<Icon name="Search" lucideName="search" usage="Search inputs and functionality"/>
<Icon name="Menu" lucideName="menu" usage="Navigation menu toggle"/>
<Icon name="X" lucideName="x" usage="Close dialogs, remove items"/>
<Icon name="ChevronDown" lucideName="chevron-down" usage="Dropdown indicators"/>
<Icon name="Check" lucideName="check" usage="Success states, confirmations"/>
<Icon name="AlertCircle" lucideName="alert-circle" usage="Error and warning states"/>
<Icon name="Info" lucideName="info" usage="Information and help"/>
<Icon name="Plus" lucideName="plus" usage="Add/create actions"/>
<Icon name="Edit" lucideName="edit-2" usage="Edit actions"/>
<Icon name="Trash" lucideName="trash-2" usage="Delete actions"/>
<Icon name="Upload" lucideName="upload" usage="File upload areas"/>
<Icon name="Download" lucideName="download" usage="Download actions"/>
<Icon name="ExternalLink" lucideName="external-link" usage="External navigation"/>
<Icon name="Home" lucideName="home" usage="Home/dashboard navigation"/>
<Icon name="User" lucideName="user" usage="User profile areas"/>
<Icon name="Settings" lucideName="settings" usage="Configuration pages"/>
<Icon name="HelpCircle" lucideName="help-circle" usage="Help and support"/>
<Icon name="Phone" lucideName="phone" usage="Contact information"/>
<Icon name="Mail" lucideName="mail" usage="Email functionality"/>
</StandardIcons>
<ImplementationExample>
<!-- CDN Integration -->
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>

<!-- HTML Usage -->
<i data-lucide="search" style="color: var(--text-secondary); width: 20px; height: 20px;"></i>

<!-- Initialization -->
lucide.createIcons();
</ImplementationExample>
</IconSystem>
</ComponentLibrary>
</DesignSystem>

<!-- WIREFRAMES & USER FLOWS -->
<InformationArchitecture>
<SiteMap>
<Page name="[PageName]" url="[URL]" description="[Purpose]">
<SubPage name="[SubPageName]" url="[URL]"/>
</Page>
</SiteMap>

<UserFlows>
<Flow name="[FlowName]" startPage="[Page]" endPage="[Page]">
<Step>[Navigation step]</Step>
<Decision point="[DecisionPoint]" options="[Option1, Option2]"/>
</Flow>
</UserFlows>
</InformationArchitecture>

<Wireframes>
<Wireframe page="[PageName]" fidelity="[Low/Medium/High]">
<Layout>[Grid system, main sections]</Layout>
<Navigation>[Header, sidebar, footer navigation]</Navigation>
<ContentAreas>[Main content blocks]</ContentAreas>
<InteractiveElements>[Buttons, forms, links]</InteractiveElements>
<Annotations>[Explanatory notes]</Annotations>
</Wireframe>
</Wireframes>

<!-- DETAILED UI SPECIFICATIONS -->
<UserInterface>
<UIComponent name="[ComponentName]">
<Description>[What this component does]</Description>
<Location>[Where it appears in the interface]</Location>
<KeyElements>[List of sub-components and elements]</KeyElements>
<InteractionBehavior>
<Trigger event="[click/hover/scroll]" response="[What happens]"/>
</InteractionBehavior>
<ResponsiveBehavior>
<Breakpoint size="[mobile/tablet/desktop]" behavior="[How it adapts]"/>
</ResponsiveBehavior>
<AccessibilityFeatures>[ARIA labels, keyboard navigation, etc.]</AccessibilityFeatures>
<!-- ⚠️ TEMPLATE DEFAULTS - DO NOT EDIT: Light Theme UI Guidelines -->
<MinimalistDesign readonly="true">
<Layout>Single column, centered, generous white space</Layout>
<ContentHierarchy>Typography and spacing only, no decorative elements</ContentHierarchy>
<MaxWidth>800px for optimal readability</MaxWidth>
<VisualElements>Essential functionality only, no ornamental graphics</VisualElements>
</MinimalistDesign>
<LightThemeUI readonly="true">
<BackgroundStrategy>Always use white (#FFFFFF) or light gray (#F9FAFB) backgrounds</BackgroundStrategy>
<TextStrategy>Dark text colors only - ensure AAA contrast on light backgrounds</TextStrategy>
<BorderStrategy>Light gray (#E5E7EB) borders for subtle separation</BorderStrategy>
<InteractionStrategy>Subtle color changes within light theme palette only</InteractionStrategy>
<NoThemeSwitching>No dark mode toggle, theme selector, or user preference options</NoThemeSwitching>
</LightThemeUI>
</UIComponent>
</UserInterface>

<!-- RESPONSIVE DESIGN -->
<ResponsiveDesign>
<!-- ⚠️ TEMPLATE DEFAULTS - DO NOT EDIT: Standard Breakpoints -->
<Breakpoints readonly="true">
<Breakpoint name="Mobile" minWidth="320px" maxWidth="767px"/>
<Breakpoint name="Tablet" minWidth="768px" maxWidth="1023px"/>
<Breakpoint name="Desktop" minWidth="1024px" maxWidth="1440px"/>
<Breakpoint name="Wide" minWidth="1441px"/>
</Breakpoints>

<AdaptiveBehaviors>
<Component name="[ComponentName]">
<Mobile>[How it appears/behaves on mobile]</Mobile>
<Tablet>[How it appears/behaves on tablet]</Tablet>
<Desktop>[How it appears/behaves on desktop]</Desktop>
</Component>
</AdaptiveBehaviors>

<!-- ⚠️ TEMPLATE DEFAULTS - DO NOT EDIT: Light Theme Responsive Principles -->
<ResponsivePrinciples readonly="true">
<Principle>Mobile-first approach with progressive enhancement</Principle>
<Principle>Maintain generous spacing across all breakpoints</Principle>
<Principle>Single-column layouts on mobile for clarity</Principle>
<Principle>No horizontal scrolling at any breakpoint</Principle>
<Principle>Consistent touch targets (44px minimum)</Principle>
<Principle>Light theme consistency across all device sizes</Principle>
<Principle>White backgrounds maintained on all screen sizes</Principle>
</ResponsivePrinciples>
</ResponsiveDesign>

<!-- INTERACTION DESIGN -->
<InteractionSpecifications>
<!-- ⚠️ TEMPLATE DEFAULTS - DO NOT EDIT: Minimalistic Interactions -->
<MinimalistInteractionPrinciples readonly="true">
<Principle>Subtle transitions only (opacity, color, transform)</Principle>
<Principle>No bounce, elastic, or complex animations</Principle>
<Principle>Consistent timing: 150-300ms for all transitions</Principle>
<Principle>Purpose-driven interactions only</Principle>
<Principle>Clear visual feedback for all user actions</Principle>
</MinimalistInteractionPrinciples>

<MicroInteractions>
<Interaction name="[InteractionName]">
<Trigger>[What initiates it]</Trigger>
<Animation>[Type and duration]</Animation>
<Feedback>[Visual, audio, haptic feedback]</Feedback>
<Purpose>[Why this interaction exists]</Purpose>
</Interaction>
<!-- ⚠️ TEMPLATE DEFAULTS - DO NOT EDIT: Standard Interactions -->
<Interaction name="ButtonHover" readonly="true">
<Trigger>Mouse hover on interactive elements</Trigger>
<Animation>Opacity change to 0.8 over 150ms</Animation>
<Feedback>Visual only, no sound or vibration</Feedback>
<Purpose>Provide clear interactive feedback</Purpose>
</Interaction>
<Interaction name="FocusState" readonly="true">
<Trigger>Keyboard focus or click</Trigger>
<Animation>2px solid outline in primary color, no transition</Animation>
<Feedback>Visual outline for accessibility</Feedback>
<Purpose>Clear focus indication for keyboard navigation</Purpose>
</Interaction>
<Interaction name="LoadingState" readonly="true">
<Trigger>Data fetching or processing</Trigger>
<Animation>Simple spinner or pulse animation</Animation>
<Feedback>Visual loading indicator</Feedback>
<Purpose>Communicate system is working</Purpose>
</Interaction>
</MicroInteractions>

<StateManagement>
<State name="[StateName]" description="[When this state occurs]">
<VisualIndicators>[How user knows they're in this state]</VisualIndicators>
<AvailableActions>[What user can do in this state]</AvailableActions>
</State>
</StateManagement>

<ErrorHandling>
<ErrorType name="[ErrorType]">
<Scenario>[When this error occurs]</Scenario>
<Message>[Error message text]</Message>
<RecoveryOptions>[How user can fix/continue]</RecoveryOptions>
</ErrorType>
</ErrorHandling>
</InteractionSpecifications>

<!-- ACCESSIBILITY REQUIREMENTS -->
<AccessibilityRequirements>
<ComplianceLevel>[WCAG 2.1 AA/AAA]</ComplianceLevel>

<!-- ⚠️ TEMPLATE DEFAULTS - DO NOT EDIT: Light Theme Accessibility Standards -->
<LightThemeAccessibility readonly="true">
<ContrastRequirements>
<Requirement level="AAA" ratio="7:1" description="Text-Primary (#111827) on Background-Primary (#FFFFFF)"/>
<Requirement level="AA" ratio="4.5:1" description="Text-Secondary (#4B5563) on Background-Primary (#FFFFFF)"/>
<Requirement level="AA" ratio="3:1" description="Primary (#2563EB) on Background-Primary (#FFFFFF)"/>
<Requirement level="AA" ratio="3:1" description="Error (#DC2626) on Background-Primary (#FFFFFF)"/>
</ContrastRequirements>
<LightThemeRules>
<Rule>All contrast ratios calculated specifically for light backgrounds</Rule>
<Rule>No dark mode accessibility testing required</Rule>
<Rule>Focus indicators must be visible on white backgrounds</Rule>
<Rule>Color-coding must work with light theme palette only</Rule>
</LightThemeRules>
</LightThemeAccessibility>

<Requirements>
<Requirement category="[Perceivable/Operable/Understandable/Robust]">
<Guideline>[Specific guideline]</Guideline>
<Implementation>[How to implement]</Implementation>
<TestingMethod>[How to verify compliance]</TestingMethod>
</Requirement>
</Requirements>

<KeyboardNavigation>
<TabOrder>[Expected tab sequence]</TabOrder>
<Shortcuts>[Keyboard shortcuts and their functions]</Shortcuts>
<!-- ⚠️ TEMPLATE DEFAULTS - DO NOT EDIT: Light Theme Focus States -->
<LightThemeFocus readonly="true">
<FocusColor>#2563EB</FocusColor>
<FocusWidth>2px</FocusWidth>
<FocusStyle>solid outline</FocusStyle>
<FocusOffset>2px</FocusOffset>
<FocusBackground>Maintain white background with colored outline</FocusBackground>
</LightThemeFocus>
</KeyboardNavigation>

<ScreenReaderSupport>
<ARIALabels>[Required ARIA labels and descriptions]</ARIALabels>
<StructuralMarkup>[Heading hierarchy, landmark roles]</StructuralMarkup>
</ScreenReaderSupport>
</AccessibilityRequirements>

<!-- SAMPLE DATA & CONTENT -->
<SampleData>
<DataSet name="[DataSetName]">
<Structure>[Data fields and types]</Structure>
<SampleRecords>
<Record>[Example data record 1]</Record>
<Record>[Example data record 2]</Record>
</SampleRecords>
<EdgeCases>[Long text, empty fields, special characters]</EdgeCases>
</DataSet>
</SampleData>

<ContentStrategy>
<CopyTone>[Friendly, professional, technical]</CopyTone>
<MessageTypes>
<MessageType name="[Success/Error/Warning/Info]" tone="[Tone]" examples="[Example messages]"/>
</MessageTypes>
<Microcopy>
<Element name="[ButtonText/PlaceholderText/etc.]" content="[Actual text]" rationale="[Why this text]"/>
</Microcopy>
<!-- ⚠️ TEMPLATE DEFAULTS - DO NOT EDIT: Minimalistic Content Guidelines -->
<MinimalistContent readonly="true">
<ContentPrinciples>
<Principle>One idea per sentence</Principle>
<Principle>Essential information only</Principle>
<Principle>No marketing language or unnecessary adjectives</Principle>
<Principle>Clear, actionable language</Principle>
<Principle>Consistent terminology throughout</Principle>
</ContentPrinciples>
<StandardMicrocopy>
<Element name="SearchButton" content="Search" rationale="Single action word, clear purpose"/>
<Element name="CancelButton" content="Cancel" rationale="Standard, familiar term"/>
<Element name="SaveButton" content="Save" rationale="Clear completion action"/>
<Element name="LoadingText" content="Loading..." rationale="Simple progress indication"/>
<Element name="ErrorGeneric" content="Something went wrong. Please try again." rationale="Clear, non-technical error message"/>
<Element name="EmptyState" content="No results found" rationale="Concise, informative"/>
</StandardMicrocopy>
</MinimalistContent>
</ContentStrategy>

<!-- TECHNICAL REQUIREMENTS -->
<FunctionalRequirements>
<FR id="[FR-ID]">[Detailed functional requirement]</FR>
</FunctionalRequirements>

<NonFunctionalRequirements>
<NFR id="[NFR-ID]">[Performance, security, usability requirement]</NFR>
</NonFunctionalRequirements>

<DataRequirements>
<DataSet name="[DataSetName]">
<Source>[Where data comes from]</Source>
<Fields>[Field names and types]</Fields>
<Retention>[How long to keep data]</Retention>
</DataSet>
</DataRequirements>

<!-- TESTING & VALIDATION -->
<AcceptanceCriteria>
<Criterion id="[AC-ID]">[Specific, measurable acceptance criteria]</Criterion>
</AcceptanceCriteria>

<UsabilityTesting>
<TestScenario name="[ScenarioName]">
<Objective>[What you're testing]</Objective>
<Tasks>[Specific tasks for users to complete]</Tasks>
<SuccessMetrics>[How to measure success]</SuccessMetrics>
</TestScenario>
</UsabilityTesting>

<!-- PROJECT MANAGEMENT -->
<Assumptions>
<Assumption>[Project assumption]</Assumption>
</Assumptions>

<RisksAndMitigations>
<Risk id="[R-ID]" description="[Risk description]">
<Mitigation>[How to address this risk]</Mitigation>
</Risk>
</RisksAndMitigations>

<OpenQuestions>
<Question>[Unresolved question that needs answering]</Question>
</OpenQuestions>

<NextSteps>
<Step>[Immediate next action item]</Step>
</NextSteps>
</PRD>
```

