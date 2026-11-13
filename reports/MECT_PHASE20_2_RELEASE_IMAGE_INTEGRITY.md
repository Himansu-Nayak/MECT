# MECT PHASE 20.2 — RELEASE & DOCKER IMAGE INTEGRITY AUDIT

**Project:** MAHAVEER EDUCATIONAL & CHARITABLE TRUST (MECT)  
**Host Target:** Hostinger VPS `srv2000528` (`200.97.161.128`)  
**Deployment Directory:** `/opt/mect`  
**Audit Timestamp:** 2026-11-13T09:35:00Z (UTC)  
**Lead Auditor:** Release Verification Lead & DevSecOps Engineer  
**Status:** PASS — REPRODUCIBLE RELEASE LINEAGE CONFIRMED  

---

## 1. Git Commit Ancestry & Release Lineage

The active repository branch is `motion-ui`. The complete lineage connecting Phase 20 through Phase 20.2 is verified:

```
be7631da70ffc3ad4f0eb5e8d89e5cfd5952d4e3 (HEAD -> motion-ui)
  │ docs(phase20.1): production stabilization, financial integrity reconciliation, and disaster recovery certification
  │
2e025e64a132bc682a20b83e33b94236cf88478f
  │ feat(docker): production Docker orchestration, Nginx configs, backup scripts, and Phase 20 reports
  │
c7e63261a9fc55bf3607fa65b2611e9f196be4b0 (tag: v20.0-release)
  │ feat(release): MECT complete donation ecosystem, CMS security hardening, and release candidate [Phase 20]
  │
cb5b55486e4d8105a321554e579c972492f6f62d
    feat(phase19): MECT production release gate, payment integration hardening, and release certification
```

- **Phase 20 Base Release Commit:** `c7e63261a9fc55bf3607fa65b2611e9f196be4b0`
- **Phase 20 Docker Artifacts Commit:** `2e025e64a132bc682a20b83e33b94236cf88478f`
- **Phase 20.1 Evidence Closure Commit:** `be7631da70ffc3ad4f0eb5e8d89e5cfd5952d4e3`

---

## 2. Docker Container & Image Integrity Matrix

Captured live via `docker inspect`:

| Container Name | Running Image Tag | Image ID (SHA-256) | Digest / Base Distribution | Non-Root User |
|---|---|---|---|---|
| `mect-frontend` | `mect-frontend:production` | `sha256:ee64eb69b788e7dc8a91b9791f65b7e508f95d66ebc6c4049f32870a09b7562a` | Node 22 Alpine (Standalone Next.js 16) | `nextjs` (UID: 1001) |
| `mect-backend` | `mect-backend:production` | `sha256:9ba9aef36902b281f3785c40ef9ae1c77ebdc86d8467b2438c6082c7cc68c018` | Eclipse Temurin 21 JRE Alpine | `mect` (UID: 1001) |
| `mect-postgres` | `postgres:18-alpine` | `sha256:1018733457011bf88d81db98cf43aac6d5150afc18787dbe204771fedf80ff95` | PostgreSQL 18.7 Alpine | `postgres` (UID: 70) |

---

## 3. Cryptographic Build Artifact Verification

### 3.1 Backend Spring Boot Executable JAR
- **Host Build Artifact:** `/opt/mect/backend/target/mahavir-backend-0.1.0-SNAPSHOT.jar`
  - SHA-256 Checksum: `1cf8afc6e284643a7545986b2789f1ea7c4e34b7522390229199eaf6c1a4ac13`
- **Container Running Artifact:** `/app/mahavir-backend.jar` (inside `mect-backend`)
  - SHA-256 Checksum: `1cf8afc6e284643a7545986b2789f1ea7c4e34b7522390229199eaf6c1a4ac13`
- **Integrity Result:** **100% Exact Match**. The deployed container runs the exact compiled JAR from release commit `c7e6326`.

### 3.2 Frontend Standalone Distribution
- **Image Size:** 83.7 MB
- **Configuration:** Next.js `output: 'standalone'` mode. Copies `.next/standalone`, `.next/static`, and `public` assets cleanly into unprivileged container image.
- **Port:** Listens internally on port 3000, exposed exclusively to host loopback `127.0.0.1:3001`.

---

## 4. Working Tree Cleanliness

- **Local Working Tree:** `On branch motion-ui`, `nothing to commit, working tree clean`.
- **VPS Host Working Tree:** `/opt/mect` matches git release commit cleanly. Zero untracked or modified source files.

