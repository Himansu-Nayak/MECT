# MECT PHASE 19.1 — RELEASE ARTIFACT MANIFEST

**Project:** Mahaveer Educational & Charitable Trust (MECT)  
**Evaluator:** Production Release Manager & Software Architect  
**Manifest Date:** 2026-11-13  
**Release Candidate Target:** Production Deployment Candidate  

---

## 1. RELEASE ARTIFACT MANIFEST TABLE

| Manifest Item | Exact Value | Verification Evidence |
| :--- | :--- | :--- |
| **Source Git Branch** | `motion-ui` | `git branch --show-current` |
| **Source Git Commit SHA** | `cb5b55486e4d8105a321554e579c972492f6f62d` | `git rev-parse HEAD` |
| **Working Tree Status** | **Modified / Untracked Changes Present** | Contains verified CMS security fixes and migration V11 in working tree (not committed) |
| **Production Baseline Commit** | `155dd0065734766b2f8688ffcb7b964225eea9e9` | `git rev-parse --verify 155dd00` |
| **Backend JAR Path** | `backend/target/mahavir-backend-0.1.0-SNAPSHOT.jar` | Verified on local filesystem |
| **Backend JAR File Size** | `67,320,401 bytes` | `Get-Item.Length` |
| **Backend JAR SHA-256 Checksum** | `1CF8AFC6E284643A7545986B2789F1EA7C4E34B7522390229199EAF6C1A4AC13` | `Get-FileHash -Algorithm SHA256` |
| **Backend Build Timestamp** | `2026-11-13 12:10:14 +05:30` | File LastWriteTime |
| **Frontend Build Identity** | Next.js 16.4.3 Production Standalone (`.next/`) | 40 Static & Dynamic Routes compiled |
| **Frontend Build Timestamp** | `2026-11-13 12:17:44 +05:30` | Build completion timestamp |
| **Database Migration Range** | Flyway V1 through V11 | `V1__init.sql` to `V11__donation_ecosystem_cms_and_rbac.sql` |
| **Isolated Database Backup** | `backups/mahavir_trust_dev_release_gate.dump` | 133,110 bytes (SHA-256 verified, restore tested) |

---

## 2. RECOMMENDED RELEASE COMMIT PROCEDURE (AWAITING OWNER APPROVAL)

Because the project safety rules state:
> *"DO NOT commit without explicit authorization."*

The working tree changes have been preserved uncommitted. Once the project owner authorizes the release commit, the following command sequence is recommended:

```bash
# 1. Stage all verified MECT source code, migrations, and reports
git add backend/src/main/
git add backend/src/test/
git add src/
git add content/
git add reports/
git add package.json package-lock.json

# 2. Exclude temporary scratch files and binaries
git reset scratch/
git reset *.dump
git reset *.jar

# 3. Create the formal Release Commit
git commit -m "feat(release): MECT complete donation ecosystem, CMS security hardening, and release candidate [Phase 19.1]"

# 4. Tag the Release
git tag -a v1.0.0-release -m "MECT Production Release Candidate v1.0.0"
```

