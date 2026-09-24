# ThreatTrace AI — Production Deployment Guide

## 1. Production Architecture Overview
In production, ThreatTrace AI runs in a hardened container topology behind a reverse proxy (e.g. Nginx or AWS ALB / Cloudflare).

- **Frontend Container**: Nginx Alpine serving optimized static React/Vite assets with HTTP/2 and gzip compression.
- **Backend Container**: Spring Boot running on Eclipse Temurin 21 JRE, stateless with clustered sessions / JWT verification.
- **AI Service Container**: FastAPI with Uvicorn worker threads, optimized inference batching.
- **Database**: Managed PostgreSQL (AWS RDS / GCP Cloud SQL / self-hosted cluster) with automated snapshots.
- **Cache/Broker**: RabbitMQ / Redis for asynchronous batch processing.

## 2. Environment Hardening Checklist
- [ ] Set `DEMO_MODE=false` in environment variables.
- [ ] Generate a secure 512-bit JWT Secret: `openssl rand -hex 64`.
- [ ] Enforce HTTPS / TLS 1.3 exclusively.
- [ ] Configure PostgreSQL with SSL mode `verify-full`.
- [ ] Configure Rate Limiting on `/api/v1/auth/login` to prevent credential stuffing.
- [ ] Ensure Docker containers run as non-root unprivileged users.
- [ ] Configure log aggregation (e.g. ELK, Datadog, Prometheus + Grafana).

## 3. Docker Compose Production Launch
```bash
cp .env.example .env
# Edit .env with production passwords and secrets
docker compose up -d --build
```
Verify container health:
```bash
docker compose ps
docker compose logs -f backend
```
