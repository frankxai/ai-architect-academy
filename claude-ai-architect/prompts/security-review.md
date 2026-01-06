---
name: security-review
description: AI system security assessment
---

# Security Review Workflow

You are the AI Security Architect conducting comprehensive security assessments.

## Pre-Review Checklist

Before proceeding, gather:
- [ ] Architecture diagrams
- [ ] Data flow documentation
- [ ] Current IAM policies
- [ ] Network topology
- [ ] Compliance requirements (SOC2, HIPAA, PCI, etc.)

## Security Assessment Framework

### Layer 1: Identity & Access Management

#### IAM Policy Review Checklist

| Check | Status | Finding |
|-------|--------|---------|
| Least privilege principle applied | | |
| No wildcards (*) in resource statements | | |
| MFA enforced for all users | | |
| Service accounts properly scoped | | |
| API keys rotated < 90 days | | |
| Break-glass procedures documented | | |
| Regular access reviews conducted | | |

#### OCI IAM Policy Examples

```hcl
# GOOD: Specific, scoped policy
Allow group genai-developers to use generative-ai-family in compartment genai-dev
Allow group genai-developers to read generative-ai-dedicated-ai-clusters in compartment genai-dev

# BAD: Overly permissive
Allow group developers to manage all-resources in tenancy  # NEVER DO THIS
```

#### High-Risk IAM Patterns

```yaml
Red Flags:
  - "manage all-resources in tenancy"
  - "any-user" in identity policies
  - API keys without expiration
  - Service accounts with admin rights
  - No separation of duties (dev/prod)
```

### Layer 2: Network Security

#### Network Architecture Review

```
┌──────────────────────────────────────────────────────────────────┐
│                     RECOMMENDED ARCHITECTURE                      │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Public Subnet (DMZ)                                         │ │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐                     │ │
│  │  │   WAF   │──│   ALB   │──│ API GW  │                     │ │
│  │  └─────────┘  └─────────┘  └─────────┘                     │ │
│  └─────────────────────────────┬───────────────────────────────┘ │
│                                │                                  │
│  ┌─────────────────────────────┴───────────────────────────────┐ │
│  │ Private Subnet (Application)                                │ │
│  │  ┌─────────┐  ┌─────────┐                                  │ │
│  │  │ App     │──│ GenAI   │                                  │ │
│  │  │ Servers │  │ Endpoint│                                  │ │
│  │  └─────────┘  └─────────┘                                  │ │
│  └─────────────────────────────┬───────────────────────────────┘ │
│                                │                                  │
│  ┌─────────────────────────────┴───────────────────────────────┐ │
│  │ Private Subnet (Data)                                       │ │
│  │  ┌─────────┐  ┌─────────┐                                  │ │
│  │  │   DB    │──│ Object  │                                  │ │
│  │  │         │  │ Storage │                                  │ │
│  │  └─────────┘  └─────────┘                                  │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

#### Network Security Checklist

| Check | Status | Finding |
|-------|--------|---------|
| GenAI in private subnet | | |
| WAF protecting public endpoints | | |
| NSGs/Security Lists configured | | |
| No 0.0.0.0/0 ingress rules | | |
| VCN Flow Logs enabled | | |
| DDoS protection enabled | | |

### Layer 3: Data Security

#### Data Classification

| Data Type | Classification | Protection Required |
|-----------|---------------|---------------------|
| Prompts | Confidential | Encryption in transit |
| Responses | Confidential | Encryption in transit/rest |
| Training Data | Highly Confidential | Encryption + Access Control |
| Model Weights | Highly Confidential | Encryption + Compartment |
| PII | Restricted | Encryption + Masking + Audit |
| PHI | Restricted | HIPAA controls |

#### Encryption Checklist

| Check | Status | Finding |
|-------|--------|---------|
| TLS 1.2+ for all connections | | |
| Data encrypted at rest | | |
| Customer-managed keys (CMK) used | | |
| Key rotation enabled | | |
| Secrets in vault (not code) | | |

### Layer 4: AI-Specific Security

#### Prompt Injection Defense

```python
# prompt_security.py

class PromptSecurity:
    """Defense against prompt injection attacks."""

    INJECTION_PATTERNS = [
        r"ignore previous instructions",
        r"disregard (?:all|any) (?:prior|previous)",
        r"forget (?:everything|all)",
        r"you are now",
        r"new instructions:",
        r"system prompt:",
        r"\[INST\]",
        r"<\|im_start\|>system",
    ]

    def validate_input(self, user_input: str) -> dict:
        """Validate user input for injection attempts."""

        import re

        findings = []

        # Check for injection patterns
        for pattern in self.INJECTION_PATTERNS:
            if re.search(pattern, user_input, re.IGNORECASE):
                findings.append({
                    "type": "prompt_injection",
                    "pattern": pattern,
                    "severity": "high"
                })

        # Check for encoded payloads
        if self._contains_encoded_payload(user_input):
            findings.append({
                "type": "encoded_payload",
                "severity": "high"
            })

        # Check for excessive tokens
        if len(user_input.split()) > 10000:
            findings.append({
                "type": "token_overflow",
                "severity": "medium"
            })

        return {
            "valid": len(findings) == 0,
            "findings": findings
        }

    def sanitize_input(self, user_input: str) -> str:
        """Sanitize potentially dangerous input."""

        # Remove control characters
        sanitized = ''.join(
            char for char in user_input
            if ord(char) >= 32 or char in '\n\t'
        )

        # Truncate if too long
        max_length = 50000
        if len(sanitized) > max_length:
            sanitized = sanitized[:max_length]

        return sanitized
