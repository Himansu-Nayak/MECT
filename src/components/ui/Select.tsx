import React, { useId } from "react";
import { ChevronDown, AlertCircle } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      children,
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
          <select
            ref={ref}
            id={inputId}
            required={required}
            aria-required={required ? "true" : undefined}
            disabled={disabled}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={`w-full appearance-none rounded-xs bg-white text-xs sm:text-sm text-ink border transition-all duration-200 min-h-[44px] px-3.5 pr-10 py-2.5 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-terracotta disabled:opacity-50 disabled:bg-sage/35 disabled:cursor-not-allowed cursor-pointer ${
              error
                ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                : "border-border-warm focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
            } ${className}`}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <div className="absolute right-3.5 pointer-events-none text-terracotta-dark shrink-0">
            {error ? (
              <AlertCircle className="w-4 h-4 text-red-600" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
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

Select.displayName = "Select";
