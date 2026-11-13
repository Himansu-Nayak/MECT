#!/usr/bin/env bash
set -euo pipefail

echo "=== ISOLATED SYNTHETIC DOCUMENT RESTORE DRILL ==="

TEST_DB_SRC="mect_synthetic_doc_src"
TEST_DB_DST="mect_synthetic_doc_dst"
DUMP_FILE="/tmp/synthetic_doc_backup.dump"
SAMPLE_TEXT="MECT-SYNTHETIC-DOCUMENT-PAYLOAD-FOR-RESTORE-TEST-$(date +%s)"
SAMPLE_SHA256=$(echo -n "${SAMPLE_TEXT}" | sha256sum | awk '{print $1}')

echo "1. Creating isolated source test database: ${TEST_DB_SRC}"
docker exec mect-postgres psql -U mect_user -d postgres -c "CREATE DATABASE ${TEST_DB_SRC};"

echo "2. Creating synthetic documents table and inserting payload..."
docker exec mect-postgres psql -U mect_user -d "${TEST_DB_SRC}" -c "
CREATE TABLE synthetic_docs (
    id SERIAL PRIMARY KEY,
    doc_name VARCHAR(100),
    sha256 VARCHAR(64),
    payload BYTEA,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO synthetic_docs (doc_name, sha256, payload) 
VALUES ('sample_receipt.pdf', '${SAMPLE_SHA256}', decode('$(echo -n "${SAMPLE_TEXT}" | xxd -p | tr -d '\n')', 'hex'));
"

echo "3. Creating isolated pg_dump of ${TEST_DB_SRC}..."
docker exec mect-postgres pg_dump -U mect_user -Fc "${TEST_DB_SRC}" > "${DUMP_FILE}"
ls -lh "${DUMP_FILE}"

echo "4. Creating isolated destination test database: ${TEST_DB_DST}"
docker exec mect-postgres psql -U mect_user -d postgres -c "CREATE DATABASE ${TEST_DB_DST};"

echo "5. Restoring into ${TEST_DB_DST}..."
docker exec -i mect-postgres pg_restore -U mect_user -d "${TEST_DB_DST}" -v --no-owner --no-acl < "${DUMP_FILE}"

echo "6. Extracting restored document and validating SHA-256..."
RESTORED_HEX=$(docker exec mect-postgres psql -U mect_user -d "${TEST_DB_DST}" -t -A -c "SELECT encode(payload, 'hex') FROM synthetic_docs WHERE doc_name = 'sample_receipt.pdf';")
RESTORED_SHA256=$(echo -n "${RESTORED_HEX}" | xxd -r -p | sha256sum | awk '{print $1}')

echo "Original  SHA256: ${SAMPLE_SHA256}"
echo "Restored  SHA256: ${RESTORED_SHA256}"

if [ "${SAMPLE_SHA256}" = "${RESTORED_SHA256}" ]; then
    echo "SUCCESS: Checksums match 100%! Document bytea restore verified."
else
    echo "FAILURE: Checksums do not match!"
    exit 1
fi

echo "7. Cleaning up isolated test databases and artifacts..."
docker exec mect-postgres psql -U mect_user -d postgres -c "DROP DATABASE ${TEST_DB_SRC};"
docker exec mect-postgres psql -U mect_user -d postgres -c "DROP DATABASE ${TEST_DB_DST};"
rm -f "${DUMP_FILE}"

echo "=== DRILL COMPLETE & CLEANED ==="

