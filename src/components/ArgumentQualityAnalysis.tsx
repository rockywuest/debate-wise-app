
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Brain, ThumbsUp, ThumbsDown, AlertCircle, CheckCircle, XCircle, Star } from 'lucide-react';

interface ArgumentQualityAnalysisProps {
  argumentText: string;
  debateTitle: string;
  debateDescription: string;
  onAnalysisComplete?: (analysis: any) => void;
}

interface AnalysisResult {
  relevanz: { score: number; begruendung: string };
  substantiierung: { status: string; begruendung: string };
  spezifitaet: { status: string; begruendung: string };
  fehlschluss: { status: string; begruendung: string };
}

export const ArgumentQualityAnalysis = ({ 
  argumentText, 
  debateTitle, 
  debateDescription,
  onAnalysisComplete 
}: ArgumentQualityAnalysisProps) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [userFeedback, setUserFeedback] = useState<'helpful' | 'not_helpful' | null>(null);

  const analyzeArgument = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-fallacies', {
        body: {
          argumentText,
          debateContext: `${debateTitle}: ${debateDescription}`
        }
      });

      if (error) throw error;

      if (data?.analysis) {
        setAnalysis(data.analysis);
        onAnalysisComplete?.(data.analysis);
      }
    } catch (error) {
      console.error('Error analyzing argument:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async (feedback: 'helpful' | 'not_helpful') => {
    setUserFeedback(feedback);
    
    // Hier könnten wir das Feedback in einer Datenbank speichern
    console.log('User feedback:', feedback, 'for analysis:', analysis);
  };

  const getRelevanzColor = (score: number) => {
    if (score >= 4) return 'bg-green-100 text-green-800';
    if (score >= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusColor = (status: string, isPositive: boolean = true) => {
    if (isPositive) {
      return status === 'Vorhanden' || status === 'Konkret' || status === 'Keiner' 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800';
    } else {
      return status === 'Keiner' 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800';
    }
  };

  const getStatusIcon = (status: string, isLogic: boolean = false) => {
    if (isLogic) {
      return status === 'Keiner' ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />;
    }
    return status === 'Vorhanden' || status === 'Konkret' 
      ? <CheckCircle className="h-3 w-3" /> 
      : <XCircle className="h-3 w-3" />;
  };

  return (
    <div className="space-y-3">
      {!analysis && (
        <Button 
          onClick={analyzeArgument} 
          disabled={loading}
          variant="outline" 
          size="sm"
          className="gap-2"
        >
          <Brain className="h-4 w-4" />
          {loading ? 'Analysiere...' : 'KI-Qualitätsanalyse starten'}
        </Button>
      )}

      {analysis && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Brain className="h-4 w-4 text-blue-600" />
                Mehrdimensionale Argument-Analyse
              </h4>
              <div className="flex items-center gap-2">
                <Star className="h-3 w-3 text-yellow-500" />
                <span className="text-xs text-muted-foreground">KI-bewertet</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Relevanz */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">Relevanz:</span>
                  <Badge className={`${getRelevanzColor(analysis.relevanz.score)} text-xs flex items-center gap-1`}>
                    {analysis.relevanz.score}/5
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{analysis.relevanz.begruendung}</p>
              </div>

              {/* Substantiierung */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">Substantiierung:</span>
                  <Badge className={`${getStatusColor(analysis.substantiierung.status)} text-xs flex items-center gap-1`}>
                    {getStatusIcon(analysis.substantiierung.status)}
                    {analysis.substantiierung.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{analysis.substantiierung.begruendung}</p>
              </div>

              {/* Spezifität */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">Spezifität:</span>
                  <Badge className={`${getStatusColor(analysis.spezifitaet.status)} text-xs flex items-center gap-1`}>
                    {getStatusIcon(analysis.spezifitaet.status)}
                    {analysis.spezifitaet.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{analysis.spezifitaet.begruendung}</p>
              </div>

              {/* Logik */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">Logik:</span>
                  <Badge className={`${getStatusColor(analysis.fehlschluss.status, false)} text-xs flex items-center gap-1`}>
                    {getStatusIcon(analysis.fehlschluss.status, true)}
                    {analysis.fehlschluss.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{analysis.fehlschluss.begruendung}</p>
              </div>
            </div>

            {/* Feedback-Mechanismus */}
            <div className="mt-4 pt-3 border-t border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">War diese Analyse hilfreich?</span>
                <div className="flex gap-1">
                  <Button
                    variant={userFeedback === 'helpful' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => submitFeedback('helpful')}
                    className="h-6 w-6 p-0"
                  >
                    <ThumbsUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant={userFeedback === 'not_helpful' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => submitFeedback('not_helpful')}
                    className="h-6 w-6 p-0"
                  >
                    <ThumbsDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
