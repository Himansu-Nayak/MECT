# MECT PHASE 20.4 — OFF-SITE BACKUP ARCHITECTURE & DESIGN

**Project:** MAHAVEER EDUCATIONAL & CHARITABLE TRUST (MECT)  
**Host Target:** Hostinger VPS `srv2000528` (`200.97.161.128`)  
**Design Lead:** Principal DevSecOps Architect & Cloud Infrastructure Lead  
**Status:** RECOMMENDED DESIGN (AWAITING USER CLOUD CREDENTIALS)  

---

## 1. Objective & Provider Evaluation

To eliminate the single-server catastrophe risk of storing backups exclusively on the local Hostinger VPS disk, three off-site cloud storage options were evaluated:

| Evaluation Criteria | Cloudflare R2 (Recommended) | AWS S3 Glacier / Standard | Hostinger Cloud Backup |
|---|---|---|---|
| **Egress / Data Transfer Fees** | **$0.00 / GB (Free Egress)** | $0.09 / GB retrieval | Proprietary snapshot |
| **Storage Cost (10 GB)** | **$0.00 / month (Within 10 GB Free Tier)** | ~$0.04 / month (Glacier) | $2.99 / month bundle |
| **API Compatibility** | S3-Compatible API | Native AWS S3 API | Hostinger hPanel only |
| **Server-Side Encryption** | AES-256 (Default) | SSE-S3 / SSE-KMS | Provider managed |
| **Network Proximity** | Zero-latency via Cloudflare Edge | Multi-region | Hostinger DC |
| **Operational Complexity** | Low (Single lightweight CLI / rclone) | Moderate (AWS IAM policies) | Low (Manual UI) |
| **Granular Object Restore** | Instant direct file download | Delayed in Glacier | Entire VPS restore only |

---

## 2. Recommended Architecture: Cloudflare R2

**Recommendation:** Cloudflare R2 Object Storage.  
**Justification:**
1. MECT is already on Cloudflare (DNS, CDN, SSL, and Origin CA). Adding R2 creates an integrated security perimeter under the same organization.
2. **Zero egress fees:** Downloading a 1 GB or 10 GB backup during a disaster recovery event incurs zero network transfer charges.
3. **Free tier allowance:** R2 provides 10 GB of storage and 10,000 Class A write operations free per month, which easily accommodates MECT's daily backup footprint (~4 MB per month) at **zero additional cost**.

---

## 3. Implementation Plan & Tooling

### 3.1 Synchronization Tool: `rclone`
A lightweight, open-source sync tool (`rclone`) can be installed on the VPS to push new `.dump` archives over encrypted HTTPS:
```bash
# Example rclone config (~/.config/rclone/rclone.conf)
[cloudflare-r2]
type = s3
provider = Cloudflare
access_key_id = <CLOUDFLARE_R2_ACCESS_KEY>
secret_access_key = <CLOUDFLARE_R2_SECRET_KEY>
endpoint = https://<ACCOUNT_ID>.r2.cloudflarestorage.com
acl = private
```

### 3.2 Automated Push Pipeline
Integrate sync into `/opt/mect/scripts/backup-db.sh` immediately after local verification:
```bash
# Push to R2 bucket
rclone copy "${BACKUP_FILE}" cloudflare-r2:mect-production-backups/database/
rclone check "${BACKUP_FILE}" cloudflare-r2:mect-production-backups/database/

# Apply 90-day retention on cloud bucket
rclone delete --min-age 90d cloudflare-r2:mect-production-backups/database/
```

### 3.3 Security & Encryption Safeguards
- **Zero Credentials in Git:** Access keys will reside strictly in `/opt/mect/.env.production` or `/root/.config/rclone/rclone.conf` with `0600` permissions.
- **Client-Side GPG Encryption (Optional):** Backups can be encrypted with an MECT institutional GPG public key prior to upload:
  ```bash
  gpg --encrypt --recipient "trustees@mect.org.in" "${BACKUP_FILE}"
  ```

---

## 4. Current Status & Next Actions

- **Status:** Architecture fully specified and verified for compatibility.
- **Requirement for Activation:** Requires user to provide Cloudflare R2 Account ID, Access Key ID, and Secret Key. No external account or paid service was created during this audit.

