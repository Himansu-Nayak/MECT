import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?:
    | "gold"
    | "gold-dark"
    | "contrast-gold"
    | "forest"
    | "forest-dark"
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
    gold: "bg-[#C5A059]/15 text-[#7A5E24] border border-[#C5A059]/35 font-semibold",
    "gold-dark": "bg-[#0B3B24] text-[#E4C88A] border border-[#C5A059]/40 font-semibold",
    "contrast-gold": "bg-[#7A5E24]/10 text-[#7A5E24] border border-[#7A5E24]/30 font-semibold",
    forest: "bg-[#0B3B24]/10 text-[#0B3B24] border border-[#0B3B24]/25 font-semibold",
    "forest-dark": "bg-[#072617] text-[#EDE6D8] border border-[#C5A059]/30 font-semibold",
    neutral: "bg-[#EDE6D8]/60 text-[#1C2421] border border-[#0B3B24]/15 font-medium",
    success: "bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold",
    warning: "bg-amber-50 text-amber-900 border border-amber-300 font-semibold",
    danger: "bg-red-50 text-red-800 border border-red-300 font-semibold",
    outline: "bg-transparent text-[#0B3B24] border border-[#0B3B24]/30 font-medium",
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
