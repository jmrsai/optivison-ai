
'use client';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useAuth } from './provider';

export function useUser() {
  const auth = useAuth();
  const [user, loading, error] = useAuthState(auth);

  return { user, loading, error };
}
