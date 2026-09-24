# ThreatTrace AI — Security & Governance Architecture

## 1. Zero Trust Principles in Threat Intelligence
ThreatTrace AI operates under strict defensibility and security principles:
1. **Least Privilege Role-Based Access Control (RBAC)**: Enforced via declarative security annotations (`@PreAuthorize`) at the service and controller boundary.
2. **Deterministic Immutability**: Historical threat submissions and audit logs cannot be modified once stored.
3. **No Autonomous Offensive Action**: ThreatTrace does not engage in retaliatory cyber actions, port scanning, exploitation, automated takedowns, or autonomous police routing. It is strictly an analytical decision-support and investigation system.

## 2. Authentication & Authorization Matrix

| Endpoint | Permitted Roles | Description |
|---|---|---|
| `POST /api/v1/auth/login` | Unauthenticated | Exchange credentials for JWT access/refresh tokens |
| `POST /api/v1/auth/register` | Unauthenticated | Self-registration (default assigned role: `ANALYST`) |
| `GET /api/v1/threats/**` | `VIEWER`, `ANALYST`, `INVESTIGATOR`, `ADMIN` | Read threats, timeline, and AI analysis results |
| `POST /api/v1/threats` | `ANALYST`, `INVESTIGATOR`, `ADMIN` | Ingest new threat reports |
| `POST /api/v1/threats/*/reanalyze` | `ANALYST`, `INVESTIGATOR`, `ADMIN` | Re-run AI analysis pipeline |
| `GET /api/v1/investigations/**` | `INVESTIGATOR`, `ADMIN` | Access investigation cases and evidence |
| `POST /api/v1/investigations/**` | `INVESTIGATOR`, `ADMIN` | Create, escalate, or update investigation cases |
| `POST /api/v1/alerts/*/acknowledge`| `ANALYST`, `INVESTIGATOR`, `ADMIN` | Acknowledge active threat alerts |
| `GET /api/v1/audit/**` | `ADMIN` | Inspect tamper-evident audit logs |
| `GET /api/v1/users/**` | `ADMIN` | Manage user access and roles |

## 3. Cryptographic Storage & Transmission
- Passwords are salted and hashed using BCrypt with work factor 12.
- JWT tokens are signed using HMAC-SHA256 (`HS256`) with a cryptographically secure 256-bit+ secret key.
- TLS 1.3 encryption is mandated for all ingress and microservice inter-service communication.
- Internal AI service requests require an internal service authentication key in header `X-ThreatTrace-Internal-Key`.
