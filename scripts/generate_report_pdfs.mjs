import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const REPORTS_DIR = path.join(process.cwd(), "public", "reports");
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

const reportsData = [
  {
    fileName: "MECT-Annual-Report-FY2023-24.pdf",
    title: "Annual Activity & Statutory Progress Report (FY 2023–24)",
    period: "Financial Year 2023–24 (01 April 2023 – 31 March 2024)",
    summary: "Annual statutory and operational report documenting community education tutoring, safe water provisioning, healthcare relief, and institutional governance compliance under the Indian Trusts Act, 1882.",
    keyHighlights: [
      {
        area: "Remedial Rural Education (Shiksha Setu)",
        detail: "350+ recorded student participation entries (FY 2023–24), not necessarily 350 unique students supported, across community study centers in Balangir district. Free distribution of scholastic study materials, notebooks, and learning aids.",
      },
      {
        area: "Safe Drinking Water & Heatwave Relief (Jal Seva)",
        detail: "10,000+ recorded water and relief service instances, not 10,000 unique citizens, delivered via community water kiosks in rural transit hubs and hospital zones, complemented by summer heatwave electrolyte distribution.",
      },
      {
        area: "Hospital Food Security (Jan Ahar)",
        detail: "Daily wholesome hot meal distribution for impoverished attendants caring for hospitalized family members at District Headquarters Hospital (DHH) Balangir.",
      },
      {
        area: "Statutory Registrations & Filings",
        detail: "CBDT Form 10AC Section 12A registration (Order URN: AADTM5474FE20231) and Section 80G order (Order URN: AADTM5474FF20241) granted for AY 2024–25 to AY 2026–27. MCA Form CSR-1 registration completed (Reg: CSR00081063).",
      },
    ],
    auditStatus: "Trust accounts audited under registered Trust Deed Clause XVI; certified audit statements retained at the Trust Secretariat for inspection.",
    form10BStatus: "Form 10B audit report filed / on official record for FY 2023–24.",
  },
  {
    fileName: "MECT-Annual-Report-FY2022-23.pdf",
    title: "Annual Activity & Vocational Livelihood Report (FY 2022–23)",
    period: "Financial Year 2022–23 (01 April 2022 – 31 March 2023)",
    summary: "Annual operational review detailing women's skill development, tailoring micro-enterprise enablement, student educational outreach, and hospital patient attendant food relief.",
    keyHighlights: [
      {
        area: "Women's Vocational Empowerment (Swavalamban)",
        detail: "120+ cumulative vocational course enrolments (FY 2021–23), not necessarily 120 uniquely certified women, in apparel fabrication and garment stitching at the Balangir Vocational Center. Distribution of sewing machine toolkits to certified graduates.",
      },
      {
        area: "Civic Health & Hospital Patient Support",
        detail: "Continued operational support for Jan Ahar daily cooked thali distribution to destitute families and patient attendants at Balangir District Hospital.",
      },
      {
        area: "Rural Community Engagement",
        detail: "Legal literacy and community sanitation awareness sessions conducted across rural village clusters in Balangir district.",
      },
      {
        area: "Governance Compliance",
        detail: "All operations conducted in compliance with Indian Trusts Act, 1882 guidelines and non-remunerative trustee charter.",
      },
    ],
    auditStatus: "Trust financial statements audited in accordance with statutory requirements; certified records maintained on physical file.",
    form10BStatus: "Form 10B audit report filed / on official record for FY 2022–23.",
  },
  {
    fileName: "MECT-Annual-Report-FY2021-22.pdf",
    title: "Annual Activity & Educational Recovery Report (FY 2021–22)",
    period: "Financial Year 2021–22 (01 April 2021 – 31 March 2022)",
    summary: "Operational review focusing on post-pandemic scholastic recovery, academic kit distributions, rural tutoring center reopenings, and emergency dry-ration support.",
    keyHighlights: [
      {
        area: "Scholastic Recovery Outreach",
        detail: "280+ free student study kits (textbooks, notebooks, geometry boxes, and stationery) distributed to underprivileged rural school students across Western Odisha to mitigate learning losses.",
      },
      {
        area: "Tutoring Center Restoration",
        detail: "Reopening of community remedial learning centers with proper health and hygiene protocols.",
      },
      {
        area: "Community Welfare & Relief",
        detail: "Emergency dry-ration and nutritional support for economically vulnerable rural families during post-lockdown transition periods.",
      },
      {
        area: "Institutional Foundations",
        detail: "Continued adherence to registered Trust Deed Doc No. 40311302194 guidelines and non-profit fiscal management.",
      },
    ],
    auditStatus: "Financial accounts reconciled and audited by statutory accountant; physical ledger archived at Balangir Registered Office.",
    form10BStatus: "Form 10B audit report filed / on official record for FY 2021–22.",
  },
];

