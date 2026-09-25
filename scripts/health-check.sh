#!/usr/bin/env bash
# ==============================================================================
# ThreatTrace AI — Platform Health & Readiness Check
# ==============================================================================
set -euo pipefail

BACKEND_URL="${BACKEND_URL:-http://localhost:8080}"
AI_URL="${AI_URL:-http://localhost:8000}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:5173}"

echo "======================================================================"
echo " ThreatTrace AI — Service Health Verification"
echo "======================================================================"

EXIT_CODE=0

# 1. AI Microservice Check
echo -n "[1/3] Checking AI Microservice (${AI_URL}/health)... "
AI_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${AI_URL}/health" || echo "UNREACHABLE")
if [ "${AI_STATUS}" = "200" ]; then
  AI_BODY=$(curl -s "${AI_URL}/health")
  echo "ONLINE (200 OK) -> ${AI_BODY}"
else
  echo "OFFLINE or ERROR (HTTP ${AI_STATUS})"
  EXIT_CODE=1
fi

# 2. Backend Spring Boot Health Check
echo -n "[2/3] Checking Backend Spring Boot (${BACKEND_URL}/actuator/health)... "
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${BACKEND_URL}/actuator/health" || echo "UNREACHABLE")
if [ "${BACKEND_STATUS}" = "200" ]; then
  BACKEND_BODY=$(curl -s "${BACKEND_URL}/actuator/health")
  echo "ONLINE (200 OK) -> ${BACKEND_BODY}"
else
  # Fallback to checking an auth endpoint
  AUTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "${BACKEND_URL}/api/v1/auth/login" \
    -H "Content-Type: application/json" -d "{}" || echo "UNREACHABLE")
  if [ "${AUTH_STATUS}" = "400" ] || [ "${AUTH_STATUS}" = "401" ]; then
    echo "ONLINE (Core API reachable, HTTP ${AUTH_STATUS})"
  else
    echo "OFFLINE or ERROR (HTTP ${BACKEND_STATUS})"
    EXIT_CODE=1
  fi
fi

# 3. Frontend Web Client Check
echo -n "[3/3] Checking Frontend UI (${FRONTEND_URL})... "
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${FRONTEND_URL}" || echo "UNREACHABLE")
if [ "${FRONTEND_STATUS}" = "200" ]; then
  echo "ONLINE (200 OK)"
else
  echo "WARNING (HTTP ${FRONTEND_STATUS} - may be starting or not yet spawned)"
fi

echo "======================================================================"
if [ ${EXIT_CODE} -eq 0 ]; then
  echo "All primary ThreatTrace services are healthy and operational!"
else
  echo "One or more core services failed health verification."
fi
echo "======================================================================"

exit ${EXIT_CODE}
