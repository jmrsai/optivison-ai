'use client';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type PropsWithChildren,
} from 'react';
import { initializeFirebase } from '.';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { Loader2 } from 'lucide-react';

interface FirebaseContextValue {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

const FirebaseContext = createContext<FirebaseContextValue | undefined>(undefined);

export function FirebaseProvider({ children }: PropsWithChildren) {
  const [instances, setInstances] = useState<FirebaseContextValue | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { firebaseApp, firestore, auth } = initializeFirebase();
      setInstances({ firebaseApp, firestore, auth });
    }
  }, []);

  if (!instances) {
     return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* We can't render AppHeader here as it needs the context */}
            <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
                <div className="container flex h-16 items-center justify-between">
                     <div className="flex items-center gap-2">
                        {/* Simplified logo */}
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary">
                            <path d="M12 5C5.636 5 2 12 2 12s3.636 7 10 7 10-7 10-7-3.636-7-10-7z"></path><circle cx="12" cy="12" r="3"></circle>
                        </svg>
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
    <FirebaseContext.Provider value={instances}>
        {children}
        <FirebaseErrorListener />
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);

  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }

  return context;
}

export function useFirebaseApp() {
  const { firebaseApp } = useFirebase();
  return firebaseApp;
}

export function useAuth() {
  const { auth } = useFirebase();
  return auth;
}

export function useFirestore() {
  const { firestore } = useFirebase();
  return firestore;
}
