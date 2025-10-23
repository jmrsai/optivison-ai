
'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Logo } from '@/components/icons';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '../ui/sheet';
import { Menu, Home, Settings, LogIn, LogOut, UserPlus, Search } from 'lucide-react';
import placeholderImages from '@/lib/placeholder-images.json';
import { useAuth } from '@/firebase/auth/use-auth';
import { useUser } from '@/firebase/auth/use-user';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export function AppHeader() {
  const { user, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push('/auth/login');
    } catch (error) {
       toast({
        variant: 'destructive',
        title: "Logout Failed",
        description: "An error occurred while logging out.",
      });
    }
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm no-print">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">OptiVision AI</span>
        </Link>

        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
             {user && !loading && (
              <>
                 <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">
                  Dashboard
                </Link>
                <Link href="/strabismus" className="transition-colors hover:text-foreground/80 text-foreground/60">
                  Strabismus Analysis
                </Link>
                 <Link href="/settings" className="transition-colors hover:text-foreground/80 text-foreground/60">
                  Settings
                </Link>
              </>
            )}
          </nav>
          
          {loading ? (
             <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.photoURL || placeholderImages.userAvatar.src} alt={user.displayName || 'User'} />
                    <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName || 'Clinician'}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <div className="flex items-center gap-2">
                <Button asChild variant="outline">
                    <Link href="/auth/login">
                    <LogIn className="mr-2 h-4 w-4"/>
                    Login
                    </Link>
                </Button>
                <Button asChild>
                    <Link href="/auth/register">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Register
                    </Link>
                </Button>
            </div>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
                <SheetHeader>
                   <SheetTitle>OptiVision AI</SheetTitle>
                   <SheetDescription className="sr-only">
                        Main navigation menu for OptiVision AI, providing links to the dashboard, patient registration, and settings.
                   </SheetDescription>
                   <Link href="/" className="flex items-center gap-2">
                    <Logo className="h-7 w-7 text-primary" />
                    <span className="text-lg font-bold text-foreground sr-only">OptiVision AI</span>
                  </Link>
                </SheetHeader>
              <nav className="grid gap-2 text-lg font-medium mt-6">
                 {user ? (
                   <>
                    <Link href="/" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                      <Home className="h-5 w-5" />
                      Dashboard
                    </Link>
                     <Link href="/strabismus" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                      <Search className="h-5 w-5" />
                      Strabismus
                    </Link>
                    <Link href="/settings" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                      <Settings className="h-5 w-5" />
                      Settings
                    </Link>
                     <button onClick={handleLogout} className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground text-lg font-medium">
                        <LogOut className="h-5 w-5" />
                        Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                      <LogIn className="h-5 w-5" />
                      Login
                    </Link>
                    <Link href="/auth/register" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                        <UserPlus className="h-5 w-5" />
                        Register
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