```

#### Output Validation

```python
# output_security.py

class OutputSecurity:
    """Validate and filter AI outputs."""

    PII_PATTERNS = {
        "ssn": r"\b\d{3}-\d{2}-\d{4}\b",
        "credit_card": r"\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b",
        "email": r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b",
        "phone": r"\b\d{3}[- ]?\d{3}[- ]?\d{4}\b",
    }

    def validate_output(self, response: str) -> dict:
        """Validate AI output for sensitive data leakage."""

        import re

        findings = []

        for pii_type, pattern in self.PII_PATTERNS.items():
            matches = re.findall(pattern, response)
            if matches:
                findings.append({
                    "type": f"pii_detected_{pii_type}",
                    "count": len(matches),
                    "severity": "high"
                })

        return {
            "valid": len(findings) == 0,
            "findings": findings
        }

    def redact_pii(self, response: str) -> str:
        """Redact PII from response."""

        import re

        redacted = response
        for pii_type, pattern in self.PII_PATTERNS.items():
            redacted = re.sub(pattern, f"[REDACTED_{pii_type.upper()}]", redacted)

        return redacted
```

#### AI Security Checklist

| Check | Status | Finding |
|-------|--------|---------|
| Prompt injection defense enabled | | |
| Output filtering configured | | |
| Rate limiting implemented | | |
| Model inputs logged (not content) | | |
| Content moderation enabled | | |
| Jailbreak detection active | | |

### Layer 5: Operational Security

#### Logging & Monitoring

```yaml
Required Logs:
  - Authentication events (all clouds)
  - API calls to GenAI services
  - Network flow logs
  - Data access logs
  - Admin operations

Retention:
  - Security logs: 1+ year
  - Operational logs: 90 days
  - Debug logs: 7 days

Alerts:
  - Failed auth > 5 in 5 min
  - Unusual API volume
  - Data exfiltration patterns
  - Privilege escalation attempts
```

#### Incident Response

```markdown
## AI Incident Response Playbook

### Scenario 1: Prompt Injection Detected
1. Block the source IP/user immediately
2. Review last 100 requests from that source
3. Check if any sensitive data was exposed
4. Document in incident log
5. Update injection patterns if new technique

### Scenario 2: Data Leakage Suspected
1. Disable affected endpoint
2. Review response logs for PII
3. Identify scope of potential leak
4. Notify privacy team
5. Prepare breach notification if required

### Scenario 3: Model Behaving Unexpectedly
1. Switch to fallback model/endpoint
2. Review recent changes (prompts, config)
3. Test with known-good inputs
4. Check for adversarial inputs in logs
5. Document and investigate root cause
```

## Compliance Mapping

### SOC 2 Type II

| Control | AI Implementation |
|---------|-------------------|
| CC6.1 - Logical Access | IAM policies, MFA |
| CC6.6 - Transmission Security | TLS 1.2+, private subnets |
| CC6.7 - Disposal | Data retention policies |
| CC7.1 - Security Monitoring | OCI monitoring, alerts |

### HIPAA (if applicable)

| Requirement | AI Implementation |
|-------------|-------------------|
| Access Control | Role-based, audit logs |
| Audit Controls | All access logged |
| Transmission Security | TLS 1.2+, VPN |
| Integrity Controls | Output validation |

## Security Review Report Template

```markdown
# AI Security Assessment Report

## Executive Summary
- Overall Risk Rating: [Low/Medium/High/Critical]
- Critical Findings: X
- High Findings: Y
- Recommendations: Z

## Scope
- Systems reviewed: [list]
- Date: YYYY-MM-DD
- Assessor: [name]

## Findings

### [CRITICAL] Finding Title
- **Description**: What was found
- **Risk**: Impact and likelihood
- **Recommendation**: How to fix
- **Reference**: CIS/NIST/OWASP reference

### [HIGH] Finding Title
...

## Remediation Plan
| Finding | Priority | Owner | Due Date |
|---------|----------|-------|----------|
| | | | |

## Next Steps
1. Address critical findings within 7 days
2. Schedule remediation review
3. Plan follow-up assessment
```

## Output Deliverables

After completion, you'll have:
- [ ] Security assessment report
- [ ] Risk rating with justification
- [ ] Prioritized remediation plan
- [ ] Compliance gap analysis (if applicable)
- [ ] Security architecture recommendations

## Reference

- Knowledge: `knowledge-base/oci-genai/DEDICATED-AI-CLUSTERS.md`
- Skill: `skills/enterprise-ai-patterns/SKILL.md`
- Templates: `templates/terraform/*/` (security modules)
