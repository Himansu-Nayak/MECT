import { chromium } from 'playwright';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const VIEWPORTS = [
  { name: '320px (Mobile S)', width: 320, height: 568 },
  { name: '360px (Mobile M)', width: 360, height: 640 },
  { name: '390px (iPhone 12/13/14)', width: 390, height: 844 },
  { name: '430px (iPhone Pro Max)', width: 430, height: 932 },
  { name: '768px (Tablet Portrait)', width: 768, height: 1024 },
  { name: '1024px (Tablet Landscape)', width: 1024, height: 768 },
  { name: '1280px (Laptop)', width: 1280, height: 800 },
  { name: '1440px (Desktop)', width: 1440, height: 900 },
  { name: '1920px (Full HD)', width: 1920, height: 1080 },
];

const MOTION_MODES = [
  { name: 'reduced-motion: reduce', setting: 'reduce' },
  { name: 'reduced-motion: no-preference', setting: 'no-preference' },
];

const SECTIONS = [
  '#hero',
  '#institutional-intro',
  '#development-pillars',
  '#stories',
  '#institutional-impact',
];

async function runHydrationTest() {
  console.log(`Starting comprehensive MECT Homepage Hydration Regression Suite...`);
  console.log(`Target URL: ${BASE_URL}`);
  
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  const failureDetails = [];

  try {
    for (const motion of MOTION_MODES) {
      console.log(`\n======================================================`);
      console.log(`Testing Motion Mode: ${motion.name}`);
      console.log(`======================================================`);

      for (const vp of VIEWPORTS) {
        totalTests++;
        const testLabel = `[${motion.setting}] ${vp.name} (${vp.width}x${vp.height})`;
        process.stdout.write(`Testing ${testLabel}... `);

        const context = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
          reducedMotion: motion.setting,
        });

        const page = await context.newPage();

        const errors = [];
        const hydrationWarnings = [];

        page.on('console', (msg) => {
          const text = msg.text();
          const type = msg.type();
          if (type === 'error') {
            errors.push(`[Console Error] ${text}`);
          }
          if (
            text.toLowerCase().includes('hydration') ||
            text.toLowerCase().includes('did not match') ||
            text.toLowerCase().includes('server rendered html') ||
            text.toLowerCase().includes('minified react error #418') ||
            text.toLowerCase().includes('minified react error #423') ||
            text.toLowerCase().includes('minified react error #425')
          ) {
            hydrationWarnings.push(`[Hydration Mismatch Warning] ${text}`);
          }
        });

        page.on('pageerror', (err) => {
          errors.push(`[Page Error] ${err.message}`);
        });

        try {
          // Navigate to homepage
          const response = await page.goto(BASE_URL, {
            waitUntil: 'domcontentloaded',
            timeout: 15000,
          });

          if (!response || response.status() !== 200) {
            throw new Error(`Failed to load page. HTTP status: ${response ? response.status() : 'null'}`);
          }

          // Wait for load and hydration
          await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
          await page.waitForTimeout(1000);

          // Verify all 5 editorial sections exist in DOM
          for (const selector of SECTIONS) {
            const el = await page.$(selector);
            if (!el) {
              throw new Error(`Section selector "${selector}" not found in DOM`);
            }
          }

          // Check for horizontal overflow
          const overflow = await page.evaluate(() => {
            const body = document.body;
            const docEl = document.documentElement;
            const scrollWidth = Math.max(body.scrollWidth, docEl.scrollWidth);
            const clientWidth = docEl.clientWidth;
            return {
              hasOverflow: scrollWidth > clientWidth + 1,
              scrollWidth,
              clientWidth,
            };
          });

          if (overflow.hasOverflow) {
            errors.push(`Horizontal overflow detected: scrollWidth=${overflow.scrollWidth} > clientWidth=${overflow.clientWidth}`);
          }

          // Verify hero CTA presence & interactivity
          const heroCta = await page.$('a[href="#development-pillars"], a[href="/donate"], a[href="/programmes"]');
          if (!heroCta) {
            errors.push(`Hero CTA link not found`);
          }

          // Scroll through sections to ensure viewport reveals work without client throwing
          await page.evaluate(() => {
            window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'instant' });
          });
          await page.waitForTimeout(300);
          await page.evaluate(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
          });
          await page.waitForTimeout(300);

          // Check if any errors occurred
          const allIssues = [...errors, ...hydrationWarnings];
          if (allIssues.length > 0) {
            failedTests++;
            console.log(`FAILED!`);
            allIssues.forEach((issue) => console.log(`   -> ${issue}`));
            failureDetails.push({ testLabel, issues: allIssues });
          } else {
            passedTests++;
            console.log(`PASSED (0 errors, 0 hydration issues)`);
          }
        } catch (err) {
          failedTests++;
          console.log(`ERROR: ${err.message}`);
          failureDetails.push({ testLabel, issues: [err.message] });
        } finally {
          await context.close();
        }
      }
    }

    console.log(`\n======================================================`);
    console.log(`Regression Test Summary:`);
    console.log(`Total Scenarios: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`======================================================`);

    if (failedTests > 0) {
      console.error(`\nFailures detected:`);
      failureDetails.forEach((f) => {
        console.error(`- ${f.testLabel}:`);
        f.issues.forEach((i) => console.error(`    ${i}`));
      });
      process.exit(1);
    } else {
      console.log(`\nAll 18 scenarios PASSED with ZERO hydration errors!`);
      process.exit(0);
    }
  } finally {
    await browser.close();
  }
}

runHydrationTest();
