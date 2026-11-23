import React, { useId } from "react";
import { AlertCircle } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id: customId,
      required,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = customId || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="w-full space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-bold text-forest uppercase tracking-wider"
          >
            {label}
            {required && (
              <>
                <span className="text-terracotta-dark font-bold ml-1" aria-hidden="true">*</span>
                <span className="sr-only"> (required)</span>
              </>
            )}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 pointer-events-none text-ink-secondary shrink-0">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            required={required}
            aria-required={required ? "true" : undefined}
            disabled={disabled}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={`w-full rounded-xs bg-white text-xs sm:text-sm text-ink placeholder-ink-secondary/70 border transition-all duration-200 min-h-[44px] px-3.5 py-2.5 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-terracotta disabled:opacity-50 disabled:bg-sage/35 disabled:cursor-not-allowed ${
              leftIcon ? "pl-10" : ""
            } ${rightIcon ? "pr-10" : ""} ${
              error
                ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                : "border-border-warm focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
            } ${className}`}
            {...props}
          />

          {rightIcon && !error && (
            <div className="absolute right-3.5 pointer-events-none text-ink-secondary shrink-0">
              {rightIcon}
            </div>
          )}

          {error && (
            <div className="absolute right-3.5 pointer-events-none text-red-600 shrink-0" aria-hidden="true">
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
        </div>

        {error ? (
          <p id={errorId} role="alert" aria-live="polite" className="text-[11px] text-red-700 font-medium pt-0.5">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-[11px] text-ink-sand pt-0.5">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
