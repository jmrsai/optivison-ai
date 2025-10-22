// src/firebase/provider.tsx
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
import { AppHeader } from '@/components/layout/app-header';


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
            <AppHeader />
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
