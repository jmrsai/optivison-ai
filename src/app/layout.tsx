import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
