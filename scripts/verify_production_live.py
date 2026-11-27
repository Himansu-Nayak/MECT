import urllib.request
import urllib.parse
import json
import ssl
import time

ctx = ssl.create_default_context()
BASE_URL = "https://mect.org.in"
API_URL = f"{BASE_URL}/api/v1"
headers_base = {
    "User-Agent": "Mozilla/5.0 MECT-Production-Live-Verifier/3.2"
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
        with urllib.request.urlopen(req, context=ctx, timeout=12) as resp:
            duration_ms = int((time.time() - start_t) * 1000)
            status = resp.status
            body_text = resp.read().decode("utf-8", errors="ignore")
            matched = (status == expected_status) if isinstance(expected_status, int) else (status in expected_status)
            entry = {
                "name": name, "method": method, "url": url,
                "status": status, "expected": expected_status,
                "matched": matched, "duration_ms": duration_ms,
                "response_preview": body_text[:250]
            }
            results.append(entry)
            print(f"[{'PASS' if matched else 'FAIL'}] {method:<4} {url} -> {status} in {duration_ms}ms", flush=True)
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
            "response_preview": err_body[:250]
        }
        results.append(entry)
        print(f"[{'PASS' if matched else 'FAIL'}] {method:<4} {url} -> {status}: {he.reason} | {err_body[:100]}", flush=True)
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

def run_production_audit():
    print("==================================================================")
    print("MECT PHASE 3.2 — LIVE PRODUCTION ACCEPTANCE AUDIT")
    print(f"Target: {BASE_URL}")
    print("==================================================================")

    # 1. Frontend Homepage & Key Pages
    probe("Production Homepage", "GET", f"{BASE_URL}/", expected_status=200)
    probe("Production Donate Page", "GET", f"{BASE_URL}/donate", expected_status=200)
    probe("Production Contact Page", "GET", f"{BASE_URL}/contact", expected_status=200)
    probe("Production Governance Page", "GET", f"{BASE_URL}/governance", expected_status=200)
    probe("Production Programmes Page", "GET", f"{BASE_URL}/programmes", expected_status=200)

    # 2. Next.js Internal Route Handlers
    probe("Next.js AI Health", "GET", f"{BASE_URL}/api/ai/health", expected_status=200)

    # 3. Spring Boot Backend APIs via /api/v1/
    probe("Production API Health", "GET", f"{API_URL}/health", expected_status=200)
    probe("Production Actuator Health", "GET", f"{API_URL}/actuator/health", expected_status=200)
    probe("Donations Config", "GET", f"{API_URL}/public/donations/config", expected_status=200)
    probe("Donations Programmes", "GET", f"{API_URL}/public/donations/programmes", expected_status=200)
    probe("Gateway Status", "GET", f"{API_URL}/public/donations/gateway-status", expected_status=200)
    probe("Public Documents", "GET", f"{API_URL}/public/documents", expected_status=200)

    # 4. Next.js Contact Form Forwarding to Spring Boot
    probe("Next.js Contact Route Forwarding", "POST", f"{BASE_URL}/api/contact",
          data={"fullName": "Live Audit Visitor", "email": "audit.visitor@mect.org.in", "phone": "9438200001", "category": "General", "message": "Live production verification inquiry"},
          expected_status=[200, 201])

    # Summary
    print("\n=== LIVE PRODUCTION AUDIT SUMMARY ===")
    passed = sum(1 for r in results if r["matched"])
    failed = sum(1 for r in results if not r["matched"])
    print(f"Total: {len(results)} | Passed: {passed} | Failed: {failed}")

    with open("docs/audits/production_live_acceptance_results.json", "w") as f:
        json.dump(results, f, indent=2)

if __name__ == "__main__":
    run_production_audit()
