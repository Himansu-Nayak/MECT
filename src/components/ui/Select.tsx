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
            className="block text-xs font-bold text-[#0B3B24] uppercase tracking-wider"
          >
            {label}
            {required && <span className="text-[#C5A059] ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            ref={ref}
            id={inputId}
            required={required}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={`w-full appearance-none rounded-xs bg-[#FDFBF7] text-xs sm:text-sm text-[#1C2421] border transition-all duration-200 min-h-[42px] px-3.5 pr-10 py-2.5 focus:outline-none disabled:opacity-50 disabled:bg-[#EDE6D8]/40 disabled:cursor-not-allowed cursor-pointer ${
              error
                ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                : "border-[#0B3B24]/20 focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20"
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

          <div className="absolute right-3.5 pointer-events-none text-[#C5A059] shrink-0">
            {error ? (
              <AlertCircle className="w-4 h-4 text-red-500" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </div>

        {error ? (
          <p id={errorId} role="alert" className="text-[11px] text-red-600 font-medium pt-0.5">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-[11px] text-[#4A5568] pt-0.5">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";
