import React, { useCallback, useMemo, useState } from 'react';
import type { AdminAuthContextValue, AdminUser } from './AdminAuthContext.types';
import { AdminAuthContext } from './AdminAuthContext.core';

const STORAGE_KEY_TOKEN = 'gs_admin_jwt';
const STORAGE_KEY_USER = 'gs_admin_user';

function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function getJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function isJwtExpired(token: string): boolean {
  const payload = getJwtPayload(token);
  const exp = payload?.exp;
  if (typeof exp !== 'number') return false;
  return Date.now() >= exp * 1000;
}

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    const existing = sessionStorage.getItem(STORAGE_KEY_TOKEN);
    if (!existing) return null;
    if (isJwtExpired(existing)) {
      sessionStorage.removeItem(STORAGE_KEY_TOKEN);
      sessionStorage.removeItem(STORAGE_KEY_USER);
      return null;
    }
    return existing;
  });

  const [user, setUser] = useState<AdminUser>(() => {
    return safeJsonParse<AdminUser>(sessionStorage.getItem(STORAGE_KEY_USER));
  });

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem(STORAGE_KEY_TOKEN);
    sessionStorage.removeItem(STORAGE_KEY_USER);
  }, []);

  const login = useCallback(async (identifier: string, password: string) => {
    const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

    const response = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ identifier, password }),
    });

    const json = (await response.json().catch(() => null)) as
      | { jwt?: string; user?: AdminUser; error?: { message?: string } }
      | null;

    if (!response.ok || !json?.jwt) {
      const message = json?.error?.message || 'Login failed';
      throw new Error(message);
    }

    if (isJwtExpired(json.jwt)) {
      throw new Error('Received an expired token');
    }

    setToken(json.jwt);
    setUser(json.user ?? null);
    sessionStorage.setItem(STORAGE_KEY_TOKEN, json.jwt);
    sessionStorage.setItem(STORAGE_KEY_USER, JSON.stringify(json.user ?? null));
  }, []);

  const isAuthenticated = useMemo(() => {
    if (!token) return false;
    if (isJwtExpired(token)) return false;
    return true;
  }, [token]);

  const value = useMemo<AdminAuthContextValue>(
    () => ({ token, user, isAuthenticated, login, logout }),
    [token, user, isAuthenticated, login, logout]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};
