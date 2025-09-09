import { AppHeader } from '@/components/layout/app-header';
import { PatientAnalysis } from '@/components/patient-analysis';
import { PatientHeader } from '@/components/patient-header';
import { MOCK_PATIENTS, MOCK_SCANS } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PatientPage({ params }: { params: { id: string } }) {
  const patient = MOCK_PATIENTS.find((p) => p.id === params.id);
  const scans = MOCK_SCANS.filter((s) => s.patientId === params.id);

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
              <PatientAnalysis patient={patient} initialScans={scans} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
