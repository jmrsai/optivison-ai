
'use client';
import React, { useMemo, useState, useEffect } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from '.';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

interface FirebaseInstances {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [instances, setInstances] = useState<FirebaseInstances | null>(null);

  useEffect(() => {
    // This check ensures that Firebase is only initialized on the client-side.
    if (typeof window !== 'undefined') {
      const { firebaseApp, firestore, auth } = initializeFirebase();
      setInstances({ firebaseApp, firestore, auth });
    }
  }, []);

  if (!instances) {
    // You can render a loading state here if needed
    return null;
  }

  return (
    <FirebaseProvider
      firebaseApp={instances.firebaseApp}
      firestore={instances.firestore}
      auth={instances.auth}
    >
      {children}
    </FirebaseProvider>
  );
}
