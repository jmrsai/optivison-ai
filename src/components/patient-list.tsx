
'use client';

import type { Patient } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Eye } from 'lucide-react';

type PatientListProps = {
  patients: Patient[];
};

export function PatientList({ patients }: PatientListProps) {
  const router = useRouter();

  const getRiskBadgeVariant = (riskLevel: Patient['riskLevel']) => {
    switch (riskLevel) {
      case 'High':
        return 'destructive';
      case 'Medium':
        return 'secondary';
      case 'Low':
        return 'default';
      default:
        return 'outline';
    }
  };

  if (patients.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No patients registered yet.</p>
        <Button variant="link" asChild>
          <a href="/register">Register the first patient</a>
        </Button>
      </div>
    );
  }


  return (
    <div className="overflow-x-auto border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
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
                  className={cn(
                    'capitalize',
                    getRiskBadgeVariant(patient.riskLevel) === 'default' &&
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200',
                    getRiskBadgeVariant(patient.riskLevel) === 'secondary' &&
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200',
                  )}
                  variant={getRiskBadgeVariant(patient.riskLevel)}
                >
                  {patient.riskLevel}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); router.push(`/patient/${patient.id}`)}}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
