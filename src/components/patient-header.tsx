import type { Patient } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type PatientHeaderProps = {
  patient: Patient;
};

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

export function PatientHeader({ patient }: PatientHeaderProps) {
  return (
    <Card className="overflow-hidden shadow-sm no-print">
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-6 bg-muted/50 p-6">
        <Avatar className="h-24 w-24 border-2 border-white">
          <AvatarImage src={patient.avatarUrl} alt={patient.name} />
          <AvatarFallback className="text-3xl">{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="flex-1 grid md:grid-cols-2 gap-4">
            <div className="grid gap-1">
              <h1 className="text-3xl font-bold">{patient.name}</h1>
              <p className="text-muted-foreground">Patient ID: {patient.id}</p>
            </div>
             <div className="grid grid-cols-2 gap-4 text-sm pt-2">
                <div className="space-y-1">
                    <p className="font-medium text-muted-foreground">Age</p>
                    <p className="font-semibold text-base">{patient.age}</p>
                </div>
                <div className="space-y-1">
                    <p className="font-medium text-muted-foreground">Gender</p>
                    <p className="font-semibold text-base">{patient.gender}</p>
                </div>
                <div className="space-y-1">
                    <p className="font-medium text-muted-foreground">Last Visit</p>
                    <p className="font-semibold text-base">{patient.lastVisit}</p>
                </div>
                <div className="space-y-1">
                    <p className="font-medium text-muted-foreground">Current Risk</p>
                    <Badge variant={getRiskBadgeVariant(patient.riskLevel)} className="text-base font-semibold capitalize w-fit">
                        {patient.riskLevel}
                    </Badge>
                </div>
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
         <div>
            <h4 className="font-semibold text-sm text-foreground">Patient Medical History</h4>
            <p className="text-sm mt-2 text-foreground/90 max-w-prose whitespace-pre-wrap">{patient.history}</p>
        </div>
      </CardContent>
    </Card>
  );
}
