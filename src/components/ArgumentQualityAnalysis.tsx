
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Brain, ThumbsUp, ThumbsDown, AlertCircle, CheckCircle, XCircle, Star } from 'lucide-react';
import { useLocalizedText } from '@/utils/i18n';
import type { ArgumentAnalysis } from '@/types/analysis';

interface ArgumentQualityAnalysisProps {
  argumentText: string;
  debateTitle: string;
  debateDescription: string;
  onAnalysisComplete?: (analysis: ArgumentAnalysis) => void;
}

export const ArgumentQualityAnalysis = ({ 
  argumentText, 
  debateTitle, 
  debateDescription,
  onAnalysisComplete 
}: ArgumentQualityAnalysisProps) => {
  const [analysis, setAnalysis] = useState<ArgumentAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [userFeedback, setUserFeedback] = useState<'helpful' | 'not_helpful' | null>(null);
  const text = useLocalizedText();

  const isPresent = (status: string) => status === 'Vorhanden' || status === 'Present';
  const isConcrete = (status: string) => status === 'Konkret' || status === 'Concrete';
  const isNoFallacy = (status: string) => status === 'Keiner' || status === 'None';

  const formatStatus = (status: string) => {
    if (isPresent(status)) return text('Present', 'Vorhanden');
    if (status === 'Nicht vorhanden' || status === 'Absent') return text('Absent', 'Nicht vorhanden');
    if (isConcrete(status)) return text('Concrete', 'Konkret');
    if (status === 'Vage' || status === 'Vague') return text('Vague', 'Vage');
    if (isNoFallacy(status)) return text('None', 'Keiner');
    return status;
  };

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
    
    // TODO: Persist analysis feedback.
    console.log('User feedback:', feedback, 'for analysis:', analysis);
  };

  const getRelevanzColor = (score: number) => {
    if (score >= 4) return 'bg-green-100 text-green-800';
    if (score >= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusColor = (status: string, isPositive: boolean = true) => {
    if (isPositive) {
      return isPresent(status) || isConcrete(status) || isNoFallacy(status)
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800';
    } else {
      return isNoFallacy(status)
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800';
    }
  };

  const getStatusIcon = (status: string, isLogic: boolean = false) => {
    if (isLogic) {
      return isNoFallacy(status) ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />;
    }
    return isPresent(status) || isConcrete(status)
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
          {loading ? text('Analyzing...', 'Analysiere...') : text('Start AI quality analysis', 'KI-Qualitatsanalyse starten')}
        </Button>
      )}

      {analysis && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Brain className="h-4 w-4 text-blue-600" />
                {text('Multidimensional argument analysis', 'Mehrdimensionale Argument-Analyse')}
              </h4>
              <div className="flex items-center gap-2">
                <Star className="h-3 w-3 text-yellow-500" />
                <span className="text-xs text-muted-foreground">{text('AI evaluated', 'KI-bewertet')}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Relevanz */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">{text('Relevance', 'Relevanz')}:</span>
                  <Badge className={`${getRelevanzColor(analysis.relevanz.score)} text-xs flex items-center gap-1`}>
                    {analysis.relevanz.score}/5
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{analysis.relevanz.begruendung}</p>
              </div>

              {/* Substantiierung */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">{text('Evidence', 'Substantiierung')}:</span>
                  <Badge className={`${getStatusColor(analysis.substantiierung.status)} text-xs flex items-center gap-1`}>
                    {getStatusIcon(analysis.substantiierung.status)}
                    {formatStatus(analysis.substantiierung.status)}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{analysis.substantiierung.begruendung}</p>
              </div>

              {/* Spezifität */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">{text('Specificity', 'Spezifitat')}:</span>
                  <Badge className={`${getStatusColor(analysis.spezifitaet.status)} text-xs flex items-center gap-1`}>
                    {getStatusIcon(analysis.spezifitaet.status)}
                    {formatStatus(analysis.spezifitaet.status)}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{analysis.spezifitaet.begruendung}</p>
              </div>

              {/* Logik */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">{text('Logic', 'Logik')}:</span>
                  <Badge className={`${getStatusColor(analysis.fehlschluss.status, false)} text-xs flex items-center gap-1`}>
                    {getStatusIcon(analysis.fehlschluss.status, true)}
                    {formatStatus(analysis.fehlschluss.status)}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{analysis.fehlschluss.begruendung}</p>
              </div>
            </div>

            {/* Feedback-Mechanismus */}
            <div className="mt-4 pt-3 border-t border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{text('Was this analysis helpful?', 'War diese Analyse hilfreich?')}</span>
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
