
'use client';

import { useUser, useFirestore } from '@/firebase';
import type { User } from 'firebase/auth';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Scan, MessageSquare, Files, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useMemoFirebase } from '@/hooks/use-memo-firebase';
import type { Scan as ScanType } from '@/lib/types';
import { format } from 'date-fns';

type PatientPortalProps = {
  patientUser: User;
};

function ScanHistoryItem({ scan }: { scan: ScanType }) {
  return (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
      <div>
        <p className="font-semibold">Scan from {format(new Date(scan.date), 'PPP')}</p>
        <p className="text-sm text-muted-foreground">Status: <span className="capitalize">{scan.status}</span></p>
      </div>
      <Button variant="outline" size="sm" asChild>
        <Link href={`/patient/${scan.patientId}#scan-${scan.id}`}>View Details</Link>
      </Button>
    </div>
  );
}

export function PatientPortal({ patientUser }: PatientPortalProps) {
  const firestore = useFirestore();

  const scansQuery = useMemoFirebase(
    () => query(collection(firestore, 'scans'), where('clinicianId', '==', patientUser.uid), orderBy('date', 'desc')),
    [firestore, patientUser.uid]
  );

  const [scansSnapshot, scansLoading] = useCollection(scansQuery);
  const scans = scansSnapshot?.docs.map(doc => ({ id: doc.id, ...doc.data() } as ScanType)) || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Patient Portal</h1>
        <p className="text-muted-foreground">Welcome, {patientUser.displayName || 'Patient'}. Access your health information below.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Scan className="h-5 w-5 text-primary"/> Strabismus Screening</CardTitle>
            <CardDescription>Use our AI tool to perform a quick check for signs of strabismus.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/strabismus">Start Screening <ArrowRight className="ml-2 h-4 w-4"/></Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-primary"/> Secure Messaging</CardTitle>
            <CardDescription>Communicate with your assigned clinician securely.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button disabled>Coming Soon</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Files className="h-5 w-5 text-primary"/> Your Digital Archive</CardTitle>
          <CardDescription>Review your past scans and analysis results.</CardDescription>
        </CardHeader>
        <CardContent>
          {scansLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              <p>Loading your scan history...</p>
            </div>
          ) : scans.length > 0 ? (
            <div className="space-y-3">
              {scans.map(scan => <ScanHistoryItem key={scan.id} scan={scan} />)}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">You have no scan history yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
