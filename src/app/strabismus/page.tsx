'use client';

import { useState, useRef, useEffect } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUploader } from '@/components/file-uploader';
import { useToast } from '@/hooks/use-toast';
import { fileToDataUri } from '@/lib/utils';
import { Loader2, Camera, Upload, CheckCircle, AlertTriangle } from 'lucide-react';
import { analyzeStrabismus } from '@/ai/flows/strabismus-analysis';
import type { StrabismusAnalysisOutput } from '@/ai/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';

type AnalysisMode = 'camera' | 'upload';

export default function StrabismusPage() {
  const [mode, setMode] = useState<AnalysisMode | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<StrabismusAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (mode === 'camera') {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings to use this feature.',
          });
          setMode(null);
        }
      };
      getCameraPermission();

      return () => {
        // Cleanup: stop video stream when component unmounts or mode changes
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
        }
      };
    }
  }, [mode, toast]);

  const handleFileSelect = (file: File | null) => {
    setImageFile(file);
    setAnalysisResult(null);
  };
  
  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => {
          if (blob) {
            const file = new File([blob], `capture-${Date.now()}.png`, { type: 'image/png' });
            handleFileSelect(file);
          }
        }, 'image/png');
      }
    }
  };

  const handleAnalysis = async () => {
    if (!imageFile) {
      toast({
        variant: 'destructive',
        title: 'No Image',
        description: 'Please capture or upload an image first.',
      });
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const imageDataUri = await fileToDataUri(imageFile);
      const result = await analyzeStrabismus({ eyeImageDataUri: imageDataUri });
      setAnalysisResult(result);
      toast({
        title: 'Analysis Complete',
        description: 'Strabismus analysis has been successfully performed.',
      });
    } catch (error) {
      console.error('Strabismus analysis failed:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'An error occurred during the AI analysis.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetAll = () => {
      setMode(null);
      setImageFile(null);
      setAnalysisResult(null);
      setHasCameraPermission(null);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Strabismus Detection</CardTitle>
            <CardDescription>
              Use your device's camera or upload an image to analyze for signs of strabismus (crossed eyes).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!mode ? (
              <div className="grid md:grid-cols-2 gap-6 p-8">
                <Button variant="outline" className="h-24 text-lg" onClick={() => setMode('camera')}>
                  <Camera className="mr-4 h-8 w-8" /> Use Camera
                </Button>
                <Button variant="outline" className="h-24 text-lg" onClick={() => setMode('upload')}>
                  <Upload className="mr-4 h-8 w-8" /> Upload Image
                </Button>
              </div>
            ) : (
                <>
                    {mode === 'camera' && (
                        <div className="space-y-4">
                            <h3 className='font-medium'>Camera Capture</h3>
                            <div className="w-full aspect-video rounded-md bg-muted overflow-hidden relative border">
                                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                                {hasCameraPermission === false && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                        <Alert variant="destructive" className="max-w-sm">
                                            <AlertTriangle className="h-4 w-4" />
                                            <AlertTitle>Camera Access Required</AlertTitle>
                                            <AlertDescription>
                                                Please allow camera access to use this feature. You may need to refresh the page.
                                            </AlertDescription>
                                        </Alert>
                                    </div>
                                )}
                            </div>
                            <Button onClick={handleCapture} disabled={!hasCameraPermission}>
                                <Camera className="mr-2 h-4 w-4" />
                                Capture Image
                            </Button>
                        </div>
                    )}

                    {mode === 'upload' && (
                        <div className="space-y-2">
                           <h3 className='font-medium'>Upload Image</h3>
                            <FileUploader
                                onFileSelect={handleFileSelect}
                                accept={{ 'image/*': ['.jpeg', '.png', '.gif', '.bmp', '.tiff'] }}
                            />
                        </div>
                    )}
                    
                    {imageFile && (
                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="font-medium">Image to Analyze</h3>
                             <div className="w-48 h-48 relative rounded-md overflow-hidden border">
                                 <Image src={URL.createObjectURL(imageFile)} alt="Selected image for analysis" layout="fill" objectFit="cover" />
                             </div>
                            <Button onClick={handleAnalysis} disabled={isLoading}>
                                {isLoading ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</>
                                ) : (
                                    'Run Strabismus Analysis'
                                )}
                            </Button>
                        </div>
                    )}
                </>
            )}

            {analysisResult && (
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle>Analysis Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <Alert variant={analysisResult.diagnosis.hasStrabismus ? "destructive" : "default"}>
                       {analysisResult.diagnosis.hasStrabismus ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                        <AlertTitle className="font-bold text-lg">
                           {analysisResult.diagnosis.hasStrabismus ? `Signs of ${analysisResult.diagnosis.type || 'Strabismus'} Detected` : "No Clear Signs of Strabismus Detected"}
                        </AlertTitle>
                        <AlertDescription>
                            Confidence: {(analysisResult.diagnosis.confidence * 100).toFixed(0)}%
                        </AlertDescription>
                    </Alert>

                  <div>
                    <h4 className="font-semibold">Observations</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{analysisResult.observations}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Next Steps</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{analysisResult.nextSteps}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {(mode || analysisResult) && (
              <div className="pt-4 border-t">
                <Button variant="link" onClick={resetAll}>Start Over</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
