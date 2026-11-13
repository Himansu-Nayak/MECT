#!/usr/bin/env bash
set -euo pipefail

TS=$(date +%Y%m%d_%H%M%S)
GLOBALS_FILE="/var/backups/mect/mect_globals_${TS}.sql"
docker exec mect-postgres pg_dumpall -U mect_user --globals-only > "${GLOBALS_FILE}"
chmod 600 "${GLOBALS_FILE}"

echo "=== BACKUP DIRECTORY CONTENTS ==="
ls -lh /var/backups/mect

echo "=== LATEST BACKUP CHECKSUMS ==="
sha256sum /var/backups/mect/mect_db_backup_20261113_100627.dump
sha256sum "${GLOBALS_FILE}"

echo "=== TOC OBJECT COUNT ==="
docker exec -i mect-postgres pg_restore --list < /var/backups/mect/mect_db_backup_20261113_100627.dump | wc -l
