import React, { useId } from "react";
import { AlertCircle } from "lucide-react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCount?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      id: customId,
      required,
      maxLength,
      showCount = false,
      value,
      className = "",
      disabled,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = customId || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const currentLength = typeof value === "string" ? value.length : 0;

    return (
      <div className="w-full space-y-1">
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={inputId}
              className="block text-xs font-bold text-[#0B3B24] uppercase tracking-wider"
            >
              {label}
              {required && <span className="text-[#C5A059] ml-1">*</span>}
            </label>
          )}

          {showCount && maxLength && (
            <span className="text-[10px] text-[#4A5568] tabular-nums">
              {currentLength}/{maxLength}
            </span>
          )}
        </div>

        <div className="relative">
          <textarea
            ref={ref}
            id={inputId}
            rows={rows}
            required={required}
            disabled={disabled}
            maxLength={maxLength}
            value={value}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={`w-full rounded-xs bg-[#FDFBF7] text-xs sm:text-sm text-[#1C2421] placeholder-[#4A5568]/60 border transition-all duration-200 px-3.5 py-2.5 focus:outline-none disabled:opacity-50 disabled:bg-[#EDE6D8]/40 disabled:cursor-not-allowed resize-y ${
              error
                ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                : "border-[#0B3B24]/20 focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20"
            } ${className}`}
            {...props}
          />

          {error && (
            <div className="absolute top-3 right-3 pointer-events-none text-red-500 shrink-0">
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

Textarea.displayName = "Textarea";
