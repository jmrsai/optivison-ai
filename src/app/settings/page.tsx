
'use client';

import { AppHeader } from '@/components/layout/app-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, HardDrive, HardDriveUpload, Loader2, LogIn, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { useAuth } from '@/firebase';
import { useUser } from '@/firebase/auth/use-user';
import { GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo, type User, signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { exportDataToDrive } from '@/ai/flows/google-drive-export';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  
  const [googleDriveUser, setGoogleDriveUser] = useState<User | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);


  useEffect(() => {
    setIsDarkMode(theme === 'dark');
  }, [theme]);
  
  useEffect(() => {
    if (user) {
        setGoogleDriveUser(user);
    }
  }, [user]);

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
    setIsDarkMode(checked);
  };
  
  const handleGoogleDriveConnect = async () => {
    if (!auth) return;
    setIsConnecting(true);

    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/drive.file');
    provider.setCustomParameters({
      prompt: 'consent', // Force account selection and consent screen
    });

    try {
      const result = await signInWithPopup(auth, provider);
      setGoogleDriveUser(result.user);
      
      const additionalUserInfo = getAdditionalUserInfo(result);
      if (additionalUserInfo?.isNewUser) {
        toast({
          title: "Account Linked",
          description: "Your Google account is now ready for backups."
        });
      } else {
        toast({
          title: "Google Drive Connected",
          description: "You can now back up your data to Google Drive.",
        });
      }
    } catch (error: any) {
      console.error("Google Drive connection failed:", error);
      toast({
        variant: 'destructive',
        title: "Connection Failed",
        description: "Could not connect to Google Drive. Please try again."
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleExport = async () => {
    if (!user || !googleDriveUser) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in and connected to Google Drive.' });
        return;
    }

    setIsExporting(true);
    toast({ title: 'Starting Backup...', description: 'Preparing your data for export. This may take a moment.' });

    try {
        const idToken = await googleDriveUser.getIdToken(true); // Force refresh the token
        const result = await exportDataToDrive({ idToken, clinicianId: user.uid });
        toast({
            title: 'Backup Successful',
            description: `Your data has been saved to a new folder in your Google Drive named '${result.folderName}'.`,
        });
    } catch (error) {
        console.error("Export to Drive failed:", error);
        toast({
            variant: 'destructive',
            title: 'Backup Failed',
            description: 'There was an error while exporting your data. Please try again.',
        });
    } finally {
        setIsExporting(false);
    }
};

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

  if (userLoading) {
    return (
       <div className="flex flex-col min-h-screen bg-background">
        <AppHeader />
        <main className="flex-1 container mx-auto p-4 md:p-8 flex items-center justify-center">
            <div className="flex items-center gap-2">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                <p>Loading Settings...</p>
            </div>
        </main>
      </div>
    )
  }

  if (!user) {
     return (
       <div className="flex flex-col min-h-screen bg-background">
        <AppHeader />
        <main className="flex-1 container mx-auto p-4 md:p-8 flex items-center justify-center">
            <Card className="max-w-md w-full text-center">
                <CardHeader>
                    <CardTitle>Access Denied</CardTitle>
                    <CardDescription>Please log in to manage your settings.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Button onClick={() => router.push('/auth/login')}>
                        <LogIn className="mr-2 h-4 w-4" />
                        Go to Login
                    </Button>
                </CardContent>
            </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="mb-6">
          <Button asChild variant="ghost">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        <div className="space-y-8 max-w-3xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your account and application preferences.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Update your personal information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue={user?.displayName || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email || ''} readOnly />
              </div>
              <div className="flex justify-end">
                <Button disabled>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>
                    Export a backup of your patient data to your personal Google Drive.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-md bg-muted/20">
                    <div className="flex items-center gap-4">
                        <HardDrive className="h-8 w-8 text-primary"/>
                        <div>
                            <h4 className="font-semibold">Google Drive Backup</h4>
                             <p className="text-sm text-muted-foreground">
                                {googleDriveUser ? `Connected as ${googleDriveUser.email}` : 'Not connected'}
                            </p>
                        </div>
                    </div>
                     <Button variant="outline" onClick={handleGoogleDriveConnect} disabled={isConnecting}>
                        {isConnecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                        {googleDriveUser ? 'Reconnect' : 'Connect'}
                    </Button>
                </div>
                 <Button onClick={handleExport} disabled={!googleDriveUser || isExporting || userLoading} className="w-full">
                    {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <HardDriveUpload className="mr-2 h-4 w-4" />}
                    {isExporting ? 'Exporting...' : 'Export & Backup to Drive'}
                </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Customize the application appearance and behavior.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable a darker color scheme for the UI.
                  </p>
                </div>
                <Switch 
                  id="dark-mode" 
                  checked={isDarkMode}
                  onCheckedChange={handleThemeChange}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates for critical analysis results.
                  </p>
                </div>
                <Switch 
                  id="notifications" 
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle>Account Actions</CardTitle>
                <CardDescription>
                    Manage your session.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </Button>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}
