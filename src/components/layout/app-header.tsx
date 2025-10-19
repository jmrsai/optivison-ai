
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
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '../ui/sheet';
import { Menu, Home, UserPlus, Settings, LogIn, LogOut } from 'lucide-react';
import placeholderImages from '@/lib/placeholder-images.json';


export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm no-print">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">OptiVision AI</span>
        </Link>

        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Dashboard
            </Link>
             <Link href="/register" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Register Patient
            </Link>
             <Link href="/settings" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Settings
            </Link>
             <Link href="/login" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Login
            </Link>
          </nav>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={placeholderImages.userAvatar.src} alt={placeholderImages.userAvatar.alt} />
                  <AvatarFallback>DC</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Dr. JMR</p>
                  <p className="text-xs leading-none text-muted-foreground">drjmr@optivision.io</p>
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
              <DropdownMenuItem asChild>
                 <Link href="/login">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
                <SheetHeader className="border-b pb-4">
                   <Link href="/" className="flex items-center gap-2">
                    <Logo className="h-7 w-7 text-primary" />
                    <span className="text-lg font-bold text-foreground">OptiVision AI</span>
                  </Link>
                </SheetHeader>
               <nav className="grid gap-2 text-lg font-medium mt-6">
                <Link href="/" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                 <Link href="/register" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                  <UserPlus className="h-5 w-5" />
                  Register Patient
                </Link>
                <Link href="/settings" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                  <Settings className="h-5 w-5" />
                  Settings
                </Link>
                 <Link href="/login" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                  <LogIn className="h-5 w-5" />
                  Login
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
