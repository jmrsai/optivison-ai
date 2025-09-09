import type { Patient } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type PatientHeaderProps = {
  patient: Patient;
};

export function PatientHeader({ patient }: PatientHeaderProps) {
  return (
    <Card className="overflow-hidden shadow-sm">
      <CardHeader className="flex flex-row items-center gap-4 bg-muted/30 p-4">
        <Avatar className="h-16 w-16 border">
          <AvatarImage src={patient.avatarUrl} alt={patient.name} />
          <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-2xl">{patient.name}</CardTitle>
          <p className="text-muted-foreground">Patient ID: {patient.id}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex flex-col">
            <span className="font-medium text-muted-foreground">Age</span>
            <span className="font-semibold">{patient.age}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-muted-foreground">Gender</span>
            <span className="font-semibold">{patient.gender}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-muted-foreground">Last Visit</span>
            <span className="font-semibold">{patient.lastVisit}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-muted-foreground">Current Risk</span>
            <span className="font-semibold">{patient.riskLevel}</span>
          </div>
        </div>
        <Separator className="my-4" />
         <div>
            <h4 className="font-medium text-muted-foreground text-sm">Patient History Notes</h4>
            <p className="font-semibold text-sm mt-1">{patient.history}</p>
        </div>
      </CardContent>
    </Card>
  );
}
