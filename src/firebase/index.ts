
// src/firebase/index.ts
import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirebaseConfigClient } from './config';

let authInstance: Auth | null = null;
let firebaseAppInstance: FirebaseApp | null = null;

export function initializeAuth(): {
  firebaseApp: FirebaseApp;
  auth: Auth;
} {
  if (firebaseAppInstance && authInstance) {
    return { firebaseApp: firebaseAppInstance, auth: authInstance };
  }

  const config = getFirebaseConfigClient();
  const apps = getApps();
  const app = apps.length > 0 ? apps[0] : initializeApp(config);

  const auth = getAuth(app);
  
  firebaseAppInstance = app;
  authInstance = auth;

  return { firebaseApp: app, auth };
}

export * from './auth/provider';
export * from './auth/use-user';
