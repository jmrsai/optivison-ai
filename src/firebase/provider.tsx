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
import { Loader2, AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';

interface FirebaseContextValue {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

const FirebaseContext = createContext<FirebaseContextValue | undefined>(undefined);

export function FirebaseProvider({ children }: PropsWithChildren) {
  const [instances, setInstances] = useState<FirebaseContextValue | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const { firebaseApp, firestore, auth } = initializeFirebase();
        setInstances({ firebaseApp, firestore, auth });
      } catch (e: any) {
         if (e.message.includes("firestore is not available")) {
            setError("Firestore is not enabled for this Firebase project.");
         } else {
            setError("Failed to initialize Firebase. Please check your configuration.");
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
                <div className="max-w-2xl w-full bg-red-50 border border-red-200 text-red-900 rounded-lg p-8 text-center shadow-md">
                    <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
                    <h1 className="mt-4 text-2xl font-bold">Action Required: Enable Firestore</h1>
                    <p className="mt-2 text-base">
                        The application failed to connect to the database. The Firestore service is not enabled in your Firebase project (<strong className="font-semibold">{process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'N/A'}</strong>).
                    </p>
                    <p className="mt-4 text-left text-sm">Please follow these steps to resolve the issue:</p>
                    <ol className="mt-2 text-left text-sm list-decimal list-inside space-y-2">
                        <li>Go to the <span className="font-semibold">Firebase Console</span>.</li>
                        <li>Select your project: <span className="font-semibold">{process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'N/A'}</span>.</li>
                        <li>In the left-hand menu, under "Build", click <span className="font-semibold">Firestore Database</span>.</li>
                        <li>Click the <span className="font-semibold">"Create database"</span> button.</li>
                        <li>Choose to start in <span className="font-semibold">"Production mode"</span>.</li>
                        <li>Select a Cloud Firestore location (e.g., a region near you).</li>
                        <li>Click <span className="font-semibold">"Enable"</span>.</li>
                    </ol>
                    <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                         <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
                            <a href={`https://console.firebase.google.com/project/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/firestore`} target="_blank" rel="noopener noreferrer">
                                Open Firestore Console
                                <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                        </Button>
                         <Button variant="outline" onClick={() => window.location.reload()}>
                            I've enabled it, Reload App
                        </Button>
                    </div>
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
