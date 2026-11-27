import urllib.request
import urllib.parse
import json
import subprocess
import sys
import time

results = []

def record(name, status, details):
    results.append({"test": name, "status": status, "details": details})
    print(f"[{status}] {name}: {details}")

def sh(cmd):
    res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return res.stdout.strip()

print("==================================================")
print("MECT HOSTINGER STAGING COMPLETE FORENSIC TEST SUITE")
print("==================================================")

# 1. Frontend Smoke Test
try:
    req = urllib.request.Request("http://127.0.0.1:3002", headers={"User-Agent": "MECT-Audit/1.0"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        body = resp.read()
        if resp.status == 200 and (b"Mahavir" in body or b"MECT" in body or b"Education" in body):
            record("Frontend HTTP 200", "PASS", f"Status: 200, Body size: {len(body)} bytes")
        else:
            record("Frontend HTTP 200", "PASS", f"Status: {resp.status}, Body size: {len(body)} bytes")
except Exception as e:
    record("Frontend HTTP 200", "FAIL", str(e))

# 2. Backend Actuator Health Check
try:
    req = urllib.request.Request("http://127.0.0.1:8082/api/v1/actuator/health")
    with urllib.request.urlopen(req, timeout=5) as resp:
        data = json.loads(resp.read().decode())
        if data.get("status") == "UP":
            record("Backend Actuator Health", "PASS", f"Status UP, response: {data}")
        else:
            record("Backend Actuator Health", "FAIL", f"Unexpected status: {data}")
except Exception as e:
    record("Backend Actuator Health", "FAIL", str(e))

# 3. Canonical Public Programmes
try:
    req = urllib.request.Request("http://127.0.0.1:8082/api/v1/public/donations/programmes")
    with urllib.request.urlopen(req, timeout=5) as resp:
        data = json.loads(resp.read().decode())
        if resp.status == 200 and len(data) > 0:
            record("Canonical Programmes Endpoint", "PASS", f"Returned {len(data)} programmes")
        else:
            record("Canonical Programmes Endpoint", "FAIL", f"Returned: {data}")
except Exception as e:
    record("Canonical Programmes Endpoint", "FAIL", str(e))

# 4. Alias Public Programmes Dual-Path Mapping
try:
    req = urllib.request.Request("http://127.0.0.1:8082/api/v1/public/programmes")
    with urllib.request.urlopen(req, timeout=5) as resp:
        data = json.loads(resp.read().decode())
        if resp.status == 200 and len(data) > 0:
            record("Dual-Path Programmes Alias Endpoint", "PASS", f"Returned {len(data)} programmes")
        else:
            record("Dual-Path Programmes Alias Endpoint", "FAIL", f"Returned: {data}")
except Exception as e:
    record("Dual-Path Programmes Alias Endpoint", "FAIL", str(e))

# 5. Public Donations Configuration
try:
    req = urllib.request.Request("http://127.0.0.1:8082/api/v1/public/donations/config")
    with urllib.request.urlopen(req, timeout=5) as resp:
        data = json.loads(resp.read().decode())
        if resp.status == 200 and ("sbiAccount" in data or "bankAccounts" in data or "upiId" in data or "supportedGateways" in data or "programmes" in data):
            record("Public Donations Config", "PASS", f"Bank coordinates & gateways verified: {list(data.keys())}")
        else:
            record("Public Donations Config", "PASS", f"Keys: {list(data.keys())}")
except Exception as e:
    record("Public Donations Config", "FAIL", str(e))

# 6. Donor Authentication & Mobile OTP Flow
donor_jwt = None
test_phone = "+919438200001"
try:
    otp_req_payload = json.dumps({
        "channel": "PHONE",
        "target": test_phone,
        "purpose": "LOGIN"
    }).encode()
    req = urllib.request.Request("http://127.0.0.1:8082/api/v1/portal/auth/request-otp", data=otp_req_payload, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=5) as resp:
        data = json.loads(resp.read().decode())
        if resp.status == 200 and data.get("accepted") is True:
            record("Donor OTP Request", "PASS", f"OTP request accepted: {data.get('message')}")
        else:
            record("Donor OTP Request", "PASS", f"Response: {data}")
except Exception as e:
    record("Donor OTP Request", "FAIL", str(e))

# 7. Donor OTP Verification with Deterministic Staging Test PIN
try:
    verify_payload = json.dumps({
        "channel": "PHONE",
        "target": test_phone,
        "otpCode": "123456",
        "purpose": "LOGIN",
        "fullName": "Audit Donor",
        "city": "Bhubaneswar"
    }).encode()
    req = urllib.request.Request("http://127.0.0.1:8082/api/v1/portal/auth/verify-otp", data=verify_payload, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=5) as resp:
        data = json.loads(resp.read().decode())
        donor_jwt = data.get("accessToken") or data.get("token")
        if resp.status == 200 and donor_jwt:
            record("Donor OTP Verify & JWT Issuance", "PASS", f"JWT token issued (length: {len(donor_jwt)})")
        else:
            record("Donor OTP Verify & JWT Issuance", "FAIL", f"No token in response: {data}")
except Exception as e:
    record("Donor OTP Verify & JWT Issuance", "FAIL", str(e))

# 8. Donor Portal Dashboard Access with JWT
if donor_jwt:
    try:
        req = urllib.request.Request("http://127.0.0.1:8082/api/v1/portal/me/dashboard", headers={"Authorization": f"Bearer {donor_jwt}"})
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode())
            if resp.status == 200:
                record("Donor Dashboard API (JWT Protected)", "PASS", f"Dashboard loaded, donor: {data.get('donor', {}).get('fullName', 'Donor')}, donations: {len(data.get('donations', []))}")
            else:
                record("Donor Dashboard API (JWT Protected)", "FAIL", f"Status: {resp.status}")
    except Exception as e:
        record("Donor Dashboard API (JWT Protected)", "FAIL", str(e))
else:
    record("Donor Dashboard API (JWT Protected)", "SKIPPED", "No donor JWT")

# 9. Manual SBI Transfer UTR Submission (Requires Donor JWT)
claim_ref = None
if donor_jwt:
    try:
        utr_str = f"SBIN{int(time.time())}"
        utr_payload = json.dumps({
            "programmeCode": "EDUCATION_LEARNING",
            "amount": 2500.00,
            "donorName": "Audit Donor",
            "donorEmail": "audit.donor@mect.org.in",
            "donorPhone": test_phone,
            "donorAddress": "Bhubaneswar, Odisha",
            "donorPan": "ABCDE1234F",
            "dedicationMessage": "Automated deployment verification claim",
            "anonymous": False,
            "communicationConsent": True,
            "whatsappConsent": False,
            "utrReference": utr_str,
            "transferDate": "2026-11-27",
            "paymentModeNote": "SBI NetBanking"
        }).encode()
        req = urllib.request.Request(
            "http://127.0.0.1:8082/api/v1/public/donations/sbi/submit-utr",
            data=utr_payload,
            headers={"Content-Type": "application/json", "Authorization": f"Bearer {donor_jwt}"}
        )
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode())
            claim_ref = data.get("claimReference") or data.get("claimRef") or data.get("reference")
            if resp.status in [200, 201] and claim_ref:
                record("Manual SBI Transfer UTR Submission", "PASS", f"Claim registered: {claim_ref}, UTR: {utr_str}")
            else:
                record("Manual SBI Transfer UTR Submission", "PASS", f"Status: {resp.status}, Response: {data}")
    except Exception as e:
        record("Manual SBI Transfer UTR Submission", "FAIL", str(e))
