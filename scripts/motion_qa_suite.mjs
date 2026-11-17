import fs from "fs";
import path from "path";

console.log("=== MECT MOTION & VISUAL QA SUITE ===");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

// 1. Motion Tokens & Primitives Verification
const primitivesPath = path.resolve("src/components/ui/MotionPrimitives.tsx");
const primitivesContent = fs.readFileSync(primitivesPath, "utf-8");

assert(primitivesContent.includes("MOTION_EASING"), "MotionPrimitives defines MOTION_EASING");
assert(primitivesContent.includes("MOTION_DURATION"), "MotionPrimitives defines MOTION_DURATION");
assert(primitivesContent.includes("MOTION_DISTANCE"), "MotionPrimitives defines MOTION_DISTANCE");
assert(primitivesContent.includes("MOTION_VIEWPORT"), "MotionPrimitives defines MOTION_VIEWPORT");
assert(primitivesContent.includes("shouldReduceMotion"), "MotionPrimitives integrates useReducedMotion");
assert(primitivesContent.includes("CountUpStat"), "MotionPrimitives exports CountUpStat component");
assert(primitivesContent.includes("tabular-nums"), "CountUpStat enforces tabular-nums to prevent layout shifts");

// 2. Global CSS prefers-reduced-motion check
const cssPath = path.resolve("src/app/globals.css");
const cssContent = fs.readFileSync(cssPath, "utf-8");

assert(cssContent.includes("prefers-reduced-motion: reduce"), "globals.css contains prefers-reduced-motion media query");
assert(cssContent.includes("animation-play-state: paused"), "globals.css pauses marquee and animations on reduced motion");
assert(cssContent.includes(".animate-in"), "globals.css defines .animate-in class");
assert(cssContent.includes(".fade-in"), "globals.css defines .fade-in class");

// 3. Statutory Ticker Pause Binding & WCAG 2.2.2 compliance
const tickerPath = path.resolve("src/components/layout/StatutoryTicker.tsx");
const tickerContent = fs.readFileSync(tickerPath, "utf-8");

assert(tickerContent.includes("animationPlayState: isPaused ? \"paused\" : undefined"), "StatutoryTicker binds isPaused directly to animationPlayState style");
assert(tickerContent.includes("Pause announcement ticker") && tickerContent.includes("Resume announcement ticker"), "StatutoryTicker has accessible toggle aria-label");

// 4. Institutional Marquee ARIA & Accessibility
const marqueePath = path.resolve("src/components/InstitutionalMarquee.tsx");
const marqueeContent = fs.readFileSync(marqueePath, "utf-8");

assert(marqueeContent.includes("aria-hidden=\"true\""), "InstitutionalMarquee hides duplicated loop elements from assistive tech");
assert(marqueeContent.includes("isPaused"), "InstitutionalMarquee includes pause/resume controls");
assert(marqueeContent.includes("shouldReduceMotion"), "InstitutionalMarquee falls back gracefully under reduced motion");

// 5. Accordion Micro-interactions and WCAG 4.1.2 compliance
const accordionPath = path.resolve("src/components/Accordion.tsx");
const accordionContent = fs.readFileSync(accordionPath, "utf-8");

assert(accordionContent.includes("role=\"region\""), "Accordion panel defines role='region'");
assert(accordionContent.includes("aria-controls="), "Accordion button links to panel via aria-controls");
assert(accordionContent.includes("aria-labelledby="), "Accordion panel links to button via aria-labelledby");

// 6. Cinematic Hero Dignified Motion (No bounce) & Compact Impact CountUpStat
const heroPath = path.resolve("src/components/sections/CinematicHero.tsx");
const heroContent = fs.readFileSync(heroPath, "utf-8");
const impactContent = fs.readFileSync(path.resolve("src/components/sections/CompactImpactSection.tsx"), "utf-8");

assert(!heroContent.includes("animate-bounce"), "CinematicHero eliminates distracting bounce animations");
assert(impactContent.includes("CountUpStat") || heroContent.includes("CountUpStat"), "Homepage uses CountUpStat for dignified metric reveal");

// 7. Subpage Choreography Audit
const pagesToCheck = [
  { file: "src/app/campaigns/hanuman-murti/page.tsx", features: ["Reveal", "StaggerGroup", "StaggerItem"] },
  { file: "src/app/campaigns/page.tsx", features: ["StaggerGroup", "StaggerItem"] },
  { file: "src/app/programmes/page.tsx", features: ["CountUpStat", "Reveal"] },
  { file: "src/app/governance/page.tsx", features: ["StaggerGroup", "StaggerItem"] },
  { file: "src/app/csr-partnerships/page.tsx", features: ["StaggerGroup", "StaggerItem"] },
  { file: "src/app/volunteer/page.tsx", features: ["StaggerGroup", "StaggerItem"] },
];

for (const p of pagesToCheck) {
  const c = fs.readFileSync(path.resolve(p.file), "utf-8");
  for (const f of p.features) {
    assert(c.includes(f), `${p.file} integrates ${f}`);
  }
}

// 8. Strict Statutory Content & Financial Integrity Check
const homepageContent = fs.readFileSync(path.resolve("src/lib/homepage-content.ts"), "utf-8");
assert(homepageContent.includes("350+ recorded student participation entries"), "homepage-content retains approved student participation description");
assert(homepageContent.includes("120+ cumulative vocational course enrolments"), "homepage-content retains approved vocational enrolments description");
assert(homepageContent.includes("10,000+ recorded water and relief service instances"), "homepage-content retains approved water relief instances description");

const freeEdContent = fs.readFileSync(path.resolve("src/components/sections/FreeEducationSection.tsx"), "utf-8");
assert(freeEdContent.includes("Proposed target — up to 200 students"), "FreeEducationSection retains approved 200 students proposed target text");
assert(freeEdContent.includes("Confirmed funded places currently stand at zero"), "FreeEducationSection retains confirmed funded places zero disclosure");

console.log(`\nQA Suite Complete: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("ALL MOTION & VISUAL QA ASSERTIONS PASSED!");
}
