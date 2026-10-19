'use client';
/**
 * @fileoverview Admin Authentication Context
 * @description Password-based authentication for the admin panel.
 *
 * SECURITY:
 * - Password compared server-side in constant time (/api/auth/login)
 * - Session is a signed 24h token in an httpOnly, Secure, SameSite=Strict
 *   cookie — JavaScript never sees it, nothing is stored in localStorage
 * - Admin API routes verify the cookie on every request
 *
 * NOTE: This is a simple solution for a single admin.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type FC,
  type ReactNode,
} from 'react';

// =============================================================================
// TYPES
// =============================================================================

interface AdminContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

// Pre-cookie versions stored a permanent token here — remove it if present
const LEGACY_STORAGE_KEY = 'shwaki_admin_session';

// =============================================================================
// CONTEXT
// =============================================================================

const AdminContext = createContext<AdminContextValue | null>(null);

// =============================================================================
// PROVIDER
// =============================================================================

export const AdminProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session', { credentials: 'same-origin', cache: 'no-store' });
      const data = await res.json();
      setExpiresAt(data.authenticated ? data.expiresAt : null);
    } catch {
      setExpiresAt(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Only the admin page needs to know — skip the request everywhere else
  useEffect(() => {
    try { localStorage.removeItem(LEGACY_STORAGE_KEY); } catch { /* storage unavailable */ }
    if (/^\/[a-z]{2}\/admin(\/|$)/.test(window.location.pathname)) checkSession();
    else setIsLoading(false);
  }, [checkSession]);

  // Login function
  const login = useCallback(async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }
      await checkSession();
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }, [checkSession]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
    } finally {
      setExpiresAt(null);
    }
  }, []);

  const value: AdminContextValue = {
    isAuthenticated: expiresAt !== null && expiresAt > Date.now(),
    isLoading,
    login,
    logout,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

// =============================================================================
// HOOK (exported from this file for colocation, but can be moved if
// Fast Refresh warnings appear)
// =============================================================================

// eslint-disable-next-line react-refresh/only-export-components
export function useAdmin(): AdminContextValue {
  const context = useContext(AdminContext);
  
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  
  return context;
}

// =============================================================================
// PROTECTED ROUTE WRAPPER
// =============================================================================

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children, fallback }) => {
  const { isAuthenticated, isLoading } = useAdmin();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
};
