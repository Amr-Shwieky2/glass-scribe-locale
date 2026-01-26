export type AdminUser = {
  id?: number;
  username?: string;
  email?: string;
  [key: string]: unknown;
} | null;

export type AdminAuthContextValue = {
  token: string | null;
  user: AdminUser;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
};
