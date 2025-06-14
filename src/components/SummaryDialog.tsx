
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

  const handleSummarize = async () => {
    if (childArguments.length === 0) {
      toast({
        title: "Keine Unterargumente",
        description: "Es gibt keine Unterargumente zu diesem Thema zum Zusammenfassen.",
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
    } catch (error: any) {
      console.error('Error summarizing thread:', error);
      toast({
        title: "Fehler bei der Zusammenfassung",
        description: "Die KI-Zusammenfassung konnte nicht erstellt werden. Bitte versuchen Sie es erneut.",
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
          Thread zusammenfassen
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>KI-Zusammenfassung des Argument-Threads</DialogTitle>
          <DialogDescription>
            Eine neutrale Zusammenfassung der verschiedenen Argumente zu diesem Thema.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Hauptargument:</h4>
            <p className="text-sm text-muted-foreground mb-4">{parentArgument}</p>
            
            <h4 className="font-semibold mb-2">KI-Zusammenfassung:</h4>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap">{summary}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={() => setIsOpen(false)}>
            Schließen
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
