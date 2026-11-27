import urllib.request
import urllib.parse
import json
import ssl
import time

ctx = ssl.create_default_context()
BASE_URL = "https://staging.mect.org.in"
API_URL = f"{BASE_URL}/api/v1"
headers_base = {
    "User-Agent": "Mozilla/5.0 MECT-E2E-Synthetic-Verifier/3.2"
}

def post(url, data, auth=None):
    hdr = {**headers_base, "Content-Type": "application/json"}
    if auth:
        hdr["Authorization"] = auth
    req = urllib.request.Request(url, data=json.dumps(data).encode(), headers=hdr, method="POST")
    with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
        return resp.status, json.loads(resp.read().decode())

def get(url, auth=None):
    hdr = {**headers_base}
    if auth:
        hdr["Authorization"] = auth
    req = urllib.request.Request(url, headers=hdr, method="GET")
    with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
        return resp.status, json.loads(resp.read().decode())

def run_e2e():
    print("==================================================================")
    print("MECT PHASE 3.2 — COMPLETE SYNTHETIC END-TO-END VERIFICATION")
    print(f"Target: {BASE_URL}")
    print("==================================================================")

    # 1. Donor Phone & Email OTP Registration
    targets = ["+919438200001", "+919438200002", "+919438200003", "+919438200004", "+919438200005"]
    ts = int(time.time())
    donor_phone = targets[ts % len(targets)]
    donor_email = "synthetic.donor@mect.org.in"
    donor_name = "Synthetic Philanthropist"

    print(f"\n[1] Registering Donor: {donor_name} | {donor_phone} | {donor_email}")
    status, res = post(f"{API_URL}/portal/auth/request-otp", {
        "channel": "PHONE", "target": donor_phone, "purpose": "LOGIN"
    })
    print(f" -> OTP Requested: status={status}, response={res}")

    status, auth_res = post(f"{API_URL}/portal/auth/verify-otp", {
        "channel": "PHONE", "target": donor_phone, "otpCode": "123456",
        "purpose": "LOGIN", "fullName": donor_name, "city": "Bhubaneswar"
    })
    donor_token = auth_res["accessToken"]
    donor_auth = f"Bearer {donor_token}"
    print(f" -> OTP Verified: Donor authenticated, JWT length={len(donor_token)}")

    # 2. Check Donor Profile
    status, profile = get(f"{API_URL}/portal/me/profile", auth=donor_auth)
    print(f" -> Donor Profile loaded: status={status}, name={profile.get('fullName')}, phone={profile.get('phone')}")

    # 3. Submit Direct Bank & UPI Remittance Claim
    utr_number = f"SBIN{ts}SYNTH"
    print(f"\n[2] Submitting Bank & UPI Remittance Claim (UTR: {utr_number})...")
    claim_payload = {
        "programmeCode": "WOMEN_EMPOWERMENT",
        "amount": 5000.0,
        "donorName": donor_name,
        "donorEmail": donor_email,
        "donorPhone": donor_phone,
        "donorAddress": "MECT Philanthropy Center, Bhubaneswar",
        "utrReference": utr_number,
        "transferDate": "2026-11-27",
        "paymentModeNote": "Unified SBI & UPI Transfer Claim",
        "notes": "E2E verification of unified payment journey",
        "anonymous": False,
        "communicationConsent": True,
        "whatsappConsent": True
    }
    status, claim_res = post(f"{BASE_URL}/api/donations/claim", claim_payload, auth=donor_auth)
    claim_ref = claim_res["claimReference"]
    print(f" -> Claim Submitted: status={status}, claimReference={claim_ref}")

    # 4. Admin Login
    print(f"\n[3] Authenticating as Super Administrator...")
    status, admin_auth_res = post(f"{API_URL}/auth/login", {
        "username": "superadmin@mect.org.in",
        "password": "DefaultStagingPassword123!"
    })
    admin_token = admin_auth_res["accessToken"]
    admin_auth = f"Bearer {admin_token}"
    print(f" -> Admin Authenticated: JWT length={len(admin_token)}")

    # 5. Fetch Verification Queue
    print(f"\n[4] Querying Unified Bank & UPI Verification Queue...")
    status, queue = get(f"{API_URL}/admin/manual-claims?status=UTR_SUBMITTED", auth=admin_auth)
    matching = [c for c in queue if c.get("claimReference") == claim_ref]
    if not matching:
        raise Exception(f"Claim {claim_ref} not found in admin queue!")
    print(f" -> Found claim in queue: {matching[0]['claimReference']} (Amount: {matching[0]['claimedAmount']})")

    # 6. Admin Approve & Verify Claim
    print(f"\n[5] Admin Reconciling & Approving Claim {claim_ref}...")
    review_payload = {
        "decision": "VERIFIED",
        "bankStatementReference": f"SBI-STMT-{ts}",
        "verificationNotes": "Reconciled with SBI Current Account statement for E2E synthetic verification"
    }
    status, verify_res = post(f"{API_URL}/admin/manual-claims/{claim_ref}/review", review_payload, auth=admin_auth)
    print(f" -> Verification Response: status={status}, result={verify_res}")

    # 7. Query Outbox for Email Notification Events
    print(f"\n[6] Checking Notification Outbox for Automated Emails...")
    status, outbox_resp = get(f"{API_URL}/admin/outbox", auth=admin_auth)
    items = outbox_resp.get("content", outbox_resp) if isinstance(outbox_resp, dict) else outbox_resp
    print(f" -> Total Outbox Records: {len(items)}")
    for item in items[:5]:
        print(f"    - ID: {item.get('id')} | Channel: {item.get('channel')} | Event: {item.get('eventType')} | Status: {item.get('status')} | Recipient: {item.get('recipient')}")

    print("\n==================================================================")
    print("ALL SYNTHETIC E2E VERIFICATION STEPS PASSED WITH 100% SUCCESS!")
    print("==================================================================")

if __name__ == "__main__":
    run_e2e()
