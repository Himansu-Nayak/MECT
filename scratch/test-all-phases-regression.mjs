import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const scratchDir = path.join(rootDir, "scratch");

console.log("==================================================================");
console.log("MAHAVIR TRUST (MECT) — MASTER COMPREHENSIVE REGRESSION RUNNER");
console.log("==================================================================");

const testFiles = fs.readdirSync(scratchDir)
  .filter((f) => f.startsWith("test-phase") && f.endsWith(".mjs"))
  .sort();

console.log(`Discovered ${testFiles.length} phase test suites:\n`);

let passedSuites = 0;
let failedSuites = 0;
const results = [];

for (const testFile of testFiles) {
  const filePath = path.join(scratchDir, testFile);
  process.stdout.write(`Executing ${testFile.padEnd(35)} ... `);
  try {
    const output = execSync(`node "${filePath}"`, { encoding: "utf8", stdio: "pipe" });
    process.stdout.write("PASSED\n");
    passedSuites++;
    results.push({ file: testFile, status: "PASSED", output: output.trim() });
  } catch (err) {
    process.stdout.write("FAILED\n");
    failedSuites++;
    results.push({ file: testFile, status: "FAILED", error: err.message, output: err.stdout?.toString() });
  }
}

console.log("\n==================================================================");
console.log(`REGRESSION SUMMARY: ${passedSuites} Passed, ${failedSuites} Failed (Total ${testFiles.length} Suites)`);
console.log("==================================================================");

if (failedSuites > 0) {
  console.error("Master regression suite failed!");
  process.exit(1);
} else {
  console.log("All phase test suites passed flawlessly with 100% assertion success!");
}
