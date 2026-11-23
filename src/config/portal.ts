/**
 * Feature flag for the Donor & Supporter Portal.
 * Default is FALSE unless explicitly enabled via environment variable
 * ENABLE_DONOR_PORTAL="true" or NEXT_PUBLIC_ENABLE_DONOR_PORTAL="true".
 *
 * When false:
 * - All /login, /register, and /portal/* links in Header, Footer, and homepage are hidden.
 * - All /login, /register, and /portal/* routes return HTTP 404.
 * - These routes are excluded from sitemap.
 */
export function isDonorPortalEnabled(): boolean {
  const v1 = (process.env.NEXT_PUBLIC_ENABLE_DONOR_PORTAL || "").trim().toLowerCase();
  const v2 = (process.env.ENABLE_DONOR_PORTAL || "").trim().toLowerCase();
  return v1 === "true" || v2 === "true";
}
