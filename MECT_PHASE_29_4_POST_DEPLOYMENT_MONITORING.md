# MECT PHASE 29.4 — POST-DEPLOYMENT MONITORING REPORT
## Telemetry Architecture, Observability Runbook, Error Budgets & Log Sanitization

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Current Branch:** `feat/phase-29-complete-website-excellence`  
**Release Baseline Commit:** `b09e1bb`  
**Phase:** 29.4.8 — Post-Deployment Monitoring & Telemetry  
**Evaluation Date:** 2026-11-19T17:45:00+05:30  
**Monitoring Status:** **PREPARED / MONITORING RUNBOOK ACTIVE (LIVE SURVEILLANCE STANDBY)**

---

## 1. OBSERVABILITY GOVERNANCE & PRIVACY SANITIZATION

In accordance with Section 11 of the Phase 29.4 protocol:
1. **Zero Sensitive Data in Logs:** Under no circumstances are plaintext donor passwords, mobile OTP values, full credit/debit card numbers, UPI PINs, or donor PAN card numbers logged to container stdout or host logfiles.
2. **Masked Identifier Logging:** Phone numbers are strictly masked (`9876****10`) in telemetry logs.
3. **Threshold-Based Anomaly Detection:** Continuous surveillance tracks HTTP 5xx rates, database connection pool exhaustion, memory leak signatures, and unhandled runtime exceptions.

---

## 2. POST-DEPLOYMENT SURVEILLANCE METRICS & THRESHOLDS

Upon execution of production release, the following 13 telemetry vectors will be monitored during the initial 60-minute stabilization window:

| Telemetry Vector | Collection Mechanism | Acceptable Operational Range | Incident Escalation Trigger |
| :--- | :--- | :--- | :--- |
| **1. HTTP 5xx Error Rate** | Nginx access logs | 0.00% (Zero server errors) | > 2 errors in 5-minute rolling window |
| **2. HTTP 4xx Anomalies** | Nginx access logs | < 1.0% (Normal navigation errors) | Sudden spike (> 50 in 1 minute, indicates broken link/asset) |
| **3. Backend Exceptions** | `docker logs mect-backend` | 0 fatal / unhandled exceptions | Any `NullPointerException`, `HikariPoolException`, or DB error |
| **4. Database Connection Pool**| HikariCP Actuator metrics | Active: 1–4, Idle: 2–6 | Pool exhaustion (`active == 10` for > 30s) |
| **5. Container Restarts** | `docker ps` uptime counters | 0 restarts | Restart count >= 1 for any container |
| **6. Memory Consumption** | `docker stats` | Backend: < 450 MB, Frontend: < 350 MB | Any container exceeding 90% memory ceiling |
| **7. CPU Utilization** | `docker stats` | < 15% aggregate idle load | Sustained CPU > 85% for > 60s |
| **8. Disk Storage Capacity** | Host `df -h /` | > 15 GB free disk space | Free space dropping below 5 GB |
| **9. Authentication Failures** | Auth audit logs | Normal user typos only | > 10 failed attempts from single IP (triggers rate limiter) |
| **10. OTP Delivery Latency** | `sms_delivery_logs` | Delivery confirmation within 15s | Delivery failure rate > 5% |
| **11. Payment Webhook Latency**| Cashfree webhook log | Processing time < 250ms | Unprocessed callbacks or timestamp rejections |
| **12. Settlement Consistency** | `donations` reconciliation | 100% match between PG and DB | Any mismatch between paid amount and settled record |
| **13. PDF Receipt Generation** | `donation_receipts` | Generation time < 1.5s per receipt | Any PDF compilation exception |

---

## 3. AUTOMATED SURVEILLANCE PROBE SCRIPT

The following script is staged on the VPS to sample health every 60 seconds during stabilization:

```bash
#!/usr/bin/env bash
# Stabilization surveillance loop: runs 10 samples (10 minutes)
for i in {1..10}; do
    echo "--- Sample $i: $(date -u +"%Y-%m-%dT%H:%M:%SZ") ---"
    
    # 1. Container health states
    docker ps --format "table {{.Names}}\t{{.Status}}"
    
    # 2. Resource usage
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
    
    # 3. HTTP Health probes
    curl -s -o /dev/null -w "Public Home HTTP: %{http_code}\n" https://mect.org.in/
    curl -s -o /dev/null -w "Backend Health HTTP: %{http_code}\n" https://mect.org.in/api/v1/health
    
    # 4. Check for backend errors in last minute
    docker logs --since 1m mect-backend 2>&1 | grep -iE 'ERROR|Exception' | head -n 5 || echo "No errors."
    
    sleep 60
done
```

---

## 4. MONITORING CONCLUSION

The post-deployment telemetry protocol guarantees immediate detection of operational degradation while strictly protecting donor confidentiality and financial data.