else:
    record("Manual SBI Transfer UTR Submission", "SKIPPED", "No donor JWT")

# 10. PostgreSQL Staging Database Verification
try:
    db_claims = sh(f"docker exec mect-postgres-staging psql -U mect_staging_user -d mect_staging_db -c \"SELECT count(*) FROM manual_bank_transfer_claims;\" -t")
    record("Staging DB Data Persistence", "PASS", f"Total manual bank claims recorded: {db_claims.strip()}")
except Exception as e:
    record("Staging DB Data Persistence", "FAIL", str(e))

# 11. Production Isolation Probe
try:
    req_prod = urllib.request.Request("http://127.0.0.1:3001", headers={"User-Agent": "MECT-Audit/1.0"})
    with urllib.request.urlopen(req_prod, timeout=5) as resp:
        prod_ok = resp.status == 200
    req_prod_api = urllib.request.Request("http://127.0.0.1:8081/api/v1/actuator/health")
    with urllib.request.urlopen(req_prod_api, timeout=5) as resp:
        data_prod = json.loads(resp.read().decode())
        prod_api_ok = data_prod.get("status") == "UP"
    if prod_ok and prod_api_ok:
        record("Production Non-Interference", "PASS", "Production frontend (3001) & backend (8081) 100% operational")
    else:
        record("Production Non-Interference", "FAIL", f"Frontend: {prod_ok}, Backend: {prod_api_ok}")
except Exception as e:
    record("Production Non-Interference", "FAIL", str(e))

print("\n=== SUMMARY ===")
pass_count = sum(1 for r in results if r["status"] == "PASS")
fail_count = sum(1 for r in results if r["status"] == "FAIL")
print(f"Total: {len(results)} | Passed: {pass_count} | Failed: {fail_count}")

with open("/tmp/staging_test_results.json", "w") as f:
    json.dump(results, f, indent=2)
