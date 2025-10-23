'use client';
import { useContext } from 'react';
import { AuthContext } from './provider';

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context.auth;
}

export function useFirebaseApp() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useFirebaseApp must be used within an AuthProvider');
  }

  return context.firebaseApp;
}
