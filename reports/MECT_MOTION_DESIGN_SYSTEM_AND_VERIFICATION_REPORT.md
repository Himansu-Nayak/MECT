# MECT — Motion Design System, Cinematic Experience, Accessibility & Production Deployment Certification Report

**Project:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production URL:** [https://mect.org.in/](https://mect.org.in/)  
**Target Infrastructure:** Hostinger VPS `<PROD_HOSTNAME>` (`<PROD_VPS_IP>`)  
**Deployment Container:** `mect-frontend` (Port 3001 -> 3000)  
**Co-Hosted Application:** `oho_tech` on port 3000 (PID 416801, preserved untouched)  
**Execution Status:** Fully Completed, Tested, Deployed, and Verified Live  

---

## 1. Executive Summary

This engineering operation successfully upgraded the digital presence of the **Mahaveer Educational & Charitable Trust (MECT)** into a cohesive, high-performance, accessible institutional experience. 

Rather than superficial decoration, the upgrade establishes an intentional, dignified motion language adhering to strict institutional aesthetics, WCAG 2.2.2 accessibility standards, and responsive performance budgets across all 45 Next.js routes.

```
       ┌────────────────────────────────────────────────────────┐
       │               MECT MOTION DESIGN SYSTEM                │
       └───────────────────────────┬────────────────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
         ▼                         ▼                         ▼
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Motion Tokens   │     │  Accessibility   │     │ Cinematic Pages  │
│  & Primitives    │     │  & WCAG 2.2.2    │     │ & Micro-States   │
│  • Institutional │     │  • Pause/Resume  │     │ • Hero Count-Up  │
│    Easing Curves │     │    Ticker Bind   │     │ • Hanuman Murti  │
│  • 12px Rise     │     │  • Marquee Loop  │     │ • CSR & Registry │
│  • CountUpStat   │     │    aria-hidden   │     │ • Active Press   │
│  • ReducedMotion │     │  • Accordion     │     │   Feedback       │
│    Instant Render│     │    ARIA Regions  │     │   (0.98 Scale)   │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

---

## 2. Motion Design Architecture & Standardized Tokens

All motion primitives were centralized and refactored in [`src/components/ui/MotionPrimitives.tsx`](file:///<WORKSPACE_DIR>/src/components/ui/MotionPrimitives.tsx):

### Standardized Easing Curves
- **Institutional (`[0.22, 1, 0.36, 1]`):** High-tension decel for editorial entrances, cards, and modal sheets.
- **Gentle (`[0.25, 0.1, 0.25, 1]`):** Symmetrical smooth curve for natural fades and opacity adjustments.
- **Editorial (`[0.16, 1, 0.3, 1]`):** Dramatic, deliberate curve for large typography and hero announcements.
- **EaseOut (`[0.33, 1, 0.68, 1]`):** Rapid response curve for micro-interactions and button click feedback.

### Standardized Durations & Distances
- **Durations:** `micro: 0.15s`, `button: 0.18s`, `fast: 0.22s`, `standard: 0.44s`, `editorial: 0.58s`, `slow: 0.65s`, `countUp: 800ms`.
- **Distances:** `micro: 6px`, `standard: 12px` (reduced from 18px for tighter, dignified rise without bounce), `editorial: 18px`, `large: 24px`.
- **Viewport Trigger:** `amount: 0.12` (triggers when 12% of element enters viewport) with `once: true` to prevent repetitive re-triggering during scroll reversals.

### Tabular-Figure Number Count-Up (`CountUpStat`)
Integrated in hero metrics and programme ribbons:
- Utilizes cubic ease-out curve (`1 - Math.pow(1 - progress, 3)`).
- Enforces `tabular-nums` CSS class to eliminate horizontal layout shifts during counting.
- Detects `useReducedMotion()` to immediately render final numeric string without animation.

---

## 3. Accessibility & WCAG 2.2.2 Compliance

1. **Statutory Announcement Ticker Pause/Resume:**
   - In [`src/components/layout/StatutoryTicker.tsx`](file:///<WORKSPACE_DIR>/src/components/layout/StatutoryTicker.tsx), the interactive pause toggle is directly bound to the marquee style:
     ```tsx
     style={{ animationPlayState: isPaused ? "paused" : undefined }}
     ```
   - Features accessible `aria-pressed={isPaused}` and dynamic `aria-label` ("Pause announcement ticker" / "Resume announcement ticker").
2. **Accreditation Marquee Assistive Tech Safeguards:**
   - In [`src/components/InstitutionalMarquee.tsx`](file:///<WORKSPACE_DIR>/src/components/InstitutionalMarquee.tsx), duplicate loop elements carry `aria-hidden="true"` and `inert={true}` to prevent screen readers from reading credentials twice.
   - Includes interactive pause/resume control with accessible keyboard focus rings.
3. **Accordion ARIA 4.1.2 Relationships:**
   - In [`src/components/Accordion.tsx`](file:///<WORKSPACE_DIR>/src/components/Accordion.tsx), buttons are explicitly tied to panels via `aria-controls={panelId}` and panels to triggers via `id={panelId}`, `role="region"`, and `aria-labelledby={buttonId}`.
4. **Instantaneous Reduced-Motion Fallback:**
   - In `MotionPrimitives.tsx`, when `useReducedMotion()` returns true, components immediately output static DOM nodes (`style={{ opacity: 1, transform: "none" }}`) with zero delays or hidden initial states, preventing blank flashes or hydration mismatches.

---

## 4. Subpage Choreography & Micro-Interactions

| Page / Component | Choreography Implementation | Micro-Interaction Refinement |
| :--- | :--- | :--- |
| **Cinematic Hero** | Replaced bounce chevron with subtle hover displacement (`group-hover:translate-y-1`); `<CountUpStat>` for metrics. | High-contrast focus outlines, smooth video/image crossfade. |
| **Hanuman Murti Campaign** | Staggered 3 architectural concept cards; wrapped hero visual in editorial reveal; interactive accordion for FAQ. | Contribution presets with `active:scale-[0.98]` tactile press. |
| **Programmes & Pillars** | Staggered pillar overview cards; `<CountUpStat>` in the impact ribbon. | Dignified card hover elevation (`hover:border-sand`). |
| **Governance & Leadership** | Staggered board of trustees and fiduciary charter cards. | Focus-visible indicators on document downloads. |
| **CSR Partnerships** | Staggered 4 Schedule-VII turnkey tracks and 3 fiduciary guarantee cards. | Clean smooth transitions on corporate inquiry actions. |
| **Volunteer Registry** | Staggered participation opportunity cards and status badges. | Tactile button press feedback and accessible status legends. |
| **Donation Experience** | Smooth 5-step progress navigation with step indicators. | Preset amount buttons with `active:scale-[0.98]` and border feedback. |

---

## 5. Pre-Flight Quality Gates (Local Workspace)

All automated validation gates executed cleanly:

| Gate | Command | Result | Details |
| :--- | :--- | :--- | :--- |
| **Unresolved Markers** | `node scripts/check-confirm.mjs` | **PASS (0)** | 0 unconfirmed/forbidden markers found. |
| **TypeScript Validation** | `npm run typecheck` | **PASS (0)** | Clean compilation across all TypeScript files. |
| **ESLint Audit** | `npm run lint` | **PASS (0 errors)** | 0 errors across entire workspace. |
| **Next.js Production Build** | `npm run build` | **PASS (45/45)** | Prerendered all 45 static routes in Next.js 16.4.6. |
| **Motion QA Suite** | `node scripts/motion_qa_suite.mjs` | **PASS (39/39)** | Verified tokens, CSS, ticker style bindings, and ARIA attributes. |

---

## 6. Hostinger VPS Production Deployment

### Deployment Protocol
1. Packaged production assets: `tar -czf frontend_update.tar.gz src content public scripts package.json package-lock.json next.config.ts tsconfig.json eslint.config.mjs Dockerfile`
2. Securely transmitted to Hostinger VPS: `scp frontend_update.tar.gz <DEPLOY_USER>@<PROD_VPS_IP>:/opt/mect/`
3. Extracted to `/opt/mect/frontend` and restored file permissions (`chown -R mect:mect`).
4. Rebuilt production Docker image:
   ```bash
   cd /opt/mect && docker compose -f compose.production.yaml --env-file .env.production build mect-frontend
   ```
5. Recreated and started frontend container:
   ```bash
   docker compose -f compose.production.yaml --env-file .env.production up -d --no-deps mect-frontend
   ```

### Container & Infrastructure Health Check
- `mect-frontend`: **Up (healthy)** on `127.0.0.1:3001->3000/tcp`
- `mect-backend`: **Up (healthy)** on `127.0.0.1:8081->8080/tcp`
- `mect-postgres`: **Up (healthy)** on `127.0.0.1:5433->5432/tcp`
- **Co-Hosted Safety:** `oho_tech` on port 3000 (PID 416801, 4+ days uptime) **remained completely uninterrupted**.

---

## 7. Live Production Verification (`https://mect.org.in`)

An automated probe was executed against all 18 primary public routes on the live domain:

```
Route                             Status    New Ticker    Old Ticker Traces
---------------------------------------------------------------------------
/                                 200 OK    VERIFIED      NONE DETECTED
/about                            200 OK    VERIFIED      NONE DETECTED
/programmes                       200 OK    VERIFIED      NONE DETECTED
/donate                           200 OK    VERIFIED      NONE DETECTED
/contact                          200 OK    VERIFIED      NONE DETECTED
/governance                       200 OK    VERIFIED      NONE DETECTED
/statutory-disclosures            200 OK    VERIFIED      NONE DETECTED
/reports                          200 OK    VERIFIED      NONE DETECTED
/impact                           200 OK    VERIFIED      NONE DETECTED
/csr-partnerships                 200 OK    VERIFIED      NONE DETECTED
/faq                              200 OK    VERIFIED      NONE DETECTED
/privacy                          200 OK    VERIFIED      NONE DETECTED
/terms                            200 OK    VERIFIED      NONE DETECTED
/accessibility                    200 OK    VERIFIED      NONE DETECTED
/volunteer                        200 OK    VERIFIED      NONE DETECTED
/scholarships                     200 OK    VERIFIED      NONE DETECTED
/campaigns                        200 OK    VERIFIED      NONE DETECTED
/campaigns/hanuman-murti          200 OK    VERIFIED      NONE DETECTED
```

**Live Content Integrity Check:**
- Confirmed zero exposure of private bank account numbers, IFSC codes, or manual UPI handles.
- Confirmed exact approved statutory impact phrasing:
  - *"350+ recorded student participation entries (FY 2023–24)"*
  - *"120+ cumulative vocational course enrolments (FY 2021–23)"*
  - *"10,000+ recorded water and relief service instances"*
  - *"Proposed target — up to 200 students... Confirmed funded places currently stand at zero"*
- Confirmed neutral statutory tax disclosures with zero unverified current-year 80G deduction promises.
