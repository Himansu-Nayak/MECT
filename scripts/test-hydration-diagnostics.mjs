import { chromium } from "playwright";

async function testHydration(reducedMotionOption) {
  console.log(`\n=== Testing Hydration with reducedMotion: '${reducedMotionOption}' ===`);
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext({
    reducedMotion: reducedMotionOption,
  });
  const page = await context.newPage();

  const consoleLogs = [];
  page.on("console", (msg) => {
    consoleLogs.push({ type: msg.type(), text: msg.text() });
  });
  page.on("pageerror", (err) => {
    consoleLogs.push({ type: "pageerror", text: err.message });
  });

  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  const errors = consoleLogs.filter(
    (l) =>
      l.type === "error" ||
      l.type === "pageerror" ||
      l.text.includes("hydration") ||
      l.text.includes("Hydration") ||
      l.text.includes("did not match") ||
      l.text.includes("didn't match")
  );

  console.log(`Found ${errors.length} errors/warnings:`);
  errors.forEach((e) => console.log(`[${e.type}] ${e.text}`));

  await browser.close();
}

async function main() {
  await testHydration("reduce");
  await testHydration("no-preference");
}

main().catch(console.error);
