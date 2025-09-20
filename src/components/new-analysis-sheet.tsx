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

type NewAnalysisSheetProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: { imageFile: File; clinicalNotes: string }) => void;
};

export function NewAnalysisSheet({ isOpen, onOpenChange, onSubmit }: NewAnalysisSheetProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
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
    onSubmit({ imageFile, clinicalNotes });
    // Reset form
    setImageFile(null);
    setClinicalNotes('');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>New AI Analysis</SheetTitle>
          <SheetDescription>
            Upload a new eye scan. Our advanced deep learning models will analyze the scan and generate a detailed report.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div className="grid gap-2">
            <Label htmlFor="scan-image">Eye Scan Image</Label>
            <FileUploader onFileSelect={setImageFile} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="clinical-notes">Clinical Notes</Label>
            <Textarea
              id="clinical-notes"
              placeholder="Enter any clinical observations, patient symptoms, etc."
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              rows={5}
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button onClick={handleSubmit}>Start Analysis</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
