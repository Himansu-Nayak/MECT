import { createPageMetadata } from "@/lib/seo";
import { ORG } from "@content/org";

export const metadata = createPageMetadata({
  title: "Contact & Secretariat",
  description: `Contact ${ORG.legalName} in ${ORG.addresses.registered.city} and ${ORG.addresses.corporateLiaison.city}, Odisha for inquiries, student guidance, and administrative support.`,
  path: "/contact",
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
