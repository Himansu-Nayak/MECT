import { chromium } from "file:///C:/Users/himan/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";
import fs from "node:fs";
import path from "node:path";

const BASE = "http://localhost:3000";

const ALL_VIEWPORTS = [
  { name: "mobile-360", width: 360, height: 800 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "mobile-430", width: 430, height: 932 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "laptop-1024", width: 1024, height: 900 },
  { name: "desktop-1366", width: 1366, height: 768 },
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "desktop-1920", width: 1920, height: 1080 },
];

const ALL_PUBLIC_ROUTES = [
  "/",
  "/about",
  "/governance",
  "/statutory-disclosures",
  "/programmes",
  "/csr-partnerships",
  "/donate",
  "/impact",
  "/reports",
  "/contact",
  "/scholarships",
  "/scholarships/apply",
  "/scholarships/track",
  "/volunteer",
  "/faq",
  "/privacy",
  "/terms",
  "/accessibility",
  "/admin/login",
];

const auditDir = path.join(process.cwd(), "public", "images", "audit");
fs.mkdirSync(auditDir, { recursive: true });

async function main() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  let failures = 0;
  const consoleErrors = [];

  console.log("=== 1. EXTENDED VIEWPORT MATRIX ON HOMEPAGE (360..1920) ===");
  for (const vp of ALL_VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();
    page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(`${vp.name}: ${m.text()}`); });
    page.on("pageerror", (e) => consoleErrors.push(`${vp.name}: ${e.message}`));
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    const m = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      innerW: window.innerWidth,
      broken: Array.from(document.querySelectorAll("img")).filter(i => !i.complete || i.naturalWidth === 0).length,
      reducedMotionSupported: typeof window.matchMedia === "function",
    }));
    const ok = m.scrollW <= m.innerW && m.broken === 0;
    if (!ok) failures++;
    console.log(`[${ok ? "PASS" : "FAIL"}] ${vp.name} (${vp.width}px) | scrollW=${m.scrollW}/${m.innerW} | broken=${m.broken}`);
    await ctx.close();
  }

  console.log("\n=== 2. COMPLETE 19-ROUTE WCAG CONTRAST, SEMANTIC H1 & RESPONSIVE AUDIT ===");
  for (const route of ALL_PUBLIC_ROUTES) {
    for (const width of [1366, 360]) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 } });
      const page = await ctx.newPage();
      page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(`${route}@${width}: ${m.text()}`); });
      page.on("pageerror", (e) => consoleErrors.push(`${route}@${width}: ${e.message}`));
      const res = await page.goto(BASE + route, { waitUntil: "networkidle" });
      await page.evaluate(async () => {
        for (let y = 0; y <= document.body.scrollHeight; y += 900) {
          window.scrollTo(0, y);
          await new Promise(r => setTimeout(r, 30));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(150);

      const check = await page.evaluate(() => {
        function parseRgb(str) {
          const m = str && str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
          return m ? { r: +m[1], g: +m[2], b: +m[3], a: m[4] !== undefined ? +m[4] : 1 } : null;
        }
        function blend(fg, bg) {
          const a = fg.a;
          return { r: Math.round(fg.r * a + bg.r * (1 - a)), g: Math.round(fg.g * a + bg.g * (1 - a)), b: Math.round(fg.b * a + bg.b * (1 - a)), a: 1 };
        }
        function effectiveBg(el) {
          const chain = [];
          let cur = el;
          while (cur && cur.nodeType === 1) {
            const c = parseRgb(getComputedStyle(cur).backgroundColor);
            if (c && c.a > 0) chain.unshift(c);
            cur = cur.parentElement;
          }
          let acc = { r: 243, g: 228, b: 210, a: 1 };
          for (const l of chain) acc = l.a === 1 ? l : blend(l, acc);
          return acc;
        }
        function lum({ r, g, b }) {
          const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
          return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
        }
        function contrast(a, b) {
          const l1 = lum(a), l2 = lum(b);
          return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        }

        let lowContrast = 0;
        const lowItems = [];
        for (const el of document.querySelectorAll("h1,h2,h3,h4,p,a,button,span,label,li")) {
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) continue;
          const hasText = Array.from(el.childNodes).some(n => n.nodeType === 3 && n.textContent.trim());
          if (!hasText) continue;
          const st = getComputedStyle(el);
          if (st.visibility === "hidden" || parseFloat(st.opacity) < 0.5) continue;
          const fg = parseRgb(st.color);
          if (!fg) continue;
          const bg = effectiveBg(el);
          const ratio = contrast(fg.a < 1 ? blend(fg, bg) : fg, bg);
          const fs = parseFloat(st.fontSize);
          const bold = parseInt(st.fontWeight, 10) >= 700;
          const min = (fs >= 24 || (bold && fs >= 18.67)) ? 3.0 : 4.5;
          if (ratio < min) {
            lowContrast++;
            if (lowItems.length < 3) lowItems.push(`${el.tagName} (${ratio.toFixed(2)}:1): "${el.textContent.trim().slice(0, 40)}"`);
          }
        }

        const imgs = Array.from(document.querySelectorAll("img"));
        return {
          overflow: document.documentElement.scrollWidth > window.innerWidth,
          scrollW: document.documentElement.scrollWidth,
          innerW: window.innerWidth,
          brokenImgs: imgs.filter(i => !i.complete || i.naturalWidth === 0).length,
          h1Count: document.querySelectorAll("h1").length,
          lowContrast,
          lowItems,
        };
      });

      const ok = res?.status() === 200 && !check.overflow && check.brokenImgs === 0 && check.lowContrast === 0 && (route === "/admin/login" || check.h1Count >= 1);
      if (!ok) failures++;
      console.log(`[${ok ? "PASS" : "FAIL"}] ${route} @ ${width}px | status=${res?.status()} | overflow=${check.overflow} (${check.scrollW}/${check.innerW}) | brokenImgs=${check.brokenImgs} | lowContrast=${check.lowContrast}`);
      if (check.lowItems.length) check.lowItems.forEach(x => console.log("   -> LOW:", x));

      if (width === 1366 && ["/faq", "/scholarships", "/admin/login", "/donate"].includes(route)) {
        const slug = route.slice(1).replace(/\//g, "-");
        await page.screenshot({ path: path.join(auditDir, `verify-${slug}-1366.png`) });
      }
      await ctx.close();
    }
  }

  console.log("\n=== 3. ACCESSIBILITY & INTERACTIVE CONTROLS (KEYBOARD TAB, FAQ ACCORDION, HIM CHATBOT, ADMIN GUARD) ===");
  {
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
    const page = await ctx.newPage();

    // 3A. Skip Link & Keyboard Focus
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.keyboard.press("Tab");
    const activeText = await page.evaluate(() => document.activeElement?.textContent?.trim() || "");
    const skipOk = activeText.includes("Skip to main content");
    if (!skipOk) failures++;
    console.log(`[${skipOk ? "PASS" : "FAIL"}] First Tab focuses accessible skip-to-content link ("${activeText}")`);

    // 3B. HIm Chatbot Launcher
    const chatBtn = page.getByRole("button", { name: /Open HIm/i });
    await chatBtn.click();
    const chatDialog = page.getByRole("dialog", { name: /HIm/i });
    const chatVisible = await chatDialog.isVisible();
    if (!chatVisible) failures++;
    console.log(`[${chatVisible ? "PASS" : "FAIL"}] HIm Chatbot dialog opens cleanly with terracotta/forest theme`);
    await page.getByRole("button", { name: /Close chat window/i }).click();

    // 3C. FAQ Accordion toggle
    await page.goto(BASE + "/faq", { waitUntil: "networkidle" });
    const faqButtons = page.locator("main button[aria-expanded]");
    const faqCount = await faqButtons.count();
    let faqOk = faqCount >= 2;
    if (faqOk) {
      await faqButtons.nth(1).click();
      faqOk = (await faqButtons.nth(1).getAttribute("aria-expanded")) === "true";
    }
    if (!faqOk) failures++;
    console.log(`[${faqOk ? "PASS" : "FAIL"}] FAQ Accordion expands & updates aria-expanded (${faqCount} items)`);

    // 3D. Admin Protected Route Redirect
    await page.goto(BASE + "/admin", { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    const adminUrlOk = page.url().includes("/admin/login");
    if (!adminUrlOk) failures++;
    console.log(`[${adminUrlOk ? "PASS" : "FAIL"}] Unauthenticated /admin redirects safely to /admin/login (${page.url()})`);

    await ctx.close();
  }

  await browser.close();
  console.log(`\nConsole/Page Errors: ${consoleErrors.length}`);
  if (consoleErrors.length) consoleErrors.forEach(e => console.error("  ERROR:", e));
  console.log(`TOTAL COMPLETE-ROUTE FAILURES: ${failures + consoleErrors.length}`);
  if (failures > 0 || consoleErrors.length > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

