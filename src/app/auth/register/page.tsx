
'use client';

import { AppHeader } from '@/components/layout/app-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';


const formSchema = z.object({
  name: z.string().min(2, { message: 'Please enter your full name.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      
      await updateProfile(userCredential.user, {
        displayName: values.name,
      });

      toast({
        title: "Registration Successful",
        description: "Your account has been created. Welcome!",
      });

      router.push('/');
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.code === 'auth/email-already-in-use' 
          ? 'This email is already registered.' 
          : 'An error occurred during registration.',
      });
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    const authProvider = provider === 'google' ? new GoogleAuthProvider() : new GithubAuthProvider();
    try {
      await signInWithPopup(auth, authProvider);
      toast({
        title: 'Registration Successful',
        description: `Welcome! You've successfully signed up with ${provider === 'google' ? 'Google' : 'GitHub'}.`,
      });
      router.push('/');
    } catch (error: any) {
      console.error(`${provider} login failed:`, error);
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: `Could not sign up with ${provider === 'google' ? 'Google' : 'GitHub'}. Please try again.`,
      });
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto p-4 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Create Clinician Account</CardTitle>
              <CardDescription>Register to start using OptiVision AI.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                   <fieldset disabled={isSubmitting}>
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Dr. Jane Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="jane.doe@clinic.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                         {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Create Account with Email
                      </Button>
                   </fieldset>
                </form>
              </Form>
              
               <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <Button variant="outline" onClick={() => handleSocialLogin('google')} disabled={isSubmitting}>
                  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 173.4 56.4l-64 64C318.6 98.2 284.7 84 248 84c-9.2 0-17.6.3-26.1.9-106.3 7.6-189.5 97.4-189.5 205.2s83.2 197.6 189.5 205.2c9.2.6 17.6.9 26.1.9 44.9 0 84.1-15.1 113.3-40.2l61.6 61.6c-47.5 42.1-109.8 66.8-177.3 66.8C104.9 512 0 407.1 0 256S104.9 0 248 0c82.4 0 154.9 33.2 206.1 86.8l-37.1 37.1C421.1 114.1 376.4 84 324.9 84c-33.7 0-64.8 10.3-90.1 27.6l64.3 64.3H248v88.9h239.8c.4-9.9.6-19.8.6-29.8z"></path></svg>
                  Google
                </Button>
                <Button variant="outline" onClick={() => handleSocialLogin('github')} disabled={isSubmitting}>
                   <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="github" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path fill="currentColor" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 23.3 0 161.5c0 52.4 21.2 99 57.5 134.1 4.2 7.7 4.2 16.1 0 23.8l-57.5 134.1c-4.2 7.7-1.1 16.9 6.2 21.2 7.3 4.2 16.9 1.1 21.2-6.2l57.5-134.1c7.7-18.2 23.8-34.3 44.2-44.2l134.1-57.5c7.3-3 11.4-11.1 11.4-19.1s-4.2-16.1-11.4-19.1l-134.1-57.5c-7.7-3.3-15.1-7.3-21.2-12.2C99 64.5 52.4 43.3 0 43.3 0 23.3 106.1 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.2 1.3 1.3-1.3 1-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.2-1.3z"></path></svg>
                  GitHub
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Already have an account?{' '}
                <Button variant="link" asChild className="p-0">
                    <Link href="/auth/login">
                    Log in here
                    </Link>
                </Button>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

    