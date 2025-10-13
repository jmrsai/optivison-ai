import type { Patient } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type PatientHeaderProps = {
  patient: Patient;
};

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

export function PatientHeader({ patient }: PatientHeaderProps) {
  return (
    <Card className="overflow-hidden shadow-sm no-print">
      <CardHeader className="flex flex-col md:flex-row items-center gap-6 bg-muted/50 p-6">
        <Avatar className="h-24 w-24 border-2 border-white">
          <AvatarImage src={patient.avatarUrl} alt={patient.name} />
          <AvatarFallback className="text-3xl">{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="flex-1 grid md:grid-cols-2 gap-x-4 gap-y-2 w-full">
            <div className="grid gap-1 md:col-span-2">
              <h1 className="text-2xl md:text-3xl font-bold">{patient.name}</h1>
              <p className="text-sm text-muted-foreground">Patient ID: {patient.id}</p>
            </div>
             <div className="grid grid-cols-2 gap-4 text-sm pt-2 md:col-span-2">
                <div>
                    <p className="font-medium text-muted-foreground">Age</p>
                    <p className="font-semibold text-base">{patient.age}</p>
                </div>
                <div>
                    <p className="font-medium text-muted-foreground">Gender</p>
                    <p className="font-semibold text-base">{patient.gender}</p>
                </div>
                <div>
                    <p className="font-medium text-muted-foreground">Last Visit</p>
                    <p className="font-semibold text-base">{patient.lastVisit}</p>
                </div>
                <div>
                    <p className="font-medium text-muted-foreground">Current Risk</p>
                     <Badge variant="outline" className={cn("text-base font-semibold capitalize w-fit px-3 py-1", getRiskBadgeClass(patient.riskLevel))}>
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
