'use client';

import { AppHeader } from '@/components/layout/app-header';
import { PatientAnalysis } from '@/components/patient-analysis';
import { PatientHeader } from '@/components/patient-header';
import { getPatient, getScansByPatient, savePatient } from '@/lib/storage';
import { Card, CardContent } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import type { Patient, Scan } from '@/lib/types';

function PatientDetailView({ id }: { id: string }) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundPatient = getPatient(id);
    if (foundPatient) {
      setPatient(foundPatient);
      setScans(getScansByPatient(id));
    }
    setLoading(false);
  }, [id]);

  const handlePatientUpdate = useCallback((updatedPatient: Patient) => {
    setPatient(updatedPatient);
    savePatient(updatedPatient);
  }, []);

  if (loading) {
    return (
       <div className="flex flex-col min-h-screen bg-background">
        <AppHeader />
        <main className="flex-1 container mx-auto p-4 md:p-8">
          <p>Loading...</p>
        </main>
      </div>
    );
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
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <PatientAnalysis patient={patient} initialScans={scans} onPatientUpdate={handlePatientUpdate} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function PatientPage({ params }: { params: { id: string } }) {
  const { id } = params;
  return <PatientDetailView id={id} />;
}
