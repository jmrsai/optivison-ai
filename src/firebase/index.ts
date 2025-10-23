// src/firebase/index.ts
import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getAnalytics, type Analytics } from "firebase/analytics";
import { getFirebaseConfigClient } from './config';

let authInstance: Auth | null = null;
let firebaseAppInstance: FirebaseApp | null = null;
let analyticsInstance: Analytics | null = null;

export function initializeAuth(): {
  firebaseApp: FirebaseApp;
  auth: Auth;
  analytics: Analytics | null;
} {
  if (firebaseAppInstance && authInstance) {
    return { firebaseApp: firebaseAppInstance, auth: authInstance, analytics: analyticsInstance };
  }

  const config = getFirebaseConfigClient();
  const apps = getApps();
  const app = apps.length > 0 ? apps[0] : initializeApp(config);

  const auth = getAuth(app);
  
  let analytics: Analytics | null = null;
  if (typeof window !== 'undefined') {
    try {
      analytics = getAnalytics(app);
    } catch (e) {
      console.error("Firebase Analytics is not available in this environment.");
    }
  }

  firebaseAppInstance = app;
  authInstance = auth;
  analyticsInstance = analytics;

  return { firebaseApp: app, auth, analytics };
}

export * from './auth/provider';
