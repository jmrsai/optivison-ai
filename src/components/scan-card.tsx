import type { Patient, Scan } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Skeleton } from './ui/skeleton';
import { AlertCircle, CheckCircle, BrainCircuit, ShieldCheck, FileText, Loader, Printer, Download } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import { PrintableReport } from './printable-report';

type ScanCardProps = {
  scan: Scan;
  patient: Patient;
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

export function ScanCard({ scan, patient }: ScanCardProps) {
  const reportRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    documentTitle: `OptiVision-Report-${patient.name.replace(' ', '_')}-${scan.date}`,
  });

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
            <div className="flex items-center gap-2">
              {scan.status === 'completed' && (
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Download className="mr-2 h-4 w-4" />
                  Download / Print
                </Button>
              )}
              {getStatusBadge()}
            </div>
        </div>
      </CardHeader>
      <CardContent>
        {scan.status === 'processing' && <LoadingState />}
        {scan.status === 'failed' && <FailedState />}
        {scan.status === 'completed' && scan.analysis && (
          <>
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div className="w-full aspect-video relative rounded-lg overflow-hidden border">
                <Image src={scan.imageUrl} alt={`Scan from ${scan.date}`} layout="fill" objectFit="contain" data-ai-hint="eye scan" />
              </div>

              <Tabs defaultValue="insights" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="insights"><BrainCircuit className="mr-1 h-4 w-4" />AI Analysis</TabsTrigger>
                  <TabsTrigger value="report"><FileText className="mr-1 h-4 w-4" />Full Report</TabsTrigger>
                </TabsList>
                <TabsContent value="insights" className="mt-4 prose prose-sm max-w-none">
                  <h4 className="font-bold">Diagnostic Insights</h4>
                  <p>{scan.analysis.diagnosticInsights}</p>
                  
                  <h4 className="font-bold mt-4">Potential Abnormalities</h4>
                  {scan.analysis.potentialAbnormalities?.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {scan.analysis.potentialAbnormalities.map((ab, i) => <li key={i}>{ab}</li>)}
                    </ul>
                  ) : <p>None identified.</p>}

                  <h4 className="font-bold mt-4">Differential Diagnosis</h4>
                  {scan.analysis.differentialDiagnosis?.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {scan.analysis.differentialDiagnosis.map((ab, i) => <li key={i}>{ab}</li>)}
                    </ul>
                  ) : <p>None noted.</p>}

                   <h4 className="font-bold mt-4">Early Signs Detected</h4>
                  {scan.analysis.earlySigns?.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {scan.analysis.earlySigns.map((sign, i) => <li key={i}>{sign}</li>)}
                    </ul>
                  ) : <p>None identified.</p>}

                  <h4 className="font-bold mt-4">Prevention Suggestions</h4>
                  {scan.analysis.preventionSuggestions?.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {scan.analysis.preventionSuggestions.map((suggestion, i) => <li key={i}>{suggestion}</li>)}
                    </ul>
                  ) : <p>None provided.</p>}
                  
                  {scan.analysis.diseaseStaging && <>
                    <h4 className="font-bold mt-4">Disease Staging</h4>
                    <p>{scan.analysis.diseaseStaging}</p>
                  </>}

                   <h4 className="font-bold mt-4">Treatment Suggestions</h4>
                  {scan.analysis.treatmentSuggestions?.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {scan.analysis.treatmentSuggestions.map((suggestion, i) => <li key={i}>{suggestion}</li>)}
                    </ul>
                  ) : <p>None provided.</p>}
                  
                  <h4 className="font-bold mt-4">Confidence</h4>
                  <p>{(scan.analysis.confidenceLevel * 100).toFixed(0)}%</p>
                  
                  <h4 className="font-bold mt-4">Recommendations</h4>
                  <p>{scan.analysis.recommendations}</p>
                </TabsContent>
                <TabsContent value="report" className="mt-4 prose prose-sm max-w-none whitespace-pre-wrap font-mono text-xs bg-muted p-4 rounded-md">
                  {scan.report}
                </TabsContent>
              </Tabs>
            </div>
             <div className="hidden">
              <div ref={reportRef}>
                  <PrintableReport scan={scan} patient={patient} />
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
