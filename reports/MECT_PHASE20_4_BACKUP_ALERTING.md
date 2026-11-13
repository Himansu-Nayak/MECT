# MECT PHASE 20.4 — BACKUP FAILURE DETECTION & ALERTING SPECIFICATION

**Project:** MAHAVEER EDUCATIONAL & CHARITABLE TRUST (MECT)  
**Host Target:** Hostinger VPS `srv2000528` (`200.97.161.128`)  
**Design Lead:** Senior DevSecOps Engineer & Production Reliability Lead  
**Status:** SPECIFICATION READY FOR ACTIVATION  

---

## 1. Failure Modes & Detection Rules

The automated backup pipeline must detect five distinct failure conditions:

| Failure Mode | Detection Condition | Severity | Trigger Threshold |
|---|---|---|---|
| **Backup Process Crash** | `pg_dump` non-zero exit code or unhandled signal | **CRITICAL** | Immediate upon exit |
| **Archive Corruption** | `pg_restore --list` fails or returns fewer than 50 TOC objects | **CRITICAL** | Immediate upon verification step |
| **Stale / Missing Backup** | File `/var/backups/mect/mect_db_backup_*.dump` older than 26 hours | **HIGH** | Daily monitoring check |
| **Abnormal Size Shrinkage** | Backup file size < 80% of previous day's baseline archive | **HIGH** | Post-dump comparison check |
| **Off-Site Sync Failure** | Cloud sync exit code non-zero | **HIGH** | Post-sync step |

---

## 2. Notification Dispatch Architecture

### 2.1 Multi-Channel Alerting Channels
1. **Webhook Channel:** Post alerting payload to an institutional Discord / Slack webhook or Telegram Bot.
2. **Email Channel:** Send alert via Resend API (`api.resend.com`) or system `mailx` to `trustees@mect.org.in`.
3. **Local Syslog:** Log failure with facility `local0.err` for centralized host monitoring.

### 2.2 Alert Dispatch Hook Implementation
In `/opt/mect/scripts/backup-db.sh`, define the failure handler:

```bash
send_alert() {
    local subject="$1"
    local message="$2"
    local severity="${3:-CRITICAL}"
    
    log "[ALERT][${severity}] ${subject}: ${message}"
    
    # Optional Discord / Slack Webhook (Configured via .env.production)
    if [ -n "${BACKUP_ALERT_WEBHOOK_URL:-}" ]; then
        curl -s -X POST -H "Content-Type: application/json" \
            -d "{\"content\": \"🚨 **MECT BACKUP ALERT [${severity}]**: ${subject}\\n${message}\"}" \
            "${BACKUP_ALERT_WEBHOOK_URL}" >/dev/null 2>&1 || true
    fi
}

# Trap unexpected exits
trap 'send_alert "Backup Failed" "Script exited unexpectedly at line $LINENO" "CRITICAL"' ERR
```

---

## 3. Freshness Sentinel Cron Job

To detect cases where cron fails to run the backup script altogether, a standalone sentinel check is specified:

```cron
# Runs daily at 04:00 UTC (2 hours after backup window)
0 4 * * * root /opt/mect/scripts/verify-backup-freshness.sh >/dev/null 2>&1
```

Script logic:
```bash
#!/usr/bin/env bash
LATEST_DUMP=$(find /var/backups/mect -name "mect_db_backup_*.dump" -mtime -1 | head -n 1)
if [ -z "${LATEST_DUMP}" ]; then
    /opt/mect/scripts/send-alert.sh "CRITICAL: No fresh MECT backup found in the last 24 hours!"
fi
```

