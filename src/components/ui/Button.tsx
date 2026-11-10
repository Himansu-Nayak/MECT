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
      "inline-flex items-center justify-center font-semibold tracking-tight transition-all duration-200 cursor-pointer rounded-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta disabled:opacity-50 disabled:pointer-events-none select-none";

    const variantStyles = {
      primary:
        "bg-terracotta text-white hover:bg-terracotta-dark border border-terracotta hover:border-terracotta-dark shadow-xs hover:shadow-sm active:scale-[0.99]",
      secondary:
        "bg-sage text-forest hover:bg-sand border border-border-warm shadow-xs active:scale-[0.99]",
      outline:
        "border border-terracotta text-terracotta-dark hover:bg-terracotta-dark hover:text-white active:scale-[0.99]",
      ghost:
        "text-forest hover:bg-sand-light hover:text-forest-deep active:bg-sand/60",
      gold:
        "bg-sand text-forest-deep hover:bg-cream hover:text-forest-deep font-semibold border border-terracotta/40 hover:border-terracotta shadow-xs hover:shadow-sm active:scale-[0.99]",
      "dark-outline":
        "border border-cream/55 text-white hover:bg-forest-deep hover:border-sand active:scale-[0.99]",
    };

    const sizeStyles = {
      sm: "text-xs px-3.5 py-1.5 gap-1.5 min-h-[36px]",
      md: "text-sm px-5 py-2.5 gap-2 min-h-[44px]",
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
