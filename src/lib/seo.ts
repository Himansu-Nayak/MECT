import type { Metadata } from "next";
import { ORG } from "@content/org";

export interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  ogTitle?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export function buildCanonicalUrl(routePath: string): string {
  const normalized =
    routePath === "/" || routePath === ""
      ? ""
      : routePath.startsWith("/")
        ? routePath
        : `/${routePath}`;
  return `${ORG.branding.canonicalOrigin}${normalized}`;
}

export function createPageMetadata({
  title,
  description,
  path,
  ogTitle,
  ogImage = ORG.branding.ogDefaultImagePath,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const canonicalUrl = buildCanonicalUrl(path);
  const socialTitle = ogTitle ?? `${title} | ${ORG.legalName}`;

  const base: Metadata = {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: socialTitle,
      description,
      url: canonicalUrl,
      siteName: ORG.legalName,
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${title} — ${ORG.legalName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [ogImage],
    },
  };

  if (noIndex) {
    base.robots = {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    };
  }

  return base;
}

