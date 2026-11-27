import urllib.request
import json
import ssl
import time

ctx = ssl.create_default_context()
BASE_URL = "https://mect.org.in"
API_URL = f"{BASE_URL}/api/v1"
headers_base = {
    "User-Agent": "Mozilla/5.0 MECT-Production-Donation-Verifier/3.2",
    "Content-Type": "application/json"
}

def post(url, data):
    req = urllib.request.Request(url, data=json.dumps(data).encode(), headers=headers_base, method="POST")
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
            return resp.status, json.loads(resp.read().decode())
    except urllib.error.HTTPError as he:
        err_body = he.read().decode(errors="ignore")
        return he.code, err_body

def verify_live_donation_system():
    print("==================================================================")
    print("VERIFYING LIVE DONATION & REMITTANCE RESOLUTION ON HTTPS://MECT.ORG.IN")
    print("==================================================================")

    # Test 1: Initiate donation with canonical programme code GENERAL_FUND
    print("\n[Test 1] POST /api/v1/public/donations/initiate with GENERAL_FUND...")
    payload_canonical = {
        "programmeCode": "GENERAL_FUND",
        "amount": 2500.0,
        "donorName": "Live Verification Donor",
        "donorEmail": "donor.live@mect.org.in",
        "donorPhone": "+919438200001",
        "donorPan": "ABCDE1234F",
        "communicationConsent": True,
        "paymentMethod": "GATEWAY_CHECKOUT",
        "notes": "Testing canonical code"
    }
    status, res = post(f"{API_URL}/public/donations/initiate", payload_canonical)
    print(f"Status: {status}")
    print(f"Response: {res}")
    assert status in (200, 201), f"Expected 200/201, got {status}"
    assert "donationReference" in res or "reference" in res or "id" in res, "Missing reference in response"

    # Test 2: Initiate donation with alias code GENERAL (verifying DEF-003 alias mapping)
    print("\n[Test 2] POST /api/v1/public/donations/initiate with alias 'GENERAL'...")
    payload_alias = {
        "programmeCode": "GENERAL",
        "amount": 1000.0,
        "donorName": "Live Alias Donor",
        "donorEmail": "alias.live@mect.org.in",
        "donorPhone": "+919438200002",
        "communicationConsent": True,
        "paymentMethod": "GATEWAY_CHECKOUT"
    }
    status, res = post(f"{API_URL}/public/donations/initiate", payload_alias)
    print(f"Status: {status}")
    print(f"Response: {res}")
    assert status in (200, 201), f"Expected 200/201, got {status}"

    # Test 3: Submit Direct Bank & UPI Remittance Claim via Next.js route (DEF-005)
    print("\n[Test 3] POST /api/donations/claim (Direct SBI/UPI remittance claim)...")
    ts = int(time.time())
    utr_test = f"SBIN{ts}PROD"
    today_utc = time.strftime("%Y-%m-%d", time.gmtime())
    claim_payload = {
        "programmeCode": "GENERAL_FUND",
        "amount": 5000.0,
        "donorName": "DevOps Verification Donor",
        "donorEmail": "donor.utr@mect.org.in",
        "donorPhone": "+919876543210",
        "donorAddress": "Bhubaneswar, Odisha",
        "utrReference": utr_test,
        "transferDate": today_utc,
        "paymentModeNote": "Unified SBI & UPI Transfer Claim",
        "notes": "Live production verification of guest UTR claim submission",
        "anonymous": False,
        "communicationConsent": True,
        "whatsappConsent": True
    }
    status, res = post(f"{BASE_URL}/api/donations/claim", claim_payload)
    print(f"Status: {status}")
    print(f"Response: {res}")
    assert status in (200, 201), f"Expected 200/201, got {status}"
    assert "claimReference" in res, f"Expected claimReference in response, got {res}"
    print(f"Successfully created claimReference: {res['claimReference']}")

    print("\n==================================================================")
    print("ALL LIVE DONATION & REMITTANCE VERIFICATIONS PASSED SUCCESSFULLY!")
    print("==================================================================")

if __name__ == "__main__":
    verify_live_donation_system()
