import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeroProps {
  badge?: string | React.ReactNode;
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
  actions?: React.ReactNode;
  badgeVariant?:
    | "gold"
    | "gold-dark"
    | "contrast-gold"
    | "forest"
    | "forest-dark"
    | "neutral"
    | "success"
    | "warning"
    | "outline";
}

export function PageHero({
  badge,
  title,
  description,
  breadcrumbs,
  actions,
  badgeVariant = "gold-dark",
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#072617] text-[#EDE6D8] pt-12 pb-16 md:pt-16 md:pb-20 border-b border-[#C5A059]/20">
      {/* Background Grid Pattern & Ambient Gold Glow */}
      <div
        className="absolute inset-0 opacity-10 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -top-24 -right-24 w-80 h-80 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <Container size="default">
        <div className="relative space-y-6">
          {/* Accessible Structured Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center space-x-2 text-xs text-white/70 flex-wrap"
          >
            <ol
              className="flex items-center space-x-2 flex-wrap"
              itemScope
              itemType="https://schema.org/BreadcrumbList"
            >
              <li
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
                className="flex items-center"
              >
                <Link
                  href="/"
                  itemProp="item"
                  className="flex items-center gap-1 hover:text-[#E4C88A] transition-colors focus-visible:outline-2 focus-visible:outline-[#C5A059]"
                >
                  <Home className="w-3.5 h-3.5" aria-hidden="true" />
                  <span itemProp="name">Home</span>
                </Link>
                <meta itemProp="position" content="1" />
              </li>

              {breadcrumbs.map((item, index) => {
                const position = index + 2;
                return (
                  <li
                    key={index}
                    itemProp="itemListElement"
                    itemScope
                    itemType="https://schema.org/ListItem"
                    className="flex items-center space-x-2"
                  >
                    <ChevronRight
                      className="w-3 h-3 text-white/40 shrink-0"
                      aria-hidden="true"
                    />
                    {item.href ? (
                      <Link
                        href={item.href}
                        itemProp="item"
                        className="hover:text-[#E4C88A] transition-colors focus-visible:outline-2 focus-visible:outline-[#C5A059]"
                      >
                        <span itemProp="name">{item.label}</span>
                      </Link>
                    ) : (
                      <span
                        className="text-[#E4C88A] font-medium"
                        aria-current="page"
                        itemProp="name"
                      >
                        {item.label}
                      </span>
                    )}
                    <meta itemProp="position" content={String(position)} />
                  </li>
                );
              })}
            </ol>
          </nav>

          {/* Title, Badge & Subtext */}
          <div className="max-w-3xl space-y-4">
            {badge && (
              <div>
                {typeof badge === "string" ? (
                  <Badge variant={badgeVariant} size="md">
                    {badge}
                  </Badge>
                ) : (
                  badge
                )}
              </div>
            )}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              {title}
            </h1>
            <p className="text-sm sm:text-base text-white/85 leading-relaxed font-sans max-w-2xl">
              {description}
            </p>
            {actions && <div className="pt-2 flex flex-wrap gap-3">{actions}</div>}
          </div>
        </div>
      </Container>
    </section>
  );
}
