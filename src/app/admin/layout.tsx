import { createPageMetadata } from "@/lib/seo";
import AdminClientLayout from "./AdminClientLayout";

export const metadata = createPageMetadata({
  title: "Administrative Secretariat",
  description: "Internal secretariat administration dashboard for Mahaveer Educational & Charitable Trust (MECT).",
  path: "/admin",
  noIndex: true,
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminClientLayout>{children}</AdminClientLayout>;
}
