import { AppHeader } from '@/components/layout/app-header';
import { PatientList } from '@/components/patient-list';
import { MOCK_PATIENTS } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome to OptiVision AI</h1>
          <p className="text-muted-foreground">Your intelligent ophthalmology diagnostic assistant.</p>
        </div>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Patient Dashboard</CardTitle>
            <Button asChild>
              <Link href="/register">
                <PlusCircle className="mr-2 h-4 w-4" />
                Register New Patient
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <PatientList patients={MOCK_PATIENTS} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
