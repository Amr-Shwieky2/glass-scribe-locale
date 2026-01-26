import { createContext } from 'react';
import type { AdminAuthContextValue } from './AdminAuthContext.types';

export const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);
