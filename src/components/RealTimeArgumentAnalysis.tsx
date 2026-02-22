
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/utils/i18n';
import { Brain, CheckCircle, XCircle, AlertTriangle, Target, Search, MessageSquare } from 'lucide-react';
import type { ArgumentAnalysis } from '@/types/analysis';

interface RealTimeArgumentAnalysisProps {
  argumentText: string;
  debateTitle: string;
  debateDescription: string;
  onAnalysisComplete?: (analysis: ArgumentAnalysis, qualityScore: number) => void;
  autoAnalyze?: boolean;
}

export const RealTimeArgumentAnalysis = ({ 
  argumentText, 
  debateTitle, 
  debateDescription,
  onAnalysisComplete,
  autoAnalyze = false
}: RealTimeArgumentAnalysisProps) => {
  const [analysis, setAnalysis] = useState<ArgumentAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [qualityScore, setQualityScore] = useState<number>(0);
  const { language } = useTranslation();
  const text = (en: string, de: string) => (language === 'de' ? de : en);

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

  const calculateQualityScore = useCallback((analysisData: ArgumentAnalysis): number => {
    let score = 0;
    
    // Relevance (40% weight - most important)
    score += (analysisData.relevanz.score / 5) * 40;
    
    // Substantiation (25% weight)
    score += (
      analysisData.substantiierung.status === 'Vorhanden' ||
      analysisData.substantiierung.status === 'Present'
        ? 25
        : 0
    );
    
    // Specificity (20% weight)
    score += (
      analysisData.spezifitaet.status === 'Konkret' ||
      analysisData.spezifitaet.status === 'Concrete'
        ? 20
        : 0
    );
    
    // Logic (15% weight)
    score += (
      analysisData.fehlschluss.status === 'Keiner' ||
      analysisData.fehlschluss.status === 'None'
        ? 15
        : 0
    );
    
    return Math.round(score);
  }, []);

  const analyzeArgument = useCallback(async () => {
    if (!argumentText.trim() || argumentText.length < 20) return;
    
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
        const score = calculateQualityScore(data.analysis);
        setQualityScore(score);
        onAnalysisComplete?.(data.analysis, score);
      }
    } catch (error) {
      console.error('Error analyzing argument:', error);
    } finally {
      setLoading(false);
    }
  }, [argumentText, debateDescription, debateTitle, onAnalysisComplete, calculateQualityScore]);

  useEffect(() => {
    if (autoAnalyze && argumentText.length >= 20) {
      const debounceTimer = setTimeout(() => {
        analyzeArgument();
      }, 1500);
      
      return () => clearTimeout(debounceTimer);
    }
  }, [analyzeArgument, argumentText.length, autoAnalyze]);

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getQualityMessage = (score: number) => {
    if (score >= 80) return text('Excellent argument quality', 'Ausgezeichnete Argumentqualitat');
    if (score >= 60) return text('Solid argument quality', 'Solide Argumentqualitat');
    if (score >= 40) return text('Needs improvement', 'Verbesserungsbedarf');
    return text('Argument needs revision', 'Argument benotigt Uberarbeitung');
  };

  const getStatusIcon = (status: string, isLogic: boolean = false) => {
    if (isLogic) {
      return isNoFallacy(status) ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />;
    }
    return isPresent(status) || isConcrete(status)
      ? <CheckCircle className="h-4 w-4 text-green-600" /> 
      : <XCircle className="h-4 w-4 text-red-600" />;
  };

  if (!analysis && !autoAnalyze) {
    return (
      <Button 
        onClick={analyzeArgument} 
        disabled={loading || argumentText.length < 20}
        variant="outline" 
        size="sm"
        className="gap-2"
      >
        <Brain className="h-4 w-4" />
        {loading ? text('Analyzing...', 'Analysiere...') : text('Check argument quality', 'Argumentqualitat prufen')}
      </Button>
    );
  }

  if (loading) {
    return (
      <Card className="border-blue-200 bg-blue-50/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-blue-600 animate-pulse" />
            <span className="text-sm text-blue-700">{text('AI is analyzing your argument...', 'KI analysiert Ihr Argument...')}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) return null;

  return (
    <Card className={`border-2 ${getQualityColor(qualityScore)}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            <span className="font-semibold">{text('AI argument analysis', 'KI-Argumentanalyse')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`font-bold ${getQualityColor(qualityScore)}`}>
              {qualityScore}% {text('quality', 'Qualitat')}
            </Badge>
            <span className="text-xs font-medium">{getQualityMessage(qualityScore)}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">{text('Relevance', 'Relevanz')}:</span>
              <Badge variant="outline" className="text-xs">
                {analysis.relevanz.score}/5
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground pl-6">{analysis.relevanz.begruendung}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">{text('Evidence', 'Substantiierung')}:</span>
              {getStatusIcon(analysis.substantiierung.status)}
              <Badge variant="outline" className="text-xs">
                {formatStatus(analysis.substantiierung.status)}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground pl-6">{analysis.substantiierung.begruendung}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">{text('Specificity', 'Spezifitat')}:</span>
              {getStatusIcon(analysis.spezifitaet.status)}
              <Badge variant="outline" className="text-xs">
                {formatStatus(analysis.spezifitaet.status)}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground pl-6">{analysis.spezifitaet.begruendung}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">{text('Logic', 'Logik')}:</span>
              {getStatusIcon(analysis.fehlschluss.status, true)}
              <Badge variant="outline" className="text-xs">
                {formatStatus(analysis.fehlschluss.status)}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground pl-6">{analysis.fehlschluss.begruendung}</p>
          </div>
        </div>

        {qualityScore < 60 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">{text('Improvement suggestions:', 'Verbesserungsvorschlage:')}</span>
            </div>
            <ul className="text-xs text-yellow-700 space-y-1">
              {analysis.relevanz.score < 3 && <li>{text('• Connect your argument more directly to the debate topic.', '• Stellen Sie eine direktere Verbindung zum Debattenthema her.')}</li>}
              {!isPresent(analysis.substantiierung.status) && <li>{text('• Support your claims with evidence or examples.', '• Unterstutzen Sie Ihre Behauptungen mit Beweisen oder Beispielen.')}</li>}
              {!isConcrete(analysis.spezifitaet.status) && <li>{text('• Make your argument more concrete and specific.', '• Formulieren Sie Ihr Argument konkreter und spezifischer.')}</li>}
              {!isNoFallacy(analysis.fehlschluss.status) && <li>{text('• Recheck the logical structure of your argument.', '• Uberprufen Sie die logische Struktur Ihres Arguments.')}</li>}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
