.PHONY: all build test run clean docker-up docker-down dev-infra seed health backup

all: build

build:
	@echo "Building ThreatTrace AI System..."
	cd backend && ./mvnw clean package -DskipTests
	cd ai-service && pip install -r requirements.txt
	cd frontend && npm install && npm run build

test:
	@echo "Running All Test Suites..."
	cd backend && ./mvnw test
	cd ai-service && pytest tests -v
	cd frontend && npm run build

docker-up:
	docker compose up -d --build

docker-down:
	docker compose down -v

dev-infra:
	docker compose -f docker-compose.dev.yml up -d

seed:
	@bash scripts/seed-demo-data.sh

health:
	@bash scripts/health-check.sh

backup:
	@bash scripts/backup-db.sh

clean:
	cd backend && ./mvnw clean
	rm -rf frontend/dist
