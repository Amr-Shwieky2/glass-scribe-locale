/**
 * @fileoverview Admin Authentication Context
 * @description Simple password-based authentication for admin panel.
 * 
 * SECURITY:
 * - Password hashed and compared server-side
 * - Session stored in localStorage with 24-hour expiry
 * - Token validated on each API request
 * 
 * NOTE: This is a simple solution for a single admin.
 * For multiple users, consider Supabase Auth or similar.
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

interface AdminSession {
  token: string;
  expiresAt: number;
}

interface AdminContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const STORAGE_KEY = 'shwaki_admin_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// =============================================================================
// CONTEXT
// =============================================================================

const AdminContext = createContext<AdminContextValue | null>(null);

// =============================================================================
// PROVIDER
// =============================================================================

export const AdminProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (stored) {
      try {
        const parsed: AdminSession = JSON.parse(stored);
        
        // Check if session is still valid
        if (parsed.expiresAt > Date.now()) {
          setSession(parsed);
        } else {
          // Session expired, clean up
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        // Invalid JSON, clean up
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    
    setIsLoading(false);
  }, []);

  // Login function
  const login = useCallback(async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }

      // Create session
      const newSession: AdminSession = {
        token: data.token,
        expiresAt: Date.now() + SESSION_DURATION,
      };

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
      setSession(newSession);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }, []);

  // Context value
  const value: AdminContextValue = {
    isAuthenticated: session !== null && session.expiresAt > Date.now(),
    isLoading,
    token: session?.token ?? null,
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
