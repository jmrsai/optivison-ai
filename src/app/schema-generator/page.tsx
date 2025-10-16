'use client';

import { useState } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateSchema } from '@/ai/flows/generate-schema';
import { Loader, Wand2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function SchemaGeneratorPage() {
  const [description, setDescription] = useState('');
  const [generatedSchema, setGeneratedSchema] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateSchema = async () => {
    if (!description.trim()) {
      toast({
        variant: 'destructive',
        title: 'Description is empty',
        description: 'Please describe your application to generate a schema.',
      });
      return;
    }
    setIsLoading(true);
    setGeneratedSchema('');
    try {
      const result = await generateSchema({ description });
      const formattedSchema = JSON.stringify(JSON.parse(result.schema), null, 2);
      setGeneratedSchema(formattedSchema);
    } catch (error) {
      console.error('Schema generation failed:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'An error occurred while generating the schema. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">AI Schema Generator</h1>
            <p className="text-muted-foreground">Describe your application, and Gemini will automatically generate a database schema for you.</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Application Description</CardTitle>
              <CardDescription>
                Provide a detailed description of your app. Include the main entities, their properties, and how they relate to each other.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="e.g., 'An e-commerce app where users can buy products. Products have a name, price, and description. Users can have multiple orders, and each order can contain multiple products...'"
                rows={8}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
              />
              <Button onClick={handleGenerateSchema} disabled={isLoading} className="mt-4">
                {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Generate Schema
              </Button>
            </CardContent>
          </Card>

          {isLoading && (
             <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Generated Schema</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                         <Skeleton className="h-6 w-1/3 mt-4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                </CardContent>
             </Card>
          )}

          {generatedSchema && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Generated Schema</CardTitle>
                <CardDescription>Review the generated JSON schema below. You can use this as a blueprint for your database.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted text-foreground rounded-md p-4 max-h-[500px] overflow-auto">
                  <pre><code className="text-sm">{generatedSchema}</code></pre>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
