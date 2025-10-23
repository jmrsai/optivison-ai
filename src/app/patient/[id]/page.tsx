
'use client';

import { AppHeader } from '@/components/layout/app-header';
import { PatientAnalysis } from '@/components/patient-analysis';
import { PatientHeader } from '@/components/patient-header';
import { notFound, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Loader, VenetianMask } from 'lucide-react';
import type { Patient, Scan, UserProfile } from '@/lib/types';
import { useUser } from '@/firebase/auth/use-user';
import { updatePatient } from '@/lib/patient-service';
import { Card, CardContent } from '@/components/ui/card';
import { MedicalChartBot } from '@/components/medical-chart-bot';
import { ClientLayout } from '@/components/layout/client-layout';
import { useEffect, useState } from 'react';

function getPatientData(patientId: string): { patient: Patient | null, scans: Scan[] } {
  if (typeof window === 'undefined') return { patient: null, scans: [] };

  const allPatients = JSON.parse(localStorage.getItem('patients') || '{}');
  const allScans = JSON.parse(localStorage.getItem('scans') || '{}');
  
  const patient = allPatients[patientId] ? { id: patientId, ...allPatients[patientId] } : null;
  const scans = Object.values(allScans).filter((s: any) => s.patientId === patientId) as Scan[];
  
  scans.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return { patient, scans };
}

function getUserProfile(uid: string): UserProfile | null {
    if (typeof window === 'undefined') return null;
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    return users[uid] || null;
}


function PatientPageContent() {
  const params = useParams();
  const id = params.id as string;
  const { user, loading: userLoading } = useUser();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const [patient, setPatient] = useState<Patient | null>(null);
  const [scans, setScans] = useState<Scan[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (id) {
        const { patient: p, scans: s } = getPatientData(id);
        setPatient(p);
        setScans(s);
    }
    setDataLoading(false);
  }, [id]);

  useEffect(() => {
    if (user) {
        const profile = getUserProfile(user.uid);
        setUserProfile(profile);
    }
  }, [user]);

  const completedScans = scans.filter(s => s.status === 'completed' && s.analysis);

  const handlePatientUpdate = async (updatedPatientData: Partial<Patient>) => {
    if (!id) return;
    await updatePatient(id, updatedPatientData);
    // Re-fetch data to reflect update
    const { patient: p } = getPatientData(id);
    setPatient(p);
  };
  
  if (dataLoading || userLoading) {
    return (
        <main className="flex-1 container mx-auto p-4 md:p-8 flex items-center justify-center">
            <div className="flex items-center gap-2">
                <Loader className="h-6 w-6 animate-spin" />
                <p className="text-muted-foreground">Loading Patient Data...</p>
            </div>
        </main>
    );
  }

  // Security check
  if (user && patient && userProfile) {
    if (userProfile.role === 'clinician' && patient.clinicianId !== user.uid) {
       return (
          <main className="flex-1 container mx-auto p-4 md:p-8 text-center">
            <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
            <p className="text-muted-foreground">You do not have permission to view this patient's records.</p>
            <Button asChild variant="link" className="mt-4">
                <Link href="/">Back to Dashboard</Link>
            </Button>
          </main>
      )
    }
    if (userProfile.role === 'patient' && patient.userId !== user.uid) {
        return (
          <main className="flex-1 container mx-auto p-4 md:p-8 text-center">
            <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
            <p className="text-muted-foreground">You can only view your own patient record.</p>
            <Button asChild variant="link" className="mt-4">
                <Link href="/">Back to Portal</Link>
            </Button>
          </main>
      )
    }
  }

  if (!patient) {
    notFound();
  }

  return (
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="mb-6">
          <Button asChild variant="ghost">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        <div className="space-y-8">
          <PatientHeader patient={patient} />
           {completedScans.length > 0 && userProfile?.role === 'clinician' && (
             <MedicalChartBot patient={patient} scans={completedScans} />
           )}
          <Card className="shadow-sm" id={`scan-${scans[0]?.id}`}>
            <CardContent className="p-6">
              <PatientAnalysis patient={patient} initialScans={scans} onPatientUpdate={handlePatientUpdate} />
            </CardContent>
          </Card>
        </div>
      </main>
  );
}


export default function PatientPage() {
    return (
        <ClientLayout>
            <PatientPageContent />
        </ClientLayout>
    )
}
