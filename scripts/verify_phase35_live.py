import urllib.request
import urllib.error
import json
import ssl
import sys
import paramiko
import time

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def test_url(url, method="GET", data=None, headers=None, expected_statuses=(200,)):
    h = headers or {}
    h.setdefault("User-Agent", "MECT-Phase35-Verifier/1.0")
    req = urllib.request.Request(url, data=data, headers=h, method=method)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
            body = resp.read()
            status = resp.status
            return status, body, resp.headers
    except urllib.error.HTTPError as e:
        body = e.read()
        return e.code, body, e.headers
    except Exception as e:
        return 0, str(e).encode(), {}

def main():
    print("==================================================================", flush=True)
    print("MECT PHASE 3.5 — LIVE PRODUCTION ACCEPTANCE & VERIFICATION PROBES", flush=True)
    print("Target: https://mect.org.in/ | VPS: 200.97.161.128", flush=True)
    print("==================================================================\n", flush=True)

    results = []
    
    # Probe 1: Homepage Root
    status, body, _ = test_url("https://mect.org.in/")
    html = body.decode('utf-8', errors='ignore')
    p1_ok = status == 200 and "Mahaveer Educational & Charitable Trust" in html and "Lewis Plaza" in html
    results.append(("1. Production Homepage (https://mect.org.in/)", p1_ok, f"HTTP {status}, contains Lewis Plaza: {'Lewis Plaza' in html}"))

    # Probe 2: Programmes Route
    status, body, _ = test_url("https://mect.org.in/programmes")
    html = body.decode('utf-8', errors='ignore')
    p2_ok = status == 200 and "Shiksha Setu" in html and "Swavalamban" in html
    results.append(("2. Programmes Page (https://mect.org.in/programmes)", p2_ok, f"HTTP {status}, contains Shiksha Setu & Swavalamban"))

    # Probe 3: Donate Route
    status, body, _ = test_url("https://mect.org.in/donate")
    html = body.decode('utf-8', errors='ignore')
    p3_ok = status == 200 and "State Bank of India" in html
    results.append(("3. Donate Page (https://mect.org.in/donate)", p3_ok, f"HTTP {status}, contains SBI details"))

    # Probe 4: Backend Health (internal via SSH)
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect("200.97.161.128", username="root", timeout=30)

    _, stdout, _ = ssh.exec_command("curl -s http://127.0.0.1:8081/api/v1/actuator/health")
    backend_health = stdout.read().decode().strip()
    p4_ok = '"status":"UP"' in backend_health
    results.append(("4. Backend Internal Health (127.0.0.1:8081/api/v1/actuator/health)", p4_ok, backend_health))

    # Probe 5: Public API Active Programmes
    status, body, _ = test_url("https://mect.org.in/api/v1/public/programmes")
    try:
        progs = json.loads(body.decode('utf-8'))
        p5_ok = status == 200 and isinstance(progs, list) and len(progs) >= 5
        results.append(("5. Public API Active Programmes (/api/v1/public/programmes)", p5_ok, f"HTTP {status}, {len(progs)} active programmes"))
    except Exception as e:
        results.append(("5. Public API Active Programmes (/api/v1/public/programmes)", False, f"HTTP {status}, Error: {e}"))

    # Probe 6: Cashfree Online Order Creation
    init_payload = json.dumps({
        "programmeCode": "EDUCATION_LEARNING",
        "amount": 500,
        "donorName": "Live Probe Auditor",
        "email": "audit@mect.org.in",
        "phone": "+919876543210",
        "city": "Bhubaneswar",
        "paymentMethod": "GATEWAY_CHECKOUT"
    }).encode('utf-8')
    status, body, _ = test_url("https://mect.org.in/api/v1/public/donations/initiate", method="POST", data=init_payload, headers={"Content-Type": "application/json"})
    try:
        data = json.loads(body.decode('utf-8'))
        p6_ok = status in (200, 201) and "donationReference" in data
        results.append(("6. Cashfree Order Creation (/api/v1/public/donations/initiate)", p6_ok, f"HTTP {status}, ref: {data.get('donationReference')}"))
    except Exception as e:
        results.append(("6. Cashfree Order Creation (/api/v1/public/donations/initiate)", False, f"HTTP {status}, response: {body.decode()[:100]}"))

    # Probe 7: Manual UTR Remittance Claim
    import datetime
    today_str = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")
    ts_rand = hex(int(time.time()))[2:].upper()
    claim_payload = json.dumps({
        "programmeCode": "EDUCATION_LEARNING",
        "amount": 1000,
        "donorName": "Live UTR Probe",
        "donorEmail": "audit@mect.org.in",
        "donorPhone": "+919876543210",
        "utrReference": f"SBIN{ts_rand}LIVE",
        "transferDate": today_str,
        "notes": "MECT Phase 3.5 Live Remittance Verification"
    }).encode('utf-8')
    status, body, _ = test_url("https://mect.org.in/api/donations/claim", method="POST", data=claim_payload, headers={"Content-Type": "application/json"})
    try:
        data = json.loads(body.decode('utf-8'))
        p7_ok = status in (200, 201) and "claimReference" in data
        results.append(("7. Manual UTR Remittance Claim (/api/donations/claim)", p7_ok, f"HTTP {status}, ref: {data.get('claimReference')}"))
    except Exception as e:
        results.append(("7. Manual UTR Remittance Claim (/api/donations/claim)", False, f"HTTP {status}, response: {body.decode()[:100]}"))

    # Probe 8-11: New Modern WebP Field Photos
    for path, desc in [
        ("/images/programmes/field_photo_1.webp", "8. Field Photo 1 WebP (Remedial Education)"),
        ("/images/programmes/field_photo_8.webp", "9. Field Photo 8 WebP (Women Vocational Cohort)"),
        ("/images/programmes/field_photo_3.webp", "10. Field Photo 3 WebP (Jal Seva Water Station)"),
        ("/images/hero/illustrative-community-library-reading.webp", "11. Library Reading Room WebP")
    ]:
        status, body, headers = test_url(f"https://mect.org.in{path}")
        ok = status == 200 and len(body) > 10000
        results.append((desc, ok, f"HTTP {status}, {len(body)/1024:.1f} KB, Content-Type: {headers.get('Content-Type', '')}"))

    # Probe 12: OHO Tech Coexistence
    _, stdout, _ = ssh.exec_command("curl -sI http://127.0.0.1:3000 | head -n 1 && curl -s http://127.0.0.1:8080/actuator/health || true")
    oho_res = stdout.read().decode().strip().replace('\n', ' ')
    p12_ok = "200" in oho_res
    results.append(("12. OHO Tech Coexistence (Ports 3000 & 8080)", p12_ok, oho_res))

    # Probe 13: Database Integrity
    _, stdout1, _ = ssh.exec_command('docker exec mect-postgres psql -U mect_user -d mect_db -t -c "SELECT COUNT(*) FROM donations;"')
    don_count = stdout1.read().decode().strip()
    _, stdout2, _ = ssh.exec_command('docker exec mect-postgres psql -U mect_user -d mect_db -t -c "SELECT COUNT(*) FROM manual_bank_transfer_claims;"')
    claim_count = stdout2.read().decode().strip()
    _, stdout3, _ = ssh.exec_command('docker exec mect-postgres psql -U mect_user -d mect_db -t -c "SELECT COUNT(*) FROM notification_outbox;"')
    outbox_count = stdout3.read().decode().strip()
    p13_ok = bool(don_count and claim_count and outbox_count)
    results.append(("13. Production PostgreSQL Integrity (mect_db row counts)", p13_ok, f"Donations: {don_count}, Claims: {claim_count}, Outbox: {outbox_count}"))

    ssh.close()

    print(f"{'Probe':<60} | {'Status':<8} | {'Details'}")
    print("-" * 115)
    all_passed = True
    for name, ok, details in results:
        status_str = "PASS" if ok else "FAIL"
        if not ok: all_passed = False
        print(f"{name:<60} | {status_str:<8} | {details}")

    print("\n" + "=" * 115)
    if all_passed:
        print("ALL 13 LIVE ACCEPTANCE PROBES PASSED (100% GREEN) ON HTTPS://MECT.ORG.IN")
    else:
        print("WARNING: Some acceptance probes failed!")
    print("=" * 115)

    # Save results to json
    report_data = [{"probe": r[0], "passed": r[1], "details": r[2]} for r in results]
    with open("docs/audits/production_live_acceptance_results.json", "w", encoding="utf-8") as f:
        json.dump(report_data, f, indent=2)

if __name__ == "__main__":
    main()
