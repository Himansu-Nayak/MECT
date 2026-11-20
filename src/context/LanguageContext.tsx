"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import orLocale from "../../locales/or.json";

export type Locale = "en" | "or";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (path: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "en",
  setLocale: () => {},
  toggleLocale: () => {},
  t: (_path, fallback) => fallback || "",
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("mect_locale") as Locale | null;
      if (stored === "en" || stored === "or") {
        setLocaleState(stored);
        document.documentElement.lang = stored;
      }
    } catch {
      // LocalStorage access restricted in private mode
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem("mect_locale", newLocale);
      document.documentElement.lang = newLocale;
    } catch {
      // Ignore storage errors
    }
  };

  const toggleLocale = () => {
    setLocale(locale === "en" ? "or" : "en");
  };

  const t = (path: string, fallback?: string): string => {
    if (locale === "en") {
      return fallback || path;
    }

    const parts = path.split(".");
    let current: any = orLocale;
    for (const part of parts) {
      if (current && typeof current === "object" && part in current) {
        current = current[part];
      } else {
        return fallback || path;
      }
    }

    if (typeof current === "string") {
      return current;
    }
    return fallback || path;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, toggleLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
