import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?:
    | "gold"
    | "gold-dark"
    | "contrast-gold"
    | "forest"
    | "forest-dark"
    | "terracotta"
    | "neutral"
    | "success"
    | "warning"
    | "danger"
    | "outline";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  className?: string;
}

export function Badge({
  children,
  variant = "gold",
  size = "md",
  icon,
  className = "",
  ...props
}: BadgeProps) {
  const variantStyles = {
    gold: "bg-sand-light text-ink border border-terracotta/40 font-semibold",
    "gold-dark": "bg-forest text-cream border border-sand/40 font-semibold",
    "contrast-gold": "bg-cream text-terracotta-dark border border-terracotta/35 font-semibold",
    forest: "bg-sage text-forest border border-forest/20 font-semibold",
    "forest-dark": "bg-forest-deep text-white border border-sand/35 font-semibold",
    terracotta: "bg-terracotta text-white border border-terracotta-dark font-semibold",
    neutral: "bg-cream text-ink border border-border-warm font-medium",
    success: "bg-sage text-forest border border-forest/25 font-semibold",
    warning: "bg-sand/70 text-ink border border-terracotta/50 font-semibold",
    danger: "bg-red-50 text-red-900 border border-red-300 font-semibold",
    outline: "bg-transparent text-forest border border-forest/35 font-medium",
  };

  const sizeStyles = {
    sm: "text-[10px] px-2 py-0.5 gap-1",
    md: "text-[11px] px-2.5 py-0.5 gap-1.5",
    lg: "text-xs px-3 py-1 gap-2",
  };

  return (
    <span
      className={`inline-flex items-center uppercase tracking-wider rounded-xs select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
