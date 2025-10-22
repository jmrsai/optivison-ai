// src/firebase/index.ts
import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

import { getFirebaseConfigClient } from './config';

export function initializeFirebase(): {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
} {
  const apps = getApps();
  const app = apps.length > 0 ? apps[0] : initializeApp(getFirebaseConfigClient());

  const auth = getAuth(app);
  const firestore = getFirestore(app);
  
  return { firebaseApp: app, firestore, auth };
}

export * from './provider';