'use client';

import { useState, useEffect } from 'react';
import type { Patient, Scan } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { NewAnalysisSheet } from '@/components/new-analysis-sheet';
import { ScanCard } from '@/components/scan-card';
import { PlusCircle } from 'lucide-react';
import { analyzeEyeScan } from '@/ai/flows/ai-driven-diagnostics';
import { analyzeDocument } from '@/ai/flows/document-analysis';
import type { DocumentAnalysisOutput } from '@/ai/types';
import { generatePatientReport } from '@/ai/flows/generate-patient-report';
import { useToast } from '@/hooks/use-toast';
import { saveScan } from '@/lib/storage';
import { generateLongitudinalAnalysis } from '@/ai/flows/longitudinal-analysis';
import type { LongitudinalAnalysisOutput } from '@/ai/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { ChartContainer, ChartConfig, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { format } from 'date-fns';
import { fileToDataUri } from '@/lib/utils';
import { decrypt } from '@/lib/crypto';


type PatientAnalysisProps = {
  patient: Patient;
  initialScans: Scan[];
  onPatientUpdate: (patient: Patient) => void;
};

const chartConfig = {
  riskScore: {
    label: "Risk Score",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig


export function PatientAnalysis({ patient, initialScans, onPatientUpdate }: PatientAnalysisProps) {
  const [scans, setScans] = useState<Scan[]>(initialScans);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const { toast } = useToast();
  const [longitudinalAnalysis, setLongitudinalAnalysis] = useState<LongitudinalAnalysisOutput | null>(null);
  const [isLongitudinalLoading, setIsLongitudinalLoading] = useState(false);

  useEffect(() => {
    setScans(initialScans);
  }, [initialScans]);

  const handleNewAnalysis = async ({
    imageFile,
    clinicalNotes,
    documentFile,
  }: {
    imageFile: File;
    clinicalNotes: string;
    documentFile: File | null;
  }) => {
    setSheetOpen(false);

    const tempId = `scan-${Date.now()}`;
    const scanDate = new Date().toISOString().split('T')[0];

    const newScanPlaceholder: Scan = {
      id: tempId,
      patientId: patient.id,
      date: scanDate,
      imageUrl: URL.createObjectURL(imageFile),
      clinicalNotes,
      status: 'processing',
    };
    
    setScans(prevScans => [newScanPlaceholder, ...prevScans]);

    try {
        let documentAnalysisResult: DocumentAnalysisOutput | undefined;
        if (documentFile) {
            const docDataUri = await fileToDataUri(documentFile);
            documentAnalysisResult = await analyzeDocument({ documentDataUri: docDataUri });
        }
        
        const eyeScanDataUri = await fileToDataUri(imageFile);
        
        // Decrypt patient history for the AI
        const decryptedHistory = await decrypt(patient.history);

        const analysisResult = await analyzeEyeScan({
            eyeScanDataUri: eyeScanDataUri,
            patientHistory: decryptedHistory,
            clinicalNotes: clinicalNotes,
            documentAnalysis: documentAnalysisResult,
        });
        
        const finalScan: Scan = {
            ...newScanPlaceholder,
            imageUrl: eyeScanDataUri, 
            analysis: analysisResult,
            report: 'Generating report...',
            status: 'completed'
        };
        
        setScans((prev) => prev.map((s) => (s.id === tempId ? { ...s, analysis: analysisResult, imageUrl: eyeScanDataUri, status: 'completed' } : s)));

        const reportResult = await generatePatientReport({
            patientName: patient.name,
            patientAge: patient.age,
            patientGender: patient.gender,
            scanDate: scanDate,
            clinicalNotes: clinicalNotes,
            analysis: analysisResult,
            patientHistory: decryptedHistory,
        });

        finalScan.report = reportResult.report;
        
        await saveScan(finalScan);
        setScans((prev) => prev.map((s) => (s.id === tempId ? finalScan : s)));
        
        if (analysisResult.riskLevel && analysisResult.riskLevel !== 'N/A') {
            const updatedPatient = { ...patient, riskLevel: analysisResult.riskLevel, lastVisit: new Date().toISOString().split('T')[0] };
            onPatientUpdate(updatedPatient);
        }

        toast({
            title: "Analysis Complete",
            description: "AI analysis and full report have been generated.",
        });

    } catch (error) {
        console.error("AI analysis pipeline failed:", error);
        const failedScan = { ...newScanPlaceholder, status: 'failed' as const };
        await saveScan(failedScan);
        setScans((prev) => prev.map((s) => (s.id === tempId ? failedScan : s)));
        toast({
            variant: "destructive",
            title: "Analysis Failed",
            description: error instanceof Error ? error.message : "An unknown error occurred during the AI analysis pipeline.",
        });
    }
  };
  
  const runLongitudinalAnalysis = async () => {
    setIsLongitudinalLoading(true);
    setLongitudinalAnalysis(null);
    try {
        const completedScans = scans.filter(s => s.status === 'completed' && s.analysis);
        if (completedScans.length < 2) {
             toast({
                variant: "destructive",
                title: "Not Enough Data",
                description: "Longitudinal analysis requires at least two completed scans.",
            });
            setIsLongitudinalLoading(false);
            return;
        }

        const decryptedHistory = await decrypt(patient.history);

        const result = await generateLongitudinalAnalysis({
            patientHistory: decryptedHistory,
            scans: completedScans.map(s => ({
                date: s.date,
                diagnosticInsights: s.analysis!.diagnosticInsights,
                potentialAbnormalities: s.analysis!.potentialAbnormalities,
                riskLevel: s.analysis!.riskLevel
            }))
        });
        setLongitudinalAnalysis(result);
    } catch(error) {
        console.error("Longitudinal analysis failed:", error);
        toast({
            variant: "destructive",
            title: "Longitudinal Analysis Failed",
            description: "Could not generate progression analysis.",
        });
    } finally {
        setIsLongitudinalLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {scans.filter(s => s.status === 'completed').length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Longitudinal Progression Analysis</CardTitle>
            <CardDescription>Analyze changes across all completed scans to identify trends and disease progression.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLongitudinalLoading ? (
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            ) : longitudinalAnalysis ? (
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 whitespace-pre-wrap">{longitudinalAnalysis.longitudinalSummary}</div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Risk Progression Over Time</h4>
                     <ChartContainer config={chartConfig} className="h-[250px] w-full">
                       <BarChart data={longitudinalAnalysis.chartData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                         <CartesianGrid vertical={false} />
                         <XAxis 
                            dataKey="date" 
                            tickLine={false} 
                            axisLine={false} 
                            tickMargin={8} 
                            tickFormatter={(value) => format(new Date(value), "MMM yyyy")}
                          />
                         <YAxis 
                            dataKey="riskScore" 
                            tickLine={false} 
                            axisLine={false} 
                            tickMargin={8}
                            domain={[0, 3]}
                            ticks={[1, 2, 3]}
                            tickFormatter={(value) => ['Low', 'Medium', 'High'][value-1]}
                         />
                         <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent 
                            labelFormatter={(value) => format(new Date(value as string), "PPP")}
                            formatter={(value, name, props) => {
                              const { payload } = props;
                              if (payload) {
                                return (
                                  <div className="flex flex-col">
                                    <span>Risk: {['Low', 'Medium', 'High'][payload.riskScore - 1]}</span>
                                  </div>
                                )
                              }
                              return null;
                            }}
                          />}
                        />
                         <Bar dataKey="riskScore" fill="var(--color-riskScore)" radius={4} />
                       </BarChart>
                     </ChartContainer>
                  </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center gap-4 p-8 border-2 border-dashed rounded-lg">
                    <TrendingUp className="h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground">Run AI analysis to detect changes over time.</p>
                    <Button onClick={runLongitudinalAnalysis} disabled={isLongitudinalLoading}>Generate Progression Report</Button>
                </div>
            )}
          </CardContent>
        </Card>
      )}

      <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Scan History & Reports</h2>
            <Button onClick={() => setSheetOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Analysis
            </Button>
          </div>

          <div className="space-y-6">
            {scans.length > 0 ? (
              scans.map((scan) => <ScanCard key={scan.id} scan={scan} patient={patient} />)
            ) : (
              <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/20">
                <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium text-foreground">No Scans Found</h3>
                <p className="mt-2 text-sm text-muted-foreground">This patient does not have any scans yet.</p>
                <Button className="mt-4" variant="default" onClick={() => setSheetOpen(true)}>Start the First Analysis</Button>
              </div>
            )}
          </div>
      </div>


      <NewAnalysisSheet
        isOpen={isSheetOpen}
        onOpenChange={setSheetOpen}
        onSubmit={handleNewAnalysis}
      />
    </div>
  );
}
