
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useSecureArguments } from '@/hooks/useSecureArguments';
import { RealTimeArgumentAnalysis } from './RealTimeArgumentAnalysis';
import { useTranslation } from '@/utils/i18n';
import { Brain, CheckCircle, AlertTriangle, Target } from 'lucide-react';
import type { ArgumentAnalysis } from '@/types/analysis';

interface IntelligentArgumentFormProps {
  debateId: string;
  parentId?: string;
  onSuccess?: () => void;
}

export const IntelligentArgumentForm = ({ debateId, parentId, onSuccess }: IntelligentArgumentFormProps) => {
  const [argumentText, setArgumentText] = useState('');
  const [argumentType, setArgumentType] = useState<'Pro' | 'Contra'>('Pro');
  const [analysis, setAnalysis] = useState<ArgumentAnalysis | null>(null);
  const [qualityScore, setQualityScore] = useState<number>(0);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const { user } = useAuth();
  const { createArgument, creating } = useSecureArguments(debateId);
  const { toast } = useToast();
  const { language } = useTranslation();
  const text = (en: string, de: string) => (language === 'de' ? de : en);

  const handleAnalysisComplete = (analysisData: ArgumentAnalysis, score: number) => {
    setAnalysis(analysisData);
    setQualityScore(score);
    setShowAnalysis(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!argumentText.trim()) {
      toast({
        title: text('Error', 'Fehler'),
        description: text('Please enter an argument.', 'Bitte geben Sie ein Argument ein.'),
        variant: "destructive"
      });
      return;
    }

    if (argumentText.length < 20) {
      toast({
        title: text('Argument too short', 'Argument zu kurz'),
        description: text('Please expand your argument (at least 20 characters).', 'Bitte formulieren Sie Ihr Argument ausfuhrlicher (mindestens 20 Zeichen).'),
        variant: "destructive"
      });
      return;
    }

    // Quality gate: Don't allow submission of very poor arguments
    if (qualityScore > 0 && qualityScore < 30) {
      toast({
        title: text('Argument quality too low', 'Argumentqualitat zu niedrig'),
        description: text('Please revise your argument based on the AI suggestions before submitting.', 'Bitte uberarbeiten Sie Ihr Argument basierend auf den KI-Vorschlagen, bevor Sie es einreichen.'),
        variant: "destructive"
      });
      return;
    }

    const result = await createArgument(argumentText, argumentType, parentId);
    
    if (result) {
      setArgumentText('');
      setAnalysis(null);
      setQualityScore(0);
      setShowAnalysis(false);
      onSuccess?.();
      
      const qualityMessage = qualityScore >= 70 ? 
        text('Your high-quality argument was added!', 'Ihr hochwertiges Argument wurde hinzugefugt!') : 
        text('Your argument was added and will be analyzed.', 'Ihr Argument wurde hinzugefugt und wird analysiert.');
      
      toast({
        title: text('Argument added', 'Argument hinzugefugt'),
        description: qualityMessage,
      });
    }
  };

  const getSubmitButtonState = () => {
    if (creating) return { disabled: true, text: text('Creating...', 'Wird erstellt...'), variant: 'default' as const };
    if (argumentText.length < 20) return { disabled: true, text: text('At least 20 characters', 'Mindestens 20 Zeichen'), variant: 'outline' as const };
    if (qualityScore > 0 && qualityScore < 30) return { disabled: true, text: text('Quality too low', 'Qualitat zu niedrig'), variant: 'destructive' as const };
    if (qualityScore >= 70) return { disabled: false, text: text('✅ Submit high-quality argument', '✅ Hochwertiges Argument einreichen'), variant: 'default' as const };
    if (qualityScore >= 30) return { disabled: false, text: text('Submit argument', 'Argument einreichen'), variant: 'default' as const };
    return { disabled: false, text: text('Submit argument', 'Argument einreichen'), variant: 'default' as const };
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-muted-foreground">
            {text('Sign in to participate in this debate.', 'Melden Sie sich an, um an der Debatte teilzunehmen.')}
          </p>
        </CardContent>
      </Card>
    );
  }

  const submitButton = getSubmitButtonState();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <span>{text('Intelligent argument creation', 'Intelligente Argumenterstellung')}</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {text('AI-assisted', 'KI-unterstutzt')}
          </Badge>
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          {text('Your arguments are analyzed in real time for quality and relevance.', 'Ihre Argumente werden in Echtzeit auf Qualitat und Relevanz analysiert.')}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2 mb-3">
            <Button
              type="button"
              variant={argumentType === 'Pro' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setArgumentType('Pro')}
              className="flex-1"
            >
              {text('👍 Pro argument', '👍 Pro-Argument')}
            </Button>
            <Button
              type="button"
              variant={argumentType === 'Contra' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setArgumentType('Contra')}
              className="flex-1"
            >
              {text('👎 Contra argument', '👎 Contra-Argument')}
            </Button>
          </div>
          
          <Textarea
            value={argumentText}
            onChange={(e) => setArgumentText(e.target.value)}
            placeholder={text('Formulate your argument in detail and support it with evidence...', 'Formulieren Sie Ihr Argument ausfuhrlich und substantiiert...')}
            className="min-h-[120px]"
            maxLength={2000}
          />
          
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{argumentText.length}/2000 {text('characters (min. 20)', 'Zeichen (Min. 20)')}</span>
            {qualityScore > 0 && (
              <div className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                <span>{text('Quality', 'Qualitat')}: {qualityScore}%</span>
              </div>
            )}
          </div>

          {argumentText.length >= 20 && (
            <RealTimeArgumentAnalysis
              argumentText={argumentText}
              debateTitle={text('Current debate', 'Aktuelle Debatte')}
              debateDescription=""
              onAnalysisComplete={handleAnalysisComplete}
              autoAnalyze={true}
            />
          )}
          
          <Button 
            type="submit" 
            disabled={submitButton.disabled}
            variant={submitButton.variant}
            className="min-w-[200px]"
          >
            {submitButton.text}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
