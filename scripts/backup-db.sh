#!/usr/bin/env bash
# ==============================================================================
# ThreatTrace AI — PostgreSQL Backup Script
# Performs timestamped pg_dump with gzip compression and retention pruning.
# ==============================================================================
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-./backups}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-threattrace}"
DB_USER="${DB_USER:-threattrace_user}"
RETENTION_DAYS="${RETENTION_DAYS:-7}"

mkdir -p "${BACKUP_DIR}"

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/threattrace_backup_${TIMESTAMP}.sql.gz"

echo "======================================================================"
echo " ThreatTrace AI — PostgreSQL Database Backup"
echo " Host: ${DB_HOST}:${DB_PORT} | Database: ${DB_NAME} | User: ${DB_USER}"
echo " Destination: ${BACKUP_FILE}"
echo "======================================================================"

if command -v pg_dump >/dev/null 2>&1; then
  echo -n "[*] Running pg_dump... "
  PGPASSWORD="${DB_PASSWORD:-threattrace_secure_pass_2026}" pg_dump \
    -h "${DB_HOST}" \
    -p "${DB_PORT}" \
    -U "${DB_USER}" \
    -d "${DB_NAME}" \
    --format=plain \
    --no-owner \
    --no-privileges | gzip > "${BACKUP_FILE}"
  echo "DONE ($(du -h "${BACKUP_FILE}" | cut -f1))"
elif docker ps | grep -q "threattrace-db"; then
  echo -n "[*] Running pg_dump via docker container 'threattrace-db'... "
  docker exec -t threattrace-db pg_dump -U "${DB_USER}" -d "${DB_NAME}" | gzip > "${BACKUP_FILE}"
  echo "DONE ($(du -h "${BACKUP_FILE}" | cut -f1))"
else
  echo "[!] Error: Neither local pg_dump nor running 'threattrace-db' container was found."
  exit 1
fi

echo -n "[*] Pruning backups older than ${RETENTION_DAYS} days... "
find "${BACKUP_DIR}" -name "threattrace_backup_*.sql.gz" -type f -mtime +"${RETENTION_DAYS}" -delete
echo "DONE"

echo "======================================================================"
echo " Backup completed successfully: ${BACKUP_FILE}"
echo "======================================================================"
