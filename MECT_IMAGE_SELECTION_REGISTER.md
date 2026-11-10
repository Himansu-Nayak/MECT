# MECT Image Selection Register

**Audit Date:** 2026-11-10
**Source Collection Audited:** `src/` (`15` WhatsApp photographs + `9` third-party/legacy `NGO PIC*` files) and `public/` (`mect-official-emblem.png`, `mect-csr1-certificate.png`).
**Preservation Policy:** All 24 source files in `src/` were kept completely untouched in place (never deleted, renamed, or compressed). Only the 6 curated hero photographs were copied into `public/images/hero/` for optimised Next.js `<Image>` AVIF/WebP delivery.

---

## 1. Selected Photographs Published in the Homepage Hero (`public/images/hero/`)

| # | Public Web Asset Path | Original Source Filename (`src/`) | Dimensions & Ratio | Size | Subject & Hero Placement |
|---|---|---|---|---|---|
| 1 | `/images/hero/mect-faculty-puintala-campus.jpg` | `WhatsApp Image 2026-11-09 at 6.26.34 PM.jpeg` | `1280×853` (`1.50`) | `95.5 KB` | Adult educators and academic team standing at Mahaveer campus, Puintala, Balangir (Track 1 — L→R) |
| 2 | `/images/hero/mect-women-empowerment-seminar.jpg` | `WhatsApp Image 2026-11-09 at 6.26.35 PM.jpeg` | `2048×1152` (`1.78`) | `183.9 KB` | Community seminar under *Sakshama Nari – Sashakta Bharat* initiative (Track 1 — L→R) |
| 3 | `/images/hero/mect-clean-water-hygiene-demo.jpg` | `WhatsApp Image 2026-11-09 at 6.26.38 PM.jpeg` | `1600×1200` (`1.33`) | `306.5 KB` | Campus clean water & practical hygiene demonstration in Balangir (Track 1 — L→R) |
| 4 | `/images/hero/mect-legal-literacy-session.jpg` | `WhatsApp Image 2026-11-09 at 6.26.36 PM.jpeg` | `2048×1365` (`1.50`) | `122.0 KB` | Guest speaker addressing participants on legal and civic awareness (Track 2 — R→L) |
| 5 | `/images/hero/mect-public-health-awareness.jpg` | `WhatsApp Image 2026-11-09 at 6.26.36 PM (1).jpeg` | `2048×1365` (`1.50`) | `162.4 KB` | Youth drug-abuse prevention & District Legal Services awareness programme (Track 2 — R→L) |
| 6 | `/images/hero/mect-civic-pledge-classroom.jpg` | `WhatsApp Image 2026-11-09 at 6.26.37 PM.jpeg` | `1600×1200` (`1.33`) | `219.0 KB` | Faculty and senior secondary learners participating in civic integrity pledge (Track 2 — R→L) |

---

## 2. Reserved Authentic MECT Photographs (Retained Untouched in `src/` for Future Sections)

| Source Filename (`src/`) | Dimensions & Ratio | Size | Reservation Rationale |
|---|---|---|---|
| `WhatsApp Image 2026-11-09 at 6.26.34 PM (1).jpeg` | `1280×853` (`1.50`) | `90.2 KB` | Closer alternate framing of the faculty group outside Puintala campus (`6.26.34 PM.jpeg` preferred for banner visibility). |
| `WhatsApp Image 2026-11-09 at 6.26.37 PM (1).jpeg` | `1600×1200` (`1.33`) | `334.6 KB` | Alternate courtyard frame of the campus hygiene session (`6.26.38 PM.jpeg` selected first). Reserved for `/programmes` or `/impact`. |
| `WhatsApp Image 2026-11-09 at 6.26.39 PM (1).jpeg` | `2048×1542` (`1.33`) | `191.5 KB` | Classroom seminar hall view; reserved pending programme gallery expansion and guardian confirmation review. |
| `WhatsApp Image 2026-11-09 at 6.26.40 PM (1).jpeg` | `1600×739` (`2.17`) | `249.6 KB` | Panoramic outdoor field community visit in Balangir; reserved for `/about` or `/impact` wide panoramic banner. |

---

## 3. Excluded / Duplicate Assets (Not Published)

| Source Filename (`src/`) | Dimensions | Exclusion Reason |
|---|---|---|
| `WhatsApp Image 2026-11-09 at 6.26.35 PM (1).jpeg` | `2048×1152` | Exact SHA-256 duplicate (`54AB4402764E`) of selected `6.26.35 PM.jpeg`. |
| `WhatsApp Image 2026-11-09 at 6.26.39 PM (2).jpeg` | `2048×1542` | Exact SHA-256 duplicate (`0B4E68BAC673`) of `6.26.39 PM (1).jpeg`. |
| `WhatsApp Image 2026-11-09 at 6.26.39 PM.jpeg` | `2048×1089` | Contains prominent bottom white phone camera watermark bar (`NOTE 40 Pro 5G`). |
| `WhatsApp Image 2026-11-09 at 6.26.40 PM (2).jpeg` | `946×2048` | Tall portrait orientation (`0.46` aspect ratio); unsuitable for horizontal marquee strips. |
| `WhatsApp Image 2026-11-09 at 6.26.40 PM (3).jpeg` | `1080×485` | Lower vertical resolution (`485px`) wide crop (`61.3 KB`); excluded to maintain crisp visual resolution. |
| `NOG PIC1.jpg`, `NGO PIC 2.jpg`, `NGO PIC3.jpg`, `NGO PIC 4.jpg`, `NGO PIC5.jpg`, `NGO PIC 6.jpg`, `NGO PIC 7.jpg`, `NGO PIC 8.jpg`, `NGO PIC 9.jpg` | Varying (`235×166` to `1200×2132`) | Non-MECT third-party campaign graphics/stock imagery (including `@the_viewmaker` watermark on `NGO PIC 8.jpg` and unconsented minor graphics); excluded under MECT authenticity and child safeguarding rules. |

