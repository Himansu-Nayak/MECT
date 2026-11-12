# Third-Party UI & Motion Libraries (`THIRD_PARTY.md`)

This file records the exact packages, registries, versions, licences, and usage boundaries for third-party motion and UI libraries used in the MECT website (`https://mect.org.in`).

| Library / Registry | Version / Source | Licence | Role in MECT |
| :--- | :--- | :--- | :--- |
| **Motion** (`motion`) | `12.43.0` ([motion.dev](https://motion.dev)) | MIT | React UI transitions (`LazyMotion`, `AnimatePresence`, `layoutId`, hover/press, `useScroll`, `whileInView`, shared springs). Free & open-source APIs only (no paid Motion+ / Studio). |
| **Anime.js** (`animejs`) | `4.5.0` ([animejs.com](https://animejs.com)) | MIT | SVG line drawing (`createDrawable`), motion paths (`createMotionPath`), `stagger` grids, number count-ups, and scroll-synced SVGs (`onScroll`, `createScope`). |
| **Kokonut UI** (`@kokonutui` shadcn registry) | `https://kokonutui.com/r/{name}.json` | MIT | Open-source shadcn components copied as owned source into `src/components/`. Paid Kokonut UI Pro items are excluded. |
| **Bklit UI** (`@bklit` shadcn registry) | `https://ui.bklit.com/r/{name}.json` ([github.com/bklit/bklit-ui](https://github.com/bklit/bklit-ui)) | MIT (core registry packages) | Open-source shadcn-based data visualisation components for confirmed impact charts. Bklit Studio (proprietary `LICENSE-STUDIO.md`) is not used. |
