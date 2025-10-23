
'use client';

import { AuthProvider } from '@/firebase/auth/provider';
import { AppHeader } from './app-header';
import { FirebaseProvider } from '@/firebase/provider';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseProvider>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-background">
          <AppHeader />
          {children}
        </div>
      </AuthProvider>
    </FirebaseProvider>
  );
}

    