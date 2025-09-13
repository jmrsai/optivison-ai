'use client';

import { AppHeader } from '@/components/layout/app-header';
import { PatientList } from '@/components/patient-list';
import { getPatients, getScans } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Users, ScanEye, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Patient, Scan } from '@/lib/types';

function StatCard({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}


export default function DashboardPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [scans, setScans] = useState<Scan[]>([]);

  useEffect(() => {
    setPatients(getPatients());
    setScans(getScans());
  }, []);

  const highRiskPatients = patients.filter(p => p.riskLevel === 'High').length;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Clinician Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Dr. Carter. Here's an overview of your patients.</p>
          </div>
           <Button asChild size="lg">
              <Link href="/register">
                <PlusCircle className="mr-2 h-5 w-5" />
                Register New Patient
              </Link>
            </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3 mb-8">
            <StatCard title="Total Patients" value={patients.length} icon={Users} />
            <StatCard title="Total Scans" value={scans.length} icon={ScanEye} />
            <StatCard title="High-Risk Patients" value={highRiskPatients} icon={AlertTriangle} />
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Patient Roster</CardTitle>
          </CardHeader>
          <CardContent>
            <PatientList patients={patients} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
