import fs from "fs";
import path from "path";

const rawRoutes = JSON.parse(fs.readFileSync("audit/final/route_results.json", "utf8"));

const GATED_PATHS = new Set([
  "/login",
  "/register",
  "/portal/login",
  "/portal/welcome",
  "/portal/dashboard",
  "/portal/donations",
  "/portal/receipts",
  "/portal/profile",
  "/portal/security"
]);

const classifiedRoutes = rawRoutes.map((r) => {
  let accessClassification = "PUBLIC";
  let expectedStatus = 200;
  let explanation = "Publicly accessible institutional route; expected HTTP 200.";

  if (r.path === "/admin/login") {
    accessClassification = "AUTHENTICATION";
    expectedStatus = 200;
    explanation = "Administrative secretariat login boundary; expected HTTP 200.";
  } else if (GATED_PATHS.has(r.path)) {
    accessClassification = "FEATURE-GATED";
    expectedStatus = 404;
    explanation = "Donor portal feature-gated via ENABLE_DONOR_PORTAL=false; expected HTTP 404 (notFound).";
  }

  const matchesExpectation = r.httpStatus === expectedStatus;

  return {
    path: r.path,
    httpStatus: r.httpStatus,
    expectedStatus,
    accessClassification,
    matchesExpectation,
    verdict: matchesExpectation ? "VERIFIED PASS" : "UNEXPECTED STATUS",
    explanation
  };
});

const summary = {
  totalRoutes: classifiedRoutes.length,
  publicRoutes: classifiedRoutes.filter(r => r.accessClassification === "PUBLIC").length,
  authenticationRoutes: classifiedRoutes.filter(r => r.accessClassification === "AUTHENTICATION").length,
  featureGatedRoutes: classifiedRoutes.filter(r => r.accessClassification === "FEATURE-GATED").length,
  unexpected404Count: classifiedRoutes.filter(r => r.httpStatus === 404 && r.expectedStatus !== 404).length,
  allRoutesConformToExpectedBehavior: classifiedRoutes.every(r => r.matchesExpectation)
};

console.log("Route Access Summary:", JSON.stringify(summary, null, 2));

const outPath = path.join(process.cwd(), "audit", "final", "route_access_results.json");
fs.writeFileSync(outPath, JSON.stringify({
  auditTimestamp: new Date().toISOString(),
  summary,
  routes: classifiedRoutes
}, null, 2));

console.log("Saved route access audit to " + outPath);
