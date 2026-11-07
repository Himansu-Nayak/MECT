/**
 * MAHAVEER EDUCATIONAL & CHARITABLE TRUST (MECT)
 * Central Type-Safe Application Route Registry
 * 
 * Single source of truth for navigation, footers, sitemaps, breadcrumbs,
 * and 404 suggestion engines.
 * 
 * Rules:
 * 1. Only verified, built routes have status: "live".
 * 2. Unbuilt pages have status: "planned" and MUST NOT appear in active navigation or sitemaps.
 * 3. Admin routes are strictly excluded from sitemaps and public navigation.
 */

export type RouteCategory = 
  | "main"
  | "institutional"
  | "governance"
  | "programmes"
  | "get-involved"
  | "legal"
  | "admin";

export type RouteStatus = "live" | "planned";

export type ChangeFrequency = 
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export interface AppRoute {
  path: string;
  label: string;
  title: string;
  description: string;
  category: RouteCategory;
  inNav: boolean;
  inFooter: boolean;
  inSitemap: boolean;
  priority: number; // 0.0 to 1.0 for sitemap
  changeFrequency: ChangeFrequency;
  status: RouteStatus;
  badge?: string;
}

export const APP_ROUTES: Record<string, AppRoute> = {
  // Public Main Routes
  HOME: {
    path: "/",
    label: "Home",
    title: "MAHAVIR TRUST (MECT) — Registered Public Charitable Trust (Est. 2013)",
    description: "Official portal of Mahaveer Educational & Charitable Trust. Advancing higher education, rural skilling, and clean water relief across Odisha.",
    category: "main",
    inNav: true,
    inFooter: true,
    inSitemap: true,
    priority: 1.0,
    changeFrequency: "weekly",
    status: "live",
  },
  ABOUT: {
    path: "/about",
    label: "About Us",
    title: "Heritage & Mission — Mahaveer Educational & Charitable Trust",
    description: "12+ years of civic service, foundational philosophy, and trusteeship heritage in Odisha.",
    category: "institutional",
    inNav: true,
    inFooter: true,
    inSitemap: true,
    priority: 0.9,
    changeFrequency: "monthly",
    status: "live",
  },
  GOVERNANCE: {
    path: "/governance",
    label: "Governance",
    title: "Board of Trustees & Fiduciary Charter — MECT",
    description: "Registered Trust Deed, permanent managing trustee, life trustees, and fiduciary code of ethics.",
    category: "governance",
    inNav: true,
    inFooter: true,
    inSitemap: true,
    priority: 0.85,
    changeFrequency: "monthly",
    status: "live",
  },
  STATUTORY_DISCLOSURES: {
    path: "/statutory-disclosures",
    label: "Statutory Disclosures",
    title: "Statutory Compliance & Legal Certificates — MECT",
    description: "Income Tax 12A & 80G registrations, MCA CSR-1 approval, NITI Aayog Darpan credentials, and Trust Deed documentation.",
    category: "legal",
    inNav: true,
    inFooter: true,
    inSitemap: true,
    priority: 0.85,
    changeFrequency: "monthly",
    status: "live",
    badge: "Verified",
  },
  PROGRAMMES: {
    path: "/programmes",
    label: "Programmes",
    title: "Civic Programmes & Grassroots Interventions — MECT",
    description: "Remedial rural education, women's vocational tailoring, safe drinking water (Jal Seva), and Jan Ahar hunger relief.",
    category: "programmes",
    inNav: true,
    inFooter: true,
    inSitemap: true,
    priority: 0.9,
    changeFrequency: "weekly",
    status: "live",
  },
  SCHOLARSHIPS: {
    path: "/scholarships",
    label: "Scholarships",
    title: "Higher Education Merit-cum-Means Scholarships — MECT",
    description: "Direct tuition fee grants and academic enablement for underprivileged students pursuing professional courses in Odisha.",
    category: "programmes",
    inNav: false,
    inFooter: false,
    inSitemap: true,
    priority: 0.85,
    changeFrequency: "weekly",
    status: "live",
  },
  SCHOLARSHIPS_APPLY: {
    path: "/scholarships/apply",
    label: "Apply for Scholarship",
    title: "Scholarship Application Portal — MECT",
    description: "Submit online student grant applications with institutional verification and fee structures.",
    category: "programmes",
    inNav: false,
    inFooter: false,
    inSitemap: true,
    priority: 0.8,
    changeFrequency: "weekly",
    status: "live",
  },
  SCHOLARSHIPS_TRACK: {
    path: "/scholarships/track",
    label: "Track Application",
    title: "Track Scholarship Status — MECT",
    description: "Real-time verification status tracker for submitted scholarship applications.",
    category: "programmes",
    inNav: false,
    inFooter: false,
    inSitemap: true,
    priority: 0.75,
    changeFrequency: "monthly",
    status: "live",
  },
  CSR_PARTNERSHIPS: {
    path: "/csr-partnerships",
    label: "CSR Partnerships",
    title: "Corporate CSR Partnerships (Schedule VII) — MECT",
    description: "Institutional corporate social responsibility collaborations under MCA CSR-1 Registration No. CSR00081063.",
    category: "institutional",
    inNav: true,
    inFooter: true,
    inSitemap: true,
    priority: 0.85,
    changeFrequency: "monthly",
    status: "live",
  },
  IMPACT: {
    path: "/impact",
    label: "Impact",
    title: "Audited Beneficiary Metrics & Civic Milestones — MECT",
    description: "Quantified field outcomes, geographic reach across Western Odisha, and grassroots impact metrics.",
    category: "institutional",
    inNav: true,
    inFooter: true,
    inSitemap: true,
    priority: 0.85,
    changeFrequency: "monthly",
    status: "live",
  },
  REPORTS: {
    path: "/reports",
    label: "Reports & Audits",
    title: "Annual Activity Reports & Audited Financials — MECT",
    description: "Transparent archive of annual trustee summaries and audited balance sheets.",
    category: "institutional",
    inNav: true,
    inFooter: true,
    inSitemap: true,
    priority: 0.85,
    changeFrequency: "monthly",
    status: "live",
  },
  VOLUNTEER: {
    path: "/volunteer",
    label: "Volunteer",
    title: "Volunteer & Community Mentorship — MECT",
    description: "Join our civic mission as an academic mentor, field volunteer, or event coordinator in Odisha.",
    category: "get-involved",
    inNav: true,
    inFooter: true,
    inSitemap: true,
    priority: 0.8,
    changeFrequency: "monthly",
    status: "live",
  },
  DONATE: {
    path: "/donate",
    label: "Donate (80G)",
    title: "80G Tax-Exempt Donations & Bank Coordinates — MECT",
    description: "Support our charitable initiatives. 50% income tax exemption under Section 80G. Direct domestic NEFT/RTGS bank coordinates.",
    category: "get-involved",
    inNav: true,
    inFooter: true,
    inSitemap: true,
    priority: 0.95,
    changeFrequency: "weekly",
    status: "live",
  },
  CONTACT: {
    path: "/contact",
    label: "Contact",
    title: "Institutional Offices & Secretariats — MECT",
    description: "Registered office in Balangir and corporate liaison secretariat in Bhubaneswar, Odisha.",
    category: "main",
    inNav: true,
    inFooter: true,
    inSitemap: true,
    priority: 0.8,
    changeFrequency: "monthly",
    status: "live",
  },
  FAQ: {
    path: "/faq",
    label: "FAQs",
    title: "Frequently Asked Questions — MECT",
    description: "Common questions regarding trust governance, 80G tax exemptions, scholarship disbursals, and volunteer engagement.",
    category: "main",
    inNav: false,
    inFooter: true,
    inSitemap: true,
    priority: 0.7,
    changeFrequency: "monthly",
    status: "live",
  },
  PRIVACY: {
    path: "/privacy",
    label: "Privacy Policy",
    title: "Privacy Policy & DPDP Disclosures — MECT",
    description: "Data protection and privacy commitments under the Digital Personal Data Protection Act, 2023.",
    category: "legal",
    inNav: false,
    inFooter: true,
    inSitemap: true,
    priority: 0.5,
    changeFrequency: "yearly",
    status: "live",
  },
  TERMS: {
    path: "/terms",
    label: "Terms of Service",
    title: "Terms of Service & Institutional Disclaimers — MECT",
    description: "Terms governing use of the MECT institutional website and services.",
    category: "legal",
    inNav: false,
    inFooter: true,
    inSitemap: true,
    priority: 0.5,
    changeFrequency: "yearly",
    status: "live",
  },
  ACCESSIBILITY: {
    path: "/accessibility",
    label: "Accessibility",
    title: "Accessibility Statement — MECT",
    description: "Commitment to WCAG 2.1 AA accessibility standards for all citizens and assistive technologies.",
    category: "legal",
    inNav: false,
    inFooter: true,
    inSitemap: true,
    priority: 0.5,
    changeFrequency: "yearly",
    status: "live",
  },

  // Internal Administrative Portals (Never in sitemap or public navigation)
  ADMIN: {
    path: "/admin",
    label: "Admin Dashboard",
    title: "MECT Administrative Portal",
    description: "Internal trust management and administrative overview.",
    category: "admin",
    inNav: false,
    inFooter: false,
    inSitemap: false,
    priority: 0.0,
    changeFrequency: "never",
    status: "live",
  },
  ADMIN_LOGIN: {
    path: "/admin/login",
    label: "Admin Login",
    title: "MECT Admin Authentication",
    description: "Secure authentication for trust administrators.",
    category: "admin",
    inNav: false,
    inFooter: false,
    inSitemap: false,
    priority: 0.0,
    changeFrequency: "never",
    status: "live",
  },
  ADMIN_AUDIT_LOGS: {
    path: "/admin/audit-logs",
    label: "Audit Logs",
    title: "MECT Administrative Audit Logs",
    description: "Audit trail of administrative actions and system events.",
    category: "admin",
    inNav: false,
    inFooter: false,
    inSitemap: false,
    priority: 0.0,
    changeFrequency: "never",
    status: "live",
  },
  ADMIN_INQUIRIES: {
    path: "/admin/inquiries",
    label: "Inquiries",
    title: "MECT Administrative Inquiries Desk",
    description: "Public contact and institutional inquiries triage.",
    category: "admin",
    inNav: false,
    inFooter: false,
    inSitemap: false,
    priority: 0.0,
    changeFrequency: "never",
    status: "live",
  },
  ADMIN_SCHOLARSHIPS: {
    path: "/admin/scholarships",
    label: "Scholarship Review",
    title: "MECT Administrative Scholarship Desk",
    description: "Review, verification, and disbursal management for student applications.",
    category: "admin",
    inNav: false,
    inFooter: false,
    inSitemap: false,
    priority: 0.0,
    changeFrequency: "never",
    status: "live",
  },
  ADMIN_USERS: {
    path: "/admin/users",
    label: "User Accounts",
    title: "MECT Administrative User Directory",
    description: "Trust administrative staff and role-based permissions.",
    category: "admin",
    inNav: false,
    inFooter: false,
    inSitemap: false,
    priority: 0.0,
    changeFrequency: "never",
    status: "live",
  },
  ADMIN_VOLUNTEERS: {
    path: "/admin/volunteers",
    label: "Volunteer Applications",
    title: "MECT Administrative Volunteer Desk",
    description: "Review and onboarding of volunteer applications.",
    category: "admin",
    inNav: false,
    inFooter: false,
    inSitemap: false,
    priority: 0.0,
    changeFrequency: "never",
    status: "live",
  },

  // Planned Routes (Excluded from nav and sitemap until real content exists)
  GALLERY: {
    path: "/gallery",
    label: "Field Gallery",
    title: "Field Activities & Event Gallery — MECT",
    description: "Photographic records of community relief, student felicitations, and health camps.",
    category: "institutional",
    inNav: false,
    inFooter: false,
    inSitemap: false,
    priority: 0.6,
    changeFrequency: "monthly",
    status: "planned",
  },
  NEWS: {
    path: "/news",
    label: "News & Releases",
    title: "News & Public Notices — MECT",
    description: "Press releases, event announcements, and institutional updates.",
    category: "institutional",
    inNav: false,
    inFooter: false,
    inSitemap: false,
    priority: 0.6,
    changeFrequency: "weekly",
    status: "planned",
  },
  EVENTS: {
    path: "/events",
    label: "Events",
    title: "Community Events & Camps — MECT",
    description: "Upcoming educational workshops, summer Jal Seva camps, and health relief drives.",
    category: "programmes",
    inNav: false,
    inFooter: false,
    inSitemap: false,
    priority: 0.6,
    changeFrequency: "monthly",
    status: "planned",
  },
};

/** All registered route definitions as an array */
export const ALL_ROUTES: AppRoute[] = Object.values(APP_ROUTES);

/** Get only live, active routes */
export function getLiveRoutes(): AppRoute[] {
  return ALL_ROUTES.filter((r) => r.status === "live");
}

/** Get public routes eligible for inclusion in the XML sitemap */
export function getSitemapRoutes(): AppRoute[] {
  return ALL_ROUTES.filter((r) => r.status === "live" && r.inSitemap && r.category !== "admin");
}

/** Get public routes that belong in top-level primary navigation */
export function getNavRoutes(): AppRoute[] {
  return ALL_ROUTES.filter((r) => r.status === "live" && r.inNav);
}

/** Get public routes that belong in footer link groupings */
export function getFooterRoutes(): AppRoute[] {
  return ALL_ROUTES.filter((r) => r.status === "live" && r.inFooter);
}

/** Look up a route definition by exact pathname */
export function getRouteByPath(path: string): AppRoute | undefined {
  return ALL_ROUTES.find((r) => r.path === path);
}

/** Helper to test if a given current path matches or is a child of a target path */
export function isRouteActive(currentPath: string, targetPath: string): boolean {
  if (targetPath === "/") {
    return currentPath === "/";
  }
  return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
}

