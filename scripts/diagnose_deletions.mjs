import { execSync } from "child_process";

const components = [
  "src/components/sections/UnifiedDonationExperience.tsx",
  "src/components/sections/SmartDonationCheckout.tsx",
  "src/components/sections/SbiDonationSection.tsx",
  "src/components/sections/HeroBackgroundMarquee.tsx",
  "src/components/charts/bar-chart-loading.tsx",
  "src/components/charts/chart-reveal-clip.tsx",
  "src/components/charts/pie-center-shell.tsx",
  "src/components/charts/pie-ticks.tsx",
  "src/components/charts/static-chart-preview-context.tsx",
  "src/components/motion/PillarIllustrations.tsx"
];

console.log("=== CHECKING BASELINE IMPORTS (99c8b1c) ===");
const results = [];

for (const comp of components) {
  const baseName = comp.split("/").pop().replace(/\.tsx?$/, "");
  let refs = [];
  try {
    const raw = execSync(`git grep -n "${baseName}" 99c8b1c -- ":!docs" ":!*.md" ":!${comp}"`, { encoding: "utf8" });
    refs = raw.split("\n").filter(Boolean);
  } catch {
    refs = [];
  }

  // Also check line count and export in baseline
  let lineCount = 0;
  let exportsList = [];
  let apis = [];
  try {
    const content = execSync(`git show 99c8b1c:${comp}`, { encoding: "utf8" });
    lineCount = content.split("\n").length;
    const exportMatches = content.match(/export\s+(?:default\s+)?(?:function|const|class)\s+([A-Za-z0-9_]+)/g) || [];
    exportsList = exportMatches.map(e => e.replace(/export\s+(?:default\s+)?(?:function|const|class)\s+/, ""));
    const apiMatches = content.match(/fetch\(["'`][^"'`]+["'`]|axios\.[a-z]+\([^)]+\)|\/api\/[a-zA-Z0-9_\/-]+/g) || [];
    apis = Array.from(new Set(apiMatches));
  } catch (err) {
    lineCount = -1;
  }

  console.log(`\nComponent: ${baseName}`);
  console.log(`  Lines: ${lineCount}`);
  console.log(`  Exports: ${exportsList.join(", ")}`);
  console.log(`  APIs called: ${apis.length > 0 ? apis.join(", ") : "None"}`);
  console.log(`  External references in baseline (excluding self and docs): ${refs.length}`);
  if (refs.length > 0) {
    refs.forEach(r => console.log(`    - ${r}`));
  }

  results.push({
    component: comp,
    baseName,
    lineCount,
    exportsList,
    apis,
    referencesInBaseline: refs
  });
}
