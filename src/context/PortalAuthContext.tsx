"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  PortalAuthResponse,
  PortalDashboardData,
  fetchPortalDashboard,
  logoutPortal,
  refreshPortalToken,
} from "@/lib/portal-api";

interface PortalAuthContextType {
  session: PortalAuthResponse | null;
  token: string | null;
  dashboard: PortalDashboardData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setSessionFromOtp: (auth: PortalAuthResponse) => Promise<void>;
  refreshDashboard: () => Promise<void>;
  logout: () => Promise<void>;
}

const PortalAuthContext = createContext<PortalAuthContextType | undefined>(undefined);
const PORTAL_REFRESH_KEY = "mt_portal_refresh_token";

export function PortalAuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<PortalAuthResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<PortalDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const loadDashboardSafely = useCallback(async (accessToken: string) => {
    try {
      const data = await fetchPortalDashboard(accessToken);
      setDashboard(data);
    } catch {
      setDashboard(null);
    }
  }, []);

  useEffect(() => {
    let active = true;
    async function restore() {
      const storedRefresh = typeof window !== "undefined" ? localStorage.getItem(PORTAL_REFRESH_KEY) : null;
      if (!storedRefresh) {
        if (active) setIsLoading(false);
        return;
      }
      try {
        const auth = await refreshPortalToken(storedRefresh);
        if (!active) return;
        setSession(auth);
        setToken(auth.accessToken);
        localStorage.setItem(PORTAL_REFRESH_KEY, auth.refreshToken);
        await loadDashboardSafely(auth.accessToken);
      } catch {
        if (typeof window !== "undefined") localStorage.removeItem(PORTAL_REFRESH_KEY);
        if (active) {
          setSession(null);
          setToken(null);
          setDashboard(null);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }
    restore();
    return () => { active = false; };
  }, [loadDashboardSafely]);

  const setSessionFromOtp = async (auth: PortalAuthResponse) => {
    setSession(auth);
    setToken(auth.accessToken);
    if (typeof window !== "undefined") {
      localStorage.setItem(PORTAL_REFRESH_KEY, auth.refreshToken);
    }
    await loadDashboardSafely(auth.accessToken);
  };

  const refreshDashboard = async () => {
    if (!token) return;
    await loadDashboardSafely(token);
  };

  const logout = async () => {
    if (token) {
      await logoutPortal(token);
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem(PORTAL_REFRESH_KEY);
    }
    setSession(null);
    setToken(null);
    setDashboard(null);
    router.push("/portal/login");
  };

  return (
    <PortalAuthContext.Provider
      value={{
        session,
        token,
        dashboard,
        isAuthenticated: !!token && !!session,
        isLoading,
        setSessionFromOtp,
        refreshDashboard,
        logout,
      }}
    >
      {children}
    </PortalAuthContext.Provider>
  );
}

export function usePortalAuth() {
  const ctx = useContext(PortalAuthContext);
  if (!ctx) {
    throw new Error("usePortalAuth must be used inside PortalAuthProvider");
  }
  return ctx;
}

