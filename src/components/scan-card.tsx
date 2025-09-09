import type { Scan } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Skeleton } from './ui/skeleton';
import { AlertCircle, CheckCircle, BrainCircuit, ShieldCheck, FileText, Loader } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

type ScanCardProps = {
  scan: Scan;
};

const LoadingState = () => (
  <div className="grid md:grid-cols-2 gap-6">
    <Skeleton className="w-full h-64 rounded-lg" />
    <div className="space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-12 w-full" />
    </div>
  </div>
);

const FailedState = () => (
    <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Analysis Failed</AlertTitle>
        <AlertDescription>
            The AI analysis could not be completed for this scan. Please try again or use a different image.
        </AlertDescription>
    </Alert>
)

export function ScanCard({ scan }: ScanCardProps) {
  const getStatusBadge = () => {
    switch (scan.status) {
      case 'completed':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="secondary">
            <Loader className="mr-1 h-3 w-3 animate-spin" />
            Processing...
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            <AlertCircle className="mr-1 h-3 w-3" />
            Failed
          </Badge>
        );
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>Scan from {scan.date}</CardTitle>
                <CardDescription>Clinical Notes: {scan.clinicalNotes || 'N/A'}</CardDescription>
            </div>
            {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        {scan.status === 'processing' && <LoadingState />}
        {scan.status === 'failed' && <FailedState />}
        {scan.status === 'completed' && scan.analysis && (
          <div className="grid md:grid-cols-2 gap-6 items-start">
            <div className="w-full aspect-video relative rounded-lg overflow-hidden border">
              <Image src={scan.imageUrl} alt={`Scan from ${scan.date}`} layout="fill" objectFit="contain" data-ai-hint="eye scan" />
            </div>

            <Tabs defaultValue="insights" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="insights"><BrainCircuit className="mr-1 h-4 w-4" />Insights</TabsTrigger>
                <TabsTrigger value="risk"><ShieldCheck className="mr-1 h-4 w-4" />Risk</TabsTrigger>
                <TabsTrigger value="report"><FileText className="mr-1 h-4 w-4" />Report</TabsTrigger>
              </TabsList>
              <TabsContent value="insights" className="mt-4 prose prose-sm max-w-none">
                <h4 className="font-bold">Diagnostic Insights</h4>
                <p>{scan.analysis.diagnosticInsights}</p>
                <h4 className="font-bold mt-4">Potential Abnormalities</h4>
                {scan.analysis.potentialAbnormalities.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {scan.analysis.potentialAbnormalities.map((ab, i) => <li key={i}>{ab}</li>)}
                  </ul>
                ) : <p>None identified.</p>}
                 <h4 className="font-bold mt-4">Confidence</h4>
                <p>{(scan.analysis.confidenceLevel * 100).toFixed(0)}%</p>
                <h4 className="font-bold mt-4">Recommendations</h4>
                <p>{scan.analysis.recommendations}</p>
              </TabsContent>
              <TabsContent value="risk" className="mt-4 prose prose-sm max-w-none">
                <h4 className="font-bold">Risk Assessment Report</h4>
                <p>{scan.riskAssessment}</p>
              </TabsContent>
              <TabsContent value="report" className="mt-4 prose prose-sm max-w-none whitespace-pre-wrap font-code text-xs">
                {scan.report}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
