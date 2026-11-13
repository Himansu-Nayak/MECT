#!/usr/bin/env bash
set -euo pipefail

echo "=== DATABASE IDENTITY ==="
docker exec mect-postgres psql -U mect_user -d mect_db -c "SELECT current_database(), current_user, inet_server_addr(), inet_server_port(), version();"

echo "=== DONATIONS AUDIT ==="
docker exec mect-postgres psql -U mect_user -d mect_db -c "
SELECT 
    id, 
    donation_reference, 
    programme_id, 
    amount, 
    currency, 
    frequency, 
    donor_name, 
    donor_email, 
    status, 
    payment_method, 
    confirmed_at, 
    created_at 
FROM donations 
ORDER BY id ASC;"

echo "=== PAYMENTS AUDIT ==="
docker exec mect-postgres psql -U mect_user -d mect_db -c "
SELECT 
    id, 
    donation_id, 
    provider, 
    provider_order_id, 
    provider_payment_id, 
    amount, 
    currency, 
    status, 
    verified_signature_present, 
    created_at 
FROM payments 
ORDER BY id ASC;"

echo "=== RECEIPTS AUDIT ==="
docker exec mect-postgres psql -U mect_user -d mect_db -c "
SELECT 
    id, 
    receipt_number, 
    donation_id, 
    donor_display_name, 
    programme_name, 
    amount, 
    currency, 
    receipt_type, 
    pdf_sha256, 
    octet_length(pdf_bytes) as pdf_size_bytes, 
    issued_at 
FROM donation_receipts 
ORDER BY id ASC;"

echo "=== MANUAL BANK CLAIMS AUDIT ==="
docker exec mect-postgres psql -U mect_user -d mect_db -c "
SELECT 
    id, 
    claim_reference, 
    donation_id, 
    utr_number, 
    utr_normalized, 
    claimed_amount, 
    status, 
    remitter_name, 
    transfer_date, 
    created_at 
FROM manual_bank_transfer_claims 
ORDER BY id ASC;"

echo "=== PORTAL USERS AUDIT ==="
docker exec mect-postgres psql -U mect_user -d mect_db -c "
SELECT 
    id, 
    user_uuid, 
    primary_email, 
    primary_phone, 
    status, 
    profile_completed, 
    created_at 
FROM portal_users 
ORDER BY id ASC;"

echo "=== PROGRAMMES AUDIT ==="
docker exec mect-postgres psql -U mect_user -d mect_db -c "
SELECT 
    id, 
    code, 
    name, 
    is_general_fund, 
    is_active, 
    display_order 
FROM donation_programmes 
ORDER BY id ASC;"

