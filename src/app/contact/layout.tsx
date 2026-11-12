import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Contact Secretariat & Desk",
  description:
    "Official administrative secretariat inquiry desk for Mahaveer Educational & Charitable Trust (MECT) in Balangir and Bhubaneswar, Odisha.",
  path: "/contact",
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
