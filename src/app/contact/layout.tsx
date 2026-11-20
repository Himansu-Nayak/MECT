import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Contact & Secretariat",
  description:
    "Contact Mahaveer Educational & Charitable Trust (MECT) in Balangir and Bhubaneswar, Odisha for inquiries, student guidance, and administrative support.",
  path: "/contact",
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
