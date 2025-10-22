'use client';

import { AppHeader } from '@/components/layout/app-header';
import { PatientAnalysis } from '@/components/patient-analysis';
import { PatientHeader } from '@/components/patient-header';
import { notFound, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Loader } from 'lucide-react';
import type { Patient, Scan, UserProfile } from '@/lib/types';
import { useFirestore } from '@/firebase';
import { useUser } from '@/firebase/auth/use-user';
import { useDocument, useCollection, useDocumentData } from 'react-firebase-hooks/firestore';
import { doc, collection, query, where, orderBy } from 'firebase/firestore';
import { updatePatient } from '@/lib/patient-service';
import { Card, CardContent } from '@/components/ui/card';
import { useMemoFirebase } from '@/hooks/use-memo-firebase';
import { MedicalChartBot } from '@/components/medical-chart-bot';

export default function PatientPage() {
  const params = useParams();
  const id = params.id as string;
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();

  const [profile] = useDocumentData(
    user ? doc(firestore, 'users', user.uid) : undefined
  );
  const userProfile = profile as UserProfile | undefined;


  const patientRef = useMemoFirebase(
    () => (id ? doc(firestore, 'patients', id) : undefined),
    [firestore, id]
  );
  const scansQuery = useMemoFirebase(
    () => (id ? query(collection(firestore, 'scans'), where('patientId', '==', id), orderBy('date', 'desc')) : undefined),
    [firestore, id]
  );

  const [patientDoc, patientLoading, patientError] = useDocument(patientRef);
  const [scansCollection, scansLoading, scansError] = useCollection(scansQuery);
  
  const patient = patientDoc?.data() ? { id: patientDoc.id, ...patientDoc.data() } as Patient : null;
  const scans = scansCollection?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Scan)) || [];
  const completedScans = scans.filter(s => s.status === 'completed' && s.analysis);


  const handlePatientUpdate = async (updatedPatient: Partial<Patient>) => {
    if (!id) return;
    await updatePatient(firestore, id, updatedPatient);
  };
  
  if (patientLoading || userLoading || scansLoading) {
    return (
       <div className="flex flex-col min-h-screen bg-background">
        <AppHeader />
        <main className="flex-1 container mx-auto p-4 md:p-8 flex items-center justify-center">
            <div className="flex items-center gap-2">
                <Loader className="h-6 w-6 animate-spin" />
                <p className="text-muted-foreground">Loading Patient Data...</p>
            </div>
        </main>
      </div>
    );
  }

  // Security check: If the user is a clinician, ensure they are the assigned one.
  // If the user is a patient, ensure they are viewing their own record.
  if (user && patient) {
    if (userProfile?.role === 'clinician' && patient.clinicianId !== user.uid) {
       return (
        <div className="flex flex-col min-h-screen bg-background">
          <AppHeader />
          <main className="flex-1 container mx-auto p-4 md:p-8 text-center">
            <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
            <p className="text-muted-foreground">You do not have permission to view this patient's records.</p>
            <Button asChild variant="link" className="mt-4">
                <Link href="/">Back to Dashboard</Link>
            </Button>
          </main>
        </div>
      )
    }
    if (userProfile?.role === 'patient' && patient.userId !== user.uid) {
        return (
        <div className="flex flex-col min-h-screen bg-background">
          <AppHeader />
          <main className="flex-1 container mx-auto p-4 md:p-8 text-center">
            <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
            <p className="text-muted-foreground">You can only view your own patient record.</p>
            <Button asChild variant="link" className="mt-4">
                <Link href="/">Back to Portal</Link>
            </Button>
          </main>
        </div>
      )
    }
  }


  if (!patient) {
    notFound();
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
    </div>
  );
}
