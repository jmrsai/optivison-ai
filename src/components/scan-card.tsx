
'use client';

import type { Patient, Scan } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Skeleton } from './ui/skeleton';
import { AlertCircle, CheckCircle, Loader, Printer } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { PrintableReport } from './printable-report';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { createRoot } from 'react-dom/client';
import { decrypt } from '@/lib/crypto';


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
  const [decryptedNotes, setDecryptedNotes] = useState('...');

  useEffect(() => {
    if (scan.clinicalNotes) {
      decrypt(scan.clinicalNotes).then(setDecryptedNotes);
    } else {
      setDecryptedNotes('N/A');
    }
  }, [scan.clinicalNotes]);

  const handleDownload = async () => {
    if (isDownloading || !scan.analysis || !scan.report) return;

    setIsDownloading(true);

    const reportElement = document.createElement('div');
    reportElement.style.position = 'absolute';
    reportElement.style.left = '-9999px';
    reportElement.style.top = 'auto';
    reportElement.style.width = '800px'; 
    document.body.appendChild(reportElement);

    const root = createRoot(reportElement);
    
    root.render(<PrintableReport scan={scan} patient={patient} />);

    // Give React time to render the component
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
        const canvas = await html2canvas(reportElement, {
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
        const canvasHeight = canvas.height;
        const canvasWidth = canvas.width;
        
        const pdfHeight = (canvasHeight * pdfWidth) / canvasWidth;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`OptiVision-Report-${patient.name.replace(/ /g, '_')}-${scan.date}.pdf`);

    } catch (error) {
        console.error("Failed to generate PDF:", error);
    } finally {
        root.unmount();
        document.body.removeChild(reportElement);
        setIsDownloading(false);
    }
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
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>Scan from {scan.date}</CardTitle>
                <CardDescription>Clinical Notes: {decryptedNotes}</CardDescription>
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
          <div>
             <div className='flex justify-end items-center border-b mb-4 pb-4'>
              <Button variant="outline" size="sm" onClick={handleDownload} disabled={isDownloading}>
                  <Printer className="mr-2 h-4 w-4" />
                  {isDownloading ? 'Downloading...' : 'Download PDF Report'}
              </Button>
             </div>
            <div className="grid md:grid-cols-2 gap-6 items-start mt-4">
              <div className="w-full aspect-video relative rounded-lg overflow-hidden border">
                <Image src={scan.imageUrl} alt={`Scan from ${scan.date}`} fill objectFit="contain" data-ai-hint="eye scan" />
              </div>

              <div className="prose prose-sm dark:prose-invert max-w-none">
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
                </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
