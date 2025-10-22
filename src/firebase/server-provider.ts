
// src/firebase/server-provider.ts
import { getApps, initializeApp, getApp, type FirebaseApp } from 'firebase-admin/app';
import { credential } from 'firebase-admin';

export function initializeServerApp(): FirebaseApp {
  const apps = getApps();
  if (apps.length > 0) {
    return getApp();
  }

  const cert = getFirebaseAdminCredential();

  return initializeApp({
    credential: cert,
  });
}

function getFirebaseAdminCredential() {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  
  if (!serviceAccount) {
    throw new Error('The FIREBASE_SERVICE_ACCOUNT environment variable is not set. This is required for server-side authentication.');
  }

  try {
    // Handle both raw JSON and Base64-encoded JSON
    const decodedServiceAccount = Buffer.from(serviceAccount, 'base64').toString('utf8');
    const serviceAccountJson = JSON.parse(decodedServiceAccount);
    return credential.cert(serviceAccountJson);
  } catch (e) {
     try {
       // If Base64 decoding fails, try to parse as raw JSON
       const serviceAccountJson = JSON.parse(serviceAccount);
       return credential.cert(serviceAccountJson);
     } catch (e2) {
        throw new Error('Failed to parse FIREBASE_SERVICE_ACCOUNT. Make sure it is a valid JSON string or a Base64-encoded JSON string.');
     }
  }
}
