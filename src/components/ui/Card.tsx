import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "accent" | "dark" | "stat";
  padding?: "none" | "sm" | "md" | "lg";
  isHoverable?: boolean;
  isClickable?: boolean;
}

export function Card({
  children,
  variant = "default",
  padding = "md",
  isHoverable = false,
  isClickable = false,
  className = "",
  ...props
}: CardProps) {
  const variantStyles = {
    default:
      "bg-cream/60 border border-border-warm shadow-xs hover:border-terracotta/45 transition-all duration-200",
    elevated:
      "bg-white border border-border-warm shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300",
    accent:
      "bg-sand-light border-l-4 border-l-terracotta border-y border-r border-border-warm rounded-r-xs shadow-xs",
    dark:
      "bg-forest text-cream border border-sand/30 shadow-lg relative overflow-hidden",
    stat:
      "bg-white border border-border-warm rounded-xs p-6 shadow-xs hover:border-terracotta/60 transition-all duration-200",
  };

  const paddingStyles = {
    none: "p-0",
    sm: "p-4",
    md: "p-6 sm:p-8",
    lg: "p-8 sm:p-10",
  };

  const interactiveStyles = isClickable
    ? "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta active:scale-[0.99]"
    : isHoverable
    ? "hover:shadow-md hover:-translate-y-0.5 transition-transform"
    : "";

  return (
    <div
      className={`rounded-xs ${variantStyles[variant]} ${
        variant === "stat" ? "" : paddingStyles[padding]
      } ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`space-y-1.5 mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`font-serif text-xl sm:text-2xl font-bold text-forest tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-xs sm:text-sm text-ink-sand leading-relaxed ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`space-y-3 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`pt-4 mt-4 border-t border-border-warm flex items-center justify-between ${className}`} {...props}>
      {children}
    </div>
  );
}

export { Badge, type BadgeProps } from "./Badge";

