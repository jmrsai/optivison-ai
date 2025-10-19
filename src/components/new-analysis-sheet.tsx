
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { FileUploader } from '@/components/file-uploader';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';

type NewAnalysisSheetProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: { imageFile: File; clinicalNotes: string, documentFile: File | null }) => void;
};

export function NewAnalysisSheet({ isOpen, onOpenChange, onSubmit }: NewAnalysisSheetProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [clinicalNotes, setClinicalNotes] = useState('');
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!imageFile) {
        toast({
            variant: "destructive",
            title: "No Image Selected",
            description: "Please upload an eye scan image.",
        });
        return;
    }
    onSubmit({ imageFile, clinicalNotes, documentFile });
    // Reset form
    setImageFile(null);
    setDocumentFile(null);
    setClinicalNotes('');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle>New AI Analysis</SheetTitle>
          <SheetDescription>
            Upload a new eye scan and optionally include a supporting medical document. Our AI will analyze them to generate a detailed report.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="grid gap-6 py-6">
            <div className="grid gap-2">
              <Label htmlFor="scan-image">1. Eye Scan Image (Required)</Label>
              <FileUploader onFileSelect={setImageFile} accept={{ 'image/*': ['.jpeg', '.png', '.gif', '.bmp', '.tiff'] }} />
            </div>

            <Separator />
            
            <div className="grid gap-2">
              <Label htmlFor="scan-document">2. Medical Document (Optional)</Label>
              <FileUploader onFileSelect={setDocumentFile} accept={{ 'application/pdf': ['.pdf'], 'image/*': ['.jpeg', '.png'] }} />
              <p className="text-xs text-muted-foreground">Upload a PDF or image of a report for additional context.</p>
            </div>

            <Separator />
            
            <div className="grid gap-2">
              <Label htmlFor="clinical-notes">3. Clinical Notes (Optional)</Label>
              <Textarea
                id="clinical-notes"
                placeholder="Enter any clinical observations, patient symptoms, etc."
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>
        </ScrollArea>
        <SheetFooter className="mt-auto pt-6 -mx-6 px-6 bg-background border-t">
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button onClick={handleSubmit}>Start Analysis</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
