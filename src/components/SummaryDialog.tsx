
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/utils/i18n';

interface SummaryDialogProps {
  parentArgument: string;
  childArguments: string[];
  disabled?: boolean;
}

export const SummaryDialog = ({ parentArgument, childArguments, disabled }: SummaryDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { language } = useTranslation();
  const text = (en: string, de: string) => (language === 'de' ? de : en);

  const handleSummarize = async () => {
    if (childArguments.length === 0) {
      toast({
        title: text('No sub-arguments', 'Keine Unterargumente'),
        description: text('There are no sub-arguments to summarize for this topic.', 'Es gibt keine Unterargumente zu diesem Thema zum Zusammenfassen.'),
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('summarize-thread', {
        body: {
          parentArgument,
          childArguments
        }
      });

      if (error) {
        throw error;
      }

      setSummary(data.summary);
      setIsOpen(true);
    } catch (error: unknown) {
      console.error('Error summarizing thread:', error);
      toast({
        title: text('Summary failed', 'Fehler bei der Zusammenfassung'),
        description: text('The AI summary could not be created. Please try again.', 'Die KI-Zusammenfassung konnte nicht erstellt werden. Bitte versuchen Sie es erneut.'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSummarize}
          disabled={disabled || isLoading || childArguments.length === 0}
          className="gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
          {text('Summarize thread', 'Thread zusammenfassen')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{text('AI summary of the argument thread', 'KI-Zusammenfassung des Argument-Threads')}</DialogTitle>
          <DialogDescription>
            {text('A neutral summary of the different arguments for this topic.', 'Eine neutrale Zusammenfassung der verschiedenen Argumente zu diesem Thema.')}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">{text('Main argument:', 'Hauptargument:')}</h4>
            <p className="text-sm text-muted-foreground mb-4">{parentArgument}</p>
            
            <h4 className="font-semibold mb-2">{text('AI summary:', 'KI-Zusammenfassung:')}</h4>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap">{summary}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={() => setIsOpen(false)}>
            {text('Close', 'Schliessen')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
