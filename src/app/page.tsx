
'use client';

import { AppHeader } from '@/components/layout/app-header';
import { PatientList } from '@/components/patient-list';
import { getPatients } from '@/lib/patient-service';
import { getScans } from '@/lib/scan-service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Users, ScanEye, AlertTriangle, LogIn } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Patient, Scan } from '@/lib/types';
import { useUser } from '@/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';

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


export default function DashboardPage() {
  const { user, loading: userLoading, error: userError } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const [patients, patientsLoading] = useCollection(
    user ? query(collection(firestore, 'patients'), where('clinicianId', '==', user.uid)) : undefined
  );

  const [scans, scansLoading] = useCollection(
    user ? query(collection(firestore, 'scans'), where('clinicianId', '==', user.uid)) : undefined
  );

  const highRiskPatients = patients?.docs.filter(doc => (doc.data() as Patient).riskLevel === 'High').length || 0;
  
  if (userLoading) {
    return (
       <div className="flex flex-col min-h-screen bg-background">
        <AppHeader />
        <main className="flex-1 container mx-auto p-4 md:p-8 flex items-center justify-center">
          <p>Loading user...</p>
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
                    <CardDescription>Please log in to access your clinician dashboard.</CardDescription>
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
  
  const patientData = patients?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Patient)) || [];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Clinician Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.displayName || 'Doctor'}. Here's an overview of your patients.</p>
          </div>
           <Button asChild className="w-full md:w-auto" size="lg">
              <Link href="/register">
                <PlusCircle className="mr-2 h-5 w-5" />
                Register New Patient
              </Link>
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
      </main>
    </div>
  );
}
