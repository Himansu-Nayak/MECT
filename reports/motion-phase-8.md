# PHASE M8 REPORT — Ask HIm(AI) Assistant

- **Phase:** `PHASE M8`
- **Branch:** `motion-ui`
- **Date:** 2026-11-12
- **Gate:** **PASS**

---

## Completed Tasks

- **M8.1** Updated `src/components/ai/HImChatbot.tsx` (`// motion: owner = Motion`) with `AnimatePresence` + `m.div` GPU-only modal entrance/exit (`opacity`, `y`, `scale`), 3-dot `ai-loading` status indicator (`role="status"`, `aria-live="polite"`), and `ai-prompt` composer styling.
- **M8.2** Added `ai-citations` institutional source links (`/statutory-disclosures`, `/governance`, `/programmes`) under assistant replies and added the visible footer disclaimer: `"This assistant can make mistakes. Check the Statutory Disclosures page."`
- **M8.3** Enforced `useReducedMotion()` across modal transitions and loading dots, and preserved `isOpen = false` default (never auto-opens).

## Verification

- `npm run lint`: **PASS** (exit `0`, 0 errors, 4 pre-existing upstream warnings in `src/components/charts/`)
- `npm run typecheck`: **PASS** (exit `0`)
- `npm run build`: **PASS** (exit `0`, 37/37 routes built)
- `npm run audit:motion -- --shots=reports/shots/m8`: **PASS** (exit `0`, `TOTAL FAILURES: 0` across 18 routes)
  - `REDUCED_MOTION`: **PASS** (`0`) | `NO_JS_CONTENT`: **PASS** (`0`) | `FORBIDDEN_PROPS`: **PASS** (`0`) | `SINGLE_OWNER`: **PASS** (`0`) | `BUNDLE_BUDGET`: **PASS** (`0`)
- **Home (`/`) First-Load JS:** `319.98 KB` gzipped (baseline `279.75 KB`, delta `40.23 KB`, within `<= 60.00 KB` budget)
- **Screenshots:** `reports/shots/m8-home-desktop.png`, `reports/shots/m8-home-mobile.png`

