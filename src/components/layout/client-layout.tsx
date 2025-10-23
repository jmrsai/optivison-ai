'use client';

import { AuthProvider } from '@/firebase/auth/provider';
import { AppHeader } from './app-header';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <AppHeader />
        {children}
      </div>
    </AuthProvider>
  );
}
