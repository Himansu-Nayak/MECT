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
            className="block text-xs font-bold text-[#0B3B24] uppercase tracking-wider"
          >
            {label}
            {required && <span className="text-[#C5A059] ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 pointer-events-none text-[#4A5568] shrink-0">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            required={required}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={`w-full rounded-xs bg-[#FDFBF7] text-xs sm:text-sm text-[#1C2421] placeholder-[#4A5568]/60 border transition-all duration-200 min-h-[42px] px-3.5 py-2.5 focus:outline-none disabled:opacity-50 disabled:bg-[#EDE6D8]/40 disabled:cursor-not-allowed ${
              leftIcon ? "pl-10" : ""
            } ${rightIcon ? "pr-10" : ""} ${
              error
                ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                : "border-[#0B3B24]/20 focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20"
            } ${className}`}
            {...props}
          />

          {rightIcon && !error && (
            <div className="absolute right-3.5 pointer-events-none text-[#4A5568] shrink-0">
              {rightIcon}
            </div>
          )}

          {error && (
            <div className="absolute right-3.5 pointer-events-none text-red-500 shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
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

Input.displayName = "Input";
