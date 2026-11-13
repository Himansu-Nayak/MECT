# MECT — Authentication Redesign QA & Verification Report

**QA Date:** 2026-11-11

## 1. Automated Verification Results
- **Backend Test Suite (`cd backend && mvn test -B`):** `Tests run: 45, Failures: 0, Errors: 0, Skipped: 0` (`BUILD SUCCESS`, H2 PostgreSQL mode). Covers OTP security, `otp-v2.0` and `welcome-v2.0` centralized template assertions, welcome email deduplication (`WELCOME_USER:<id>` sent once on registration, never duplicated on returning login), cooldown `429`, attempt lockout, expired OTP rejection, unconfigured SMS/Resend `503` isolation, and zero `"RESEND"` error leakage.
- **TypeScript (`npx tsc --noEmit`):** Passed (`0` errors).
- **ESLint (`npm run lint`):** Passed (`0` errors, `0` warnings).
- **Production Build (`npm run build`):** Passed (`37/37` routes built cleanly, including `/portal/login`, `/portal/welcome`, `/portal/profile`, `/portal/dashboard`).
- **Phase Regression Runner (`node scratch/test-all-phases-regression.mjs`):** `16 Passed, 0 Failed (Total 16 Suites)`.

## 2. Live Browser, Responsive & Email Inspection (`chrome-devtools-mcp`)
- **Responsive Viewport Matrix (`overflow: false` verified on `/portal/login`):**
  - `320x700`: `scrollWidth=320`, `overflow=false` (visually inspected: single-line `Email`/`Phone` tabs, zero clipping)
  - `360x800`: `scrollWidth=360`, `overflow=false`
  - `390x844`: `scrollWidth=390`, `overflow=false`
  - `430x932`: `scrollWidth=430`, `overflow=false`
  - `768x900`: `scrollWidth=753`, `overflow=false`
  - `1024x800`: `scrollWidth=1009 === clientWidth=1009`, `overflow=false` (visually inspected after tightening header button labels)
  - `1366x800`: `scrollWidth=1351`, `overflow=false`
  - `1440x900`: visually inspected on both Step 1 (`Sign In or Create Account`) and Step 2 (segmented 6-box `Enter 6-Digit Verification Code` UI)
- **Live Authentication & Resend Delivery:**
  - `/portal/login` -> `delivered@resend.dev` triggered `ResendEmailService` -> **`HTTP 200 OK`**, `messageId=01a1c6f6-aa0f-729c-aac4-fbc64e5fe04e`, UI switched cleanly to the 6-box code entry screen (`"Verification code sent successfully. Please check your inbox."`).
  - Immediate resend inside cooldown returned `HTTP 429`; wrong code (`000000`) returned `HTTP 401` (`"That code doesn't match. Please check and try again."` in UI).
- **Rendered HTML Email Visual Inspection:**
  - Inspected `otp-v2.0` and `welcome-v2.0` HTML renders at `720x880` inside Chromium confirming emblem crispness, MECT Terracotta/Forest/Cream branding, legible monospace 6-digit OTP block, CTA button contrast, and verified Balangir address footer.

## 3. Running Local Environment Status
- Frontend Next.js running on `http://localhost:3000` (`task-3902`, `HTTP 200`).
- Backend Spring Boot running on `http://localhost:8080/api/v1` (`task-3797`, `HTTP 200`).

