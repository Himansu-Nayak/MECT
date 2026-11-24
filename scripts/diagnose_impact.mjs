import { spawn } from 'node:child_process';
import http from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';

const PORT = 3005;
const BASE_URL = `http://127.0.0.1:${PORT}`;

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

async function run() {
  const serverProcess = spawn('node', ['server.js'], {
    cwd: path.resolve('.next/standalone'),
    stdio: 'pipe',
    env: { ...process.env, PORT: String(PORT), HOSTNAME: '127.0.0.1', NODE_ENV: 'production' }
  });

  await waitForServer(`${BASE_URL}/`);

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto(`${BASE_URL}/impact`, { waitUntil: 'networkidle' });

    const diagnosis = await page.evaluate(() => {
      const winW = window.innerWidth;
      const docW = document.documentElement.clientWidth;
      const scrollW = document.documentElement.scrollWidth;
      const overflowingElements = [];

      document.querySelectorAll('*').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.right > winW) {
          overflowingElements.push({
            tag: el.tagName,
            id: el.id,
            className: (el.className || '').toString().slice(0, 100),
            right: rect.right,
            diff: rect.right - winW
          });
        }
      });

      return { winW, docW, scrollW, overflowingElements: overflowingElements.slice(0, 15) };
    });

    console.log('DIAGNOSIS RESULT:', JSON.stringify(diagnosis, null, 2));
    await page.close();
  } finally {
    await browser.close();
    serverProcess.kill('SIGTERM');
  }
}

run().catch(console.error);
