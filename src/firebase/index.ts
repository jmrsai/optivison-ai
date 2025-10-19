
// src/firebase/index.ts
import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getDatabase, type Database } from 'firebase/database';
import { getAnalytics, type Analytics } from 'firebase/analytics';

import { getFirebaseConfigClient } from './config';

export function initializeFirebase(): {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  database: Database;
  analytics: Analytics | null;
} {
  const apps = getApps();
  const app = apps.length > 0 ? apps[0] : initializeApp(getFirebaseConfigClient());

  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const database = getDatabase(app);
  
  let analytics: Analytics | null = null;
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }


  return { firebaseApp: app, firestore, auth, database, analytics };
}

export * from './provider';
export { useUser } from './auth/use-user';
