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

interface FirebaseContext {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

const Context = createContext<FirebaseContext | undefined>(undefined);

export function FirebaseProvider(
  props: PropsWithChildren<{
    firebaseApp: FirebaseApp;
    auth: Auth;
    firestore: Firestore;
  }>
) {
  const { firebaseApp, auth, firestore } = props;

  const value = useMemo(() => {
    return {
      firebaseApp,
      auth,
      firestore,
    };
  }, [firebaseApp, auth, firestore]);

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
