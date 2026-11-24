import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const PORT = 3005;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const OUTPUT_DIR = path.resolve('audit/feature_branch_local');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function checkServer(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => resolve(res.statusCode === 200));
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

const DISCOVERED_ROUTES = [
  // Core Public
  { path: '/', category: 'public', title: 'Home', access: 'public' },
  { path: '/about', category: 'public', title: 'About Us', access: 'public' },
  { path: '/governance', category: 'public', title: 'Governance', access: 'public' },
  { path: '/statutory-disclosures', category: 'public', title: 'Statutory Disclosures', access: 'public' },
  { path: '/programmes', category: 'public', title: 'Programmes', access: 'public' },
  { path: '/campaigns', category: 'public', title: 'Campaigns', access: 'public' },
  { path: '/campaigns/hanuman-murti', category: 'public', title: 'Hanuman Murti', access: 'public' },
  { path: '/donate', category: 'public', title: 'Donate', access: 'public' },
  { path: '/contact', category: 'public', title: 'Contact', access: 'public' },
  { path: '/csr-partnerships', category: 'public', title: 'CSR Partnerships', access: 'public' },
  { path: '/reports', category: 'public', title: 'Reports', access: 'public' },
  { path: '/memories-gallery', category: 'public', title: 'Gallery', access: 'public' },
  { path: '/scholarships', category: 'public', title: 'Scholarships', access: 'public' },
  { path: '/scholarships/apply', category: 'public', title: 'Scholarship Apply', access: 'public' },
  { path: '/scholarships/track', category: 'public', title: 'Scholarship Track', access: 'public' },
  { path: '/volunteer', category: 'public', title: 'Volunteer', access: 'public' },
  { path: '/impact', category: 'public', title: 'Impact', access: 'public' },
  { path: '/stories', category: 'public', title: 'Stories', access: 'public' },
  { path: '/stories/classroom', category: 'public', title: 'Story: Classroom', access: 'public' },
  { path: '/stories/workshop', category: 'public', title: 'Story: Workshop', access: 'public' },
  { path: '/stories/water-point', category: 'public', title: 'Story: Water Point', access: 'public' },
  { path: '/faq', category: 'public', title: 'FAQ', access: 'public' },
  { path: '/privacy', category: 'public', title: 'Privacy Policy', access: 'public' },
  { path: '/terms', category: 'public', title: 'Terms of Service', access: 'public' },
  { path: '/accessibility', category: 'public', title: 'Accessibility', access: 'public' },
  { path: '/login', category: 'public', title: 'Donor Login', access: 'public' },
  { path: '/register', category: 'public', title: 'Donor Register', access: 'public' },
  // Donor Portal
  { path: '/portal/login', category: 'portal', title: 'Portal Login', access: 'public_auth' },
  { path: '/portal/welcome', category: 'portal', title: 'Portal Welcome', access: 'portal_auth' },
  { path: '/portal/dashboard', category: 'portal', title: 'Portal Dashboard', access: 'portal_auth' },
  { path: '/portal/donations', category: 'portal', title: 'Portal Donations', access: 'portal_auth' },
  { path: '/portal/receipts', category: 'portal', title: 'Portal Receipts', access: 'portal_auth' },
  { path: '/portal/profile', category: 'portal', title: 'Portal Profile', access: 'portal_auth' },
  { path: '/portal/security', category: 'portal', title: 'Portal Security', access: 'portal_auth' },
  // Admin
  { path: '/admin/login', category: 'admin', title: 'Admin Login', access: 'admin_login' },
  { path: '/admin', category: 'admin', title: 'Admin Overview', access: 'admin_auth' },
  { path: '/admin/audit-logs', category: 'admin', title: 'Admin Audit Logs', access: 'admin_auth' },
  { path: '/admin/cms', category: 'admin', title: 'Admin CMS', access: 'admin_auth' },
  { path: '/admin/demo', category: 'admin', title: 'Admin Demo Lifecycle', access: 'admin_auth' },
  { path: '/admin/documents', category: 'admin', title: 'Admin Documents', access: 'admin_auth' },
  { path: '/admin/donors', category: 'admin', title: 'Admin Donors', access: 'admin_auth' },
  { path: '/admin/inquiries', category: 'admin', title: 'Admin Inquiries', access: 'admin_auth' },
  { path: '/admin/media', category: 'admin', title: 'Admin Media', access: 'admin_auth' },
  { path: '/admin/scholarships', category: 'admin', title: 'Admin Scholarships', access: 'admin_auth' },
  { path: '/admin/settings', category: 'admin', title: 'Admin Settings', access: 'admin_auth' },
  { path: '/admin/users', category: 'admin', title: 'Admin Users', access: 'admin_auth' },
  { path: '/admin/volunteers', category: 'admin', title: 'Admin Volunteers', access: 'admin_auth' },
  { path: '/admin/whatsapp', category: 'admin', title: 'Admin WhatsApp Logs', access: 'admin_auth' }
];

async function runRouteDiscoveryAudit() {
  let serverProcess = null;
  const isRunning = await checkServer(`${BASE_URL}/`);

  if (!isRunning) {
    console.log(`Starting standalone server on port ${PORT}...`);
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
  }

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const auditResults = [];

  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

    for (const r of DISCOVERED_ROUTES) {
      const consoleErrors = [];
      const errorHandler = (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      };
      page.on('console', errorHandler);

      const targetUrl = `${BASE_URL}${r.path}`;
      let status = 0;
      let finalUrl = targetUrl;
      let title = '';
      let overflow = false;
      let pageRenders = false;

      try {
        const res = await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
        status = res ? res.status() : 0;
        finalUrl = page.url();
        title = await page.title();
        pageRenders = status === 200;

        // Check horizontal overflow
        overflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > window.innerWidth;
        });
      } catch (err) {
        status = 0;
        consoleErrors.push(err.message);
      } finally {
        page.off('console', errorHandler);
      }

      const result = {
        path: r.path,
        category: r.category,
        expectedAccess: r.access,
        httpStatus: status,
        finalUrl: finalUrl.replace(BASE_URL, ''),
        pageTitle: title,
        pageRenders,
        layoutOverflow: overflow,
        consoleErrorsCount: consoleErrors.length,
        consoleErrors: consoleErrors.slice(0, 3),
        statusClassification: (pageRenders && !overflow && consoleErrors.length === 0) ? 'VERIFIED PASS' : (status === 200 ? 'PASS_WITH_WARNINGS' : 'FAIL')
      };

      auditResults.push(result);
      console.log(`Route [${r.category.toUpperCase()}] ${r.path} -> HTTP ${status} | Title: "${title.slice(0, 30)}..." | Overflow: ${overflow ? 'FAIL' : 'OK'} | Errors: ${consoleErrors.length}`);
    }

    const outputPath = path.join(OUTPUT_DIR, 'complete_route_inventory.json');
    fs.writeFileSync(outputPath, JSON.stringify(auditResults, null, 2), 'utf8');
    console.log(`\nRoute inventory audit complete. Written to ${outputPath}`);
    await page.close();
  } finally {
    await browser.close();
    if (serverProcess) {
      serverProcess.kill('SIGTERM');
      console.log('Server process terminated.');
    }
  }
}

runRouteDiscoveryAudit().catch((e) => {
  console.error('Audit failed:', e);
  process.exit(1);
});
