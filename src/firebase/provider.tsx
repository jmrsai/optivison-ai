
'use client';

import {
  createContext,
  useState,
  useEffect,
  type PropsWithChildren,
  useContext,
} from 'react';
import { initializeFirebase } from '.';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/icons';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

interface FirebaseContextValue {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  storage: FirebaseStorage;
}

const FirebaseContext = createContext<FirebaseContextValue | undefined>(undefined);

export function FirebaseProvider({ children }: PropsWithChildren) {
  const [instances, setInstances] = useState<FirebaseContextValue | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const { firebaseApp, auth, firestore, storage } = initializeFirebase();
        setInstances({ firebaseApp, auth, firestore, storage });
      } catch (e: any) {
         if (e.message.includes('firestore is not available')) {
            setError("Firestore is not enabled for this project. Please go to your Firebase Console, select your project, and click 'Create database' in the Firestore Database section.");
         } else {
            setError("Failed to initialize Firebase. Please check your configuration in src/firebase/config.ts.");
         }
         console.error("Firebase Initialization Error:", e);
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
                <div className="max-w-xl w-full bg-red-50 border border-red-200 text-red-900 rounded-lg p-6 text-center">
                    <h1 className="text-xl font-bold">Application Error: Firebase Misconfiguration</h1>
                    <p className="mt-2">{error}</p>
                    <a href={`https://console.firebase.google.com/project/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/firestore`} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700">
                        Go to Firebase Console
                    </a>
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
    <FirebaseContext.Provider value={instances}>
        {children}
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

    