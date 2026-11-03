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
      "bg-[#FDFBF7] border border-[#0B3B24]/12 shadow-xs hover:border-[#0B3B24]/25 transition-all duration-200",
    elevated:
      "bg-white border border-[#0B3B24]/10 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300",
    accent:
      "bg-[#F4EFE6] border-l-4 border-l-[#C5A059] border-y border-r border-[#0B3B24]/10 rounded-r-xs shadow-xs",
    dark:
      "bg-[#072617] text-[#EDE6D8] border border-[#C5A059]/25 shadow-lg relative overflow-hidden",
    stat:
      "bg-white border border-[#0B3B24]/10 rounded-xs p-6 shadow-xs hover:border-[#C5A059]/50 transition-all duration-200",
  };

  const paddingStyles = {
    none: "p-0",
    sm: "p-4",
    md: "p-6 sm:p-8",
    lg: "p-8 sm:p-10",
  };

  const interactiveStyles = isClickable
    ? "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A059] active:scale-[0.99]"
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
      className={`font-serif text-xl sm:text-2xl font-bold text-[#0B3B24] tracking-tight ${className}`}
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
    <p className={`text-xs sm:text-sm text-[#4A5568] leading-relaxed ${className}`} {...props}>
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
    <div className={`pt-4 mt-4 border-t border-[#0B3B24]/10 flex items-center justify-between ${className}`} {...props}>
      {children}
    </div>
  );
}

// Re-export Badge for backwards compatibility across existing pages
export { Badge, type BadgeProps } from "./Badge";

