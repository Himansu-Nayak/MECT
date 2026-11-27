import subprocess
import json
import sys

utr_ref = sys.argv[1] if len(sys.argv) > 1 else ""

out = {}

# 3. PostgreSQL Health
out['pg'] = subprocess.run('docker exec mect-postgres-staging pg_isready -U mect_staging_user -d mect_staging_db', shell=True, capture_output=True, text=True).stdout.strip()

# 11. DB check
if utr_ref:
    out['db_claim'] = subprocess.run(f"docker exec mect-postgres-staging psql -U mect_staging_user -d mect_staging_db -c \"SELECT claim_reference, utr_normalized, claimed_amount FROM manual_bank_transfer_claims WHERE utr_normalized = '{utr_ref}';\"", shell=True, capture_output=True, text=True).stdout.strip()
else:
    out['db_claim'] = "NO_UTR_PROVIDED"

# 13. Receipt count
out['receipt_count'] = subprocess.run('docker exec mect-postgres-staging psql -U mect_staging_user -d mect_staging_db -c "SELECT count(*) FROM receipts;" -t', shell=True, capture_output=True, text=True).stdout.strip()

# 14. Mock logs
logs = subprocess.run('docker logs --tail 100 mect-backend-staging', shell=True, capture_output=True, text=True).stdout.strip()
out['sms_mock'] = '[MOCK]' in logs and 'SMS OTP' in logs
out['email_mock'] = '[MOCK]' in logs and ('Email' in logs or 'DISPATCHED' in logs)

# 15. Production MECT
out['prod_web'] = subprocess.run("curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3001", shell=True, capture_output=True, text=True).stdout.strip()
out['prod_api'] = subprocess.run("curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8081/api/v1/actuator/health", shell=True, capture_output=True, text=True).stdout.strip()

# 16. OHO Tech
out['oho_web'] = subprocess.run("curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000", shell=True, capture_output=True, text=True).stdout.strip()

print(json.dumps(out))
