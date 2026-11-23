# MECT PHASE 21 — RELEASE MANIFEST & ARTIFACT REGISTER

**Project:** MAHAVEER EDUCATIONAL & CHARITABLE TRUST (MECT)  
**Production URL:** `https://mect.org.in/`  
**Host Target:** Hostinger VPS `<PROD_HOSTNAME>` (`<PROD_VPS_IP>`)  
**Deployment Directory:** `/opt/mect`  
**Deployment Timestamp:** 2026-11-13T10:32:00Z (UTC)  
**Release Manager:** Principal Production Release Manager  

---

## 1. Release Identification

- **Release Name:** MECT Complete Production Release (Phase 21 Verified)
- **Git Branch:** `motion-ui`
- **Release Base Commit:** `c7e63261a9fc55bf3607fa65b2611e9f196be4b0`
- **Docker Compose Commit:** `2e025e64a132bc682a20b83e33b94236cf88478f`
- **Phase 21 Audited Commit:** Current `HEAD` (`motion-ui`)
- **Deployment Status:** **LIVE IN PRODUCTION**

---

## 2. Docker Container Images & Artifact Checksums

| Service | Container Image Tag | Docker Image SHA-256 Digest | Base OS / Distribution | Internal Port |
|---|---|---|---|---|
| **Frontend** | `mect-frontend:production` | `sha256:ee64eb69b788e7dc8a91b9791f65b7e508f95d66ebc6c4049f32870a09b7562a` | Node 22 Alpine (83.7 MB standalone) | 3000 |
| **Backend** | `mect-backend:production` | `sha256:9ba9aef36902b281f3785c40ef9ae1c77ebdc86d8467b2438c6082c7cc68c018` | Eclipse Temurin 21 JRE Alpine (136 MB) | 8080 |
| **PostgreSQL**| `postgres:18-alpine` | `sha256:1018733457011bf88d81db98cf43aac6d5150afc18787dbe204771fedf80ff95` | Alpine 15.2.0 (PostgreSQL 18.7) | 5432 |

- **Backend Executable JAR Checksum:**
  `1cf8afc6e284643a7545986b2789f1ea7c4e34b7522390229199eaf6c1a4ac13`  
  Verified on host `/opt/mect/backend/target/mahavir-backend-0.1.0-SNAPSHOT.jar` and inside container `/app/mahavir-backend.jar`.

---

## 3. Database State & Backup Manifest

- **Database Engine:** PostgreSQL 18.7
- **Database Name:** `mect_db`
- **Flyway Version:** V11 (`V11__donation_ecosystem_cms_and_rbac.sql`)
- **Total Tables:** 29
- **Pre-Deployment Backup Dump:**
  - File: `/var/backups/mect/mect_db_backup_20261113_100627.dump`
  - Size: 136 KB
  - Checksum (SHA-256): `5b0ff2ffdf0b58c4fa0d3d28e54d28a606a954c756b720e514133ccdd0c8be7e`
  - TOC Entries: 305

