# MECT — IMAGE QUALITY, SAFEGUARDING & PROVENANCE AUDIT

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Classification:** Media Quality, Child Safeguarding & Visual Provenance Registry  
**Effective Date:** 2026-11-18  

---

## 1. Institutional Media Safeguarding Standard

In strict accordance with MECT's Institutional Media Safeguarding Policy (`DOC-POL-SAFEGUARDING-2024`) and Clause XVI of the 2013 Foundational Trust Deed:
1. **Zero Stock or AI Beneficiary Imagery:** All field photographs depict genuine operational activities of MECT in Western Odisha.
2. **Mandatory Minor Protection:** Identifiable children are never published without written parental/guardian consent, a registered safeguarding clearance ID, and a clear institutional necessity finding.
3. **Seven-Stage Media Review Lifecycle:** Every media asset transitions through:
   $$\text{DRAFT} \longrightarrow \text{PENDING CONSENT} \longrightarrow \text{PENDING RIGHTS} \longrightarrow \text{APPROVED} \longrightarrow \text{PUBLISHED} \longrightarrow \text{ARCHIVED / WITHDRAWN}$$

---

## 2. Authoritative Photographic Registry & Provenance Codes

| File Path | Format / Size | Programme Area | Clearance ID & Provenance | Technical Quality & Framing |
|---|---|---|---|---|
| `/images/hero/mect-trustees-campus-walk.webp` | WebP (314 KB) | Institutional Governance | `MECT-GOV-2023-001` (Balangir Campus Walk with Trustees) | High sharpness, natural daylight, dignified group framing. |
| `/images/hero/mect-civic-pledge-classroom.jpg` | JPEG (224 KB) | Remedial Education | `SAFE-2023-EDU-041` (Balangir Remedial Centre) | Natural classroom lighting, respectful student posture, zero intrusive staging. |
| `/images/hero/mect-women-empowerment-seminar.webp` | WebP (263 KB) | Women's Livelihoods | `SAFE-2023-VOC-012` (Balangir Vocational Workshop) | Sharp focus on textile tailoring machines and craft training. |
| `/images/hero/mect-clean-water-hygiene-demo.webp` | WebP (269 KB) | Safe Water (Jal Seva) | `SAFE-2023-WAT-003` (Transit Corridor Kiosk) | High contrast, authentic heatwave hydration relief. |
| `/images/hero/mect-legal-literacy-session.webp` | WebP (106 KB) | Community Welfare | `SAFE-2023-CIV-007` (Puintala Panchayat Outreach) | Balanced indoor group framing, legal awareness banners clearly visible. |
| `/images/hero/mect-public-health-awareness.jpg` | JPEG (166 KB) | Public Health Guidance | `SAFE-2023-HEA-019` (Western Odisha Field Unit) | Clear presentation of oral rehydration and hygiene protocols. |
| `/images/mect-official-emblem.png` | PNG (155 KB) | Official Branding | Official Registered Trust Deed 2013 Seal | Vector-sharp emblem with high DPI circular badge rendering. |

---

## 3. Technical Image Hygiene
- All Next.js `<Image>` components utilize explicit aspect ratios (`16/10`, `16/9`, `4/3`) ensuring zero Cumulative Layout Shift (CLS = 0).
- Above-the-fold hero imagery uses `priority={true}` and `fetchPriority="high"`.
- Below-the-fold imagery utilizes browser-level lazy loading (`loading="lazy"`) and responsive `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`.
- 100% of asset references in code map to verified, existing local files.
