import urllib.request
import urllib.parse
import json
import ssl
import time

ctx = ssl.create_default_context()
BASE_URL = "https://staging.mect.org.in"
API_URL = f"{BASE_URL}/api/v1"
headers_base = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 MECT-Forensic-Audit/3.2"
}

results = []

def probe(name, method, url, data=None, auth_header=None, expected_status=200):
    hdr = {**headers_base}
    if data is not None:
        hdr["Content-Type"] = "application/json"
    if auth_header:
        hdr["Authorization"] = auth_header
    
    req_body = json.dumps(data).encode("utf-8") if data is not None else None
    req = urllib.request.Request(url, data=req_body, headers=hdr, method=method)
    
    start_t = time.time()
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            duration_ms = int((time.time() - start_t) * 1000)
            status = resp.status
            body_text = resp.read().decode("utf-8", errors="ignore")
            matched = (status == expected_status) if isinstance(expected_status, int) else (status in expected_status)
            entry = {
                "name": name, "method": method, "url": url,
                "status": status, "expected": expected_status,
                "matched": matched, "duration_ms": duration_ms,
                "response_preview": body_text[:300], "error": None
            }
            results.append(entry)
            print(f"[{'PASS' if matched else 'FAIL'}] {method:<4} {url} -> {status} (exp {expected_status}) in {duration_ms}ms", flush=True)
            return status, body_text
    except urllib.error.HTTPError as he:
        duration_ms = int((time.time() - start_t) * 1000)
        status = he.code
        err_body = he.read().decode("utf-8", errors="ignore")
        matched = (status == expected_status) if isinstance(expected_status, int) else (status in expected_status)
        entry = {
            "name": name, "method": method, "url": url,
            "status": status, "expected": expected_status,
            "matched": matched, "duration_ms": duration_ms,
            "response_preview": err_body[:300], "error": he.reason
        }
        results.append(entry)
        print(f"[{'PASS' if matched else 'FAIL'}] {method:<4} {url} -> {status} (exp {expected_status}) in {duration_ms}ms: {he.reason} | {err_body[:100]}", flush=True)
        return status, err_body
    except Exception as e:
        duration_ms = int((time.time() - start_t) * 1000)
        entry = {
            "name": name, "method": method, "url": url,
            "status": 0, "expected": expected_status,
            "matched": False, "duration_ms": duration_ms,
            "response_preview": "", "error": str(e)
        }
        results.append(entry)
        print(f"[FAIL] {method:<4} {url} -> EXCEPTION: {e}", flush=True)
        return 0, str(e)

print("==================================================================")
print("MECT PHASE 3.2 — COMPLETE BACKEND MANUAL API FORENSIC AUDIT")
print("Target: https://staging.mect.org.in")
print("==================================================================")

# 1. Public Health & Infrastructure
probe("Health Check", "GET", f"{API_URL}/health", expected_status=200)
probe("Actuator Health", "GET", f"{API_URL}/actuator/health", expected_status=200)

# 2. Public Donation Endpoints
probe("Donation Config", "GET", f"{API_URL}/public/donations/config", expected_status=200)
probe("Donation Programmes", "GET", f"{API_URL}/public/donations/programmes", expected_status=200)
probe("Gateway Status", "GET", f"{API_URL}/public/donations/gateway-status", expected_status=200)

# 3. Public Documents & CMS
probe("Public Documents List", "GET", f"{API_URL}/public/documents", expected_status=200)
probe("Public CMS Page (About)", "GET", f"{API_URL}/public/cms/pages/about", expected_status=[200, 404])

# 4. Public Inquiries & Volunteers
probe("Public Inquiry Submission", "POST", f"{API_URL}/public/inquiries",
      data={"fullName": "Forensic Auditor", "email": "synthetic.donor@mect.org.in", "phone": "+919438200001", "category": "General", "message": "Forensic test inquiry verification"},
      expected_status=201)

probe("Public Volunteer Registration", "POST", f"{API_URL}/public/volunteers",
      data={
          "fullName": "Volunteer Auditor",
          "email": "synthetic.donor@mect.org.in",
          "phone": "+919438200001",
          "roleInterest": "Education",
          "availability": "Weekends",
          "consentDeclared": True,
          "consentVersion": "v1.0"
      },
      expected_status=201)

# 5. Donor Authentication Flow
probe("Donor OTP Request (Phone)", "POST", f"{API_URL}/portal/auth/request-otp",
      data={"channel": "PHONE", "target": "+919438200001", "purpose": "LOGIN"},
      expected_status=200)

status, v_body = probe("Donor OTP Verify (Phone)", "POST", f"{API_URL}/portal/auth/verify-otp",
      data={"channel": "PHONE", "target": "+919438200001", "otpCode": "123456", "purpose": "LOGIN", "fullName": "Audit Donor", "city": "Bhubaneswar"},
      expected_status=200)

donor_jwt = None
if status == 200:
    try:
        donor_jwt = json.loads(v_body).get("accessToken")
    except: pass

