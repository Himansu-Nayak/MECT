// motion: owner = Motion
"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { CheckCircle2, AlertCircle, Loader2, X } from "lucide-react";
import { MOTION_TRANSITIONS } from "@/lib/motion";

export type ToastVariant = "loading" | "success" | "error" | "info";

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant, durationMs?: number) => string;
  dismissToast: (id: string) => void;
  promiseToast: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: unknown) => string);
    }
  ) => Promise<T>;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const shouldReduceMotion = useReducedMotion();
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismissToast = useCallback((id: string) => {
    const existing = timersRef.current.get(id);
    if (existing) {
      clearTimeout(existing);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = "info", durationMs = 4200) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-3), { id, message, variant }]);

      if (variant !== "loading" && durationMs > 0) {
        const timer = setTimeout(() => dismissToast(id), durationMs);
        timersRef.current.set(id, timer);
      }
      return id;
    },
    [dismissToast]
  );

  const promiseToast = useCallback(
    async <T,>(
      promise: Promise<T>,
      messages: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((err: unknown) => string);
      }
    ): Promise<T> => {
      const id = showToast(messages.loading, "loading", 0);
      try {
        const result = await promise;
        const successMsg =
          typeof messages.success === "function"
            ? messages.success(result)
            : messages.success;
        setToasts((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, message: successMsg, variant: "success" } : t
          )
        );
        const timer = setTimeout(() => dismissToast(id), 4500);
        timersRef.current.set(id, timer);
        return result;
      } catch (err) {
        const errorMsg =
          typeof messages.error === "function"
            ? messages.error(err)
            : messages.error;
        setToasts((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, message: errorMsg, variant: "error" } : t
          )
        );
        const timer = setTimeout(() => dismissToast(id), 6000);
        timersRef.current.set(id, timer);
        throw err;
      }
    },
    [dismissToast, showToast]
  );

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast, promiseToast }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed bottom-4 right-4 z-[70] flex flex-col gap-2 max-w-sm w-[calc(100vw-2rem)] pointer-events-none print:hidden"
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <m.div
              key={toast.id}
              role="status"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
              transition={MOTION_TRANSITIONS.fast}
              className={[
                "pointer-events-auto flex items-start gap-2.5 rounded-xs border px-3.5 py-3 text-xs font-sans shadow-lg",
                toast.variant === "error"
                  ? "bg-white border-terracotta text-ink"
                  : toast.variant === "success"
                  ? "bg-forest-deep border-sand/40 text-cream"
                  : "bg-cream border-border-warm text-ink",
              ].join(" ")}
            >
              {toast.variant === "loading" && (
                <Loader2
                  className="w-4 h-4 shrink-0 mt-0.5 animate-spin text-terracotta"
                  aria-hidden="true"
                />
              )}
              {toast.variant === "success" && (
                <CheckCircle2
                  className="w-4 h-4 shrink-0 mt-0.5 text-sand"
                  aria-hidden="true"
                />
              )}
              {toast.variant === "error" && (
                <AlertCircle
                  className="w-4 h-4 shrink-0 mt-0.5 text-terracotta-dark"
                  aria-hidden="true"
                />
              )}
              <span className="flex-1 leading-snug font-medium">{toast.message}</span>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                aria-label="Dismiss notification"
                className="shrink-0 p-0.5 rounded-xs opacity-75 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-terracotta"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </m.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      showToast: () => "",
      dismissToast: () => {},
      promiseToast: async <T,>(promise: Promise<T>) => promise,
    };
  }
  return ctx;
}

