'use client';

import { useState, useEffect } from 'react';
import type { Patient, Scan, UserProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { NewAnalysisSheet } from '@/components/new-analysis-sheet';
import { ScanCard } from '@/components/scan-card';
import { PlusCircle } from 'lucide-react';
import { analyzeEyeScan } from '@/ai/flows/ai-driven-diagnostics';
import { useToast } from '@/hooks/use-toast';
import { addScan, updateScan } from '@/lib/scan-service';
import { generateLongitudinalAnalysis } from '@/ai/flows/longitudinal-analysis';
import type { LongitudinalAnalysisOutput } from '@/ai/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { ChartContainer, ChartConfig, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { format } from 'date-fns';
import { fileToDataUri } from '@/lib/utils';
import { useFirestore } from '@/firebase';
import { useUser } from '@/firebase/auth/use-user';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';

type PatientAnalysisProps = {
  patient: Patient;
  initialScans: Scan[];
  onPatientUpdate: (patient: Partial<Patient>) => void;
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
  const firestore = useFirestore();
  const { user } = useUser();
  const [profile] = useDocumentData(
    user ? doc(firestore, 'users', user.uid) : undefined
  );
  const userProfile = profile as UserProfile | undefined;


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
    if (!user) return;

    const tempId = `scan-${Date.now()}`;
    const scanDate = new Date().toISOString().split('T')[0];

    const newScanPlaceholder: Omit<Scan, 'id'> = {
      patientId: patient.id,
      clinicianId: user.uid,
      date: scanDate,
      imageUrl: URL.createObjectURL(imageFile),
      clinicalNotes,
      status: 'processing',
    };
    
    // Add placeholder to UI immediately
    const tempScanForUi = { ...newScanPlaceholder, id: tempId };
    setScans(prevScans => [tempScanForUi, ...prevScans]);

    let scanId: string | null = null;

    try {
        scanId = await addScan(firestore, newScanPlaceholder);

        const eyeScanDataUri = await fileToDataUri(imageFile);
        let documentDataUri: string | undefined;

        if (documentFile) {
            documentDataUri = await fileToDataUri(documentFile);
        }
        
        toast({ title: "AI Analysis In Progress...", description: "The AI is generating a full diagnostic report. This may take a moment." });
        
        const result = await analyzeEyeScan({
            patientName: patient.name,
            patientAge: patient.age,
            patientGender: patient.gender,
            patientHistory: patient.history,
            scanDate,
            eyeScanDataUri,
            clinicalNotes,
            documentDataUri,
        });
        
        const finalScanUpdate: Partial<Scan> = {
            imageUrl: eyeScanDataUri,
            analysis: result.analysis,
            report: result.report,
            status: 'completed',
        };
        
        await updateScan(firestore, scanId, finalScanUpdate);
        
        setScans((prev) => prev.map((s) => (s.id === tempId ? { ...s, ...finalScanUpdate, id: scanId! } : s)));

        if (result.analysis.riskLevel && result.analysis.riskLevel !== 'N/A') {
            const updatedPatient = { riskLevel: result.analysis.riskLevel, lastVisit: scanDate };
            onPatientUpdate(updatedPatient);
        }

        toast({
            title: "Analysis Complete",
            description: "AI analysis and full report have been generated.",
        });

    } catch (error) {
        console.error("AI analysis pipeline failed:", error);
        if (scanId) {
            const failedScanUpdate = { status: 'failed' as const };
            await updateScan(firestore, scanId, failedScanUpdate);
            // Update UI for the failed scan
             setScans((prev) => prev.map((s) => (s.id === tempId ? { ...s, status: 'failed', id: scanId! } : s)));
        } else {
            // Remove the placeholder if adding the doc failed
            setScans((prev) => prev.filter(s => s.id !== tempId));
        }

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

        const result = await generateLongitudinalAnalysis({
            patientHistory: patient.history,
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
      {scans.filter(s => s.status === 'completed').length > 1 && userProfile?.role === 'clinician' && (
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
             {userProfile?.role === 'clinician' && (
                <Button onClick={() => setSheetOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Analysis
                </Button>
            )}
          </div>

          <div className="space-y-6">
            {scans.length > 0 ? (
              scans.map((scan) => <ScanCard key={scan.id} scan={scan} patient={patient} />)
            ) : (
              <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/20">
                <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium text-foreground">No Scans Found</h3>
                <p className="mt-2 text-sm text-muted-foreground">This patient does not have any scans yet.</p>
                {userProfile?.role === 'clinician' && (
                    <Button className="mt-4" variant="default" onClick={() => setSheetOpen(true)}>Start the First Analysis</Button>
                )}
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
