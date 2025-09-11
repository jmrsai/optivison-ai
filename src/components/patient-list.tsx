
'use client';

import type { Patient } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

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

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead className="hidden md:table-cell">Age</TableHead>
            <TableHead className="hidden md:table-cell">Gender</TableHead>
            <TableHead className="hidden lg:table-cell">Last Visit</TableHead>
            <TableHead>Risk Level</TableHead>
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
                    <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
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
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                    getRiskBadgeVariant(patient.riskLevel) === 'secondary' &&
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  )}
                  variant={getRiskBadgeVariant(patient.riskLevel)}
                >
                  {patient.riskLevel}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
