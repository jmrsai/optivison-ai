
'use client';

import {
  createContext,
  useState,
  useEffect,
  type PropsWithChildren,
  useContext,
} from 'react';
import type { Auth } from 'firebase/auth';
import { useFirebase } from '../provider';

interface AuthContextValue {
  auth: Auth;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const { auth } = useFirebase();

  if (!auth) {
    return <>{children}</>;
  }

  return (
    <AuthContext.Provider value={{ auth }}>
        {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context.auth;
}

    