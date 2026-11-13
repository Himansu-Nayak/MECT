# MECT Website Audit Report (AI / ChatGPT Review Packet)

Use this document alongside the attached live screenshots (`scratch/chatgpt-audit-ss/*.png`) when asking ChatGPT for UI/UX, accessibility, conversion, or engineering feedback on **Mahaveer Educational & Charitable Trust (MECT)**.

---

## 1. Project & Live Environment Context
- **Organisation:** Mahaveer Educational & Charitable Trust (MECT) — Registered Public Charitable Trust (Balangir, Odisha; Trust Deed No. `40311302194`, 27-07-2013)
- **Live Website:** `https://mect.org.in/` (verified commit `989e0da0344d3e1ffded971edbdfb6a2633d624f`)
- **Tech Stack:** Next.js `16.4.3` (App Router), React `19.3`, TypeScript, Tailwind CSS v4, `motion` (`12.4.7`), Spring Boot backend API (`/api/v1/`), PM2 + Nginx on Ubuntu VPS
- **Brand Palette:** Warm Cream (`#F3E4D2`), Forest Charcoal (`#283730` / `#1D2924`), Terracotta (`#A45E44` / `#874A35`), Champagne Sand (`#E5C499`)
- **Typography:** `Lora` (headings/serif), `Plus Jakarta Sans` (body/sans), `JetBrains Mono` (statutory/bank numerals)

---

## 2. Live Screenshot Inventory (Captured from `https://mect.org.in/`)

| View | File Path | Viewport | What It Shows |
|---|---|---|---|
| Desktop Hero | `scratch/chatgpt-audit-ss/desktop-home-hero.png` | `1440 x 900` | Header + statutory ticker, 7-slide left-to-right photographic hero, white/sand headline, 3 CTAs, legal notice, 4 impact metrics, right quick-action dock & AI chatbot FAB |
| Desktop Full Homepage | `scratch/chatgpt-audit-ss/desktop-home-full.png` | `1440 x 900` (Full Page) | Complete 19-section vertical flow from hero to footer |
| Desktop SBI QR Card | `scratch/chatgpt-audit-ss/desktop-sbi-qr.png` | `1440 x 900` | SBI Bank Credentials (`33341302498`, `SBIN0001701`), 3-step procedure, Static SBI Scan & Pay QR poster (`86971610172@sbi`), Copy UPI + Download PNG buttons |
| Desktop Donate Page | `scratch/chatgpt-audit-ss/desktop-donate.png` | `1440 x 900` | `/donate` PageHero (`Get Involved` active nav indicator), 80G historical tax notice strip, Smart One-Time Donation card |
| Mobile Hero | `scratch/chatgpt-audit-ss/mobile-home-hero.png` | `390 x 844` | Compact mobile statutory ticker + `View` link, header logo + trust name + `Donate` + hamburger, un-obscured landscape marquee strip (`HeroMobilePhotoStrip`), headline, symmetric 2+1 CTAs, disclosures |
| Mobile Full Homepage | `scratch/chatgpt-audit-ss/mobile-home-full.png` | `390 x 844` (Full Page) | Complete vertical mobile stack |
| Mobile SBI QR Card | `scratch/chatgpt-audit-ss/mobile-sbi-qr.png` | `390 x 844` | Single-column bank details cards, full-width buttons, crisp `238px` SBI QR card + Copy `86971610172@sbi` + Download PNG |
| Mobile Donate Page | `scratch/chatgpt-audit-ss/mobile-donate.png` | `390 x 844` | `/donate` responsive mobile header, breadcrumbs, badge, and stacked action buttons |

---

## 3. Observed Live Telemetry (`https://mect.org.in/`)
- **Desktop (`1440 x 900`):** `HTTP 200`, horizontal overflow `0` (`scrollWidth = 1440 === innerWidth = 1440`), `0 / 32` broken images, `CLS = 0`, LTR hero drift `+157.3px / 0.9s`, `0` console/HTTP errors.
- **Mobile (`390 x 844`):** `HTTP 200`, horizontal overflow `0` (`scrollWidth = 390 === innerWidth = 390`), `0 / 32` broken images, `CLS = 0`, LTR hero drift `+80.1px / 0.9s`, `0` console/HTTP errors.
- **Build & Regression Suite:** `npx tsc --noEmit` (`0` errors), `npm run lint` (`0` errors), `next build` (`37/37` static routes + `/api/ai/chat`, `/api/ai/health`).

---

## 4. What Is Working Well (Verified Strengths)
1. **Un-Obscured Mobile Hero Photography:** Dedicated landscape `HeroMobilePhotoStrip` renders full subjects (no chopped faces/torsos) scrolling left-to-right above crisp readable typography on `#1D2924`.
2. **Differentiated Purposeful Motion (`MotionPrimitives.tsx`):** Desktop active nav underline (`layoutId`), mobile drawer stagger, viewport `CountUpStat` (`13+`, `350+`, `120+`, `10,000+`, `200`), left/right editorial splits, staggered pillar grids, lazy certificate hover reveal, and stationary un-blurred SBI QR matrix; all honor `prefers-reduced-motion: reduce`.
3. **Transparent SBI Banking + Static QR (`86971610172@sbi`):** Crisp `952 x 1323` PNG poster (`mect-sbi-upi-qr.png`) shared identically across `/` and `/donate`, paired with one-tap copy, Download PNG, `"Static UPI QR"` label, and explicit instruction to log UTR references at `/donate#receipt-claim`.
4. **Mobile Chrome & Non-Obstructing FABs:** Header never overflows (`320px–430px`), statutory bar has a `View` button on mobile, and mobile floating dock/chatbot triggers stay hidden at `scrollY = 0` so CTAs remain unobstructed.

---

## 5. Honest Minor Issues Spotted in Fresh Live Screenshots (Good Topics for ChatGPT Review)
1. **Sticky Header Overlap on Hash Anchor Jump (`desktop-sbi-qr.png`):** Scrolling directly to `#donate-sbi` (`scroll-mt-20` = `80px`) leaves the top `~20px` of the green SBI banner tucked slightly behind the `~112px` sticky ticker+nav header; increasing `scroll-mt-20` -> `scroll-mt-32` would clear the full sticky header on anchor jumps.
2. **Floating Quick Dock / Chatbot Overlap Near Bottom Viewport (`mobile-sbi-qr.png`):** When scrolled down on mobile (`390px`), the bottom-right `QuickActionDock` and `HImChatbot` FAB buttons overlap the right edge of cards directly behind them at the bottom fold.
3. **Hero Metric Strip Fold on `390x844` (`mobile-home-hero.png`):** With the un-obscured mobile photo strip (`210px`) + full headline + paragraph + 3 CTAs + legal disclosures, the 4 impact numbers (`13+ Years`, `350+`, etc.) begin just below the `844px` fold rather than peeking inside the first screen.
4. **Hero Image Provenance Mix:** Slide 2 (`illustrative-child-support-outreach.webp`, `735 x 581`, from user-supplied `NGO PIC 2.jpg`) should ideally be replaced once an MECT-owned high-resolution field photograph with documented consent/rights is supplied.

---

## 6. Suggested Prompt to Paste Into ChatGPT
> *"Review these live desktop (`1440x900`) and mobile (`390x844`) screenshots plus the structured audit report for Mahaveer Educational & Charitable Trust (`https://mect.org.in/`). Evaluate visual hierarchy, NGO donor trust signals, mobile ergonomics, SBI UPI QR UX, and recommend concrete high-impact improvements without breaking brand identity."*

