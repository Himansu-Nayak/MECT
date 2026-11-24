import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const PORT = 3005;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const OUTPUT_DIR = path.resolve('audit/feature_branch_local');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 1. Synchronize static & public assets into standalone directory
const publicSrc = path.resolve('public');
const publicDest = path.resolve('.next/standalone/public');
const staticSrc = path.resolve('.next/static');
const staticDest = path.resolve('.next/standalone/.next/static');

console.log('Ensuring static assets exist in .next/standalone...');
if (fs.existsSync(publicSrc)) {
  fs.cpSync(publicSrc, publicDest, { recursive: true });
}
if (fs.existsSync(staticSrc)) {
  fs.mkdirSync(path.dirname(staticDest), { recursive: true });
  fs.cpSync(staticSrc, staticDest, { recursive: true });
}

// 2. Start local Next.js standalone server
console.log(`Starting local Next.js standalone server on port ${PORT}...`);
const standaloneCwd = path.resolve('.next/standalone');
const serverProcess = spawn('node', ['server.js'], {
  cwd: standaloneCwd,
  stdio: 'pipe',
  env: {
    ...process.env,
    PORT: String(PORT),
    HOSTNAME: '127.0.0.1',
    NODE_ENV: 'production'
  }
});

serverProcess.stdout.on('data', (d) => {
  const str = d.toString();
  if (str.includes('Ready') || str.includes('started')) {
    console.log(`[Next.js Server] ${str.trim()}`);
  }
});

serverProcess.stderr.on('data', (d) => {
  console.error(`[Next.js Error] ${d.toString().trim()}`);
});

function waitForServer(url, timeout = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    function check() {
      const req = http.get(url, (res) => {
        if (res.statusCode === 200) {
          resolve();
        } else {
          setTimeout(check, 500);
        }
      });
      req.on('error', () => {
        if (Date.now() - start > timeout) {
          reject(new Error(`Server failed to start within ${timeout}ms`));
        } else {
          setTimeout(check, 500);
        }
      });
    }
    check();
  });
}

const VIEWPORTS = [
  { name: '320px-mobile-compact', width: 320, height: 600 },
  { name: '360px-mobile-android', width: 360, height: 740 },
  { name: '375px-mobile-standard', width: 375, height: 667 },
  { name: '390px-mobile-modern', width: 390, height: 844 },
  { name: '430px-mobile-large', width: 430, height: 932 },
  { name: '768px-tablet-portrait', width: 768, height: 1024 },
  { name: '1024px-tablet-landscape', width: 1024, height: 768 },
  { name: '1280px-desktop-compact', width: 1280, height: 800 },
  { name: '1440px-desktop-standard', width: 1440, height: 900 },
  { name: '1920px-desktop-widescreen', width: 1920, height: 1080 }
];

const ROUTES = [
  { path: '/', name: 'homepage' },
  { path: '/about', name: 'about' },
  { path: '/governance', name: 'governance' },
  { path: '/programmes', name: 'programmes' },
  { path: '/campaigns', name: 'campaigns' },
  { path: '/donate', name: 'donate' },
  { path: '/contact', name: 'contact' }
];

