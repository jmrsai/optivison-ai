'use client';

import { useState } from 'react';
import type { Patient, Scan } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { NewAnalysisSheet } from '@/components/new-analysis-sheet';
import { ScanCard } from '@/components/scan-card';
import { PlusCircle } from 'lucide-react';
import { analyzeEyeScan } from '@/ai/flows/ai-driven-diagnostics';
import { generatePatientReport } from '@/ai/flows/generate-patient-report';
import { useToast } from '@/hooks/use-toast';
import { saveScan } from '@/lib/storage';
import { generateLongitudinalAnalysis } from '@/ai/flows/longitudinal-analysis';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

type PatientAnalysisProps = {
  patient: Patient;
  initialScans: Scan[];
};

export function PatientAnalysis({ patient, initialScans }: PatientAnalysisProps) {
  const [scans, setScans] = useState<Scan[]>(initialScans);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const { toast } = useToast();
  const [longitudinalAnalysis, setLongitudinalAnalysis] = useState<string | null>(null);
  const [isLongitudinalLoading, setIsLongitudinalLoading] = useState(false);

  const handleNewAnalysis = async ({
    imageFile,
    clinicalNotes,
  }: {
    imageFile: File;
    clinicalNotes: string;
  }) => {
    setSheetOpen(false);

    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onload = async () => {
      const scanImage = reader.result as string;
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
      
      const newScans = [newScanPlaceholder, ...scans];
      setScans(newScans);

      try {
        // Step 1: AI Diagnostics
        const analysisResult = await analyzeEyeScan({
          eyeScanDataUri: scanImage,
          patientHistory: patient.history,
          clinicalNotes: clinicalNotes,
        });
        
        const updateWithAnalysis = newScans.map((s) => (s.id === tempId ? { ...s, analysis: analysisResult } : s));
        setScans(updateWithAnalysis);

        // Step 2: Full Report
        const reportResult = await generatePatientReport({
            patientName: patient.name,
            patientAge: patient.age,
            patientGender: patient.gender,
            scanDate: scanDate,
            clinicalNotes: clinicalNotes,
            analysis: analysisResult,
            patientHistory: patient.history,
        });

        const finalScan: Scan = {
          ...newScanPlaceholder,
          imageUrl: scanImage, // Save the data URI instead of blob URL
          analysis: analysisResult,
          report: reportResult.report,
          status: 'completed'
        };

        setScans((prev) =>
          prev.map((s) => (s.id === tempId ? finalScan : s))
        );
        saveScan(finalScan);

        toast({
          title: "Analysis Complete",
          description: "AI analysis and full report have been generated.",
        });

      } catch (error) {
        console.error("AI analysis failed:", error);
        const failedScan = { ...newScanPlaceholder, status: 'failed' as const };
        setScans((prev) => prev.map((s) => (s.id === tempId ? failedScan : s)));
        saveScan(failedScan);
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: "An error occurred during the AI analysis.",
        });
      }
    };
  };
  
  const runLongitudinalAnalysis = async () => {
    setIsLongitudinalLoading(true);
    setLongitudinalAnalysis(null);
    try {
        const completedScans = scans.filter(s => s.status === 'completed');
        const result = await generateLongitudinalAnalysis({
            patientHistory: patient.history,
            scans: completedScans.map(s => ({
                date: s.date,
                diagnosticInsights: s.analysis?.diagnosticInsights || 'N/A',
                potentialAbnormalities: s.analysis?.potentialAbnormalities || [],
            }))
        });
        setLongitudinalAnalysis(result.longitudinalSummary);
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
    <div className="no-print space-y-8">
      {scans.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Longitudinal Progression Analysis</CardTitle>
            <CardDescription>Analyze changes across all completed scans to identify trends and predict disease progression.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLongitudinalLoading ? (
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            ) : longitudinalAnalysis ? (
              <div className="prose prose-sm max-w-none text-foreground/90">{longitudinalAnalysis}</div>
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
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
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
