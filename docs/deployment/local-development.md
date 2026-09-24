# ThreatTrace AI — Local Development Guide

## Prerequisites
- Java 21 LTS (e.g. Eclipse Adoptium Temurin 21)
- Python 3.10+ (Python 3.12 / 3.14 tested)
- Node.js 18+ (Node 24 tested) & npm 10+
- Docker & Docker Compose (optional for standalone dev profile)

## Quick Start (Standalone Local Development)

### 1. AI Service
```bash
cd ai-service
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Health check: http://localhost:8000/health

### 2. Core Backend Service
The backend defaults to an embedded in-memory H2 database with pre-seeded demo threat data and schema migrations when run in `dev` profile. If PostgreSQL is running on port 5432, it seamlessly connects to Postgres.

```bash
cd backend
# Using Maven wrapper or mvn:
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
# Or on Windows:
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
```
Backend API will be available at http://localhost:8080/api/v1  
Swagger/OpenAPI UI: http://localhost:8080/swagger-ui.html  
Actuator Health: http://localhost:8080/actuator/health

### 3. Frontend Web Application
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173/ in your browser.

### Default Development Credentials
- **Admin**: `admin@threattrace.io` / `AdminPass123!`
- **Lead Analyst**: `analyst@threattrace.io` / `AnalystPass123!`
- **Investigator**: `investigator@threattrace.io` / `InvestigatorPass123!`
- **Viewer**: `viewer@threattrace.io` / `ViewerPass123!`
