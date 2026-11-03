import React from "react";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: "default" | "narrow" | "prose" | "wide" | "full";
  gutter?: "normal" | "compact" | "none";
  as?: React.ElementType;
  className?: string;
}

export function Container({
  children,
  size = "default",
  gutter = "normal",
  as: Component = "div",
  className = "",
  ...props
}: ContainerProps) {
  const sizeStyles = {
    default: "max-w-7xl",
    narrow: "max-w-4xl",
    prose: "max-w-3xl",
    wide: "max-w-[1400px]",
    full: "w-full",
  };

  const gutterStyles = {
    normal: "px-4 sm:px-6 lg:px-8",
    compact: "px-4 sm:px-6",
    none: "px-0",
  };

  return (
    <Component
      className={`mx-auto w-full ${sizeStyles[size]} ${gutterStyles[gutter]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
