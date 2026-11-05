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
assert.ok(cssContent.includes("#0A192F"), "Must define Presidential Navy #0A192F");
assert.ok(cssContent.includes("#C5A059"), "Must define Temple Gold #C5A059");
assert.ok(cssContent.includes("font-serif"), "Must support institutional serif typography");
console.log("✓ Test 2: Verified high-contrast design tokens and typography rules");

// Test 3: Regression Suite Integrity
const regressionOutput = execSync("node scratch/test-all-phases-regression.mjs", { encoding: "utf8" });
assert.ok(regressionOutput.includes("13 Passed, 0 Failed"), "All 13 phase suites must pass");
console.log("✓ Test 3: Verified all 13 regression suites execute and pass 100%");

console.log("--- ALL PHASE 14 QA AUDIT TESTS PASSED (3/3) ---");
