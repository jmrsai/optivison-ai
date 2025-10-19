
'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bot, Loader2, Send, User } from 'lucide-react';
import type { Patient, Scan } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { chatWithMedicalChart } from '@/ai/flows/medical-chart-bot';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';

type MedicalChartBotProps = {
  patient: Patient;
  scans: Scan[];
};

type Message = {
  role: 'user' | 'bot';
  content: string;
};

export function MedicalChartBot({ patient, scans }: MedicalChartBotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setQuery('');

    try {
        const latestScan = scans[0];
        const historicalScans = scans.slice(1);
        
        const result = await chatWithMedicalChart({
            patient: {
                id: patient.id,
                name: patient.name,
                age: patient.age,
                gender: patient.gender,
                history: patient.history,
            },
            latestScan: {
                analysis: latestScan.analysis!,
            },
            historicalScans: historicalScans.map(s => ({
                date: s.date,
                analysis: s.analysis!,
            })),
            query,
        });

        const botMessage: Message = { role: 'bot', content: result.response };
        setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
        console.error("Chart bot error:", error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not get a response from the AI assistant.',
        });
        // Remove the user's message if the bot fails to respond
        setMessages(prev => prev.slice(0, -1));
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>AI Chart Assistant</CardTitle>
        <CardDescription>
          Ask questions about {patient.name}'s chart, including their history and scan results.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] flex flex-col">
            <ScrollArea className="flex-1 mb-4 pr-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground p-8">
                        <Bot className="h-10 w-10 mx-auto mb-2"/>
                        <p>I'm ready to answer your questions. <br/> Try "Summarize the latest scan findings" or "Has the patient's risk level changed over time?"</p>
                    </div>
                ) : (
                    messages.map((message, index) => (
                        <div key={index} className={cn("flex items-start gap-3", message.role === 'user' ? 'justify-end' : '')}>
                            {message.role === 'bot' && (
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                                </Avatar>
                            )}
                            <div className={cn("p-3 rounded-lg max-w-sm lg:max-w-md", message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                               <p className="whitespace-pre-wrap">{message.content}</p>
                            </div>
                            {message.role === 'user' && (
                               <Avatar className="h-8 w-8">
                                    <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))
                )}
                 {isLoading && (
                    <div className="flex items-start gap-3">
                         <Avatar className="h-8 w-8">
                            <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                        </Avatar>
                        <div className="p-3 rounded-lg bg-muted">
                           <Skeleton className="h-4 w-12" />
                        </div>
                    </div>
                )}
                </div>
            </ScrollArea>
             <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-4 border-t">
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., What is the primary diagnosis?"
                    disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !query.trim()}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    <span className="sr-only">Send</span>
                </Button>
            </form>
        </div>
      </CardContent>
    </Card>
  );
}
