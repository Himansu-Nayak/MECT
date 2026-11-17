const targets = [
  { url: "https://mect.org.in/", name: "Homepage" },
  { url: "https://mect.org.in/campaigns/hanuman-murti", name: "Hanuman Murti Campaign" },
  { url: "https://mect.org.in/csr-partnerships", name: "CSR Partnerships" },
  { url: "https://mect.org.in/volunteer", name: "Volunteer Registry" },
  { url: "https://mect.org.in/donate", name: "Donate Portal" },
  { url: "https://mect.org.in/governance", name: "Governance" },
];

async function verifyLive() {
  console.log("=== LIVE PRODUCTION VERIFICATION (https://mect.org.in) ===");
  let passed = 0;
  let total = 0;

  for (const t of targets) {
    total++;
    try {
      const res = await fetch(t.url, {
        headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" }
      });
      const html = await res.text();
      const statusOk = res.status === 200;
      const hasEmblem = html.includes("Mahaveer Educational & Charitable Trust");
      const hasPauseControl = html.includes("Pause announcement ticker") || html.includes("Resume announcement ticker") || html.includes("Pause ticker");
      
      console.log(`[${t.name}] HTTP ${res.status} | Length: ${html.length} bytes | Emblem: ${hasEmblem}`);
      if (statusOk && hasEmblem) {
        passed++;
      } else {
        console.error(`  FAIL: Unexpected response for ${t.url}`);
      }
    } catch (e) {
      console.error(`  ERROR on ${t.url}:`, e.message);
    }
  }

  console.log(`\nLive Verification Complete: ${passed}/${total} targets verified.`);
  if (passed !== total) process.exit(1);
}

verifyLive();
