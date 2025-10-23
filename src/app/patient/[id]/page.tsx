
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
import { useFirebase } from '@/firebase/provider';
import { collection, doc, query, orderBy } from 'firebase/firestore';
import { useDocumentData, useCollectionData } from 'react-firebase-hooks/firestore';

function PatientPageContent() {
  const params = useParams();
  const id = params.id as string;
  const { user, profile: userProfile, loading: userLoading } = useUser();
  const { firestore } = useFirebase();

  const patientRef = firestore && id ? doc(firestore, 'patients', id) : null;
  const [patient, patientLoading] = useDocumentData(patientRef, { idField: 'id' });

  const scansRef = firestore && id ? query(collection(firestore, 'scans'), orderBy('date', 'desc')) : null;
  const [scans, scansLoading] = useCollectionData(scansRef, { idField: 'id' });

  const dataLoading = patientLoading || scansLoading;

  const completedScans = (scans?.filter(s => s.status === 'completed' && s.analysis) || []) as Scan[];

  const handlePatientUpdate = async (updatedPatientData: Partial<Patient>) => {
    if (!id) return;
    await updatePatient(id, updatedPatientData);
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

  if (!patient && !patientLoading) {
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
        {patient && (
            <div className="space-y-8">
            <PatientHeader patient={patient as Patient} />
            {completedScans.length > 0 && userProfile?.role === 'clinician' && (
                <MedicalChartBot patient={patient as Patient} scans={completedScans} />
            )}
            <Card className="shadow-sm" id={`scan-${scans?.[0]?.id}`}>
                <CardContent className="p-6">
                <PatientAnalysis patient={patient as Patient} initialScans={(scans || []) as Scan[]} onPatientUpdate={handlePatientUpdate} />
                </CardContent>
            </Card>
            </div>
        )}
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

    