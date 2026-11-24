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

function checkServer(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(2000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function waitForServer(url, timeout = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    function poll() {
      checkServer(url).then((ok) => {
        if (ok) return resolve();
        if (Date.now() - start > timeout) {
          reject(new Error(`Server failed to start within ${timeout}ms`));
        } else {
          setTimeout(poll, 500);
        }
      });
    }
    poll();
  });
}

const AUDITED_ROUTES = [
  { path: '/', name: 'homepage' },
  { path: '/about', name: 'about' },
  { path: '/governance', name: 'governance' },
  { path: '/programmes', name: 'programmes' },
  { path: '/campaigns', name: 'campaigns' },
  { path: '/campaigns/hanuman-murti', name: 'hanuman-murti' },
  { path: '/donate', name: 'donate' },
  { path: '/contact', name: 'contact' }
];

async function runLinkAndCtaAudit() {
  let serverProcess = null;
  const isRunning = await checkServer(`${BASE_URL}/`);

  if (!isRunning) {
    console.log(`Starting standalone server on port ${PORT}...`);
    // Ensure standalone assets are present
    const publicSrc = path.resolve('public');
    const publicDest = path.resolve('.next/standalone/public');
    const staticSrc = path.resolve('.next/static');
    const staticDest = path.resolve('.next/standalone/.next/static');
    if (fs.existsSync(publicSrc)) fs.cpSync(publicSrc, publicDest, { recursive: true });
    if (fs.existsSync(staticSrc)) {
      fs.mkdirSync(path.dirname(staticDest), { recursive: true });
      fs.cpSync(staticSrc, staticDest, { recursive: true });
    }

    serverProcess = spawn('node', ['server.js'], {
      cwd: path.resolve('.next/standalone'),
      stdio: 'pipe',
      env: { ...process.env, PORT: String(PORT), HOSTNAME: '127.0.0.1', NODE_ENV: 'production' }
    });

    await waitForServer(`${BASE_URL}/`);
    console.log(`Standalone server ready on port ${PORT}.`);
  } else {
    console.log(`Reusing existing running server on port ${PORT}.`);
  }

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const auditReport = {
    auditTimestamp: new Date().toISOString(),
    testedServer: BASE_URL,
    branch: 'feat/complete-website-redefinition-and-deduplication',
    summary: {
      totalRoutesAudited: AUDITED_ROUTES.length,
      linksInventoried: 0,
      totalLinksChecked: 0,
      totalInternalLinks: 0,
      totalInternalHashes: 0,
      externalLinksInventoried: 0,
      totalExternalLinks: 0,
      mailtoLinksInventoried: 0,
      totalMailtoLinks: 0,
      telLinksInventoried: 0,
      totalTelLinks: 0,
      unclassifiedLinksInventoried: 0,
      buttonsInventoried: 0,
      totalButtonsChecked: 0,
      buttonsInteractedWith: 0,
      completeWorkflowsSuccessfullyExecuted: 0,
      internalDestinationsValidated: 0,
      hashTargetsValidated: 0,
      brokenLinksCount: 0
    },
    routeAudits: [],
    brokenOrMissingDestinations: []
  };

  try {
    const page = await browser.newPage();

    for (const route of AUDITED_ROUTES) {
      console.log(`\nAuditing CTAs & Links on route: ${route.path} (${route.name})`);
      const targetUrl = `${BASE_URL}${route.path}`;
      const res = await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });
      const status = res ? res.status() : 0;

      // Extract all links and buttons
      const pageElements = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll('a[href]')).map((a) => ({
          tag: 'a',
          text: (a.textContent || '').trim().replace(/\s+/g, ' '),
          href: a.getAttribute('href') || '',
          resolvedHref: a.href,
          target: a.getAttribute('target') || null,
          rel: a.getAttribute('rel') || null,
          ariaLabel: a.getAttribute('aria-label') || null
        }));

        const buttons = Array.from(document.querySelectorAll('button')).map((b) => ({
          tag: 'button',
          text: (b.textContent || '').trim().replace(/\s+/g, ' '),
          type: b.getAttribute('type') || 'submit',
          disabled: b.disabled,
          ariaExpanded: b.getAttribute('aria-expanded') || null,
          ariaLabel: b.getAttribute('aria-label') || null
        }));

        return { anchors, buttons };
      });

      const routeResult = {
        route: route.path,
        httpStatus: status,
        totalAnchors: pageElements.anchors.length,
        totalButtons: pageElements.buttons.length,
        links: {
          internalRoutes: [],
          inPageHashes: [],
          internalRouteWithHash: [],
          external: [],
          mailto: [],
          tel: [],
          unclassified: []
        },
        buttons: pageElements.buttons,
        brokenOnThisPage: []
      };

      for (const a of pageElements.anchors) {
        auditReport.summary.totalLinksChecked++;
        auditReport.summary.linksInventoried++;
        const href = a.href;

        if (href.startsWith('mailto:')) {
          auditReport.summary.totalMailtoLinks++;
          auditReport.summary.mailtoLinksInventoried++;
          routeResult.links.mailto.push(a);
        } else if (href.startsWith('tel:')) {
          auditReport.summary.totalTelLinks++;
          auditReport.summary.telLinksInventoried++;
          routeResult.links.tel.push(a);
        } else if (href.startsWith('http://') || href.startsWith('https://')) {
          if (href.startsWith(BASE_URL)) {
            // Local full url treated as internal
            const pathOnly = href.replace(BASE_URL, '');
            if (pathOnly.includes('#')) {
              auditReport.summary.totalInternalHashes++;
              routeResult.links.internalRouteWithHash.push(a);
            } else {
              auditReport.summary.totalInternalLinks++;
              routeResult.links.internalRoutes.push(a);
            }
          } else {
            auditReport.summary.totalExternalLinks++;
            auditReport.summary.externalLinksInventoried++;
            routeResult.links.external.push(a);
          }
        } else if (href.startsWith('#')) {
          auditReport.summary.totalInternalHashes++;
          const hashTarget = href.slice(1);
          // Verify hash element exists on current page
          const targetExists = await page.evaluate((id) => {
            return document.getElementById(id) !== null || document.querySelector(`[name="${id}"]`) !== null;
          }, hashTarget);

          a.targetExists = targetExists;
          routeResult.links.inPageHashes.push(a);

          if (!targetExists) {
            const err = {
              sourcePage: route.path,
              linkText: a.text,
              target: href,
              error: `Target in-page element id="${hashTarget}" does not exist on ${route.path}`
            };
            routeResult.brokenOnThisPage.push(err);
            auditReport.brokenOrMissingDestinations.push(err);
            auditReport.summary.brokenLinksCount++;
          }
        } else if (href.startsWith('/')) {
          if (href.includes('#')) {
            auditReport.summary.totalInternalHashes++;
            routeResult.links.internalRouteWithHash.push(a);
          } else {
            auditReport.summary.totalInternalLinks++;
            routeResult.links.internalRoutes.push(a);
          }
        } else {
          auditReport.summary.unclassifiedLinksInventoried++;
          routeResult.links.unclassified.push(a);
        }
      }

      auditReport.summary.totalButtonsChecked += pageElements.buttons.length;
      auditReport.summary.buttonsInventoried += pageElements.buttons.length;
      routeResult.brokenLinksCount = routeResult.brokenOnThisPage.length;
      auditReport.routeAudits.push(routeResult);

      console.log(`- ${route.path}: ${pageElements.anchors.length} links (${routeResult.links.internalRoutes.length} internal, ${routeResult.links.inPageHashes.length} in-page hashes, ${routeResult.links.internalRouteWithHash.length} route-hashes, ${routeResult.links.external.length} external, ${routeResult.links.mailto.length} mailto, ${routeResult.links.tel.length} tel), ${pageElements.buttons.length} buttons, ${routeResult.brokenOnThisPage.length} broken.`);
    }

    // Now test all distinct internal destination routes and route-hashes across the entire site
    console.log(`\nValidating distinct internal destinations...`);
    const allInternalTargets = new Set();
    const allRouteHashTargets = new Set();

    auditReport.routeAudits.forEach((ra) => {
      ra.links.internalRoutes.forEach((l) => allInternalTargets.add(l.href));
      ra.links.internalRouteWithHash.forEach((l) => allRouteHashTargets.add(l.href));
    });

    auditReport.summary.internalDestinationsValidated = allInternalTargets.size;
    auditReport.summary.hashTargetsValidated = allRouteHashTargets.size;

    console.log(`Verifying ${allInternalTargets.size} distinct internal route destinations...`);
    for (const targetPath of allInternalTargets) {
      // Clean query params for simple navigation check
      const checkUrl = `${BASE_URL}${targetPath}`;
      try {
        const destRes = await page.goto(checkUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
        const destStatus = destRes ? destRes.status() : 0;
        if (destStatus !== 200) {
          const err = {
            target: targetPath,
            status: destStatus,
            error: `Internal route ${targetPath} returned HTTP ${destStatus}`
          };
          auditReport.brokenOrMissingDestinations.push(err);
          auditReport.summary.brokenLinksCount++;
          console.error(`  FAIL: ${targetPath} -> HTTP ${destStatus}`);
        } else {
          console.log(`  PASS: ${targetPath} -> HTTP 200`);
        }
      } catch (e) {
        const err = { target: targetPath, error: e.message };
        auditReport.brokenOrMissingDestinations.push(err);
        auditReport.summary.brokenLinksCount++;
        console.error(`  ERROR: ${targetPath} -> ${e.message}`);
      }
    }

    console.log(`Verifying ${allRouteHashTargets.size} distinct route-hash destinations...`);
    for (const targetPath of allRouteHashTargets) {
      const [routePart, hashPart] = targetPath.split('#');
      const checkUrl = `${BASE_URL}${routePart}`;
      try {
        const destRes = await page.goto(checkUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
        const destStatus = destRes ? destRes.status() : 0;
        if (destStatus !== 200) {
          const err = {
            target: targetPath,
            status: destStatus,
            error: `Route ${routePart} returned HTTP ${destStatus}`
          };
          auditReport.brokenOrMissingDestinations.push(err);
          auditReport.summary.brokenLinksCount++;
          console.error(`  FAIL: ${targetPath} -> Route HTTP ${destStatus}`);
        } else {
          const hashExists = await page.evaluate((id) => {
            return document.getElementById(id) !== null || document.querySelector(`[name="${id}"]`) !== null;
          }, hashPart);

          if (!hashExists) {
            const err = {
              target: targetPath,
              error: `Route ${routePart} is OK, but hash #${hashPart} does not exist in target DOM`
            };
            auditReport.brokenOrMissingDestinations.push(err);
            auditReport.summary.brokenLinksCount++;
            console.error(`  FAIL: ${targetPath} -> Hash #${hashPart} missing on ${routePart}`);
          } else {
            console.log(`  PASS: ${targetPath} -> Route HTTP 200 & #${hashPart} exists`);
          }
        }
      } catch (e) {
        const err = { target: targetPath, error: e.message };
        auditReport.brokenOrMissingDestinations.push(err);
        auditReport.summary.brokenLinksCount++;
        console.error(`  ERROR: ${targetPath} -> ${e.message}`);
      }
    }

    const outputPath = path.join(OUTPUT_DIR, 'cta_link_audit.json');
    fs.writeFileSync(outputPath, JSON.stringify(auditReport, null, 2), 'utf8');
    const finalDir = path.resolve('audit/final');
    if (!fs.existsSync(finalDir)) fs.mkdirSync(finalDir, { recursive: true });
    fs.writeFileSync(path.join(finalDir, 'link_cta_results.json'), JSON.stringify(auditReport, null, 2), 'utf8');
    console.log(`\nCTA & Link Audit complete. Report written to ${outputPath} and audit/final/link_cta_results.json`);
    console.log(`Summary: Checked ${auditReport.summary.totalLinksChecked} links across ${AUDITED_ROUTES.length} routes. Broken/Missing: ${auditReport.summary.brokenLinksCount}.`);

    await page.close();
  } finally {
    await browser.close();
    if (serverProcess) {
      serverProcess.kill('SIGTERM');
      console.log('Server process terminated.');
    }
  }
}

runLinkAndCtaAudit().catch((err) => {
  console.error('Link & CTA audit failed:', err);
  process.exit(1);
});
