// src/firebase/index.ts
import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAnalytics, type Analytics } from "firebase/analytics";

import { getFirebaseConfigClient } from './config';

export function initializeFirebase(): {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  analytics: Analytics | null;
  config: Record<string, string>;
} {
  const config = getFirebaseConfigClient();
  const apps = getApps();
  const app = apps.length > 0 ? apps[0] : initializeApp(config);

  const auth = getAuth(app);
  const firestore = getFirestore(app);
  
  let analytics: Analytics | null = null;
  if (typeof window !== 'undefined') {
    try {
      analytics = getAnalytics(app);
    } catch (e) {
      console.error("Firebase Analytics is not available in this environment.");
    }
  }

  return { firebaseApp: app, firestore, auth, analytics, config };
}

export * from './provider';