donor_auth_hdr = f"Bearer {donor_jwt}" if donor_jwt else None

# 6. Authenticated Donor Portal Endpoints
if donor_auth_hdr:
    probe("Donor Dashboard Profile", "GET", f"{API_URL}/portal/me/dashboard", auth_header=donor_auth_hdr, expected_status=200)
    probe("Donor Profile", "GET", f"{API_URL}/portal/me/profile", auth_header=donor_auth_hdr, expected_status=200)

# 7. Donation Submission & Cashfree Order
if donor_auth_hdr:
    utr_test = f"SBIN{int(time.time())}"
    status, claim_body = probe("Submit SBI UTR Claim", "POST", f"{API_URL}/public/donations/sbi/submit-utr",
          data={
              "programmeCode": "WOMEN_EMPOWERMENT",
              "amount": 2500.0,
              "donorName": "Audit Donor",
              "donorEmail": "synthetic.donor@mect.org.in",
              "donorPhone": "+919438200001",
              "donorAddress": "Bhubaneswar",
              "utrReference": utr_test,
              "transferDate": "2026-11-27",
              "paymentModeNote": "SBI Direct",
              "anonymous": False,
              "communicationConsent": True,
              "whatsappConsent": False
          },
          auth_header=donor_auth_hdr,
          expected_status=201)

# Cashfree Order Creation (503 expected in staging when Cashfree sandbox keys are not configured, 201 if configured)
probe("Cashfree Create Order", "POST", f"{API_URL}/payments/cashfree/create-order",
      data={
          "programmeCode": "WOMEN_EMPOWERMENT",
          "amount": 1000.0,
          "donorName": "Audit Donor",
          "donorEmail": "synthetic.donor@mect.org.in",
          "donorPhone": "+919438200001",
          "paymentMethod": "GATEWAY_CHECKOUT",
          "anonymous": False,
          "communicationConsent": True,
          "whatsappConsent": False
      },
      auth_header=donor_auth_hdr,
      expected_status=[201, 503])

# 8. Administrative Authentication & Admin Endpoints
admin_login_status, a_body = probe("Admin Login Gateway", "POST", f"{API_URL}/auth/login",
      data={"username": "superadmin@mect.org.in", "password": "DefaultStagingPassword123!"},
      expected_status=200)

admin_jwt = None
if admin_login_status == 200:
    try:
        admin_jwt = json.loads(a_body).get("accessToken")
    except: pass

admin_auth_hdr = f"Bearer {admin_jwt}" if admin_jwt else None

if admin_auth_hdr:
    probe("Admin Dashboard Stats", "GET", f"{API_URL}/admin/dashboard/stats", auth_header=admin_auth_hdr, expected_status=200)
    probe("Admin Donations Summary", "GET", f"{API_URL}/admin/donations/summary", auth_header=admin_auth_hdr, expected_status=200)
    probe("Admin Manual Claims Queue", "GET", f"{API_URL}/admin/manual-claims", auth_header=admin_auth_hdr, expected_status=200)
    probe("Admin Payment Config", "GET", f"{API_URL}/admin/payment-config", auth_header=admin_auth_hdr, expected_status=200)
    probe("Admin Programmes", "GET", f"{API_URL}/admin/programmes", auth_header=admin_auth_hdr, expected_status=200)
    probe("Admin Outbox", "GET", f"{API_URL}/admin/outbox", auth_header=admin_auth_hdr, expected_status=200)
    probe("Admin WhatsApp Status", "GET", f"{API_URL}/admin/whatsapp/status", auth_header=admin_auth_hdr, expected_status=200)

# 9. Next.js Route Handlers on Frontend
probe("Next.js AI Health", "GET", f"{BASE_URL}/api/ai/health", expected_status=200)
probe("Next.js Contact Route Handler", "POST", f"{BASE_URL}/api/contact",
      data={"fullName": "Contact Form Tester", "email": "test@mect.org.in", "phone": "9438200001", "category": "General", "message": "Testing Next.js contact route handler forward to backend"},
      expected_status=[200, 201])

probe("Next.js Donation Claim Route Handler", "POST", f"{BASE_URL}/api/donations/claim",
      data={
          "donorName": "Claim Tester", "donorEmail": "synthetic.donor@mect.org.in", "donorPhone": "+919438200001",
          "amount": 1000, "utrReference": f"SBIN{int(time.time())}X", "programmeCode": "WOMEN_EMPOWERMENT",
          "transferDate": "2026-11-27", "notes": "Testing claim route",
          "anonymous": False, "communicationConsent": True, "whatsappConsent": False
      },
      auth_header=donor_auth_hdr,
      expected_status=[200, 201])

print("\n=== SUMMARY ===")
pass_count = sum(1 for r in results if r["matched"])
fail_count = sum(1 for r in results if not r["matched"])
print(f"Total Probed: {len(results)} | Passed: {pass_count} | Failed: {fail_count}")

with open("docs/audits/endpoint_forensic_results.json", "w") as f:
    json.dump(results, f, indent=2)
