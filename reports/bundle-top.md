# Home (`/`) First-Load JS Bundle Analysis (`reports/bundle-top.md`)

**Measurement Method (Canonical — see `docs/MOTION.md`):**
Sum of `zlib.gzipSync(buffer).length` across all 16 unique `/_next/static/chunks/*.js` `<script src>` tags rendered in `/` (`279.75 KB` gzipped; `939,200` bytes raw; baseline saved in `reports/motion-baseline-bundle.txt`).

**Why `199.78 KB` vs `279.75 KB` appeared during M0:**
An early `task-6122` run read an incomplete/stale `.next` output before the clean `next build --webpack` completed (missing `polyfills` `38.70 KB` + `motion` chunk `4461` `38.21 KB`, totaling ~77 KB + smaller route chunks). Every clean production build on `motion-ui` (`reports/motion-baseline-bundle.txt` and `@next/bundle-analyzer`) measures **`279.75 KB` gzipped** (`16` chunks).

## Top 10 Largest Module Contributors to `/` First-Load JS
Extracted from `.next/analyze/client.html` (`@next/bundle-analyzer`) filtered strictly to the 16 chunks loaded by `/`:

| Rank | Gzipped | Parsed | Module | Chunk |
| :---: | ---: | ---: | :--- | :--- |
| 1 | 62.36 KB | 198.86 KB | `react-dom-client.production.js` (`next/dist/compiled/react-dom`) | `static/chunks/4bd1b696-e199e788e58acf79.js` |
| 2 | 13.18 KB | 55.81 KB | `src/app/page.tsx` + 7 concatenated modules | `static/chunks/app/page-7afc69af76894052.js` |
| 3 | 7.63 KB | 23.59 KB | `react-server-dom-webpack-client.browser.production.js` | `static/chunks/3794-76809258438a3d8c.js` |
| 4 | 6.23 KB | 19.52 KB | `next/dist/client/components/segment-cache/cache.js` | `static/chunks/3794-76809258438a3d8c.js` |
| 5 | 6.16 KB | 19.06 KB | `motion/dist/es/react.mjs` + 248 modules (`create-projection-node.mjs`) | `static/chunks/4461-befd70f718b91343.js` |
| 6 | 6.02 KB | 15.22 KB | `src/components/ai/HImChatbot.tsx` + 2 modules | `static/chunks/app/layout-637e8808e68d92d6.js` |
| 7 | 3.89 KB | 9.67 KB | `next/dist/client/components/render-tree.js` | `static/chunks/3794-76809258438a3d8c.js` |
| 8 | 3.87 KB | 13.67 KB | `next/dist/client/components/segment-cache/scheduler.js` | `static/chunks/3794-76809258438a3d8c.js` |
| 9 | 3.38 KB | 13.06 KB | `src/components/Header.tsx` + 1 module | `static/chunks/app/layout-637e8808e68d92d6.js` |
| 10 | 3.35 KB | 11.87 KB | `src/components/sections/SbiDonationSection.tsx` | `static/chunks/1410-fdd6e670307e5062.js` |

> Note: Chunk `4461-befd70f718b91343.js` (`38.21 KB` gzipped total) bundles `motion` (`framer-motion` / `motion-dom`) eagerly because `MotionPrimitives.tsx` currently imports `motion` directly instead of `LazyMotion` + `domAnimation` + `m` (which will be addressed in **Phase M1.1**).

