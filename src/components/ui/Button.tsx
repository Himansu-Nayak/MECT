import React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold" | "dark-outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer rounded-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A059] disabled:opacity-50 disabled:pointer-events-none select-none";

    const variantStyles = {
      primary:
        "bg-[#0B3B24] text-[#FDFBF7] hover:bg-[#072617] border border-[#0B3B24] shadow-xs hover:shadow-sm active:scale-[0.99]",
      secondary:
        "bg-[#F4EFE6] text-[#072617] hover:bg-[#EDE6D8] border border-[#0B3B24]/15 shadow-xs active:scale-[0.99]",
      outline:
        "border border-[#0B3B24] text-[#0B3B24] hover:bg-[#0B3B24] hover:text-[#FDFBF7] active:scale-[0.99]",
      ghost:
        "text-[#072617] hover:bg-[#0B3B24]/8 hover:text-[#0B3B24] active:bg-[#0B3B24]/12",
      gold:
        "bg-[#C5A059] text-[#072617] hover:bg-[#B38D44] font-semibold border border-[#B38D44]/40 shadow-xs hover:shadow-sm active:scale-[0.99]",
      "dark-outline":
        "border border-white/30 text-white hover:bg-white/10 hover:border-white/50 active:scale-[0.99]",
    };

    const sizeStyles = {
      sm: "text-xs px-3.5 py-1.5 gap-1.5 min-h-[34px]",
      md: "text-sm px-5 py-2.5 gap-2 min-h-[42px]",
      lg: "text-base px-6 py-3.5 gap-2.5 min-h-[48px]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
