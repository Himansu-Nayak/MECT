# MECT — PHASE 2.7G: ISOLATED STAGING VPS PROVISIONING, DOCKER DEPLOYMENT & HTTPS ACTIVATION
## PREREQUISITE AUDIT & PROVISIONING READINESS REPORT

**Project:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Website:** [https://mect.org.in/](https://mect.org.in/)  
**Target Staging Frontend:** [https://staging.mect.org.in](https://staging.mect.org.in)  
**Target Staging Backend API:** [https://staging-api.mect.org.in](https://staging-api.mect.org.in)  
**Active Working Branch:** `feat/complete-website-redefinition-and-deduplication`  
**Committed Baseline Commit:** `3e9bfe5a22de9511f8178fdf1e3bf20c07c2502c`  
**Release Candidate Digest:** `fbad3e96e2c16b496e11419d4325606ccb0207c94e8a551d7b42e7a6cf62aac0`  
**Audit Protocol:** Phase 2.7G Master Execution Preflight  
**Audit Date:** 2026-11-27  
**Final Gate Verdict:** **`STAGING BLOCKED — OWNER ACTION REQUIRED`**

---

## 1. EXECUTIVE SUMMARY & PREREQUISITE GATE COMPLIANCE

In strict compliance with the Phase 2.7G Execution Directive, an infrastructure preflight was conducted prior to initiating any remote VPS connection or mutation.

The directive mandates:
> *"The existence of a previous phase prompt does not constitute authorization. If one or more prerequisites are incomplete: Do not connect to the VPS. Do not execute infrastructure mutations. Identify each missing item. Produce a precise prerequisite report. Stop and request the required owner action."*

### Preflight Findings:
1. **Local Release Candidate Established:** All application code, deduplication changes, donor authentication enhancements, positive profile security boundaries, watermarked receipt generation, and Docker Compose resource limits (capped at 1.50 CPUs) have been frozen and validated locally.
2. **Quality Gates 100% Green:** 170 backend tests passed (including 17 dedicated staging safety tests), 58 Next.js routes generated without errors, secret scans reported 0 tracked secrets, and typecheck/lint suites reported 0 errors.
3. **Execution Gate Intercept:** Remote SSH connection, container instantiation, database provisioning, and Nginx modification remain **BLOCKED** pending explicit owner confirmation of 8 prerequisite items (including Hostinger VPS IPv4 confirmation, Cloudflare DNS creation, and Zero Trust access policy activation).

---

## 2. IMMUTABLE RELEASE CANDIDATE MANIFEST

The local working tree was cataloged to establish an immutable, verifiable release candidate:

- **Git Branch:** `feat/complete-website-redefinition-and-deduplication`
- **Committed Baseline HEAD:** `3e9bfe5a22de9511f8178fdf1e3bf20c07c2502c`
- **Cumulative Release Candidate SHA-256 Digest:**  
  `fbad3e96e2c16b496e11419d4325606ccb0207c94e8a551d7b42e7a6cf62aac0`

### File Manifest & SHA-256 Checksums:
| SHA-256 Checksum | Size | File Path | Description |
| :--- | :---: | :--- | :--- |
| `2092b3edda42ff4923906693542e2341102ad3774ca7027b9ecdb0ba5ff783d9` | 4,750 B | `compose.staging.yaml` | Docker Compose stack (1.5 CPU cap, internal DB) |
| `d00e306f6dc7e39325fc1b45ab4bf85f38ae88778f34866a4ed073a402f94a3a` | 2,195 B | `.env.staging.example` | Environment configuration template |
| `177dd9d5cbb19816161fd8fd0b2205cc466e3babc9187865de5812d6b401dbe4` | 5,260 B | `docker/nginx/staging.mect.org.in.conf` | Virtual host config with actuator protection |
| `a30d9effcbca3c297916263f38974fdf81e52a8cb785a74358659564428ec010` | 4,576 B | `backend/src/main/resources/application.yml` | Backend runtime configuration |
| `f3f8e145fd702e0c2be53ed48b5f1fc16d364aeb6444d9356339891badde9ec0` | 30,151 B | `backend/.../portal/OtpAuthService.java` | Hardened OTP service (5 positive conditions) |
| `d6fe09f9048ae4a0b0b616914795bd8feee959f9dd1b3d8d1d80103f50c99f40` | 9,754 B | `backend/.../receipt/ReceiptPdfService.java` | Staging receipt disclaimer watermark banner |
| `ed903fdd500b7ed9371ae88494864a70fc2c7b327e005c461466d6786f46c4b0` | 22,102 B | `backend/.../notification/EmailTemplateRenderer.java` | Email template renderer |
| `0f00f78f200987a9325d06fc9e6c489fbf07d7ee2a6fec119dd0a8dc14e8a835` | 21,848 B | `backend/src/test/.../StagingOtpHardeningAndSafetyTests.java` | 17 unit & integration staging safety tests |
| `f6f215126a6cf490ead5bb63e5684904572bc1b9498c68219a3b8867291057c1` | 8,655 B | `src/config/org.ts` | Canonical organizational data configuration |
| `dd7fa1061287281ba2ada9d4f306ab61a8c37bce837859c4a578042503f962fb` | 16,741 B | `src/lib/content-registry.ts` | Central content registry |
| `dba0497902590fa7f0f2020986776cd691eec6cdb3166474c2336e9a005e1da8` | 18,621 B | `src/lib/ai/mect-knowledge.ts` | Institutional AI knowledgebase |
| `a2d4044a23adda899cf63ad580ac8e2b94af578ada9aa10e7318df52445b71e4` | 4,540 B | `src/app/page.tsx` | Deduplicated homepage |
| `538b11128bf427dac4b10e6fd6bcda4fd14d4a02dda2632cb9a8be90ca06b109` | 8,164 B | `src/app/login/page.tsx` | Progressive login route |
| `f4cee1320ec1740341413c4e3e1f03c589626f24ebf53b571be39e4fe5920e93` | 8,354 B | `src/app/register/page.tsx` | Registration route |
| `31132fa815500327fe7813766a98d7505e4258767eca6ef13862a97cf4838187` | 25,467 B | `src/app/faq/page.tsx` | Comprehensive FAQ |
| `1d7b115937bf83716f47f000a6813bbb2b2d94b0c3e12927f654ab5e369e44da` | 20,564 B | `src/app/portal/security/page.tsx` | Security settings & account linking |
| `31be1170389b97b791954f2c2a58b3dfb0f7dfba409b8d404b5f96ba30d9675a` | 28,978 B | `src/app/admin/demo/page.tsx` | Administrative review interface |
| `ecb1a6ab9733b0bad39e75f70789a1423c3b3e736d763b5e9387c6f365aa41bf` | 10,798 B | `OWNER_DECISIONS.md` | Authoritative owner decision register |
| `de4d6c4ab7106567e10824fcce88f75fffa427b09b5a06dae49197664aaf98a9` | 7,539 B | `content/todo-confirm.md` | Verification checklist |
| `021827f86fcbbfb3bcb66355f7ac00bcbfccba200f84484083dcccfa25f255c0` | 1,081 B | `.gitignore` | Git exclusions (includes `.env.staging`) |

---

## 3. PREREQUISITE GATE & OWNER AUTHORIZATION STATUS

The table below catalogs every required owner prerequisite and its verification status:

| # | Prerequisite Item | Technical Scope | Current Status | Required Action / Decision |
| :---: | :--- | :--- | :---: | :--- |
| **1** | **VPS IPv4 Confirmation** | Confirm active Hostinger VPS IPv4 (historical: `200.97.161.128`) | ⚠️ **PENDING** | Owner must confirm whether VPS IPv4 is `200.97.161.128`. |
| **2** | **Cloudflare DNS Records** | Add `staging` and `staging-api` A records (Proxied: ON) | ⚠️ **PENDING** | Owner must add DNS A records in Cloudflare. |
| **3** | **Cloudflare Zero Trust Access** | Protect `staging.mect.org.in` & `staging-api.mect.org.in` | ⚠️ **PENDING** | Owner must create Access apps with email OTP & OPTIONS bypass. |
| **4** | **Google OIDC JavaScript Origin** | Add `https://staging.mect.org.in` to Web Client ID `926210200845-...` | ⚠️ **PENDING** | Owner must add origin in Google Cloud Console (or defer). |
| **5** | **Staging Secret Generation** | Generate `DB_PASSWORD`, `JWT_SECRET`, `OTP_HASH_PEPPER` | 🟡 **SCRIPT READY** | Owner generates via OpenSSL; installed directly on server. |
| **6** | **SSH Provisioning Authorization** | Explicit owner permission to connect to VPS via SSH | ⚠️ **PENDING** | Owner must explicitly state: *"I authorize SSH staging provisioning."* |
| **7** | **Docker & DB Creation Authorization** | Authorization to run `docker compose up` & create `mect_staging_db` | ⚠️ **PENDING** | Owner must explicitly authorize staging containers and DB. |
| **8** | **Nginx Virtual Host Authorization** | Authorization to add staging conf and run `nginx -t` & reload | ⚠️ **PENDING** | Owner must explicitly authorize staging virtual host reload. |
| **9** | **Shared Firewall Rule Changes** | Any modification to host UFW / iptables | 🟢 **DEFERRED** | No firewall changes needed; ports bind strictly to loopback. |

---

## 4. ABSOLUTE PRODUCTION PROTECTION ASSURANCES

Before requesting owner authorization, the production protection architecture was cross-checked:
- **Port Allocation Insulation:**
  - Production MECT Frontend: `3001` (Untouched)
  - Production MECT Backend: `8081` (Untouched)
  - Production MECT Database: `5433` (Untouched)
  - OHO Tech Frontend: `3000` (Untouched)
  - OHO Tech Backend: `8080` (Untouched)
  - OHO Tech Database: `5432` (Untouched)
  - **Staging Frontend:** `127.0.0.1:3002` (New, Loopback Only)
  - **Staging Backend:** `127.0.0.1:8082` (New, Loopback Only)
  - **Staging Database:** Internal Docker bridge `mect-staging-network` only (Zero host ports).
- **Prohibited Destructive Commands:**
  - `docker compose down -v` (BANNED)
  - `docker system prune -a` (BANNED)
  - `docker volume prune` (BANNED)
- **Directory Insulation:** Staging will be installed strictly in `/opt/mect-staging` with 0750 permissions; no symlinks or mounts to `/opt/mect` will be created.

---

## 5. LOCAL VERIFICATION & QUALITY REGRESSION RESULTS

Every quality gate in the repository verification pipeline has been executed and confirmed green:

| Quality Gate | Command Executed | Exit Code | Verified Outcome |
| :--- | :--- | :---: | :--- |
| **Marker Audit** | `npm run check:confirm` | `0` | PASS: 0 unresolved markers |
| **Secret Scan** | `npm run scan:secrets` | `0` | PASS: 0 tracked secrets detected |
| **TypeScript Compilation** | `npm run typecheck` | `0` | PASS: Zero type errors |
| **ESLint Check** | `npm run lint` | `0` | PASS: Zero linting errors |
| **Next.js Production Build** | `npm run build` | `0` | PASS: All 58/58 routes generated |
| **Spring Boot Full Test Suite** | `mvn -f backend/pom.xml test` | `0` | PASS: 170/170 tests passed across 22 classes |
| **Staging Safety Test Suite** | `mvn ... -Dtest=StagingOtpHardeningAndSafetyTests` | `0` | PASS: 17/17 test cases passed |
| **Docker Compose Config** | `docker compose -f compose.staging.yaml config` | `0` | PASS: Valid schema, 1.50 CPU cap, isolated ports |

---

## 6. REMOTE EXECUTION PROCEDURE (READY FOR ACTIVATION UPON AUTHORIZATION)

Upon receipt of the owner's explicit authorization, the execution will proceed through the following strictly ordered, non-destructive steps:

### Step 1: Preflight Host Inspection (Read-Only)
```bash
ssh -i <authorized_key> root@<confirmed_ip>
uname -a
free -h
df -h /
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
netstat -tulpn | grep -E '3002|8082'
```
*(Confirms ports 3002 and 8082 are completely free, available disk > 20 GB, and production containers are healthy).*

### Step 2: Staging Directory & Secret Setup
```bash
mkdir -p /opt/mect-staging/{app,config,secrets,logs,backups}
chmod 750 /opt/mect-staging
# Transfer compose.staging.yaml and staging.mect.org.in.conf
# Generate /opt/mect-staging/.env.staging with chmod 600
```

### Step 3: Staging Container Build & Launch
```bash
cd /opt/mect-staging
nice -n 19 ionice -c 3 docker compose -f compose.staging.yaml up -d --build
docker compose -f compose.staging.yaml ps
```

### Step 4: Staging Health & Migration Verification
```bash
# Verify PostgreSQL health
docker exec mect-postgres-staging pg_isready -U mect_staging_user -d mect_staging_db

# Verify backend health and Flyway migrations
curl -f http://127.0.0.1:8082/api/v1/actuator/health
docker logs --tail 50 mect-backend-staging | grep -E 'Flyway|Started'

# Verify frontend health
curl -I http://127.0.0.1:3002/api/ai/health
```

### Step 5: Nginx Virtual Host Installation & Syntax Validation
```bash
cp /opt/mect-staging/config/staging.mect.org.in.conf /etc/nginx/sites-available/
ln -sf /etc/nginx/sites-available/staging.mect.org.in.conf /etc/nginx/sites-enabled/
sudo nginx -t
# ONLY if exit code is 0:
sudo systemctl reload nginx
```

### Step 6: Post-Deployment Verification & Health Checks
```bash
# Verify Production MECT remains 100% operational
curl -I https://mect.org.in/
curl -I https://mect.org.in/api/v1/actuator/health

# Verify Staging endpoints over HTTPS
curl -I https://staging.mect.org.in
curl -I https://staging-api.mect.org.in/api/v1/actuator/health
```

---

## 7. FINAL GATE VERDICT & OWNER ACTION REQUEST

```
====================================================================================================
                             MECT STAGING INFRASTRUCTURE GATE VERDICT
====================================================================================================

  [x] Phase 0: Release Candidate Manifest:           Established (SHA-256 Digest fbad3e96...)
  [x] Phase 0: Local Quality Gates:                  170 Backend Tests + 58 Routes Pass (Exit Code 0)
  [x] Phase 0: Resource Caps Hardened:               1.50 CPUs Capped in compose.staging.yaml
  [x] Phase 0: Git Hygiene & Exclusions:             .env.staging Added to .gitignore (Exit Code 0)
  [x] Phase 0: Execution Script Prepared:            Low-Priority nice/ionice Build Protocol Defined
  [!] Phase 0: Owner Prerequisites:                  8 Configuration & Authorization Items Pending

  FINAL VERDICT:
  >>> STAGING BLOCKED — OWNER ACTION REQUIRED <<<

====================================================================================================
```
