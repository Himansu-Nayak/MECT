import { chromium } from "playwright";
import { spawn } from "node:child_process";

const PORT = 3255;
const BASE_URL = `http://localhost:${PORT}`;

async function waitForServer(url, timeoutMs = 45000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.status < 500) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 600));
  }
  throw new Error(`Timeout waiting for server at ${url}`);
}

async function inspect() {
  const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
    shell: true,
    stdio: "inherit",
  });

  const cleanup = () => {
    try {
      if (process.platform === "win32") {
        spawn("taskkill", ["/pid", String(server.pid), "/f", "/t"], { shell: true });
      } else {
        server.kill();
      }
    } catch {}
  };

  process.on("exit", cleanup);
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  try {
    await waitForServer(BASE_URL);
    const browser = await chromium.launch({ channel: "msedge", headless: true });
    const viewports = [
      { name: "1440px", width: 1440, height: 900 },
      { name: "390px", width: 390, height: 844 },
    ];

    for (const vp of viewports) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      await page.goto(BASE_URL, { waitUntil: "networkidle" });

      const layout = await page.evaluate(() => {
        const hero = document.querySelector("section[aria-label='Institutional Introduction']");
        const h1 = document.querySelector("h1");
        const imgs = Array.from(hero?.querySelectorAll("img") || []);

        return {
          heroRect: hero?.getBoundingClientRect(),
          h1Rect: h1?.getBoundingClientRect(),
          imgs: imgs.map(img => ({
            alt: img.alt,
            src: img.src,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            rect: img.getBoundingClientRect(),
            opacity: window.getComputedStyle(img).opacity,
            parentOpacity: window.getComputedStyle(img.parentElement).opacity,
            grandparentOpacity: window.getComputedStyle(img.parentElement?.parentElement || img).opacity,
          })),
          windowHeight: window.innerHeight,
        };
      });

      console.log(`\n=== Layout for ${vp.name} ===`);
      console.log("H1 rect:", layout.h1Rect);
      console.log("Images:", JSON.stringify(layout.imgs, null, 2));
      await page.close();
    }
    await browser.close();
  } catch (e) {
    console.error(e);
  } finally {
    cleanup();
    process.exit(0);
  }
}

inspect();
