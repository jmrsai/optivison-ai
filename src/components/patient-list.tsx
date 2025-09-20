'use client';

import type { Patient } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Eye } from 'lucide-react';
import Link from 'next/link';

type PatientListProps = {
  patients: Patient[];
};

export function PatientList({ patients }: PatientListProps) {
  const router = useRouter();

  const getRiskBadgeClass = (riskLevel: Patient['riskLevel']) => {
    switch (riskLevel) {
      case 'High':
        return 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20';
      case 'Medium':
        return 'bg-yellow-400/10 text-yellow-500 border-yellow-400/20 hover:bg-yellow-400/20 dark:text-yellow-400';
      case 'Low':
        return 'bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20 dark:text-green-400';
      default:
        return 'bg-muted text-muted-foreground border-transparent';
    }
  };


  if (patients.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No patients registered yet.</p>
        <Button variant="link" asChild>
          <Link href="/register">Register the first patient</Link>
        </Button>
      </div>
    );
  }


  return (
    <div className="overflow-x-auto border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead>Patient</TableHead>
            <TableHead className="hidden md:table-cell">Age</TableHead>
            <TableHead className="hidden md:table-cell">Gender</TableHead>
            <TableHead className="hidden lg:table-cell">Last Visit</TableHead>
            <TableHead>Risk Level</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow
              key={patient.id}
              className="cursor-pointer"
              onClick={() => router.push(`/patient/${patient.id}`)}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={patient.avatarUrl} alt={patient.name} />
                    <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{patient.name}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">{patient.age}</TableCell>
              <TableCell className="hidden md:table-cell">{patient.gender}</TableCell>
              <TableCell className="hidden lg:table-cell">{patient.lastVisit}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn(
                    'capitalize',
                    getRiskBadgeClass(patient.riskLevel)
                  )}
                >
                  {patient.riskLevel}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); router.push(`/patient/${patient.id}`)}}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Record
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
