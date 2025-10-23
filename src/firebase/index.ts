
// src/firebase/index.ts
import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirebaseConfigClient } from './config';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

let firebaseAppInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let firestoreInstance: Firestore | null = null;
let storageInstance: FirebaseStorage | null = null;

export function initializeFirebase(): {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  storage: FirebaseStorage;
} {
  if (firebaseAppInstance && authInstance && firestoreInstance && storageInstance) {
    return { 
        firebaseApp: firebaseAppInstance, 
        auth: authInstance,
        firestore: firestoreInstance,
        storage: storageInstance,
    };
  }

  const config = getFirebaseConfigClient();
  const apps = getApps();
  const app = apps.length > 0 ? apps[0] : initializeApp(config);

  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const storage = getStorage(app);
  
  firebaseAppInstance = app;
  authInstance = auth;
  firestoreInstance = firestore;
  storageInstance = storage;

  return { firebaseApp: app, auth, firestore, storage };
}

export * from './provider';
export * from './auth/provider';
export * from './auth/use-user';

    