#!/usr/bin/env bash
# ==============================================================================
# ThreatTrace AI — Synthetic Demo Threat Intelligence Seeder
# Ingests realistic threat signals into the running ThreatTrace backend.
# ==============================================================================
set -euo pipefail

BACKEND_URL="${BACKEND_URL:-http://localhost:8080}"
ADMIN_USER="${ADMIN_USER:-admin}"
ADMIN_PASS="${ADMIN_PASS:-Admin@ThreatTrace2026!}"

echo "======================================================================"
echo " ThreatTrace AI — Threat Intelligence Ingestion Seeder"
echo " Target Backend: ${BACKEND_URL}"
echo "======================================================================"

echo -n "[*] Authenticating as '${ADMIN_USER}'... "
LOGIN_RESPONSE=$(curl -s -X POST "${BACKEND_URL}/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"${ADMIN_USER}\", \"password\": \"${ADMIN_PASS}\"}")

TOKEN=$(echo "${LOGIN_RESPONSE}" | grep -o '"token":"[^"]*' | cut -d'"' -f4 || true)

if [ -z "${TOKEN}" ]; then
  echo "FAILED!"
  echo "Error response: ${LOGIN_RESPONSE}"
  exit 1
fi
echo "SUCCESS (JWT acquired)"

ingest_threat() {
  local TITLE="$1"
  local SOURCE="$2"
  local SOURCE_REF="$3"
  local CONTENT="$4"
  local LOCATION="$5"

  echo -n "[+] Ingesting: '${TITLE}'... "
  local PAYLOAD
  PAYLOAD=$(cat <<EOF
{
  "title": "${TITLE}",
  "source": "${SOURCE}",
  "sourceReference": "${SOURCE_REF}",
  "rawContent": "${CONTENT}",
  "location": "${LOCATION}"
}
EOF
)

  local RES
  RES=$(curl -s -X POST "${BACKEND_URL}/api/v1/threats/ingest" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${TOKEN}" \
    -d "${PAYLOAD}")

  local THREAT_ID
  THREAT_ID=$(echo "${RES}" | grep -o '"id":"[^"]*' | cut -d'"' -f4 || true)
  local RISK_SCORE
  RISK_SCORE=$(echo "${RES}" | grep -o '"riskScore":[0-9]*' | cut -d':' -f2 || true)

  if [ -n "${THREAT_ID}" ]; then
    echo "INGESTED (ID: ${THREAT_ID:0:8}..., Risk: ${RISK_SCORE:-N/A})"
  else
    echo "RESPONSE: ${RES:0:100}..."
  fi
}

echo ""
echo "--- INGESTING DIVERSE THREAT DOMAIN SIGNALS ---"

ingest_threat \
  "Improvised Explosive Device Warning — Central Railway Terminus" \
  "Dark Web Monitor" \
  "TOR-FORUM-NODE-891" \
  "IED bomb placed in central railway station terminal locker 44. Detonation set for 18:00 UTC today. Evacuate immediately or suffer casualties." \
  "Central Railway Station, New York"

ingest_threat \
  "SCADA Telemetry Disruption & Ransomware Demand — Regional Power Substation" \
  "SIGINT Feed" \
  "CERT-ADVISORY-2026-99" \
  "We have penetrated substation 4 SCADA telemetry controls. Blackout protocol will initiate within 3 hours unless 50 BTC ransom is transferred to wallet bc1qthreat994827." \
  "Substation 4 Grid, Chicago, IL"

ingest_threat \
  "Active Shooter Threat Target — Metropolitan University Campus" \
  "Social Media Scraping" \
  "TELEGRAM-CHAN-SEC404" \
  "Bringing an assault rifle to the university science hall at 14:00 today. Everyone will pay for what they did. Stand back or get eliminated." \
  "Metropolitan University, Boston, MA"

ingest_threat \
  "Aerosolized Biological Agent Dispersal Claim — Airport Terminal 3" \
  "Anonymous Tip Line" \
  "TIP-INTEL-2026-883" \
  "Ricin and weaponized anthrax spores aerosolized through HVAC vent system at Terminal 3 international departure lounge. Fatal dispersion active." \
  "International Airport Terminal 3, Los Angeles, CA"

ingest_threat \
  "Synthetic Deepfake Disinformation Campaign — Election Voting Machines" \
  "OSINT Feed" \
  "TWITTER-ANALYTICS-X4" \
  "Coordinated disinformation cluster deploying AI deepfake audio claiming municipal ballot machines in district 7 have been corrupted and offline." \
  "District 7 Election Center, Philadelphia, PA"

ingest_threat \
  "Routine Infrastructure Fire Suppression Drill — Municipal Datacenter" \
  "Public Safety Wire" \
  "FDNY-SCHEDULE-2026-04" \
  "Scheduled annual fire alarm, halon suppression testing, and building evacuation exercise at Municipal Datacenter tomorrow morning between 09:00 and 11:00 EST. Benign routine test." \
  "Municipal Datacenter, Brooklyn, NY"

echo ""
echo "======================================================================"
echo " Threat intelligence seed ingestion completed successfully!"
echo " Navigate to the UI or call GET /api/v1/threats to review signals."
echo "======================================================================"
