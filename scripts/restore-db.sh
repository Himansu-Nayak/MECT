#!/usr/bin/env bash
# ==============================================================================
# MECT Database Restore Script
# Target: PostgreSQL Docker container (mect-postgres)
# Safety: Requires explicit path to valid .dump archive and confirmation
# ==============================================================================
set -euo pipefail

if [ $# -lt 1 ]; then
    echo "Usage: $0 <path-to-backup.dump> [--force]"
    exit 1
fi

BACKUP_FILE="$1"
FORCE="${2:-}"

if [ ! -f "${BACKUP_FILE}" ]; then
    echo "ERROR: Backup file '${BACKUP_FILE}' does not exist!"
    exit 1
fi

echo "=== MECT DATABASE RESTORE TARGET: mect-postgres ==="
echo "Target container: mect-postgres"
echo "Database: mect_db"
echo "Archive: ${BACKUP_FILE}"
echo "Archive size: $(du -h "${BACKUP_FILE}" | cut -f1)"

# Integrity preflight
echo "Verifying archive integrity before restore..."
if command -v pg_restore >/dev/null 2>&1; then
    pg_restore --list "${BACKUP_FILE}" > /dev/null
else
    docker exec -i mect-postgres pg_restore --list < "${BACKUP_FILE}" > /dev/null
fi
echo "Archive integrity verified (valid PostgreSQL custom format)."

if [ "${FORCE}" != "--force" ]; then
    read -rp "Are you SURE you want to restore to mect-postgres? This will overwrite existing data. (Type 'RESTORE' to continue): " CONFIRM
    if [ "${CONFIRM}" != "RESTORE" ]; then
        echo "Restore aborted by user."
        exit 0
    fi
fi

echo "Stopping backend container to terminate active connections..."
docker compose -f /opt/mect/compose.production.yaml stop mect-backend || true

echo "Restoring database archive into container mect-postgres..."
docker exec -i mect-postgres pg_restore \
    -U "${DB_USERNAME:-mect_user}" \
    -d "${DB_NAME:-mect_db}" \
    --clean --if-exists --no-owner --no-privileges < "${BACKUP_FILE}"

echo "Restarting backend container..."
docker compose -f /opt/mect/compose.production.yaml start mect-backend

echo "Restore complete! Verifying backend health..."
sleep 10
curl -f http://127.0.0.1:8081/api/v1/actuator/health || echo "Backend still initializing, please check logs."
