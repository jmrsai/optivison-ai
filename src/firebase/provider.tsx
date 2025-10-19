// src/firebase/provider.tsx
'use client';
import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
} from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { Analytics } from 'firebase/analytics';

interface FirebaseContext {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  analytics: Analytics | null;
}

const Context = createContext<FirebaseContext | undefined>(undefined);

export function FirebaseProvider(
  props: PropsWithChildren<{
    firebaseApp: FirebaseApp;
    auth: Auth;
    firestore: Firestore;
    analytics: Analytics | null;
  }>
) {
  const { firebaseApp, auth, firestore, analytics } = props;

  const value = useMemo(() => {
    return {
      firebaseApp,
      auth,
      firestore,
      analytics,
    };
  }, [firebaseApp, auth, firestore, analytics]);

  return <Context.Provider value={value}>{props.children}</Context.Provider>;
}

export function useFirebase() {
  const context = useContext(Context);

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

export function useAnalytics() {
  const { analytics } = useFirebase();

  if (!analytics) {
    console.warn('Firebase Analytics is not available. This might be because it is being accessed from the server.');
  }

  return analytics;
}
