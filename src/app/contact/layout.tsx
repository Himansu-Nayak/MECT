import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Public Secretariat Inquiry & Guidance Desk",
  description:
    "Official administrative communications, scholarship guidance, and public inquiry portal for Mahaveer Educational & Charitable Trust (MECT) in Balangir and Bhubaneswar, Odisha.",
  path: "/contact",
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
