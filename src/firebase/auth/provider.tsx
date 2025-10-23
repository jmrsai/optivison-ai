
'use client';

import {
  createContext,
  useState,
  useEffect,
  type PropsWithChildren,
  useContext,
} from 'react';
import { initializeAuth } from '..';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/icons';

interface AuthContextValue {
  firebaseApp: FirebaseApp;
  auth: Auth;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [instances, setInstances] = useState<AuthContextValue | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const { firebaseApp, auth } = initializeAuth();
        setInstances({ firebaseApp, auth });
      } catch (e: any) {
         setError("Failed to initialize Firebase Authentication. Please check your configuration.");
         console.error("Firebase Auth Initialization Error:", e);
      }
    }
  }, []);
  
  if (error) {
     return (
        <div className="flex flex-col min-h-screen bg-background">
            <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
                <div className="container flex h-16 items-center justify-between">
                     <div className="flex items-center gap-2">
                        <Logo className="h-8 w-8 text-primary" />
                        <span className="text-xl font-bold text-foreground">OptiVision AI</span>
                     </div>
                 </div>
            </header>
            <main className="flex-1 container mx-auto p-4 md:p-8 flex items-center justify-center">
                <div className="max-w-md w-full bg-red-50 border border-red-200 text-red-900 rounded-lg p-6 text-center">
                    <h1 className="text-xl font-bold">Application Error</h1>
                    <p className="mt-2">{error}</p>
                </div>
            </main>
      </div>
     )
  }

  if (!instances) {
     return (
        <div className="flex flex-col min-h-screen bg-background">
            <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
                <div className="container flex h-16 items-center justify-between">
                     <div className="flex items-center gap-2">
                        <Logo className="h-8 w-8 text-primary" />
                        <span className="text-xl font-bold text-foreground">OptiVision AI</span>
                     </div>
                 </div>
            </header>
            <main className="flex-1 container mx-auto p-4 md:p-8 flex items-center justify-center">
                <div className="flex items-center gap-2">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    <p>Initializing Connection...</p>
                </div>
            </main>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={instances}>
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

export function useFirebaseApp() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useFirebaseApp must be used within an AuthProvider');
  }

  return context.firebaseApp;
}
