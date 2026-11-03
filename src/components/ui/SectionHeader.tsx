import React from "react";
import { Badge, BadgeProps } from "./Badge";

export interface SectionHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  badge?: React.ReactNode;
  badgeVariant?: BadgeProps["variant"];
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center" | "right";
  theme?: "light" | "dark";
  actions?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  badge,
  badgeVariant = "gold",
  title,
  subtitle,
  align = "left",
  theme = "light",
  actions,
  className = "",
  ...props
}: SectionHeaderProps) {
  const alignStyles = {
    left: "text-left items-start",
    center: "text-center items-center mx-auto",
    right: "text-right items-end ml-auto",
  };

  const titleColor = theme === "dark" ? "text-white" : "text-[#072617]";
  const subtitleColor = theme === "dark" ? "text-[#EDE6D8]/80" : "text-[#4A5568]";

  return (
    <div
      className={`flex flex-col space-y-3 max-w-3xl ${alignStyles[align]} ${className}`}
      {...props}
    >
      {badge && (
        <div>
          {typeof badge === "string" ? (
            <Badge variant={theme === "dark" ? "gold-dark" : badgeVariant}>
              {badge}
            </Badge>
          ) : (
            badge
          )}
        </div>
      )}

      <h2
        className={`font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight ${titleColor}`}
      >
        {title}
      </h2>

      {subtitle && (
        <p className={`text-sm sm:text-base leading-relaxed ${subtitleColor}`}>
          {subtitle}
        </p>
      )}

      {actions && <div className="pt-2 flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
}
