
'use client';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useAuth } from './provider';
import { useFirebase } from '../provider';
import { doc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import type { UserProfile } from '@/lib/types';


export function useUser() {
  const auth = useAuth();
  const { firestore } = useFirebase();
  const [user, authLoading, authError] = useAuthState(auth);

  const userDocRef = firestore && user ? doc(firestore, 'users', user.uid) : null;
  const [profile, profileLoading, profileError] = useDocumentData(userDocRef);

  return { 
    user, 
    profile: profile as UserProfile | undefined,
    loading: authLoading || profileLoading, 
    error: authError || profileError 
  };
}

    