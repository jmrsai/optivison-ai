
'use client';

import { AppHeader } from '@/components/layout/app-header';
import { PatientList } from '@/components/patient-list';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Users, ScanEye, AlertTriangle, LogIn, Loader2 } from 'lucide-react';
import type { Patient, UserProfile } from '@/lib/types';
import { useUser, useFirestore } from '@/firebase';
import { useCollection, useDocumentData } from 'react-firebase-hooks/firestore';
import { collection, query, where, doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { RegisterPatientForm } from '@/components/register-patient-form';
import { PatientPortal } from '@/components/patient-portal';


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
  const { user } = useUser();
  const firestore = useFirestore();
  const [isSheetOpen, setSheetOpen] = useState(false);

  const [patientsSnapshot, patientsLoading] = useCollection(
    user ? query(collection(firestore, 'patients'), where('clinicianId', '==', user.uid)) : undefined
  );

  const [scans, scansLoading] = useCollection(
    user ? query(collection(firestore, 'scans'), where('clinicianId', '==', user.uid)) : undefined
  );

  const patientData = patientsSnapshot?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Patient)) || [];
  const highRiskPatients = patientData.filter(p => p.riskLevel === 'High').length;

  const handlePatientRegistered = () => {
    setSheetOpen(false);
    // Data will be re-fetched automatically by useCollection hook
  };

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
          <StatCard title="Total Patients" value={patientData.length} icon={Users} loading={patientsLoading} />
          <StatCard title="Total Scans" value={scans?.docs.length || 0} icon={ScanEye} loading={scansLoading} />
          <StatCard title="High-Risk Patients" value={highRiskPatients} icon={AlertTriangle} loading={patientsLoading} />
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Patient Roster</CardTitle>
        </CardHeader>
        <CardContent>
          {patientsLoading ? <p>Loading patients...</p> : <PatientList patients={patientData} />}
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


export default function DashboardPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const [profile, profileLoading] = useDocumentData(
    user ? doc(firestore, 'users', user.uid) : undefined
  );

  const userProfile = profile as UserProfile | undefined;
  
  if (userLoading || (user && profileLoading)) {
    return (
       <div className="flex flex-col min-h-screen bg-background">
        <AppHeader />
        <main className="flex-1 container mx-auto p-4 md:p-8 flex items-center justify-center">
            <div className="flex items-center gap-2">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                <p>Loading Your Portal...</p>
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
                    <CardTitle>Welcome to OptiVision AI</CardTitle>
                    <CardDescription>Please log in to access your portal.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Button onClick={() => router.push('/login')}>
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
        {userProfile?.role === 'clinician' && <ClinicianDashboard />}
        {userProfile?.role === 'patient' && <PatientPortal patientUser={user} />}
        {!userProfile && !profileLoading && <p>Could not determine user role. Please contact support.</p>}
      </main>
    </div>
  );
}

    