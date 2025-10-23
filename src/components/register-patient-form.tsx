
'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Patient } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from "@/hooks/use-toast";
import placeholderImages from '@/lib/placeholder-images.json';
import { useUser } from '@/firebase/auth/use-user';
import { addPatient } from '@/lib/patient-service';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  age: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0 && Number.isInteger(Number(val)), {
    message: 'Age must be a positive integer.',
  }).transform(Number),
  gender: z.enum(['Male', 'Female', 'Other']),
  history: z.string().min(10, { message: 'History must be at least 10 characters.' }),
});

type RegisterPatientFormProps = {
    onPatientRegistered: (patientId: string) => void;
}

export function RegisterPatientForm({ onPatientRegistered }: RegisterPatientFormProps) {
  const { toast } = useToast();
  const { user } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      age: '' as any,
      gender: undefined,
      history: '',
    },
  });
  
  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Not Authenticated",
            description: "You must be logged in to register a patient.",
        });
        return;
    }
    
    try {
      const patientData: Omit<Patient, 'id'> = {
        ...values,
        clinicianId: user.uid,
        lastVisit: new Date().toISOString().split('T')[0],
        avatarUrl: placeholderImages[`patient${(Math.floor(Math.random() * 4) + 1)}` as keyof typeof placeholderImages].src,
        riskLevel: 'N/A',
      };
      
      const patientId = await addPatient(patientData);

      toast({
          title: "Patient Registered",
          description: `${values.name} has been successfully registered.`,
      });
      form.reset();
      onPatientRegistered(patientId);

    } catch (error) {
       toast({
          variant: "destructive",
          title: "Registration Failed",
          description: "Could not save patient data locally.",
      });
      console.error("Failed to register patient:", error);
    }
  }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <fieldset disabled={isSubmitting} className="space-y-6">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                    <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <div className="grid grid-cols-2 gap-6">
                <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="68" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
                control={form.control}
                name="history"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Patient History</FormLabel>
                    <FormControl>
                    <Textarea
                        placeholder="Patient has a family history of glaucoma..."
                        className="resize-none"
                        rows={5}
                        {...field}
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                    </>
                ) : (
                    'Register Patient'
                )}
                </Button>
            </div>
            </fieldset>
        </form>
    </Form>
  );
}