async function runAudit() {
  await waitForServer(`${BASE_URL}/`);
  console.log(`Server responded with 200 OK at ${BASE_URL}. Launching Playwright...`);

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const summary = {
    testTimestamp: new Date().toISOString(),
    testedServer: BASE_URL,
    branch: 'feat/complete-website-redefinition-and-deduplication',
    results: [],
    founderImageVerification: [],
    consoleErrorsRecorded: []
  };

  try {
    for (const vp of VIEWPORTS) {
      console.log(`\n======================================================`);
      console.log(`TESTING VIEWPORT: ${vp.name} (${vp.width}x${vp.height})`);
      console.log(`======================================================`);

      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
      });

      for (const route of ROUTES) {
        const page = await context.newPage();
        const consoleErrors = [];
        const consoleLogs = [];

        page.on('console', (msg) => {
          if (msg.type() === 'error') {
            consoleErrors.push({ text: msg.text(), location: msg.location() });
            summary.consoleErrorsRecorded.push({
              viewport: vp.name,
              route: route.path,
              error: msg.text(),
              location: msg.location()
            });
          } else {
            consoleLogs.push(msg.text());
          }
        });

        page.on('pageerror', (err) => {
          consoleErrors.push({ text: err.message, stack: err.stack });
          summary.consoleErrorsRecorded.push({
            viewport: vp.name,
            route: route.path,
            error: err.message,
            stack: err.stack
          });
        });

        const targetUrl = `${BASE_URL}${route.path}`;
        let responseStatus = 0;

        try {
          const res = await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });
          responseStatus = res ? res.status() : 0;
        } catch (e) {
          console.error(`Failed to navigate to ${targetUrl}: ${e.message}`);
        }

        // Scroll page incrementally to trigger all lazy-loaded images and motion reveals
        await page.evaluate(async () => {
          await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 400;
            const timer = setInterval(() => {
              const scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;

              if (totalHeight >= scrollHeight) {
                clearInterval(timer);
                window.scrollTo(0, 0); // scroll back to top
                setTimeout(resolve, 800);
              }
            }, 120);
          });
        });

        // Ensure all rendered images have attempted decode / load
        await page.evaluate(async () => {
          const imgs = Array.from(document.querySelectorAll('img'));
          await Promise.allSettled(
            imgs.map((img) => {
              if (img.complete && img.naturalWidth > 0) return Promise.resolve();
              return new Promise((res) => {
                img.addEventListener('load', () => res(), { once: true });
                img.addEventListener('error', () => res(), { once: true });
                setTimeout(res, 2500);
              });
            })
          );
        });

        // Check horizontal overflow
        const hasOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > window.innerWidth;
        });

        // Inspect images on page
        const imageStats = await page.evaluate(() => {
          const imgs = Array.from(document.querySelectorAll('img'));
          let broken = [];
          imgs.forEach((img) => {
            const isLoaded = img.complete && img.naturalWidth > 0;
            if (!isLoaded) {
              broken.push({
                src: img.src,
                alt: img.alt,
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight,
                complete: img.complete
              });
            }
          });
          return { total: imgs.length, brokenCount: broken.length, broken };
        });

        // Capture screenshot
        const screenshotFileName = `${route.name}-${vp.name}.png`;
        const screenshotFilePath = path.join(OUTPUT_DIR, screenshotFileName);
        await page.screenshot({ path: screenshotFilePath, fullPage: true });

        // Founder image inspection on relevant pages
        if (route.path === '/governance' || route.path === '/about' || route.path === '/') {
          const founderInfo = await page.evaluate(() => {
            const founderImgs = Array.from(document.querySelectorAll('img')).filter((img) =>
              (img.src && img.src.includes('er-japabandhu-kampa')) ||
              (img.alt && img.alt.includes('Japabandhu Kampa'))
            );
            return founderImgs.map((img) => ({
              src: img.src,
              currentSrc: img.currentSrc,
              alt: img.alt,
              naturalWidth: img.naturalWidth,
              naturalHeight: img.naturalHeight,
              complete: img.complete,
              displayWidth: img.clientWidth,
              displayHeight: img.clientHeight,
              visible: img.offsetWidth > 0 && img.offsetHeight > 0
            }));
          });

          if (founderInfo.length > 0) {
            summary.founderImageVerification.push({
              viewport: vp.name,
              route: route.path,
              images: founderInfo
            });
            console.log(`[Founder Image on ${route.path} @ ${vp.name}]:`, JSON.stringify(founderInfo[0]));
          }
        }

        const routeResult = {
          viewport: vp.name,
          width: vp.width,
          page: route.name,
          url: targetUrl,
          status: responseStatus,
          overflow: hasOverflow,
          brokenImagesCount: imageStats.brokenCount,
          brokenImages: imageStats.broken,
          consoleErrorsCount: consoleErrors.length,
          consoleErrors,
          screenshot: screenshotFileName
        };

        summary.results.push(routeResult);
        console.log(`- ${route.path.padEnd(15)} | HTTP ${responseStatus} | Overflow: ${hasOverflow ? 'FAIL' : 'PASS'} | Images: ${imageStats.total - imageStats.brokenCount}/${imageStats.total} OK | Errors: ${consoleErrors.length}`);
        await page.close();
      }

      await context.close();
    }

    // Save final report
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'acceptance_summary.json'),
      JSON.stringify(summary, null, 2),
      'utf8'
    );
    console.log(`\nLocal acceptance verification finished. Summary written to ${OUTPUT_DIR}/acceptance_summary.json`);

  } finally {
    await browser.close();
    serverProcess.kill('SIGTERM');
    console.log('Server process terminated.');
  }
}

runAudit().catch((err) => {
  console.error('Audit run failed:', err);
  serverProcess.kill('SIGTERM');
  process.exit(1);
});
