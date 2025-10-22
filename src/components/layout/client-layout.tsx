'use client';

import { FirebaseProvider } from '@/firebase';
import { AppHeader } from './app-header';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <AppHeader />
        {children}
      </div>
    </FirebaseProvider>
  );
}
