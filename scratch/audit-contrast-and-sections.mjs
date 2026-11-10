import { chromium } from "file:///C:/Users/himan/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";
import fs from "node:fs";
import path from "node:path";

const BASE = "http://localhost:3000";
const ROUTES = [
  "/",
  "/about",
  "/governance",
  "/programmes",
  "/impact",
  "/donate",
  "/csr-partnerships",
  "/statutory-disclosures",
  "/reports",
  "/contact",
];

const auditDir = path.join(process.cwd(), "public", "images", "audit");
fs.mkdirSync(auditDir, { recursive: true });

async function main() {
  const browser = await chromium.launch({ channel: "msedge" });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      for (let y = 0; y <= document.body.scrollHeight; y += 900) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 40));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(250);

    const slug = route === "/" ? "home" : route.slice(1).replace(/\//g, "-");
    await page.screenshot({ path: path.join(auditDir, `audit-${slug}-1440.png`) });

    const report = await page.evaluate(() => {
      function parseRgb(str) {
        const m = str && str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (!m) return null;
        return { r: +m[1], g: +m[2], b: +m[3], a: m[4] !== undefined ? +m[4] : 1 };
      }
      function blend(fg, bg) {
        const a = fg.a;
        return {
          r: Math.round(fg.r * a + bg.r * (1 - a)),
          g: Math.round(fg.g * a + bg.g * (1 - a)),
          b: Math.round(fg.b * a + bg.b * (1 - a)),
          a: 1,
        };
      }
      function getEffectiveBg(el) {
        const chain = [];
        let cur = el;
        while (cur && cur.nodeType === 1) {
          const c = parseRgb(getComputedStyle(cur).backgroundColor);
          if (c && c.a > 0) chain.unshift(c);
          cur = cur.parentElement;
        }
        let acc = { r: 243, g: 228, b: 210, a: 1 }; // #F3E4D2 Warm Cream base
        for (const layer of chain) acc = layer.a === 1 ? layer : blend(layer, acc);
        return acc;
      }
      function lum({ r, g, b }) {
        const f = (v) => {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
      }
      function contrast(c1, c2) {
        const l1 = lum(c1), l2 = lum(c2);
        return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      }
      function toHex({ r, g, b }) {
        return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("").toUpperCase();
      }

      // Section background rhythm
      const sections = Array.from(document.querySelectorAll("main section, footer")).map((s, idx) => {
        const bg = parseRgb(getComputedStyle(s).backgroundColor);
        const hex = bg ? toHex(bg) : "transparent";
        const isDark = bg ? lum(bg) < 0.25 : false;
        return {
          idx,
          tag: s.tagName,
          id: s.id || "",
          bgHex: hex,
          isDark,
        };
      });

      // Contrast audit on visible text nodes
      const lowContrast = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        if (!node.nodeValue || !node.nodeValue.trim()) continue;
        const el = node.parentElement;
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        const cs = getComputedStyle(el);
        // Skip hidden elements or elements inside hidden/opacity-0 ancestors (e.g. collapsed hover dock labels)
        let isHidden = false;
        let curVis = el;
        while (curVis && curVis.nodeType === 1) {
          const vcs = getComputedStyle(curVis);
          if (vcs.visibility === "hidden" || vcs.display === "none" || parseFloat(vcs.opacity) < 0.2) {
            isHidden = true;
            break;
          }
          curVis = curVis.parentElement;
        }
        if (isHidden) continue;

        const fgRaw = parseRgb(cs.color);
        if (!fgRaw) continue;
        const bg = getEffectiveBg(el);
        const fg = fgRaw.a < 1 ? blend(fgRaw, bg) : fgRaw;
        const ratio = contrast(fg, bg);
        const fontSize = parseFloat(cs.fontSize);
        const isBold = parseInt(cs.fontWeight, 10) >= 700;
        const isLarge = fontSize >= 24 || (fontSize >= 18.66 && isBold);
        const minReq = isLarge ? 3.0 : 4.5;

        if (ratio < minReq) {
          lowContrast.push({
            ratio: Number(ratio.toFixed(2)),
            minReq,
            fontSize: Math.round(fontSize),
            fg: toHex(fg),
            bg: toHex(bg),
            text: node.nodeValue.trim().slice(0, 50),
            cls: (typeof el.className === "string" ? el.className : "").slice(0, 80),
          });
        }
      }

      return {
        sectionCount: sections.length,
        sections,
        lowContrastCount: lowContrast.length,
        lowContrast: lowContrast.slice(0, 15),
      };
    });

    console.log(`\n=== ${route} | sections=${report.sectionCount} | lowContrast=${report.lowContrastCount} ===`);
    console.log("  Rhythm:", report.sections.map((s) => `${s.tag}${s.id ? "#" + s.id : ""}:${s.bgHex}${s.isDark ? "(DARK)" : ""}`).join(" -> "));
    if (report.lowContrast.length > 0) {
      console.log("  LOW CONTRAST SAMPLES:", JSON.stringify(report.lowContrast, null, 2));
    }
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

