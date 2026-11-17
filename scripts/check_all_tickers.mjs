const routes = [
  "/",
  "/about",
  "/programmes",
  "/donate",
  "/contact",
  "/governance",
  "/statutory-disclosures",
  "/reports",
  "/impact",
  "/csr-partnerships",
  "/faq",
  "/privacy",
  "/terms",
  "/accessibility",
  "/volunteer",
  "/scholarships",
  "/campaigns",
  "/campaigns/hanuman-murti"
];

async function checkRoutes() {
  for (const r of routes) {
    try {
      const res = await fetch(`https://mect.org.in${r}`, {
        headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" }
      });
      const html = await res.text();
      const hasNewTicker = html.includes("A Divine Vision in Progress");
      const hasOldTicker = html.includes("NITI Aayog Darpan") && html.includes("Trust Deed No. 40311302194") && html.includes("Corporate Liaison: Bhubaneswar");
      console.log(`${r}: status=${res.status}, hasNewTicker=${hasNewTicker}, hasOldTicker=${hasOldTicker}`);
    } catch (e) {
      console.error(`${r}: ERROR:`, e.message);
    }
  }
}
checkRoutes();
