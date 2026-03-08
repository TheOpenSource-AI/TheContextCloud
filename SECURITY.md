# Security Policy

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| 1.x     | ✅ Active support  |
| < 1.0   | ❌ Not supported   |

## Reporting a Vulnerability

**Do NOT open a public issue for security vulnerabilities.**

Instead, please report security issues by emailing:

📧 **security@contextcloud.dev**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact assessment
- Suggested fix (if any)

### Response Timeline

| Stage | Timeline |
|-------|----------|
| Acknowledgment | Within 48 hours |
| Initial Assessment | Within 5 business days |
| Fix & Disclosure | Within 30 days (coordinated) |

## Security Best Practices

When contributing or deploying Context Cloud:

- **Never** commit secrets, API keys, or credentials
- **Always** use environment variables for sensitive configuration
- **Rotate** the `JWT_SECRET` in production
- **Enable** TLS for all database and Redis connections in production
- **Review** the `dataClassification` field on all entity payloads
- **Audit** PII handling — ensure `piiMasked` flags are set correctly

## Enterprise Security

Context Cloud Enterprise includes additional security features:
- SSO / SAML integration
- Role-based access control (RBAC)
- Audit logging with tamper-proof storage
- SOC 2 Type II compliance tooling

Contact us for enterprise security requirements.
