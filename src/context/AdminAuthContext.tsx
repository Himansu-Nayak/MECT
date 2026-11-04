"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { loginAdmin, refreshAdminToken, AdminAuthResponse, AdminLoginPayload } from "@/lib/api";

interface AdminAuthContextType {
  user: AdminAuthResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: AdminLoginPayload) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const REFRESH_TOKEN_KEY = "mt_admin_refresh_token";

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminAuthResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function restoreSession() {
      const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!storedRefreshToken) {
        setIsLoading(false);
        return;
      }

      try {
        const authData = await refreshAdminToken(storedRefreshToken);
        setToken(authData.accessToken);
        setUser(authData);
        localStorage.setItem(REFRESH_TOKEN_KEY, authData.refreshToken);
      } catch {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = async (payload: AdminLoginPayload) => {
    setIsLoading(true);
    try {
      const authData = await loginAdmin(payload);
      setToken(authData.accessToken);
      setUser(authData);
      localStorage.setItem(REFRESH_TOKEN_KEY, authData.refreshToken);
      router.push("/admin");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setToken(null);
    setUser(null);
    router.push("/admin/login");
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
