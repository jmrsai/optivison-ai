
'use client';

import { AppHeader } from '@/components/layout/app-header';
import { PatientList } from '@/components/patient-list';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Users, ScanEye, AlertTriangle, LogIn, Loader2 } from 'lucide-react';
import type { Patient, UserProfile, Scan } from '@/lib/types';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { RegisterPatientForm } from '@/components/register-patient-form';
import { PatientPortal } from '@/components/patient-portal';
import { ClientLayout } from '@/components/layout/client-layout';
import { useFirebase } from '@/firebase/provider';
import { collection, query, where } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useAuth } from '@/firebase/auth/provider';

function StatCard({ title, value, icon: Icon, loading }: { title: string; value: string | number; icon: React.ElementType, loading?: boolean }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? <div className="text-2xl font-bold">...</div> : <div className="text-2xl font-bold">{value}</div>}
      </CardContent>
    </Card>
  );
}

function ClinicianDashboard() {
  const { user, profile } = useUser();
  const { firestore } = useFirebase();
  const [isSheetOpen, setSheetOpen] = useState(false);

  const patientsRef = firestore && user ? query(collection(firestore, 'patients'), where('clinicianId', '==', user.uid)) : null;
  const [patients, patientsLoading] = useCollectionData(patientsRef, { idField: 'id' });

  const scansRef = firestore && user ? query(collection(firestore, 'scans'), where('clinicianId', '==', user.uid)) : null;
  const [scans, scansLoading] = useCollectionData(scansRef);

  const highRiskPatients = patients?.filter(p => p.riskLevel === 'High').length || 0;

  const handlePatientRegistered = () => {
    setSheetOpen(false);
  };

  const loading = patientsLoading || scansLoading;

  return (
    <>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Clinician Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.displayName || 'Doctor'}. Here's an overview of your patients.</p>
        </div>
        <Button onClick={() => setSheetOpen(true)} className="w-full md:w-auto" size="lg">
          <PlusCircle className="mr-2 h-5 w-5" />
          Register New Patient
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3 mb-8">
          <StatCard title="Total Patients" value={patients?.length || 0} icon={Users} loading={loading} />
          <StatCard title="Total Scans" value={scans?.length || 0} icon={ScanEye} loading={loading} />
          <StatCard title="High-Risk Patients" value={highRiskPatients} icon={AlertTriangle} loading={loading} />
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Patient Roster</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <p>Loading patients...</p> : <PatientList patients={patients as Patient[] || []} />}
        </CardContent>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Register New Patient</SheetTitle>
            <SheetDescription>
              Fill out the form below to add a new patient to the system. Click register when you're done.
            </SheetDescription>
          </SheetHeader>
          <div className="py-8">
            <RegisterPatientForm onPatientRegistered={handlePatientRegistered} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}


function DashboardContent() {
  const { user, profile, loading: userLoading } = useUser();
  const router = useRouter();
  const auth = useAuth();
  
  if (userLoading) {
    return (
        <div className="flex-1 container mx-auto p-4 md:p-8 flex items-center justify-center">
            <div className="flex items-center gap-2">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                <p>Loading Your Portal...</p>
            </div>
        </div>
    )
  }

  if (!user) {
    return (
        <div className="flex-1 container mx-auto p-4 md:p-8 flex items-center justify-center">
            <Card className="max-w-md w-full text-center">
                <CardHeader>
                    <CardTitle>Welcome to OptiVision AI</CardTitle>
                    <CardDescription>Please log in to access your portal.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Button onClick={() => router.push('/auth/login')}>
                        <LogIn className="mr-2 h-4 w-4" />
                        Go to Login
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
  }
  
  if (!userLoading && !profile) {
    return (
      <div className="flex-1 container mx-auto p-4 md:p-8 flex items-center justify-center">
            <Card className="max-w-md w-full text-center">
                <CardHeader>
                    <CardTitle className="text-destructive">Error</CardTitle>
                    <CardDescription>Could not load user profile. Please contact support.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Button variant="outline" onClick={() => auth.signOut().then(() => router.push('/auth/login'))}>
                        <LogIn className="mr-2 h-4 w-4" />
                        Logout and Try Again
                    </Button>
                </CardContent>
            </Card>
      </div>
    );
  }

  return (
      <main className="flex-1 container mx-auto p-4 md:p-8">
        {profile?.role === 'clinician' ? <ClinicianDashboard /> : <PatientPortal patientUser={user} />}
      </main>
  );
}

export default function DashboardPage() {
    return (
        <ClientLayout>
            <DashboardContent />
        </ClientLayout>
    )
}

    