function generateHtml(rep) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${rep.title}</title>
  <style>
    @page {
      size: A4;
      margin: 20mm 15mm 20mm 15mm;
    }
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      color: #1A1A1A;
      line-height: 1.5;
      font-size: 11pt;
      background: #FFFFFF;
      margin: 0;
      padding: 0;
    }
    .header {
      border-bottom: 2px solid #2C3E2D;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    .org-name {
      font-size: 16pt;
      font-weight: bold;
      color: #2C3E2D;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin: 0 0 4px 0;
    }
    .sub-org {
      font-size: 9pt;
      color: #555555;
      margin: 0 0 8px 0;
      line-height: 1.3;
    }
    .stat-strip {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      font-size: 8.5pt;
      background: #F7F5F0;
      padding: 6px 10px;
      border: 1px solid #E2DED4;
      border-radius: 3px;
    }
    .stat-strip span {
      font-weight: bold;
      color: #2C3E2D;
    }
    .title-box {
      margin: 24px 0 16px 0;
      border-left: 4px solid #B25430;
      padding-left: 12px;
    }
    .report-title {
      font-size: 14pt;
      font-weight: bold;
      color: #2C3E2D;
      margin: 0 0 4px 0;
    }
    .report-period {
      font-size: 10pt;
      color: #B25430;
      font-weight: 600;
      margin: 0;
    }
    .section-title {
      font-size: 11pt;
      font-weight: bold;
      color: #2C3E2D;
      text-transform: uppercase;
      border-bottom: 1px solid #E2DED4;
      padding-bottom: 4px;
      margin: 20px 0 10px 0;
      letter-spacing: 0.5px;
    }
    .highlight-card {
      background: #FAFAFA;
      border: 1px solid #E8E5DD;
      border-radius: 4px;
      padding: 10px 12px;
      margin-bottom: 10px;
    }
    .highlight-title {
      font-weight: bold;
      color: #B25430;
      font-size: 10pt;
      margin-bottom: 3px;
    }
    .highlight-desc {
      font-size: 9.5pt;
      color: #333333;
      line-height: 1.45;
    }
    .status-table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0;
      font-size: 9.5pt;
    }
    .status-table th {
      background: #2C3E2D;
      color: #FFFFFF;
      text-align: left;
      padding: 7px 10px;
      font-weight: 600;
    }
    .status-table td {
      padding: 8px 10px;
      border: 1px solid #E2DED4;
      background: #FFFFFF;
    }
    .footer-note {
      font-size: 8pt;
      color: #666666;
      border-top: 1px solid #E2DED4;
      padding-top: 12px;
      margin-top: 24px;
      line-height: 1.4;
    }
    .sign-block {
      display: flex;
      justify-content: space-between;
      margin-top: 25px;
      padding-top: 10px;
    }
    .sign-line {
      font-size: 9pt;
      color: #333333;
      border-top: 1px solid #999999;
      width: 200px;
      text-align: center;
      padding-top: 5px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="org-name">Mahaveer Educational &amp; Charitable Trust (MECT)</div>
    <div class="sub-org">
      Registered Public Charitable Trust • Registered Office: Balangir, Odisha - 767001<br>
      Administrative Liaison: A1, 3rd Floor, Lewis Plaza, BJB Nagar, Bhubaneswar, Odisha - 751014
    </div>
    <div class="stat-strip">
      <div>Trust Deed: <span>Doc No. 40311302194</span></div>
      <div>PAN: <span>AADTM5474F</span></div>
      <div>NITI Aayog: <span>OR/2024/0466491</span></div>
      <div>MCA CSR: <span>CSR00081063</span></div>
    </div>
  </div>

  <div class="title-box">
    <div class="report-title">${rep.title}</div>
    <div class="report-period">${rep.period}</div>
  </div>

  <p style="font-size: 10pt; color: #444444; margin-bottom: 16px;">
    ${rep.summary}
  </p>

  <div class="section-title">Key Programme Highlights &amp; Documented Outcomes</div>
  ${rep.keyHighlights
    .map(
      (h) => `
    <div class="highlight-card">
      <div class="highlight-title">${h.area}</div>
      <div class="highlight-desc">${h.detail}</div>
    </div>
  `
    )
    .join("")}

  <div class="section-title">Audit, Form 10B &amp; Statutory Status</div>
  <table class="status-table">
    <thead>
      <tr>
        <th>Compliance Parameter</th>
        <th>Recorded Statutory Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Annual Activity Report</strong></td>
        <td>Available &amp; Certified on Official File</td>
      </tr>
      <tr>
        <td><strong>Chartered Accountant Audit</strong></td>
        <td>${rep.auditStatus}</td>
      </tr>
      <tr>
        <td><strong>Form 10B Statutory Audit Status</strong></td>
        <td>${rep.form10BStatus}</td>
      </tr>
      <tr>
        <td><strong>Trustee Remuneration (Clause XVI)</strong></td>
        <td>₹0.00 (All trustees serve in an honorary, non-remunerative capacity)</td>
      </tr>
    </tbody>
  </table>

  <div class="footer-note">
    <strong>Statutory Notice:</strong> Tax treatment of contributions is subject to applicable law and confirmation of the Trust's current statutory eligibility. Original physical documents, receipt books, and audited balance sheets are retained under Deed Doc No. 40311302194 and open for public inspection by prior appointment at the Balangir Registered Office.
  </div>

  <div class="sign-block">
    <div class="sign-line">
      Trust Secretariat<br>
      Mahaveer Educational &amp; Charitable Trust
    </div>
    <div class="sign-line">
      Managing Trustee / Trustee Board<br>
      Balangir, Odisha
    </div>
  </div>
</body>
</html>`;
}

async function main() {
  console.log("[PDF] Launching browser to generate official reports...");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage();

  for (const rep of reportsData) {
    const html = generateHtml(rep);
    await page.setContent(html, { waitUntil: "networkidle" });
    const outPath = path.join(REPORTS_DIR, rep.fileName);
    await page.pdf({
      path: outPath,
      format: "A4",
      printBackground: true,
      margin: {
        top: "15mm",
        bottom: "15mm",
        left: "15mm",
        right: "15mm",
      },
    });
    const stats = fs.statSync(outPath);
    console.log(`[PDF] Generated ${rep.fileName} (${(stats.size / 1024).toFixed(1)} KB)`);
  }

  await browser.close();
  console.log("[PDF] All report PDFs successfully generated in public/reports/");
}

main().catch((err) => {
  console.error("[PDF ERROR]", err);
  process.exit(1);
});
