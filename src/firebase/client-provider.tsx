
// src/firebase/client-provider.tsx
'use client';
import { useMemo } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from '.';

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { firebaseApp, firestore, auth, database, analytics } = useMemo(() => {
    return initializeFirebase();
  }, []);

  return (
    <FirebaseProvider
      firebaseApp={firebaseApp}
      firestore={firestore}
      auth={auth}
      database={database}
      analytics={analytics}
    >
      {children}
    </FirebaseProvider>
  );
}
