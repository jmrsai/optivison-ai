
'use client';

import { useState } from 'react';
import type { Patient, Scan } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { NewAnalysisSheet } from '@/components/new-analysis-sheet';
import { ScanCard } from '@/components/scan-card';
import { PlusCircle } from 'lucide-react';
import { analyzeEyeScan } from '@/ai/flows/ai-driven-diagnostics';
import { generateRiskAssessmentReport } from '@/ai/flows/risk-assessment-report';
import { generatePatientReport } from '@/ai/flows/generate-patient-report';
import { useToast } from '@/hooks/use-toast';
import { saveScan } from '@/lib/storage';

type PatientAnalysisProps = {
  patient: Patient;
  initialScans: Scan[];
};

export function PatientAnalysis({ patient, initialScans }: PatientAnalysisProps) {
  const [scans, setScans] = useState<Scan[]>(initialScans);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const { toast } = useToast();

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

      const newScanPlaceholder: Scan = {
        id: tempId,
        patientId: patient.id,
        date: new Date().toISOString().split('T')[0],
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

        // Step 2: Risk Assessment
        const riskResult = await generateRiskAssessmentReport({
            scanAnalysis: analysisResult.diagnosticInsights,
            patientHistory: patient.history,
        });

        const updateWithRisk = updateWithAnalysis.map((s) => (s.id === tempId ? { ...s, riskAssessment: riskResult.riskAssessmentReport } : s));
        setScans(updateWithRisk);

        // Step 3: Full Report
        const reportResult = await generatePatientReport({
            scanImage: scanImage,
            aiFindings: analysisResult.diagnosticInsights,
            riskAssessment: riskResult.riskAssessmentReport,
            patientHistory: patient.history,
        });

        const finalScan: Scan = {
          ...newScanPlaceholder,
          imageUrl: scanImage, // Save the data URI instead of blob URL
          analysis: analysisResult,
          riskAssessment: riskResult.riskAssessmentReport,
          report: reportResult.report,
          status: 'completed'
        };

        setScans((prev) =>
          prev.map((s) => (s.id === tempId ? finalScan : s))
        );
        saveScan(finalScan);

        toast({
          title: "Analysis Complete",
          description: "AI analysis, risk assessment, and report have been generated.",
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Scan History</h2>
        <Button onClick={() => setSheetOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Analysis
        </Button>
      </div>

      <div className="space-y-6">
        {scans.length > 0 ? (
          scans.map((scan) => <ScanCard key={scan.id} scan={scan} />)
        ) : (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">No scans found for this patient.</p>
            <Button variant="link" onClick={() => setSheetOpen(true)}>Start a new analysis</Button>
          </div>
        )}
      </div>

      <NewAnalysisSheet
        isOpen={isSheetOpen}
        onOpenChange={setSheetOpen}
        onSubmit={handleNewAnalysis}
      />
    </div>
  );
}
