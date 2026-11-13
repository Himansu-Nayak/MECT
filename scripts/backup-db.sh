#!/usr/bin/env bash
# ==============================================================================
# MECT Automated Database Backup Script
# Target: PostgreSQL Docker container (mect-postgres) or Host PostgreSQL
# Retention: 30 days
# Storage: /var/backups/mect
# ==============================================================================
set -euo pipefail

BACKUP_DIR="/var/backups/mect"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
BACKUP_FILE="${BACKUP_DIR}/mect_db_backup_${TIMESTAMP}.dump"
LOG_FILE="${BACKUP_DIR}/backup.log"
RETENTION_DAYS=30

mkdir -p "${BACKUP_DIR}"
chmod 700 "${BACKUP_DIR}"

log() {
    echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] $*" | tee -a "${LOG_FILE}"
}

log "Starting MECT production database backup..."

# Perform dump via docker exec mect-postgres
if docker ps --format '{{.Names}}' | grep -q '^mect-postgres$'; then
    log "Dumping from Docker container 'mect-postgres'..."
    docker exec mect-postgres pg_dump -U "${DB_USERNAME:-mect_user}" -Fc "${DB_NAME:-mect_db}" > "${BACKUP_FILE}"
elif command -v pg_dump >/dev/null 2>&1; then
    log "Docker container not running, falling back to local pg_dump..."
    sudo -u postgres pg_dump -Fc "${DB_NAME:-mect_db}" > "${BACKUP_FILE}"
else
    log "ERROR: Neither docker mect-postgres nor host pg_dump available!"
    exit 1
fi

chmod 600 "${BACKUP_FILE}"

# Verify backup archive integrity
if command -v pg_restore >/dev/null 2>&1; then
    log "Verifying backup archive structure via pg_restore --list..."
    TOC_COUNT=$(pg_restore --list "${BACKUP_FILE}" | wc -l)
    if [ "${TOC_COUNT}" -lt 50 ]; then
        log "ERROR: Backup archive verification failed! TOC entry count too low (${TOC_COUNT})."
        exit 1
    fi
    log "Backup archive verified successfully (${TOC_COUNT} TOC entries)."
else
    log "pg_restore not found on host, verifying via docker exec..."
    docker exec -i mect-postgres pg_restore --list < "${BACKUP_FILE}" > /dev/null
    log "Backup archive verified successfully in container."
fi

FILE_SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
FILE_HASH=$(sha256sum "${BACKUP_FILE}" | awk '{print $1}')
log "Backup complete: ${BACKUP_FILE} (Size: ${FILE_SIZE}, SHA256: ${FILE_HASH})"

# Prune archives older than RETENTION_DAYS
log "Pruning backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}" -name "mect_db_backup_*.dump" -type f -mtime "+${RETENTION_DAYS}" -delete

log "MECT database backup finished successfully."
