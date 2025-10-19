
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
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

const phoneFormSchema = z.object({
    phoneNumber: z.string().refine(
        (value) => /^\+[1-9]\d{1,14}$/.test(value),
        { message: 'Please enter a valid phone number in E.164 format (e.g., +11234567890).' }
    ),
    verificationCode: z.string().optional(),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isSubmittingPhone, setIsSubmittingPhone] = useState(false);


  const emailForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const phoneForm = useForm<z.infer<typeof phoneFormSchema>>({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: {
        phoneNumber: '',
        verificationCode: ''
    }
  });

  useEffect(() => {
    if (!auth) return;
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
    });
    return () => {
        window.recaptchaVerifier?.clear();
    }
  }, [auth]);

  const isSubmittingEmail = emailForm.formState.isSubmitting;
  const isCodeSent = !!confirmationResult;

  async function onEmailSubmit(values: z.infer<typeof formSchema>) {
    if (!auth) return;
    try {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        toast({
            title: "Login Successful",
            description: "Welcome back!",
        });
        router.push('/');
    } catch (error: any) {
        console.error("Login failed:", error);
        toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Invalid email or password. Please try again.",
        });
    }
  }

  const handleSendVerificationCode = async (data: z.infer<typeof phoneFormSchema>) => {
    if (!auth) return;
    setIsSubmittingPhone(true);
    try {
        const verifier = window.recaptchaVerifier;
        const result = await signInWithPhoneNumber(auth, data.phoneNumber, verifier);
        setConfirmationResult(result);
        toast({
            title: "Verification Code Sent",
            description: "Please check your phone for the code.",
        });
    } catch (error) {
        console.error("SMS sending failed:", error);
        toast({
            variant: "destructive",
            title: "Failed to Send Code",
            description: "Could not send verification SMS. Please check the number and try again.",
        });
        setConfirmationResult(null);
    } finally {
        setIsSubmittingPhone(false);
    }
  }

  const handleVerifyCode = async (data: z.infer<typeof phoneFormSchema>) => {
    if (!confirmationResult || !data.verificationCode || !auth) return;
    setIsSubmittingPhone(true);
    try {
        await confirmationResult.confirm(data.verificationCode);
        toast({
            title: "Login Successful",
            description: "You have been successfully logged in.",
        });
        router.push('/');
    } catch (error) {
        console.error("Code verification failed:", error);
        toast({
            variant: "destructive",
            title: "Verification Failed",
            description: "The code you entered is invalid. Please try again.",
        });
    } finally {
        setIsSubmittingPhone(false);
    }
  }

  const handleSocialLogin = async (provider: 'google') => {
    if (!auth) return;
    const authProvider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, authProvider);
      toast({
        title: 'Login Successful',
        description: `Welcome! You've successfully signed in with Google.`,
      });
      router.push('/');
    } catch (error: any) {
      console.error(`${provider} login failed:`, error);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: `Could not sign in with Google. Please try again.`,
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div id="recaptcha-container"></div>
      <AppHeader />
      <main className="flex-1 container mx-auto p-4 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Clinician Login</CardTitle>
              <CardDescription>Choose a method to access your dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="email">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="email">Email</TabsTrigger>
                        <TabsTrigger value="phone">Phone</TabsTrigger>
                    </TabsList>
                    <TabsContent value="email">
                        <Form {...emailForm}>
                            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6 pt-6">
                            <fieldset disabled={isSubmittingEmail}>
                                <FormField
                                control={emailForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="drjmr@optivision.io" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={emailForm.control}
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
                                <Button type="submit" className="w-full" disabled={isSubmittingEmail}>
                                {isSubmittingEmail ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Login with Email
                                </Button>
                            </fieldset>
                            </form>
                        </Form>
                    </TabsContent>
                    <TabsContent value="phone">
                       <Form {...phoneForm}>
                            <form onSubmit={phoneForm.handleSubmit(isCodeSent ? handleVerifyCode : handleSendVerificationCode)} className="space-y-6 pt-6">
                                <fieldset disabled={isSubmittingPhone}>
                                    <FormField
                                    control={phoneForm.control}
                                    name="phoneNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input type="tel" placeholder="+11234567890" {...field} disabled={isCodeSent} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                   {isCodeSent && (
                                     <FormField
                                        control={phoneForm.control}
                                        name="verificationCode"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Verification Code</FormLabel>
                                            <FormControl>
                                                <Input placeholder="123456" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                   )}
                                    <Button type="submit" className="w-full" disabled={isSubmittingPhone}>
                                        {isSubmittingPhone ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        {isCodeSent ? 'Verify Code and Sign In' : 'Send Verification Code'}
                                    </Button>
                                </fieldset>
                            </form>
                       </Form>
                    </TabsContent>
                </Tabs>


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

              <div className="grid grid-cols-1 gap-4">
                 <Button className="w-full" variant="outline" onClick={() => handleSocialLogin('google')} disabled={isSubmittingEmail || isSubmittingPhone}>
                  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 173.4 56.4l-64 64C318.6 98.2 284.7 84 248 84c-9.2 0-17.6.3-26.1.9-106.3 7.6-189.5 97.4-189.5 205.2s83.2 197.6 189.5 205.2c9.2.6 17.6.9 26.1.9 44.9 0 84.1-15.1 113.3-40.2l61.6 61.6c-47.5 42.1-109.8 66.8-177.3 66.8C104.9 512 0 407.1 0 256S104.9 0 248 0c82.4 0 154.9 33.2 206.1 86.8l-37.1 37.1C421.1 114.1 376.4 84 324.9 84c-33.7 0-64.8 10.3-90.1 27.6l64.3 64.3H248v88.9h239.8c.4-9.9.6-19.8.6-29.8z"></path></svg>
                  Continue with Google
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Don't have an account?{' '}
                <Button variant="link" asChild className="p-0">
                    <Link href="/auth/register">
                    Register here
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

    