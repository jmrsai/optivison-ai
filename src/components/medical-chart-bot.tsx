'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bot, Loader2, Send, User } from 'lucide-react';
import type { Patient, Scan } from '@/lib/types';
import type { ChatMessage } from '@/ai/types';
import { useToast } from '@/hooks/use-toast';
import { medicalChartBotStream } from '@/ai/flows/medical-chart-bot';
import { runFlow } from '@genkit-ai/next/client';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';
import { decrypt } from '@/lib/crypto';
import { Sparkles } from 'lucide-react';

type MedicalChartBotProps = {
  patient: Patient;
  scans: Scan[];
};


export function MedicalChartBot({ patient, scans }: MedicalChartBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [decryptedHistory, setDecryptedHistory] = useState<string | null>(null);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);
  
  useEffect(() => {
    decrypt(patient.history).then(setDecryptedHistory);
  }, [patient.history]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading || decryptedHistory === null) return;

    const userMessage: ChatMessage = { role: 'user', content: query };
    const newMessages: ChatMessage[] = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);
    setQuery('');

    // Add a placeholder for the bot's response
    setMessages(prev => [...prev, { role: 'model', content: '' }]);

    try {
        const latestScan = scans[0];
        const historicalScans = scans.slice(1);
        
        const stream = await runFlow(medicalChartBotStream, {
            patient: {
                id: patient.id,
                name: patient.name,
                age: patient.age,
                gender: patient.gender,
                history: decryptedHistory,
            },
            latestScan: {
                analysis: latestScan.analysis!,
            },
            historicalScans: historicalScans.map(s => ({
                date: s.date,
                analysis: s.analysis!,
            })),
            query,
            history: newMessages, // Send the conversation history
        });

        for await (const chunk of stream) {
            setMessages(prev => {
                const updatedMessages = [...prev];
                const lastMessage = updatedMessages[updatedMessages.length - 1];
                if (lastMessage.role === 'model') {
                    lastMessage.content += chunk;
                }
                return updatedMessages;
            });
        }

    } catch (error) {
        console.error("Chart bot error:", error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not get a response from the AI assistant.',
        });
        // Remove the user's message and the bot placeholder if it fails
        setMessages(prev => prev.slice(0, -2));
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Chart Assistant
        </CardTitle>
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
                            {message.role === 'model' && (
                                <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                                    <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                                </Avatar>
                            )}
                            <div className={cn("p-3 rounded-lg max-w-sm lg:max-w-md", 
                                message.role === 'user' ? 'bg-muted' : 'bg-primary/10',
                                message.role === 'model' && message.content === '' && 'p-0' // Hide empty bot message before streaming starts
                                )}>
                               {message.content ? (
                                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                               ) : (
                                <div className="flex items-center gap-2 p-3">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                               )}
                            </div>
                            {message.role === 'user' && (
                               <Avatar className="h-8 w-8">
                                    <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))
                )}
                </div>
            </ScrollArea>
             <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-4 border-t">
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., What is the primary diagnosis?"
                    disabled={isLoading || decryptedHistory === null}
                />
                <Button type="submit" disabled={isLoading || !query.trim() || decryptedHistory === null}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    <span className="sr-only">Send</span>
                </Button>
            </form>
        </div>
      </CardContent>
    </Card>
  );
}
