import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { HeroEntrance } from "@/components/ui/MotionPrimitives";

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
    | "terracotta"
    | "neutral"
    | "success"
    | "warning"
    | "outline";
}

export function PageHero({
  badge,
  badgeVariant = "gold-dark",
  title,
  description,
  breadcrumbs,
  actions,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-forest text-cream pt-12 pb-16 md:pt-16 md:pb-20 border-b border-terracotta/50">
      {/* Subtle Architectural Texture Pattern */}
      <div
        className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#E5C499_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"
        aria-hidden="true"
      />

      <Container size="default">
        <div className="relative space-y-6">
          {/* Accessible Structured Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center space-x-2 text-xs text-cream/90 flex-wrap"
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
                  className="flex items-center gap-1 hover:text-sand transition-colors focus-visible:outline-2 focus-visible:outline-sand"
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
                      className="w-3 h-3 text-cream/50 shrink-0"
                      aria-hidden="true"
                    />
                    {item.href ? (
                      <Link
                        href={item.href}
                        itemProp="item"
                        className="hover:text-sand transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                      >
                        <span itemProp="name">{item.label}</span>
                      </Link>
                    ) : (
                      <span
                        className="text-white font-medium"
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

          {/* Title & Subtext */}
          <HeroEntrance className="max-w-3xl space-y-4">
            {badge && (
              <div>
                <Badge variant={badgeVariant} size="md">
                  {badge}
                </Badge>
              </div>
            )}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.85rem] font-bold text-white tracking-tight leading-[1.12]">
              {title}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-cream leading-relaxed font-sans max-w-2xl">
              {description}
            </p>
            {actions && <div className="pt-2 flex flex-wrap gap-3">{actions}</div>}
          </HeroEntrance>
        </div>
      </Container>
    </section>
  );
}
