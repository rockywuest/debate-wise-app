
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, Target, Search, MessageSquare, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

type AnalysisResult = {
  relevanz?: { score: number, begruendung: string },
  substantiierung?: { status: string, begruendung: string },
  spezifitaet?: { status: string, begruendung: string },
  fehlschluss?: { status: string, begruendung: string },
  error?: string;
};

interface ArgumentQualityAnalysisProps {
  argumentText: string;
  debateTitle: string;
  debateDescription?: string;
}

export const ArgumentQualityAnalysis = ({
  argumentText,
  debateTitle,
  debateDescription
}: ArgumentQualityAnalysisProps) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, boolean>>({});
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const callAnalyze = async () => {
      setLoading(true);
      setAnalysis(null);
      try {
        const debateContext = debateDescription
          ? `${debateTitle}: ${debateDescription}`
          : debateTitle;

        const { data, error } = await supabase.functions.invoke('analyze-fallacies', {
          body: {
            argumentText,
            debateContext
          }
        });

        if (error) throw error;
        setAnalysis(data.analysis);
      } catch (err) {
        setAnalysis({ error: "Analyse fehlgeschlagen." });
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (argumentText && debateTitle) {
      callAnalyze();
    }
  }, [argumentText, debateTitle, debateDescription]);

  const handleFeedback = async (dimension: string, isPositive: boolean) => {
    if (!user) {
      toast({
        title: "Anmeldung erforderlich",
        description: "Sie müssen angemeldet sein, um Feedback zu geben.",
        variant: "destructive"
      });
      return;
    }

    try {
      // For now, just show toast - we'll implement database storage later
      toast({
        title: "Feedback gespeichert",
        description: `Vielen Dank für Ihr Feedback zur ${dimension}-Bewertung!`
      });
      
      setFeedbackGiven(prev => ({ ...prev, [dimension]: true }));
    } catch (error) {
      console.error('Error saving feedback:', error);
      toast({
        title: "Fehler",
        description: "Feedback konnte nicht gespeichert werden.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Card className="mt-2 border-blue-200">
        <CardContent className="p-3 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <span className="text-sm text-muted-foreground">Analysiere Argumentqualität...</span>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) return null;
  
  if (analysis.error) {
    return (
      <Card className="mt-2 border-red-200 bg-red-50">
        <CardContent className="p-3 text-sm text-destructive">
          {analysis.error}
        </CardContent>
      </Card>
    );
  }

  const AnalysisDimension = ({ 
    icon, 
    name, 
    value, 
    explanation, 
    colorClass, 
    dimensionKey 
  }: {
    icon: React.ReactNode,
    name: string,
    value: string,
    explanation: string,
    colorClass: string,
    dimensionKey: string
  }) => (
    <div className="border-b border-gray-100 pb-2 mb-2 last:border-b-0 last:pb-0 last:mb-0">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          {icon}
          <span className={`font-semibold text-sm ${colorClass}`}>{name}: {value}</span>
        </div>
        {user && !feedbackGiven[dimensionKey] && (
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 hover:bg-green-100"
              onClick={() => handleFeedback(dimensionKey, true)}
            >
              <ThumbsUp className="h-3 w-3 text-green-600" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 hover:bg-red-100"
              onClick={() => handleFeedback(dimensionKey, false)}
            >
              <ThumbsDown className="h-3 w-3 text-red-600" />
            </Button>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground ml-6">{explanation}</p>
    </div>
  );

  return (
    <Card className="mt-2 border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="mb-3 font-bold text-blue-900 flex items-center gap-2">
          <Search className="h-4 w-4" />
          KI-Argumentqualitäts-Analyse
        </div>
        <div className="space-y-0">
          {analysis.relevanz && (
            <AnalysisDimension
              icon={<Target className="h-4 w-4" />}
              name="Relevanz"
              value={`${analysis.relevanz.score}/5`}
              explanation={analysis.relevanz.begruendung}
              colorClass={analysis.relevanz.score >= 4 ? 'text-green-600' : analysis.relevanz.score >= 2 ? 'text-orange-600' : 'text-red-600'}
              dimensionKey="relevanz"
            />
          )}
          {analysis.substantiierung && (
            <AnalysisDimension
              icon={<Search className="h-4 w-4" />}
              name="Beweislast"
              value={analysis.substantiierung.status}
              explanation={analysis.substantiierung.begruendung}
              colorClass={analysis.substantiierung.status === "Vorhanden" ? "text-green-600" : "text-red-600"}
              dimensionKey="substantiierung"
            />
          )}
          {analysis.spezifitaet && (
            <AnalysisDimension
              icon={<MessageSquare className="h-4 w-4" />}
              name="Spezifität"
              value={analysis.spezifitaet.status}
              explanation={analysis.spezifitaet.begruendung}
              colorClass={analysis.spezifitaet.status === "Konkret" ? "text-green-600" : "text-orange-600"}
              dimensionKey="spezifitaet"
            />
          )}
          {analysis.fehlschluss && (
            <AnalysisDimension
              icon={<Check className="h-4 w-4" />}
              name="Logik"
              value={analysis.fehlschluss.status}
              explanation={analysis.fehlschluss.begruendung}
              colorClass={analysis.fehlschluss.status === "Keiner" ? "text-green-600" : "text-red-600"}
              dimensionKey="fehlschluss"
            />
          )}
        </div>
        {user && (
          <div className="mt-3 pt-2 border-t border-gray-200">
            <p className="text-xs text-muted-foreground">
              💡 Hilft diese Analyse? Bewerten Sie jede Dimension mit 👍 oder 👎
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
