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

          {showCount && maxLength && (
            <span className="text-[10px] text-ink-sand tabular-nums" aria-live="off">
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
            aria-required={required ? "true" : undefined}
            disabled={disabled}
            maxLength={maxLength}
            value={value}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={`w-full rounded-xs bg-white text-xs sm:text-sm text-ink placeholder-ink-secondary/70 border transition-all duration-200 px-3.5 py-2.5 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-terracotta disabled:opacity-50 disabled:bg-sage/35 disabled:cursor-not-allowed resize-y ${
              error
                ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                : "border-border-warm focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
            } ${className}`}
            {...props}
          />

          {error && (
            <div className="absolute top-3 right-3 pointer-events-none text-red-600 shrink-0" aria-hidden="true">
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

Textarea.displayName = "Textarea";
