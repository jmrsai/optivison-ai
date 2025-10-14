'use client';

import type { Patient, Scan } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Skeleton } from './ui/skeleton';
import { AlertCircle, CheckCircle, BrainCircuit, FileText, Loader, Printer } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { useRef, useState } from 'react';
import { PrintableReport } from './printable-report';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!reportRef.current) return;
    
    setIsDownloading(true);

    const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
        orientation: 'p',
        unit: 'pt',
        format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    const canvasAspectRatio = canvasWidth / canvasHeight;
    const pageAspectRatio = pdfWidth / pdfHeight;

    let imgWidth, imgHeight;

    if (canvasAspectRatio > pageAspectRatio) {
      imgWidth = pdfWidth;
      imgHeight = pdfWidth / canvasAspectRatio;
    } else {
      imgHeight = pdfHeight;
      imgWidth = pdfHeight * canvasAspectRatio;
    }

    let heightLeft = canvasHeight;
    let position = 0;

    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvasWidth;
    pageCanvas.height = canvas.height * (pdfHeight/imgHeight);

    const pageCtx = pageCanvas.getContext('2d');

    if (!pageCtx) {
      setIsDownloading(false);
      return;
    }
    
    let pageCount = 0;
    while(heightLeft > 0) {
      pageCtx.fillStyle = 'white';
      pageCtx.fillRect(0,0,pageCanvas.width, pageCanvas.height);
      pageCtx.drawImage(canvas, 0, heightLeft * -1, canvasWidth, canvas.height);

      if (pageCount > 0) pdf.addPage();
      pdf.addImage(pageCanvas, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      heightLeft -= pageCanvas.height;
      pageCount++;
    }
    
    pdf.save(`OptiVision-Report-${patient.name.replace(/ /g, '_')}-${scan.date}.pdf`);

    setIsDownloading(false);
  };

  const getStatusBadge = () => {
    switch (scan.status) {
      case 'completed':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800">
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
    <>
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-start">
              <div>
                  <CardTitle>Scan from {scan.date}</CardTitle>
                  <CardDescription>Clinical Notes: {scan.clinicalNotes || 'N/A'}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge()}
              </div>
          </div>
        </CardHeader>
        <CardContent>
          {scan.status === 'processing' && <LoadingState />}
          {scan.status === 'failed' && <FailedState />}
          {scan.status === 'completed' && scan.analysis && (
            <Tabs defaultValue="insights" className="w-full">
               <div className='flex justify-between items-center border-b mb-4'>
                <TabsList className="grid grid-cols-2 w-full max-w-sm">
                    <TabsTrigger value="insights"><BrainCircuit className="mr-1 h-4 w-4" />AI Analysis</TabsTrigger>
                    <TabsTrigger value="report"><FileText className="mr-1 h-4 w-4" />Full Report</TabsTrigger>
                </TabsList>
                <Button variant="outline" size="sm" onClick={handleDownload} disabled={isDownloading}>
                    <Printer className="mr-2 h-4 w-4" />
                    {isDownloading ? 'Downloading...' : 'Download PDF'}
                </Button>
               </div>
              <div className="grid md:grid-cols-2 gap-6 items-start mt-4">
                <div className="w-full aspect-video relative rounded-lg overflow-hidden border">
                  <Image src={scan.imageUrl} alt={`Scan from ${scan.date}`} fill objectFit="contain" data-ai-hint="eye scan" />
                </div>

                <div>
                  <TabsContent value="insights" className="mt-0 prose prose-sm dark:prose-invert max-w-none">
                    <h4>Diagnostic Insights</h4>
                    <p>{scan.analysis.diagnosticInsights}</p>
                    
                    <h4>Potential Abnormalities</h4>
                    {scan.analysis.potentialAbnormalities?.length > 0 ? (
                      <ul>
                        {scan.analysis.potentialAbnormalities.map((ab, i) => <li key={i}>{ab}</li>)}
                      </ul>
                    ) : <p>None identified.</p>}

                    <h4>Recommendations</h4>
                    <p>{scan.analysis.recommendations}</p>

                    <h4>Confidence</h4>
                    <p>{(scan.analysis.confidenceLevel * 100).toFixed(0)}%</p>
                  </TabsContent>
                  <TabsContent value="report" className="mt-0 prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-mono text-xs bg-muted p-4 rounded-md">
                    {scan.report}
                  </TabsContent>
                </div>
              </div>
            </Tabs>
          )}
        </CardContent>
      </Card>
      
      {/* Off-screen container for the printable report */}
      <div className="absolute -left-[9999px] top-auto" style={{width: 800}}>
        <div ref={reportRef}>
          <PrintableReport scan={scan} patient={patient} />
        </div>
      </div>
    </>
  );
}
