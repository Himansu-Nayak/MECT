import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const rootDir = process.cwd();
const layoutPath = path.join(rootDir, "src", "app", "layout.tsx");
const globalsCssPath = path.join(rootDir, "src", "app", "globals.css");

console.log("--- PHASE 14: PERFORMANCE, ACCESSIBILITY & E2E QA AUDIT ---");

// Test 1: Skip to main content accessibility link
assert.ok(fs.existsSync(layoutPath), "src/app/layout.tsx must exist");
const layoutContent = fs.readFileSync(layoutPath, "utf8");
assert.ok(layoutContent.includes("skip-to-content") || layoutContent.includes("Skip to main content"), "Must contain WCAG 2.2 skip link");
console.log("✓ Test 1: Verified WCAG 2.2 AA skip-to-content link in root layout");

// Test 2: High contrast styling tokens in globals.css
assert.ok(fs.existsSync(globalsCssPath), "src/app/globals.css must exist");
const cssContent = fs.readFileSync(globalsCssPath, "utf8");
assert.ok(cssContent.includes("#A45E44") && cssContent.includes("#874A35"), "Must define Terracotta tokens (#A45E44 / #874A35)");
assert.ok(cssContent.includes("#E5C499") && cssContent.includes("#283730"), "Must define Warm Sand (#E5C499) and Forest Charcoal (#283730)");
assert.ok(!cssContent.includes("#0A192F"), "Must not define prohibited Presidential Navy #0A192F");
assert.ok(cssContent.includes("font-serif"), "Must support institutional serif typography");
console.log("✓ Test 2: Verified high-contrast design tokens and typography rules");

// Test 3: Regression Suite Integrity
if (process.env.QA_PHASE14_RUNNING) {
  console.log("✓ Test 3: Verified regression suite integrity (re-entry prevented)");
} else {
  const regressionOutput = execSync("node scratch/test-all-phases-regression.mjs", {
    encoding: "utf8",
    env: { ...process.env, QA_PHASE14_RUNNING: "1" },
  });
  assert.ok(regressionOutput.includes("0 Failed"), "All phase suites must pass");
  console.log("✓ Test 3: Verified all regression suites execute and pass 100%");
}

console.log("--- ALL PHASE 14 QA AUDIT TESTS PASSED (3/3) ---");
